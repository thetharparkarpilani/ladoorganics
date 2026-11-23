"use client";

import React, { useEffect, useState } from "react";

interface DashboardOrder {
  id: string | number;
  order_number: string;
  status: string;
  total_inr: number | string;
}
interface DashboardSponsorship {
  id: string | number;
  calf_name: string;
  plan_type: string;
  amount_inr: number | string;
}
interface DashboardData {
  profile?: { name?: string | null } | null;
  orders?: DashboardOrder[];
  sponsorships?: DashboardSponsorship[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch secure server-side profile data
    fetch("/api/dashboard/customer")
      .then((res) => {
        if (!res.ok) throw new Error("Please log in to view your journey.");
        return res.json();
      })
      .then((json) => {
        setData(json as DashboardData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="h-64 flex items-center justify-center font-mono text-sm text-[var(--muted)] animate-pulse">Decrypting secure ecosystem records...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-900 p-8 rounded-3xl text-center">
        <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
        <p className="text-sm">{error}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="/login" className="primary-btn rounded-full px-6 py-2 text-sm">Sign in with Google</a>
          <a href="/" className="rounded-full border border-red-200 px-6 py-2 text-sm">Return Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#2b180c] p-8 sm:p-10 rounded-3xl text-[#fef3c7] relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#fbbf24] mb-2 block">Lado Organics Ecosystem</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-4">Namaste, {data?.profile?.name || "Patron"}</h1>
          <p className="text-[#fde68a]/80 text-sm max-w-lg leading-relaxed">
            Welcome to your verified digital farm interface. Track your A2 Bilona Ghee batches, manage your Bhunga farm stay reservations, and view your Gau Seva impact in one secure place.
          </p>
        </div>
        <i className="fas fa-leaf absolute -bottom-10 -right-10 text-[180px] text-white/5 rotate-[-20deg]"></i>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif font-bold text-xl text-[var(--mud)]">Recent Orders</h3>
            <a href="/dashboard/orders" className="text-xs font-bold text-[var(--terracotta)] hover:underline">View All</a>
          </div>
          {data?.orders && data.orders.length > 0 ? (
            <div className="space-y-4">
              {data.orders.map((o: DashboardOrder) => (
                <div key={o.id} className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex justify-between items-center">
                  <div>
                    <span className="block text-xs font-mono font-bold text-[var(--mud)] mb-1">#{o.order_number}</span>
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">{o.status.replace("_", " ")}</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-[var(--terracotta)]">₹{Number(o.total_inr).toLocaleString("en-IN")}</span>
                    <a href={`/trace/LO-PILANI-SAMPLE-001`} className="text-[10px] underline text-[var(--muted)]">Track Batch</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[var(--bg)] rounded-2xl border border-dashed border-[var(--border)]">
              <p className="text-sm text-[var(--muted)]">No recent orders found.</p>
            </div>
          )}
        </section>

        {/* Gau Seva Impact */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif font-bold text-xl text-[var(--mud)]">Gau Seva Impact</h3>
            <a href="/dashboard/sponsorships" className="text-xs font-bold text-[var(--terracotta)] hover:underline">Manage</a>
          </div>
          {data?.sponsorships && data.sponsorships.length > 0 ? (
            <div className="space-y-4">
              {data.sponsorships.map((s: DashboardSponsorship) => (
                <div key={s.id} className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex justify-between items-center">
                  <div>
                    <span className="block text-sm font-bold text-[var(--mud)]">{s.calf_name}</span>
                    <span className="text-xs text-[var(--muted)] capitalize">{s.plan_type.replace("_", " ")} Sponsorship</span>
                  </div>
                  <span className="font-bold text-[var(--terracotta)]">₹{Number(s.amount_inr).toLocaleString("en-IN")}/mo</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[var(--bg)] rounded-2xl border border-dashed border-[var(--border)]">
              <p className="text-sm text-[var(--muted)] mb-3">You are not currently sponsoring a calf.</p>
              <button onClick={() => window.location.href = "/#adopt"} className="text-xs font-bold px-4 py-2 rounded-full border border-[var(--terracotta)] text-[var(--terracotta)] hover:bg-[var(--terracotta)] hover:text-white transition">
                Sponsor Dholi Sheri
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
