"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

type Kind = "orders" | "bookings" | "sponsorships";
type RecordItem = {
  id: string; status: string; created_at?: string;
  order_number?: string; guest_name?: string; guest_email?: string; guest_phone?: string;
  total_inr?: number | string; check_in?: string; check_out?: string; guests_count?: number;
  nights_count?: number; total_amount_inr?: number | string; calf_name?: string;
  sponsor_name?: string; sponsor_email?: string; plan_type?: string; amount_inr?: number | string;
};
const CONFIG: Record<Kind, { title: string; singular: string; statuses: string[]; action: string }> = {
  orders: { title: "Orders & Payments", singular: "order", statuses: ["pending_confirmation", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"], action: "update_order_status" },
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

  const load = useCallback(async (adminToken: string) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/dashboard?mode=admin", { headers: { "x-admin-token": adminToken }, cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to load records.");
      setRecords(Array.isArray(data[kind]) ? data[kind] : []);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load records."); }
    finally { setLoading(false); }
  }, [kind]);

  useEffect(() => {
    const saved = localStorage.getItem("lado_admin_token") || "";
    setToken(saved);
    if (saved) void load(saved); else setLoading(false);
  }, [load]);

  const filtered = useMemo(() => records.filter((r) => {
    const matchesStatus = filter === "all" || r.status === filter;
    const haystack = [r.order_number, r.guest_name, r.guest_email, r.guest_phone, r.calf_name, r.sponsor_name, r.sponsor_email, r.id].join(" ").toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  }), [records, filter, query]);

  const updateStatus = async (id: string, status: string) => {
    if (!token || !window.confirm(`Update this ${config.singular} to "${status.replace(/_/g, " ")}"?`)) return;
    setBusyId(id); setError(""); setNotice("");
    try {
      const res = await fetch("/api/admin/records", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify({ action: config.action, id, status }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Status update failed.");
      setNotice("Status updated and recorded in the audit log.");
      await load(token);
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
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[.2em] text-[var(--terracotta)]">Lado Command · Operations</p><h1 className="mt-2 font-serif text-3xl font-bold">{config.title}</h1><p className="mt-2 text-sm opacity-70">Review requests, contact customers and update workflow status.</p></div><div className="flex gap-2"><button onClick={() => void load(token)} disabled={loading} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold">{loading ? "Refreshing…" : "Refresh"}</button><button onClick={exportCsv} disabled={!filtered.length} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold disabled:opacity-40">Export CSV</button></div></header>
    <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"><p className="text-xs opacity-60">Records loaded</p><p className="mt-1 text-2xl font-bold">{records.length}</p></div><div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"><p className="text-xs opacity-60">Pending</p><p className="mt-1 text-2xl font-bold">{records.filter(r => r.status === "pending" || r.status === "pending_confirmation").length}</p></div><div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"><p className="text-xs opacity-60">Showing</p><p className="mt-1 text-2xl font-bold">{filtered.length}</p></div></div>
    <div className="flex flex-col gap-3 sm:flex-row"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, email, phone, order or record ID…" className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"/><select value={filter} onChange={e => setFilter(e.target.value)} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"><option value="all">All statuses</option>{config.statuses.map(s => <option key={s} value={s}>{s.replace(/_/g," ")}</option>)}</select></div>
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}{notice && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-900">{notice}</p>}
    {loading ? <p className="py-12 text-center text-sm opacity-60">Loading records…</p> : filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center"><h2 className="font-serif text-xl font-bold">No matching records</h2><p className="mt-2 text-sm opacity-60">Try changing your search or status filter.</p></div> : <div className="space-y-3">{filtered.map(r => {
      const name = r.guest_name || r.sponsor_name || r.calf_name || "Customer";
      const amount = r.total_inr ?? r.total_amount_inr ?? r.amount_inr;
      const phoneDigits = phone(r);
      const msg = kind === "orders" ? `Hello ${name}, regarding your Lado Organics order ${r.order_number || ""}.` : kind === "bookings" ? `Hello ${name}, regarding your Bhunga stay request for ${date(r.check_in)} to ${date(r.check_out)}.` : `Hello ${name}, regarding your Gau Seva sponsorship for ${r.calf_name || "your selected calf"}.`;
      return <article key={r.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs font-bold text-[var(--terracotta)]">{r.order_number || (kind === "sponsorships" ? r.calf_name : r.id)}</p><h2 className="mt-1 font-serif text-xl font-bold">{name}</h2><p className="mt-1 break-all text-sm opacity-70">{contact(r) || "No email recorded"}{phoneDigits ? ` · ${r.guest_phone}` : ""}</p></div><span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-bold capitalize">{r.status.replace(/_/g," ")}</span></div>
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3"><p><span className="opacity-60">Amount</span><br/><strong>{amount === undefined ? "—" : money(amount)}</strong></p><p><span className="opacity-60">{kind === "bookings" ? "Stay dates" : "Plan / details"}</span><br/><strong>{kind === "bookings" ? `${date(r.check_in)} – ${date(r.check_out)}` : r.plan_type || "—"}</strong></p><p><span className="opacity-60">Received</span><br/><strong>{date(r.created_at)}</strong></p></div>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4"><label className="text-xs font-bold">Update status</label><select aria-label="New status" defaultValue={r.status} onChange={e => void updateStatus(r.id,e.target.value)} disabled={busyId === r.id} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"><option value={r.status}>{r.status.replace(/_/g," ")}</option>{config.statuses.filter(s => s !== r.status).map(s => <option key={s} value={s}>{s.replace(/_/g," ")}</option>)}</select>
        {contact(r) && <a href={`mailto:${contact(r)}?subject=${encodeURIComponent("Your Lado Organics request")}&body=${encodeURIComponent(msg)}`} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold">Email</a>}{phoneDigits && <a href={`https://wa.me/${phoneDigits.length===10?"91":""}${phoneDigits}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold">WhatsApp</a>}<button onClick={() => { void navigator.clipboard.writeText(r.id); setNotice("Record ID copied."); }} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold">Copy ID</button></div>
      </article>;
    })}</div>}
    <p className="text-xs opacity-60">The underlying admin API currently returns the latest 20 records per category. This workspace does not claim to show older records beyond that limit.</p>
  </section>;
}
