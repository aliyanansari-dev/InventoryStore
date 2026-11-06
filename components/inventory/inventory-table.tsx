"use client";

import React, { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ProductDialog } from "./product-dialog";
import { DeleteDialog } from "./delete-dialog";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Package,
  AlertTriangle,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface InventoryTableProps {
  initialProducts: any[];
  categories: { _id: string; name: string }[];
}

export function InventoryTable({ initialProducts, categories }: InventoryTableProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = session?.user?.role || "cashier";
  const isAdmin = userRole === "admin";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Dialog states
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<any | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const catId =
        typeof product.categoryId === "object"
          ? product.categoryId?._id
          : product.categoryId;

      const matchesCat =
        selectedCategory === "all" || catId === selectedCategory;

      const matchesSearch =
        !search.trim() ||
        product.name.toLowerCase().includes(search.toLowerCase().trim()) ||
        product.sku.toLowerCase().includes(search.toLowerCase().trim());

      const isLow = product.stock <= (product.lowStockThreshold || 10);
      const matchesStockFilter = !showLowStockOnly || isLow;

      return matchesCat && matchesSearch && matchesStockFilter;
    });
  }, [initialProducts, search, selectedCategory, showLowStockOnly]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsProductDialogOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#131B2E] p-4 rounded-xl border border-white/[0.08]">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="pl-9 h-10 bg-[#0A0F1C] border-white/10"
            />
          </div>

          {/* Category Filter */}
          <div className="w-44">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 bg-[#0A0F1C] border-white/10"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Low Stock Toggle */}
          <Button
            type="button"
            variant={showLowStockOnly ? "destructive" : "outline"}
            size="sm"
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className="h-10 gap-1.5 text-xs font-medium"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Low Stock Only</span>
          </Button>
        </div>

        {/* Add Product Button (Admin & Cashier can add, or Admin only) */}
        {isAdmin && (
          <Button
            onClick={handleOpenAdd}
            className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-2 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        )}
      </div>

      {/* Products Table Card */}
      <div className="rounded-xl border border-white/[0.08] bg-[#131B2E] overflow-hidden shadow-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU / Barcode</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-44 text-center text-slate-500">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No inventory products found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const isOutOfStock = product.stock <= 0;
                const isLowStock =
                  product.stock > 0 &&
                  product.stock <= (product.lowStockThreshold || 10);
                const categoryName =
                  typeof product.categoryId === "object"
                    ? product.categoryId?.name
                    : categories.find((c) => c._id === product.categoryId)?.name ||
                      "General";

                return (
                  <TableRow key={product._id} className="hover:bg-white/[0.02]">
                    {/* Product Image Thumbnail */}
                    <TableCell>
                      <div className="h-10 w-10 rounded-lg bg-[#0A0F1C] border border-white/[0.08] overflow-hidden flex items-center justify-center">
                        {product.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <Package className="h-5 w-5 text-slate-600" />
                        )}
                      </div>
                    </TableCell>

                    {/* Name */}
                    <TableCell className="font-medium text-white max-w-xs">
                      <p className="truncate">{product.name}</p>
                    </TableCell>

                    {/* SKU */}
                    <TableCell className="font-mono text-xs text-slate-300">
                      {product.sku}
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-white/[0.05] text-slate-300 border border-white/[0.05]">
                        {categoryName}
                      </span>
                    </TableCell>

                    {/* Cost Price */}
                    <TableCell className="font-mono text-xs text-slate-400">
                      {formatCurrency(product.costPrice)}
                    </TableCell>

                    {/* Selling Price */}
                    <TableCell className="font-mono text-xs font-bold text-emerald-400">
                      {formatCurrency(product.price)}
                    </TableCell>

                    {/* Stock Indicator Badge */}
                    <TableCell>
                      {isOutOfStock ? (
                        <Badge variant="destructive" className="font-mono">
                          0 Out of Stock
                        </Badge>
                      ) : isLowStock ? (
                        <Badge variant="destructive" className="font-mono">
                          {product.stock} Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="success" className="font-mono">
                          {product.stock} In Stock
                        </Badge>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right space-x-1">
                      {isAdmin ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(product)}
                            className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-400"
                            title="Edit Product"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingProduct(product)}
                            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                            title="Delete Product"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-500 italic">View Only</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Modal */}
      <ProductDialog
        isOpen={isProductDialogOpen}
        onClose={() => setIsProductDialogOpen(false)}
        productToEdit={editingProduct}
        categories={categories}
        onSuccess={handleRefresh}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        product={deletingProduct}
        onSuccess={handleRefresh}
        userRole={userRole}
      />
    </div>
  );
}
