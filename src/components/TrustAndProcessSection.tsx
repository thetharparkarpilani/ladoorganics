"use client";

import React, { useState } from "react";

const STEPS = [
  { number: "01", title: "Boiling", detail: "Milk is heated as the first stage of the documented traditional process." },
  { number: "02", title: "Curdling", detail: "The milk is cultured into curd before churning." },
  { number: "03", title: "Bilona churning", detail: "Curd is churned using the Bilona process described by Lado Organics." },
  { number: "04", title: "Separating", detail: "The butter is separated from the buttermilk." },
  { number: "05", title: "Slow heating", detail: "The butter is gently heated to prepare ghee." }
];

const FAQS = [
  {
    q: "How is Lado Organics Bilona Ghee prepared?",
    a: "The process described by Lado Organics is milk heating, curdling, Bilona churning, butter separation and slow heating. Batch-specific details should be checked against the product label and published batch record."
  },
  {
    q: "Why can Bilona ghee have a grainy texture?",
    a: "Ghee can develop a granular texture as it cools. Texture can vary with preparation and storage conditions; it is not, by itself, a laboratory test of purity."
  },
  {
    q: "Where does Lado Organics come from?",
    a: "Lado Organics is rooted in Pilani, Rajasthan. The website describes its farm and product ecosystem in the Pilani area."
  },
  {
    q: "Can I see a laboratory report for my product?",
    a: "A report is shown only when an approved report file has been attached to the relevant batch record. If no report link appears, a report has not been published for that batch on the website."
  },
  {
    q: "Is ghee suitable for someone with lactose sensitivity?",
    a: "Individual tolerance varies. The website cannot determine whether a product is suitable for your medical needs. Please consult a qualified healthcare professional and review the product information before use."
  },
  {
    q: "How quickly will my order arrive?",
    a: "Delivery availability and timing depend on the destination and current dispatch arrangements. Contact the Lado Organics team to confirm before placing an order."
  }
];

export default function TrustAndProcessSection({ whatsappNumber }: { whatsappNumber: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("Panchagavya product updates");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const joinWaitlist = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interest })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Could not save your interest.");
      setStatus("Your interest has been recorded. This is an update list, not an order or product launch confirmation.");
      setEmail("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const consultationUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Namaste Lado Organics. I would like to enquire about a biogas and circular-farm systems consultation. Please share whether this service is available.")}`;

  return (
    <section id="process-and-trust" className="border-t border-[var(--border)] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">From milk to ghee</p>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold mt-2">The Five Stages of Bilona</h2>
            <p className="mt-3 text-sm opacity-80">A simple explanation of the traditional process described by Lado Organics. This is a process overview, not a laboratory or nutritional claim.</p>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {STEPS.map((step) => (
              <li key={step.number} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <span className="text-sm font-bold text-[var(--terracotta)]">{step.number}</span>
                <h3 className="font-serif text-xl font-bold mt-2 mb-2">{step.title}</h3>
                <p className="text-sm opacity-80 leading-relaxed">{step.detail}</p>
              </li>
            ))}
          </ol>
          <p className="text-xs opacity-70 text-center mt-5">Lado Organics also describes a calf-first care principle for its herd. Ask the farm team for current details about animal care and milking routines.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">Place & provenance</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-2 mb-3">Rooted in Pilani, Rajasthan</h2>
            <p className="text-sm opacity-85 leading-relaxed">Lado Organics tells its story through Pilani and the Tharparkar cattle heritage of Rajasthan. We focus on the place, the people and the process—and publish batch-specific facts only when they are recorded and available to verify.</p>
            <p className="text-xs opacity-70 mt-4">We do not make medicinal-grazing or health-benefit promises without supporting evidence.</p>
          </article>

          <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">For institutions & farms</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-2 mb-3">Biogas & circular-farm enquiries</h2>
            <p className="text-sm opacity-85 leading-relaxed">Interested in learning about the biogas and vermicompost cycle described in the Lado Organics farm story? Contact the team to ask about consultation or a farm demonstration. Availability and scope are confirmed individually.</p>
            <a href={consultationUrl} target="_blank" rel="noopener noreferrer" className="primary-btn inline-flex mt-5 px-5 py-3 rounded-xl text-xs font-bold">Enquire on WhatsApp</a>
          </article>
        </div>

        <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">Curated product enquiry</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-2 mb-3">Pilani Starter Box</h2>
          <p className="text-sm opacity-85 leading-relaxed">Ask the team about a curated selection of currently listed Lado products. The team confirms available products, pack sizes, stock and a quote before any order. No bundle price or discount is advertised.</p>
          <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Namaste Lado Organics. Please share the current product selection, available pack sizes and a quote for a curated Lado Organics selection.")}`} target="_blank" rel="noopener noreferrer" className="primary-btn inline-flex mt-5 px-5 py-3 rounded-xl text-xs font-bold">Request starter-box quote</a>
        </article>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">Helpful answers</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 mb-5">Questions before you order</h2>
            <div className="space-y-3">
              {FAQS.map((item, index) => (
                <details key={item.q} open={openFaq === index} onToggle={(event) => {
                  setOpenFaq(event.currentTarget.open ? index : null);
                }} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <summary className="cursor-pointer font-bold text-sm">{item.q}</summary>
                  <p className="text-sm opacity-80 leading-relaxed mt-3">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">Future product interest</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-2 mb-3">What would you like us to explore next?</h2>
            <p className="text-sm opacity-80 leading-relaxed mb-5">Register interest in possible future products or workshops. This is not a pre-order, product availability claim or launch announcement.</p>
            <form onSubmit={joinWaitlist} className="space-y-3">
              <label className="block text-xs font-bold" htmlFor="lado-interest">I&apos;m interested in</label>
              <select id="lado-interest" value={interest} onChange={(e) => setInterest(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm">
                <option>Panchagavya product updates</option>
                <option>Havan samagri and dhoop updates</option>
                <option>Natural-farming workshops</option>
                <option>Bilona and biogas farm demonstrations</option>
              </select>
              <label className="block text-xs font-bold" htmlFor="lado-interest-email">Email address</label>
              <input id="lado-interest-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm" />
              <button type="submit" disabled={submitting} className="primary-btn w-full rounded-xl py-3 text-sm font-bold disabled:opacity-50">{submitting ? "Saving..." : "Register my interest"}</button>
              {status && <p role="status" className="text-xs leading-relaxed opacity-80">{status}</p>}
            </form>
          </aside>
        </div>
      </div>
    </section>
  );
}
