"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

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
const CART_STORAGE_KEY = "lado_cart_v3";

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return typeof item.variantId === "string" && item.variantId.length > 0
    && typeof item.sku === "string" && typeof item.title === "string"
    && Number.isFinite(item.priceInr) && Number(item.priceInr) >= 0
    && Number.isInteger(item.quantity) && Number(item.quantity) >= 1
    && Number.isFinite(item.maxStock) && Number(item.maxStock) >= 1;
}

function normalizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isCartItem).map(item => ({
    ...item,
    quantity: Math.min(item.quantity, Math.floor(item.maxStock)),
    maxStock: Math.floor(item.maxStock),
  })).filter(item => item.quantity > 0);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) setItems(normalizeCart(JSON.parse(saved)));
    } catch {
      // Storage may be disabled or contain malformed data; the cart remains usable in memory.
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // A full or unavailable storage quota must not interrupt checkout.
    }
  }, [items, isLoaded]);

  const addToCart = useCallback((newItem: CartItem) => {
    if (!isCartItem(newItem)) return;
    const safeItem = {
      ...newItem,
      maxStock: Math.max(1, Math.floor(newItem.maxStock)),
      quantity: Math.min(Math.max(1, Math.floor(newItem.quantity)), Math.max(1, Math.floor(newItem.maxStock))),
    };
    setItems(previous => {
      const existing = previous.find(item => item.variantId === safeItem.variantId);
      if (existing) {
        const maxStock = Math.max(1, Math.floor(safeItem.maxStock));
        return previous.map(item => item.variantId === safeItem.variantId
          ? { ...item, maxStock, quantity: Math.min(item.quantity + safeItem.quantity, maxStock) }
          : item);
      }
      return [...previous, safeItem];
    });
    setDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((variantId: string, delta: number) => {
    if (!Number.isFinite(delta) || !Number.isInteger(delta)) return;
    setItems(previous => previous.map(item => item.variantId === variantId
      ? { ...item, quantity: Math.max(1, Math.min(item.quantity + delta, Math.max(1, Math.floor(item.maxStock)))) }
      : item));
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems(previous => previous.filter(item => item.variantId !== variantId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const cartTotal = items.reduce((total, item) => total + item.priceInr * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const value = useMemo(() => ({
    items, addToCart, updateQuantity, removeItem, clearCart,
    cartTotal, itemCount, isDrawerOpen, setDrawerOpen,
  }), [items, addToCart, updateQuantity, removeItem, clearCart, cartTotal, itemCount, isDrawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
