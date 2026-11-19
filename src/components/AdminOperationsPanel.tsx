"use client";

import React, { useState } from "react";

interface AdminOperationsPanelProps {
  adminToken: string;
  onRefreshDashboard: () => Promise<void>;
}

export default function AdminOperationsPanel({
  adminToken,
  onRefreshDashboard
}: AdminOperationsPanelProps) {
  const [batchCode, setBatchCode] = useState("LO-PILANI-002");
  const [productSlug, setProductSlug] = useState("a2-bilona-ghee");
  const [productName, setProductName] = useState("A2 Bilona Ghee");
  const [variantLabel, setVariantLabel] = useState("1 litre");
  const [productionDate, setProductionDate] = useState("2026-11-15");
  const [packagingDate, setPackagingDate] = useState("2026-11-18");
  const [bestBeforeDate, setBestBeforeDate] = useState("2027-08-15");
  const [labReportUrl, setLabReportUrl] = useState("");
  const [productionProcess, setProductionProcess] = useState(
    "Curd-cultured indigenous Tharparkar milk churned via traditional wooden Bilona method in Pilani."
  );
  const [qualityChecks, setQualityChecks] = useState(
    "Inspected at Pilani production unit; third-party lab report attached only when verified and published."
  );
  const [storageInstructions, setStorageInstructions] = useState(
    "Store in a cool, dry place away from direct sunlight."
  );

  const [recordId, setRecordId] = useState("");
  const [orderStatus, setOrderStatus] = useState("processing");
  const [bookingStatus, setBookingStatus] = useState("confirmed");
  const [sponsorshipStatus, setSponsorshipStatus] = useState("active");

  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const callAdminApi = async (payload: Record<string, unknown>) => {
    setStatusMsg(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken.trim()
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({ type: "err", text: data?.error || "Admin action failed." });
      } else {
        setStatusMsg({ type: "ok", text: "Admin update saved and audited on server." });
        await onRefreshDashboard();
      }
    } catch {
      setStatusMsg({ type: "err", text: "Network error while saving admin change." });
    } finally {
      setBusy(false);
    }
  };

  const handlePublishBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    await callAdminApi({
      action: "create_batch",
      batchCode,
      productSlug,
      productName,
      variantLabel,
      productionDate,
      packagingDate,
      bestBeforeDate,
      labReportUrl: labReportUrl.trim() || null,
      productionProcess,
      qualityChecks,
      storageInstructions
    });
  };

  return (
    <div className="mt-8 grid lg:grid-cols-2 gap-6">
      <form
        onSubmit={handlePublishBatch}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 space-y-3 text-xs"
      >
        <h2 className="text-xl font-serif font-bold mb-1">Publish QR Batch Traceability Record</h2>
        <p className="opacity-75 mb-3">
          Creates or updates an approved batch record for <code className="font-mono">/trace/[batchCode]</code>.
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold uppercase mb-1">Batch Code</label>
            <input
              type="text"
              required
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] font-mono"
            />
          </div>
          <div>
            <label className="block font-bold uppercase mb-1">Product Name</label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold uppercase mb-1">Product Slug</label>
            <input
              type="text"
              required
              value={productSlug}
              onChange={(e) => setProductSlug(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] font-mono"
            />
          </div>
          <div>
            <label className="block font-bold uppercase mb-1">Variant / Size</label>
            <input
              type="text"
              required
              value={variantLabel}
              onChange={(e) => setVariantLabel(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold uppercase mb-1">Production Date</label>
            <input
              type="date"
              required
              value={productionDate}
              onChange={(e) => setProductionDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
            />
          </div>
          <div>
            <label className="block font-bold uppercase mb-1">Packaging Date</label>
            <input
              type="date"
              value={packagingDate}
              onChange={(e) => setPackagingDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
            />
          </div>
          <div>
            <label className="block font-bold uppercase mb-1">Best Before</label>
            <input
              type="date"
              value={bestBeforeDate}
              onChange={(e) => setBestBeforeDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold uppercase mb-1">Verified Lab Report URL (Optional HTTPS)</label>
          <input
            type="url"
            value={labReportUrl}
            onChange={(e) => setLabReportUrl(e.target.value)}
            placeholder="https://..."
            className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
          />
        </div>

        <div>
          <label className="block font-bold uppercase mb-1">Production Process</label>
          <input
            type="text"
            required
            value={productionProcess}
            onChange={(e) => setProductionProcess(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
          />
        </div>

        <div>
          <label className="block font-bold uppercase mb-1">Quality Checks</label>
          <input
            type="text"
            required
            value={qualityChecks}
            onChange={(e) => setQualityChecks(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
          />
        </div>

        <div>
          <label className="block font-bold uppercase mb-1">Storage Instructions</label>
          <input
            type="text"
            required
            value={storageInstructions}
            onChange={(e) => setStorageInstructions(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="primary-btn px-5 py-2.5 rounded-xl font-bold cursor-pointer disabled:opacity-50"
        >
          {busy ? "Saving..." : "Publish Batch Record"}
        </button>
      </form>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 space-y-4 text-xs">
        <h2 className="text-xl font-serif font-bold">Update Order, Booking & Sponsorship Status</h2>
        <p className="opacity-75">
          Paste the UUID of an order, booking, or sponsorship record and update its workflow status on the server.
        </p>

        <div>
          <label className="block font-bold uppercase mb-1">Target Record UUID</label>
          <input
            type="text"
            value={recordId}
            onChange={(e) => setRecordId(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] font-mono"
          />
        </div>

        <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold">Order Status</span>
          <div className="flex gap-2">
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)]"
            >
              <option value="pending_confirmation">pending_confirmation</option>
              <option value="paid">paid</option>
              <option value="processing">processing</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
              <option value="refunded">refunded</option>
            </select>
            <button
              type="button"
              disabled={busy || !recordId.trim()}
              onClick={() =>
                void callAdminApi({ action: "update_order_status", id: recordId.trim(), status: orderStatus })
              }
              className="primary-btn px-3.5 py-2 rounded-lg font-bold cursor-pointer disabled:opacity-50"
            >
              Update Order
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold">Bhunga Booking Status</span>
          <div className="flex gap-2">
            <select
              value={bookingStatus}
              onChange={(e) => setBookingStatus(e.target.value)}
              className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)]"
            >
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="cancelled">cancelled</option>
              <option value="completed">completed</option>
            </select>
            <button
              type="button"
              disabled={busy || !recordId.trim()}
              onClick={() =>
                void callAdminApi({
                  action: "update_booking_status",
                  id: recordId.trim(),
                  status: bookingStatus
                })
              }
              className="primary-btn px-3.5 py-2 rounded-lg font-bold cursor-pointer disabled:opacity-50"
            >
              Update Booking
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold">Sponsorship Status</span>
          <div className="flex gap-2">
            <select
              value={sponsorshipStatus}
              onChange={(e) => setSponsorshipStatus(e.target.value)}
              className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)]"
            >
              <option value="pending">pending</option>
              <option value="active">active</option>
              <option value="paused">paused</option>
              <option value="cancelled">cancelled</option>
            </select>
            <button
              type="button"
              disabled={busy || !recordId.trim()}
              onClick={() =>
                void callAdminApi({
                  action: "update_sponsorship_status",
                  id: recordId.trim(),
                  status: sponsorshipStatus
                })
              }
              className="primary-btn px-3.5 py-2 rounded-lg font-bold cursor-pointer disabled:opacity-50"
            >
              Update Sponsorship
            </button>
          </div>
        </div>

        {statusMsg && (
          <div
            className={`p-3 rounded-xl font-medium ${
              statusMsg.type === "ok"
                ? "bg-green-50 text-green-900 border border-green-200"
                : "bg-red-50 text-red-900 border border-red-200"
            }`}
          >
            {statusMsg.text}
          </div>
        )}
      </div>
    </div>
  );
}
