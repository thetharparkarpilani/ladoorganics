"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type StayBooking = {
  id: string;
  stay_slug: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  nights_count: number;
  total_amount_inr: number | string;
  status: string;
  created_at: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function statusLabel(value: string) {
  return (value || "pending").replaceAll("_", " ");
}

export default function BhungaStaysPage() {
  const [bookings, setBookings] = useState<StayBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/dashboard?mode=customer", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Unable to load your stay requests.");
        }
        if (active) {
          setBookings(Array.isArray(result.bookings) ? result.bookings : []);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load your stay requests.");
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
        <h1 className="mt-3 font-serif text-3xl font-bold text-[var(--mud)]">Bhunga Farm Stays</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          View the stay requests associated with your signed-in Google account.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)]">
          Loading your stay requests...
        </div>
      ) : error ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          {error}
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <article key={booking.id} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[var(--mud)]">Bhunga Farm Stay</h2>
                  <p className="mt-1 font-mono text-xs text-[var(--muted)]">Booking #{booking.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold capitalize text-[var(--terracotta)]">
                  {statusLabel(booking.status)}
                </span>
              </div>

              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-[var(--muted)]">Check-in</dt>
                  <dd className="mt-1 font-semibold text-[var(--mud)]">{formatDate(booking.check_in)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--muted)]">Check-out</dt>
                  <dd className="mt-1 font-semibold text-[var(--mud)]">{formatDate(booking.check_out)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--muted)]">Guests</dt>
                  <dd className="mt-1 font-semibold text-[var(--mud)]">{booking.guests_count}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--muted)]">Nights</dt>
                  <dd className="mt-1 font-semibold text-[var(--mud)]">{booking.nights_count}</dd>
                </div>
              </dl>

              <div className="mt-5 border-t border-[var(--border)] pt-4">
                <p className="text-xs text-[var(--muted)]">Estimated booking amount</p>
                <p className="mt-1 text-lg font-bold text-[var(--terracotta)]">
                  ₹{Number(booking.total_amount_inr || 0).toLocaleString("en-IN")}
                </p>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  A pending request is not a confirmed reservation. The farm team will confirm availability and final details.
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <h2 className="font-serif text-xl font-bold text-[var(--mud)]">No farm stay requests yet</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Stay requests made with this Google account email will appear here.
          </p>
          <Link href="/#farm-stay" className="primary-btn mt-5 inline-flex rounded-full px-6 py-3 text-sm font-bold">
            Explore farm stays
          </Link>
        </div>
      )}
    </section>
  );
}
