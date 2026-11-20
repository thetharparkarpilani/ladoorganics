"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function PremiumHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locale, setLocale] = useState("en");

  return (
    <header className="sticky top-0 z-50 shadow-sm flex flex-col">
      {/* 1. Top Contact Strip */}
      <div className="bg-[#3b2314] text-[#fef3c7] py-1.5 px-4 text-center text-xs font-medium tracking-wide flex justify-center items-center gap-4">
        <span>
          <i className="fas fa-phone-alt text-[var(--earth)] mr-2"></i> 
          Contact Us: +91 96361 00337 | +91 94081 40329
        </span>
      </div>

      {/* 2. Running Discount & Announcement Bar */}
      <div className="running-discount-bar py-2 px-4 text-center font-bold tracking-wider flex justify-center items-center gap-3 text-[10px] sm:text-xs">
        <span>🎉 Flat 16% OFF on Tharparkar A2 Bilona Ghee.</span>
        <Link href="/#store" className="underline hover:text-[var(--earth)] transition">Shop Now</Link>
        <span className="bg-black/30 px-2 py-0.5 rounded ml-2 font-mono">04 DAYS 13 HOURS</span>
      </div>

      {/* 3. Main Navigation Bar with Search & Utility Icons */}
      <nav className="glass-nav border-b border-[var(--border)] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
            
          {/* Brand Logo */}
          <Link href="/" className="text-2xl md:text-3xl font-serif font-bold tracking-widest text-[var(--mud)]">
            LADO <span className="text-[var(--terracotta)] font-normal">ORGANICS</span>
          </Link>

          {/* Centralized Search Bar */}
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="I'm shopping for A2 Ghee, Dhoop, Khad..." 
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-full py-2.5 pl-5 pr-10 text-xs focus:outline-none focus:border-[var(--terracotta)] text-[var(--mud)] shadow-inner"
            />
            <i className="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--mud)]/50 text-xs"></i>
          </div>

          {/* User Utilities & Language Toggle */}
          <div className="flex items-center gap-5 text-sm text-[var(--mud)]">
            <select 
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="bg-transparent border border-[var(--border)] text-[var(--mud)] text-xs font-bold p-1.5 rounded cursor-pointer focus:outline-none hover:border-[var(--terracotta)] transition"
            >
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="ma">मारवाड़ी</option>
            </select>
            
            <Link href="/dashboard" className="hover:text-[var(--terracotta)] transition" title="My Lado Journey">
              <i className="far fa-user text-lg"></i>
            </Link>
            
            <button className="hover:text-[var(--terracotta)] transition relative cursor-pointer" title="Shopping Bag">
              <i className="fas fa-shopping-bag text-lg"></i>
              <span className="absolute -top-2 -right-2 bg-[var(--terracotta)] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>
            
            <button className="hover:text-[var(--terracotta)] transition cursor-pointer" title="Wishlist">
              <i className="far fa-heart text-lg"></i>
            </button>
          </div>
        </div>

        {/* Sub-Menu Category Links */}
        <div className="bg-white/60 border-t border-[var(--border)] py-2.5 px-4 md:px-6">
          <div className="max-w-7xl mx-auto flex justify-start sm:justify-center space-x-8 text-[10px] sm:text-xs font-bold tracking-widest text-[var(--mud)] overflow-x-auto no-scrollbar">
            <Link href="/" className="hover:text-[var(--terracotta)] transition whitespace-nowrap">HOME</Link>
            <Link href="/#store" className="hover:text-[var(--terracotta)] transition whitespace-nowrap">CATALOG</Link>
            <Link href="/#blueprint" className="hover:text-[var(--terracotta)] transition whitespace-nowrap">ZERO-WASTE ECOSYSTEM</Link>
            <Link href="/#adopt" className="hover:text-[var(--terracotta)] transition whitespace-nowrap">ADOPT A CALF</Link>
            <Link href="/#experiences" className="hover:text-[var(--terracotta)] transition whitespace-nowrap">BHUNGA FARM STAYS</Link>
            <Link href="/trace/LO-PILANI-SAMPLE-001" className="hover:text-[var(--terracotta)] transition whitespace-nowrap">VERIFY BATCH</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
