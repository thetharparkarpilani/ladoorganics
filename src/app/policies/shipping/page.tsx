import React from "react";

export const metadata = { title: "Shipping Policy | Lado Organics" };

export default function ShippingPolicyPage() {
  return (
    <>
      <h1 className="text-3xl font-serif font-bold text-[var(--text-charcoal)] mb-6">Shipping & Delivery</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Last Updated: November 2026</p>
      
      <div className="space-y-6 text-sm leading-relaxed text-[var(--text-charcoal)] font-light">
        <h2 className="text-xl font-serif font-bold mt-8 mb-4">1. Dispatch Timelines</h2>
        <p>Because our A2 Bilona Ghee is churned fresh in small batches at our Pilani farm, standard orders are typically dispatched within 2–4 business days. You will receive a traceability QR code upon dispatch.</p>
        
        <h2 className="text-xl font-serif font-bold mt-8 mb-4">2. Delivery Partners & Regions</h2>
        <p>We ship Pan-India using verified logistic partners. Delivery to Delhi-NCR generally takes 2–3 days post-dispatch. Remote locations may require 5–7 business days.</p>
        
        <h2 className="text-xl font-serif font-bold mt-8 mb-4">3. Shipping Charges</h2>
        <p>Shipping rates are calculated dynamically at checkout based on your PIN code and cart weight. Lado Monthly Essentials Club members may be eligible for priority or subsidized shipping based on their active mandate.</p>
      </div>
    </>
  );
}
