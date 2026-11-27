"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PWARegistration() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
        if (process.env.NODE_ENV !== "production") console.warn("PWA service worker registration failed:", error);
      });
    }

    const userAgent = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !(window as Window & { MSStream?: unknown }).MSStream);
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true);

    const handleInstallAvailable = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => setInstallPrompt(null);
    window.addEventListener("beforeinstallprompt", handleInstallAvailable);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallAvailable);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstallPrompt(null);
  };

  if (dismissed || isStandalone || (!installPrompt && !isIOS)) return null;

  return (
    <aside className="lado-install-prompt" aria-label="Install Lado Organics app">
      <Image src="/lado-organics-logo.svg" alt="" width={88} height={48} className="lado-install-logo" />
      <div className="lado-install-copy">
        <strong>Take Lado Organics with you</strong>
        <span>{isIOS && !installPrompt ? "In Safari, tap Share, then choose Add to Home Screen." : "Install the Lado experience on your device for quick access."}</span>
      </div>
      {installPrompt && <button type="button" onClick={() => void installApp()}>Install</button>}
      <button type="button" className="lado-install-dismiss" aria-label="Dismiss install prompt" onClick={() => setDismissed(true)}>×</button>
    </aside>
  );
}
