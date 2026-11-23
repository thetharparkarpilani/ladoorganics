"use client";

import React, { useCallback, useEffect, useState } from "react";

type RequestRecord = {
  id: string;
  status: string;
  created_at: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  order_number?: string;
  total_inr?: number | string;
  check_in?: string;
  check_out?: string;
  guests_count?: number;
  nights_count?: number;
  total_amount_inr?: number | string;
  calf_name?: string;
  sponsor_name?: string;
  sponsor_email?: string;
  plan_type?: string;
  amount_inr?: number | string;
};

type AdminResponse = {
  orders: RequestRecord[];
  bookings: RequestRecord[];
  sponsorships: RequestRecord[];
};

interface Props {
  adminToken: string;
}

function money(value: number | string | undefined) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function whatsappNumber(value: string | undefined) {
  const digits = (value || "").replace(/\D/g, "");
  if (digits.length === 10) return "91" + digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return "";
}

function ContactActions({ email, phone, message }: { email?: string; phone?: string; message: string }) {
  const number = whatsappNumber(phone);
  const subject = "Your Lado Organics request";
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {email && <a href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold">Email customer</a>}
      {number && <a href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold">WhatsApp customer</a>}
    </div>
  );
}

function date(value: string | undefined) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString("en-IN");
}

export default function AdminNotificationCentre({ adminToken }: Props) {
  const [data, setData] = useState<AdminResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/dashboard?mode=admin", {
        headers: { "x-admin-token": adminToken },
        cache: "no-store"
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Unable to load operational requests.");
      setData({
        orders: Array.isArray(payload.orders) ? payload.orders : [],
        bookings: Array.isArray(payload.bookings) ? payload.bookings : [],
        sponsorships: Array.isArray(payload.sponsorships) ? payload.sponsorships : []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load requests.");
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const copyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(""), 1800);
    } catch {
      setError("Could not copy the record ID. You can select and copy it manually.");
    }
  };

  const pendingOrders = (data?.orders || []).filter((item) =>
    ["pending_confirmation", "awaiting_manual_payment", "payment_submitted"].includes(item.status)
  );
  const pendingBookings = (data?.bookings || []).filter((item) => item.status === "pending");
  const pendingSponsorships = (data?.sponsorships || []).filter((item) => item.status === "pending");
  const totalPending = pendingOrders.length + pendingBookings.length + pendingSponsorships.length;

  const sectionClass = "rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4";
  const cardClass = "rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4";

  return (
    <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-serif font-bold">Request Notification Centre</h2>
          <p className="text-sm opacity-70 mt-1">Recent customer orders, Bhunga stay requests and Gau Seva requests.</p>
        </div>
        <button type="button" onClick={() => void loadRequests()} disabled={loading} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh requests"}
        </button>
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {loading && !data ? (
        <p className="py-8 text-center text-sm opacity-60">Loading customer requests…</p>
      ) : data ? (
        <>
          <div className="mb-5 rounded-2xl border border-[var(--border)] p-4">
            <p className="text-xs font-bold uppercase tracking-wider opacity-60">Pending requests in the latest 20 records per category</p>
            <p className="mt-1 text-3xl font-serif font-bold">{totalPending}</p>
            <p className="text-xs opacity-65">{pendingOrders.length} orders · {pendingBookings.length} stay requests · {pendingSponsorships.length} Gau Seva requests</p>
          </div>

          <div className="grid xl:grid-cols-3 gap-4">
            <div className={sectionClass}>
              <h3 className="font-bold mb-3">Orders <span className="opacity-60">({pendingOrders.length} pending)</span></h3>
              {pendingOrders.length === 0 ? <p className="text-sm opacity-60">No pending orders in the recent records.</p> : <div className="space-y-3">
                {pendingOrders.map((item) => <article key={item.id} className={cardClass}>
                  <div className="flex justify-between gap-2"><strong>{item.order_number || "Order request"}</strong><span className="text-xs font-bold">{item.status}</span></div>
                  <p className="mt-1 text-sm">{item.guest_name || "Customer"} · {money(item.total_inr)}</p>
                  <p className="text-xs opacity-65 break-all">{item.guest_email || "No email"}{item.guest_phone ? ` · ${item.guest_phone}` : ""}</p>
                  <p className="mt-2 text-[11px] opacity-60">Received {date(item.created_at)}</p>
                  <ContactActions email={item.guest_email} phone={item.guest_phone} message={`Hello ${item.guest_name || "there"}, we have received your Lado Organics order ${item.order_number || ""}. Our team is reviewing it and will contact you with the next update.`} />
                  <ContactActions email={item.guest_email} phone={item.guest_phone} message={`Hello ${item.guest_name || "there"}, we have received your Bhunga stay request for ${date(item.check_in)} to ${date(item.check_out)}. The dates are not confirmed yet; our team will contact you after checking availability.`} />
                  <ContactActions email={item.sponsor_email} message={`Hello ${item.sponsor_name || "there"}, we have received your Gau Seva sponsorship request for ${item.calf_name || "the calf"} under the ${item.plan_type || "selected"} plan. Our team will contact you to confirm the details. This message is not a payment receipt.`} />
                  <button type="button" onClick={() => void copyId(item.id)} className="mt-3 text-xs font-bold underline">{copiedId === item.id ? "Copied ID" : "Copy record ID"}</button>
                </article>)}
              </div>}
            </div>

            <div className={sectionClass}>
              <h3 className="font-bold mb-3">Bhunga Stays <span className="opacity-60">({pendingBookings.length} pending)</span></h3>
              {pendingBookings.length === 0 ? <p className="text-sm opacity-60">No pending stay requests in the recent records.</p> : <div className="space-y-3">
                {pendingBookings.map((item) => <article key={item.id} className={cardClass}>
                  <div className="flex justify-between gap-2"><strong>{item.guest_name || "Guest request"}</strong><span className="text-xs font-bold">{item.status}</span></div>
                  <p className="mt-1 text-sm">{date(item.check_in)} – {date(item.check_out)}</p>
                  <p className="text-xs opacity-65">{item.guests_count || 0} guests · {item.nights_count || 0} nights · {money(item.total_amount_inr)}</p>
                  <p className="text-xs opacity-65 break-all">{item.guest_email || "No email"}{item.guest_phone ? ` · ${item.guest_phone}` : ""}</p>
                  <p className="mt-2 text-[11px] opacity-60">Received {date(item.created_at)}</p>
                  <button type="button" onClick={() => void copyId(item.id)} className="mt-3 text-xs font-bold underline">{copiedId === item.id ? "Copied ID" : "Copy record ID"}</button>
                </article>)}
              </div>}
            </div>

            <div className={sectionClass}>
              <h3 className="font-bold mb-3">Gau Seva <span className="opacity-60">({pendingSponsorships.length} pending)</span></h3>
              {pendingSponsorships.length === 0 ? <p className="text-sm opacity-60">No pending sponsorship requests in the recent records.</p> : <div className="space-y-3">
                {pendingSponsorships.map((item) => <article key={item.id} className={cardClass}>
                  <div className="flex justify-between gap-2"><strong>{item.calf_name || "Sponsorship request"}</strong><span className="text-xs font-bold">{item.status}</span></div>
                  <p className="mt-1 text-sm">{item.sponsor_name || "Sponsor"} · {item.plan_type || "Plan not specified"}</p>
                  <p className="text-xs opacity-65">{money(item.amount_inr)} · {item.sponsor_email || "No email"}</p>
                  <p className="mt-2 text-[11px] opacity-60">Received {date(item.created_at)}</p>
                  <button type="button" onClick={() => void copyId(item.id)} className="mt-3 text-xs font-bold underline">{copiedId === item.id ? "Copied ID" : "Copy record ID"}</button>
                </article>)}
              </div>}
            </div>
          </div>
          <p className="mt-4 text-xs opacity-60">This view shows up to the latest 20 records in each category. Use the existing status controls below to process a request; a request is not a confirmed booking or completed payment until you verify it.</p>
        </>
      ) : null}
    </section>
  );
}
