"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { ProductDTO } from "@/types/domain";

type OrderItem = {
  id: string;
  item_title: string;
  quantity: number;
  unit_price_inr: number;
  variant_sku: string;
};

type CustomerOrder = {
  id: string;
  order_number: string;
  status: string;
  payment_method?: string;
  payment_status?: string;
  return_status?: string | null;
  subtotal_inr: number;
  total_inr: number;
  shipping_summary: string;
  created_at: string;
  items: OrderItem[];
};

const statusLabel = (status: string) =>
  status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reorderingOrderId, setReorderingOrderId] = useState<string | null>(null);
  const [reorderNotice, setReorderNotice] = useState<{ orderId: string; message: string } | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("/api/dashboard/orders", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to load your orders.");
        setOrders(Array.isArray(result.orders) ? result.orders : []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load your orders."))
      .finally(() => setLoading(false));
  }, []);

  const reorder = async (order: CustomerOrder) => {
    setReorderingOrderId(order.id);
    setReorderNotice(null);
    try {
      const response = await fetch("/api/catalog", { cache: "no-store" });
      if (!response.ok) throw new Error("The live catalogue is unavailable. Please try again later.");
      const data = await response.json() as { catalog?: ProductDTO[] };
      const catalog = Array.isArray(data.catalog) ? data.catalog : [];
      let added = 0;
      const unavailable: string[] = [];

      for (const item of order.items || []) {
        const product = catalog.find((entry) => entry.variants.some((variant) => variant.sku === item.variant_sku));
        const variant = product?.variants.find((entry) => entry.sku === item.variant_sku);
        const stock = Number(variant?.stockQty || 0);
        if (!product || !variant || stock < 1) {
          unavailable.push(item.item_title);
          continue;
        }
        addToCart({
          variantId: variant.id,
          sku: variant.sku,
          title: product.nameEn + " — " + variant.label,
          priceInr: Number(variant.priceInr),
          quantity: Math.min(Math.max(1, Number(item.quantity) || 1), stock),
          maxStock: stock,
        });
        added += 1;
      }

      const message = added > 0
        ? unavailable.length > 0
          ? `${added} item(s) added using current prices. ${unavailable.length} item(s) are no longer available: ${unavailable.join(", ")}.`
          : `${added} item(s) added using current catalogue prices and stock.`
        : "None of the items in this order are currently available in the live catalogue.";
      setReorderNotice({ orderId: order.id, message });
    } catch (err) {
      setReorderNotice({
        orderId: order.id,
        message: err instanceof Error ? err.message : "Unable to repeat this order right now.",
      });
    } finally {
      setReorderingOrderId(null);
    }
  };

  const requestReturn = async (orderId: string) => {
    const reason = window.prompt("Please describe why you need to return this order (at least 5 characters).");
    if (!reason || reason.trim().length < 5) return;
    try {
      const response = await fetch("/api/dashboard/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, reason: reason.trim() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to submit return request.");
      setOrders(current => current.map(order => order.id === orderId ? { ...order, return_status: "requested" } : order));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit return request.");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs font-semibold text-[var(--terracotta)] hover:underline">← Back to My Journey</Link>
        <h1 className="mt-3 text-3xl font-serif font-bold text-[var(--mud)]">Order History</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Your Lado Organics purchases, all in one place.</p>
      </div>

      {loading && (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)]">
          Loading your orders...
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          {error}
          <div className="mt-3"><Link href="/login" className="font-semibold underline">Sign in again</Link></div>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <h2 className="font-serif text-xl font-bold text-[var(--mud)]">No orders yet</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">When you place an order using this Google account email, it will appear here.</p>
          <Link href="/#products" className="primary-btn mt-6 inline-flex rounded-full px-6 py-3 text-sm font-bold">Explore our products</Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order.id} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div>
                  <p className="text-xs text-[var(--muted)]">Order number</p>
                  <h2 className="mt-1 font-mono text-base font-bold text-[var(--mud)]">#{order.order_number}</h2>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs font-semibold capitalize text-[var(--mud)]">
                  {statusLabel(order.status)}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {order.payment_method && (
                  <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)]">
                    Payment: {order.payment_method === "cash_on_delivery" ? "Cash on Delivery" : "UPI (manual)"}
                  </span>
                )}
                {order.payment_status && (
                  <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)]">
                    Payment status: {statusLabel(order.payment_status)}
                  </span>
                )}
              </div>

              <div className="space-y-3 py-4">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="flex flex-wrap justify-between gap-2 text-sm">
                    <div>
                      <p className="font-semibold text-[var(--mud)]">{item.item_title}</p>
                      <p className="text-xs text-[var(--muted)]">Qty: {item.quantity}{item.variant_sku ? ` · ${item.variant_sku}` : ""}</p>
                    </div>
                    <p className="font-medium text-[var(--mud)]">₹{(Number(item.unit_price_inr) * Number(item.quantity)).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>

              {order.shipping_summary && (
                <p className="border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
                  <span className="font-semibold">Delivery address: </span>{order.shipping_summary}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                  {order.return_status ? <>Return request: <strong className="capitalize">{statusLabel(order.return_status)}</strong></> : order.status === "delivered" ? <button onClick={() => void requestReturn(order.id)} className="rounded-full border border-[var(--border)] px-4 py-2 font-semibold text-[var(--mud)]">Request a return</button> : null}
                  <button type="button" onClick={() => void reorder(order)} disabled={reorderingOrderId !== null || !order.items?.length}
                    className="rounded-full bg-[var(--terracotta)] px-4 py-2 font-semibold text-white disabled:opacity-50">
                    {reorderingOrderId === order.id ? "Checking live stock…" : "Buy these items again"}
                  </button>
                </div>
                <p className="text-sm text-[var(--muted)]">Order total <span className="ml-2 text-lg font-bold text-[var(--terracotta)]">₹{Number(order.total_inr).toLocaleString("en-IN")}</span></p>
              </div>
              {reorderNotice?.orderId === order.id && <p role="status" className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-xs text-[var(--muted)]">{reorderNotice.message}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
