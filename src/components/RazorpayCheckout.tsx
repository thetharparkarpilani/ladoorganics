"use client";

import React, { useState } from "react";
import Script from "next/script";

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
interface RazorpayOptions {
  key: string; amount: number; currency: string; name: string; description: string;
  order_id: string; handler: (response: RazorpayPaymentResponse) => void;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string }; modal: { ondismiss: () => void };
}
interface RazorpayInstance { open: () => void; }
declare global { interface Window { Razorpay?: new (options: RazorpayOptions) => RazorpayInstance; } }

interface CheckoutItem { sku: string; quantity: number; }
interface CheckoutProps {
  amountInr: number;
  items: CheckoutItem[];
  onSuccess: (orderNumber: string) => void;
}
export default function RazorpayCheckout({ amountInr, items, onSuccess }: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState("");
  const [details, setDetails] = useState({
    customerName: "", email: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: ""
  });
  const update = (field: keyof typeof details, value: string) => setDetails(current => ({ ...current, [field]: value }));

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!sdkReady || !window.Razorpay || loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...details, items })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to initialize checkout.");

      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Lado Organics",
        description: "Your Lado Organics order",
        order_id: data.orderId,
        prefill: { name: data.customer.name, email: data.customer.email, contact: data.customer.phone },
        theme: { color: "#c2410c" },
        modal: { ondismiss: () => setLoading(false) },
        handler: async (payment) => {
          try {
            const verified = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payment)
            });
            const result = await verified.json();
            if (!verified.ok || !result.verified) throw new Error(result.error || "Payment verification is pending.");
            onSuccess(result.orderNumber || data.orderNumber);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Payment received but order verification is pending. Please contact support.");
            setLoading(false);
          }
        }
      });
      checkout.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start secure checkout.");
      setLoading(false);
    }
  };

  const inputClass = "mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm";
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setSdkReady(true)} onError={() => setError("Secure payment window could not load. Please refresh and try again.")} />
      <form onSubmit={handlePayment} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block text-xs font-semibold">Full name *
            <input required maxLength={100} autoComplete="name" value={details.customerName} onChange={e => update("customerName", e.target.value)} className={inputClass} />
          </label>
          <label className="block text-xs font-semibold">Email *
            <input required type="email" maxLength={254} autoComplete="email" value={details.email} onChange={e => update("email", e.target.value)} className={inputClass} />
          </label>
          <label className="block text-xs font-semibold">Phone number *
            <input required type="tel" maxLength={20} autoComplete="tel" value={details.phone} onChange={e => update("phone", e.target.value)} className={inputClass} />
          </label>
          <label className="block text-xs font-semibold">PIN code *
            <input required maxLength={20} autoComplete="postal-code" value={details.postalCode} onChange={e => update("postalCode", e.target.value)} className={inputClass} />
          </label>
        </div>
        <label className="block text-xs font-semibold">Address line 1 *
          <input required maxLength={180} autoComplete="address-line1" value={details.addressLine1} onChange={e => update("addressLine1", e.target.value)} className={inputClass} />
        </label>
        <label className="block text-xs font-semibold">Address line 2
          <input maxLength={180} autoComplete="address-line2" value={details.addressLine2} onChange={e => update("addressLine2", e.target.value)} className={inputClass} />
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block text-xs font-semibold">City *
            <input required maxLength={80} autoComplete="address-level2" value={details.city} onChange={e => update("city", e.target.value)} className={inputClass} />
          </label>
          <label className="block text-xs font-semibold">State *
            <input required maxLength={80} autoComplete="address-level1" value={details.state} onChange={e => update("state", e.target.value)} className={inputClass} />
          </label>
        </div>
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">{error}</p>}
        <button type="submit" disabled={loading || !sdkReady || items.length === 0} className="w-full primary-btn py-4 rounded-xl font-bold text-sm shadow-lg disabled:opacity-50 transition">
          {loading ? "Preparing secure payment..." : !sdkReady ? "Loading secure payment..." : "Pay ₹" + amountInr.toLocaleString("en-IN") + " Securely"}
        </button>
        <p className="text-[10px] text-center text-[var(--muted)]">Your order is confirmed only after Razorpay verifies the payment. Payments are processed securely by Razorpay.</p>
      </form>
    </>
  );
}
