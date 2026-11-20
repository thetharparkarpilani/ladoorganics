"use client";

import React, { useMemo, useState } from "react";

interface BuildYourOwnExperienceProps {
  whatsappNumber: string;
}

interface FarmActivityOption {
  id: string;
  title: string;
  duration: string;
  description: string;
  addonInr: number; // 0 = included / confirm custom fee with Pilani host
}

const ACTIVITIES: FarmActivityOption[] = [
  {
    id: "bilona-workshop",
    title: "Traditional Bilona Ghee Churning Session",
    duration: "Morning Session",
    description: "Observe curd culturing and wooden Bilona churning at the Pilani unit.",
    addonInr: 0
  },
  {
    id: "biogas-vermicompost",
    title: "Biogas & Pure Kechua Khad Demonstration",
    duration: "90 Mins",
    description: "Walk through the anaerobic biogas digester and vermicompost beds.",
    addonInr: 0
  },
  {
    id: "calf-care",
    title: "Tharparkar Gaushala & Calf Care",
    duration: "Morning / Evening",
    description: "Spend time with Dholi Sheri, Tara, and Roshni during feeding hours.",
    addonInr: 0
  },
  {
    id: "organic-farm-walk",
    title: "Pilani Farm Tour & Traditional Meal",
    duration: "Half Day",
    description: "Guided farm walk in Pilani with satvik A2 dairy meal options.",
    addonInr: 0
  }
];

export default function BuildYourOwnExperience({ whatsappNumber }: BuildYourOwnExperienceProps) {
  const [nights, setNights] = useState<number>(2);
  const [guests, setGuests] = useState<number>(1);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    "bilona-workshop",
    "calf-care"
  ]);
  const [checkIn, setCheckIn] = useState<string>("");
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const toggleActivity = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const packageSummary = useMemo(() => {
    const stayBaseInr = nights * 4000;
    const chosen = ACTIVITIES.filter((a) => selectedActivities.includes(a.id));
    const addonsInr = chosen.reduce((sum, a) => sum + a.addonInr, 0);
    return {
      stayBaseInr,
      addonsInr,
      totalInr: stayBaseInr + addonsInr,
      chosenTitles: chosen.map((c) => c.title)
    };
  }, [nights, selectedActivities]);

  const computedCheckOut = useMemo(() => {
    if (!checkIn || nights < 1) return "";
    const startMs = Date.parse(`${checkIn}T00:00:00Z`);
    if (!Number.isFinite(startMs)) return "";
    const out = new Date(startMs + nights * 24 * 60 * 60 * 1000);
    return out.toISOString().slice(0, 10);
  }, [checkIn, nights]);

  const handleBookPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!checkIn || !computedCheckOut) {
      setFeedback({ type: "err", text: "Please choose a valid check-in date." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          guestEmail,
          guestPhone,
          checkIn,
          checkOut: computedCheckOut,
          guestsCount: guests
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "err", text: data?.error || "Could not reserve selected dates." });
      } else {
        setFeedback({
          type: "ok",
          text: `Package request recorded (#${String(data.booking?.id || "").slice(0, 8)}) for ${nights} night(s) (${checkIn} to ${computedCheckOut}) with ${packageSummary.chosenTitles.length} selected experience(s). Base stay estimate: ₹${packageSummary.totalInr.toLocaleString("en-IN")}.`
        });
        setGuestName("");
        setGuestEmail("");
        setGuestPhone("");
      }
    } catch {
      setFeedback({ type: "err", text: "Network error while submitting package request." });
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappPackageUrl = () => {
    const acts =
      packageSummary.chosenTitles.length > 0
        ? packageSummary.chosenTitles.join(", ")
        : "Bhunga stay only";
    const msg = [
      "Namaste Lado Organics!",
      "Build Your Own Farm Experience Package:",
      `- Accommodation: "Deep Work" Bhunga Stay (${nights} night(s) @ ₹4,000/night)`,
      `- Guests: ${guests}`,
      `- Check-in: ${checkIn || "Flexible"}`,
      `- Selected Experiences: ${acts}`,
      `- Estimated Base Stay Total: ₹${packageSummary.totalInr.toLocaleString("en-IN")}`,
      "Please confirm availability and any custom workshop/meal pricing."
    ].join("\n");
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section id="build-experience" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
          Custom Agro-Tourism & Workshops • Pilani
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-1 mb-2">
          Build Your Own Farm Experience
        </h2>
        <p className="text-xs sm:text-sm opacity-80 mb-8 max-w-3xl">
          Combine “Deep Work” Bhunga accommodation (₹4,000/night) with hands-on Pilani farm experiences. Dates are checked against existing bookings on the server to prevent double bookings.
        </p>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">
                  Bhunga Stay Nights: {nights} (₹{(nights * 4000).toLocaleString("en-IN")})
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={nights}
                  onChange={(e) => setNights(Number(e.target.value))}
                  className="w-full accent-[#c2410c]"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Guests (1–4): {guests}</label>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full accent-[#c2410c]"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase mb-3">Select Farm Activities & Workshops</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {ACTIVITIES.map((act) => {
                  const active = selectedActivities.includes(act.id);
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => toggleActivity(act.id)}
                      className={`text-left p-4 rounded-2xl border transition cursor-pointer ${
                        active
                          ? "border-[var(--terracotta)] bg-[var(--bg)] shadow-sm"
                          : "border-[var(--border)] bg-transparent opacity-80 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-[var(--terracotta)] mb-1">
                        <span>{act.duration}</span>
                        <span>{active ? "✓ Selected" : "+ Add"}</span>
                      </div>
                      <p className="font-serif font-bold text-sm mb-1">{act.title}</p>
                      <p className="text-xs opacity-75 leading-relaxed">{act.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleBookPackage}
            className="lg:col-span-5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6 space-y-3.5 text-xs"
          >
            <div className="flex items-baseline justify-between pb-3 border-b border-[var(--border)]">
              <span className="font-bold uppercase opacity-75">Configured Package Base</span>
              <span className="text-2xl font-serif font-bold text-[var(--terracotta)]">
                ₹{packageSummary.totalInr.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[11px] opacity-75">
              Includes {nights} night(s) Bhunga Stay (@ ₹4,000/night) + {packageSummary.chosenTitles.length} selected experience(s). Any custom workshop/meal add-on rates are confirmed by the Pilani host.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold uppercase mb-1">Check-In Date</label>
                <input
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Auto Check-Out</label>
                <input
                  type="text"
                  readOnly
                  value={computedCheckOut || "Select check-in"}
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] opacity-75"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase mb-1">Guest Full Name</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your name"
                className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+91..."
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
                />
              </div>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl font-medium ${
                  feedback.type === "ok"
                    ? "bg-green-50 text-green-900 border border-green-200"
                    : "bg-red-50 text-red-900 border border-red-200"
                }`}
              >
                {feedback.text}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full primary-btn py-3 rounded-xl font-bold cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Checking Availability..." : "Request Custom Experience Package"}
            </button>

            <a
              href={whatsappPackageUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-2.5 rounded-xl border border-[var(--border)] font-bold hover:border-[var(--terracotta)]"
            >
              Share Package on WhatsApp ↗
            </a>
          </form>
        </div>
      </div>
    </section>
  );
}
