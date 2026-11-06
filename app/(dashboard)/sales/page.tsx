import React from "react";
import { getOrders } from "@/lib/actions/order";
import { Header } from "@/components/shared/header";
import { SalesTable } from "@/components/sales/sales-table";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  const res = await getOrders(100);
  const orders = res.success ? res.data : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Sales History & Audit Logs"
        description="Comprehensive log of all completed transactions and thermal receipts"
      />

      <div className="p-8">
        <SalesTable orders={orders} />
      </div>
    </div>
  );
}
