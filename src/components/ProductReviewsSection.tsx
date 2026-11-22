"use client";

import React, { useEffect, useState } from "react";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  created_at: string;
  full_name: string | null;
}

export default function ProductReviewsSection({ productSlug }: { productSlug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/community/reviews?slug=${encodeURIComponent(productSlug)}`)
      .then((response) => {
        if (!response.ok) throw new Error("Reviews unavailable");
        return response.json();
      })
      .then((data) => {
        if (active) setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [productSlug]);

  return (
    <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">Customer feedback</p>
          <h2 className="font-serif text-2xl font-bold mt-1">Published reviews</h2>
        </div>
        <span className="text-xs opacity-65">Approved reviews only</span>
      </div>
      {loading ? (
        <p className="text-sm opacity-70">Loading published reviews…</p>
      ) : failed ? (
        <p className="text-sm opacity-70">Reviews are temporarily unavailable. Please check again later.</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm opacity-70">No approved customer reviews have been published for this product yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-amber-600" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(Math.max(0, Math.min(5, review.rating)))}{"☆".repeat(5 - Math.max(0, Math.min(5, review.rating)))}</span>
                {review.is_verified_purchase && <span className="text-[10px] font-bold uppercase tracking-wide">Verified purchase</span>}
              </div>
              {review.title && <h3 className="font-bold mt-2">{review.title}</h3>}
              {review.comment && <p className="text-sm opacity-80 leading-relaxed mt-2">{review.comment}</p>}
              <p className="text-xs opacity-60 mt-3">{review.full_name || "Lado customer"} · {new Date(review.created_at).toLocaleDateString("en-IN")}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
