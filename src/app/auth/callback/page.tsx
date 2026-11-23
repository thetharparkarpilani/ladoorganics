"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Completing your secure Google sign-in...");

  useEffect(() => {
    let active = true;

    async function completeSignIn() {
      const params = new URLSearchParams(window.location.search);
      const error = params.get("error_description") || params.get("error");
      const code = params.get("code");
      const codeVerifier = window.sessionStorage.getItem("lado_supabase_pkce_verifier");

      if (error || !code || !codeVerifier) {
        if (active) setMessage(error ? error.replace(/\+/g, " ") : "Sign-in could not be completed. Please return and try again.");
        window.sessionStorage.removeItem("lado_supabase_pkce_verifier");
        return;
      }

      try {
        const response = await fetch("/api/auth/google/exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, codeVerifier }),
        });
        const result = await response.json();
        window.sessionStorage.removeItem("lado_supabase_pkce_verifier");

        if (!response.ok) throw new Error(result.error || "Google sign-in failed.");
        if (active) {
          setMessage("Welcome to Lado Organics. Redirecting to your account...");
          router.replace("/dashboard");
          router.refresh();
        }
      } catch (err) {
        if (active) setMessage(err instanceof Error ? err.message : "Google sign-in failed. Please try again.");
      }
    }

    void completeSignIn();
    return () => { active = false; };
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-xl">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#3b2314] text-[#fbbf24]">
          <i className="fas fa-leaf" aria-hidden="true" />
        </div>
        <h1 className="mb-3 text-2xl font-serif font-bold">My Lado Journey</h1>
        <p className="text-sm text-[var(--muted)]" role="status">{message}</p>
        <a href="/" className="mt-6 inline-block text-sm font-semibold text-[var(--terracotta)] underline">Return to Lado Organics</a>
      </div>
    </main>
  );
}
