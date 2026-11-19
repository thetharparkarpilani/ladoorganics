"use client";

import React, { useState } from "react";
import AdminOperationsPanel from "@/components/AdminOperationsPanel";

interface OrderSummary {
  id: string;
  order_number: string;
  guest_name?: string;
  guest_email?: string;
  shipping_summary?: string;
  total_inr: number;
  status: string;
  created_at: string;
}

interface BookingSummary {
  id: string;
  guest_name?: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  nights_count: number;
  total_amount_inr: number;
  status: string;
}

interface SponsorshipSummary {
  id: string;
  calf_name: string;
  sponsor_name?: string;
  plan_type: string;
  amount_inr: number;
  status: string;
}

interface AuditLogSummary {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const [tab, setTab] = useState<"customer" | "admin">("customer");
  const [email, setEmail] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [sponsorships, setSponsorships] = useState<SponsorshipSummary[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogSummary[]>([]);
  const [metrics, setMetrics] = useState<{
    recentOrdersCount: number;
    recentOrderVolumeInr: number;
    recentBookingsCount: number;
    recentSponsorshipsCount: number;
  } | null>(null);

  const handleLoadCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMetrics(null);
    setAdminUnlocked(false);
    try {
      const res = await fetch(`/api/dashboard?mode=customer&email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Unable to load customer records.");
      } else {
        setOrders(data.orders || []);
        setBookings(data.bookings || []);
        setSponsorships(data.sponsorships || []);
      }
    } catch {
      setError("Network error while loading My Lado Journey.");
    } finally {
      setLoading(false);
    }
  };

  const refreshAdminData = async (tokenOverride?: string) => {
    const activeToken = (tokenOverride ?? adminToken).trim();
    const res = await fetch("/api/dashboard?mode=admin", {
      headers: { "x-admin-token": activeToken }
    });
    const data = await res.json();
    if (!res.ok) {
      setAdminUnlocked(false);
      setError(data?.error || "Admin authorization failed.");
      return;
    }
    setAdminUnlocked(true);
    setMetrics(data.metrics || null);
    setOrders(data.orders || []);
    setBookings(data.bookings || []);
    setSponsorships(data.sponsorships || []);
    setAuditLogs(data.auditLogs || []);
  };

  const handleLoadAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await refreshAdminData(adminToken);
    } catch {
      setError("Network error while loading admin console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <a href="/" className="text-sm font-bold text-[var(--terracotta)] hover:underline">
          ← Back to Lado Organics Home
        </a>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setTab("customer");
              setError(null);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer border ${
              tab === "customer"
                ? "bg-[var(--mud)] text-white border-[var(--mud)]"
                : "bg-[var(--surface)] border-[var(--border)]"
            }`}
          >
            My Lado Journey
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("admin");
              setError(null);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer border ${
              tab === "admin"
                ? "bg-[var(--terracotta)] text-white border-[var(--terracotta)]"
                : "bg-[var(--surface)] border-[var(--border)]"
            }`}
          >
            Admin Operations
          </button>
        </div>
      </div>

      {tab === "customer" ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            Customer Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mt-1 mb-2">
            My Lado Journey
          </h1>
          <p className="text-xs sm:text-sm opacity-80 mb-6">
            View orders, Bhunga stay reservations, and Tharparkar calf sponsorships linked to your email address.
          </p>
          <form onSubmit={handleLoadCustomer} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="primary-btn px-6 py-3 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load My Records"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            Server-Verified RBAC Console
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mt-1 mb-2">
            Lado Organics Admin Overview
          </h1>
          <p className="text-xs sm:text-sm opacity-80 mb-6">
            Requires the server-side <code className="font-mono">ADMIN_ACCESS_TOKEN</code> configured in your environment variables.
          </p>
          <form onSubmit={handleLoadAdmin} className="flex flex-col sm:flex-row gap-3">
            <input
              type="password"
              required
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              placeholder="Enter ADMIN_ACCESS_TOKEN"
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="primary-btn px-6 py-3 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Unlock Operations View"}
            </button>
          </form>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-medium mb-8">
          {error}
        </div>
      )}

      {metrics && (
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-xs uppercase opacity-60 font-bold">Recent Orders</p>
            <p className="text-2xl font-serif font-bold mt-1">{metrics.recentOrdersCount}</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-xs uppercase opacity-60 font-bold">Order Volume</p>
            <p className="text-2xl font-serif font-bold text-[var(--terracotta)] mt-1">
              ₹{metrics.recentOrderVolumeInr.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-xs uppercase opacity-60 font-bold">Bhunga Bookings</p>
            <p className="text-2xl font-serif font-bold mt-1">{metrics.recentBookingsCount}</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-xs uppercase opacity-60 font-bold">Sponsorships</p>
            <p className="text-2xl font-serif font-bold mt-1">{metrics.recentSponsorshipsCount}</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6">
          <h2 className="text-xl font-serif font-bold mb-4">Orders ({orders.length})</h2>
          {orders.length === 0 ? (
            <p className="text-xs opacity-70">No orders loaded.</p>
          ) : (
            <ul className="space-y-3 text-xs">
              {orders.map((o) => (
                <li key={o.id} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                  <div className="flex justify-between font-bold">
                    <span>{o.order_number}</span>
                    <span>₹{Number(o.total_inr).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="opacity-75 mt-1">Status: {o.status}</p>
                  {adminUnlocked && <p className="font-mono opacity-60 mt-1 break-all">ID: {o.id}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6">
          <h2 className="text-xl font-serif font-bold mb-4">Bhunga Stays ({bookings.length})</h2>
          {bookings.length === 0 ? (
            <p className="text-xs opacity-70">No stay reservations loaded.</p>
          ) : (
            <ul className="space-y-3 text-xs">
              {bookings.map((b) => (
                <li key={b.id} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                  <div className="flex justify-between font-bold">
                    <span>{String(b.check_in).slice(0, 10)} → {String(b.check_out).slice(0, 10)}</span>
                    <span>₹{Number(b.total_amount_inr).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="opacity-75 mt-1">
                    {b.nights_count} night(s) • {b.guests_count} guest(s) • {b.status}
                  </p>
                  {adminUnlocked && <p className="font-mono opacity-60 mt-1 break-all">ID: {b.id}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6">
          <h2 className="text-xl font-serif font-bold mb-4">Sponsorships ({sponsorships.length})</h2>
          {sponsorships.length === 0 ? (
            <p className="text-xs opacity-70">No sponsorships loaded.</p>
          ) : (
            <ul className="space-y-3 text-xs">
              {sponsorships.map((s) => (
                <li key={s.id} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                  <div className="flex justify-between font-bold">
                    <span>{s.calf_name}</span>
                    <span>₹{Number(s.amount_inr).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="opacity-75 mt-1">
                    Plan: {s.plan_type} • {s.status}
                  </p>
                  {adminUnlocked && <p className="font-mono opacity-60 mt-1 break-all">ID: {s.id}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {adminUnlocked && (
        <AdminOperationsPanel
          adminToken={adminToken}
          onRefreshDashboard={() => refreshAdminData(adminToken)}
        />
      )}

      {auditLogs.length > 0 && (
        <div className="mt-8 bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6">
          <h2 className="text-xl font-serif font-bold mb-4">Recent Audit Logs</h2>
          <ul className="space-y-2 text-xs font-mono">
            {auditLogs.map((log) => (
              <li key={log.id} className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
                [{String(log.created_at).slice(0, 19)}] {log.action} • {log.entity_type} ({log.entity_id || "n/a"})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
