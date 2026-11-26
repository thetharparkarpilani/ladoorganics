import React from "react";
import Link from "next/link";

const LIBRARY_RESOURCES = [
  {
    id: "bilona-process",
    category: "Traditional Dairy",
    title: "The Vedic Bilona Process",
    description: "A comprehensive guide to culturing A2 milk into curd and hand-churning it in wooden Bilonas to preserve nutritional integrity.",
    format: "PDF Guide",
    fileSize: "2.4 MB"
  },
  {
    id: "tharparkar-heritage",
    category: "Indigenous Breed",
    title: "Tharparkar Cow Heritage",
    description: "Documentation of the drought-resistant, highly resilient Tharparkar breed native to the Thar desert and their role in rural ecosystems.",
    format: "Research Summary",
    fileSize: "1.8 MB"
  },
  {
    id: "biogas-vermicompost",
    category: "Circular Economy",
    title: "Biogas to Vermicompost Manual",
    description: "Step-by-step methodology for converting anaerobic biogas slurry into nutrient-rich Kechua Khad for organic farming.",
    format: "Workshop PDF",
    fileSize: "3.1 MB"
  },
  {
    id: "mud-architecture",
    category: "Sustainable Living",
    title: "Bhunga Mud Architecture",
    description: "Architectural blueprints and thermal benefits of traditional Rajasthani mud houses utilized in our Deep Work farm stays.",
    format: "Design Whitepaper",
    fileSize: "4.5 MB"
  }
];

export default function KnowledgeLibraryPage() {
  return (
    <div className="lado-library-page min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link href="/" className="text-sm font-bold text-[var(--terracotta)] hover:underline">
          ← Back to Lado Organics Home
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)]">
          Module M • Education
        </span>
      </div>

      <div className="lado-library-hero bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 shadow-sm mb-12">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-4">Lado Knowledge Library</h1>
        <p className="text-sm sm:text-base opacity-85 max-w-3xl leading-relaxed">
          Access verified educational resources, research summaries, and workshop materials detailing our zero-waste circular farm ecosystem in Pilani, Rajasthan.
        </p>
      </div>

      <div className="lado-library-grid grid md:grid-cols-2 gap-6">
        {LIBRARY_RESOURCES.map((resource) => (
          <article 
            key={resource.id} 
            className="lado-library-card p-6 sm:p-8 bg-[var(--surface)] border border-[var(--border)] rounded-3xl hover:border-[var(--terracotta)] transition flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)] mb-2 block">
                {resource.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold mb-3">{resource.title}</h2>
              <p className="text-sm opacity-80 mb-6 leading-relaxed">{resource.description}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <span className="text-xs font-mono opacity-60 uppercase">{resource.format} • {resource.fileSize}</span>
              <button 
                type="button" 
                className="text-xs font-bold text-[var(--muted)] cursor-default" disabled
              >
                Resource information
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
