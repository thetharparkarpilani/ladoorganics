"use client";

import React, { useState } from "react";

const COMPARISON_ROWS = [
  {
    criterion: "Cattle Breed",
    lado: "Indigenous Tharparkar cows in Pilani, Rajasthan",
    conventional: "Mixed / crossbred commercial dairy herds"
  },
  {
    criterion: "Milk Protein Type",
    lado: "A2 beta-casein milk from indigenous Tharparkar cows",
    conventional: "Commonly contains A1 or mixed A1/A2 beta-casein"
  },
  {
    criterion: "Ghee Preparation",
    lado: "Whole milk cultured to curd and churned via traditional Bilona method",
    conventional: "Often direct industrial cream separation"
  },
  {
    criterion: "Batch Traceability",
    lado: "Batch ledger lookup at /trace/[batchCode] with admin-approved details",
    conventional: "Pooled bulk tankers without batch-level farm origin"
  }
];

export default function EssentialsClubSection() {
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscriberPhone, setSubscriberPhone] = useState("");
  const [itemLabel, setItemLabel] = useState("A2 Bilona Ghee (1 litre — ₹5,000)");
  const [intervalDays, setIntervalDays] = useState<number>(30);
  const [quantity, setQuantity] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriberEmail,
          subscriberPhone,
          itemLabel,
          intervalDays,
          quantity
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "err", text: data?.error || "Could not save subscription preference." });
      } else {
        setFeedback({
          type: "ok",
          text: `${data.note || "Preference logged."} (${itemLabel}, every ${intervalDays} days × ${quantity}).`
        });
        setSubscriberEmail("");
        setSubscriberPhone("");
      }
    } catch {
      setFeedback({ type: "err", text: "Network error while saving subscription preference." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="essentials-club" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
        {/* A1 vs Tharparkar A2 Comparison Table */}
        <div className="lg:col-span-7 bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            Transparent Process Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1 mb-4">
            Tharparkar A2 Bilona vs. Conventional Dairy
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="py-3 pr-3 font-bold uppercase text-xs opacity-70">Aspect</th>
                  <th className="py-3 px-3 font-bold text-[var(--terracotta)]">Lado Organics (Pilani)</th>
                  <th className="py-3 pl-3 font-bold opacity-70">Conventional Commercial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.criterion}>
                    <td className="py-3.5 pr-3 font-bold align-top">{row.criterion}</td>
                    <td className="py-3.5 px-3 align-top">{row.lado}</td>
                    <td className="py-3.5 pl-3 opacity-75 align-top">{row.conventional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lado Monthly Essentials Club */}
        <div className="lg:col-span-5 bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            Repeat Delivery Scheduler
          </span>
          <h3 className="text-2xl font-serif font-bold mt-1 mb-2">
            Lado Monthly Essentials Club
          </h3>
          <p className="text-xs opacity-80 mb-5 leading-relaxed">
            Register a recurring schedule preference (30, 45, 60, or 90 days). No automatic payment is charged until Razorpay/Cashfree recurring mandates are configured.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold uppercase mb-1">Product & Pack</label>
              <select
                value={itemLabel}
                onChange={(e) => setItemLabel(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
              >
                <option value="A2 Bilona Ghee (250 ml — ₹1,350)">A2 Bilona Ghee (250 ml — ₹1,350)</option>
                <option value="A2 Bilona Ghee (500 ml — ₹2,600)">A2 Bilona Ghee (500 ml — ₹2,600)</option>
                <option value="A2 Bilona Ghee (1 litre — ₹5,000)">A2 Bilona Ghee (1 litre — ₹5,000)</option>
                <option value="Tharparkar Dhoop (Box — ₹1,000)">Tharparkar Dhoop (Box — ₹1,000)</option>
                <option value="Pure Kechua Khad (5 kg Bag — ₹2,000)">Pure Kechua Khad (5 kg Bag — ₹2,000)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase mb-1">Frequency</label>
                <select
                  value={intervalDays}
                  onChange={(e) => setIntervalDays(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                >
                  <option value={30}>Every 30 Days</option>
                  <option value={45}>Every 45 Days</option>
                  <option value={60}>Every 60 Days</option>
                  <option value={90}>Every 90 Days</option>
                </select>
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase mb-1">Phone / WhatsApp (Optional)</label>
              <input
                type="tel"
                value={subscriberPhone}
                onChange={(e) => setSubscriberPhone(e.target.value)}
                placeholder="+91..."
                className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
              />
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl font-medium ${
                  feedback.type === "ok"
                    ? "bg-green-50 text-green-900 border border-green-200"
                    : "bg-red-50 text-red-900 border border-red-200"
                }`}
              >
                {feedback.text}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full primary-btn py-3 rounded-xl font-bold cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Saving Schedule..." : "Save Repeat Delivery Preference"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
