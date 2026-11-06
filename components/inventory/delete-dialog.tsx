"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions/product";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: any | null;
  onSuccess: () => void;
  userRole?: string;
}

export function DeleteDialog({
  isOpen,
  onClose,
  product,
  onSuccess,
  userRole = "cashier",
}: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!product) return null;

  const isAdmin = userRole === "admin";

  const handleDelete = async () => {
    if (!isAdmin) {
      toast.error("Permission Denied: Only Admins can delete inventory items.");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteProduct(product._id);
      if (!res.success) {
        toast.error(res.error || "Failed to delete product");
        return;
      }
      toast.success(`Product "${product.name}" deleted successfully.`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="h-10 w-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-2">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-white">&ldquo;{product.name}&rdquo;</span> (SKU:{" "}
            <span className="font-mono text-emerald-400">{product.sku}</span>)?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {!isAdmin && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            Notice: Cashier role does not have authorization to delete items. Contact an Administrator.
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || !isAdmin}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
