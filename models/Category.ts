import mongoose, { Schema, Document, Model } from "mongoose";
import { MockCategoryModel } from "@/lib/in-memory-store";

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const MongooseCategory: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

const Category: Model<ICategory> = new Proxy(MongooseCategory, {
  get(target, prop, receiver) {
    if (mongoose.connection.readyState !== 1 && prop in MockCategoryModel) {
      return (MockCategoryModel as any)[prop];
    }
    return Reflect.get(target, prop, receiver);
  },
}) as any;

export default Category;
