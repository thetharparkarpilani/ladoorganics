"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  sku: string;
  slug: string;
  title: string;
  priceInr: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, qty: number) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Hydrate from localStorage safely (Server-side validation happens at Checkout)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lado_secure_cart");
      if (stored) setItems(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to parse cart");
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("lado_secure_cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addItem = (newItem: Omit<CartItem, "quantity">, qty = 1) => {
    setItems(current => {
      const existing = current.find(i => i.sku === newItem.sku);
      if (existing) {
        return current.map(i => i.sku === newItem.sku ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...current, { ...newItem, quantity: qty }];
    });
  };

  const removeItem = (sku: string) => {
    setItems(current => current.filter(i => i.sku !== sku));
  };

  const updateQuantity = (sku: string, qty: number) => {
    if (qty < 1) return removeItem(sku);
    setItems(current => current.map(i => i.sku === sku ? { ...i, quantity: qty } : i));
  };

  const cartTotal = items.reduce((total, item) => total + (item.priceInr * item.quantity), 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
