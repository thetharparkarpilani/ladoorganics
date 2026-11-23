"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Sponsorship = {
  id: string;
  calf_name: string;
  plan_type: string;
  amount_inr: number | string;
  status: string;
  created_at: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function readable(value: string) {
  return (value || "pending").replaceAll("_", " ");
}

export default function GauSevaPage() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/dashboard?mode=customer", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Unable to load your Gau Seva records.");
        }
        if (active) {
          setSponsorships(Array.isArray(result.sponsorships) ? result.sponsorships : []);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load your Gau Seva records.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs font-semibold text-[var(--terracotta)] hover:underline">
          ← Back to My Journey
        </Link>
        <h1 className="mt-3 font-serif text-3xl font-bold text-[var(--mud)]">Gau Seva Sponsorships</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          View the Gau Seva sponsorship records associated with your signed-in Google account.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)]">
          Loading your sponsorship records...
        </div>
      ) : error ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          {error}
        </div>
      ) : sponsorships.length > 0 ? (
        <div className="space-y-4">
          {sponsorships.map((sponsorship) => (
            <article key={sponsorship.id} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[var(--mud)]">
                    {sponsorship.calf_name ? sponsorship.calf_name : "Gau Seva Sponsorship"}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-[var(--muted)]">
                    Sponsorship #{sponsorship.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold capitalize text-[var(--terracotta)]">
                  {readable(sponsorship.status)}
                </span>
              </div>

              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-[var(--muted)]">Sponsorship plan</dt>
                  <dd className="mt-1 font-semibold capitalize text-[var(--mud)]">{readable(sponsorship.plan_type)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--muted)]">Record date</dt>
                  <dd className="mt-1 font-semibold text-[var(--mud)]">{formatDate(sponsorship.created_at)}</dd>
                </div>
              </dl>

              <div className="mt-5 border-t border-[var(--border)] pt-4">
                <p className="text-xs text-[var(--muted)]">Recorded sponsorship amount</p>
                <p className="mt-1 text-lg font-bold text-[var(--terracotta)]">
                  ₹{Number(sponsorship.amount_inr || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <h2 className="font-serif text-xl font-bold text-[var(--mud)]">No sponsorship records yet</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Gau Seva sponsorships registered with this Google account email will appear here.
          </p>
          <Link href="/" className="primary-btn mt-5 inline-flex rounded-full px-6 py-3 text-sm font-bold">
            Explore Lado Organics
          </Link>
        </div>
      )}
    </section>
  );
}
