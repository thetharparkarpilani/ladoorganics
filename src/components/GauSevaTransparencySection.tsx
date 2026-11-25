"use client";

import React, { useEffect, useState } from "react";

interface TransparencyRow {
  calf_name: string;
  entries_count: number;
  recorded_amount_inr: string | number;
}

const FAQS = [
  {
    q: "How is Lado Organics A2 Bilona Ghee made in Pilani?",
    a: "The Lado website describes traditional curd culturing and Bilona churning from indigenous Tharparkar cow milk in Pilani, Rajasthan. Batch-specific details can be checked only when a current approved batch code is printed on the product label. If you need the code, please contact the farm team."
  },
  {
    q: "How do 'Deep Work' Bhunga Stay bookings prevent double booking?",
    a: "Stay requests check existing date ranges on the server before recording a pending request. The farm team must confirm availability and final details; submitting a request does not confirm a reservation."
  },
  {
    q: "Are shipping, taxes, or automatic recurring charges already finalized?",
    a: "Current product prices and available pack sizes are shown in the live store catalogue. Shipping charges and delivery timing are confirmed before dispatch. Repeat-delivery forms record interest only; no automatic payment or scheduled delivery is started."
  },
  {
    q: "Which sponsorship profiles are shown in the transparency ledger?",
    a: "Only sponsorship profiles and entries approved by the Lado team appear in the live ledger. New enquiries remain pending until reviewed, and no animal profile is presented as available unless the team has verified it."
  }
];

export default function GauSevaTransparencySection() {
  const [rows, setRows] = useState<TransparencyRow[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/sponsorships/transparency")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.summary)) {
          setRows(data.summary);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lado Organics",
    url: "https://ladoorganics.in",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pilani",
      addressRegion: "Rajasthan",
      addressCountry: "IN"
    }
  };

  return (
    <section id="transparency-faq" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            Gau Seva Ledger
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1 mb-2">
            Gau Seva Transparency
          </h2>
          <p className="text-xs opacity-80 mb-5 leading-relaxed">
            Displays active Gau Seva contributions recorded by the Lado team in aggregate. Pending enquiries are not counted or assigned to an individual animal profile. These figures are not an audited expenditure statement or tax receipt.
          </p>

          {rows.length === 0 ? (
            <p className="text-xs opacity-70 p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)]">
              No active Gau Seva contribution records are available to display yet. New enquiries remain pending until reviewed by the Lado team.
            </p>
          ) : (
            <ul className="space-y-3 text-xs">
              {rows.map((r) => (
                <li
                  key={r.calf_name}
                  className="p-3.5 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-sm">{r.calf_name}</p>
                    <p className="opacity-70">{r.entries_count} recorded entry(s)</p>
                  </div>
                  <span className="font-serif font-bold text-base text-[var(--terracotta)]">
                    ₹{Number(r.recorded_amount_inr).toLocaleString("en-IN")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-7 bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1 mb-5">
            Clear Answers Before You Order or Visit
          </h2>

          <div className="space-y-3 text-xs sm:text-sm">
            {FAQS.map((item) => (
              <details
                key={item.q}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4"
              >
                <summary className="font-bold cursor-pointer list-none flex items-center justify-between gap-2">
                  <span>{item.q}</span>
                  <span className="text-[var(--terracotta)] font-mono">+</span>
                </summary>
                <p className="mt-2.5 opacity-80 leading-relaxed text-xs sm:text-sm">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
