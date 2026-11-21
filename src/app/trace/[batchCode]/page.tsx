"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface BatchRecord {
  batchCode: string;
  productSlug: string;
  productName: string;
  variantLabel: string;
  productionDate: string;
  packagingDate: string | null;
  originLocation: string;
  productionProcess: string;
  qualityChecks: string;
  labReportUrl: string | null;
  storageInstructions: string;
  bestBeforeDate: string | null;
  source?: string;
}

interface JourneyStep {
  step: number;
  stage: string;
  location: string;
  date: string;
  status: string;
}

export default function BatchTracePage() {
  const params = useParams<{ batchCode: string }>();
  const router = useRouter();
  const initialCode = decodeURIComponent(params?.batchCode || "LO-PILANI-SAMPLE-001").toUpperCase();

  const [codeInput, setCodeInput] = useState(initialCode);
  const [batch, setBatch] = useState<BatchRecord | null>(null);
  const [journey, setJourney] = useState<JourneyStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBatch = async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/trace/${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok) {
        setBatch(null);
        setJourney([]);
        setError(data?.error || "Batch record not found.");
      } else {
        setBatch(data.batch);
        setJourney(Array.isArray(data.journey) ? data.journey : []);
      }
    } catch {
      setError("Unable to reach traceability lookup right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCodeInput(initialCode);
    void loadBatch(initialCode);
  }, [initialCode]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = codeInput.trim().toUpperCase();
    if (!clean) return;
    router.push(`/trace/${encodeURIComponent(clean)}`);
    void loadBatch(clean);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <Link href="/" className="text-sm font-bold text-[var(--terracotta)] hover:underline">
          ← Back to Lado Organics Home
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]">
          QR Batch Traceability • Pilani, Rajasthan
        </span>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 shadow-sm mb-8">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-3">
          Product Batch Transparency
        </h1>
        <p className="text-sm sm:text-base opacity-80 mb-6 max-w-2xl">
          Enter or scan a product batch identifier (try <code className="font-mono font-bold">LO-PILANI-SAMPLE-001</code>) to inspect verified batch details and the 6-step farm-to-home journey. Lab links appear only when published by an authorized administrator.
        </p>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Enter batch code e.g. LO-PILANI-SAMPLE-001"
            className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm font-mono uppercase focus:outline-none focus:border-[var(--terracotta)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="primary-btn px-6 py-3 rounded-xl text-sm font-bold cursor-pointer disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Batch"}
          </button>
        </form>
      </div>

      {loading && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 text-center text-sm opacity-80">
          Loading batch ledger...
        </div>
      )}

      {!loading && error && (
        <div className="bg-[var(--surface)] border border-red-300 rounded-2xl p-8 text-center">
          <p className="font-bold text-red-700 mb-2">{error}</p>
          <p className="text-xs opacity-75">
            Check the batch code on your label or contact Lado Organics on WhatsApp (+91 96361 00337).
          </p>
        </div>
      )}

      {!loading && batch && (
        <div className="space-y-8">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[var(--border)]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
                  Batch ID: {batch.batchCode}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1">
                  {batch.productName} ({batch.variantLabel})
                </h2>
              </div>
              {batch.source === "sample_reference" && (
                <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-semibold">
                  Sample Reference Record
                </span>
              )}
            </div>

            <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
              <div>
                <dt className="text-xs uppercase opacity-60 font-bold">Origin Location</dt>
                <dd className="font-semibold mt-1">{batch.originLocation}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase opacity-60 font-bold">Production Date</dt>
                <dd className="font-semibold mt-1">{String(batch.productionDate)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase opacity-60 font-bold">Packaging Date</dt>
                <dd className="font-semibold mt-1">{batch.packagingDate ? String(batch.packagingDate) : "Pending confirmation"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase opacity-60 font-bold">Best Before</dt>
                <dd className="font-semibold mt-1">{batch.bestBeforeDate ? String(batch.bestBeforeDate) : "Per batch label"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase opacity-60 font-bold">Production Process</dt>
                <dd className="mt-1 opacity-85">{batch.productionProcess}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase opacity-60 font-bold">Quality Checks</dt>
                <dd className="mt-1 opacity-85">{batch.qualityChecks}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase opacity-60 font-bold">Storage Instructions</dt>
                <dd className="mt-1 opacity-85">{batch.storageInstructions}</dd>
              </div>
              <div className="sm:col-span-2 lg:col-span-3 pt-3 border-t border-[var(--border)]">
                <dt className="text-xs uppercase opacity-60 font-bold">Verified Lab Report</dt>
                <dd className="mt-1">
                  {batch.labReportUrl ? (
                    <a
                      href={batch.labReportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--terracotta)] font-bold underline"
                    >
                      View Published Lab Report ↗
                    </a>
                  ) : (
                    <span className="text-xs opacity-75">
                      No third-party lab report file is published yet for this batch record.
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {journey.length > 0 && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-serif font-bold mb-6">
                Farm-to-Home Journey (6 Stages)
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {journey.map((item) => (
                  <div
                    key={item.step}
                    className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--terracotta)] mb-1">
                      <span>STEP {item.step}</span>
                      <span className="uppercase opacity-70">{item.status.replace("_", " ")}</span>
                    </div>
                    <p className="font-serif font-bold text-base mb-1">{item.stage}</p>
                    <p className="text-xs opacity-80">{item.location}</p>
                    <p className="text-xs opacity-60 mt-1">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
