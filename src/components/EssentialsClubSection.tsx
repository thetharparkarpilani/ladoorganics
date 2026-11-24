"use client";

import React, { useState } from "react";
import { useLocale } from "@/context/LocaleContext";

export default function EssentialsClubSection() {
  const { locale } = useLocale();
  const copy = locale === "hi" ? {
    method: "हमारी तैयारी की विधि", title: "बिलोना विधि को सरल भाषा में समझें",
    intro: "Lado Organics पारंपरिक लकड़ी की बिलोना से दही मथने की प्रक्रिया बताता है। यह विधि का विवरण है, चिकित्सकीय या पोषण श्रेष्ठता का दावा नहीं।",
    stage: "चरण", curd: "दही से बिलोना विधि", cream: "सीधी मलाई की विधि",
    start: "शुरुआती सामग्री", milk: "दूध से दही जमाया जाता है", creamSep: "दूध से मलाई अलग की जाती है",
    fat: "वसा अलग करना", butter: "दही मथकर मक्खन अलग किया जाता है", butterfat: "मलाई से मक्खन की वसा प्राप्त की जाती है",
    equipment: "उपकरण / विधि", wooden: "पारंपरिक लकड़ी की बिलोना", equipmentCream: "मलाई अलग करने के उपकरण और आगे की प्रक्रिया",
    disclaimer: "यह तालिका केवल प्रक्रिया की तुलना करती है; सभी उत्पादकों या तैयार घी की पोषण गुणवत्ता पर सामान्य दावा नहीं करती।",
    repeat: "बार-बार डिलीवरी की रुचि", club: "Lado Essentials Club",
    clubIntro: "बताएँ कि आप नियमित रूप से क्या लेना चाहेंगे। यह केवल पसंद दर्ज करता है; कोई भुगतान वाली सदस्यता या अपने-आप शुल्क नहीं बनता। टीम उपलब्धता और शर्तें बताएगी।",
    product: "उत्पाद और पैक", frequency: "पसंदीदा अंतराल", quantity: "मात्रा", email: "ईमेल पता", phone: "फ़ोन / WhatsApp (वैकल्पिक)",
    every: "हर", days: "दिन", saving: "अनुरोध सहेजा जा रहा है…", submit: "नियमित डिलीवरी में रुचि दर्ज करें",
    success: "आपकी रुचि दर्ज हो गई है। टीम उपलब्धता, कीमत और डिलीवरी की पुष्टि करेगी। कोई भुगतान या अपने-आप नवीनीकरण शुरू नहीं हुआ है।",
    error: "कृपया थोड़ी देर बाद फिर कोशिश करें。",
  } : locale === "ma" ? {
    method: "म्हारी बनावण री रीति", title: "बिलोना री रीति सरल बात में",
    intro: "Lado Organics पुराणी लकड़ी री बिलोना सूं दही मथण री बात बतावै है। ई बनावण रो ब्यौरो है, सेहत या पोषण में वधारे होण रो दावा कोनी।",
    stage: "पड़ाव", curd: "दही सूं बिलोना री रीति", cream: "सीधी मलाई री रीति",
    start: "पैली सामग्री", milk: "दूध नै दही जमावै", creamSep: "दूध सूं मलाई अलग करै",
    fat: "मक्खण अलग करणी", butter: "दही मथकै मक्खण अलग करै", butterfat: "मलाई सूं मक्खण री वसा लेवै",
    equipment: "औजार / रीति", wooden: "पुराणी लकड़ी री बिलोना", equipmentCream: "मलाई अलग करणी रा औजार अर आगळ री प्रक्रिया",
    disclaimer: "ई तालिका बस बनावण री रीति तुलना करै है; सगळा उत्पादक या घी री पोषण गुणवत्ता पर एकसारो दावा कोनी।",
    repeat: "बार-बार भेजण री रुचि", club: "Lado Essentials Club",
    clubIntro: "बतावो थां नियमित काई लेणो चाहो हो। ई बस थारी पसंद लिखै है; भुगतान वाली सदस्यता या अपने-आप रकम कोनी कटै। टीम उपलब्धता अर चालू शर्त बतावैला।",
    product: "सामान अर पैक", frequency: "कितरे दिन में", quantity: "मात्रा", email: "ईमेल", phone: "फोन / WhatsApp (जरूरी कोनी)",
    every: "हर", days: "दिन", saving: "अरज सहेजी जावै है…", submit: "नियमित भेजण री रुचि लिखावो",
    success: "थारी रुचि लिख ली है। टीम उपलब्धता, आखरी भाव अर भेजण री बात पक्की करैला। कोई भुगतान या अपने-आप नवीनीकरण चालू कोनी कर्यो।",
    error: "थोड़ी देर पाछै फेर कोशिश करो।",
  } : {
    method: "Our preparation method", title: "Bilona method, explained simply",
    intro: "Lado Organics describes a curd-based process using traditional wooden Bilona churning. This describes preparation, not medical or nutritional superiority.",
    stage: "Stage", curd: "Curd-based Bilona route", cream: "Direct cream route",
    start: "Starting material", milk: "Milk is cultured into curd", creamSep: "Cream is separated from milk",
    fat: "Fat separation", butter: "Curd is churned to separate butter", butterfat: "Cream is processed to obtain butterfat",
    equipment: "Equipment / method", wooden: "Traditional wooden Bilona churning", equipmentCream: "Cream-separation equipment and subsequent processing",
    disclaimer: "The table compares process routes only. It does not make a blanket claim about producers or the nutritional quality of finished ghee.",
    repeat: "Repeat delivery enquiry", club: "Lado Essentials Club",
    clubIntro: "Tell us what you may want regularly. This records interest only; it does not create a paid subscription or automatic charge. Our team will confirm availability and terms.",
    product: "Product & pack", frequency: "Preferred frequency", quantity: "Quantity", email: "Email address", phone: "Phone / WhatsApp (optional)",
    every: "Every", days: "days", saving: "Saving request...", submit: "Register repeat-delivery interest",
    success: "Your repeat-delivery interest has been recorded. The team must confirm availability, final pricing and delivery details. No payment or automatic renewal has been set up.",
    error: "Please try again later.",
  };
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscriberPhone, setSubscriberPhone] = useState("");
  const [itemLabel, setItemLabel] = useState("A2 Bilona Ghee — 1 litre");
  const [intervalDays, setIntervalDays] = useState(30);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handlePreference = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    try {
      const interest = `Repeat-delivery enquiry | Product: ${itemLabel} | Frequency: ${intervalDays} days | Quantity: ${quantity} | WhatsApp: ${subscriberPhone.trim() || "Not provided"}`;
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscriberEmail, interest })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || copy.error);
      setFeedback({ type: "ok", text: copy.success });
      setSubscriberEmail("");
      setSubscriberPhone("");
    } catch (error) {
      setFeedback({ type: "err", text: error instanceof Error ? error.message : copy.error });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="essentials-club" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">{copy.method}</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1 mb-4">{copy.title}</h2>
          <p className="text-sm opacity-80 leading-relaxed mb-5">{copy.intro}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead><tr className="border-b border-[var(--border)]"><th className="py-3 pr-3 font-bold">{copy.stage}</th><th className="py-3 px-3 font-bold text-[var(--terracotta)]">{copy.curd}</th><th className="py-3 pl-3 font-bold">{copy.cream}</th></tr></thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr><td className="py-3 pr-3 font-bold align-top">{copy.start}</td><td className="py-3 px-3 align-top">{copy.milk}</td><td className="py-3 pl-3 align-top">{copy.creamSep}</td></tr>
                <tr><td className="py-3 pr-3 font-bold align-top">{copy.fat}</td><td className="py-3 px-3 align-top">{copy.butter}</td><td className="py-3 pl-3 align-top">{copy.butterfat}</td></tr>
                <tr><td className="py-3 pr-3 font-bold align-top">{copy.equipment}</td><td className="py-3 px-3 align-top">{copy.wooden}</td><td className="py-3 pl-3 align-top">{copy.equipmentCream}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs opacity-65 mt-4">{copy.disclaimer}</p>
        </div>

        <div className="lg:col-span-5 bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">{copy.repeat}</span>
          <h3 className="text-2xl font-serif font-bold mt-1 mb-2">{copy.club}</h3>
          <p className="text-xs opacity-80 mb-5 leading-relaxed">{copy.clubIntro}</p>
          <form onSubmit={handlePreference} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold uppercase mb-1" htmlFor="essentials-product">{copy.product}</label>
              <select id="essentials-product" value={itemLabel} onChange={(e) => setItemLabel(e.target.value)} className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                <option>A2 Bilona Ghee — 250 ml</option>
                <option>A2 Bilona Ghee — 500 ml</option>
                <option>A2 Bilona Ghee — 1 litre</option>
                <option>Tharparkar Dhoop — Box</option>
                <option>Pure Kechua Khad — 5 kg Bag</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase mb-1" htmlFor="essentials-frequency">{copy.frequency}</label>
                <select id="essentials-frequency" value={intervalDays} onChange={(e) => setIntervalDays(Number(e.target.value))} className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                  <option value={30}>{copy.every} 30 {copy.days}</option><option value={45}>{copy.every} 45 {copy.days}</option><option value={60}>{copy.every} 60 {copy.days}</option><option value={90}>{copy.every} 90 {copy.days}</option>
                </select>
              </div>
              <div>
                <label className="block font-bold uppercase mb-1" htmlFor="essentials-quantity">{copy.quantity}</label>
                <input id="essentials-quantity" type="number" min={1} max={20} required value={quantity} onChange={(e) => setQuantity(Math.min(20, Math.max(1, Number(e.target.value) || 1)))} className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
              </div>
            </div>
            <div>
              <label className="block font-bold uppercase mb-1" htmlFor="essentials-email">{copy.email}</label>
              <input id="essentials-email" type="email" required value={subscriberEmail} onChange={(e) => setSubscriberEmail(e.target.value)} placeholder="you@example.com" className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
            </div>
            <div>
              <label className="block font-bold uppercase mb-1" htmlFor="essentials-phone">{copy.phone}</label>
              <input id="essentials-phone" type="tel" value={subscriberPhone} onChange={(e) => setSubscriberPhone(e.target.value)} placeholder="+91..." className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
            </div>
            {feedback && <p role="status" className={`p-3 rounded-xl font-medium ${feedback.type === "ok" ? "bg-green-50 text-green-900 border border-green-200" : "bg-red-50 text-red-900 border border-red-200"}`}>{feedback.text}</p>}
            <button type="submit" disabled={submitting} className="w-full primary-btn py-3 rounded-xl font-bold cursor-pointer disabled:opacity-50">{submitting ? copy.saving : copy.submit}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
