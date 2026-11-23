"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CustomerReview = {
  id: string;
  product_slug: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
};

const productLabel = (slug: string) =>
  slug.split("-").filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/reviews", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to load your reviews.");
        setReviews(Array.isArray(result.reviews) ? result.reviews : []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load your reviews."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs font-semibold text-[var(--terracotta)] hover:underline">← Back to My Journey</Link>
        <h1 className="mt-3 text-3xl font-serif font-bold text-[var(--mud)]">My Reviews</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">See the feedback you have shared about Lado Organics products.</p>
      </div>

      {loading && (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)]">Loading your reviews...</div>
      )}

      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          {error}
          <div className="mt-3"><Link href="/login" className="font-semibold underline">Sign in again</Link></div>
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <h2 className="font-serif text-xl font-bold text-[var(--mud)]">You haven’t shared a review yet</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">After you submit a product review, it will appear here with its publication status.</p>
          <Link href="/#products" className="primary-btn mt-6 inline-flex rounded-full px-6 py-3 text-sm font-bold">Explore our products</Link>
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">{productLabel(review.product_slug)}</p>
                  <div className="mt-2 text-amber-600" aria-label={`${review.rating} out of 5 stars`}>
                    {"★".repeat(Math.max(0, Math.min(5, review.rating)))}{"☆".repeat(5 - Math.max(0, Math.min(5, review.rating)))}
                  </div>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${review.is_approved ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                  {review.is_approved ? "Published" : "Awaiting review"}
                </span>
              </div>
              {review.title && <h2 className="mt-4 font-serif text-lg font-bold text-[var(--mud)]">{review.title}</h2>}
              {review.comment && <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)]">{review.comment}</p>}
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
                <span>Submitted {new Date(review.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                {review.is_verified_purchase && <span>· Verified purchase</span>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
