"use server";

import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { generateOrderNumber } from "@/lib/utils";

export interface CheckoutItemInput {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

export interface CheckoutInput {
  cashierId: string;
  items: CheckoutItemInput[];
  paymentMethod?: "cash" | "card" | "digital";
}

export async function createOrder(input: CheckoutInput) {
  try {
    await connectToDatabase();

    if (!input.items || input.items.length === 0) {
      return { success: false, error: "Cart is empty." };
    }

    // Step 1: Verify all products and check stock availability
    for (const item of input.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return { success: false, error: `Product "${item.name}" was not found.` };
      }
      if (product.stock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}.`,
        };
      }
    }

    // Step 2: Calculate financials with 5% tax rate
    let subtotal = 0;
    const orderItems = input.items.map((item) => {
      const itemTotal = Math.round(item.price * item.quantity * 100) / 100;
      subtotal += itemTotal;
      return {
        productId: item.productId,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        total: itemTotal,
      };
    });

    subtotal = Math.round(subtotal * 100) / 100;
    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
    const total = Math.round((subtotal + tax) * 100) / 100;

    // Step 3: Deduct stock automatically for each product
    for (const item of input.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Step 4: Create the Order
    const orderNumber = generateOrderNumber();
    const order = await Order.create({
      orderNumber,
      cashierId: input.cashierId,
      items: orderItems,
      subtotal,
      tax,
      total,
      paymentMethod: input.paymentMethod || "cash",
      status: "completed",
    });

    // Populate cashier information for immediate receipt generation
    const populatedOrder = await Order.findById(order._id)
      .populate("cashierId", "name email")
      .lean();

    revalidatePath("/inventory");
    revalidatePath("/pos");
    revalidatePath("/sales");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(populatedOrder)),
    };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message || "Failed to process order" };
  }
}

export async function getOrders(limit: number = 50) {
  try {
    await connectToDatabase();
    void User;

    const orders = await Order.find({})
      .populate("cashierId", "name email role")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(orders)),
    };
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return { success: false, error: error.message || "Failed to fetch orders" };
  }
}

export async function getOrderById(orderId: string) {
  try {
    await connectToDatabase();
    void User;
    void Product;

    const order = await Order.findById(orderId)
      .populate("cashierId", "name email role")
      .populate("items.productId", "name sku image price")
      .lean();

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(order)),
    };
  } catch (error: any) {
    console.error("Error fetching order by ID:", error);
    return { success: false, error: error.message || "Failed to fetch order details" };
  }
}
