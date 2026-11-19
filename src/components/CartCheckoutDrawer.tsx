"use client";

import React, { useState } from "react";

export interface CartBagItem {
  sku: string;
  title: string;
  unitPriceInr: number;
  quantity: number;
}

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartBagItem[];
  onUpdateQty: (sku: string, delta: number) => void;
  onRemoveItem: (sku: string) => void;
  onClearBag: () => void;
  whatsappNumber: string;
}

export default function CartCheckoutDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearBag,
  whatsappNumber
}: CartCheckoutDrawerProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingSummary, setShippingSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  if (!isOpen) return null;

  const subtotalInr = items.reduce((sum, item) => sum + item.unitPriceInr * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (items.length === 0) {
      setFeedback({ type: "err", text: "Your shopping bag is empty." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          shippingSummary,
          items: items.map((i) => ({ sku: i.sku, quantity: i.quantity }))
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "err", text: data?.error || "Could not create order." });
      } else {
        setFeedback({
          type: "ok",
          text: `Order ${data.order?.orderNumber} recorded (Subtotal: ₹${Number(data.order?.subtotalInr || subtotalInr).toLocaleString("en-IN")}). Shipping and applicable taxes are confirmed prior to payment.`
        });
        onClearBag();
        setCustomerName("");
        setCustomerPhone("");
        setCustomerEmail("");
        setShippingSummary("");
      }
    } catch {
      setFeedback({ type: "err", text: "Network error while creating order." });
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappSummaryUrl = () => {
    const lines = items.map(
      (i) => `- ${i.title} x ${i.quantity} = ₹${(i.unitPriceInr * i.quantity).toLocaleString("en-IN")}`
    );
    const text = [
      "Namaste Lado Organics!",
      "Bag enquiry:",
      ...lines,
      `Subtotal: ₹${subtotalInr.toLocaleString("en-IN")}`,
      "Please share shipping, tax, and payment details."
    ].join("\n");
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div
      role="dialog"
      aria-label="Shopping Bag and Checkout"
      className="fixed inset-0 z-50 bg-black/60 flex justify-end"
    >
      <div className="w-full max-w-md bg-[var(--surface)] text-[var(--mud)] h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-[var(--border)]">
            <div>
              <h2 className="text-xl font-serif font-bold">Your Lado Bag</h2>
              <p className="text-xs opacity-70">Direct from Pilani, Rajasthan</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close bag"
              className="px-3 py-1 rounded-full border border-[var(--border)] text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-sm opacity-75 py-8 text-center">
              Your bag is currently empty. Add items from the Circular Store to begin.
            </p>
          ) : (
            <ul className="space-y-3 mb-6">
              {items.map((item) => (
                <li
                  key={item.sku}
                  className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-bold text-sm">{item.title}</p>
                    <p className="opacity-75 mt-0.5">
                      ₹{item.unitPriceInr.toLocaleString("en-IN")} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.sku, -1)}
                      className="w-7 h-7 rounded-full border border-[var(--border)] font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold w-5 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.sku, 1)}
                      className="w-7 h-7 rounded-full border border-[var(--border)] font-bold cursor-pointer"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.sku)}
                      className="text-[var(--terracotta)] font-bold ml-1 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 && (
            <form onSubmit={handlePlaceOrder} className="space-y-3 text-xs">
              <div className="flex justify-between items-baseline py-3 border-t border-[var(--border)]">
                <span className="uppercase font-bold opacity-75">Item Subtotal</span>
                <span className="text-2xl font-serif font-bold text-[var(--terracotta)]">
                  ₹{subtotalInr.toLocaleString("en-IN")}
                </span>
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your name"
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold uppercase mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Email (For My Journey)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">Delivery Address & Pincode</label>
                <textarea
                  rows={2}
                  required
                  value={shippingSummary}
                  onChange={(e) => setShippingSummary(e.target.value)}
                  placeholder="House/street, city, state, PIN code"
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full primary-btn py-3 rounded-xl font-bold text-xs cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Recording Order..." : "Record Order Request"}
              </button>

              <a
                href={whatsappSummaryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-2.5 rounded-xl border border-[var(--border)] font-bold text-xs hover:border-[var(--terracotta)]"
              >
                Confirm on WhatsApp (+91 96361 00337) ↗
              </a>
            </form>
          )}

          {feedback && (
            <div
              className={`mt-4 p-3.5 rounded-xl text-xs font-medium ${
                feedback.type === "ok"
                  ? "bg-green-50 text-green-900 border border-green-200"
                  : "bg-red-50 text-red-900 border border-red-200"
              }`}
            >
              {feedback.text}
            </div>
          )}
        </div>

        <p className="text-[11px] opacity-65 pt-4 border-t border-[var(--border)] mt-6">
          Live gateway checkout (Razorpay/Cashfree) activates once your server keys and webhook secret are configured.
        </p>
      </div>
    </div>
  );
}
