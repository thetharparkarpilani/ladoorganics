import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] grid place-items-center bg-[var(--bg,#f8f6ef)] px-5 py-16">
      <section className="w-full max-w-xl rounded-3xl border border-[var(--border,#e5dfd1)] bg-[var(--surface,#fffdf7)] p-8 text-center shadow-sm sm:p-12">
        <span className="font-serif text-6xl font-semibold text-[#244b35]" aria-hidden="true">404</span>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[.22em] text-[var(--terracotta,#9b6048)]">LADO ORGANICS · PILANI</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-[var(--mud,#2d3329)]">This path has wandered off</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--muted,#777568)]">We could not find the page you were looking for. Explore the current collection or return to the Lado Organics home page.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/store" className="rounded-full bg-[#244b35] px-6 py-3 text-xs font-bold text-white">Explore the store</Link>
          <Link href="/" className="rounded-full border border-[var(--border,#e5dfd1)] px-6 py-3 text-xs font-bold text-[var(--mud,#2d3329)]">Back home</Link>
        </div>
      </section>
    </main>
  );
}
