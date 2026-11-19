"use client";

import React, { useMemo, useState } from "react";

interface FarmExperienceSectionProps {
  whatsappNumber: string;
}

const CALF_OPTIONS = ["Dholi Sheri", "Tara", "Roshni"] as const;
const PLAN_OPTIONS = [
  { value: "one_time", label: "One-Time Contribution" },
  { value: "monthly", label: "Monthly Sponsorship" },
  { value: "yearly", label: "Yearly Sponsorship" }
] as const;

export default function FarmExperienceSection({ whatsappNumber }: FarmExperienceSectionProps) {
  // Calf Sponsorship state
  const [calfName, setCalfName] = useState<string>("Dholi Sheri");
  const [planType, setPlanType] = useState<string>("monthly");
  const [amountInr, setAmountInr] = useState<string>("2100");
  const [sponsorName, setSponsorName] = useState<string>("");
  const [sponsorEmail, setSponsorEmail] = useState<string>("");
  const [sponsorPhone, setSponsorPhone] = useState<string>("");
  const [sponLoading, setSponLoading] = useState(false);
  const [sponMessage, setSponMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Bhunga Stay state
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [bookLoading, setBookLoading] = useState(false);
  const [bookMessage, setBookMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const estimatedStayInr = useMemo(() => {
    if (!checkIn || !checkOut) return 4000;
    const s = Date.parse(`${checkIn}T00:00:00Z`);
    const e = Date.parse(`${checkOut}T00:00:00Z`);
    if (!Number.isFinite(s) || !Number.isFinite(e) || e <= s) return 4000;
    const nights = Math.round((e - s) / (1000 * 60 * 60 * 24));
    return nights * 4000;
  }, [checkIn, checkOut]);

  const handleSponsorshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSponMessage(null);
    setSponLoading(true);
    try {
      const res = await fetch("/api/sponsorships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calfName,
          planType,
          amountInr: Number(amountInr),
          sponsorName,
          sponsorEmail,
          sponsorPhone
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setSponMessage({ type: "err", text: data?.error || "Could not submit sponsorship request." });
      } else {
        setSponMessage({
          type: "ok",
          text: `Sponsorship request recorded (#${String(data.sponsorship?.id || "").slice(0, 8)}) for ${calfName} (${planType}, ₹${Number(amountInr).toLocaleString("en-IN")}). Confirm payment & details on WhatsApp.`
        });
        setSponsorName("");
        setSponsorEmail("");
        setSponsorPhone("");
      }
    } catch {
      setSponMessage({ type: "err", text: "Network error while submitting sponsorship request." });
    } finally {
      setSponLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookMessage(null);
    setBookLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          guestEmail,
          guestPhone,
          checkIn,
          checkOut,
          guestsCount
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setBookMessage({ type: "err", text: data?.error || "Could not create reservation request." });
      } else {
        setBookMessage({
          type: "ok",
          text: `Stay request created for ${data.booking?.nights_count} night(s) — Estimated total ₹${Number(data.booking?.total_amount_inr || 0).toLocaleString("en-IN")} (Status: ${data.booking?.status}).`
        });
        setGuestName("");
        setGuestEmail("");
        setGuestPhone("");
        setCheckIn("");
        setCheckOut("");
      }
    } catch {
      setBookMessage({ type: "err", text: "Network error while creating stay booking." });
    } finally {
      setBookLoading(false);
    }
  };

  return (
    <section id="experiences" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Calf Sponsorship Form */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            Gau Seva • Pilani Gaushala
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold mt-1 mb-2">
            Sponsor a Tharparkar Calf
          </h3>
          <p className="text-xs sm:text-sm opacity-80 mb-6">
            Register a sponsorship interest for Dholi Sheri, Tara, or Roshni. Payment and tax/receipt details are handled transparently with no unverified tax-deduction claims.
          </p>

          <form onSubmit={handleSponsorshipSubmit} className="space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Calf Profile</label>
                <select
                  value={calfName}
                  onChange={(e) => setCalfName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                >
                  {CALF_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Plan Type</label>
                <select
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                >
                  {PLAN_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Contribution Amount (₹ INR)</label>
              <input
                type="number"
                min={100}
                max={1000000}
                step={1}
                required
                value={amountInr}
                onChange={(e) => setAmountInr(e.target.value)}
                className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="Full name"
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={sponsorEmail}
                  onChange={(e) => setSponsorEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Phone / WhatsApp (Optional)</label>
              <input
                type="tel"
                value={sponsorPhone}
                onChange={(e) => setSponsorPhone(e.target.value)}
                placeholder="+91..."
                className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
              />
            </div>

            {sponMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs font-medium ${
                  sponMessage.type === "ok"
                    ? "bg-green-50 text-green-900 border border-green-200"
                    : "bg-red-50 text-red-900 border border-red-200"
                }`}
              >
                {sponMessage.text}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={sponLoading}
                className="primary-btn px-6 py-3 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {sponLoading ? "Submitting..." : "Submit Sponsorship Request"}
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Namaste Lado Organics! I would like to sponsor ${calfName} (${planType}, ₹${amountInr}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[var(--terracotta)] hover:underline"
              >
                Or chat on WhatsApp ↗
              </a>
            </div>
          </form>
        </div>

        {/* "Deep Work" Bhunga Stay Booking Form */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            Agro-Tourism • Pilani, Rajasthan
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold mt-1 mb-2">
            Reserve “Deep Work” Bhunga Stay
          </h3>
          <p className="text-xs sm:text-sm opacity-80 mb-6">
            Listed rate: ₹4,000 per night. Server checks overlapping dates automatically to prevent double bookings.
          </p>

          <form onSubmit={handleBookingSubmit} className="space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Check-In</label>
                <input
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Check-Out</label>
                <input
                  type="date"
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Guests (1–4)</label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  required
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Estimated Stay Base</label>
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] font-serif font-bold text-[var(--terracotta)]">
                  ₹{estimatedStayInr.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Guest Name</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Full name"
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Phone</label>
              <input
                type="tel"
                required
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+91..."
                className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
              />
            </div>

            {bookMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs font-medium ${
                  bookMessage.type === "ok"
                    ? "bg-green-50 text-green-900 border border-green-200"
                    : "bg-red-50 text-red-900 border border-red-200"
                }`}
              >
                {bookMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={bookLoading}
              className="primary-btn px-6 py-3 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {bookLoading ? "Checking Availability..." : "Request Bhunga Stay"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
