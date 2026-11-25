"use client";

import React, { useState } from "react";
import { useLocale } from "@/context/LocaleContext";

interface FarmExperienceSectionProps {
  whatsappNumber: string;
}

const PLAN_OPTIONS = [
  { value: "one_time", label: "One-time interest" },
  { value: "monthly", label: "Monthly interest" },
  { value: "yearly", label: "Yearly interest" }
] as const;

export default function FarmExperienceSection({ whatsappNumber }: FarmExperienceSectionProps) {
  const { locale } = useLocale();
  const copy = locale === "hi" ? {
    gau: "गौ सेवा · पिलानी", sponsor: "गौ सेवा में सहयोग की रुचि दर्ज करें",
    sponsorIntro: "यह सामान्य गौ सेवा सहयोग की रुचि है। किसी व्यक्तिगत पशु की प्रोफ़ाइल तभी दिखाई जाएगी जब टीम उसे सत्यापित करे।",
    plan: "योगदान की आवृत्ति", amount: "आपका प्रस्तावित योगदान (₹)", amountPlaceholder: "अपनी प्रस्तावित राशि लिखें",
    name: "आपका नाम", email: "ईमेल", phone: "फ़ोन / WhatsApp (वैकल्पिक)", fullName: "पूरा नाम",
    submit: "रुचि दर्ज करें", submitting: "दर्ज हो रहा है…", whatsapp: "WhatsApp पर पूछें ↗", stayWhatsapp: "तारीख WhatsApp पर पूछें ↗",
    stayLabel: "कृषि पर्यटन · पिलानी, राजस्थान", stay: "भुंगा स्टे की उपलब्धता पूछें",
    stayIntro: "अपनी तारीखें और मेहमानों की जानकारी भेजें। उपलब्धता और अंतिम कीमत टीम पुष्टि करेगी। अनुरोध भेजने से बुकिंग पक्की नहीं होती।",
    checkIn: "आगमन", checkOut: "प्रस्थान", guests: "मेहमान (1–4)",
    guestName: "मेहमान का नाम", checking: "अनुरोध भेजा जा रहा है…", request: "तारीखों की उपलब्धता पूछें",
    sponsorshipOk: "आपकी गौ सेवा रुचि दर्ज हो गई है। टीम आगे की जानकारी साझा करेगी। यह भुगतान रसीद नहीं है।",
    bookingOk: "आपका ठहराव अनुरोध दर्ज हो गया है। टीम तारीखों, उपलब्धता और अंतिम कीमत की पुष्टि करेगी।",
  } : locale === "ma" ? {
    gau: "गौ सेवा · पिलानी", sponsor: "गौ सेवा में सहयोग री रुचि लिखावो",
    sponsorIntro: "ई सामान्य गौ सेवा सहयोग री अरज है। किसी एक पशु री जानकारी टीम पक्की करै पाछै ही दिखाई जावैला।",
    plan: "योगदान रो समय", amount: "थारो प्रस्तावित योगदान (₹)", amountPlaceholder: "आपरी प्रस्तावित रकम लिखो",
    name: "थारो नाम", email: "ईमेल", phone: "फोन / WhatsApp (जरूरी कोनी)", fullName: "पूरो नाम",
    submit: "रुचि लिखावो", submitting: "लिखी जावै है…", whatsapp: "WhatsApp पर पूछो ↗", stayWhatsapp: "तारीख WhatsApp पर पूछो ↗",
    stayLabel: "खेत पर्यटन · पिलानी, राजस्थान", stay: "भुंगा ठहराव री उपलब्धता पूछो",
    stayIntro: "तारीख अर मेहमान री जानकारी भेजो। उपलब्धता अर आखरी भाव टीम पक्को करैला। अरज भेजण सूं बुकिंग पक्की कोनी होवै।",
    checkIn: "आवण री तारीख", checkOut: "जावण री तारीख", guests: "मेहमान (1–4)",
    guestName: "मेहमान रो नाम", checking: "अरज भेजी जावै है…", request: "तारीख री उपलब्धता पूछो",
    sponsorshipOk: "थारी गौ सेवा री रुचि लिख ली है। टीम आगळी जानकारी देला। ई भुगतान री रसीद कोनी।",
    bookingOk: "थारी ठहराव री अरज लिख ली है। टीम तारीख, जगह अर आखरी भाव पक्को करैला।",
  } : {
    gau: "GAU SEVA · PILANI", sponsor: "Register a Gau Seva contribution enquiry",
    sponsorIntro: "This is a general Gau Seva enquiry. Individual animal profiles will be shown only when the Lado team has verified and approved them.",
    plan: "Contribution frequency requested", amount: "Your proposed contribution (₹)", amountPlaceholder: "Enter an amount you propose",
    name: "Your name", email: "Email", phone: "Phone / WhatsApp (optional)", fullName: "Full name",
    submit: "Send contribution enquiry", submitting: "Sending enquiry…", whatsapp: "Ask on WhatsApp ↗", stayWhatsapp: "Ask about dates on WhatsApp ↗",
    stayLabel: "AGRO-TOURISM · PILANI, RAJASTHAN", stay: "Enquire about a Bhunga stay",
    stayIntro: "Share your dates and guest details. The team will confirm availability and final pricing. Sending a request does not confirm a reservation.",
    checkIn: "Check-in", checkOut: "Check-out", guests: "Guests (1–4)",
    guestName: "Guest name", checking: "Sending request…", request: "Enquire about these dates",
    sponsorshipOk: "Your Gau Seva enquiry has been recorded. The team will share the next steps. This is not a payment receipt.",
    bookingOk: "Your stay enquiry has been recorded. The team will confirm dates, availability and final pricing.",
  };

  const [planType, setPlanType] = useState<string>("one_time");
  const [amountInr, setAmountInr] = useState("");
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorEmail, setSponsorEmail] = useState("");
  const [sponsorPhone, setSponsorPhone] = useState("");
  const [sponLoading, setSponLoading] = useState(false);
  const [sponMessage, setSponMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [bookLoading, setBookLoading] = useState(false);
  const [bookMessage, setBookMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleSponsorshipSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSponMessage(null);
    setSponLoading(true);
    try {
      const response = await fetch("/api/sponsorships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calfName: "General Gau Seva",
          planType,
          amountInr: Number(amountInr),
          sponsorName,
          sponsorEmail,
          sponsorPhone
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setSponMessage({ type: "err", text: data?.error || "Could not submit the enquiry." });
      } else {
        setSponMessage({ type: "ok", text: copy.sponsorshipOk });
        setSponsorName("");
        setSponsorEmail("");
        setSponsorPhone("");
        setAmountInr("");
      }
    } catch {
      setSponMessage({ type: "err", text: "Network error while submitting the enquiry." });
    } finally {
      setSponLoading(false);
    }
  };

  const handleBookingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBookMessage(null);
    setBookLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestName, guestEmail, guestPhone, checkIn, checkOut, guestsCount })
      });
      const data = await response.json();
      if (!response.ok) {
        setBookMessage({ type: "err", text: data?.error || "Could not record the stay enquiry." });
      } else {
        setBookMessage({ type: "ok", text: copy.bookingOk });
        setGuestName("");
        setGuestEmail("");
        setGuestPhone("");
        setCheckIn("");
        setCheckOut("");
      }
    } catch {
      setBookMessage({ type: "err", text: "Network error while sending the stay enquiry." });
    } finally {
      setBookLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Namaste Lado Organics. I would like to enquire about general Gau Seva support. Frequency: ${planType}. Proposed amount: ${amountInr ? "₹" + amountInr : "to be discussed"}. Please confirm the current process and details.`
  )}`;
  const stayWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Namaste Lado Organics. I would like to enquire about a Bhunga stay. Check-in: ${checkIn || "to be discussed"}. Check-out: ${checkOut || "to be discussed"}. Guests: ${guestsCount}. Please confirm availability and current pricing.`
  )}`;

  return (
    <section id="experiences" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        <article className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">{copy.gau}</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-2 mb-2">{copy.sponsor}</h2>
          <p className="text-xs sm:text-sm leading-7 text-[var(--muted)] mb-5">{copy.sponsorIntro}</p>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 mb-6">
            <p className="text-xs font-semibold text-[var(--mud)]">General Gau Seva support</p>
            <p className="mt-1 text-xs leading-6 text-[var(--muted)]">Any amount entered below is a proposal for discussion only. No payment is collected by this form and no sponsorship is confirmed until the team reviews the enquiry.</p>
          </div>

          <form onSubmit={handleSponsorshipSubmit} className="space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block text-xs font-bold uppercase">{copy.plan}
                <select value={planType} onChange={(event) => setPlanType(event.target.value)} className="mt-1 w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                  {PLAN_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label className="block text-xs font-bold uppercase">{copy.amount}
                <input type="number" min={1} max={1000000} step={1} required value={amountInr} onChange={(event) => setAmountInr(event.target.value)} placeholder={copy.amountPlaceholder} className="mt-1 w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block text-xs font-bold uppercase">{copy.name}
                <input type="text" required value={sponsorName} onChange={(event) => setSponsorName(event.target.value)} placeholder={copy.fullName} className="mt-1 w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
              </label>
              <label className="block text-xs font-bold uppercase">{copy.email}
                <input type="email" required value={sponsorEmail} onChange={(event) => setSponsorEmail(event.target.value)} placeholder="you@example.com" className="mt-1 w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
              </label>
            </div>
            <label className="block text-xs font-bold uppercase">{copy.phone}
              <input type="tel" value={sponsorPhone} onChange={(event) => setSponsorPhone(event.target.value)} placeholder="+91..." className="mt-1 w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
            </label>
            {sponMessage && <div role="status" className={`p-3.5 rounded-xl text-xs font-medium ${sponMessage.type === "ok" ? "bg-green-50 text-green-900 border border-green-200" : "bg-red-50 text-red-900 border border-red-200"}`}>{sponMessage.text}</div>}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button type="submit" disabled={sponLoading} className="primary-btn px-6 py-3 rounded-xl text-xs font-bold disabled:opacity-50">{sponLoading ? copy.submitting : copy.submit}</button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[var(--terracotta)] hover:underline">{copy.whatsapp}</a>
            </div>
          </form>
        </article>

        <article className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">{copy.stayLabel}</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-2 mb-2">{copy.stay}</h2>
          <p className="text-xs sm:text-sm leading-7 text-[var(--muted)] mb-6">{copy.stayIntro}</p>
          <form onSubmit={handleBookingSubmit} className="space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block text-xs font-bold uppercase">{copy.checkIn}
                <input type="date" required value={checkIn} onChange={(event) => setCheckIn(event.target.value)} className="mt-1 w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
              </label>
              <label className="block text-xs font-bold uppercase">{copy.checkOut}
                <input type="date" required value={checkOut} onChange={(event) => setCheckOut(event.target.value)} className="mt-1 w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
              </label>
            </div>
            <label className="block text-xs font-bold uppercase">{copy.guests}
              <input type="number" min={1} max={4} required value={guestsCount} onChange={(event) => setGuestsCount(Number(event.target.value))} className="mt-1 w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block text-xs font-bold uppercase">{copy.guestName}
                <input type="text" required value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder={copy.fullName} className="mt-1 w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
              </label>
              <label className="block text-xs font-bold uppercase">{copy.email}
                <input type="email" required value={guestEmail} onChange={(event) => setGuestEmail(event.target.value)} placeholder="you@example.com" className="mt-1 w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
              </label>
            </div>
            <label className="block text-xs font-bold uppercase">{copy.phone}
              <input type="tel" required value={guestPhone} onChange={(event) => setGuestPhone(event.target.value)} placeholder="+91..." className="mt-1 w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />
            </label>
            {bookMessage && <div role="status" className={`p-3.5 rounded-xl text-xs font-medium ${bookMessage.type === "ok" ? "bg-green-50 text-green-900 border border-green-200" : "bg-red-50 text-red-900 border border-red-200"}`}>{bookMessage.text}</div>}
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" disabled={bookLoading} className="primary-btn px-6 py-3 rounded-xl text-xs font-bold disabled:opacity-50">{bookLoading ? copy.checking : copy.request}</button>
              <a href={stayWhatsappUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[var(--terracotta)] hover:underline">{copy.stayWhatsapp}</a>
            </div>
          </form>
        </article>
      </div>
    </section>
  );
}
