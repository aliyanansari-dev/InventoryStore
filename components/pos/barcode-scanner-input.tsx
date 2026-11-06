"use client";

import React, { useState } from "react";
import { ScanBarcode, Sparkles, CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface BarcodeScannerProps {
  onScan: (sku: string) => boolean | Promise<boolean>;
}

export function BarcodeScannerInput({ onScan }: BarcodeScannerProps) {
  const [skuInput, setSkuInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skuInput.trim()) return;

    setIsScanning(true);
    const trimmedSku = skuInput.trim().toUpperCase();

    try {
      const added = await onScan(trimmedSku);
      if (added) {
        setSkuInput("");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to scan SKU");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center pointer-events-none text-emerald-400">
          <ScanBarcode className="h-5 w-5 animate-pulse" />
        </div>
        <Input
          type="text"
          value={skuInput}
          onChange={(e) => setSkuInput(e.target.value)}
          placeholder="Scan barcode or type SKU (e.g., BEV-COCA-330) & press Enter..."
          className="pl-11 pr-24 h-12 bg-[#0d1424] border-white/10 text-white placeholder:text-slate-500 rounded-xl font-mono text-sm focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={!skuInput.trim() || isScanning}
          className="absolute right-2 px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-medium font-sans flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <span>Scan</span>
          <CornerDownLeft className="h-3 w-3" />
        </button>
      </div>
    </form>
  );
}
