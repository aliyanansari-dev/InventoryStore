import React from "react";
import { getProducts } from "@/lib/actions/product";
import { getCategories } from "@/lib/actions/category";
import { Header } from "@/components/shared/header";
import { PosInterface } from "@/components/pos/pos-interface";

export const dynamic = "force-dynamic";

export default async function PosPage() {
  const [productsRes, categoriesRes] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const products = productsRes.success ? productsRes.data : [];
  const categories = categoriesRes.success ? categoriesRes.data : [];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        title="POS Billing Terminal"
        description="Fast checkout • Barcode scan ready • Automated inventory deduction"
      />
      <div className="flex-1 overflow-hidden">
        <PosInterface initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}
