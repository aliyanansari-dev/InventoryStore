"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ProductGrid } from "./product-grid";
import { CartPanel, CartItem } from "./cart-panel";
import { BarcodeScannerInput } from "./barcode-scanner-input";
import { ReceiptModal } from "./receipt-modal";
import { createOrder } from "@/lib/actions/order";
import { findProductBySku } from "@/lib/actions/product";

interface Product {
  _id: string;
  name: string;
  sku: string;
  categoryId?: any;
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

interface PosInterfaceProps {
  initialProducts: Product[];
  categories: Category[];
}

export function PosInterface({ initialProducts, categories }: PosInterfaceProps) {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Add a product to cart
  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error(`"${product.name}" is out of stock!`);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error(`Cannot add more "${product.name}". Only ${product.stock} in stock.`);
          return prev;
        }
        toast.success(`Updated "${product.name}" quantity (${existing.quantity + 1})`, {
          duration: 1500,
        });
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        toast.success(`Added "${product.name}" to cart`, { duration: 1500 });
        return [
          ...prev,
          {
            productId: product._id,
            name: product.name,
            sku: product.sku,
            price: product.price,
            quantity: 1,
            stock: product.stock,
          },
        ];
      }
    });
  };

  // Barcode scanner trigger
  const handleBarcodeScan = async (sku: string): Promise<boolean> => {
    // Check locally first
    let product = products.find(
      (p) => p.sku.toUpperCase() === sku.toUpperCase()
    );

    // If not found in current local array, query backend
    if (!product) {
      const res = await findProductBySku(sku);
      if (res.success && res.data) {
        product = res.data;
      }
    }

    if (!product) {
      toast.error(`No item found matching SKU: "${sku}"`);
      return false;
    }

    if (product.stock <= 0) {
      toast.error(`Scanned item "${product.name}" is out of stock!`);
      return false;
    }

    handleAddToCart(product);
    return true;
  };

  // Quantity modification
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.stock) {
              toast.error(`Stock limit reached for "${item.name}".`);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  // Remove single item
  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    toast.info("Item removed from cart");
  };

  // Clear cart
  const handleClearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  // Checkout submission
  const handleCheckout = async (paymentMethod: "cash" | "card" | "digital") => {
    if (cartItems.length === 0) return;

    const cashierId = session?.user?.id;
    if (!cashierId) {
      toast.error("You must be logged in as Cashier or Admin to complete a sale.");
      return;
    }

    setIsCheckingOut(true);
    try {
      const res = await createOrder({
        cashierId,
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod,
      });

      if (!res.success || !res.data) {
        toast.error(res.error || "Failed to process sale");
        return;
      }

      // Immediately decrement stock in our local state for instant UI update
      setProducts((prev) =>
        prev.map((p) => {
          const cartItem = cartItems.find((ci) => ci.productId === p._id);
          if (cartItem) {
            return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
          }
          return p;
        })
      );

      toast.success(`Sale completed successfully! Order: ${res.data.orderNumber}`);
      setCompletedOrder(res.data);
      setCartItems([]);
      setIsReceiptOpen(true);
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred during checkout");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleNewSale = () => {
    setIsReceiptOpen(false);
    setCompletedOrder(null);
  };

  return (
    <div className="h-[calc(100vh-4rem)] p-6 flex flex-col gap-4 overflow-hidden">
      {/* Top Barcode Scanner & Quick Info */}
      <div className="shrink-0">
        <BarcodeScannerInput onScan={handleBarcodeScan} />
      </div>

      {/* Split-Screen: 70% Product Grid | 30% Cart Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left side (70% ~ 8 cols) */}
        <div className="lg:col-span-8 h-full flex flex-col min-h-0">
          <ProductGrid
            products={products}
            categories={categories}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Right side (30% ~ 4 cols) */}
        <div className="lg:col-span-4 h-full flex flex-col min-h-0">
          <CartPanel
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
            isCheckingOut={isCheckingOut}
          />
        </div>
      </div>

      {/* Receipt Dialog */}
      <ReceiptModal
        order={completedOrder}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        onNewSale={handleNewSale}
      />
    </div>
  );
}
