"use client";

import React, { useMemo, useState } from "react";
import type { LocaleCode } from "@/types/domain";
import { TRANSLATIONS } from "@/lib/i18n";

interface FarmCalculatorsSuiteProps {
  locale: LocaleCode;
}

export default function FarmCalculatorsSuite({ locale }: FarmCalculatorsSuiteProps) {
  const dict = TRANSLATIONS[locale] ?? TRANSLATIONS.en;

  // 1. Ghee quantity calculator (assumption: ~15 ml per person per day when used daily)
  const [familyMembers, setFamilyMembers] = useState<number>(4);
  const [daysPeriod, setDaysPeriod] = useState<number>(30);
  const [dailyMlPerPerson, setDailyMlPerPerson] = useState<number>(15);

  // 2. Dhoop & Compost estimators (clearly stated assumptions)
  const [dhoopSessionsPerWeek, setDhoopSessionsPerWeek] = useState<number>(7);
  const [gardenSqFt, setGardenSqFt] = useState<number>(200);

  // 3. Sponsorship estimator (assumption: monthly contribution * months)
  const [monthlySponsorInr, setMonthlySponsorInr] = useState<number>(2100);
  const [sponsorMonths, setSponsorMonths] = useState<number>(6);

  const gheeEstimate = useMemo(() => {
    const totalMl = familyMembers * dailyMlPerPerson * daysPeriod;
    const litres = totalMl / 1000;
    const fullLitrePacks = Math.max(1, Math.ceil(litres));
    const estCostInr = fullLitrePacks * 5000;
    return { totalMl, litres: litres.toFixed(2), fullLitrePacks, estCostInr };
  }, [familyMembers, dailyMlPerPerson, daysPeriod]);

  const dhoopEstimate = useMemo(() => {
    // Assumption: 1 dhoop stick/cone per session; ~30 sessions per box (admin-configurable placeholder assumption)
    const totalSessions = Math.round((dhoopSessionsPerWeek / 7) * daysPeriod);
    const boxesNeeded = Math.max(1, Math.ceil(totalSessions / 30));
    return { totalSessions, boxesNeeded, estCostInr: boxesNeeded * 1000 };
  }, [dhoopSessionsPerWeek, daysPeriod]);

  const compostEstimate = useMemo(() => {
    // Assumption: ~0.5 kg Pure Kechua Khad per 10 sq ft for initial top-dressing (not a guaranteed yield claim)
    const kgNeeded = Math.max(5, Math.ceil((gardenSqFt / 10) * 0.5));
    const bagsOf5Kg = Math.ceil(kgNeeded / 5);
    return { kgNeeded, bagsOf5Kg, estCostInr: bagsOf5Kg * 2000 };
  }, [gardenSqFt]);

  const sponsorshipTotalInr = monthlySponsorInr * sponsorMonths;

  return (
    <section id="calculators-suite" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            Assumption-Based Planning Tools
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mt-2">{dict.section_calculators}</h2>
          <p className="text-xs sm:text-sm opacity-80 max-w-2xl mx-auto mt-3">
            Estimates use explicit household or garden assumptions and baseline listed prices (₹5,000/1L Ghee, ₹1,000/Box Dhoop, ₹2,000/5kg Kechua Khad). Compost figures are planning estimates, not guaranteed agricultural outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-xs">
          {/* Ghee Quantity Calculator */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 space-y-4">
            <h3 className="text-xl font-serif font-bold">1. A2 Bilona Ghee Quantity Estimator</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold uppercase mb-1">Members</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={familyMembers}
                  onChange={(e) => setFamilyMembers(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">ml / Person / Day</label>
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={dailyMlPerPerson}
                  onChange={(e) => setDailyMlPerPerson(Math.max(5, Number(e.target.value) || 15))}
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Days</label>
                <input
                  type="number"
                  min={7}
                  max={180}
                  value={daysPeriod}
                  onChange={(e) => setDaysPeriod(Math.max(7, Number(e.target.value) || 30))}
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between">
              <div>
                <p className="opacity-75">Estimated need: <strong>{gheeEstimate.litres} L</strong> ({gheeEstimate.totalMl.toLocaleString("en-IN")} ml)</p>
                <p className="opacity-65 mt-0.5">Suggested 1L units: {gheeEstimate.fullLitrePacks} (@ ₹5,000/L)</p>
              </div>
              <span className="text-xl font-serif font-bold text-[var(--terracotta)]">
                ₹{gheeEstimate.estCostInr.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Dhoop Requirement Calculator */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 space-y-4">
            <h3 className="text-xl font-serif font-bold">2. Tharparkar Dhoop Estimator</h3>
            <div>
              <label className="block font-bold uppercase mb-1">
                Sessions per Week: {dhoopSessionsPerWeek} (over {daysPeriod} days)
              </label>
              <input
                type="range"
                min={1}
                max={21}
                value={dhoopSessionsPerWeek}
                onChange={(e) => setDhoopSessionsPerWeek(Number(e.target.value))}
                className="w-full accent-[#c2410c]"
              />
            </div>
            <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between">
              <div>
                <p className="opacity-75">Estimated sessions: <strong>{dhoopEstimate.totalSessions}</strong></p>
                <p className="opacity-65 mt-0.5">Assumption: ~30 sessions/box (@ ₹1,000/Box)</p>
              </div>
              <span className="text-xl font-serif font-bold text-[var(--terracotta)]">
                ₹{dhoopEstimate.estCostInr.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Compost Calculator */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 space-y-4">
            <h3 className="text-xl font-serif font-bold">3. Pure Kechua Khad Estimator</h3>
            <div>
              <label className="block font-bold uppercase mb-1">Garden / Terrace Area (sq. ft.): {gardenSqFt}</label>
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={gardenSqFt}
                onChange={(e) => setGardenSqFt(Number(e.target.value))}
                className="w-full accent-[#c2410c]"
              />
            </div>
            <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between">
              <div>
                <p className="opacity-75">Estimated application: <strong>{compostEstimate.kgNeeded} kg</strong> ({compostEstimate.bagsOf5Kg} × 5 kg bag)</p>
                <p className="opacity-65 mt-0.5">Assumption: 0.5 kg per 10 sq. ft. (@ ₹2,000/5 kg)</p>
              </div>
              <span className="text-xl font-serif font-bold text-[var(--terracotta)]">
                ₹{compostEstimate.estCostInr.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Calf Sponsorship Plan Estimator */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 space-y-4">
            <h3 className="text-xl font-serif font-bold">4. Calf Sponsorship Commitment Estimator</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase mb-1">Monthly Amount (₹)</label>
                <input
                  type="number"
                  min={500}
                  max={100000}
                  step={100}
                  value={monthlySponsorInr}
                  onChange={(e) => setMonthlySponsorInr(Math.max(100, Number(e.target.value) || 2100))}
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Months</label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={sponsorMonths}
                  onChange={(e) => setSponsorMonths(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between">
              <div>
                <p className="opacity-75">Commitment over <strong>{sponsorMonths} month(s)</strong></p>
                <p className="opacity-65 mt-0.5">For Dholi Sheri, Tara, or Roshni care enquiries</p>
              </div>
              <span className="text-xl font-serif font-bold text-[var(--terracotta)]">
                ₹{sponsorshipTotalInr.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
