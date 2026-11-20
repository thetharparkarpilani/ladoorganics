"use client";

import React, { useState } from "react";

type FarmNodeId = "gaushala" | "biogas" | "compost" | "bilona" | "bhunga";

interface FarmNode {
  id: FarmNodeId;
  title: string;
  icon: string;
  description: string;
  verifiedFact: string;
  coordinates: { x: number; y: number }; // Percentage-based positioning for the map
}

const FARM_NODES: FarmNode[] = [
  {
    id: "gaushala",
    title: "Tharparkar Gaushala",
    icon: "fas fa-cow",
    description: "Home to indigenous desert-adapted cows like Dholi Sheri, Tara, and Roshni. They graze on medicinal flora and are milked only after the calves have had their fill.",
    verifiedFact: "100% A2 Beta-Casein milk source.",
    coordinates: { x: 50, y: 15 }
  },
  {
    id: "biogas",
    title: "Anaerobic Biogas Digester",
    icon: "fas fa-fire-flame-curved",
    description: "Fresh cow dung is collected and processed here to generate clean methane gas, which powers our farm's water heating and cooking needs.",
    verifiedFact: "Replaces fossil-fuel reliance for Bilona boiling.",
    coordinates: { x: 80, y: 50 }
  },
  {
    id: "compost",
    title: "Kechua Khad (Vermicompost)",
    icon: "fas fa-seedling",
    description: "The nutrient-dense slurry output from the biogas plant is fed to Eisenia fetida earthworms to create premium organic vermicompost.",
    verifiedFact: "Restores local soil microbiome without synthetic fertilizers.",
    coordinates: { x: 50, y: 85 }
  },
  {
    id: "bhunga",
    title: "Deep Work Bhunga Stays",
    icon: "fas fa-house-chimney",
    description: "Climate-responsive mud architecture built using traditional Rajasthani techniques, providing thermal insulation for agro-tourism guests.",
    verifiedFact: "Constructed using locally sourced mud and cow dung.",
    coordinates: { x: 20, y: 50 }
  },
  {
    id: "bilona",
    title: "Vedic Bilona Churning",
    icon: "fas fa-jar",
    description: "Whole A2 milk is cultured overnight into curd, then hand-churned bi-directionally using a wooden Bilona during Brahma Muhurta.",
    verifiedFact: "~28 to 30 litres of milk yields 1 litre of A2 Ghee.",
    coordinates: { x: 50, y: 50 }
  }
];

export default function InteractiveFarmMap() {
  const [activeNode, setActiveNode] = useState<FarmNodeId>("gaushala");

  const activeData = FARM_NODES.find((n) => n.id === activeNode);

  return (
    <section id="my-lado-farm" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)] bg-[#2b180c] text-[#fef3c7] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#fbbf24] block mb-2">
            Module J • My Lado Farm
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4">
            The "Cow as a Coconut" Ecosystem
          </h2>
          <p className="text-sm opacity-80 max-w-2xl mx-auto leading-relaxed">
            Explore our zero-waste Pilani blueprint. Click the interactive nodes below to see how every resource flows through our closed-loop regenerative farm.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Interactive Visual Map */}
          <div className="lg:col-span-7 relative aspect-square max-w-md mx-auto w-full bg-[#3b2314] rounded-full border-4 border-[#fbbf24]/20 shadow-2xl p-8">
            {/* Connecting SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="35" fill="none" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="50" y1="15" x2="80" y2="50" stroke="#fbbf24" strokeWidth="0.5" />
              <line x1="80" y1="50" x2="50" y2="85" stroke="#fbbf24" strokeWidth="0.5" />
              <line x1="50" y1="85" x2="20" y2="50" stroke="#fbbf24" strokeWidth="0.5" />
              <line x1="20" y1="50" x2="50" y2="15" stroke="#fbbf24" strokeWidth="0.5" />
              <line x1="50" y1="15" x2="50" y2="50" stroke="#fbbf24" strokeWidth="0.5" />
            </svg>

            {/* Farm Nodes */}
            {FARM_NODES.map((node) => (
              <button
                key={node.id}
                onClick={() => setActiveNode(node.id)}
                className={`absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center transition-all duration-300 z-10 cursor-pointer ${
                  activeNode === node.id 
                    ? "bg-[#fbbf24] text-[#2b180c] scale-125 shadow-[0_0_20px_rgba(251,191,36,0.4)]" 
                    : "bg-[#54331d] text-[#fef3c7] hover:bg-[#784a2b]"
                }`}
                style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
                aria-label={`View ${node.title}`}
              >
                <i className={`text-xl ${node.icon}`}></i>
              </button>
            ))}
          </div>

          {/* Active Node Detail Panel */}
          <div className="lg:col-span-5 bg-[#3b2314]/80 backdrop-blur-md border border-[#fbbf24]/20 rounded-3xl p-8 min-h-[300px] flex flex-col justify-center transition-opacity duration-300">
            {activeData && (
              <div className="animate-fade-in">
                <div className="w-12 h-12 bg-[#fbbf24]/10 rounded-xl flex items-center justify-center mb-6">
                  <i className={`${activeData.icon} text-2xl text-[#fbbf24]`}></i>
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#fbbf24] mb-3">
                  {activeData.title}
                </h3>
                <p className="text-sm opacity-90 leading-relaxed mb-6">
                  {activeData.description}
                </p>
                <div className="px-4 py-3 bg-black/20 rounded-xl border border-white/5">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
                    Verified Farm Detail
                  </span>
                  <span className="text-xs font-medium text-white/90">
                    {activeData.verifiedFact}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
