import React from "react";

export const metadata = { title: "Terms and Conditions | Lado Organics" };

export default function TermsPage() {
  return (
    <>
      <h1 className="text-3xl font-serif font-bold text-[var(--text-charcoal)] mb-6">Terms and Conditions</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Last Updated: November 2026</p>
      
      <div className="space-y-6 text-sm leading-relaxed text-[var(--text-charcoal)] font-light">
        <p>Welcome to Lado Organics (UDYAM-RJ-21-0104324). By accessing ladoorganics.in, you agree to these terms.</p>
        
        <h2 className="text-xl font-serif font-bold mt-8 mb-4">1. Product Information and Claims</h2>
        <p>Our A2 Bilona Ghee, Kechua Khad, and Tharparkar Dhoop are produced using traditional, zero-waste methods at our Pilani Gaushala. While we provide batch traceability and lab purity reports, our products are not intended to diagnose, treat, cure, or prevent any clinical disease. Consult a healthcare provider for dietary advice.</p>
        
        <h2 className="text-xl font-serif font-bold mt-8 mb-4">2. Pricing and Availability</h2>
        <p>All prices (e.g., ₹5,000 per Litre of A2 Bilona Ghee) are subject to change. Because we rely on natural farming cycles and ethical milking (calves drink first), stock is limited and allocated on a first-come, first-served basis or via the Essentials Club.</p>
        
        <h2 className="text-xl font-serif font-bold mt-8 mb-4">3. Jurisdiction</h2>
        <p>Any disputes arising from the use of this website or the purchase of our products shall be subject to the exclusive jurisdiction of the courts in Jhunjhunu, Rajasthan, India.</p>
      </div>
    </>
  );
}
