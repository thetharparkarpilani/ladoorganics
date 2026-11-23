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
          <div className="farm-world-art relative min-h-[360px] sm:min-h-[500px] rounded-[2rem] overflow-hidden" aria-label="Illustrated Rajasthan farm landscape">
            <div className="farm-art-sun" />
            <div className="farm-art-cloud farm-art-cloud-a" />
            <div className="farm-art-cloud farm-art-cloud-b" />
            <div className="farm-art-hill farm-art-hill-back" />
            <div className="farm-art-hill farm-art-hill-front" />
            <div className="farm-art-tree farm-art-tree-one"><span /><i /></div>
            <div className="farm-art-tree farm-art-tree-two"><span /><i /></div>
            <div className="farm-art-grass" />
            <div className="farm-art-cow" aria-hidden="true">
              <svg viewBox="0 0 330 190" role="img" aria-label="Illustration of a white indigenous cow">
                <path d="M67 82 Q74 55 111 51 L211 53 Q247 57 253 88 L270 95 Q292 90 300 107 L291 128 L267 132 L253 119 L248 157 L233 157 L231 119 L126 119 L122 157 L106 157 L103 116 L84 111 L79 157 L63 157 L65 111 Q48 105 50 91Z" fill="#fff9e9" stroke="#735b43" strokeWidth="4" strokeLinejoin="round"/>
                <path d="M72 67 Q53 42 48 25 Q70 32 88 59 M93 60 Q101 35 119 25 Q119 49 108 66" fill="#fff9e9" stroke="#735b43" strokeWidth="4" strokeLinejoin="round"/>
                <path d="M251 91 Q276 72 294 86 L311 108 L292 122 L267 116Z" fill="#fff9e9" stroke="#735b43" strokeWidth="4"/>
                <path d="M299 86 Q318 65 322 54" fill="none" stroke="#735b43" strokeWidth="5" strokeLinecap="round"/>
                <path d="M285 120 Q300 131 310 121" fill="none" stroke="#b57c69" strokeWidth="4" strokeLinecap="round"/>
                <path d="M174 56 Q181 38 194 36 Q206 37 208 56" fill="#d8c7a9" stroke="#735b43" strokeWidth="3"/>
                <path d="M142 119 L141 158 M219 119 L220 158" stroke="#735b43" strokeWidth="4" strokeLinecap="round"/>
                <path d="M79 91 Q97 83 111 92" stroke="#d8c7a9" strokeWidth="6" strokeLinecap="round"/>
                <circle cx="285" cy="101" r="3.5" fill="#3f3329"/>
              </svg>
            </div>
            <div className="farm-art-caption"><span>THE LADO FARM ECOSYSTEM</span><span>PILANI · RAJASTHAN</span></div>
            <span className="farm-art-bird bird-one">⌁</span><span className="farm-art-bird bird-two">⌁</span>
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
