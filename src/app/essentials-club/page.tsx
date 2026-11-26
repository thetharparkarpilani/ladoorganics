"use client";

import React, { useState, type FormEvent } from "react";
import Link from "next/link";

const fieldClass = "mt-2 w-full rounded-xl border border-[var(--border-light)] bg-[var(--bg-sand)] px-4 py-3 text-sm text-[var(--text-charcoal)] outline-none transition focus:border-[var(--accent-forest)] focus:ring-2 focus:ring-[var(--accent-forest)]/15";

export default function EssentialsClubPage() {
  const [frequency, setFrequency] = useState<number>(30);
  const [quantity, setQuantity] = useState<number>(1);
  const [productInterest, setProductInterest] = useState("Bilona Ghee");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequencyDays: frequency, quantity, productInterest }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) throw new Error("Please sign in before submitting your repeat-delivery enquiry.");
        throw new Error(result.error || "We could not submit your enquiry.");
      }
      setMessage({
        type: "ok",
        text: result.message || "Your enquiry has been recorded. Our team will contact you to confirm details.",
      });
    } catch (error) {
      setMessage({ type: "err", text: error instanceof Error ? error.message : "A network error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="lado-essentials-page organic-gradient min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="lado-essentials-layout mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
        <section className="lado-essentials-intro pt-4">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
            Lado Organics · Repeat-delivery enquiries
          </p>
          <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-[var(--text-charcoal)] md:text-5xl">
            Make room for the things you love.
          </h1>
          <p className="mb-8 max-w-xl text-lg font-light leading-relaxed text-[var(--text-muted)]">
            Tell us which Lado Organics product you may want regularly. We will review your request and confirm availability, pack options, pricing and delivery details with you.
          </p>
          <div className="rounded-2xl border border-[var(--border-light)] bg-white/60 p-5 text-sm leading-7 text-[var(--text-muted)]">
            <strong className="text-[var(--text-charcoal)]">Please note:</strong> This form records an enquiry only. It does not place an order, collect payment, start an automatic renewal or reserve stock. No price or delivery schedule is confirmed until our team contacts you.
          </div>
        </section>

        <section className="lado-essentials-form card-earthy rounded-3xl p-6 shadow-xl sm:p-9">
          <h2 className="mb-2 font-serif text-2xl font-bold text-[var(--text-charcoal)]">Your repeat-delivery enquiry</h2>
          <p className="mb-7 text-sm text-[var(--text-muted)]">Choose your preferences. You can discuss final details with our team.</p>

          {message && (
            <div role={message.type === "err" ? "alert" : "status"} aria-live="polite"
              className={`mb-6 rounded-xl border p-4 text-sm leading-6 ${message.type === "ok" ? "border-green-200 bg-green-50 text-green-900" : "border-red-200 bg-red-50 text-red-900"}`}>
              {message.text}
              {message.type === "err" && message.text.toLowerCase().includes("sign in") && (
                <Link href="/login?next=/essentials-club" className="ml-1 font-bold underline">Sign in</Link>
              )}
              {message.type === "ok" && (
                <div className="mt-3"><Link href="/dashboard/subscriptions" className="font-bold underline">View your enquiry history</Link></div>
              )}
            </div>
          )}

          <form onSubmit={submitEnquiry} className="space-y-6">
            <div>
              <label htmlFor="essentials-product" className="block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Product of interest</label>
              <select id="essentials-product" value={productInterest} onChange={event => setProductInterest(event.target.value)} className={fieldClass}>
                <option>Bilona Ghee</option>
                <option>Tharparkar Cow Milk</option>
                <option>Dhoop</option>
                <option>Vermicompost</option>
                <option>Kesar</option>
              </select>
            </div>

            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Quantity requested</label>
              <div className="flex items-center justify-between rounded-xl border border-[var(--border-light)] bg-[var(--bg-sand)] p-2">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(value => Math.max(1, value - 1))} className="h-10 w-10 rounded-lg font-bold text-[var(--text-charcoal)] transition hover:bg-black/5" disabled={quantity <= 1}>−</button>
                <span className="font-bold text-[var(--text-charcoal)]">{quantity} {quantity === 1 ? "unit" : "units"}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(value => Math.min(20, value + 1))} className="h-10 w-10 rounded-lg font-bold text-[var(--text-charcoal)] transition hover:bg-black/5" disabled={quantity >= 20}>+</button>
              </div>
              <p className="mt-2 text-xs text-[var(--text-muted)]">Final pack size and quantity will be confirmed by our team.</p>
            </div>

            <fieldset>
              <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Preferred interval</legend>
              <div className="grid grid-cols-3 gap-2">
                {[7, 14, 30].map(days => (
                  <button key={days} type="button" aria-pressed={frequency === days} onClick={() => setFrequency(days)}
                    className={`rounded-xl border px-2 py-3 text-sm font-bold transition ${frequency === days ? "border-[var(--accent-forest)] bg-[var(--accent-forest)]/10 text-[var(--accent-forest)]" : "border-[var(--border-light)] text-[var(--text-muted)] hover:border-[var(--text-charcoal)]"}`}>
                    {days} days
                  </button>
                ))}
              </div>
            </fieldset>

            <button type="submit" disabled={loading} className="btn-forest w-full rounded-xl py-4 text-sm font-bold uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? "Submitting enquiry…" : "Send repeat-delivery enquiry"}
            </button>
            <p className="text-center text-xs leading-5 text-[var(--text-muted)]">Sign-in is required so you can view your enquiry later. Submitting does not authorize a payment or recurring charge.</p>
          </form>
        </section>
      </div>
    </main>
  );
}
