import React from "react";
import { getProducts } from "@/lib/actions/product";
import { getCategories } from "@/lib/actions/category";
import { Header } from "@/components/shared/header";
import { InventoryTable } from "@/components/inventory/inventory-table";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const [productsRes, categoriesRes] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const products = productsRes.success ? productsRes.data : [];
  const categories = categoriesRes.success ? categoriesRes.data : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Inventory & Stock Management"
        description="Monitor product catalogs, stock availability, pricing, and category assignments"
      />

      <div className="p-8">
        <InventoryTable initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}
