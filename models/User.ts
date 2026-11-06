import mongoose, { Schema, Document, Model } from "mongoose";
import { MockUserModel } from "@/lib/in-memory-store";

export type UserRole = "admin" | "cashier";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    role: {
      type: String,
      enum: ["admin", "cashier"],
      default: "cashier",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MongooseUser: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

const User: Model<IUser> = new Proxy(MongooseUser, {
  get(target, prop, receiver) {
    if (mongoose.connection.readyState !== 1 && prop in MockUserModel) {
      return (MockUserModel as any)[prop];
    }
    return Reflect.get(target, prop, receiver);
  },
}) as any;

export default User;
