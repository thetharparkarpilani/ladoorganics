"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import ManualCheckout from "@/components/ManualCheckout";

export default function CartCheckoutDrawer() {
  const { items, isDrawerOpen, setDrawerOpen, updateQuantity, removeItem, cartTotal, clearCart } = useCart();
  const [completedOrder, setCompletedOrder] = useState("");
  const [completedMethod, setCompletedMethod] = useState<"cash_on_delivery" | "manual_upi">("cash_on_delivery");

  if (!isDrawerOpen) return null;

  const finishOrder = (orderNumber: string, method: "cash_on_delivery" | "manual_upi") => {
    setCompletedOrder(orderNumber);
    setCompletedMethod(method);
    clearCart();
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setCompletedOrder("");
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919636100337";
  const whatsappText = encodeURIComponent(
    `Namaste Lado Organics, I have placed order ${completedOrder}. Please confirm my order.` +
    (completedMethod === "manual_upi" ? " Please share your UPI payment details." : " I selected Cash on Delivery.")
  );

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button aria-label="Close shopping bag" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeDrawer} />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-[var(--border-light)] bg-[var(--bg-ivory)] shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-[var(--border-light)] bg-[var(--bg-sand)] p-6">
          <h2 className="text-2xl font-serif font-bold text-[var(--text-charcoal)]">Your Ecosystem Bag</h2>
          <button onClick={closeDrawer} className="rounded-lg border border-[var(--border-light)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Close</button>
        </div>

        {completedOrder ? (
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-green-900">
              <h3 className="text-xl font-serif font-bold">Thank you! Your order is placed.</h3>
              <p className="mt-3 text-xs">Order number</p>
              <p className="font-mono font-bold">{completedOrder}</p>
              <p className="mt-3 text-sm">
                {completedMethod === "cash_on_delivery"
                  ? "Your order is recorded. Please pay when it is delivered."
                  : "Your order is recorded. Contact us on WhatsApp to receive UPI payment instructions."}
              </p>
              <a href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-green-700 px-5 py-3 text-sm font-bold text-white">
                {completedMethod === "manual_upi" ? "Get UPI details on WhatsApp" : "Confirm order on WhatsApp"}
              </a>
              <Link href="/dashboard/orders" onClick={closeDrawer} className="mt-4 block text-xs font-semibold underline">
                View Order History (sign in required)
              </Link>
            </div>
            <button onClick={closeDrawer} className="text-xs font-bold uppercase tracking-widest text-[var(--accent-forest)] hover:underline">Continue shopping</button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="py-20 text-center">
                  <i className="fas fa-shopping-bag mb-4 text-4xl text-[var(--text-muted)] opacity-30" />
                  <p className="text-sm text-[var(--text-muted)]">Your bag is currently empty.</p>
                  <button onClick={closeDrawer} className="mt-6 text-xs font-bold uppercase tracking-widest text-[var(--accent-forest)] hover:underline">Explore the Store</button>
                </div>
              ) : items.map(item => (
                <div key={item.variantId} className="flex gap-4 border-b border-[var(--border-light)] pb-6">
                  <div className="flex-1">
                    <h4 className="mb-1 font-serif font-bold text-[var(--text-charcoal)]">{item.title}</h4>
                    <p className="mb-4 text-[10px] uppercase tracking-widest text-[var(--text-muted)]">SKU: {item.sku}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center rounded-lg border border-[var(--border-light)] bg-[var(--bg-sand)]">
                        <button onClick={() => updateQuantity(item.variantId, -1)} className="px-3 py-1 font-bold">−</button>
                        <span className="px-3 text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variantId, 1)} className="px-3 py-1 font-bold">+</button>
                      </div>
                      <button onClick={() => removeItem(item.variantId)} className="text-xs font-bold text-[var(--accent-terracotta)] hover:underline">Remove</button>
                    </div>
                  </div>
                  <div className="text-right font-serif text-lg font-bold text-[var(--text-charcoal)]">₹{(item.priceInr * item.quantity).toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>
            {items.length > 0 && (
              <div className="border-t border-[var(--border-light)] bg-[var(--bg-sand)] p-6 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Estimated subtotal</span>
                  <span className="font-bold text-[var(--text-charcoal)]">₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <p className="mb-4 text-[10px] text-[var(--text-muted)]">Final item prices are verified securely when you place your order. Delivery charges, if applicable, will be confirmed before dispatch.</p>
                <ManualCheckout items={items.map(item => ({ sku: item.sku, quantity: item.quantity }))} onSuccess={(orderNumber, method) => finishOrder(orderNumber, method)} />
                <p className="mt-5 text-center text-[10px] leading-relaxed text-[var(--text-muted)]">
                  By proceeding, you agree to our <Link href="/policies/terms" className="underline">Terms</Link> and <Link href="/policies/refunds" className="underline">Refund Policy</Link>.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
