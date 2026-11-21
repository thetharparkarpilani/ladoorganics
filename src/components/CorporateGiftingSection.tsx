"use client";
import React, { useState } from "react";

export default function CorporateGiftingSection({ whatsappNumber }: { whatsappNumber: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setStatus("Sending...");
    try {
      const response = await fetch("/api/corporate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, message })
      });
      if (!response.ok) throw new Error("The enquiry could not be submitted.");
      setStatus("Thank you. Your corporate enquiry has been submitted.");
      setName(""); setEmail(""); setCompany(""); setMessage("");
    } catch {
      const text = encodeURIComponent(`Corporate gifting enquiry\nName: ${name}\nCompany: ${company}\nEmail: ${email}\nDetails: ${message}`);
      window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank", "noopener,noreferrer");
      setStatus("The online form was unavailable. A WhatsApp enquiry window has been opened instead.");
    }
  }
  return <section id="corporate" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
      <div><p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">For teams & businesses</p><h2 className="text-3xl sm:text-4xl font-serif font-bold mt-3">Corporate Gifting</h2><p className="mt-4 opacity-80 leading-relaxed">Thoughtful farm-sourced gifts for teams, celebrations and business partners. Share your requirements and our team will follow up.</p></div>
      <form onSubmit={submit} className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 space-y-3">
        <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="w-full p-3 rounded-xl border border-[var(--border)] bg-white" />
        <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" className="w-full p-3 rounded-xl border border-[var(--border)] bg-white" />
        <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company / organisation" className="w-full p-3 rounded-xl border border-[var(--border)] bg-white" />
        <textarea required value={message} onChange={e=>setMessage(e.target.value)} placeholder="Quantity, occasion and requirements" rows={4} className="w-full p-3 rounded-xl border border-[var(--border)] bg-white" />
        <button className="primary-btn rounded-xl px-5 py-3 font-bold text-sm" type="submit">Send Enquiry</button>
        {status && <p role="status" className="text-sm opacity-80">{status}</p>}
      </form>
    </div>
  </section>;
}
