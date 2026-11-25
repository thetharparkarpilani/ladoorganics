import React from "react";

export default function Loading() {
  return (
    <main className="min-h-[55vh] grid place-items-center bg-[var(--bg,#f8f6ef)] px-5 py-16" aria-busy="true" aria-live="polite">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#d9d0bc] bg-[#fffdf7] font-serif text-2xl font-bold text-[#244b35]" aria-hidden="true">L</span>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[.22em] text-[#8c6048]">LADO ORGANICS</p>
        <p className="mt-3 font-serif text-2xl text-[#244b35]">A moment, please…</p>
        <p className="mt-2 text-xs text-[#777568]">Preparing your Lado experience.</p>
        <div className="mx-auto mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-[#e8e3d7]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#244b35]" />
        </div>
      </div>
    </main>
  );
}
