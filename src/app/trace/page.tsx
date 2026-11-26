"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function TraceabilityEntryPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const copy = locale === "hi" ? {
    back: "← Lado Organics होम पर लौटें",
    badge: "खेत से घर तक • बैच ट्रेसबिलिटी",
    title: "अपने उत्पाद का बैच जाँचें",
    intro: "अपने उत्पाद के लेबल पर छपा बैच कोड दर्ज करें। केवल स्वीकृत उत्पादन रिकॉर्ड दिखाए जाएँगे।",
    placeholder: "लेबल पर दिया बैच कोड",
    submit: "बैच जाँचें",
    help: "बैच कोड आमतौर पर पैक के लेबल या QR कोड के पास मिलता है। सहायता के लिए हमारी टीम से संपर्क करें।",
    required: "कृपया अपने उत्पाद के लेबल से बैच कोड दर्ज करें।",
  } : locale === "ma" ? {
    back: "← Lado Organics रै घर पन्ने पर लौटो",
    badge: "खेत सूं घर तक • बैच री जांच",
    title: "थारा सामान रो बैच जांचो",
    intro: "थारा सामान रै लेबल पर छाप्यो बैच कोड लिखो। खाली मंजूर उत्पादन रिकॉर्ड देखाया जावैला।",
    placeholder: "लेबल पर छाप्यो बैच कोड",
    submit: "बैच जांचो",
    help: "बैच कोड पैक रै लेबल या QR कोड रै पास मिलैला। मदद खातर म्हारी टीम नै खबर करो।",
    required: "कृपया सामान रै लेबल सूं बैच कोड लिखो।",
  } : {
    back: "← Back to Lado Organics Home",
    badge: "Farm to Home • Batch Traceability",
    title: "Check your product batch",
    intro: "Enter the batch code printed on your product label. Only approved production records are displayed.",
    placeholder: "Batch code from your product label",
    submit: "Verify batch",
    help: "Your batch code is usually printed on the pack label near its QR code. Contact our team if you need help.",
    required: "Please enter the batch code printed on your product label.",
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setError(copy.required);
      return;
    }
    if (!/^[A-Z0-9][A-Z0-9-]{2,63}$/.test(normalized)) {
      setError(locale === "hi" ? "बैच कोड का प्रारूप सही नहीं है।" : locale === "ma" ? "बैच कोड रो रूप सही कोनी है।" : "That batch code format doesn't look right. Please check the label.");
      return;
    }
    router.push(`/trace/${encodeURIComponent(normalized)}`);
  };

  return (
    <main className="lado-trace-page min-h-screen bg-[var(--bg)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-[var(--terracotta)] hover:underline">{copy.back}</Link>
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-10">
          <span className="inline-flex rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-bold uppercase tracking-wider">{copy.badge}</span>
          <h1 className="mt-5 font-serif text-3xl font-bold sm:text-5xl">{copy.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 opacity-80 sm:text-base">{copy.intro}</p>
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="batch-code" className="sr-only">{copy.placeholder}</label>
            <input
              id="batch-code"
              type="text"
              value={code}
              onChange={(event) => { setCode(event.target.value.toUpperCase()); setError(""); }}
              placeholder={copy.placeholder}
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              maxLength={64}
              className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 font-mono text-sm uppercase"
            />
            <button type="submit" className="primary-btn rounded-xl px-6 py-3 text-sm font-bold">{copy.submit}</button>
          </form>
          {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p>}
          <p className="mt-5 text-xs leading-6 opacity-70">{copy.help}</p>
        </section>
      </div>
    </main>
  );
}
