"use client";

import React, { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [method, setMethod] = useState<"otp" | "email">("otp");
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  if (!isOpen) return null;

  const handleRequestAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    // Simulate network delay for Auth provider
    setTimeout(() => {
      setMessage({ 
        type: "err", 
        text: "Authentication provider not configured in .env.local. Please configure NEXT_PUBLIC_AUTH_PROVIDER to enable secure customer sessions." 
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100"
        >
          Close
        </button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold mb-2">My Lado Journey</h2>
          <p className="text-xs opacity-80">Log in to track orders, manage your subscription preferences, and view sponsorship records.</p>
        </div>

        <div className="flex gap-2 mb-6 p-1 bg-[var(--bg)] rounded-xl border border-[var(--border)]">
          <button 
            type="button"
            onClick={() => setMethod("otp")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${method === "otp" ? "bg-[var(--surface)] shadow-sm" : "opacity-60"}`}
          >
            Mobile OTP
          </button>
          <button 
            type="button"
            onClick={() => setMethod("email")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${method === "email" ? "bg-[var(--surface)] shadow-sm" : "opacity-60"}`}
          >
            Email Login
          </button>
        </div>

        <form onSubmit={handleRequestAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              {method === "otp" ? "Mobile Number" : "Email Address"}
            </label>
            <input
              type={method === "otp" ? "tel" : "email"}
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={method === "otp" ? "+91..." : "you@example.com"}
              className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:border-[var(--terracotta)]"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-xs font-medium ${message.type === "ok" ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900"}`}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !identifier}
            className="w-full primary-btn py-3 rounded-xl text-sm font-bold disabled:opacity-50"
          >
            {loading ? "Verifying..." : (method === "otp" ? "Send Secure OTP" : "Continue with Email")}
          </button>

          <div className="relative py-4 text-center">
            <span className="bg-[var(--surface)] px-2 text-xs opacity-50 relative z-10">OR</span>
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[var(--border)]"></div>
          </div>

          <button 
            type="button" 
            onClick={handleRequestAuth}
            className="w-full py-3 rounded-xl text-sm font-bold border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--terracotta)] transition"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
