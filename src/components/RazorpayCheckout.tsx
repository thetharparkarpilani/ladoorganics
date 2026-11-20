"use client";

import React, { useState } from "react";
import Script from "next/script";

interface CheckoutProps {
  amountInr: number;
  onSuccess: () => void;
}

export default function RazorpayCheckout({ amountInr, onSuccess }: CheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInr, customerName: "Lado Patron", phone: "9999999999" }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Payment gateway offline. Redirecting to WhatsApp.");
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Lado Organics",
        description: "Premium A2 Bilona Ecosystem",
        order_id: data.orderId,
        handler: function (response: any) {
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          onSuccess();
        },
        prefill: {
          name: "Lado Patron",
          contact: "9999999999",
        },
        theme: {
          color: "#c2410c", // matches var(--terracotta)
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className="w-full primary-btn py-4 rounded-xl font-bold text-sm shadow-lg disabled:opacity-50 transition"
      >
        {loading ? "Initializing Secure Gateway..." : `Pay ₹${amountInr.toLocaleString("en-IN")} Securely`}
      </button>
    </>
  );
}
