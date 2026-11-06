"use client";

import React, { useState, useMemo } from "react";
import { Search, PackageOpen, Plus, AlertCircle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  sku: string;
  categoryId?: {
    _id: string;
    name: string;
  } | string;
  price: number;
  costPrice: number;
  stock: number;
  image?: string;
  lowStockThreshold?: number;
}

interface Category {
  _id: string;
  name: string;
}

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, categories, onAddToCart }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      const productCatId =
        typeof product.categoryId === "object"
          ? product.categoryId?._id
          : product.categoryId;

      const matchesCat =
        selectedCategory === "all" || productCatId === selectedCategory;

      // Search filter
      const matchesSearch =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Search & Category Filter Toolbar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name or SKU..."
            className="pl-10 h-11 bg-[#131B2E] border-white/10 text-white placeholder:text-slate-500 rounded-xl"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150",
              selectedCategory === "all"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.05]"
            )}
          >
            All Items ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter(
              (p) =>
                (typeof p.categoryId === "object"
                  ? p.categoryId?._id
                  : p.categoryId) === cat._id
            ).length;

            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150",
                  selectedCategory === cat._id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.05]"
                )}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredProducts.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <PackageOpen className="h-10 w-10 text-slate-500 mb-2" />
            <p className="text-slate-300 font-medium text-sm">No items match your criteria</p>
            <p className="text-slate-500 text-xs mt-1">Try resetting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 10);

              return (
                <div
                  key={product._id}
                  onClick={() => !isOutOfStock && onAddToCart(product)}
                  className={cn(
                    "group relative flex flex-col justify-between p-3.5 rounded-xl border transition-all duration-200 select-none",
                    isOutOfStock
                      ? "opacity-50 cursor-not-allowed bg-[#131B2E]/50 border-white/[0.04]"
                      : "cursor-pointer bg-[#131B2E] border-white/[0.08] hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-950/20 hover:translate-y-[-2px] active:scale-[0.98]"
                  )}
                >
                  <div>
                    {/* Top image or placeholder */}
                    <div className="relative aspect-video w-full rounded-lg bg-[#0A0F1C] overflow-hidden mb-2.5 border border-white/[0.05]">
                      {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            // Fallback on image load error
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <PackageOpen className="h-6 w-6" />
                        </div>
                      )}

                      {/* Stock Pill overlay */}
                      <div className="absolute top-1.5 right-1.5">
                        {isOutOfStock ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-950/80 text-red-400 border border-red-700/50">
                            Out
                          </span>
                        ) : isLowStock ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-900/60 text-red-300 border border-red-500/40">
                            {product.stock} left
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
                            {product.stock} in stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Name & SKU */}
                    <h4 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-emerald-400 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-500 mt-1">
                      {product.sku}
                    </p>
                  </div>

                  {/* Price & Add Action */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.05]">
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      {formatCurrency(product.price)}
                    </span>
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      className={cn(
                        "h-7 w-7 rounded-lg flex items-center justify-center transition-colors",
                        isOutOfStock
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                          : "bg-white/5 hover:bg-emerald-600 text-slate-300 hover:text-white"
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
