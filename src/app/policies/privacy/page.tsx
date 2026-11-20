import React from "react";

export const metadata = { title: "Privacy Policy | Lado Organics" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <h1 className="text-3xl font-serif font-bold text-[var(--text-charcoal)] mb-6">Privacy Policy</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Last Updated: November 2026</p>
      
      <div className="space-y-6 text-sm leading-relaxed text-[var(--text-charcoal)] font-light">
        <p>At Lado Organics, operating from Pilani, Rajasthan, we respect your privacy and are committed to protecting your personal data in accordance with applicable Indian laws.</p>
        
        <h2 className="text-xl font-serif font-bold mt-8 mb-4">1. Data Collection</h2>
        <p>We collect information you provide directly to us when you make a purchase, create a "My Lado Journey" account, subscribe to the Essentials Club, book a Bhunga stay, or sponsor a calf. This includes your name, email, phone number, and delivery address.</p>
        
        <h2 className="text-xl font-serif font-bold mt-8 mb-4">2. Secure Payments</h2>
        <p>All payment transactions are processed securely through certified gateways (e.g., Razorpay/Cashfree). Lado Organics does not store your raw credit card, UPI, or banking information on our servers.</p>
        
        <h2 className="text-xl font-serif font-bold mt-8 mb-4">3. Data Usage</h2>
        <p>We use your data solely to process your orders, provide customer support, deliver traceable batch updates, and communicate farm-related news (if you have opted in). We do not sell your personal data to third-party marketing agencies.</p>
      </div>
    </>
  );
}
