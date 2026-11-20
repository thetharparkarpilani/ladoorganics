"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import RazorpayCheckout from "@/components/RazorpayCheckout";

export default function CartCheckoutDrawer() {
  const { items, isDrawerOpen, setDrawerOpen, updateQuantity, removeItem, cartTotal, clearCart } = useCart();

  if (!isDrawerOpen) return null;

  const handlePaymentSuccess = () => {
    clearCart();
    // Redirect customer to their journey dashboard to track the order
    window.location.href = "/dashboard";
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setDrawerOpen(false)}
      ></div>
      
      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[var(--bg-ivory)] h-full shadow-2xl flex flex-col border-l border-[var(--border-light)] animate-fade-in">
        
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-light)] flex justify-between items-center bg-[var(--bg-sand)]">
          <h2 className="text-2xl font-serif font-bold text-[var(--text-charcoal)]">Your Ecosystem Bag</h2>
          <button 
            onClick={() => setDrawerOpen(false)} 
            className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 border border-[var(--border-light)] rounded-lg hover:border-[var(--accent-forest)] transition"
          >
            Close
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <i className="fas fa-shopping-bag text-4xl text-[var(--text-muted)] opacity-30 mb-4"></i>
              <p className="text-[var(--text-muted)] text-sm">Your bag is currently empty.</p>
              <button 
                onClick={() => setDrawerOpen(false)} 
                className="mt-6 text-xs font-bold uppercase tracking-widest text-[var(--accent-forest)] hover:underline"
              >
                Explore the Store
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.variantId} className="flex gap-4 border-b border-[var(--border-light)] pb-6">
                <div className="flex-1">
                  <h4 className="font-serif font-bold text-[var(--text-charcoal)] mb-1">{item.title}</h4>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-4">SKU: {item.sku}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[var(--border-light)] rounded-lg bg-[var(--bg-sand)]">
                      <button onClick={() => updateQuantity(item.variantId, -1)} className="px-3 py-1 font-bold text-[var(--text-charcoal)]">-</button>
                      <span className="px-3 text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, 1)} className="px-3 py-1 font-bold text-[var(--text-charcoal)]">+</button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.variantId)} 
                      className="text-xs font-bold text-[var(--accent-terracotta)] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right font-serif font-bold text-[var(--text-charcoal)] text-lg">
                  ₹{(item.priceInr * item.quantity).toLocaleString("en-IN")}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-[var(--bg-sand)] border-t border-[var(--border-light)] shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-[var(--text-muted)]">Subtotal</span>
              <span className="font-bold text-[var(--text-charcoal)]">₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between mb-6 text-sm">
              <span className="text-[var(--text-muted)]">Shipping & Taxes</span>
              <span className="text-[var(--text-muted)] text-xs italic">Calculated at secure checkout</span>
            </div>
            
            <RazorpayCheckout amountInr={cartTotal} onSuccess={handlePaymentSuccess} />
            
            <p className="text-[10px] text-center text-[var(--text-muted)] mt-5 leading-relaxed">
              By proceeding, you agree to our <Link href="/policies/terms" className="underline">Terms</Link> and <Link href="/policies/refunds" className="underline">Refund Policy</Link>. Orders dispatch from Pilani within 2-4 business days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
