"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";

type CatalogRow = {
  product_id: string;
  slug: string;
  name_en: string;
  is_active: boolean;
  image_url: string | null;
  variant_id: string | null;
  sku: string | null;
  label: string | null;
  price_inr: number | string | null;
  stock_qty: number | string | null;
  is_default: boolean | null;
};

type Draft = { priceInr: string; stockQty: string };

export default function AdminProductInventory({ adminToken }: { adminToken: string }) {
  const [rows, setRows] = useState<CatalogRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [imageDrafts, setImageDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/catalog", {
        headers: { "x-admin-token": adminToken },
        cache: "no-store"
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to load inventory.");
      const nextRows: CatalogRow[] = Array.isArray(data.items) ? data.items : [];
      setRows(nextRows);
      const nextImageDrafts: Record<string, string> = {};
      for (const row of nextRows) nextImageDrafts[row.product_id] = row.image_url || "";
      setImageDrafts(nextImageDrafts);
      const nextDrafts: Record<string, Draft> = {};
      for (const row of nextRows) {
        if (row.variant_id) nextDrafts[row.variant_id] = {
          priceInr: String(row.price_inr ?? 0),
          stockQty: String(row.stock_qty ?? 0)
        };
      }
      setDrafts(nextDrafts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load inventory.");
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => { void load(); }, [load]);

  const products = useMemo(() => {
    const grouped = new Map<string, CatalogRow[]>();
    for (const row of rows) {
      const existing = grouped.get(row.product_id) || [];
      existing.push(row);
      grouped.set(row.product_id, existing);
    }
    return Array.from(grouped.values());
  }, [rows]);

  const updateDraft = (id: string, field: keyof Draft, value: string) => {
    setDrafts((current) => ({
      ...current,
      [id]: { ...current[id], [field]: value }
    }));
  };

  const saveVariant = async (row: CatalogRow) => {
    if (!row.variant_id) return;
    const draft = drafts[row.variant_id];
    const price = Number(draft?.priceInr);
    const stock = Number(draft?.stockQty);
    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      setError("Enter a valid non-negative price and whole-number stock quantity.");
      return;
    }
    setSaving(row.variant_id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": adminToken },
        body: JSON.stringify({ action: "update_variant", variantId: row.variant_id, priceInr: price, stockQty: stock })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to save variant.");
      setNotice(`Saved ${row.sku || row.label}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save variant.");
    } finally {
      setSaving("");
    }
  };

  const saveImage = async (row: CatalogRow) => {
    const imageUrl = (imageDrafts[row.product_id] || "").trim();
    if (imageUrl) {
      try {
        const parsed = new URL(imageUrl);
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("Invalid protocol");
      } catch {
        setError("Enter a valid public image URL beginning with https://.");
        return;
      }
    }
    setSaving(row.product_id + "-image");
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": adminToken },
        body: JSON.stringify({ action: "update_product_image", productId: row.product_id, imageUrl })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to save product image.");
      setNotice(imageUrl ? `Image saved for ${row.name_en}.` : `Image removed for ${row.name_en}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save product image.");
    } finally {
      setSaving("");
    }
  };

  const toggleProduct = async (row: CatalogRow) => {
    setSaving(row.product_id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": adminToken },
        body: JSON.stringify({ action: "update_product_status", productId: row.product_id, isActive: !row.is_active })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to update availability.");
      setNotice(`${row.name_en} is now ${!row.is_active ? "available" : "hidden"} on the storefront.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update product.");
    } finally {
      setSaving("");
    }
  };

  return (
    <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold">Product & Inventory Management</h2>
          <p className="mt-1 text-sm opacity-70">Update live variant prices, stock quantities and storefront availability.</p>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold disabled:opacity-50">
          {loading ? "Loading…" : "Refresh inventory"}
        </button>
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-900">{notice}</p>}
      {loading && rows.length === 0 ? <p className="py-8 text-center text-sm opacity-60">Loading product inventory…</p> :
        products.length === 0 ? <p className="py-8 text-center text-sm opacity-60">No product records found.</p> :
        <div className="grid gap-4 lg:grid-cols-2">
          {products.map((group) => {
            const product = group[0];
            return (
              <article key={product.product_id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
                <div className="mb-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  {imageDrafts[product.product_id] ? (
                    <Image src={imageDrafts[product.product_id]} alt={product.name_en} width={640} height={256} unoptimized className="h-40 w-full object-cover" />
                  ) : (
                    <div className="flex h-32 items-center justify-center text-xs opacity-50">No product image set</div>
                  )}
                  <div className="space-y-2 p-3">
                    <label className="block text-xs font-semibold">Product image URL
                      <input type="url" value={imageDrafts[product.product_id] ?? ""} onChange={(event) => setImageDrafts((current) => ({ ...current, [product.product_id]: event.target.value }))} placeholder="https://example.com/product-photo.jpg" className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2.5 text-sm" />
                    </label>
                    <button type="button" disabled={saving === product.product_id + "-image"} onClick={() => void saveImage(product)} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold disabled:opacity-50">
                      {saving === product.product_id + "-image" ? "Saving image…" : "Save product image"}
                    </button>
                  </div>
                </div>
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold">{product.name_en}</h3>
                    <p className="text-xs opacity-60">{product.slug}</p>
                    <span className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${product.is_active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}>
                      {product.is_active ? "Visible on storefront" : "Hidden from storefront"}
                    </span>
                  </div>
                  <button type="button" disabled={saving === product.product_id} onClick={() => void toggleProduct(product)}
                    className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold disabled:opacity-50">
                    {saving === product.product_id ? "Saving…" : product.is_active ? "Hide product" : "Make available"}
                  </button>
                </div>

                {group.filter((row) => row.variant_id).map((variant) => {
                  const id = variant.variant_id as string;
                  const draft = drafts[id] || { priceInr: "", stockQty: "" };
                  return (
                    <div key={id} className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <strong className="text-sm">{variant.label || "Variant"} {variant.is_default ? "· Default" : ""}</strong>
                        <span className="text-[10px] opacity-60">{variant.sku}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="text-xs font-semibold">Price (₹)
                          <input type="number" min="0" step="1" value={draft.priceInr} onChange={(event) => updateDraft(id, "priceInr", event.target.value)}
                            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2.5 text-sm" />
                        </label>
                        <label className="text-xs font-semibold">Stock quantity
                          <input type="number" min="0" step="1" value={draft.stockQty} onChange={(event) => updateDraft(id, "stockQty", event.target.value)}
                            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2.5 text-sm" />
                        </label>
                      </div>
                      <button type="button" disabled={saving === id || saving === product.product_id} onClick={() => void saveVariant(variant)}
                        className="primary-btn mt-3 rounded-lg px-4 py-2 text-xs font-bold disabled:opacity-50">
                        {saving === id ? "Saving…" : "Save price & stock"}
                      </button>
                    </div>
                  );
                })}
                {group.every((row) => !row.variant_id) && <p className="text-sm opacity-60">No variants configured.</p>}
              </article>
            );
          })}
        </div>
      }
      <p className="mt-5 text-xs opacity-60">Changes update the database used by the storefront. Setting stock to zero removes that variant from the current customer catalogue. Hiding a product removes the whole product from the storefront. Every change is recorded in the admin audit log.</p>
    </section>
  );
}
