"use client";

import React, { useState } from "react";

interface FarmZone {
  id: string;
  code: string;
  title: string;
  inputLabel: string;
  outputLabel: string;
  detail: string;
}

const FARM_ZONES: FarmZone[] = [
  {
    id: "gaushala",
    code: "ZONE 01",
    title: "Tharparkar Gaushala & Calf Care",
    inputLabel: "Indigenous fodder & Pilani care",
    outputLabel: "A2 milk & fresh cow dung",
    detail:
      "Home to indigenous Tharparkar cattle and calves including Dholi Sheri, Tara, and Roshni in Pilani, Rajasthan."
  },
  {
    id: "bilona",
    code: "ZONE 02",
    title: "Traditional Bilona Ghee Unit",
    inputLabel: "Whole A2 milk cultured into curd",
    outputLabel: "A2 Bilona Ghee (₹5,000 / 1L)",
    detail:
      "Curd is churned using the traditional Bilona process and logged into batch traceability records."
  },
  {
    id: "biogas-khad",
    code: "ZONE 03",
    title: "Biogas Digester & Kechua Khad Beds",
    inputLabel: "Fresh dung & anaerobic biogas slurry",
    outputLabel: "Clean gas & Pure Kechua Khad (₹2,000 / 5 kg)",
    detail:
      "Biogas slurry feeds vermicompost beds to produce Pure Kechua Khad for organic gardens and soil health."
  },
  {
    id: "dhoop-bhunga",
    code: "ZONE 04",
    title: "Tharparkar Dhoop & Bhunga Stays",
    inputLabel: "Sun-dried dung, botanicals & mud architecture",
    outputLabel: "Tharparkar Dhoop (₹1,000 / Box) & Bhunga Stay (₹4,000 / Night)",
    detail:
      "Connects circular farm outputs with local farming families in Pilani and climate-responsive Bhunga stays."
  }
];

export default function CowAsCoconutMap() {
  const [selectedZoneId, setSelectedZoneId] = useState<string>("gaushala");
  const activeZone = FARM_ZONES.find((z) => z.id === selectedZoneId) ?? FARM_ZONES[0];

  return (
    <section id="blueprint" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            Interactive Digital Farm Map • Pilani, Rajasthan
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mt-2">
            My Lado Farm: Cow as a Coconut
          </h2>
          <p className="text-sm sm:text-base opacity-80 max-w-3xl mx-auto mt-3 leading-relaxed">
            Founded by Akash Saini (BITS Pilani), Lado Organics models circular resource reuse across four interconnected farm zones in Pilani. Select a zone below to inspect its inputs and outputs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {FARM_ZONES.map((zone) => {
            const isSelected = zone.id === activeZone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setSelectedZoneId(zone.id)}
                className={`text-left p-5 rounded-3xl border transition cursor-pointer ${
                  isSelected
                    ? "bg-[var(--mud)] text-white border-[var(--mud)] shadow-md"
                    : "bg-[var(--bg)] border-[var(--border)] hover:border-[var(--terracotta)]"
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-widest opacity-75">
                  {zone.code}
                </span>
                <h3 className="text-lg font-serif font-bold mt-1">{zone.title}</h3>
              </button>
            );
          })}
        </div>

        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[var(--border)]">
            <h3 className="text-2xl font-serif font-bold text-[var(--terracotta)]">
              {activeZone.code}: {activeZone.title}
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)]">
              Pilani Ecosystem Zone
            </span>
          </div>
          <p className="text-sm opacity-85 leading-relaxed mb-5">{activeZone.detail}</p>
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <span className="block font-bold uppercase opacity-60">Primary Input</span>
              <span className="font-semibold text-sm mt-1 block">{activeZone.inputLabel}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <span className="block font-bold uppercase opacity-60">Verified Output</span>
              <span className="font-semibold text-sm text-[var(--terracotta)] mt-1 block">
                {activeZone.outputLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-xs font-bold">
          <span className="px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg)]">
            MSME: UDYAM-RJ-21-0104324
          </span>
          <span className="px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg)]">
            ZED Bronze Certified
          </span>
          <a
            href="/policies"
            className="px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--terracotta)] hover:underline"
          >
            Policies & Legal Templates →
          </a>
        </div>
      </div>
    </section>
  );
}
