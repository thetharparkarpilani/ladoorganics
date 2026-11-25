"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminOperationsPanel from "@/components/AdminOperationsPanel";
import AdminNotificationCentre from "@/components/AdminNotificationCentre";
import AdminProductInventory from "@/components/AdminProductInventory";
import { getAdminClientToken, STAFF_SESSION_TOKEN } from "@/lib/admin-client";

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
  const [adminRole, setAdminRole] = useState("");

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      try {
        const session = await fetch("/api/admin/session", { cache: "no-store", credentials: "same-origin" });
        if (!session.ok) {
          if (active) setError("Sign in with an approved staff Google account to access administration.");
          return;
        }
        const sessionData = await session.json();
        const role = typeof sessionData.actor?.role === "string" ? sessionData.actor.role : "";
        if (!role) throw new Error("Your staff account does not have an assigned role.");
        const destinations: Record<string, string> = {
          orders: "/admin/orders", inventory: "/admin/inventory", support: "/admin/support",
          content: "/admin/content", communications: "/admin/communications", viewer: "/admin/analytics"
        };
        if (role !== "owner" && role !== "manager") {
          window.location.replace(destinations[role] || "/login?next=/admin");
          return;
        }
        const token = await getAdminClientToken();
        if (!token) throw new Error("Your staff session could not be verified.");
        const response = await fetch("/api/admin/stats", {
          headers: { Authorization: "Bearer " + STAFF_SESSION_TOKEN },
          cache: "no-store",
          credentials: "same-origin"
        });
        if (!response.ok) throw new Error("Unable to load admin metrics. Check your staff permissions and database.");
        if (!active) return;
        setAdminRole(role);
        setAdminToken(token);
        setStats(await response.json());
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load administration.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void initialize();
    return () => { active = false; };
  }, []);

  const refreshDashboard = async () => {
    const response = await fetch("/api/admin/stats", {
      headers: { Authorization: "Bearer " + STAFF_SESSION_TOKEN },
      cache: "no-store",
      credentials: "same-origin"
    });
    if (!response.ok) throw new Error("Unable to refresh admin dashboard.");
    setStats(await response.json());
  };

  return (
    <div className="admin-overview">
      <div className="admin-overview-header mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-serif text-3xl font-bold">Command Center Overview</h1>
          <p className="text-sm opacity-70">Monitor farm operations, inventory locks, and ecosystem revenue.</p>
        </div>
        <Link href="/" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-bold transition hover:border-[var(--terracotta)]">View Live Site ↗</Link>
      </div>

      {error && (
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
          <h2 className="mb-2 font-bold">Admin access</h2>
          <p className="text-sm">{error}</p>
          <Link href="/login?next=/admin" className="mt-3 inline-block text-sm font-bold underline">Staff Google sign-in</Link>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-sm opacity-60">Loading secure ecosystem metrics...</div>
      ) : stats ? (
        <div className="admin-metric-grid mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="admin-metric-card rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)]">Collected Revenue</span>
            <span className="font-serif text-3xl font-bold">₹{stats.revenue.toLocaleString("en-IN")}</span>
          </div>
          <div className="admin-metric-card rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)]">Total Orders</span>
            <span className="font-serif text-3xl font-bold">{stats.orders}</span>
          </div>
          <div className="admin-metric-card rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)]">Active Bookings</span>
            <span className="font-serif text-3xl font-bold">{stats.bookings}</span>
          </div>
          <div className="admin-metric-card rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)]">Total SKU Units</span>
            <span className="font-serif text-3xl font-bold">{stats.inventory}</span>
          </div>
        </div>
      ) : null}

      {adminToken && (adminRole === "owner" || adminRole === "manager") && <AdminNotificationCentre adminToken={adminToken} />}
      {adminToken && (adminRole === "owner" || adminRole === "manager") && <AdminProductInventory adminToken={adminToken} />}
      {adminToken && (adminRole === "owner" || adminRole === "manager") && <AdminOperationsPanel adminToken={adminToken} onRefreshDashboard={refreshDashboard} />}
    </div>
  );
}
