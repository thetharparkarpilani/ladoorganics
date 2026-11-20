"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface SearchResult {
  slug: string;
  name_en: string;
  name_hi: string;
  price_inr: number;
  label: string;
}

export default function SmartSearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-start pt-20 px-4">
      <div className="w-full max-w-2xl bg-[var(--surface)] rounded-3xl shadow-2xl overflow-hidden border border-[var(--border)] relative animate-fade-in">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
          <i className="fas fa-search text-[var(--muted)] text-lg ml-2"></i>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search A2 Ghee, Dhoop, Stays..."
            className="flex-1 bg-transparent border-none focus:outline-none text-lg text-[var(--mud)] placeholder-[var(--muted)]/50 font-serif"
          />
          <button onClick={onClose} className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:border-[var(--terracotta)] transition">
            Close (Esc)
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {loading && <div className="p-8 text-center text-sm text-[var(--muted)] animate-pulse">Searching Pilani Ecosystem...</div>}
          
          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-[var(--muted)] mb-2">No direct matches found for "{query}".</p>
              <p className="text-xs font-bold text-[var(--terracotta)]">Try searching for "Ghee", "Compost", or "Stay".</p>
            </div>
          )}

          {!loading && results.map((item) => (
            <Link 
              key={item.slug} 
              href={`/store/${item.slug}`}
              onClick={onClose}
              className="flex items-center justify-between p-4 hover:bg-[var(--bg)] rounded-2xl transition border border-transparent hover:border-[var(--border)] group"
            >
              <div>
                <h4 className="font-serif font-bold text-[var(--mud)] group-hover:text-[var(--terracotta)] transition">{item.name_en} <span className="text-[10px] ml-2 opacity-50">{item.name_hi}</span></h4>
                <p className="text-xs text-[var(--muted)] uppercase tracking-widest mt-1">Farm Direct • {item.label}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-[var(--mud)]">₹{item.price_inr.toLocaleString("en-IN")}</span>
                <i className="fas fa-arrow-right ml-4 text-[var(--muted)] opacity-0 group-hover:opacity-100 transition -translate-x-4 group-hover:translate-x-0"></i>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
