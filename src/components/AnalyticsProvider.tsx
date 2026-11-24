"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";

const CONSENT_KEY = "lado_analytics_consent_v1";

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const configuredGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
  const configuredPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
  const gaId = /^G-[A-Z0-9]+$/.test(configuredGaId) ? configuredGaId : "";
  const pixelId = /^\d{5,30}$/.test(configuredPixelId) ? configuredPixelId : "";
  const [consent, setConsent] = useState<"unknown" | "granted" | "denied">("unknown");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CONSENT_KEY);
      if (saved === "granted" || saved === "denied") setConsent(saved);
    } catch {
      // If storage is unavailable, do not load optional analytics.
      setConsent("denied");
    }
  }, []);

  const chooseConsent = (value: "granted" | "denied") => {
    try { window.localStorage.setItem(CONSENT_KEY, value); } catch { /* Keep this choice for this page only. */ }
    setConsent(value);
  };

  return (
    <>
      {children}
      {consent === "granted" && gaId && (
        <>
          <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });`}
          </Script>
        </>
      )}
      {consent === "granted" && pixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${pixelId}');fbq('track','PageView');`}
        </Script>
      )}
      {consent === "unknown" && (gaId || pixelId) && (
        <aside role="dialog" aria-label="Analytics preferences" aria-live="polite"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xl">
          <p className="text-sm font-semibold">Your privacy choices</p>
          <p className="mt-1 text-xs opacity-75">Lado Organics uses optional analytics to understand website usage. These tools stay off unless you allow them. You can change your choice by clearing this site’s stored preferences.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => chooseConsent("granted")} className="primary-btn rounded-lg px-4 py-2 text-xs font-bold">Accept analytics</button>
            <button type="button" onClick={() => chooseConsent("denied")} className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-bold">Decline</button>
          </div>
        </aside>
      )}
    </>
  );
}
