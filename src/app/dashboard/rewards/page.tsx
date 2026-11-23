"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type RewardEntry = {
  id: string;
  points: number;
  transaction_type: string;
  description: string | null;
  created_at: string;
};

const transactionLabel = (value: string) =>
  value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function MyRewardsPage() {
  const [balance, setBalance] = useState(0);
  const [entries, setEntries] = useState<RewardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/rewards", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to load your rewards.");
        setBalance(Number(result.balance) || 0);
        setEntries(Array.isArray(result.entries) ? result.entries : []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load your rewards."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs font-semibold text-[var(--terracotta)] hover:underline">← Back to My Journey</Link>
        <h1 className="mt-3 text-3xl font-serif font-bold text-[var(--mud)]">Lado Rewards</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Your loyalty points and rewards activity.</p>
      </div>

      {loading && <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)]">Loading your rewards...</div>}

      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          {error}
          <div className="mt-3"><Link href="/login" className="font-semibold underline">Sign in again</Link></div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="rounded-3xl bg-[#2b180c] p-7 sm:p-9 text-[#fef3c7]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#fbbf24]">Available points balance</p>
            <p className="mt-3 font-serif text-5xl font-bold tabular-nums">{balance.toLocaleString("en-IN")}</p>
            <p className="mt-2 text-sm text-[#fde68a]/80">Points recorded in your Lado Organics rewards ledger.</p>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
            <h2 className="font-serif text-xl font-bold text-[var(--mud)]">Rewards activity</h2>
            {entries.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg)] p-8 text-center">
                <p className="font-semibold text-[var(--mud)]">No rewards activity yet</p>
                <p className="mt-2 text-sm text-[var(--muted)]">Your points history will appear here when rewards are added to your account.</p>
              </div>
            ) : (
              <div className="mt-5 divide-y divide-[var(--border)]">
                {entries.map((entry) => (
                  <article key={entry.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-sm text-[var(--mud)]">{entry.description || transactionLabel(entry.transaction_type)}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">{transactionLabel(entry.transaction_type)} · {new Date(entry.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                    </div>
                    <p className={`font-bold tabular-nums ${Number(entry.points) >= 0 ? "text-green-700" : "text-red-700"}`}>
                      {Number(entry.points) > 0 ? "+" : ""}{Number(entry.points).toLocaleString("en-IN")} pts
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
