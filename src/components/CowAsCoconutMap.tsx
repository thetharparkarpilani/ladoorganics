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
    title: "Tharparkar cattle care",
    inputLabel: "Fodder and animal care",
    outputLabel: "Milk and farm by-products",
    detail:
      "The farm story begins with indigenous Tharparkar cattle and the care routines described by the Lado team. Individual animal profiles are not displayed until verified."
  },
  {
    id: "bilona",
    code: "ZONE 02",
    title: "Traditional Bilona Ghee Unit",
    inputLabel: "Milk cultured into curd",
    outputLabel: "Bilona ghee",
    detail:
      "Lado describes a curd-based Bilona process. Batch-specific records are published when an approved batch record is available."
  },
  {
    id: "biogas-khad",
    code: "ZONE 03",
    title: "Biogas Digester & Kechua Khad Beds",
    inputLabel: "Fresh dung & anaerobic biogas slurry",
    outputLabel: "Biogas process and composting",
    detail:
      "The site describes a circular use of farm by-products. Current operating details and output records should be confirmed with the Lado team."
  },
  {
    id: "dhoop-bhunga",
    code: "ZONE 04",
    title: "Tharparkar Dhoop & Bhunga Stays",
    inputLabel: "Sun-dried dung, botanicals & mud architecture",
    outputLabel: "Dhoop and farm-stay enquiries",
    detail:
      "Ask the team about current product and stay availability. Prices, booking terms and service details are confirmed before an order or visit."
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
            Interactive Farm Ecosystem • Pilani, Rajasthan
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mt-2">
            The Lado Farm Ecosystem
          </h2>
          <p className="text-sm sm:text-base opacity-80 max-w-3xl mx-auto mt-3 leading-relaxed">
            Explore the farm relationships described by Lado Organics. Select a zone to see its described inputs and outputs; batch-level details are published only when they are recorded and approved.
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
              <span className="block font-bold uppercase opacity-60">Described Output</span>
              <span className="font-semibold text-sm text-[var(--terracotta)] mt-1 block">
                {activeZone.outputLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-xs font-bold">
          <span className="px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg)]">Lado Organics · Pilani, Rajasthan</span>
          <a href="/contact" className="px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--terracotta)] hover:underline">Ask the farm team →</a>
        </div>
      </div>
    </section>
  );
}
