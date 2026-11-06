"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  QrCode,
  Loader2,
  Receipt,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";

export interface CartItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  stock: number;
}

interface CartPanelProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: (paymentMethod: "cash" | "card" | "digital") => Promise<void>;
  isCheckingOut: boolean;
}

export function CartPanel({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  isCheckingOut,
}: CartPanelProps) {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "digital">("cash");

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% tax
  const grandTotal = subtotal + tax;
  const totalItemUnits = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckoutClick = async () => {
    if (items.length === 0 || isCheckingOut) return;
    await onCheckout(paymentMethod);
  };

  return (
    <div className="flex flex-col h-full bg-[#111827] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
      {/* Cart Top Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#131B2E]">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShoppingCart className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">Order Cart</h3>
            <p className="text-[11px] text-slate-400">
              {totalItemUnits} {totalItemUnits === 1 ? "unit" : "units"} in checkout
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClearCart}
            disabled={isCheckingOut}
            className="text-[11px] text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors disabled:opacity-50"
            title="Clear current cart"
          >
            <Trash2 className="h-3 w-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <ShoppingCart className="h-12 w-12 stroke-[1.5] mb-2 opacity-30" />
            <p className="text-sm font-medium text-slate-400">Cart is empty</p>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
              Click products on the left or scan a barcode to start billing
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.productId}
              className="p-3 rounded-xl bg-[#131B2E] border border-white/[0.05] hover:border-white/[0.1] transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-semibold text-white truncate">
                    {item.name}
                  </h5>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                    {item.sku} • {formatCurrency(item.price)} each
                  </p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.productId)}
                  className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                  title="Remove from cart"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Quantity Controls and Line Total */}
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.04]">
                <div className="flex items-center gap-1 bg-[#0A0F1C] rounded-lg p-0.5 border border-white/[0.06]">
                  <button
                    onClick={() => onUpdateQuantity(item.productId, -1)}
                    className="h-6 w-6 rounded flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center font-mono text-xs font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.productId, 1)}
                    disabled={item.quantity >= item.stock}
                    className="h-6 w-6 rounded flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <span className="font-mono font-bold text-xs text-emerald-400">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Payment Method Selector & Totals Breakdown */}
      <div className="p-4 bg-[#0e1627] border-t border-white/[0.08] space-y-3.5">
        {/* Payment Methods */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "cash", label: "Cash", icon: Banknote },
              { id: "card", label: "Card", icon: CreditCard },
              { id: "digital", label: "Digital", icon: QrCode },
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-xs font-medium transition-all",
                    isSelected
                      ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-sm"
                      : "bg-[#131B2E] border-white/[0.05] text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                  )}
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <span>{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span className="font-mono text-slate-200">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Tax (5% GST)</span>
            <span className="font-mono text-slate-200">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-white/[0.08]">
            <span className="text-sm font-bold text-white">Grand Total</span>
            <span className="text-xl font-black font-mono text-emerald-400">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={handleCheckoutClick}
          disabled={items.length === 0 || isCheckingOut}
          className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
        >
          {isCheckingOut ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing Sale...</span>
            </>
          ) : (
            <>
              <Receipt className="h-5 w-5" />
              <span>Complete Sale ({formatCurrency(grandTotal)})</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
