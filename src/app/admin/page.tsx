"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminOperationsPanel from "@/components/AdminOperationsPanel";

interface AdminStats {
  orders: number;
  revenue: number;
  products: number;
  inventory: number;
  bookings: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState("");
  const [tokenDraft, setTokenDraft] = useState("");

  // In production, the token would be securely managed via HttpOnly cookies and NextAuth/Supabase sessions.
  // For safety, we enforce a strict authorization header requirement.
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("lado_admin_token") || "";
        setAdminToken(token);
        if (!token) throw new Error("Enter your ADMIN_ACCESS_TOKEN below to open the admin tools.");
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) throw new Error("Unauthorized: Invalid or missing ADMIN_ACCESS_TOKEN. Please log in securely.");
        if (!res.ok) throw new Error("Failed to load dashboard metrics. Database may be offline.");

        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const saveAdminToken = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = tokenDraft.trim();
    if (!value) return;
    localStorage.setItem("lado_admin_token", value);
    setAdminToken(value);
    setTokenDraft("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${value}` } });
      if (!res.ok) throw new Error("The token was not accepted. Check that it matches ADMIN_ACCESS_TOKEN in Vercel.");
      setStats(await res.json());
    } catch (err) {
      localStorage.removeItem("lado_admin_token");
      setAdminToken("");
      setError(err instanceof Error ? err.message : "Unable to authenticate admin.");
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = async () => {
    const res = await fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${adminToken}` } });
    if (!res.ok) throw new Error("Unable to refresh admin dashboard.");
    setStats(await res.json());
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Command Center Overview</h1>
          <p className="text-sm opacity-70">Monitor farm operations, inventory locks, and ecosystem revenue.</p>
        </div>
        <Link href="/" className="text-xs font-bold border border-[var(--border)] px-4 py-2 rounded-lg hover:border-[var(--terracotta)] transition bg-[var(--surface)]">
          View Live Site ↗
        </Link>
      </div>

      {!adminToken && (
        <form onSubmit={saveAdminToken} className="mb-8 max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="font-serif text-lg font-bold mb-2">Admin access</h2>
          <p className="text-xs opacity-70 mb-3">Enter the same ADMIN_ACCESS_TOKEN configured in your Vercel environment variables.</p>
          <input type="password" autoComplete="current-password" value={tokenDraft} onChange={e => setTokenDraft(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm" placeholder="Admin access token" />
          <button type="submit" disabled={!tokenDraft.trim() || loading} className="primary-btn mt-3 rounded-xl px-5 py-2.5 text-sm font-bold disabled:opacity-50">Unlock admin tools</button>
        </form>
      )}

      {error ? (
        <div className="bg-red-50 text-red-900 border border-red-200 p-6 rounded-2xl mb-8">
          <h3 className="font-bold mb-2">Authentication Error</h3>
          <p className="text-sm">{error}</p>
        </div>
      ) : loading ? (
        <div className="p-8 text-center text-sm opacity-60">Loading secure ecosystem metrics...</div>
      ) : stats ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)] block mb-1">Total Revenue</span>
            <span className="text-3xl font-serif font-bold">₹{stats.revenue.toLocaleString("en-IN")}</span>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)] block mb-1">Total Orders</span>
            <span className="text-3xl font-serif font-bold">{stats.orders}</span>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)] block mb-1">Active Bookings</span>
            <span className="text-3xl font-serif font-bold">{stats.bookings}</span>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)] block mb-1">Total SKU Units</span>
            <span className="text-3xl font-serif font-bold">{stats.inventory}</span>
          </div>
        </div>
      ) : null}

      {adminToken && <AdminOperationsPanel adminToken={adminToken} onRefreshDashboard={refreshDashboard} />}

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm p-6 sm:p-8">
        <h2 className="text-xl font-serif font-bold mb-6">Recent Operational Activity</h2>
        <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-xl bg-[var(--bg)]">
          <p className="text-sm opacity-60">Audit logs and recent orders will populate here once transactions begin.</p>
        </div>
      </div>
    </div>
  );
}
