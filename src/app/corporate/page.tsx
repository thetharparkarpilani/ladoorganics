"use client";

import React, { useState } from "react";

export default function CorporatePortalPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/corporate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to submit inquiry.");
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero Section */}
      <section className="bg-[var(--mud)] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--earth)] mb-4 block">Module Q • B2B & Wholesale</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6">Corporate Partnerships</h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl mx-auto">
            Partner with Lado Organics for bulk A2 Bilona Ghee orders, premium corporate gifting, zero-waste consulting, and executive offsite retreats in our Bhunga farm stays.
          </p>
        </div>
      </section>

      {/* Main Content & Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-8">Elevate Your Corporate Footprint</h2>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-[var(--terracotta)]/10 text-[var(--terracotta)] rounded-xl flex items-center justify-center text-xl">
                <i className="fas fa-gift"></i>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Premium Corporate Gifting</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">Curated wellness boxes featuring 100% pure Tharparkar A2 Bilona Ghee and chemical-free Dhoop, packaged sustainably for your clients and team.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-[var(--terracotta)]/10 text-[var(--terracotta)] rounded-xl flex items-center justify-center text-xl">
                <i className="fas fa-store"></i>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Retail & Wholesale Distribution</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">Direct-from-farm supply chains for premium organic stores and Ayurvedic clinics with strict batch traceability and lab certifications.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-[var(--terracotta)]/10 text-[var(--terracotta)] rounded-xl flex items-center justify-center text-xl">
                <i className="fas fa-laptop-house"></i>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Executive Offsites (Bhunga Stays)</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">Disconnect to reconnect. Host leadership retreats at our climate-responsive Pilani farm stays with high-speed fiber internet and satvik meals.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 sm:p-10 shadow-sm">
          <h3 className="text-2xl font-serif font-bold mb-6">Partnership Inquiry</h3>
          
          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-900 p-6 rounded-2xl text-center">
              <i className="fas fa-check-circle text-3xl mb-4 text-green-600"></i>
              <h4 className="font-bold text-lg mb-2">Inquiry Received</h4>
              <p className="text-sm">Our B2B team will contact you within 24 hours to discuss wholesale pricing and allocations.</p>
              <button onClick={() => setSuccess(false)} className="mt-6 text-sm font-bold underline">Submit another inquiry</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5 opacity-70">Company Name</label>
                  <input type="text" name="companyName" required className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:border-[var(--terracotta)]" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5 opacity-70">GST Number (Optional)</label>
                  <input type="text" name="gstNumber" className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:border-[var(--terracotta)]" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5 opacity-70">Contact Person</label>
                  <input type="text" name="contactName" required className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:border-[var(--terracotta)]" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5 opacity-70">Phone Number</label>
                  <input type="tel" name="phone" required className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:border-[var(--terracotta)]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 opacity-70">Email Address</label>
                <input type="email" name="email" required className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:border-[var(--terracotta)]" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 opacity-70">Partnership Type</label>
                <select name="partnershipType" required className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:border-[var(--terracotta)] text-[var(--mud)]">
                  <option value="wholesale_ghee">Wholesale / Bulk A2 Ghee</option>
                  <option value="corporate_gifting">Corporate Gifting Boxes</option>
                  <option value="bhunga_retreat">Executive Farm Retreat</option>
                  <option value="zero_waste_consulting">Zero-Waste / Biogas Consulting</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 opacity-70">Requirements & Details</label>
                <textarea name="message" rows={4} required placeholder="Tell us about your estimated volumes, dates, or specific needs..." className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:border-[var(--terracotta)]"></textarea>
              </div>

              {error && <div className="text-red-600 text-sm font-bold bg-red-50 p-3 rounded-xl">{error}</div>}

              <button type="submit" disabled={loading} className="w-full primary-btn py-4 rounded-xl text-sm font-bold disabled:opacity-50 transition">
                {loading ? "Transmitting..." : "Submit Partnership Inquiry"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
