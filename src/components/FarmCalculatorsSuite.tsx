"use client";

import { useMemo, useState } from "react";
import type { LocaleCode } from "@/types/domain";
import { TRANSLATIONS } from "@/lib/i18n";

interface FarmCalculatorsSuiteProps {
  locale: LocaleCode;
}

export default function FarmCalculatorsSuite({ locale }: FarmCalculatorsSuiteProps) {
  const dict = TRANSLATIONS[locale] ?? TRANSLATIONS.en;
  const [familyMembers, setFamilyMembers] = useState(1);
  const [dailyMlPerPerson, setDailyMlPerPerson] = useState(0);
  const [gheeDays, setGheeDays] = useState(30);
  const [dhoopDays, setDhoopDays] = useState(30);
  const [dhoopSessionsPerWeek, setDhoopSessionsPerWeek] = useState(0);
  const [gardenSqFt, setGardenSqFt] = useState(100);
  const [labelRateKgPer10SqFt, setLabelRateKgPer10SqFt] = useState(0);
  const [proposedMonthlyAmount, setProposedMonthlyAmount] = useState(0);
  const [contributionMonths, setContributionMonths] = useState(1);

  const gheeUsage = useMemo(
    () => familyMembers * dailyMlPerPerson * gheeDays,
    [familyMembers, dailyMlPerPerson, gheeDays]
  );
  const dhoopSessions = useMemo(
    () => Math.ceil((dhoopSessionsPerWeek / 7) * dhoopDays),
    [dhoopSessionsPerWeek, dhoopDays]
  );
  const compostKg = useMemo(
    () => labelRateKgPer10SqFt > 0 ? (gardenSqFt / 10) * labelRateKgPer10SqFt : null,
    [gardenSqFt, labelRateKgPer10SqFt]
  );
  const proposedContributionTotal = proposedMonthlyAmount * contributionMonths;

  return (
    <section id="calculators-suite" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            Planning tools · your own assumptions
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mt-2">{dict.section_calculators}</h2>
          <p className="text-xs sm:text-sm opacity-80 max-w-2xl mx-auto mt-3">
            Use your own household usage, product-label instructions and proposed contribution amount. These tools do not set product prices, recommend dietary intake or replace product-label guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-xs">
          <article className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)]">01 · Household planning</span>
              <h3 className="mt-1 text-xl font-serif font-bold">Ghee usage planner</h3>
              <p className="mt-2 text-xs leading-6 text-[var(--muted)]">Enter your own intended usage. The default is zero and is not a dietary recommendation.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <label className="block font-bold uppercase">People
                <input type="number" min={1} max={20} value={familyMembers} onChange={(e) => setFamilyMembers(Math.min(20, Math.max(1, Number(e.target.value) || 1)))} className="mt-1 w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
              </label>
              <label className="block font-bold uppercase">Your ml / person / day
                <input type="number" min={0} max={1000} value={dailyMlPerPerson} onChange={(e) => setDailyMlPerPerson(Math.max(0, Number(e.target.value) || 0))} className="mt-1 w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
              </label>
              <label className="block font-bold uppercase">Days
                <input type="number" min={1} max={365} value={gheeDays} onChange={(e) => setGheeDays(Math.min(365, Math.max(1, Number(e.target.value) || 1)))} className="mt-1 w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
              </label>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)]">
              {dailyMlPerPerson > 0 ? (
                <p className="text-sm text-[var(--mud)]">Your planned quantity: <strong>{(gheeUsage / 1000).toFixed(2)} L</strong> ({gheeUsage.toLocaleString("en-IN")} ml)</p>
              ) : (
                <p className="text-sm text-[var(--muted)]">Enter your own usage amount to calculate a household quantity.</p>
              )}
            </div>
          </article>

          <article className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)]">02 · Routine planning</span>
              <h3 className="mt-1 text-xl font-serif font-bold">Dhoop session planner</h3>
              <p className="mt-2 text-xs leading-6 text-[var(--muted)]">Estimate the number of sessions in your chosen period. No sessions-per-box or price assumption is applied.</p>
            </div>
            <label className="block font-bold uppercase">Your sessions per week: {dhoopSessionsPerWeek}
              <input type="range" min={0} max={21} value={dhoopSessionsPerWeek} onChange={(e) => setDhoopSessionsPerWeek(Number(e.target.value))} className="mt-3 w-full accent-[#c2410c]" />
            </label>
            <label className="block font-bold uppercase">Planning period (days)
              <input type="number" min={1} max={365} value={dhoopDays} onChange={(e) => setDhoopDays(Math.min(365, Math.max(1, Number(e.target.value) || 1)))} className="mt-1 w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
            </label>
            <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)]">
              <p className="text-sm text-[var(--muted)]">Planned sessions: <strong className="font-serif text-2xl text-[var(--terracotta)]">{dhoopSessions}</strong></p>
            </div>
          </article>

          <article className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)]">03 · Product-label planning</span>
              <h3 className="mt-1 text-xl font-serif font-bold">Compost quantity planner</h3>
              <p className="mt-2 text-xs leading-6 text-[var(--muted)]">Use the application rate printed on your current product label. This calculator does not recommend an application rate.</p>
            </div>
            <label className="block font-bold uppercase">Garden / terrace area (sq. ft.): {gardenSqFt}
              <input type="range" min={10} max={5000} step={10} value={gardenSqFt} onChange={(e) => setGardenSqFt(Number(e.target.value))} className="mt-3 w-full accent-[#c2410c]" />
            </label>
            <label className="block font-bold uppercase">Label rate (kg per 10 sq. ft.)
              <input type="number" min={0} max={100} step={0.1} value={labelRateKgPer10SqFt} onChange={(e) => setLabelRateKgPer10SqFt(Math.max(0, Number(e.target.value) || 0))} className="mt-1 w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
            </label>
            <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)]">
              {compostKg !== null ? <p className="text-sm text-[var(--muted)]">Quantity at your entered label rate: <strong className="font-serif text-2xl text-[var(--terracotta)]">{compostKg.toFixed(2)} kg</strong></p> : <p className="text-sm text-[var(--muted)]">Enter the application rate from the current product label to calculate a quantity.</p>}
            </div>
          </article>

          <article className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)]">04 · Gau Seva enquiry</span>
              <h3 className="mt-1 text-xl font-serif font-bold">Proposed contribution planner</h3>
              <p className="mt-2 text-xs leading-6 text-[var(--muted)]">Enter an amount you may wish to propose. This is not an official rate, payment request or commitment.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block font-bold uppercase">Your proposed monthly amount (₹)
                <input type="number" min={0} max={1000000} step={1} value={proposedMonthlyAmount} onChange={(e) => setProposedMonthlyAmount(Math.max(0, Number(e.target.value) || 0))} className="mt-1 w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
              </label>
              <label className="block font-bold uppercase">Months
                <input type="number" min={1} max={24} value={contributionMonths} onChange={(e) => setContributionMonths(Math.min(24, Math.max(1, Number(e.target.value) || 1)))} className="mt-1 w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
              </label>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)]">
              {proposedMonthlyAmount > 0 ? <p className="text-sm text-[var(--muted)]">Your proposed total: <strong className="font-serif text-2xl text-[var(--terracotta)]">₹{proposedContributionTotal.toLocaleString("en-IN")}</strong></p> : <p className="text-sm text-[var(--muted)]">Enter a proposed amount to see your own planning total.</p>}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
