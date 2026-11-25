"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import ManualCheckout from "@/components/ManualCheckout";
type CompletedOrder = { orderNumber: string; method: "cash_on_delivery" | "manual_upi"; total: number };
export default function CheckoutPage() {
  const { items, cartTotal, updateQuantity, removeItem, clearCart } = useCart();
  const [completed, setCompleted] = useState<CompletedOrder | null>(null);
  const finishOrder = (orderNumber: string, method: CompletedOrder["method"], total: number) => { setCompleted({ orderNumber, method, total }); clearCart(); };
  return (
    <main className="checkout-page min-h-screen px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link href="/store" className="text-xs font-bold uppercase tracking-widest text-[var(--accent-forest)] hover:underline">← Continue shopping</Link>
        <header className="mb-10 mt-6"><span className="store-eyebrow">LADO ORGANICS · SECURE ORDER</span><h1 className="mt-3 font-serif text-4xl font-bold text-[var(--mud)] sm:text-5xl">{completed ? "Order received" : "Your checkout"}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{completed ? "Your order has been recorded. Our team will confirm fulfilment and payment details." : "Review your selection and share delivery details. The server verifies current prices and stock when your order is placed."}</p></header>
        {completed ? (
          <section className="checkout-confirmation"><span className="checkout-confirmation-mark">✓</span><p className="store-eyebrow">THANK YOU FOR CHOOSING LADO</p><h2 className="mt-3 font-serif text-3xl font-bold text-[var(--mud)]">Your order is recorded</h2><p className="mt-3 text-sm text-[var(--muted)]">Order reference</p><strong className="mt-1 block font-mono text-lg">{completed.orderNumber}</strong><p className="mt-3 font-semibold">₹{completed.total.toLocaleString("en-IN")}</p><p className="mt-3 text-sm text-[var(--muted)]">{completed.method === "cash_on_delivery" ? "Cash on Delivery selected." : "Manual UPI selected. Payment will be verified by the Lado team."}</p><Link href="/dashboard/orders" className="primary-btn mt-6 inline-flex rounded-full px-6 py-3 text-sm font-bold">View order history</Link><Link href="/store" className="ml-3 mt-6 inline-flex rounded-full border border-[var(--border)] px-6 py-3 text-sm font-bold">Continue shopping</Link></section>
        ) : items.length === 0 ? (
          <section className="checkout-empty"><span aria-hidden="true" className="text-5xl">◇</span><h2 className="mt-4 font-serif text-2xl font-bold text-[var(--mud)]">Your bag is waiting</h2><p className="mt-2 text-sm text-[var(--muted)]">Add something from the Lado Organics collection to begin checkout.</p><Link href="/store" className="primary-btn mt-6 inline-flex rounded-full px-6 py-3 text-sm font-bold">Explore the store</Link></section>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,.85fr)]">
            <section className="checkout-panel"><div className="mb-5 flex items-center justify-between gap-3"><h2 className="font-serif text-2xl font-bold text-[var(--mud)]">Your selection</h2><span className="text-xs text-[var(--muted)]">{items.length} {items.length === 1 ? "line item" : "line items"}</span></div>
              <div className="space-y-4">{items.map(item => <article key={item.variantId} className="checkout-line"><div className="min-w-0 flex-1"><h3 className="font-serif text-lg font-bold text-[var(--mud)]">{item.title}</h3><p className="mt-1 text-xs text-[var(--muted)]">SKU · {item.sku}</p><div className="mt-3 flex items-center gap-3"><div className="product-quantity-control"><button type="button" aria-label={"Decrease " + item.title} onClick={() => updateQuantity(item.variantId, -1)}>−</button><span>{item.quantity}</span><button type="button" aria-label={"Increase " + item.title} onClick={() => updateQuantity(item.variantId, 1)} disabled={item.quantity >= item.maxStock}>+</button></div><button type="button" onClick={() => removeItem(item.variantId)} className="text-xs font-bold text-[var(--terracotta)] hover:underline">Remove</button></div></div><strong className="shrink-0 text-right font-serif text-lg">₹{(item.priceInr * item.quantity).toLocaleString("en-IN")}</strong></article>)}</div>
              <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-5"><span className="text-sm text-[var(--muted)]">Estimated subtotal</span><strong className="font-serif text-2xl text-[var(--mud)]">₹{cartTotal.toLocaleString("en-IN")}</strong></div><p className="mt-3 text-xs leading-6 text-[var(--muted)]">Delivery charges, final price and availability are confirmed by the server before the order is accepted.</p>
            </section>
            <section className="checkout-panel"><h2 className="mb-5 font-serif text-2xl font-bold text-[var(--mud)]">Delivery & payment</h2><ManualCheckout items={items.map(item => ({ sku: item.sku, quantity: item.quantity }))} onSuccess={finishOrder} /></section>
          </div>
        )}
      </div>
    </main>
  );
}
