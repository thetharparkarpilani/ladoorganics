"use client";

import React, { useState, useEffect } from "react";

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
  full_name: string;
}

export default function CommunityPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [pointsBalance] = useState<number | null>(null);

  useEffect(() => {
    // Fetch approved community reviews
    fetch("/api/community/reviews")
      .then(res => res.ok ? res.json() : { reviews: [] })
      .then(data => {
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
      
    // In production, fetch specific loyalty balance from /api/community/loyalty using secure session
  }, []);

  return (
    <div className="min-h-screen organic-gradient">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold tracking-[0.2em] text-[var(--accent-forest)] mb-4 uppercase block">Module P • Lado Community</span>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-[var(--text-charcoal)] mb-6">
          Cultivating a Conscious <span className="text-[var(--accent-terracotta)] italic">Ecosystem.</span>
        </h1>
        <p className="text-lg text-[var(--text-muted)] leading-relaxed font-light mb-10">
          Join a growing collective of families dedicated to zero-waste living, unadulterated A2 nutrition, and preserving the indigenous Tharparkar heritage.
        </p>
      </section>

      {/* Loyalty & Rewards Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="card-earthy p-10 md:p-14 bg-[var(--accent-forest)] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <i className="fas fa-seedling text-9xl"></i>
          </div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-4">Lado Membership & Rewards</h2>
              <p className="text-white/80 leading-relaxed mb-8 font-light">
                Earn &quot;Gau Seva&quot; points on every verified purchase of A2 Bilona Ghee or Bhunga farm stays. Redeem your points for exclusive farm experiences, wellness boxes, or direct calf sponsorships.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">1</div>
                  <span className="font-medium">Earn 1 point for every ₹100 spent.</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">2</div>
                  <span className="font-medium">Refer a friend for a 500 point bonus.</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/70 mb-2">Your Points Balance</h3>
              {pointsBalance !== null ? (
                <div className="text-5xl font-serif font-bold text-[var(--accent-earth)] mb-4">{pointsBalance}</div>
              ) : (
                <div className="py-6">
                  <i className="fas fa-lock text-3xl text-white/50 mb-4"></i>
                  <p className="text-sm text-white/80">Log in to view your verified loyalty balance and active rewards.</p>
                </div>
              )}
              <a href="/dashboard" className="inline-block w-full bg-white text-[var(--accent-forest)] py-3 rounded-full font-bold text-sm tracking-wide mt-4 hover:bg-[var(--bg-sand)] transition">
                Access Dashboard
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Reviews Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border-light)] mt-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-charcoal)] mb-4">Verified Ecosystem Experiences</h2>
          <p className="text-[var(--text-muted)]">Read authentic experiences from our community. We do not invent or manipulate reviews.</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[var(--text-muted)] animate-pulse">Loading verified community reviews...</div>
        ) : reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="card-earthy p-8 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star text-sm ${i < review.rating ? "text-[var(--accent-earth)]" : "text-gray-300"}`}></i>
                  ))}
                </div>
                <h3 className="font-bold text-[var(--text-charcoal)] mb-2">{review.title || "Lado Organics Experience"}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-grow italic mb-6">&quot;{review.comment}&quot;</p>
                
                <div className="pt-4 border-t border-[var(--border-light)] flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-charcoal)]">{review.full_name || "Community Member"}</span>
                  {review.is_verified_purchase && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent-forest)] bg-[var(--accent-forest)]/10 px-2 py-1 rounded">
                      <i className="fas fa-check-circle mr-1"></i> Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card-earthy bg-[var(--bg-ivory)] border-dashed">
            <i className="far fa-comment-alt text-4xl text-[var(--text-muted)]/50 mb-4"></i>
            <h3 className="text-lg font-serif font-bold text-[var(--text-charcoal)] mb-2">No Reviews Yet</h3>
            <p className="text-sm text-[var(--text-muted)]">Be the first to share your experience with our Pilani ecosystem.</p>
          </div>
        )}
      </section>
    </div>
  );
}
