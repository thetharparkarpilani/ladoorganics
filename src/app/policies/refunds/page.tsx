import React from "react";

export const metadata = { title: "Refunds & Cancellations | Lado Organics" };

export default function RefundsPolicyPage() {
  return (
    <>
      <h1 className="text-3xl font-serif font-bold text-[var(--text-charcoal)] mb-6">Refunds & Cancellations</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Last Updated: November 2026</p>
      
      <div className="space-y-6 text-sm leading-relaxed text-[var(--text-charcoal)] font-light">
        <h2 className="text-xl font-serif font-bold mt-8 mb-4">1. Cancellations</h2>
        <p>Product orders can be cancelled before they are dispatched from our Pilani hub. Once handed over to our delivery partners, standard orders cannot be cancelled. For "Deep Work" Bhunga Stay bookings, cancellations made 7 days prior to check-in are eligible for a full refund.</p>
        
        <h2 className="text-xl font-serif font-bold mt-8 mb-4">2. Returns and Replacements</h2>
        <p>As our products are perishable food and wellness items (Ghee, Dhoop, Compost), we do not accept returns. However, if your glass jar arrives damaged, leaking, or compromised, please contact us at thetharparkarpilani@gmail.com within 24 hours of delivery with photographic evidence, and we will issue a free replacement.</p>
        
        <h2 className="text-xl font-serif font-bold mt-8 mb-4">3. Sponsorships</h2>
        <p>Adopt-a-Cow sponsorships are direct contributions to the Gaushala for fodder and veterinary care. Once processed, these specific transactions are non-refundable.</p>
      </div>
    </>
  );
}
