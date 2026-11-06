import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ArrowUpRight, ReceiptText } from "lucide-react";

interface RecentSalesTableProps {
  orders: any[];
}

export function RecentSalesTable({ orders }: RecentSalesTableProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        <ReceiptText className="h-8 w-8 mx-auto mb-2 opacity-40" />
        No recent transactions found. Complete a sale in POS to see it here!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Cashier</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const itemCount = order.items?.reduce(
              (acc: number, item: any) => acc + (item.quantity || 1),
              0
            ) || 0;

            return (
              <TableRow key={order._id} className="group">
                <TableCell className="font-mono text-xs font-semibold text-white">
                  {order.orderNumber}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-slate-300">
                    {order.cashierId?.name || "Cashier"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/[0.04] text-xs text-slate-300 font-mono">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </TableCell>
                <TableCell className="font-mono font-bold text-emerald-400">
                  {formatCurrency(order.total)}
                </TableCell>
                <TableCell className="text-xs text-slate-400">
                  {formatDateTime(order.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/sales?highlight=${order._id}`}
                    className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    View <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
