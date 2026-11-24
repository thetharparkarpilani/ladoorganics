"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { LocaleCode } from "@/types/domain";

type LocaleContextValue = { locale: LocaleCode; setLocale: (locale: LocaleCode) => void; ready: boolean };
const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => undefined,
  ready: false,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("lado-locale");
      if (saved === "en" || saved === "hi" || saved === "ma") setLocaleState(saved);
    } catch { /* Storage may be unavailable; English remains the safe default. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "ma" ? "hi" : locale;
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  const setLocale = (next: LocaleCode) => {
    setLocaleState(next);
    try { window.localStorage.setItem("lado-locale", next); } catch { /* The choice still applies for this session. */ }
  };

  const value = useMemo(() => ({ locale, setLocale, ready }), [locale, ready]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
