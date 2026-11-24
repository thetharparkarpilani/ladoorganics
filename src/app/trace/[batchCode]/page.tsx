"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

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
  const { locale } = useLocale();
  const copy = locale === "hi" ? {
    back: "← Lado Organics होम पर लौटें", badge: "QR बैच ट्रेस • पिलानी, राजस्थान",
    title: "उत्पाद बैच की पारदर्शिता", intro: "बैच कोड दर्ज करें या स्कैन करें (उदाहरण LO-PILANI-SAMPLE-001) और सत्यापित बैच विवरण तथा खेत से घर तक की यात्रा देखें। लैब रिपोर्ट का लिंक केवल अधिकृत व्यवस्थापक द्वारा प्रकाशित होने पर दिखेगा।",
    placeholder: "बैच कोड दर्ज करें, जैसे LO-PILANI-SAMPLE-001", verify: "बैच जाँचें", verifying: "जाँच हो रही है…",
    loading: "बैच रिकॉर्ड लोड हो रहा है…", missing: "बैच रिकॉर्ड नहीं मिला।",
    help: "लेबल पर बैच कोड देखें या WhatsApp (+91 96361 00337) पर Lado Organics से संपर्क करें।",
    batch: "बैच आईडी", sample: "नमूना संदर्भ रिकॉर्ड", origin: "मूल स्थान", production: "निर्माण की तारीख",
    packaging: "पैकिंग की तारीख", pending: "पुष्टि लंबित", bestBefore: "उपयोग की अंतिम तारीख",
    perLabel: "बैच लेबल के अनुसार", process: "निर्माण प्रक्रिया", quality: "गुणवत्ता जाँच",
    storage: "भंडारण निर्देश", report: "सत्यापित लैब रिपोर्ट", viewReport: "प्रकाशित लैब रिपोर्ट देखें ↗",
    noReport: "इस बैच रिकॉर्ड के लिए अभी कोई तीसरी-पक्ष लैब रिपोर्ट प्रकाशित नहीं है।",
    journey: "खेत से घर तक की यात्रा (6 चरण)", step: "चरण",
    lookupError: "अभी ट्रेस जानकारी नहीं मिल पा रही।",
  } : locale === "ma" ? {
    back: "← Lado Organics रै घर पन्ने पर लौटो", badge: "QR बैच री जांच • पिलानी, राजस्थान",
    title: "सामान रै बैच री पूरी जानकारी", intro: "बैच कोड लिखो या स्कैन करो (मिसाल LO-PILANI-SAMPLE-001) अर पक्की बैच जानकारी अर खेत सूं घर तक री यात्रा देखो। लैब रिपोर्ट रो लिंक तद ही दिखै जद मंजूर व्यवस्थापक छापै।",
    placeholder: "बैच कोड लिखो, ज्यूं LO-PILANI-SAMPLE-001", verify: "बैच जांचो", verifying: "जांच चालै है…",
    loading: "बैच रो हिसाब खुलै है…", missing: "बैच रो रिकॉर्ड कोनी मिल्यो।",
    help: "लेबल पर बैच कोड देखो या WhatsApp (+91 96361 00337) पर Lado Organics नै खबर करो।",
    batch: "बैच आईडी", sample: "नमूना संदर्भ रिकॉर्ड", origin: "मूल ठिकाणो", production: "बणावण री तारीख",
    packaging: "पैक करणी री तारीख", pending: "पुष्टि बाकी", bestBefore: "इस्तेमाल री आखरी तारीख",
    perLabel: "बैच रै लेबल अनुसार", process: "बणावण री रीति", quality: "गुणवत्ता जांच",
    storage: "राखण रो तरीका", report: "पक्की लैब रिपोर्ट", viewReport: "छापी री लैब रिपोर्ट देखो ↗",
    noReport: "ई बैच खातर अभी बाहरी लैब री रिपोर्ट छापी कोनी।",
    journey: "खेत सूं घर तक री यात्रा (6 पड़ाव)", step: "पड़ाव",
    lookupError: "अभी बैच री जानकारी मिलै कोनी।",
  } : {
    back: "← Back to Lado Organics Home", badge: "QR Batch Traceability • Pilani, Rajasthan",
    title: "Product Batch Transparency", intro: "Enter or scan a product batch identifier (try LO-PILANI-SAMPLE-001) to inspect verified batch details and the 6-step farm-to-home journey. Lab links appear only when published by an authorized administrator.",
    placeholder: "Enter batch code e.g. LO-PILANI-SAMPLE-001", verify: "Verify Batch", verifying: "Verifying...",
    loading: "Loading batch ledger...", missing: "Batch record not found.",
    help: "Check the batch code on your label or contact Lado Organics on WhatsApp (+91 96361 00337).",
    batch: "Batch ID", sample: "Sample Reference Record", origin: "Origin Location", production: "Production Date",
    packaging: "Packaging Date", pending: "Pending confirmation", bestBefore: "Best Before",
    perLabel: "Per batch label", process: "Production Process", quality: "Quality Checks",
    storage: "Storage Instructions", report: "Verified Lab Report", viewReport: "View Published Lab Report ↗",
    noReport: "No third-party lab report file is published yet for this batch record.",
    journey: "Farm-to-Home Journey (6 Stages)", step: "STEP",
    lookupError: "Unable to reach traceability lookup right now.",
  };
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
        setError(data?.error || copy.missing);
      } else {
        setBatch(data.batch);
        setJourney(Array.isArray(data.journey) ? data.journey : []);
      }
    } catch {
      setError(copy.lookupError);
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
          {copy.back}
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]">
          {copy.badge}
        </span>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 shadow-sm mb-8">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-3">
          {copy.title}
        </h1>
        <p className="text-sm sm:text-base opacity-80 mb-6 max-w-2xl">
          {copy.intro}
        </p>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder={copy.placeholder}
            className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm font-mono uppercase focus:outline-none focus:border-[var(--terracotta)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="primary-btn px-6 py-3 rounded-xl text-sm font-bold cursor-pointer disabled:opacity-50"
          >
            {loading ? copy.verifying : copy.verify}
          </button>
        </form>
      </div>

      {loading && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 text-center text-sm opacity-80">
          {copy.loading}
        </div>
      )}

      {!loading && error && (
        <div className="bg-[var(--surface)] border border-red-300 rounded-2xl p-8 text-center">
          <p className="font-bold text-red-700 mb-2">{error}</p>
          <p className="text-xs opacity-75">
            {copy.help}
          </p>
        </div>
      )}

      {!loading && batch && (
        <div className="space-y-8">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[var(--border)]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
                  {copy.batch}: {batch.batchCode}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1">
                  {batch.productName} ({batch.variantLabel})
                </h2>
              </div>
              {batch.source === "sample_reference" && (
                <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-semibold">
                  {copy.sample}
                </span>
              )}
            </div>

            <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
              <div>
                <dt className="text-xs uppercase opacity-60 font-bold">{copy.origin}</dt>
                <dd className="font-semibold mt-1">{batch.originLocation}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase opacity-60 font-bold">{copy.production}</dt>
                <dd className="font-semibold mt-1">{String(batch.productionDate)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase opacity-60 font-bold">{copy.packaging}</dt>
                <dd className="font-semibold mt-1">{batch.packagingDate ? String(batch.packagingDate) : copy.pending}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase opacity-60 font-bold">{copy.bestBefore}</dt>
                <dd className="font-semibold mt-1">{batch.bestBeforeDate ? String(batch.bestBeforeDate) : copy.perLabel}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase opacity-60 font-bold">{copy.process}</dt>
                <dd className="mt-1 opacity-85">{batch.productionProcess}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase opacity-60 font-bold">{copy.quality}</dt>
                <dd className="mt-1 opacity-85">{batch.qualityChecks}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase opacity-60 font-bold">{copy.storage}</dt>
                <dd className="mt-1 opacity-85">{batch.storageInstructions}</dd>
              </div>
              <div className="sm:col-span-2 lg:col-span-3 pt-3 border-t border-[var(--border)]">
                <dt className="text-xs uppercase opacity-60 font-bold">{copy.report}</dt>
                <dd className="mt-1">
                  {batch.labReportUrl ? (
                    <a
                      href={batch.labReportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--terracotta)] font-bold underline"
                    >
                      {copy.viewReport}
                    </a>
                  ) : (
                    <span className="text-xs opacity-75">
                      {copy.noReport}
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {journey.length > 0 && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-serif font-bold mb-6">
                {copy.journey}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {journey.map((item) => (
                  <div
                    key={item.step}
                    className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--terracotta)] mb-1">
                      <span>{copy.step} {item.step}</span>
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
