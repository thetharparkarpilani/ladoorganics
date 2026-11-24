"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919636100337";

export default function ContactPage() {
  const { locale } = useLocale();
  const copy = locale === "hi" ? {
    back: "होम पेज पर लौटें", kicker: "हम आपकी मदद के लिए हैं", title: "ग्राहक सहायता",
    intro: "ऑर्डर, भुंगा स्टे या गौ सेवा के बारे में सवाल हैं? नीचे विषय चुनें और हमारी टीम के लिए तैयार WhatsApp संदेश खोलें।",
    chat: "Lado Organics से WhatsApp पर बात करें", start: "WhatsApp संदेश शुरू करें",
    faq: "अक्सर पूछे जाने वाले सवाल", links: ["मेरा Lado खाता", "निजी सहायता अनुरोध भेजें", "नीतियाँ और कानूनी जानकारी", "खरीदारी जारी रखें"],
    topics: [
      ["ऑर्डर या भुगतान में मदद", "नमस्ते Lado Organics, मुझे ऑर्डर या भुगतान में मदद चाहिए। मेरा ऑर्डर नंबर: "],
      ["भुंगा स्टे की पूछताछ", "नमस्ते Lado Organics, मुझे भुंगा स्टे के बारे में पूछना है। मेरी तारीखें: "],
      ["गौ सेवा सहयोग", "नमस्ते Lado Organics, मुझे गौ सेवा सहयोग के बारे में मदद चाहिए। विवरण: "],
      ["उत्पाद के बारे में सवाल", "नमस्ते Lado Organics, मुझे एक उत्पाद के बारे में सवाल पूछना है: "],
    ],
    faqs: [
      ["मेरा ऑर्डर कैसे देखें?", "उसी Google खाते से साइन इन करें जिससे ऑर्डर किया था। फिर My Journey → Order History खोलें। मदद चाहिए तो ऑर्डर नंबर के साथ हमें संदेश भेजें।"],
      ["मेरा ऑर्डर कब पक्का होता है?", "ऑर्डर भेजने पर टीम को अनुरोध मिलता है। टीम जाँच कर संपर्क करे, तभी ऑर्डर पक्का होता है। मैन्युअल UPI भुगतान बैंक खाते में जाँच के बाद ही प्राप्त माना जाता है।"],
      ["फ़ॉर्म भेजने के बाद क्या भुंगा स्टे पक्का हो जाता है?", "नहीं। उपलब्धता जाँचने तक अनुरोध लंबित रहता है। टीम संपर्क करके पुष्टि करे, तभी तारीख पक्की होती है।"],
      ["गौ सेवा सहयोग का हाल कैसे देखें?", "साइन इन करके My Journey → Gau Seva खोलें। टीम विवरण की पुष्टि के लिए संपर्क करेगी। अनुरोध भुगतान की रसीद नहीं है।"],
      ["डिलीवरी और रद्द करने की नीतियाँ कहाँ पढ़ें?", "मौजूदा शर्तों के लिए Policies & Legal पेज देखें। कुछ अस्पष्ट हो तो ऑर्डर या अनुरोध भेजने से पहले टीम से पूछें।"],
    ],
  } : locale === "ma" ? {
    back: "घर रै पन्ने पर लौटो", kicker: "म्हूं थारी मदद खातर हां", title: "ग्राहक मदद",
    intro: "ऑर्डर, भुंगा ठहराव या गौ सेवा री बात पूछणी है? नीचे विषय चुनो अर टीम खातर WhatsApp संदेश खोलो।",
    chat: "Lado Organics सूं WhatsApp पर बात करो", start: "WhatsApp संदेश चालू करो",
    faq: "आम पूछताछ", links: ["म्हारो Lado खातो", "निजी मदद री अरज भेजो", "नियम अर कानूनी जानकारी", "खरीदारी जारी राखो"],
    topics: [
      ["ऑर्डर या भुगतान री मदद", "खम्मा घणी Lado Organics, म्हाने ऑर्डर या भुगतान में मदद चाहिजै। म्हारो ऑर्डर नंबर: "],
      ["भुंगा ठहराव री पूछताछ", "खम्मा घणी Lado Organics, म्हाने भुंगा ठहराव री जानकारी चाहिजै। म्हारी तारीख: "],
      ["गौ सेवा में सहयोग", "खम्मा घणी Lado Organics, म्हाने गौ सेवा सहयोग री जानकारी चाहिजै। बात: "],
      ["सामान री पूछताछ", "खम्मा घणी Lado Organics, म्हाने एक सामान रै बारे में पूछणो है: "],
    ],
    faqs: [
      ["म्हारो ऑर्डर कियां देखूं?", "जिण Google खाते सूं ऑर्डर कर्यो थो, उणै सूं साइन-इन करो। फेर My Journey → Order History खोलो। मदद खातर ऑर्डर नंबर संग संदेश भेजो।"],
      ["म्हारो ऑर्डर कद पक्को होवै?", "ऑर्डर भेजण पर टीम नै अरज मिलै है। टीम जांच कै खबर करै, तद ऑर्डर पक्को होवै। हाथ सूं UPI भुगतान बैंक में जांच होवै तद ही जमा मानै।"],
      ["फॉर्म भेज्या पाछै भुंगा ठहराव पक्को होवै?", "कोनी। टीम जगह खाली है कि कोनी जांचै तद तक अरज बाकी रहै। टीम तारीख पक्की करै तद ही बुकिंग पक्की।"],
      ["गौ सेवा री अरज कियां देखूं?", "साइन-इन करकै My Journey → Gau Seva खोलो। टीम बात पक्की करवा खातर संपर्क करैला। अरज भुगतान री रसीद कोनी।"],
      ["भेजण अर रद्द करणी रा नियम कठै पढ़ूं?", "चालू शर्तां खातर Policies & Legal पन्नो देखो। कोई बात साफ ना होवै तो ऑर्डर सूं पैली टीम सूं पूछो।"],
    ],
  } : {
    back: "Back to home", kicker: "WE'RE HERE TO HELP", title: "Customer Support",
    intro: "Questions about an order, a Bhunga stay or Gau Seva? Choose a topic below to open WhatsApp with a message ready for our team.",
    chat: "Chat with Lado Organics on WhatsApp", start: "Start WhatsApp message",
    faq: "Frequently asked questions", links: ["My Lado Journey", "Submit a private support request", "Policies & Legal", "Continue shopping"],
    topics: [
      ["Order or payment help", "Hello Lado Organics, I need help with an order or payment. My order number is: "],
      ["Bhunga stay enquiry", "Hello Lado Organics, I need help with a Bhunga stay enquiry. My requested dates are: "],
      ["Gau Seva sponsorship", "Hello Lado Organics, I need help with my Gau Seva sponsorship enquiry. Details: "],
      ["Product question", "Hello Lado Organics, I have a question about a product: "],
    ],
    faqs: [
      ["How do I check my order?", "Sign in using the same Google account used for your order, then open My Journey → Order History. If you need help, message us with your order number."],
      ["When is my order confirmed?", "Submitting an order sends a request to our team. It is not confirmed until the team reviews it and contacts you. For manual UPI, payment is treated as received only after it is verified in the bank account."],
      ["Is my Bhunga stay booked after I submit the form?", "No. A stay request remains pending while the team checks availability. Your dates are confirmed only after the team contacts you and confirms the booking."],
      ["How do I follow my Gau Seva sponsorship request?", "Sign in and open My Journey → Gau Seva to see the request recorded against your account. The team will contact you to confirm the details. A request is not a payment receipt."],
      ["Where can I read delivery, cancellation and other policies?", "Please review the Policies & Legal page for the current terms. If anything is unclear, contact the team before placing an order or request."],
    ],
  };

  const makeWhatsAppLink = (message: string) =>
    `https://wa.me/${WHATSAPP_NUMBER.replace(/\\D/g, "")}?text=${encodeURIComponent(message)}`;
  const greeting = locale === "hi" ? "नमस्ते Lado Organics, मुझे मदद चाहिए।"
    : locale === "ma" ? "खम्मा घणी Lado Organics, म्हाने मदद चाहिजै।"
    : "Hello Lado Organics, I need help.";

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--border)] px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link href="/" className="font-serif text-xl font-bold">Lado Organics</Link>
          <Link href="/" className="text-sm font-semibold underline">{copy.back}</Link>
        </div>
      </header>
      <section className="px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--terracotta)]">{copy.kicker}</p>
            <h1 className="mt-3 font-serif text-4xl font-bold sm:text-6xl">{copy.title}</h1>
            <p className="mt-5 text-base leading-7 opacity-75">{copy.intro}</p>
            <a href={makeWhatsAppLink(greeting)} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex rounded-full bg-[var(--terracotta)] px-6 py-3 font-bold text-white">{copy.chat}</a>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {copy.topics.map(([title, message]) => (
              <article key={title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h2 className="font-serif text-xl font-bold">{title}</h2>
                <a href={makeWhatsAppLink(message)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm font-bold underline underline-offset-4">{copy.start}</a>
              </article>
            ))}
          </div>
          <section className="mt-16 max-w-4xl">
            <h2 className="font-serif text-3xl font-bold">{copy.faq}</h2>
            <div className="mt-6 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5">
              {copy.faqs.map(([question, answer]) => (
                <details key={question} className="py-5">
                  <summary className="cursor-pointer font-bold">{question}</summary>
                  <p className="mt-3 text-sm leading-6 opacity-75">{answer}</p>
                </details>
              ))}
            </div>
          </section>
          <div className="mt-12 flex flex-wrap gap-4 text-sm">
            <Link href="/dashboard" className="font-bold underline">{copy.links[0]}</Link>
            <Link href="/login?next=/dashboard/support" className="font-bold underline">{copy.links[1]}</Link>
            <Link href="/policies" className="font-bold underline">{copy.links[2]}</Link>
            <Link href="/" className="font-bold underline">{copy.links[3]}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
