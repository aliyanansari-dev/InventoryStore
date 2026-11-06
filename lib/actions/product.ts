"use server";

import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";

export interface ProductFormData {
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  costPrice: number;
  stock: number;
  image?: string;
  lowStockThreshold?: number;
}

export async function getProducts(filter?: {
  search?: string;
  categoryId?: string;
  lowStockOnly?: boolean;
}) {
  try {
    await connectToDatabase();
    // Ensure Category model is registered
    void Category;

    const query: any = {};

    if (filter?.search) {
      const regex = new RegExp(filter.search.trim(), "i");
      query.$or = [{ name: regex }, { sku: regex }];
    }

    if (filter?.categoryId && filter.categoryId !== "all") {
      query.categoryId = filter.categoryId;
    }

    if (filter?.lowStockOnly) {
      query.$expr = { $lte: ["$stock", "$lowStockThreshold"] };
    }

    const products = await Product.find(query)
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(products)),
    };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return { success: false, error: error.message || "Failed to fetch products" };
  }
}

export async function findProductBySku(sku: string) {
  try {
    await connectToDatabase();
    void Category;
    const cleanSku = sku.trim().toUpperCase();
    const product = await Product.findOne({
      sku: { $regex: new RegExp(`^${cleanSku}$`, "i") },
    })
      .populate("categoryId", "name")
      .lean();

    if (!product) {
      return { success: false, error: "Product not found with this SKU/Barcode." };
    }

    return { success: true, data: JSON.parse(JSON.stringify(product)) };
  } catch (error: any) {
    console.error("Error finding product by SKU:", error);
    return { success: false, error: error.message || "Error querying product" };
  }
}

export async function createProduct(data: ProductFormData) {
  try {
    await connectToDatabase();

    const existingSku = await Product.findOne({ sku: data.sku.trim().toUpperCase() });
    if (existingSku) {
      return { success: false, error: `SKU "${data.sku.toUpperCase()}" is already in use.` };
    }

    const product = await Product.create({
      name: data.name.trim(),
      sku: data.sku.trim().toUpperCase(),
      categoryId: data.categoryId,
      price: Number(data.price),
      costPrice: Number(data.costPrice),
      stock: Number(data.stock),
      image: data.image?.trim() || "",
      lowStockThreshold: data.lowStockThreshold ? Number(data.lowStockThreshold) : 10,
    });

    revalidatePath("/inventory");
    revalidatePath("/pos");
    revalidatePath("/dashboard");

    return { success: true, data: JSON.parse(JSON.stringify(product)) };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message || "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: ProductFormData) {
  try {
    await connectToDatabase();

    const existingSku = await Product.findOne({
      sku: data.sku.trim().toUpperCase(),
      _id: { $ne: id },
    });

    if (existingSku) {
      return { success: false, error: `SKU "${data.sku.toUpperCase()}" is already used by another item.` };
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name: data.name.trim(),
        sku: data.sku.trim().toUpperCase(),
        categoryId: data.categoryId,
        price: Number(data.price),
        costPrice: Number(data.costPrice),
        stock: Number(data.stock),
        image: data.image?.trim() || "",
        lowStockThreshold: data.lowStockThreshold ? Number(data.lowStockThreshold) : 10,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return { success: false, error: "Product not found" };
    }

    revalidatePath("/inventory");
    revalidatePath("/pos");
    revalidatePath("/dashboard");

    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message || "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await connectToDatabase();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, error: "Product not found" };
    }

    revalidatePath("/inventory");
    revalidatePath("/pos");
    revalidatePath("/dashboard");

    return { success: true, message: "Product deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message || "Failed to delete product" };
  }
}
