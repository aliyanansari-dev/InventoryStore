"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Receipt,
  Search,
  Printer,
  ChevronRight,
  Clock,
  User,
  ShoppingBag,
  CreditCard,
  Banknote,
  QrCode,
} from "lucide-react";

interface SalesTableProps {
  orders: any[];
}

export function SalesTable({ orders }: SalesTableProps) {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      order.orderNumber?.toLowerCase().includes(q) ||
      order.cashierId?.name?.toLowerCase().includes(q) ||
      order.paymentMethod?.toLowerCase().includes(q)
    );
  });

  const handlePrintDrawerReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex items-center justify-between gap-4 bg-[#131B2E] p-4 rounded-xl border border-white/[0.08]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders by Order # or Cashier Name..."
            className="pl-10 h-10 bg-[#0A0F1C] border-white/10"
          />
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Showing {filteredOrders.length} of {orders.length} transactions
        </p>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#131B2E] overflow-hidden shadow-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Cashier Name</TableHead>
              <TableHead>Items Count</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-44 text-center text-slate-500">
                  <Receipt className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No sales orders found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const totalItems =
                  order.items?.reduce(
                    (sum: number, item: any) => sum + (item.quantity || 1),
                    0
                  ) || 0;

                return (
                  <TableRow
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className="cursor-pointer hover:bg-white/[0.03] transition-colors group"
                  >
                    <TableCell className="font-mono font-semibold text-white text-xs">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">
                      {formatDateTime(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-slate-200">
                      {order.cashierId?.name || "Cashier"}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/[0.04] text-slate-300">
                        {totalItems} items
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-mono uppercase text-slate-400">
                        {order.paymentMethod || "cash"}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-sm text-emerald-400">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <button className="inline-flex items-center gap-1 text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">
                        <span>Details</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Clickable Row Side-Drawer (Sheet) */}
      <Sheet open={Boolean(selectedOrder)} onOpenChange={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <Badge variant="success">Completed Order</Badge>
                <span className="font-mono text-xs text-slate-400">
                  {selectedOrder.paymentMethod?.toUpperCase() || "CASH"}
                </span>
              </div>
              <SheetTitle className="font-mono text-xl mt-2">
                {selectedOrder.orderNumber}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2 text-xs">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{formatDateTime(selectedOrder.createdAt)}</span>
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6 flex-1">
              {/* Cashier Info */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Processed By</p>
                    <p className="text-sm font-semibold text-white">
                      {selectedOrder.cashierId?.name || "Staff Cashier"}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                  {selectedOrder.cashierId?.role || "Staff"}
                </Badge>
              </div>

              {/* Order Items Breakdown */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Purchased Items (
                  {selectedOrder.items?.reduce(
                    (s: number, i: any) => s + (i.quantity || 1),
                    0
                  )}
                  )
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400">
                          {item.sku} • {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-200">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Financials */}
              <div className="p-4 rounded-xl bg-[#0A0F1C] border border-white/[0.08] space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-200">
                    {formatCurrency(selectedOrder.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax (5% Sales Tax)</span>
                  <span className="font-mono text-slate-200">
                    {formatCurrency(selectedOrder.tax)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-white/[0.08]">
                  <span className="text-sm font-bold text-white">Total Paid</span>
                  <span className="text-xl font-black font-mono text-emerald-400">
                    {formatCurrency(selectedOrder.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Print Receipt Action in Side-Drawer */}
            <div className="pt-4 border-t border-white/[0.08] mt-6">
              <Button
                onClick={handlePrintDrawerReceipt}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2"
              >
                <Printer className="h-4 w-4" />
                <span>Print Transaction Receipt</span>
              </Button>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  );
}
