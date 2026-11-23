import React from "react";
import Link from "next/link";

export default function PoliciesPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link href="/" className="text-sm font-bold text-[var(--terracotta)] hover:underline">
          ← Back to Lado Organics Home
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)]">
          Draft Templates • Legal Review Required
        </span>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">
            Policies & Legal Information
          </h1>
          <p className="text-xs sm:text-sm opacity-80">
            Entity: Lado Organics • Pilani, Jhunjhunu, Rajasthan • MSME: UDYAM-RJ-21-0104324. These templates must be reviewed and finalized by legal counsel before live commercial operation.
          </p>
        </div>

        <section className="space-y-2 border-t border-[var(--border)] pt-6">
          <h2 className="text-xl font-serif font-bold">1. Privacy Policy (Template)</h2>
          <p className="text-sm opacity-85 leading-relaxed">
            Lado Organics collects contact, shipping, booking, and enquiry details to fulfil orders, Bhunga stay reservations, calf sponsorship updates, and requested communications. Messages submitted to Lado AI may be processed by an external AI service to generate replies; customers should not submit passwords, OTPs, UPI PINs, payment credentials, or sensitive personal information in chat. Marketing notifications require explicit consent. This privacy-policy template must be reviewed and finalized before commercial operation.
          </p>
        </section>

        <section className="space-y-2 border-t border-[var(--border)] pt-6">
          <h2 className="text-xl font-serif font-bold">2. Terms of Use (Template)</h2>
          <p className="text-sm opacity-85 leading-relaxed">
            Listed baseline prices (A2 Bilona Ghee ₹5,000/1L, Tharparkar Dhoop ₹1,000/Box, Pure Kechua Khad ₹2,000/5kg, “Deep Work” Bhunga Stay ₹4,000/Night) are subject to batch/date availability and confirmed shipping or tax calculations prior to final settlement.
          </p>
        </section>

        <section className="space-y-2 border-t border-[var(--border)] pt-6">
          <h2 className="text-xl font-serif font-bold">3. Shipping Policy (Template)</h2>
          <p className="text-sm opacity-85 leading-relaxed">
            Dispatch timelines, courier partners, and shipping fees are confirmed per order based on destination PIN code and batch packaging schedule in Pilani, Rajasthan.
          </p>
        </section>

        <section className="space-y-2 border-t border-[var(--border)] pt-6">
          <h2 className="text-xl font-serif font-bold">4. Cancellation & Refund Policy (Template)</h2>
          <p className="text-sm opacity-85 leading-relaxed">
            Orders may be cancelled prior to dispatch from Pilani. Bhunga stay rescheduling/cancellation windows and perishable dairy/food return rules must be confirmed by the business administrator prior to payment capture.
          </p>
        </section>
      </div>
    </div>
  );
}
