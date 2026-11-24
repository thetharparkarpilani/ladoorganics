"use client";

import { useEffect } from "react";

export default function PWARegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Register immediately after hydration. Waiting for window.load can miss
    // the event when this component mounts after the page has already loaded.
    void navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
      // Registration failure must not interrupt the storefront.
      if (process.env.NODE_ENV !== "production") console.warn("PWA service worker registration failed:", error);
    });
  }, []);

  return null;
}
