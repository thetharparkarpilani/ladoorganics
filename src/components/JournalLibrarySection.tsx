"use client";

import React, { useMemo, useState } from "react";
import type { LocaleCode } from "@/types/domain";
import { TRANSLATIONS } from "@/lib/i18n";

interface JournalArticle {
  id: string;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  body: string[];
}

const ARTICLES: JournalArticle[] = [
  {
    id: "bilona-ghee",
    category: "Bilona Ghee",
    readTime: "4 Min Read",
    title: "Curd-Churned Tharparkar Bilona Ghee in Pilani",
    excerpt:
      "How culturing milk into curd and churning by the traditional Bilona method differs from direct cream separation.",
    body: [
      "At Lado Organics in Pilani, Rajasthan, indigenous Tharparkar milk is cultured into curd and churned using the traditional Bilona method rather than separating raw cream industrially.",
      "Every jar can be traced to its batch ledger at /trace/LO-PILANI-SAMPLE-001, with lab report links shown only when verified and published by an administrator."
    ]
  },
  {
    id: "cow-as-coconut",
    category: "Zero-Waste Cycle",
    readTime: "5 Min Read",
    title: "The 'Cow as a Coconut' Ecosystem in Pilani",
    excerpt:
      "Connecting indigenous Tharparkar care, biogas slurry vermicompost (Pure Kechua Khad), and Tharparkar Dhoop with local farming families.",
    body: [
      "Inspired by the 'Cow as a Coconut' zero-waste philosophy, our Pilani ecosystem focuses on responsible resource circulation supporting 100+ local farming families.",
      "Fresh dung supports biogas and vermicomposting (Pure Kechua Khad), while dried dung and natural botanicals are used for Tharparkar Dhoop."
    ]
  },
  {
    id: "bits-pilani-roots",
    category: "Founder Note",
    readTime: "4 Min Read",
    title: "From BITS Pilani Mathematics to Pilani Farm Operations",
    excerpt:
      "Founder Akash Saini (Integrated M.Sc. in Mathematics, BITS Pilani) on applying structured systems and batch transparency to rural enterprise.",
    body: [
      "Founded by BITS Pilani alumnus Akash Saini in Pilani, Lado Organics pairs traditional rural practices with clear batch records, server-checked bookings, and transparent communications.",
      "We avoid unverified health claims or fabricated certifications, keeping records grounded in actual farm and order data."
    ]
  }
];

const LIBRARY_RESOURCES = [
  {
    title: "Tharparkar & Bilona Overview Notes",
    topic: "Indigenous Breeds & Traditional Churning",
    note: "Reference summary from Pilani farm documentation."
  },
  {
    title: "Biogas Slurry & Kechua Khad Guide",
    topic: "Compost & Soil Care Assumptions",
    note: "General garden & soil planning reference; not a guaranteed crop yield promise."
  },
  {
    title: "Deep Work Bhunga Stay & Seva Guide",
    topic: "Pilani Visits & Calf Sponsorship",
    note: "Covers Dholi Sheri, Tara, and Roshni sponsorship enquiries and Bhunga stay rates."
  }
];

interface JournalLibrarySectionProps {
  locale: LocaleCode;
}

export default function JournalLibrarySection({ locale }: JournalLibrarySectionProps) {
  const dict = TRANSLATIONS[locale] ?? TRANSLATIONS.en;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  const categories = ["All", "Bilona Ghee", "Zero-Waste Cycle", "Founder Note"];

  const visibleArticles = useMemo(() => {
    if (selectedCategory === "All") return ARTICLES;
    return ARTICLES.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  const activeArticle = ARTICLES.find((a) => a.id === activeArticleId) ?? null;

  return (
    <section id="journal" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            Pilani, Rajasthan • Grounded Documentation
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mt-2">{dict.section_journal}</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition ${
                selectedCategory === cat
                  ? "bg-[var(--mud)] text-white border-[var(--mud)]"
                  : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--terracotta)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {visibleArticles.map((art) => (
            <article
              key={art.id}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[var(--terracotta)] mb-2">
                  <span>{art.category}</span>
                  <span className="opacity-70">{art.readTime}</span>
                </div>
                <h3 className="text-xl font-serif font-bold mb-2.5">{art.title}</h3>
                <p className="text-xs sm:text-sm opacity-80 leading-relaxed mb-5">{art.excerpt}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticleId(art.id)}
                className="text-left text-xs font-bold text-[var(--terracotta)] hover:underline cursor-pointer"
              >
                Read Article →
              </button>
            </article>
          ))}
        </div>

        {activeArticle && (
          <div className="bg-[var(--surface)] border border-[var(--terracotta)] rounded-3xl p-6 sm:p-8 mb-14 shadow-lg">
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
                {activeArticle.category} • {activeArticle.readTime}
              </span>
              <button
                type="button"
                onClick={() => setActiveArticleId(null)}
                className="text-xs font-bold px-3 py-1 rounded-full border border-[var(--border)] cursor-pointer"
              >
                Close Reader
              </button>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-4">{activeArticle.title}</h3>
            <div className="space-y-3 text-sm leading-relaxed opacity-90">
              {activeArticle.body.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8">
          <h3 className="text-2xl font-serif font-bold mb-2">Lado Knowledge Library</h3>
          <p className="text-xs sm:text-sm opacity-80 mb-6">
            Curated farm and household guides based on documented Pilani practices.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {LIBRARY_RESOURCES.map((res) => (
              <div key={res.title} className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
                <p className="font-bold text-[var(--terracotta)] mb-1">{res.topic}</p>
                <h4 className="font-serif font-bold text-base mb-1.5">{res.title}</h4>
                <p className="opacity-75 leading-relaxed">{res.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
