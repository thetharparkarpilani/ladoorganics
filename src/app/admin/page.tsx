"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminOperationsPanel from "@/components/AdminOperationsPanel";
import AdminNotificationCentre from "@/components/AdminNotificationCentre";
import AdminProductInventory from "@/components/AdminProductInventory";

interface AdminStats {
  orders: number;
  revenue: number;
  products: number;
  inventory: number;
  bookings: number;
  customers?: number;
  openOrders?: number;
  sponsorships?: number;
  trend?: Array<{ day: string; revenue: number | string; orders: number | string }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState("");
  const [tokenDraft, setTokenDraft] = useState("");
  const [adminRole, setAdminRole] = useState("owner");

  // In production, the token would be securely managed via HttpOnly cookies and NextAuth/Supabase sessions.
  // For safety, we enforce a strict authorization header requirement.
  useEffect(() => {
    let active = true;
    const initialize = async () => {
      try {
        let token = localStorage.getItem("lado_admin_token") || "";
        let role = "owner";
        if (!token) {
          const session = await fetch("/api/admin/session", { cache: "no-store" });
          if (!session.ok) throw new Error("Enter your owner access token or sign in with an approved staff Google account.");
          const sessionData = await session.json();
          role = sessionData.actor?.role || "";
          const destinations: Record<string,string> = {
            orders: "/admin/orders", inventory: "/admin/inventory", support: "/admin/support",
            content: "/admin/content", communications: "/admin/communications", viewer: "/admin/analytics"
          };
          if (role && role !== "manager") {
            window.location.replace(destinations[role] || "/login?next=/admin");
            return;
          }
          token = "__lado_staff_session__";
        }
        if (!active) return;
        setAdminRole(role);
        setAdminToken(token);
        const res = await fetch("/api/admin/stats", { headers: { Authorization: "Bearer " + token }, cache: "no-store" });
        if (!res.ok) throw new Error("Unable to load admin metrics. Check your staff permissions and database.");
        setStats(await res.json());
      setAdminRole("owner");
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Network error");
      } finally {
        if (active) setLoading(false);
      }
    };
    void initialize();
    return () => { active = false; };
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
          <p className="text-xs opacity-70 mb-3">Enter the owner ADMIN_ACCESS_TOKEN, or sign in with Google if the owner has added your email as staff.</p>
          <Link href="/login?next=/admin" className="mb-3 inline-block text-xs font-bold underline">Staff Google sign-in</Link>
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

      {adminToken && (adminRole === "owner" || adminRole === "manager") && <AdminNotificationCentre adminToken={adminToken} />}

      {adminToken && (adminRole === "owner" || adminRole === "manager") && <AdminProductInventory adminToken={adminToken} />}

      {adminToken && (adminRole === "owner" || adminRole === "manager") && <AdminOperationsPanel adminToken={adminToken} onRefreshDashboard={refreshDashboard} />}
    </div>
  );
}
