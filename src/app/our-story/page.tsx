import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story | Lado Organics",
  description: "Discover Lado Organics, a farm-rooted brand from Pilani, Rajasthan, bringing traditional products and transparent product information together.",
  alternates: { canonical: "/our-story" },
  openGraph: {
    title: "Our Story | Lado Organics",
    description: "A living farm story from Pilani, Rajasthan. Lado Love Pure.",
    type: "website",
    url: "https://ladoorganics.in/our-story",
  },
};

const principles = [
  {
    number: "01",
    title: "Rooted in Pilani",
    description: "Lado Organics is based in Pilani, Rajasthan. The place and its traditions are part of the way we introduce our brand and the products in our collection.",
  },
  {
    number: "02",
    title: "Traditional product stories",
    description: "Our collection brings together categories such as Tharparkar cow milk, Bilona ghee, dhoop, vermicompost and kesar. Each product has its own purpose, details and availability.",
  },
  {
    number: "03",
    title: "Clarity over claims",
    description: "We aim to show product information that can be checked. Batch traceability is displayed only when an approved production record exists; pending details are not presented as completed facts.",
  },
];

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <section className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--terracotta)]">Lado Organics · Pilani, Rajasthan</p>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl font-bold leading-tight text-[var(--mud)] sm:text-6xl">
            A living farm story, shared with care.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Lado Organics brings a thoughtful collection of farm and traditional products together under one name. Our guiding idea is simple: stay connected to our roots, explain products clearly, and let verified information speak for itself.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/store" className="primary-btn inline-flex rounded-full px-6 py-3 text-sm font-bold">Explore the collection</Link>
            <Link href="/trace" className="inline-flex rounded-full border border-[var(--border)] px-6 py-3 text-sm font-bold text-[var(--mud)] hover:border-[var(--terracotta)]">Explore batch traceability</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--terracotta)]">The Lado approach</p>
            <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-[var(--mud)] sm:text-4xl">Tradition deserves thoughtful details.</h2>
          </div>
          <div className="space-y-5 text-sm leading-8 text-[var(--muted)] sm:text-base">
            <p>
              A product is more than its name on a shelf. People should be able to understand what it is, how it is presented, how to use or store it, and which details are supported by the product record.
            </p>
            <p>
              That is why the Lado Organics experience connects the store catalogue with product pages and a batch lookup. When an approved batch record is available, the trace page can show the information recorded for that batch. Dispatch and delivery remain tied to the actual order and shipment.
            </p>
            <p>
              We do not use this story page to imply certifications, laboratory results, health benefits or production claims that have not been verified and published for the relevant product or batch.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--terracotta)]">What guides us</p>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {principles.map((principle) => (
              <article key={principle.number} className="rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-6 sm:p-7">
                <span className="font-mono text-xs font-bold tracking-widest text-[var(--terracotta)]">{principle.number}</span>
                <h2 className="mt-5 font-serif text-2xl font-bold text-[var(--mud)]">{principle.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="rounded-3xl bg-[#244b35] px-6 py-10 text-[#fbf7ef] sm:px-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e0c58f]">Lado Love Pure</p>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl font-bold sm:text-4xl">Explore the products. Check the details. Stay connected.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#fbf7ef]/80">
            Browse the live catalogue for current listings, use the batch lookup when you have a product code, or contact the team when you need help confirming product or delivery information.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/store" className="inline-flex rounded-full bg-[#fbf7ef] px-6 py-3 text-sm font-bold text-[#244b35]">Visit the store</Link>
            <Link href="/contact" className="inline-flex rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white">Contact Lado Organics</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
