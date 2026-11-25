"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useCart } from "@/context/CartContext";

export default function PremiumHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { locale, setLocale } = useLocale();
  const { itemCount, setDrawerOpen } = useCart();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 flex flex-col border-b border-[var(--border)] bg-[var(--surface)]/95 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-center gap-2 bg-[#204E36] px-4 py-2 text-center text-[9px] font-bold uppercase tracking-[.2em] text-[#f7ebcf]">
        <span>PILANI · RAJASTHAN · INDIA</span>
        <span aria-hidden="true">·</span>
        <span>LADO LOVE PURE</span>
      </div>

      <nav aria-label="Main navigation" className="glass-nav transition-all duration-300">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-3 md:flex-row md:px-6">
          <Link href="/" aria-label="Lado Organics home" className="inline-flex shrink-0 items-center">
            <Image src="/lado-organics-logo.svg" alt="Lado Organics — Lado Love Pure" width={180} height={120} priority className="h-14 w-auto object-contain md:h-16" />
          </Link>

          <form onSubmit={handleSearch} role="search" className="relative w-full md:w-96">
            <label htmlFor="premium-header-search" className="sr-only">Search Lado Organics</label>
            <input
              id="premium-header-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products and stories…"
              className="w-full rounded-full border border-[var(--border)] bg-[var(--bg)] py-2.5 pl-5 pr-12 text-xs text-[var(--mud)] shadow-inner focus:border-[var(--terracotta)] focus:outline-none"
            />
            <button type="submit" aria-label="Search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-sm text-[var(--mud)]/70 hover:text-[var(--terracotta)]">⌕</button>
          </form>

          <div className="flex items-center gap-4 text-sm text-[var(--mud)]">
            <label className="sr-only" htmlFor="premium-header-locale">Language</label>
            <select id="premium-header-locale" value={locale} onChange={(event) => setLocale(event.target.value as typeof locale)} className="cursor-pointer rounded border border-[var(--border)] bg-transparent p-1.5 text-xs font-bold text-[var(--mud)]">
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="ma">मारवाड़ी</option>
            </select>
            <Link href="/dashboard" className="transition hover:text-[var(--terracotta)]" title="My Lado Journey" aria-label="My Lado Journey">♙</Link>
            <button type="button" onClick={() => setDrawerOpen(true)} className="relative cursor-pointer transition hover:text-[var(--terracotta)]" title="Shopping bag" aria-label={`Open shopping bag, ${itemCount} items`}>
              <span aria-hidden="true">♧</span>
              <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--terracotta)] px-1 text-[9px] font-bold text-white">{itemCount}</span>
            </button>
          </div>
        </div>

        <div className="border-t border-[var(--border)] bg-white/60 px-4 py-2.5 md:px-6">
          <div className="mx-auto flex max-w-7xl justify-start gap-7 overflow-x-auto whitespace-nowrap text-[10px] font-bold tracking-widest text-[var(--mud)] sm:justify-center sm:text-xs">
            <Link href="/" className="transition hover:text-[var(--terracotta)]">HOME</Link>
            <Link href="/store" className="transition hover:text-[var(--terracotta)]">SHOP</Link>
            <Link href="/#farm-world" className="transition hover:text-[var(--terracotta)]">OUR FARM</Link>
            <Link href="/#adopt" className="transition hover:text-[var(--terracotta)]">GAU SEVA</Link>
            <Link href="/#experiences" className="transition hover:text-[var(--terracotta)]">FARM STAYS</Link>
            <Link href="/trace" className="transition hover:text-[var(--terracotta)]">TRACEABILITY</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
