"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createProduct, updateProduct } from "@/lib/actions/product";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters").toUpperCase(),
  categoryId: z.string().min(1, "Please select a category"),
  price: z.coerce.number().min(0.01, "Selling price must be greater than $0"),
  costPrice: z.coerce.number().min(0, "Cost price must be non-negative"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  lowStockThreshold: z.coerce.number().int().min(1, "Threshold must be at least 1").default(10),
  image: z.string().optional().or(z.literal("")),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: any | null;
  categories: { _id: string; name: string }[];
  onSuccess: () => void;
}

export function ProductDialog({
  isOpen,
  onClose,
  productToEdit,
  categories,
  onSuccess,
}: ProductDialogProps) {
  const isEditing = Boolean(productToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      categoryId: categories[0]?._id || "",
      price: 0,
      costPrice: 0,
      stock: 10,
      lowStockThreshold: 10,
      image: "",
    },
  });

  useEffect(() => {
    if (productToEdit) {
      reset({
        name: productToEdit.name || "",
        sku: productToEdit.sku || "",
        categoryId:
          typeof productToEdit.categoryId === "object"
            ? productToEdit.categoryId?._id
            : productToEdit.categoryId || categories[0]?._id || "",
        price: productToEdit.price || 0,
        costPrice: productToEdit.costPrice || 0,
        stock: productToEdit.stock || 0,
        lowStockThreshold: productToEdit.lowStockThreshold || 10,
        image: productToEdit.image || "",
      });
    } else {
      reset({
        name: "",
        sku: "",
        categoryId: categories[0]?._id || "",
        price: 0,
        costPrice: 0,
        stock: 10,
        lowStockThreshold: 10,
        image: "",
      });
    }
  }, [productToEdit, reset, categories]);

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (isEditing && productToEdit?._id) {
        const res = await updateProduct(productToEdit._id, values);
        if (!res.success) {
          toast.error(res.error || "Failed to update product");
          return;
        }
        toast.success(`Product "${values.name}" updated successfully!`);
      } else {
        const res = await createProduct(values);
        if (!res.success) {
          toast.error(res.error || "Failed to add product");
          return;
        }
        toast.success(`Product "${values.name}" added to inventory!`);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update product details, pricing, and stock levels."
              : "Fill in the details to register a new product into the inventory system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Coca-Cola Original 330ml Can"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="sku">SKU / Barcode *</Label>
              <Input
                id="sku"
                placeholder="BEV-COCA-330"
                className="font-mono uppercase"
                {...register("sku")}
              />
              {errors.sku && (
                <p className="text-xs text-red-400">{errors.sku.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="categoryId">Category *</Label>
              <Select id="categoryId" {...register("categoryId")}>
                {categories.map((c) => (
                  <option key={c._id} value={c._id} className="bg-[#0A0F1C] text-white">
                    {c.name}
                  </option>
                ))}
              </Select>
              {errors.categoryId && (
                <p className="text-xs text-red-400">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="costPrice">Cost Price ($) *</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.75"
                className="font-mono"
                {...register("costPrice")}
              />
              {errors.costPrice && (
                <p className="text-xs text-red-400">{errors.costPrice.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="price">Selling Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="1.50"
                className="font-mono"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-xs text-red-400">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="stock">Initial Stock *</Label>
              <Input
                id="stock"
                type="number"
                step="1"
                min="0"
                placeholder="50"
                className="font-mono"
                {...register("stock")}
              />
              {errors.stock && (
                <p className="text-xs text-red-400">{errors.stock.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lowStockThreshold">Low Stock Alert Level *</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                step="1"
                min="1"
                placeholder="10"
                className="font-mono"
                {...register("lowStockThreshold")}
              />
              {errors.lowStockThreshold && (
                <p className="text-xs text-red-400">
                  {errors.lowStockThreshold.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="image">Image URL (Optional)</Label>
            <Input
              id="image"
              type="url"
              placeholder="https://images.unsplash.com/..."
              {...register("image")}
            />
            {errors.image && (
              <p className="text-xs text-red-400">{errors.image.message}</p>
            )}
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="font-semibold">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
