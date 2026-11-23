"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type EssentialsEnquiry = {
  id: string;
  product_interest: string;
  created_at: string;
};

function getDetail(interest: string, label: string): string {
  const match = interest.split("|").map((part) => part.trim()).find((part) => part.toLowerCase().startsWith(label.toLowerCase() + ":"));
  return match ? match.slice(label.length + 1).trim() : "";
}

export default function EssentialsClubHistoryPage() {
  const [enquiries, setEnquiries] = useState<EssentialsEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/essentials", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to load Essentials Club history.");
        setEnquiries(Array.isArray(result.enquiries) ? result.enquiries : []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load Essentials Club history."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs font-semibold text-[var(--terracotta)] hover:underline">← Back to My Journey</Link>
        <h1 className="mt-3 text-3xl font-serif font-bold text-[var(--mud)]">Essentials Club</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Your saved repeat-delivery preferences and enquiries.</p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm leading-relaxed text-[var(--muted)]">
        These are interest requests only. They are not active subscriptions: no payment, scheduled delivery, or automatic renewal is created. The Lado Organics team must confirm availability, pricing, and delivery details with you.
      </div>

      {loading && (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)]">Loading your enquiries...</div>
      )}

      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          {error}
          <div className="mt-3"><Link href="/login" className="font-semibold underline">Sign in again</Link></div>
        </div>
      )}

      {!loading && !error && enquiries.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <h2 className="font-serif text-xl font-bold text-[var(--mud)]">No repeat-delivery enquiries yet</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">When you register an interest in regular delivery, it will appear here.</p>
          <Link href="/#essentials-club" className="primary-btn mt-6 inline-flex rounded-full px-6 py-3 text-sm font-bold">Explore Essentials Club</Link>
        </div>
      )}

      {!loading && !error && enquiries.length > 0 && (
        <div className="space-y-4">
          {enquiries.map((enquiry) => {
            const product = getDetail(enquiry.product_interest, "Product");
            const frequency = getDetail(enquiry.product_interest, "Frequency");
            const quantity = getDetail(enquiry.product_interest, "Quantity");
            const phone = getDetail(enquiry.product_interest, "WhatsApp");

            return (
              <article key={enquiry.id} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">Repeat-delivery enquiry</p>
                    <h2 className="mt-2 font-serif text-xl font-bold text-[var(--mud)]">{product || "Product preference"}</h2>
                  </div>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">Interest recorded</span>
                </div>
                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <div><dt className="text-xs text-[var(--muted)]">Preferred frequency</dt><dd className="mt-1 font-semibold text-[var(--mud)]">{frequency || "Not specified"}</dd></div>
                  <div><dt className="text-xs text-[var(--muted)]">Quantity</dt><dd className="mt-1 font-semibold text-[var(--mud)]">{quantity || "Not specified"}</dd></div>
                  {phone && <div><dt className="text-xs text-[var(--muted)]">WhatsApp provided</dt><dd className="mt-1 font-semibold text-[var(--mud)]">{phone}</dd></div>}
                  <div><dt className="text-xs text-[var(--muted)]">Request date</dt><dd className="mt-1 font-semibold text-[var(--mud)]">{new Date(enquiry.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</dd></div>
                </dl>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
