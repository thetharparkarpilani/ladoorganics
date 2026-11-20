import React from "react";
import Link from "next/link";

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen organic-gradient py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-light)] pb-6">
          <Link href="/" className="hover:text-[var(--accent-terracotta)] transition">← Back to Store</Link>
          <span className="opacity-50">|</span>
          <Link href="/policies/privacy" className="hover:text-[var(--accent-terracotta)] transition">Privacy</Link>
          <Link href="/policies/terms" className="hover:text-[var(--accent-terracotta)] transition">Terms</Link>
          <Link href="/policies/shipping" className="hover:text-[var(--accent-terracotta)] transition">Shipping</Link>
          <Link href="/policies/refunds" className="hover:text-[var(--accent-terracotta)] transition">Refunds</Link>
        </div>
        <div className="card-earthy p-8 sm:p-12 shadow-sm prose prose-stone max-w-none">
          {children}
        </div>
        <p className="text-center text-xs text-[var(--text-muted)] mt-8">
          Disclaimer: These documents serve as foundational templates for Lado Organics and must undergo formal legal review.
        </p>
      </div>
    </div>
  );
}
