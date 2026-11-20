import React from "react";
import Link from "next/link";
import StorefrontSection from "@/components/StorefrontSection";
import CowAsCoconutMap from "@/components/CowAsCoconutMap";

export default function PremiumHomePage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      
      {/* 1. Luxurious Hero Section */}
      <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--mud) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
          <div className="status-pill inline-flex items-center gap-3 px-5 py-2 rounded-full mb-8 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)] animate-pulse"></span>
            Pilani, Rajasthan • ZED Bronze • MSME Certified
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-[var(--mud)] leading-[1.1] mb-8 tracking-tight">
            Pure Tharparkar Tradition, <br className="hidden sm:block"/>
            <span className="text-[var(--terracotta)] italic font-light">Delivered to Your Doorstep.</span>
          </h1>
          
          <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed max-w-2xl mx-auto mb-10 font-light animate-fade-in-delayed">
            Rooted in the heart of Rajasthan, we operate on a zero-waste philosophy. 
            From hand-churned A2 Bilona Ghee to deeply immersive mud-house farm stays, 
            experience an unadulterated connection to the earth.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5 animate-fade-in-delayed">
            <Link href="#store" className="w-full sm:w-auto primary-btn px-10 py-4 rounded-full font-bold tracking-wide text-sm flex items-center justify-center gap-3">
              <i className="fas fa-jar"></i> Shop A2 Bilona Ghee
            </Link>
            <Link href="#blueprint" className="w-full sm:w-auto bg-transparent text-[var(--mud)] border border-[var(--border)] px-10 py-4 rounded-full font-bold tracking-wide text-sm hover:border-[var(--mud)] transition flex items-center justify-center gap-3">
              Explore Our Farm
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Brand Ethos / Founder Note */}
      <section className="py-24 bg-white border-y border-[var(--border)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative aspect-[4/5] bg-[var(--bg)] rounded-[2rem] overflow-hidden border border-[var(--border)] flex items-center justify-center">
            {/* Placeholder for real farm imagery */}
            <i className="fas fa-leaf text-9xl text-[var(--earth)] opacity-20"></i>
            <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white">
              <h4 className="font-serif font-bold text-lg mb-1">Akash Saini</h4>
              <p className="text-xs font-bold tracking-widest text-[var(--terracotta)] uppercase mb-2">Founder, BITS Pilani Alumnus</p>
              <p className="text-sm text-[var(--muted)] leading-relaxed">Applying systems engineering to preserve indigenous heritage.</p>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6 leading-tight">Authentic Indian <br/>Gau Sanskriti Heritage.</h2>
            <p className="text-[var(--muted)] leading-relaxed mb-6 font-light text-lg">
              We empower over 100 local farming families by connecting conscious global buyers to our regenerative ecosystem. 
            </p>
            <ul className="space-y-4 text-[var(--mud)] font-medium">
              <li className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-[var(--earth)]/10 flex items-center justify-center text-[var(--earth)]"><i className="fas fa-check"></i></span>
                100% Indigenous Tharparkar A2 Milk
              </li>
              <li className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-[var(--earth)]/10 flex items-center justify-center text-[var(--earth)]"><i className="fas fa-check"></i></span>
                Traditional Curd-Cultured Bilona Churning
              </li>
              <li className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-[var(--earth)]/10 flex items-center justify-center text-[var(--earth)]"><i className="fas fa-check"></i></span>
                Strict Batch Traceability & Transparency
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. The Circular Store (E-Commerce Placeholder) */}
      <div id="store">
        {/* We will mount the StorefrontSection component here when it is upgraded to match this vibe */}
        <div className="py-24 text-center bg-[var(--bg)]">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">The Circular Store</span>
          <h2 className="text-4xl font-serif font-bold mt-3 mb-10">Farm-Direct Offerings</h2>
          <p className="text-[var(--muted)]">Your premium storefront will render here.</p>
        </div>
      </div>

    </div>
  );
}
