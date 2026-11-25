"use client";

import React, { useState } from "react";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage("");

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        throw new Error("Google sign-in is not configured yet. Please contact Lado Organics.");
      }

      const randomBytes = crypto.getRandomValues(new Uint8Array(32));
      const verifier = base64UrlEncode(randomBytes);
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
      const challenge = base64UrlEncode(new Uint8Array(digest));
      window.sessionStorage.setItem("lado_supabase_pkce_verifier", verifier);
      const requestedNext = new URLSearchParams(window.location.search).get("next") || "";
      const safeNext = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/dashboard";
      window.sessionStorage.setItem("lado_post_auth_redirect", safeNext);

      const redirectTo = `${window.location.origin}/auth/callback`;
      const authorizeUrl = new URL(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/authorize`);
      authorizeUrl.searchParams.set("provider", "google");
      authorizeUrl.searchParams.set("redirect_to", redirectTo);
      authorizeUrl.searchParams.set("code_challenge", challenge);
      authorizeUrl.searchParams.set("code_challenge_method", "s256");

      window.location.assign(authorizeUrl.toString());
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to start Google sign-in.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl sm:p-8">
        <button onClick={onClose} className="absolute right-4 top-4 text-xs font-bold uppercase tracking-widest opacity-60 transition hover:opacity-100" aria-label="Close sign-in">Close</button>

        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex min-h-24 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-5 py-3">
            <Image src="/lado-organics-logo.svg" alt="Lado Organics — Lado Love Pure" width={250} height={138} priority className="h-auto max-h-24 w-auto object-contain" />
          </div>
          <h2 className="mb-2 text-2xl font-serif font-bold">My Lado Journey</h2>
          <p className="text-xs opacity-80">Sign in securely to access your Lado Organics customer account.</p>
        </div>

        {message && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-900">{message}</div>}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-white px-5 py-3.5 text-sm font-bold text-[#262626] shadow-sm transition hover:bg-stone-50 disabled:cursor-wait disabled:opacity-60"
        >
          <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.06 13.22l7.98 6.19C12.93 13.72 18.02 9.5 24 9.5Z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.95 46.98 31.8 46.98 24.55Z" />
            <path fill="#FBBC05" d="M11.04 28.59A14.4 14.4 0 0 1 10.27 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.58 10.78l8.46-6.19Z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.88 2.3-8.18 2.3-5.98 0-11.07-4.22-12.96-9.91l-8.46 6.19C6.03 42.62 14.14 48 24 48Z" />
          </svg>
          {loading ? "Connecting to Google..." : "Continue with Google"}
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Other sign-in methods</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)] p-4 text-center">
          <p className="text-sm font-semibold">Mobile OTP coming soon</p>
          <p className="mt-1 text-xs text-[var(--muted)]">Phone sign-in will be enabled after a real SMS delivery provider is configured.</p>
        </div>
        <p className="mt-5 text-center text-[10px] leading-relaxed text-[var(--muted)]">By continuing, you agree to use your Google account to create or access your Lado Organics customer account.</p>
      </div>
    </div>
  );
}
