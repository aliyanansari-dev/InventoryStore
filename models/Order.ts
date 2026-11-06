import mongoose, { Schema, Document, Model } from "mongoose";
import { MockOrderModel } from "@/lib/in-memory-store";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name?: string;
  sku?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  cashierId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "cash" | "card" | "digital";
  status: "completed" | "refunded" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    sku: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    cashierId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [(val: IOrderItem[]) => val.length > 0, "Order must have at least one item"],
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "digital"],
      default: "cash",
    },
    status: {
      type: String,
      enum: ["completed", "refunded", "cancelled"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

const MongooseOrder: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

const Order: Model<IOrder> = new Proxy(MongooseOrder, {
  get(target, prop, receiver) {
    if (mongoose.connection.readyState !== 1 && prop in MockOrderModel) {
      return (MockOrderModel as any)[prop];
    }
    return Reflect.get(target, prop, receiver);
  },
}) as any;

export default Order;
