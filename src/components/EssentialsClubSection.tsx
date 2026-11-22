"use client";

import React, { useState } from "react";

export default function EssentialsClubSection() {
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscriberPhone, setSubscriberPhone] = useState("");
  const [itemLabel, setItemLabel] = useState("A2 Bilona Ghee — 1 litre");
  const [intervalDays, setIntervalDays] = useState(30);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handlePreference = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    try {
      const interest = `Repeat-delivery enquiry | Product: ${itemLabel} | Frequency: ${intervalDays} days | Quantity: ${quantity} | WhatsApp: ${subscriberPhone.trim() || "Not provided"}`;
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscriberEmail, interest })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Could not save your request.");
      setFeedback({ type: "ok", text: "Your repeat-delivery interest has been recorded. The team must confirm availability, final pricing and delivery details with you. No payment or automatic renewal has been set up." });
      setSubscriberEmail("");
      setSubscriberPhone("");
    } catch (error) {
      setFeedback({ type: "err", text: error instanceof Error ? error.message : "Please try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="essentials-club" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">Our preparation method</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1 mb-4">Bilona method, explained simply</h2>
          <p className="text-sm opacity-80 leading-relaxed mb-5">Lado Organics describes a curd-based process using traditional wooden Bilona churning. This is a description of the preparation method, not a claim that one method is medically or nutritionally superior.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead><tr className="border-b border-[var(--border)]"><th className="py-3 pr-3 font-bold">Stage</th><th className="py-3 px-3 font-bold text-[var(--terracotta)]">Curd-based Bilona route</th><th className="py-3 pl-3 font-bold">Direct cream route</th></tr></thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr><td className="py-3 pr-3 font-bold align-top">Starting material</td><td className="py-3 px-3 align-top">Milk is cultured into curd</td><td className="py-3 pl-3 align-top">Cream is separated from milk</td></tr>
                <tr><td className="py-3 pr-3 font-bold align-top">Fat separation</td><td className="py-3 px-3 align-top">Curd is churned to separate butter</td><td className="py-3 pl-3 align-top">Cream is processed to obtain butterfat</td></tr>
                <tr><td className="py-3 pr-3 font-bold align-top">Equipment / method</td><td className="py-3 px-3 align-top">Traditional wooden Bilona churning, as described by Lado</td><td className="py-3 pl-3 align-top">Cream-separation equipment and subsequent processing</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs opacity-65 mt-4">The table compares process routes only. It does not make a blanket claim about all commercial producers or the nutritional quality of the finished ghee.</p>
        </div>

        <div className="lg:col-span-5 bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">Repeat delivery enquiry</span>
          <h3 className="text-2xl font-serif font-bold mt-1 mb-2">Lado Essentials Club</h3>
          <p className="text-xs opacity-80 mb-5 leading-relaxed">Tell us what you may want regularly. This records your preference only; it does not create a paid subscription or automatic charge. Our team will confirm availability and current terms.</p>
          <form onSubmit={handlePreference} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold uppercase mb-1" htmlFor="essentials-product">Product & pack</label>
              <select id="essentials-product" value={itemLabel} onChange={(e) => setItemLabel(e.target.value)} className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                <option>A2 Bilona Ghee — 250 ml</option>
                <option>A2 Bilona Ghee — 500 ml</option>
                <option>A2 Bilona Ghee — 1 litre</option>
                <option>Tharparkar Dhoop — Box</option>
                <option>Pure Kechua Khad — 5 kg Bag</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase mb-1" htmlFor="essentials-frequency">Preferred frequency</label>
                <select id="essentials-frequency" value={intervalDays} onChange={(e) => setIntervalDays(Number(e.target.value))} className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                  <option value={30}>Every 30 days</option><option value={45}>Every 45 days</option><option value={60}>Every 60 days</option><option value={90}>Every 90 days</option>
                </select>
              </div>
              <div>
                <label className="block font-bold uppercase mb-1" htmlFor="essentials-quantity">Quantity</label>
                <input id="essentials-quantity" type="number" min={1} max={20} required value={quantity} onChange={(e) => setQuantity(Math.min(20, Math.max(1, Number(e.target.value) || 1)))} className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
              </div>
            </div>
            <div>
              <label className="block font-bold uppercase mb-1" htmlFor="essentials-email">Email address</label>
              <input id="essentials-email" type="email" required value={subscriberEmail} onChange={(e) => setSubscriberEmail(e.target.value)} placeholder="you@example.com" className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
            </div>
            <div>
              <label className="block font-bold uppercase mb-1" htmlFor="essentials-phone">Phone / WhatsApp (optional)</label>
              <input id="essentials-phone" type="tel" value={subscriberPhone} onChange={(e) => setSubscriberPhone(e.target.value)} placeholder="+91..." className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
            </div>
            {feedback && <p role="status" className={`p-3 rounded-xl font-medium ${feedback.type === "ok" ? "bg-green-50 text-green-900 border border-green-200" : "bg-red-50 text-red-900 border border-red-200"}`}>{feedback.text}</p>}
            <button type="submit" disabled={submitting} className="w-full primary-btn py-3 rounded-xl font-bold cursor-pointer disabled:opacity-50">{submitting ? "Saving request..." : "Register repeat-delivery interest"}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
