"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep diagnostics in the browser console without exposing internals to visitors.
    console.error("Lado Organics route error:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] grid place-items-center bg-[var(--bg,#f8f6ef)] px-5 py-16">
      <section className="w-full max-w-xl rounded-3xl border border-[var(--border,#e5dfd1)] bg-[var(--surface,#fffdf7)] p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f3e8dc] font-serif text-2xl font-bold text-[#8c5038]" aria-hidden="true">L</span>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[.22em] text-[var(--terracotta,#9b6048)]">LADO ORGANICS · LADO LOVE PURE</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-[var(--mud,#2d3329)] sm:text-4xl">A small pause in the journey</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--muted,#777568)]">This page could not be loaded just now. Your account and order information have not been changed by this message. Please try again.</p>
        {error.digest ? <p className="mt-3 text-[10px] text-[var(--muted,#777568)]">Reference: {error.digest}</p> : null}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => reset()} className="rounded-full bg-[#244b35] px-6 py-3 text-xs font-bold text-white hover:bg-[#183526]">Try again</button>
          <Link href="/" className="rounded-full border border-[var(--border,#e5dfd1)] px-6 py-3 text-xs font-bold text-[var(--mud,#2d3329)]">Return home</Link>
        </div>
        <Link href="/contact" className="mt-6 inline-block text-xs font-semibold text-[var(--terracotta,#9b6048)] underline underline-offset-4">Contact the Lado team</Link>
      </section>
    </main>
  );
}
