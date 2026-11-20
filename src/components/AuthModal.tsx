"use client";

import React, { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      
      setMessage({ type: "ok", text: data.message });
      setStep("otp");
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Network error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      
      setMessage({ type: "ok", text: "Secure session established. Redirecting..." });
      
      // Force page reload to apply HttpOnly secure cookie across the app
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
      
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Verification failed" });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition">
          Close
        </button>
        
        <div className="mb-6 text-center">
          <div className="w-12 h-12 mx-auto bg-[#3b2314] text-[#fbbf24] rounded-full flex items-center justify-center text-xl mb-4 border border-[var(--border)]">
             <i className="fas fa-leaf"></i>
          </div>
          <h2 className="text-2xl font-serif font-bold mb-2">My Lado Journey</h2>
          <p className="text-xs opacity-80">Secure login to track A2 Ghee batches, Bhunga stays, and Gau Seva impact.</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-xs font-medium mb-4 border ${message.type === "ok" ? "bg-green-50 text-green-900 border-green-200" : "bg-red-50 text-red-900 border-red-200"}`}>
            {message.text}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">Mobile Number</label>
              <div className="flex bg-[var(--bg)] border border-[var(--border)] rounded-xl overflow-hidden focus-within:border-[var(--terracotta)] transition">
                <span className="px-4 py-3 bg-[var(--surface)] border-r border-[var(--border)] text-sm font-bold text-[var(--muted)]">+91</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full p-3 bg-transparent text-sm focus:outline-none text-[var(--mud)] font-medium"
                />
              </div>
            </div>

            <button type="submit" disabled={loading || phone.length < 10} className="w-full primary-btn py-3.5 rounded-xl text-sm font-bold disabled:opacity-50 transition shadow-md">
              {loading ? "Transmitting..." : "Send Secure OTP"}
            </button>
            
            <div className="pt-4 text-center">
               <button type="button" className="text-xs font-bold border border-[var(--border)] px-6 py-3 rounded-xl hover:border-[var(--terracotta)] transition w-full">
                 <i className="fab fa-google mr-2 text-[var(--terracotta)]"></i> Continue with Google OAuth
               </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">Enter OTP sent to +91 {phone}</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-center tracking-[0.5em] font-mono text-lg focus:outline-none focus:border-[var(--terracotta)] text-[var(--mud)]"
                maxLength={6}
              />
            </div>

            <button type="submit" disabled={loading || otp.length < 4} className="w-full primary-btn py-3.5 rounded-xl text-sm font-bold disabled:opacity-50 transition shadow-md">
              {loading ? "Verifying Token..." : "Authenticate Session"}
            </button>
            
            <button type="button" onClick={() => setStep("phone")} className="w-full text-center text-xs font-bold text-[var(--muted)] hover:text-[var(--terracotta)] transition pt-2">
              Change Mobile Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
