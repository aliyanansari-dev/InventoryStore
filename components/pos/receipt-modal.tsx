"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Printer, CheckCircle2, RotateCcw, ShoppingBag } from "lucide-react";

interface ReceiptModalProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
  onNewSale: () => void;
}

export function ReceiptModal({ order, isOpen, onClose, onNewSale }: ReceiptModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#111827] border-white/10 p-0 overflow-hidden text-slate-100">
        {/* Top Banner */}
        <div className="bg-emerald-600/20 border-b border-emerald-500/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-semibold text-sm">Payment Successful</span>
          </div>
          <span className="text-xs font-mono text-emerald-300">
            {order.paymentMethod?.toUpperCase() || "CASH"}
          </span>
        </div>

        {/* Printable Receipt Area */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          <div
            id="printable-receipt"
            className="bg-white text-black p-6 rounded-lg shadow-sm font-mono text-xs leading-relaxed space-y-4"
          >
            {/* Store Header */}
            <div className="text-center border-b border-dashed border-gray-300 pb-3">
              <h2 className="text-base font-black tracking-wider uppercase">MINI MART POS</h2>
              <p className="text-[11px] text-gray-600">Store #104 - 123 Market Street</p>
              <p className="text-[11px] text-gray-600">Tel: +1 (800) 555-0199</p>
            </div>

            {/* Order Metadata */}
            <div className="text-[11px] space-y-0.5 border-b border-dashed border-gray-300 pb-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Receipt No:</span>
                <span className="font-bold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span>{formatDateTime(order.createdAt || new Date())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cashier:</span>
                <span>{order.cashierId?.name || "Staff Cashier"}</span>
              </div>
            </div>

            {/* Line Items */}
            <div className="border-b border-dashed border-gray-300 pb-3">
              <div className="grid grid-cols-12 font-bold pb-1 text-gray-700">
                <span className="col-span-6">Item</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-2 text-right">Price</span>
                <span className="col-span-2 text-right">Total</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="grid grid-cols-12 text-[11px]">
                    <span className="col-span-6 truncate font-medium">{item.name}</span>
                    <span className="col-span-2 text-center">{item.quantity}</span>
                    <span className="col-span-2 text-right font-sans">
                      ${item.price?.toFixed(2)}
                    </span>
                    <span className="col-span-2 text-right font-sans font-semibold">
                      ${item.total?.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-1 text-xs border-b border-dashed border-gray-300 pb-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-sans font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (5% GST/Sales)</span>
                <span className="font-sans font-medium">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-1 border-t border-gray-200">
                <span>TOTAL</span>
                <span className="font-sans font-black">{formatCurrency(order.total)}</span>
              </div>
            </div>

            {/* Footer Thank You message */}
            <div className="text-center pt-1 text-[11px] text-gray-500 space-y-1">
              <p className="font-bold text-gray-800">THANK YOU FOR SHOPPING WITH US!</p>
              <p>Please keep this receipt for returns within 14 days.</p>
              <div className="pt-2 text-[9px] tracking-widest text-gray-400">
                *** {order.orderNumber} ***
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#0d1424] border-t border-white/10 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onNewSale}
            className="flex-1 flex items-center justify-center gap-2 border-white/10 hover:bg-white/5 text-slate-300"
          >
            <RotateCcw className="h-4 w-4" />
            <span>New Sale</span>
          </Button>

          <Button
            type="button"
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
          >
            <Printer className="h-4 w-4" />
            <span>Print Receipt</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
