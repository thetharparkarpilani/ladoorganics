"use client";

import React, { useState } from "react";

export default function EssentialsClubPage() {
  const [frequency, setFrequency] = useState<number>(30);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Verified business pricing[cite: 1]
  const PRICE_PER_LITRE = 5000;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequencyDays: frequency, quantity })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to setup subscription.");

      setMessage({ type: "ok", text: "Welcome to the Club! Redirecting to secure mandate authorization..." });
      
      // In production, redirect to Razorpay Subscriptions / eMandate flow here.
      setTimeout(() => {
        window.location.href = "/dashboard/subscriptions";
      }, 2000);
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Network error" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen organic-gradient py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Editorial Information */}
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-[var(--accent-terracotta)] mb-4 uppercase block">
            Module E • Lado Monthly Essentials
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--text-charcoal)] mb-6 leading-tight">
            Never Run Out of <br />Pure A2 Bilona Ghee.
          </h1>
          <p className="text-[var(--text-muted)] text-lg leading-relaxed font-light mb-8">
            Join the Essentials Club to receive automated, freshly churned batches of our indigenous Tharparkar A2 Ghee directly from the Pilani Gaushala. 
          </p>
          
          <ul className="space-y-4 mb-10">
            <li className="flex items-center gap-4 text-[var(--text-charcoal)] font-medium">
              <span className="w-8 h-8 rounded-full bg-[var(--accent-forest)]/10 text-[var(--accent-forest)] flex items-center justify-center">✓</span>
              Priority allocation from fresh Bilona batches
            </li>
            <li className="flex items-center gap-4 text-[var(--text-charcoal)] font-medium">
              <span className="w-8 h-8 rounded-full bg-[var(--accent-forest)]/10 text-[var(--accent-forest)] flex items-center justify-center">✓</span>
              Pause, modify, or cancel anytime
            </li>
            <li className="flex items-center gap-4 text-[var(--text-charcoal)] font-medium">
              <span className="w-8 h-8 rounded-full bg-[var(--accent-forest)]/10 text-[var(--accent-forest)] flex items-center justify-center">✓</span>
              Exclusive access to new organic harvests
            </li>
          </ul>
        </div>

        {/* Subscription Configuration Card */}
        <div className="card-earthy p-8 sm:p-12 shadow-2xl">
          <h3 className="text-2xl font-serif font-bold text-[var(--text-charcoal)] mb-6">Configure Your Supply</h3>
          
          {message && (
            <div className={`p-4 rounded-xl text-sm font-bold mb-6 border ${message.type === "ok" ? "bg-green-50 text-green-900 border-green-200" : "bg-red-50 text-red-900 border-red-200"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubscribe} className="space-y-8">
            {/* Quantity */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 block">Monthly Quantity</label>
              <div className="flex items-center justify-between border border-[var(--border-light)] rounded-xl bg-[var(--bg-sand)] p-2">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg hover:bg-[var(--border-light)] transition text-[var(--text-charcoal)] font-bold">-</button>
                <span className="font-bold text-[var(--text-charcoal)]">{quantity} Litre{quantity > 1 ? 's' : ''}</span>
                <button type="button" onClick={() => setQuantity(Math.min(5, quantity + 1))} className="w-10 h-10 rounded-lg hover:bg-[var(--border-light)] transition text-[var(--text-charcoal)] font-bold">+</button>
              </div>
            </div>

            {/* Delivery Frequency */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 block">Delivery Frequency</label>
              <div className="grid grid-cols-3 gap-3">
                {[30, 45, 60].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setFrequency(days)}
                    className={`py-3 rounded-xl border text-sm font-bold transition ${frequency === days ? 'border-[var(--accent-forest)] bg-[var(--accent-forest)]/10 text-[var(--accent-forest)]' : 'border-[var(--border-light)] text-[var(--text-muted)] hover:border-[var(--text-charcoal)]'}`}
                  >
                    Every {days} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="pt-6 border-t border-[var(--border-light)] flex justify-between items-center">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Total per delivery</span>
                <span className="text-3xl font-serif font-bold text-[var(--accent-terracotta)]">₹{(PRICE_PER_LITRE * quantity).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-forest py-4 rounded-xl font-bold text-sm tracking-widest uppercase disabled:opacity-50">
              {loading ? "Establishing Mandate..." : "Subscribe Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
