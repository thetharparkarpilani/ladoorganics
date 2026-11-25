"use client";

import { useState } from "react";

type FarmNodeId = "gaushala" | "biogas" | "compost" | "bilona" | "bhunga";

interface FarmNode {
  id: FarmNodeId;
  title: string;
  icon: string;
  description: string;
  farmNote: string;
  coordinates: { x: number; y: number };
}

const FARM_NODES: FarmNode[] = [
  {
    id: "gaushala",
    title: "Tharparkar Cattle Care",
    icon: "fas fa-cow",
    description: "The Lado farm story centers on indigenous Tharparkar cattle and the care routines described by the team. Individual animal profiles are not published until verified.",
    farmNote: "No animal-specific or milk-composition claim is made here without an approved record.",
    coordinates: { x: 50, y: 15 }
  },
  {
    id: "biogas",
    title: "Farm By-products & Biogas",
    icon: "fas fa-fire-flame-curved",
    description: "The Lado farm story describes interest in circular use of farm by-products. Ask the team for current operating details.",
    farmNote: "No energy-output or fuel-replacement figures are published in this overview.",
    coordinates: { x: 80, y: 50 }
  },
  {
    id: "compost",
    title: "Vermicompost",
    icon: "fas fa-seedling",
    description: "Vermicompost is part of the Lado Organics product range. Follow the current product label for application instructions.",
    farmNote: "Application rates, composition and certification are not assumed in this map.",
    coordinates: { x: 50, y: 85 }
  },
  {
    id: "bhunga",
    title: "Bhunga Stay Enquiry",
    icon: "fas fa-house-chimney",
    description: "The site accepts enquiries about farm stays. Dates, availability, architecture details and price are confirmed by the Lado team.",
    farmNote: "This is an enquiry overview, not a confirmed booking or construction certification.",
    coordinates: { x: 20, y: 50 }
  },
  {
    id: "bilona",
    title: "Bilona Ghee Process",
    icon: "fas fa-jar",
    description: "Lado describes a Bilona process for ghee. Batch-specific details are published only when recorded and approved.",
    farmNote: "No yield, milk-type, temperature or timing claim is made here without a verified batch record.",
    coordinates: { x: 50, y: 50 }
  }
];

export default function InteractiveFarmMap() {
  const [activeNode, setActiveNode] = useState<FarmNodeId>("gaushala");
  const activeData = FARM_NODES.find((node) => node.id === activeNode);

  return (
    <section id="my-lado-farm" className="overflow-hidden border-t border-[var(--border)] bg-[#204E36] px-4 py-20 text-[#FDF9F5] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#e7d6a8]">FARM ECOSYSTEM · PILANI, RAJASTHAN</span>
          <h2 className="mb-4 font-serif text-3xl font-bold sm:text-5xl">The Lado Farm Ecosystem</h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed opacity-85">
            Explore the farm relationships described by Lado Organics. Select a node for a general overview; operational and batch-level details are published only when verified records are available.
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="relative mx-auto aspect-square w-full max-w-md rounded-full border-4 border-[#e7d6a8]/20 bg-[#315B40] p-8 shadow-2xl lg:col-span-7">
            <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-25" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="35" fill="none" stroke="#e7d6a8" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="50" y1="15" x2="80" y2="50" stroke="#e7d6a8" strokeWidth="0.5" />
              <line x1="80" y1="50" x2="50" y2="85" stroke="#e7d6a8" strokeWidth="0.5" />
              <line x1="50" y1="85" x2="20" y2="50" stroke="#e7d6a8" strokeWidth="0.5" />
              <line x1="20" y1="50" x2="50" y2="15" stroke="#e7d6a8" strokeWidth="0.5" />
              <line x1="50" y1="15" x2="50" y2="50" stroke="#e7d6a8" strokeWidth="0.5" />
            </svg>
            {FARM_NODES.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => setActiveNode(node.id)}
                className={`absolute z-10 -ml-7 -mt-7 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${activeNode === node.id ? "scale-125 bg-[#e7d6a8] text-[#204E36] shadow-[0_0_20px_rgba(231,214,168,.4)]" : "bg-[#244b34] text-[#FDF9F5] hover:bg-[#3D6B4B]"}`}
                style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
                aria-label={`View ${node.title}`}
                aria-pressed={activeNode === node.id}
              >
                <i className={`text-xl ${node.icon}`} aria-hidden="true"></i>
              </button>
            ))}
          </div>

          <div className="flex min-h-[300px] flex-col justify-center rounded-3xl border border-[#e7d6a8]/20 bg-[#315B40]/90 p-8 backdrop-blur-md lg:col-span-5">
            {activeData && (
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e7d6a8]/10">
                  <i className={`${activeData.icon} text-2xl text-[#e7d6a8]`} aria-hidden="true"></i>
                </div>
                <h3 className="mb-3 font-serif text-2xl font-bold text-[#e7d6a8]">{activeData.title}</h3>
                <p className="mb-6 text-sm leading-relaxed opacity-90">{activeData.description}</p>
                <div className="rounded-xl border border-white/10 bg-black/15 px-4 py-3">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-white/60">Farm note</span>
                  <span className="text-xs font-medium text-white/90">{activeData.farmNote}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
