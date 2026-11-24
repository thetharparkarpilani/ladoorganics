"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";

export default function GlobalLanguageSwitcher() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  if (pathname === "/") return null;

  return (
    <label className="fixed bottom-5 left-5 z-[65] inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/95 px-3 py-2 text-xs font-semibold text-[var(--mud)] shadow-lg backdrop-blur">
      <span aria-hidden="true">文</span>
      <span className="sr-only">Website language</span>
      <select
        aria-label="Website language"
        value={locale}
        onChange={(event) => setLocale(event.target.value as "en" | "hi" | "ma")}
        className="max-w-[112px] bg-transparent outline-none"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="ma">मारवाड़ी</option>
      </select>
    </label>
  );
}
