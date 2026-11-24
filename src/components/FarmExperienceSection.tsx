"use client";

import React, { useMemo, useState } from "react";
import { useLocale } from "@/context/LocaleContext";

interface FarmExperienceSectionProps {
  whatsappNumber: string;
}

const CALF_OPTIONS = ["Dholi Sheri", "Tara", "Roshni"] as const;
const PLAN_OPTIONS = [
  { value: "one_time", label: "One-Time Contribution" },
  { value: "monthly", label: "Monthly Sponsorship" },
  { value: "yearly", label: "Yearly Sponsorship" }
] as const;

export default function FarmExperienceSection({ whatsappNumber }: FarmExperienceSectionProps) {
  const { locale } = useLocale();
  const copy = locale === "hi" ? {
    gau: "गौ सेवा • पिलानी गौशाला", sponsor: "थारपारकर बछड़े के सहयोगी बनें",
    sponsorIntro: "ढोली शेरी, तारा या रोशनी के लिए सहयोग की रुचि दर्ज करें। भुगतान और रसीद का विवरण टीम से स्पष्ट रूप से पुष्टि किया जाएगा।",
    calf: "बछड़े का प्रोफ़ाइल", plan: "सहयोग की अवधि", amount: "आपकी चुनी हुई सहयोग राशि (₹)", amountPlaceholder: "अपनी राशि दर्ज करें",
    name: "आपका नाम", email: "ईमेल", phone: "फ़ोन / WhatsApp (वैकल्पिक)", fullName: "पूरा नाम",
    submit: "सहयोग अनुरोध भेजें", submitting: "भेजा जा रहा है…", whatsapp: "या WhatsApp पर बात करें ↗",
    stayLabel: "कृषि पर्यटन • पिलानी, राजस्थान", stay: "डीप वर्क भुंगा स्टे का अनुरोध",
    stayIntro: "दर्ज आधार किराया: ₹4,000 प्रति रात। दोहरी बुकिंग रोकने के लिए सर्वर तारीखों की उपलब्धता जाँचता है।",
    checkIn: "आगमन", checkOut: "प्रस्थान", guests: "मेहमान (1–4)", estimate: "अनुमानित ठहराव राशि",
    guestName: "मेहमान का नाम", checking: "उपलब्धता जाँची जा रही है…", request: "भुंगा स्टे का अनुरोध भेजें",
    sponsorshipOk: "आपका सहयोग अनुरोध दर्ज हो गया है। भुगतान और बाकी विवरण WhatsApp पर टीम से पक्के करें।",
    bookingOk: "आपका ठहराव अनुरोध दर्ज हो गया है। टीम तारीख और उपलब्धता की पुष्टि करेगी।",
  } : locale === "ma" ? {
    gau: "गौ सेवा • पिलानी गौशाला", sponsor: "थारपारकर बाछड़ै री सेवा में जुड़ो",
    sponsorIntro: "ढोली शेरी, तारा या रोशनी खातर सहयोग री रुचि लिखावो। भुगतान अर रसीद री बात टीम साफ-साफ पक्की करैला।",
    calf: "बाछड़ै री जानकारी", plan: "सहयोग रो समय", amount: "थारी चुनी री सहयोग रकम (₹)", amountPlaceholder: "आपरी रकम लिखो",
    name: "थारो नाम", email: "ईमेल", phone: "फोन / WhatsApp (जरूरी कोनी)", fullName: "पूरो नाम",
    submit: "सहयोग री अरज भेजो", submitting: "भेजी जावै है…", whatsapp: "या WhatsApp पर बात करो ↗",
    stayLabel: "खेत पर्यटन • पिलानी, राजस्थान", stay: "डीप वर्क भुंगा ठहराव री अरज",
    stayIntro: "लिख्यो शुरुआती भाव: ₹4,000 एक रात रो। दोहरी बुकिंग रोकण खातर सर्वर तारीख जांचै है।",
    checkIn: "आवण री तारीख", checkOut: "जावण री तारीख", guests: "मेहमान (1–4)", estimate: "ठहराव रो अंदाजी खर्चो",
    guestName: "मेहमान रो नाम", checking: "जगह जांची जावै है…", request: "भुंगा ठहराव री अरज भेजो",
    sponsorshipOk: "थारी सहयोग री अरज लिख ली है। भुगतान अर बाकी बात WhatsApp पर टीम सूं पक्की करो।",
    bookingOk: "थारी ठहराव री अरज लिख ली है। टीम तारीख अर जगह पक्की करैला।",
  } : {
    gau: "{copy.gau}", sponsor: "{copy.sponsor}",
    sponsorIntro: "Register a sponsorship interest for Dholi Sheri, Tara, or Roshni. Payment and receipt details are confirmed transparently with the team.",
    calf: "Calf Profile", plan: "Plan Type", amount: "Your chosen contribution amount (₹ INR)", amountPlaceholder: "Enter an amount you choose",
    name: "Your Name", email: "Email", phone: "Phone / WhatsApp (Optional)", fullName: "Full name",
    submit: "Submit Sponsorship Request", submitting: "Submitting...", whatsapp: "{copy.whatsapp}",
    stayLabel: "{copy.stayLabel}", stay: "{copy.stay}",
    stayIntro: "Listed base rate: ₹4,000 per night. The server checks overlapping dates automatically to prevent double bookings.",
    checkIn: "Check-In", checkOut: "Check-Out", guests: "Guests (1–4)", estimate: "Estimated Stay Base",
    guestName: "Guest Name", checking: "Checking Availability...", request: "Request Bhunga Stay",
    sponsorshipOk: "Your sponsorship request has been recorded. Confirm payment and details with the team on WhatsApp.",
    bookingOk: "Your stay request has been recorded. The team will confirm dates and availability.",
  };
  // Calf Sponsorship state
  const [calfName, setCalfName] = useState<string>("Dholi Sheri");
  const [planType, setPlanType] = useState<string>("monthly");
  const [amountInr, setAmountInr] = useState<string>("");
  const [sponsorName, setSponsorName] = useState<string>("");
  const [sponsorEmail, setSponsorEmail] = useState<string>("");
  const [sponsorPhone, setSponsorPhone] = useState<string>("");
  const [sponLoading, setSponLoading] = useState(false);
  const [sponMessage, setSponMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Bhunga Stay state
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [bookLoading, setBookLoading] = useState(false);
  const [bookMessage, setBookMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const estimatedStayInr = useMemo(() => {
    if (!checkIn || !checkOut) return 4000;
    const s = Date.parse(`${checkIn}T00:00:00Z`);
    const e = Date.parse(`${checkOut}T00:00:00Z`);
    if (!Number.isFinite(s) || !Number.isFinite(e) || e <= s) return 4000;
    const nights = Math.round((e - s) / (1000 * 60 * 60 * 24));
    return nights * 4000;
  }, [checkIn, checkOut]);

  const handleSponsorshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSponMessage(null);
    setSponLoading(true);
    try {
      const res = await fetch("/api/sponsorships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calfName,
          planType,
          amountInr: Number(amountInr),
          sponsorName,
          sponsorEmail,
          sponsorPhone
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setSponMessage({ type: "err", text: data?.error || "Could not submit sponsorship request." });
      } else {
        setSponMessage({
          type: "ok",
          text: copy.sponsorshipOk
        });
        setSponsorName("");
        setSponsorEmail("");
        setSponsorPhone("");
      }
    } catch {
      setSponMessage({ type: "err", text: "Network error while submitting sponsorship request." });
    } finally {
      setSponLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookMessage(null);
    setBookLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          guestEmail,
          guestPhone,
          checkIn,
          checkOut,
          guestsCount
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setBookMessage({ type: "err", text: data?.error || "Could not create reservation request." });
      } else {
        setBookMessage({
          type: "ok",
          text: copy.bookingOk
        });
        setGuestName("");
        setGuestEmail("");
        setGuestPhone("");
        setCheckIn("");
        setCheckOut("");
      }
    } catch {
      setBookMessage({ type: "err", text: "Network error while creating stay booking." });
    } finally {
      setBookLoading(false);
    }
  };

  return (
    <section id="experiences" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Calf Sponsorship Form */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            Gau Seva • Pilani Gaushala
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold mt-1 mb-2">
            Sponsor a Tharparkar Calf
          </h3>
          <p className="text-xs sm:text-sm opacity-80 mb-6">
            {copy.sponsorIntro}
          </p>

          <form onSubmit={handleSponsorshipSubmit} className="space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">{copy.calf}</label>
                <select
                  value={calfName}
                  onChange={(e) => setCalfName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                >
                  {CALF_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">{copy.plan}</label>
                <select
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                >
                  {PLAN_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">{copy.amount}</label>
              <input
                type="number"
                min={1}
                max={1000000}
                placeholder={copy.amountPlaceholder}
                step={1}
                required
                value={amountInr}
                onChange={(e) => setAmountInr(e.target.value)}
                className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">{copy.name}</label>
                <input
                  type="text"
                  required
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder={copy.fullName}
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">{copy.email}</label>
                <input
                  type="email"
                  required
                  value={sponsorEmail}
                  onChange={(e) => setSponsorEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">{copy.phone}</label>
              <input
                type="tel"
                value={sponsorPhone}
                onChange={(e) => setSponsorPhone(e.target.value)}
                placeholder="+91..."
                className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
              />
            </div>

            {sponMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs font-medium ${
                  sponMessage.type === "ok"
                    ? "bg-green-50 text-green-900 border border-green-200"
                    : "bg-red-50 text-red-900 border border-red-200"
                }`}
              >
                {sponMessage.text}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={sponLoading}
                className="primary-btn px-6 py-3 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {sponLoading ? copy.submitting : copy.submit}
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(amountInr ? `Namaste Lado Organics! I would like to enquire about sponsoring ${calfName} (${planType}) with a proposed contribution of ₹${amountInr}. Please confirm the details.` : `Namaste Lado Organics! I would like to enquire about sponsoring ${calfName} (${planType}). Please share the available contribution options and details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[var(--terracotta)] hover:underline"
              >
                Or chat on WhatsApp ↗
              </a>
            </div>
          </form>
        </div>

        {/* "Deep Work" Bhunga Stay Booking Form */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            Agro-Tourism • Pilani, Rajasthan
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold mt-1 mb-2">
            Reserve “Deep Work” Bhunga Stay
          </h3>
          <p className="text-xs sm:text-sm opacity-80 mb-6">
            {copy.stayIntro}
          </p>

          <form onSubmit={handleBookingSubmit} className="space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">{copy.checkIn}</label>
                <input
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">{copy.checkOut}</label>
                <input
                  type="date"
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">{copy.guests}</label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  required
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">{copy.estimate}</label>
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] font-serif font-bold text-[var(--terracotta)]">
                  ₹{estimatedStayInr.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">{copy.guestName}</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Full name"
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Phone</label>
              <input
                type="tel"
                required
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+91..."
                className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
              />
            </div>

            {bookMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs font-medium ${
                  bookMessage.type === "ok"
                    ? "bg-green-50 text-green-900 border border-green-200"
                    : "bg-red-50 text-red-900 border border-red-200"
                }`}
              >
                {bookMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={bookLoading}
              className="primary-btn px-6 py-3 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {bookLoading ? copy.checking : copy.request}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
