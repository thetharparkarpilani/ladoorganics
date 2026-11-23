"use client";

import React, { useState } from "react";

const chapters = [
  { id: "herd", number: "01", name: "The herd", title: "It begins with care.", text: "Meet the indigenous Tharparkar cows at the heart of the Lado story. Their care, comfort and place in the farm ecosystem come first.", icon: "🐄", note: "THARPARKAR GAUSHALA" },
  { id: "dung", number: "02", name: "The dung", title: "Nothing goes to waste.", text: "Cow dung is a useful farm resource. It can be dried for traditional dhoop making or processed through a managed biogas and composting cycle.", icon: "🌾", note: "TRADITIONAL DHOOP • BIOGAS" },
  { id: "soil", number: "03", name: "The soil", title: "Feed the living soil.", text: "Vermicomposting turns suitable organic material into a soil amendment for gardens and fields. Every batch and use should follow responsible handling.", icon: "🪱", note: "PURE KECHUA KHAD" },
  { id: "trees", number: "04", name: "The trees", title: "Grow a greener tomorrow.", text: "Healthy soil, thoughtful water use and trees help create a more resilient farm landscape for people, animals and crops.", icon: "🌳", note: "TREES • SHADE • BIODIVERSITY" },
  { id: "harvest", number: "05", name: "The harvest", title: "From farm to everyday life.", text: "Explore Lado Organics products and farm experiences—from Bilona ghee and milk to dhoop, vermicompost and kesar enquiries.", icon: "🧺", note: "FARM PRODUCTS & EXPERIENCES" }
] as const;

export default function FarmWorldSection() {
  const [active, setActive] = useState<(typeof chapters)[number]["id"]>("herd");
  const chapter = chapters.find((item) => item.id === active) ?? chapters[0];

  return (
    <section id="farm-world" className="farm-world-section relative overflow-hidden py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="farm-world-grain" aria-hidden="true" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="farm-eyebrow">A living, circular farm • Pilani, Rajasthan</p>
          <h2 className="farm-display mt-4">One farm.<br /><em>Many connections.</em></h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-[var(--text-muted)] max-w-2xl">Explore how animal care, traditional products, compost, soil and growing things connect in the Lado Organics story.</p>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-6 lg:gap-10 items-stretch">
          <div className="farm-world-art farm-world-photo relative min-h-[360px] sm:min-h-[500px] rounded-[2rem] overflow-hidden" aria-label="Photograph of a Tharparkar cow">
            <div className="farm-world-photo-overlay" />
            <div className="farm-photo-topline"><span>01 — THE HERD</span><span>THARPARKAR · INDIA</span></div>
            <div className="farm-photo-bottomline">
              <p>Where the story<br /><em>begins.</em></p>
              <span>Breed reference photograph<br />Pavanaja / Wikimedia Commons<br />CC BY-SA 3.0</span>
            </div>
          </div>
          <div className="farm-world-panel flex flex-col justify-between rounded-[2rem] p-6 sm:p-9">
            <div>
              <p className="farm-eyebrow">Explore the cycle · {chapter.number}</p>
              <div className="farm-chapter-icon mt-7" aria-hidden="true">{chapter.icon}</div>
              <h3 className="farm-display farm-display-small mt-5">{chapter.title}</h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--text-muted)]">{chapter.text}</p>
              <p className="mt-6 text-[10px] font-bold tracking-[.2em] text-[var(--accent-forest)]">{chapter.note}</p>
            </div>
            <div className="mt-10">
              <p className="text-[10px] uppercase tracking-[.2em] font-bold text-[var(--text-muted)] mb-3">Choose a chapter</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {chapters.map((item) => (
                  <button key={item.id} type="button" onClick={() => setActive(item.id)} aria-pressed={active === item.id} className={`farm-chapter-button ${active === item.id ? "is-active" : ""}`}>
                    <span>{item.icon}</span><span>{item.name}</span><span className="ml-auto opacity-55">{item.number}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="farm-product-ribbon mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-5 gap-px overflow-hidden rounded-2xl">
          {[["🪔","Tharparkar Dhoop"],["🌱","Vermicompost"],["🥛","A2 Milk"],["🫙","Bilona Ghee"],["🌸","Kesar"]].map(([icon, label]) => (
            <a key={label} href="#store" className="farm-product-link"><span>{icon}</span><span>{label}</span><span aria-hidden="true">↗</span></a>
          ))}
        </div>
      </div>
    </section>
  );
}
