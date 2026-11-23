"use client";

import React, { useEffect, useState } from "react";

type Props = {
  items: { sku: string; quantity: number }[];
  onSuccess: (orderNumber: string, paymentMethod: PaymentMethod) => void;
};

type PaymentMethod = "cash_on_delivery" | "manual_upi";

const inputClass = "mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm";

export default function ManualCheckout({ items, onSuccess }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<{ orderNumber: string; totalInr: number; paymentMethod: PaymentMethod; message: string } | null>(null);
  const [details, setDetails] = useState({
    customerName: "", email: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: ""
  });

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard/profile", { cache: "no-store" })
      .then(async response => response.ok ? response.json() : null)
      .then(result => {
        if (!active || !result?.profile) return;
        const profile = result.profile;
        setDetails(current => ({
          ...current,
          customerName: current.customerName || profile.display_name || "",
          email: current.email || profile.email || "",
          phone: current.phone || profile.phone || "",
          addressLine1: current.addressLine1 || profile.address_line1 || "",
          addressLine2: current.addressLine2 || profile.address_line2 || "",
          city: current.city || profile.city || "",
          state: current.state || profile.state || "",
          postalCode: current.postalCode || profile.postal_code || ""
        }));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const update = (field: keyof typeof details, value: string) =>
    setDetails(current => ({ ...current, [field]: value }));

  const placeOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading || placed) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...details, items, paymentMethod })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to place your order.");
      setPlaced({
        orderNumber: result.orderNumber,
        totalInr: result.totalInr,
        paymentMethod,
        message: result.message
      });
      onSuccess(result.orderNumber, paymentMethod);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to place your order.");
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919636100337";
    const message = encodeURIComponent(
      `Namaste Lado Organics, I have placed order ${placed.orderNumber} for ₹${placed.totalInr.toLocaleString("en-IN")}. Please confirm my order.` +
      (placed.paymentMethod === "manual_upi" ? " Please share your UPI payment details." : " I selected Cash on Delivery.")
    );
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-sm text-green-900 space-y-3">
        <h3 className="text-lg font-serif font-bold">Thank you! Your order is placed.</h3>
        <p className="font-mono font-bold">Order #{placed.orderNumber}</p>
        <p>{placed.message}</p>
        <p className="font-semibold">Order total: ₹{placed.totalInr.toLocaleString("en-IN")}</p>
        <a
          href={`https://wa.me/${whatsapp}?text=${message}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full bg-green-700 px-5 py-3 font-bold text-white"
        >
          {placed.paymentMethod === "manual_upi" ? "Get UPI payment details on WhatsApp" : "Confirm order on WhatsApp"}
        </a>
        <button type="button" onClick={() => window.location.href = "/dashboard/orders"} className="block text-xs font-semibold underline">
          View Order History (sign in required)
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={placeOrder} className="space-y-4">
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
          <input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="postal-code" value={details.postalCode} onChange={e => update("postalCode", e.target.value)} className={inputClass} />
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

      <fieldset className="space-y-2">
        <legend className="text-xs font-bold uppercase tracking-wider">Choose payment method</legend>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
          <input type="radio" name="paymentMethod" value="cash_on_delivery" checked={paymentMethod === "cash_on_delivery"} onChange={() => setPaymentMethod("cash_on_delivery")} className="mt-1" />
          <span><strong className="block text-sm">Cash on Delivery</strong><span className="text-xs text-[var(--muted)]">Pay when your order arrives.</span></span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
          <input type="radio" name="paymentMethod" value="manual_upi" checked={paymentMethod === "manual_upi"} onChange={() => setPaymentMethod("manual_upi")} className="mt-1" />
          <span><strong className="block text-sm">UPI (manual payment)</strong><span className="text-xs text-[var(--muted)]">Place your order first; we will share UPI payment instructions on WhatsApp.</span></span>
        </label>
      </fieldset>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">{error}</p>}
      <button type="submit" disabled={loading || items.length === 0} className="w-full primary-btn rounded-xl py-4 text-sm font-bold shadow-lg disabled:opacity-50">
        {loading ? "Placing your order..." : "Place Order"}
      </button>
      <p className="text-[10px] text-center text-[var(--muted)]">
        UPI payments are verified manually by Lado Organics. Your order is not marked paid until we confirm receipt.
      </p>
    </form>
  );
}
