"use client";

import React from "react";
import Link from "next/link";

interface RecommendationsProps {
  currentSlug: string;
}

// Hardcoded logic representing the "Cow as a Coconut" circular ecosystem mapping
const ECOSYSTEM_MAPPING: Record<string, { title: string, slug: string, reason: string, price: string }[]> = {
  "a2-bilona-ghee": [
    { title: "Tharparkar Dhoop", slug: "tharparkar-dhoop", reason: "Completes the spiritual cycle using remaining Gaushala dung.", price: "₹1,000" },
    { title: "Pure Kechua Khad", slug: "pure-kechua-khad", reason: "Nourish your home garden with our biogas-powered compost.", price: "₹2,000" }
  ],
  "pure-kechua-khad": [
    { title: "A2 Bilona Ghee", slug: "a2-bilona-ghee", reason: "Experience the pure nutrition that starts our farm's cycle.", price: "₹5,000" }
  ],
  "tharparkar-dhoop": [
    { title: "A2 Bilona Ghee", slug: "a2-bilona-ghee", reason: "The flagship product of our indigenous Tharparkar herd.", price: "₹5,000" }
  ]
};

export default function ProductRecommendations({ currentSlug }: RecommendationsProps) {
  const recommendations = ECOSYSTEM_MAPPING[currentSlug] || ECOSYSTEM_MAPPING["a2-bilona-ghee"];

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-[var(--border)]">
      <h3 className="text-2xl font-serif font-bold text-[var(--mud)] mb-2">Complete the Ecosystem</h3>
      <p className="text-sm text-[var(--muted)] mb-8">Because our farm operates with zero waste, every product connects to another.</p>
      
      <div className="grid sm:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <Link href={`/store/${rec.slug}`} key={rec.slug} className="block card-earthy p-6 group hover:border-[var(--terracotta)] transition">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-serif font-bold text-lg text-[var(--mud)] group-hover:text-[var(--terracotta)] transition">{rec.title}</h4>
              <span className="text-sm font-bold text-[var(--mud)] bg-[var(--bg)] px-3 py-1 rounded-lg border border-[var(--border)]">{rec.price}</span>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed"><i className="fas fa-sync-alt mr-2 text-[var(--earth)]"></i> {rec.reason}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
