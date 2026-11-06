import mongoose, { Schema, Document, Model } from "mongoose";
import { MockProductModel } from "@/lib/in-memory-store";

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  categoryId: mongoose.Types.ObjectId;
  price: number;
  costPrice: number;
  stock: number;
  image?: string;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU / Barcode is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category reference is required"],
    },
    price: {
      type: Number,
      required: [true, "Selling price is required"],
      min: [0, "Price must be non-negative"],
    },
    costPrice: {
      type: Number,
      required: [true, "Cost price is required"],
      min: [0, "Cost price must be non-negative"],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const MongooseProduct: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

const Product: Model<IProduct> = new Proxy(MongooseProduct, {
  get(target, prop, receiver) {
    if (mongoose.connection.readyState !== 1 && prop in MockProductModel) {
      return (MockProductModel as any)[prop];
    }
    return Reflect.get(target, prop, receiver);
  },
}) as any;

export default Product;
