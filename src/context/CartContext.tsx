"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  variantId: string;
  sku: string;
  title: string;
  priceInr: number;
  quantity: number;
  maxStock: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (variantId: string, delta: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isDrawerOpen: boolean;
  setDrawerOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Rehydrate cart from local storage to survive page reloads
  useEffect(() => {
    const saved = localStorage.getItem("lado_cart_v3");
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch {}
    }
    setIsLoaded(true);
  }, []);

  // Sync cart to local storage securely
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("lado_cart_v3", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (newItem: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.variantId === newItem.variantId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + newItem.quantity, existing.maxStock);
        return prev.map(i => i.variantId === newItem.variantId ? { ...i, quantity: nextQty } : i);
      }
      return [...prev, newItem];
    });
    setDrawerOpen(true);
  };

  const updateQuantity = (variantId: string, delta: number) => {
    setItems(prev => prev.map(i => {
      if (i.variantId === variantId) {
        const nextQty = Math.max(1, Math.min(i.quantity + delta, i.maxStock));
        return { ...i, quantity: nextQty };
      }
      return i;
    }));
  };

  const removeItem = (variantId: string) => {
    setItems(prev => prev.filter(i => i.variantId !== variantId));
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((total, i) => total + (i.priceInr * i.quantity), 0);
  const itemCount = items.reduce((count, i) => count + i.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, addToCart, updateQuantity, removeItem, clearCart, 
      cartTotal, itemCount, isDrawerOpen, setDrawerOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
