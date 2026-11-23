"use client";

import React from "react";
import Link from "next/link";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919636100337";

const topics = [
  { title: "Order or payment help", message: "Hello Lado Organics, I need help with an order or payment. My order number is: " },
  { title: "Bhunga stay enquiry", message: "Hello Lado Organics, I need help with a Bhunga stay enquiry. My requested dates are: " },
  { title: "Gau Seva sponsorship", message: "Hello Lado Organics, I need help with my Gau Seva sponsorship enquiry. Details: " },
  { title: "Product question", message: "Hello Lado Organics, I have a question about a product: " }
];

const faqs = [
  { question: "How do I check my order?", answer: "Sign in using the same Google account used for your order, then open My Journey → Order History. If you need help, message us with your order number." },
  { question: "When is my order confirmed?", answer: "Submitting an order sends a request to our team. It is not confirmed until the team reviews it and contacts you. For manual UPI, payment is treated as received only after it is verified in the bank account." },
  { question: "Is my Bhunga stay booked after I submit the form?", answer: "No. A stay request remains pending while the team checks availability. Your dates are confirmed only after the team contacts you and confirms the booking." },
  { question: "How do I follow my Gau Seva sponsorship request?", answer: "Sign in and open My Journey → Gau Seva to see the request recorded against your account. The team will contact you to confirm the details. A request is not a payment receipt." },
  { question: "Where can I read delivery, cancellation and other policies?", answer: "Please review the Policies & Legal page for the current terms. If anything is unclear, contact the team before placing an order or request." }
];

export default function ContactPage() {
  const makeWhatsAppLink = (message: string) =>
    `https://wa.me/${WHATSAPP_NUMBER.replace(/\\D/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--border)] px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link href="/" className="font-serif text-xl font-bold">Lado Organics</Link>
          <Link href="/" className="text-sm font-semibold underline">Back to home</Link>
        </div>
      </header>

      <section className="px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--terracotta)]">We're here to help</p>
            <h1 className="mt-3 font-serif text-4xl font-bold sm:text-6xl">Customer Support</h1>
            <p className="mt-5 text-base leading-7 opacity-75">Questions about an order, a Bhunga stay or Gau Seva? Choose a topic below to open WhatsApp with a message ready for our team.</p>
            <a href={makeWhatsAppLink("Hello Lado Organics, I need help.")}
              target="_blank" rel="noopener noreferrer"
              className="mt-7 inline-flex rounded-full bg-[var(--terracotta)] px-6 py-3 font-bold text-white">
              Chat with Lado Organics on WhatsApp
            </a>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {topics.map((topic) => (
              <article key={topic.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h2 className="font-serif text-xl font-bold">{topic.title}</h2>
                <a href={makeWhatsAppLink(topic.message)} target="_blank" rel="noopener noreferrer"
                  className="mt-5 inline-block text-sm font-bold underline underline-offset-4">Start WhatsApp message</a>
              </article>
            ))}
          </div>

          <section className="mt-16 max-w-4xl">
            <h2 className="font-serif text-3xl font-bold">Frequently asked questions</h2>
            <div className="mt-6 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5">
              {faqs.map((faq) => (
                <details key={faq.question} className="py-5">
                  <summary className="cursor-pointer font-bold">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-6 opacity-75">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="mt-12 flex flex-wrap gap-4 text-sm">
            <Link href="/dashboard" className="font-bold underline">My Lado Journey</Link>
            <Link href="/policies" className="font-bold underline">Policies & Legal</Link>
            <Link href="/" className="font-bold underline">Continue shopping</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
