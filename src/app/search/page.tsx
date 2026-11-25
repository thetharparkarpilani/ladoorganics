"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

type ProductResult = {
  slug: string;
  nameEn: string;
  nameHi: string | null;
  nameMa: string | null;
  description: string;
  priceInr: number;
  variantLabel: string;
};
type PageResult = { title: string; excerpt: string; href: string; key: string };
type SearchResponse = { products?: ProductResult[]; pages?: PageResult[]; error?: string };

export default function SearchPage() {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductResult[]>([]);
  const [pages, setPages] = useState<PageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const copy = locale === "hi" ? {
    kicker: "LADO ORGANICS • खोज", title: "आप क्या खोज रहे हैं?",
    intro: "उत्पादों, खेती की जानकारी और Lado Organics की प्रकाशित गाइड में खोजें।",
    placeholder: "घी, धूप, खाद, खेत की जानकारी…", search: "खोजें",
    products: "उत्पाद", guides: "जानकारी और गाइड",
    empty: "इस खोज से कोई मेल नहीं मिला। दूसरे शब्दों से कोशिश करें।",
    start: "उत्पाद, बैच ट्रेसबिलिटी, खेत या ऑर्डर सहायता खोजें।",
    loading: "खोज रहे हैं…", error: "खोज अभी उपलब्ध नहीं है। कृपया फिर कोशिश करें।",
    view: "उत्पाद देखें", listed: "से शुरू", library: "लाइब्रेरी में पढ़ें",
  } : locale === "ma" ? {
    kicker: "LADO ORGANICS • खोज", title: "थां काई खोजणो चाहो हो?",
    intro: "सामान, खेती री जानकारी अर Lado Organics री लिखी गाइड खोजो।",
    placeholder: "घी, धूप, खाद, खेत री जानकारी…", search: "खोजो",
    products: "सामान", guides: "जानकारी अर गाइड",
    empty: "ई खोज सूं कोई मेल कोनी मिल्यो। दूजा शब्द लिखकै देखो।",
    start: "सामान, बैच जांच, खेत या ऑर्डर मदद खोजो।",
    loading: "खोज चालू है…", error: "खोज अभी उपलब्ध कोनी। फेर कोशिश करो।",
    view: "सामान देखो", listed: "सूं शुरू", library: "लाइब्रेरी में पढ़ो",
  } : {
    kicker: "LADO ORGANICS • DISCOVER", title: "What are you looking for?",
    intro: "Search products, farm information and published Lado Organics guides in one place.",
    placeholder: "Try ghee, dhoop, compost, farm…", search: "Search",
    products: "Products", guides: "Information & guides",
    empty: "No matches found. Try another word or a shorter phrase.",
    start: "Search for products, batch traceability, the farm or order support.",
    loading: "Searching…", error: "Search is temporarily unavailable. Please try again.",
    view: "View product", listed: "From", library: "Read in the library",
  };

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q") || "";
    setQuery(initial);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setProducts([]);
      setPages([]);
      setSearched(false);
      setError("");
      return;
    }
    const controller = new AbortController();
    const delay = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await response.json() as SearchResponse;
        if (!response.ok) throw new Error(data.error || copy.error);
        setProducts(Array.isArray(data.products) ? data.products : []);
        setPages(Array.isArray(data.pages) ? data.pages : []);
        setSearched(true);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : copy.error);
          setSearched(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);
    return () => {
      window.clearTimeout(delay);
      controller.abort();
    };
  }, [query, copy.error]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (value.length >= 2) window.history.replaceState(null, "", `/search?q=${encodeURIComponent(value)}`);
  };

  const resultCount = products.length + pages.length;

  return (
    <main className="min-h-[70vh] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <header className="max-w-3xl mx-auto text-center mb-10">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--terracotta)]">{copy.kicker}</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-bold text-[var(--mud)]">{copy.title}</h1>
        <p className="mt-4 text-sm sm:text-base text-[var(--muted)]">{copy.intro}</p>
      </header>

      <form onSubmit={submit} role="search" className="max-w-3xl mx-auto flex gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-sm">
        <label htmlFor="lado-site-search" className="sr-only">{copy.placeholder}</label>
        <input id="lado-site-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.placeholder} autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none" />
        <button type="submit" disabled={query.trim().length < 2}
          className="rounded-xl bg-[var(--terracotta)] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{copy.search}</button>
      </form>

      <section className="max-w-5xl mx-auto mt-10" aria-live="polite">
        {loading && <p className="py-8 text-center text-sm text-[var(--muted)]">{copy.loading}</p>}
        {!loading && error && <p role="alert" className="py-8 text-center text-sm text-red-700">{error}</p>}
        {!loading && !error && !searched && <p className="py-8 text-center text-sm text-[var(--muted)]">{copy.start}</p>}
        {!loading && !error && searched && resultCount === 0 && <p className="py-8 text-center text-sm text-[var(--muted)]">{copy.empty}</p>}

        {products.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-5 font-serif text-2xl font-bold text-[var(--mud)]">{copy.products}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const name = locale === "hi" ? product.nameHi || product.nameEn : locale === "ma" ? product.nameMa || product.nameEn : product.nameEn;
                return (
                  <Link key={product.slug} href={`/store/${product.slug}`}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--terracotta)] hover:shadow-md">
                    <p className="font-serif text-lg font-bold text-[var(--mud)]">{name}</p>
                    <p className="mt-2 text-sm text-[var(--muted)] line-clamp-3">{product.description}</p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                      <span className="font-bold text-[var(--terracotta)]">₹{product.priceInr.toLocaleString("en-IN")} <small className="font-normal text-[var(--muted)]">{product.variantLabel}</small></span>
                      <span className="text-xs font-bold text-[var(--terracotta)]">{copy.view} ↗</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {pages.length > 0 && (
          <div>
            <h2 className="mb-5 font-serif text-2xl font-bold text-[var(--mud)]">{copy.guides}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {pages.map((item, index) => (
                <Link key={item.key + index} href={item.href}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--terracotta)]">
                  <p className="font-serif text-lg font-bold text-[var(--mud)]">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] line-clamp-3">{item.excerpt}</p>
                  <span className="mt-4 inline-block text-xs font-bold text-[var(--terracotta)]">{copy.library} ↗</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
