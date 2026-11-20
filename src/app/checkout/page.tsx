"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a full implementation, these would be populated from the Cart Context/LocalStorage
  const mockCartTotal = 5000; 
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919636100337";

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: mockCartTotal })
      });

      const data = await res.json();

      if (res.status === 503) {
        // Fallback triggered if Gateway keys are missing in .env
        setError("Payment gateway is currently unconfigured. Redirecting to WhatsApp concierge for assisted checkout...");
        setTimeout(() => {
          window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Namaste! I would like to complete my checkout. My cart total is ₹" + mockCartTotal)}`;
        }, 2000);
        return;
      }

      if (!res.ok) throw new Error(data.error || "Checkout failed");

      // In production, initialize Razorpay/Cashfree SDK here using data.orderId
      alert(`Server generated order ID: ${data.orderId}. Awaiting gateway integration.`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error during checkout.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg)] flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 shadow-sm">
        <h1 className="text-3xl font-serif font-bold mb-6 border-b border-[var(--border)] pb-4">Secure Checkout</h1>
        
        <div className="flex justify-between items-center mb-8 p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
          <span className="text-sm font-bold uppercase opacity-70">Order Subtotal</span>
          <span className="text-2xl font-serif font-bold text-[var(--terracotta)]">₹{mockCartTotal.toLocaleString("en-IN")}</span>
        </div>

        <form onSubmit={handleProcessPayment} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Full Name</label>
              <input type="text" required className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Phone Number</label>
              <input type="tel" required className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Shipping Address (Pilani & Pan-India)</label>
            <textarea required rows={3} className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"></textarea>
          </div>

          {error && (
            <div className="p-4 rounded-xl text-sm font-medium bg-red-50 text-red-900 border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-[var(--border)]">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl text-sm font-bold border border-[var(--border)]"
            >
              Back to Cart
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 primary-btn py-3 rounded-xl text-sm font-bold disabled:opacity-50"
            >
              {loading ? "Processing Server Request..." : "Proceed to Payment Gateway"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
