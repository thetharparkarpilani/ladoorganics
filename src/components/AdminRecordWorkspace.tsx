"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminClientToken } from "@/lib/admin-client";

type Kind = "orders" | "bookings" | "sponsorships";
type RecordItem = {
  id: string; status: string; created_at?: string;
  order_number?: string; guest_name?: string; guest_email?: string; guest_phone?: string; payment_method?: string; payment_status?: string; shipping_summary?: string; return_status?: string; return_reason?: string; refunded_inr?: number | string;
  total_inr?: number | string; check_in?: string; check_out?: string; guests_count?: number;
  nights_count?: number; total_amount_inr?: number | string; calf_name?: string;
  sponsor_name?: string; sponsor_email?: string; plan_type?: string; amount_inr?: number | string;
};
const CONFIG: Record<Kind, { title: string; singular: string; statuses: string[]; action: string }> = {
  orders: { title: "Orders & Payments", singular: "order", statuses: ["pending_confirmation", "processing", "shipped", "delivered", "cancelled"], action: "update_order_status" },
  bookings: { title: "Bhunga Stay Requests", singular: "booking", statuses: ["pending", "confirmed", "cancelled", "completed"], action: "update_booking_status" },
  sponsorships: { title: "Gau Seva Sponsorships", singular: "sponsorship", statuses: ["pending", "active", "paused", "cancelled"], action: "update_sponsorship_status" },
};
function money(v: number | string | undefined) { return `₹${Number(v || 0).toLocaleString("en-IN")}`; }
function date(v?: string) { if (!v) return "—"; const d = new Date(v); return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString("en-IN"); }
function contact(r: RecordItem) { return r.guest_email || r.sponsor_email || ""; }
function phone(r: RecordItem) { return (r.guest_phone || "").replace(/\D/g, ""); }

export default function AdminRecordWorkspace({ kind }: { kind: Kind }) {
  const config = CONFIG[kind];
  const [token, setToken] = useState("");
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const load = useCallback(async (adminToken: string, nextPage = page, searchText = query, statusFilter = filter) => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ kind, page: String(nextPage), pageSize: "25", search: searchText, status: statusFilter });
      const res = await fetch("/api/admin/workspace?" + params.toString(), { headers: { "x-admin-token": adminToken }, cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to load records.");
      setRecords(Array.isArray(data.records) ? data.records : []);
      setTotalPages(data.totalPages || 1);
      setTotalRecords(data.total || 0);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load records."); }
    finally { setLoading(false); }
  }, [kind, page, query, filter]);

  useEffect(() => {
    let active = true;
    void getAdminClientToken().then((saved) => {
      if (!active) return;
      setToken(saved);
      if (saved) void load(saved, page, query, filter); else setLoading(false);
    });
    return () => { active = false; };
  }, [load, page, query, filter]);

  const filtered = useMemo(() => records.filter((r) => {
    const matchesStatus = filter === "all" || r.status === filter;
    const haystack = [r.order_number, r.guest_name, r.guest_email, r.guest_phone, r.calf_name, r.sponsor_name, r.sponsor_email, r.id].join(" ").toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  }), [records, filter, query]);

  const runPaymentAction = async (id: string, action: "confirm_cod_payment" | "confirm_manual_upi_payment") => {
    if (!token || !window.confirm(action === "confirm_cod_payment" ? "Confirm that the COD amount has actually been collected?" : "Confirm that the UPI amount has actually reached the Lado Organics bank account?")) return;
    setBusyId(id); setError(""); setNotice("");
    try {
      const res = await fetch("/api/admin/records", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify({ action, id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment update failed.");
      setNotice("Payment marked received and recorded in the audit log.");
      await load(token, page, query, filter);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to update payment."); }
    finally { setBusyId(""); }
  };
  const confirmCollectedPayment = (id: string) => runPaymentAction(id, "confirm_cod_payment");
  const confirmManualPayment = (id: string) => runPaymentAction(id, "confirm_manual_upi_payment");

  const returnAction = async (id: string, action: "approve_return" | "reject_return" | "receive_return") => {
    if (!token) return;
    const restock = action === "receive_return" && window.confirm("Are all returned items inspected and suitable for resale? Choose OK to restock them, or Cancel to receive without adding stock.");
    if (!window.confirm(action === "approve_return" ? "Approve this return request?" : action === "reject_return" ? "Reject this return request?" : "Confirm that the returned parcel has physically arrived?")) return;
    setBusyId(id); setError(""); setNotice("");
    try {
      const res = await fetch("/api/admin/records", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify({ action, id, restock }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || "Return update failed.");
      setNotice(action === "receive_return" ? (data.inventoryRestocked ? "Return received; inspected stock restored." : "Return received without restocking.") : "Return request updated.");
      await load(token, page, query, filter);
    } catch (e) { setError(e instanceof Error ? e.message : "Return update failed."); } finally { setBusyId(""); }
  };
  const recordRefund = async (id: string) => {
    if (!token) return;
    const amount = Number(window.prompt("Enter the refund amount in whole rupees. Only enter money already sent back to the customer."));
    if (!Number.isSafeInteger(amount) || amount <= 0) return;
    const refundMethod = window.prompt("Refund method: upi, bank_transfer, or cash", "upi") || "";
    const reference = window.prompt("Enter the actual UPI/bank transaction reference or cash receipt number.") || "";
    if (!reference.trim() || !["upi", "bank_transfer", "cash"].includes(refundMethod)) { setError("A valid refund method and reference are required."); return; }
    if (!window.confirm("Confirm this refund has already been sent to the customer?")) return;
    setBusyId(id); setError(""); setNotice("");
    try {
      const res = await fetch("/api/admin/records", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify({ action: "record_refund", id, amountInr: amount, refundMethod, reference }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || "Refund could not be recorded.");
      setNotice(`Refund recorded. Remaining refundable balance: ₹${Number(data.remainingInr).toLocaleString("en-IN")}.`);
      await load(token, page, query, filter);
    } catch (e) { setError(e instanceof Error ? e.message : "Refund recording failed."); } finally { setBusyId(""); }
  };

  const updateStatus = async (id: string, status: string) => {
    if (!token || !window.confirm(`Update this ${config.singular} to "${status.replace(/_/g, " ")}"?`)) return;
    setBusyId(id); setError(""); setNotice("");
    try {
      const res = await fetch("/api/admin/records", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify({ action: config.action, id, status }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Status update failed.");
      setNotice("Status updated and recorded in the audit log.");
      await load(token, page, query, filter);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to update status."); }
    finally { setBusyId(""); }
  };

  const exportCsv = () => {
    const rows = [["Record", "Name", "Email", "Status", "Amount", "Created"]];
    for (const r of filtered) rows.push([
      r.order_number || r.id, r.guest_name || r.sponsor_name || r.calf_name || "",
      contact(r), r.status, String(r.total_inr ?? r.total_amount_inr ?? r.amount_inr ?? ""),
      r.created_at || "",
    ]);
    const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = `lado-${kind}-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  if (!token) return <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8"><h1 className="font-serif text-3xl font-bold">{config.title}</h1><p className="mt-3 text-sm opacity-70">Unlock the Admin Command Center first using your ADMIN_ACCESS_TOKEN on the main admin page.</p><a className="primary-btn mt-5 inline-flex rounded-xl px-5 py-3" href="/admin">Open Admin Login</a></section>;

  return <section className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[.2em] text-[var(--terracotta)]">Lado Command · Operations</p><h1 className="mt-2 font-serif text-3xl font-bold">{config.title}</h1><p className="mt-2 text-sm opacity-70">Review requests, contact customers and update workflow status.</p></div><div className="flex gap-2"><button onClick={() => void load(token)} disabled={loading} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold">{loading ? "Refreshing…" : "Refresh"}</button><button onClick={exportCsv} disabled={!filtered.length} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold disabled:opacity-40">Export this page</button></div></header>
    <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"><p className="text-xs opacity-60">Total records</p><p className="mt-1 text-2xl font-bold">{totalRecords}</p></div><div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"><p className="text-xs opacity-60">Pending</p><p className="mt-1 text-2xl font-bold">{records.filter(r => r.status === "pending" || r.status === "pending_confirmation").length}</p></div><div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"><p className="text-xs opacity-60">On this page</p><p className="mt-1 text-2xl font-bold">{filtered.length}</p></div></div>
    <div className="flex flex-col gap-3 sm:flex-row"><input value={query} onChange={e => { setPage(1); setQuery(e.target.value); }} placeholder="Search name, email, phone, order or record ID…" className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"/><select value={filter} onChange={e => { setPage(1); setFilter(e.target.value); }} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"><option value="all">All statuses</option>{config.statuses.map(s => <option key={s} value={s}>{s.replace(/_/g," ")}</option>)}</select></div>
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}{notice && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-900">{notice}</p>}
    {loading ? <p className="py-12 text-center text-sm opacity-60">Loading records…</p> : filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center"><h2 className="font-serif text-xl font-bold">No matching records</h2><p className="mt-2 text-sm opacity-60">Try changing your search or status filter.</p></div> : <div className="space-y-3">{filtered.map(r => {
      const name = r.guest_name || r.sponsor_name || r.calf_name || "Customer";
      const amount = r.total_inr ?? r.total_amount_inr ?? r.amount_inr;
      const phoneDigits = phone(r);
      const msg = kind === "orders" ? `Hello ${name}, regarding your Lado Organics order ${r.order_number || ""}.` : kind === "bookings" ? `Hello ${name}, regarding your Bhunga stay request for ${date(r.check_in)} to ${date(r.check_out)}.` : `Hello ${name}, regarding your Gau Seva sponsorship for ${r.calf_name || "your selected calf"}.`;
      return <article key={r.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs font-bold text-[var(--terracotta)]">{r.order_number || (kind === "sponsorships" ? r.calf_name : r.id)}</p><h2 className="mt-1 font-serif text-xl font-bold">{name}</h2><p className="mt-1 break-all text-sm opacity-70">{contact(r) || "No email recorded"}{phoneDigits ? ` · ${r.guest_phone}` : ""}</p></div><span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-bold capitalize">{r.status.replace(/_/g," ")}</span></div>
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3"><p><span className="opacity-60">Amount</span><br/><strong>{amount === undefined ? "—" : money(amount)}</strong></p><p><span className="opacity-60">{kind === "bookings" ? "Stay dates" : "Plan / details"}</span><br/><strong>{kind === "bookings" ? `${date(r.check_in)} – ${date(r.check_out)}` : r.plan_type || "—"}</strong></p><p><span className="opacity-60">Received</span><br/><strong>{date(r.created_at)}</strong></p>{kind === "orders" && <p><span className="opacity-60">Payment</span><br/><strong>{(r.payment_status || "—").replace(/_/g," ")} · {(r.payment_method || "—").replace(/_/g," ")}</strong></p>}</div>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4"><label className="text-xs font-bold">Update status</label><select aria-label="New status" defaultValue={r.status} onChange={e => void updateStatus(r.id,e.target.value)} disabled={busyId === r.id} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"><option value={r.status}>{r.status.replace(/_/g," ")}</option>{config.statuses.filter(s => s !== r.status).map(s => <option key={s} value={s}>{s.replace(/_/g," ")}</option>)}</select>
                {kind === "orders" && r.payment_method === "cash_on_delivery" && r.payment_status === "pay_on_delivery" && ["processing", "shipped", "delivered"].includes(r.status) && <button onClick={() => void confirmCollectedPayment(r.id)} disabled={busyId === r.id} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold disabled:opacity-40">Mark COD received</button>}
        {kind === "orders" && r.payment_method === "manual_upi" && ["awaiting_manual_payment", "payment_submitted"].includes(r.payment_status || "") && <button onClick={() => void confirmManualPayment(r.id)} disabled={busyId === r.id} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold disabled:opacity-40">Verify UPI received</button>}
                {kind === "orders" && r.return_status && <p className="w-full text-xs opacity-70">Return: <strong>{r.return_status}</strong>{r.return_reason ? ` · ${r.return_reason}` : ""} · Refunded: {money(r.refunded_inr)}</p>}
        {kind === "orders" && r.return_status === "requested" && <><button onClick={() => void returnAction(r.id, "approve_return")} disabled={busyId === r.id} className="rounded-lg border px-3 py-2 text-xs font-bold">Approve return</button><button onClick={() => void returnAction(r.id, "reject_return")} disabled={busyId === r.id} className="rounded-lg border px-3 py-2 text-xs font-bold">Reject return</button></>}
        {kind === "orders" && r.return_status === "approved" && <button onClick={() => void returnAction(r.id, "receive_return")} disabled={busyId === r.id} className="rounded-lg border px-3 py-2 text-xs font-bold">Mark return received</button>}
        {kind === "orders" && ["paid", "partially_refunded"].includes(r.payment_status || "") && Number(r.refunded_inr || 0) < Number(r.total_inr || 0) && <button onClick={() => void recordRefund(r.id)} disabled={busyId === r.id} className="rounded-lg border px-3 py-2 text-xs font-bold">Record completed refund</button>}
        {contact(r) && <a href={`mailto:${contact(r)}?subject=${encodeURIComponent("Your Lado Organics request")}&body=${encodeURIComponent(msg)}`} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold">Email</a>}{phoneDigits && <a href={`https://wa.me/${phoneDigits.length===10?"91":""}${phoneDigits}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold">WhatsApp</a>}<button onClick={() => { void navigator.clipboard.writeText(r.id); setNotice("Record ID copied."); }} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold">Copy ID</button></div>
      </article>;
    })}</div>}
    <div className="flex items-center justify-between border-t border-[var(--border)] pt-4"><button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1 || loading} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm disabled:opacity-40">Previous</button><span className="text-xs opacity-60">Page {page} of {totalPages} · {totalRecords} records</span><button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages || loading} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm disabled:opacity-40">Next</button></div>
  </section>;
}
