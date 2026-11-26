"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CorporateGiftingPage() {
  const [formData, setFormData] = useState({
    companyName: "", contactName: "", email: "", phone: "",
    eventType: "Diwali Gifting", estimatedQuantity: "50-100", targetDate: "", requirements: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/b2b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: "ok", text: data.message });
      setFormData({ companyName: "", contactName: "", email: "", phone: "", eventType: "Diwali Gifting", estimatedQuantity: "50-100", targetDate: "", requirements: "" });
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lado-corporate-page min-h-screen organic-gradient py-20 px-4 sm:px-6 lg:px-8">
      <div className="lado-corporate-layout max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        
        {/* Editorial Value Proposition */}
        <div className="lado-corporate-intro pt-8">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent-terracotta)] transition mb-8 inline-block">← Back to Ecosystem</Link>
          <span className="text-xs font-bold tracking-[0.2em] text-[var(--accent-forest)] mb-4 uppercase block">Module Q • B2B & Wholesale</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--text-charcoal)] mb-6 leading-tight">
            Corporate Gifting, <br/>Rooted in Heritage.
          </h1>
          <p className="text-[var(--text-muted)] text-lg leading-relaxed font-light mb-8">
            Elevate your corporate milestones and festival gifting with authentic, MSME-certified (UDYAM-RJ-21-0104324) Gau Sanskriti products. We offer custom packaging and volume-based pricing for our pure A2 Bilona Ghee and Tharparkar Dhoop boxes.
          </p>
          
          <ul className="space-y-6 mt-12 border-t border-[var(--border-light)] pt-10">
            <li className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-full bg-[var(--accent-earth)]/20 text-[var(--text-mud)] flex items-center justify-center shrink-0"><i className="fas fa-box-open"></i></span>
              <div>
                <h4 className="font-bold text-[var(--text-charcoal)] mb-1">Custom Hampers</h4>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">Tailored combinations of our zero-waste ecosystem products presented in premium, sustainable packaging.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-full bg-[var(--accent-forest)]/10 text-[var(--accent-forest)] flex items-center justify-center shrink-0"><i className="fas fa-file-invoice"></i></span>
              <div>
                <h4 className="font-bold text-[var(--text-charcoal)] mb-1">GST Invoicing & Bulk Pricing</h4>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">Fully compliant B2B invoicing with transparent, volume-based pricing structures for orders exceeding 50 units.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* B2B Enquiry Form */}
        <div className="lado-corporate-form card-earthy p-8 sm:p-12 shadow-xl">
          <h3 className="text-2xl font-serif font-bold text-[var(--text-charcoal)] mb-6">Request a Corporate Proposal</h3>
          
          {message && (
            <div className={`p-4 rounded-xl text-sm font-bold mb-6 border ${message.type === "ok" ? "bg-green-50 text-green-900 border-green-200" : "bg-red-50 text-red-900 border-red-200"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Company Name *</label>
                <input type="text" required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full p-3.5 rounded-xl bg-[var(--bg-sand)] border border-[var(--border-light)] focus:outline-none focus:border-[var(--accent-forest)] transition" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Contact Person *</label>
                <input type="text" required value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full p-3.5 rounded-xl bg-[var(--bg-sand)] border border-[var(--border-light)] focus:outline-none focus:border-[var(--accent-forest)] transition" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Corporate Email *</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3.5 rounded-xl bg-[var(--bg-sand)] border border-[var(--border-light)] focus:outline-none focus:border-[var(--accent-forest)] transition" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Phone Number *</label>
                <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3.5 rounded-xl bg-[var(--bg-sand)] border border-[var(--border-light)] focus:outline-none focus:border-[var(--accent-forest)] transition" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Event / Occasion</label>
                <select value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value})} className="w-full p-3.5 rounded-xl bg-[var(--bg-sand)] border border-[var(--border-light)] focus:outline-none focus:border-[var(--accent-forest)] transition">
                  <option>Diwali Gifting</option>
                  <option>Corporate Milestone</option>
                  <option>Client Appreciation</option>
                  <option>Employee Wellness</option>
                  <option>Wholesale Resale</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Estimated Quantity *</label>
                <select value={formData.estimatedQuantity} onChange={e => setFormData({...formData, estimatedQuantity: e.target.value})} className="w-full p-3.5 rounded-xl bg-[var(--bg-sand)] border border-[var(--border-light)] focus:outline-none focus:border-[var(--accent-forest)] transition">
                  <option>25 - 50 Units</option>
                  <option>50 - 100 Units</option>
                  <option>100 - 500 Units</option>
                  <option>500+ Units</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Target Delivery Date</label>
              <input type="date" value={formData.targetDate} onChange={e => setFormData({...formData, targetDate: e.target.value})} className="w-full p-3.5 rounded-xl bg-[var(--bg-sand)] border border-[var(--border-light)] focus:outline-none focus:border-[var(--accent-forest)] transition" />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Custom Requirements / Message</label>
              <textarea rows={3} value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="w-full p-3.5 rounded-xl bg-[var(--bg-sand)] border border-[var(--border-light)] focus:outline-none focus:border-[var(--accent-forest)] transition"></textarea>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-forest py-4 rounded-xl font-bold text-sm tracking-widest uppercase mt-4 disabled:opacity-50">
              {loading ? "Transmitting..." : "Submit Corporate Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
