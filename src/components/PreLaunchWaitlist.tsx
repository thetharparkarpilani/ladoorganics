"use client";

import React, { useState } from "react";

export default function PreLaunchWaitlist() {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("herbal-soap");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interest })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setMessage({ type: "ok", text: data.message });
      setEmail("");
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[var(--border-light)] bg-[var(--bg-ivory)]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-[var(--accent-terracotta)] mb-4 uppercase block">Coming Soon</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[var(--text-charcoal)] mb-6">
            Expanding the Ecosystem.
          </h2>
          <p className="text-[var(--text-muted)] text-lg leading-relaxed font-light mb-8">
            We are actively formulating pure Panchagavya wellness blends, Havan cups, and herbal cow-dung soaps. Join the priority waitlist to secure early access before public release.
          </p>
          
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="px-4 py-2 bg-[var(--bg-sand)] border border-[var(--border-light)] rounded-full text-xs font-bold text-[var(--text-charcoal)]">Panchagavya Blends</span>
            <span className="px-4 py-2 bg-[var(--bg-sand)] border border-[var(--border-light)] rounded-full text-xs font-bold text-[var(--text-charcoal)]">Havan Cups</span>
            <span className="px-4 py-2 bg-[var(--bg-sand)] border border-[var(--border-light)] rounded-full text-xs font-bold text-[var(--text-charcoal)]">Herbal Soaps</span>
          </div>
        </div>

        <div className="card-earthy p-8 sm:p-12 shadow-xl">
          <h3 className="text-2xl font-serif font-bold text-[var(--text-charcoal)] mb-6">Join the Priority List</h3>
          
          {message && (
            <div className={`p-4 rounded-xl text-sm font-bold mb-6 border ${message.type === "ok" ? "bg-green-50 text-green-900 border-green-200" : "bg-red-50 text-red-900 border-red-200"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 block">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namaste@example.com"
                className="w-full p-4 rounded-xl bg-[var(--bg-sand)] border border-[var(--border-light)] focus:outline-none focus:border-[var(--accent-forest)] transition"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 block">Product Interest</label>
              <select 
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full p-4 rounded-xl bg-[var(--bg-sand)] border border-[var(--border-light)] focus:outline-none focus:border-[var(--accent-forest)] transition text-[var(--text-charcoal)]"
              >
                <option value="herbal-soap">Herbal Cow-Dung Soaps</option>
                <option value="panchagavya">Panchagavya Blends</option>
                <option value="havan-cups">Havan Cups</option>
                <option value="all">All Upcoming Releases</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-forest py-4 rounded-xl font-bold text-sm tracking-widest uppercase disabled:opacity-50 mt-2">
              {loading ? "Registering..." : "Notify Me First"}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
