"use server";

import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    await connectToDatabase();
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(categories)),
    };
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return { success: false, error: error.message || "Failed to fetch categories" };
  }
}

export async function createCategory(data: { name: string; description?: string }) {
  try {
    await connectToDatabase();
    const existing = await Category.findOne({ name: data.name.trim() });
    if (existing) {
      return { success: false, error: "A category with this name already exists." };
    }

    const category = await Category.create({
      name: data.name.trim(),
      description: data.description?.trim() || "",
    });

    revalidatePath("/inventory");
    revalidatePath("/pos");
    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error: any) {
    console.error("Error creating category:", error);
    return { success: false, error: error.message || "Failed to create category" };
  }
}
