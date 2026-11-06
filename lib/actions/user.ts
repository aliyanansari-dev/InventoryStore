"use server";

import connectToDatabase from "@/lib/db";
import User, { UserRole } from "@/models/User";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  try {
    await connectToDatabase();
    const users = await User.find({}, "-passwordHash")
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(users)),
    };
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return { success: false, error: error.message || "Failed to fetch users" };
  }
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  try {
    await connectToDatabase();

    const existing = await User.findOne({ email: data.email.toLowerCase().trim() });
    if (existing) {
      return { success: false, error: "A user with this email address already exists." };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash,
      role: data.role,
    });

    revalidatePath("/users");

    return {
      success: true,
      data: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return { success: false, error: error.message || "Failed to create user" };
  }
}
