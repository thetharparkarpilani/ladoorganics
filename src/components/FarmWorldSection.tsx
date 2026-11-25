"use client";

import React, { useState } from "react";
import { useLocale } from "@/context/LocaleContext";

const chapters = [
  { id: "herd", number: "01", name: "The herd", title: "It begins with care.", text: "Meet the indigenous Tharparkar cows at the heart of the Lado story. Their care, comfort and place in the farm ecosystem come first.", icon: "🐄", note: "THARPARKAR GAUSHALA" },
  { id: "dung", number: "02", name: "The dung", title: "Nothing goes to waste.", text: "Cow dung is a useful farm resource. It can be dried for traditional dhoop making or processed through a managed biogas and composting cycle.", icon: "🌾", note: "TRADITIONAL DHOOP • BIOGAS" },
  { id: "soil", number: "03", name: "The soil", title: "Feed the living soil.", text: "Vermicomposting turns suitable organic material into a soil amendment for gardens and fields. Every batch and use should follow responsible handling.", icon: "🪱", note: "PURE KECHUA KHAD" },
  { id: "trees", number: "04", name: "The trees", title: "Grow a greener tomorrow.", text: "Healthy soil, thoughtful water use and trees help create a more resilient farm landscape for people, animals and crops.", icon: "🌳", note: "TREES • SHADE • BIODIVERSITY" },
  { id: "harvest", number: "05", name: "The harvest", title: "From farm to everyday life.", text: "Explore Lado Organics products and farm experiences—from Bilona ghee and milk to dhoop, vermicompost and kesar enquiries.", icon: "🧺", note: "FARM PRODUCTS & EXPERIENCES" }
] as const;

export default function FarmWorldSection() {
  const { locale } = useLocale();
  const copy = locale === "hi" ? {
    eyebrow: "जीवंत और चक्रीय खेत • पिलानी, राजस्थान", title: "एक खेत। कई जुड़ाव।",
    intro: "जानें कि पशुओं की देखभाल, पारंपरिक उत्पाद, खाद, मिट्टी और हरियाली Lado Organics की कहानी में कैसे जुड़ते हैं।",
    explore: "खेत का चक्र देखें", choose: "एक अध्याय चुनें", where: "यहीं से कहानी शुरू होती है।",
    photo: "थारपारकर गाय का चित्र", photoTop: "01 — हमारा पशुधन", photoCountry: "थारपारकर · भारत",
    credits: "नस्ल संदर्भ चित्र", products: ["थारपारकर धूप", "केंचुआ खाद", "थारपारकर गाय का दूध", "बिलोना घी", "केसर"],
    chapters: [
      ["हमारी गायें", "देखभाल से शुरुआत।", "Lado की कहानी के केंद्र में देसी थारपारकर गायें हैं। उनकी देखभाल, आराम और खेत के पारिस्थितिकी तंत्र में उनकी भूमिका सबसे पहले आती है।", "थारपारकर गौशाला"],
      ["गोबर", "कुछ भी व्यर्थ नहीं।", "गोबर खेत का उपयोगी संसाधन है। इसे पारंपरिक धूप के लिए सुखाया जा सकता है या प्रबंधित बायोगैस और कम्पोस्ट प्रक्रिया में इस्तेमाल किया जा सकता है।", "पारंपरिक धूप • बायोगैस"],
      ["मिट्टी", "जीवंत मिट्टी को पोषण दें।", "वर्मी कम्पोस्ट जैविक सामग्री को बगीचों और खेतों के लिए मिट्टी सुधारक में बदलता है। हर बैच का उपयोग जिम्मेदारी से होना चाहिए।", "शुद्ध केंचुआ खाद"],
      ["पेड़", "हरियाली भरा कल उगाएँ।", "स्वस्थ मिट्टी, सोच-समझकर पानी का उपयोग और पेड़ लोगों, पशुओं और फसलों के लिए टिकाऊ खेत बनाते हैं।", "पेड़ • छाया • जैव विविधता"],
      ["उपज", "खेत से रोज़मर्रा तक।", "Lado Organics के उत्पाद और खेत के अनुभव देखें—बिलोना घी और दूध से लेकर धूप, केंचुआ खाद और केसर की पूछताछ तक।", "खेत के उत्पाद और अनुभव"],
    ],
  } : locale === "ma" ? {
    eyebrow: "जीवतो खेत अर आपस में जुड़्यो चक्र • पिलानी, राजस्थान", title: "एक खेत। घणा जुड़ाव।",
    intro: "जाणो पशुवां री देखभाल, पुराणो सामान, खाद, माटी अर हरियाळी Lado Organics री बात में कियां जुड़ै है।",
    explore: "खेत रो चक्र देखो", choose: "एक पड़ाव चुनो", where: "कहाणी ईंठै सूं चालै।",
    photo: "थारपारकर गाय रो चित्र", photoTop: "01 — म्हारी गायां", photoCountry: "थारपारकर · भारत",
    credits: "नस्ल रो संदर्भ चित्र", products: ["थारपारकर धूप", "केंचुआ खाद", "थारपारकर गाय का दूध", "बिलोना घी", "केसर"],
    chapters: [
      ["गायां", "पैली देखभाल।", "Lado री बात रै बीच में देसी थारपारकर गायां है। उण री देखभाल, आराम अर खेत में उण रो स्थान पैली आवै।", "थारपारकर गौशाला"],
      ["गोबर", "काई भी बेकार कोनी।", "गोबर खेत रो काम रो संसाधन है। ई नै सुखाय कै धूप बणै या बायोगैस अर खाद रै चक्र में काम ले सकै।", "देसी धूप • बायोगैस"],
      ["माटी", "जीवती माटी नै पोषण देवो।", "केंचुआ खाद जैविक चीजां नै बगीचा अर खेत खातर माटी सुधारक बनावै। हर बैच रो उपयोग सोच-समझ कै करो।", "चोखी केंचुआ खाद"],
      ["रूंख", "हरियो आगळ रो दिन उगावो।", "चोखी माटी, पानी रो सोच्यो उपयोग अर रूंख लोगां, पशुवां अर फसलां खातर मजबूत खेत बनावै।", "रूंख • छांव • जैव विविधता"],
      ["उपज", "खेत सूं रोज रै जीवन तक।", "Lado Organics रो सामान अर खेत रा अनुभव देखो—बिलोना घी अर दूध सूं धूप, केंचुआ खाद अर केसर री पूछताछ तक।", "खेत रो सामान अर अनुभव"],
    ],
  } : {
    eyebrow: "A living, circular farm • Pilani, Rajasthan", title: "One farm. Many connections.",
    intro: "Explore how animal care, traditional products, compost, soil and growing things connect in the Lado Organics story.",
    explore: "Explore the cycle", choose: "Choose a chapter", where: "Where the story begins.",
    photo: "Photograph of a Tharparkar cow", photoTop: "01 — THE HERD", photoCountry: "THARPARKAR · INDIA",
    credits: "Breed reference photograph", products: ["Tharparkar Dhoop", "Vermicompost", "Tharparkar Cow Milk", "Bilona Ghee", "Kesar"],
    chapters: [
      ["The herd", "It begins with care.", "Meet the indigenous Tharparkar cows at the heart of the Lado story. Their care, comfort and place in the farm ecosystem come first.", "THARPARKAR GAUSHALA"],
      ["The dung", "Nothing goes to waste.", "Cow dung is a useful farm resource. It can be dried for traditional dhoop making or processed through a managed biogas and composting cycle.", "TRADITIONAL DHOOP • BIOGAS"],
      ["The soil", "Feed the living soil.", "Vermicomposting turns suitable organic material into a soil amendment for gardens and fields. Every batch and use should follow responsible handling.", "PURE KECHUA KHAD"],
      ["The trees", "Grow a greener tomorrow.", "Healthy soil, thoughtful water use and trees help create a more resilient farm landscape for people, animals and crops.", "TREES • SHADE • BIODIVERSITY"],
      ["The harvest", "From farm to everyday life.", "Explore Lado Organics products and farm experiences—from Bilona ghee and milk to dhoop, vermicompost and kesar enquiries.", "FARM PRODUCTS & EXPERIENCES"],
    ],
  };
  const [active, setActive] = useState<(typeof chapters)[number]["id"]>("herd");
  const chapterIndex = Math.max(0, chapters.findIndex((item) => item.id === active));
  const chapter = chapters[chapterIndex];
  const chapterCopy = copy.chapters[chapterIndex];

  return (
    <section id="farm-world" className="farm-world-section relative overflow-hidden py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="farm-world-grain" aria-hidden="true" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="farm-eyebrow">{copy.eyebrow}</p>
          <h2 className="farm-display mt-4">{copy.title}</h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-[var(--text-muted)] max-w-2xl">{copy.intro}</p>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-6 lg:gap-10 items-stretch">
          <div className="farm-world-art farm-world-photo relative min-h-[360px] sm:min-h-[500px] rounded-[2rem] overflow-hidden" aria-label={copy.photo}>
            <div className="farm-world-photo-overlay" />
            <div className="farm-photo-topline"><span>{copy.photoTop}</span><span>{copy.photoCountry}</span></div>
            <div className="farm-photo-bottomline">
              <p>{copy.where}</p>
              <span>{copy.credits}<br />Pavanaja / Wikimedia Commons<br />CC BY-SA 3.0</span>
            </div>
          </div>
          <div className="farm-world-panel flex flex-col justify-between rounded-[2rem] p-6 sm:p-9">
            <div>
              <p className="farm-eyebrow">{copy.explore} · {chapter.number}</p>
              <div className="farm-chapter-icon mt-7" aria-hidden="true">{chapter.icon}</div>
              <h3 className="farm-display farm-display-small mt-5">{chapterCopy[1]}</h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--text-muted)]">{chapterCopy[2]}</p>
              <p className="mt-6 text-[10px] font-bold tracking-[.2em] text-[var(--accent-forest)]">{chapterCopy[3]}</p>
            </div>
            <div className="mt-10">
              <p className="text-[10px] uppercase tracking-[.2em] font-bold text-[var(--text-muted)] mb-3">{copy.choose}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {chapters.map((item) => (
                  <button key={item.id} type="button" onClick={() => setActive(item.id)} aria-pressed={active === item.id} className={`farm-chapter-button ${active === item.id ? "is-active" : ""}`}>
                    <span>{item.icon}</span><span>{copy.chapters[chapters.findIndex((chapterItem) => chapterItem.id === item.id)][0]}</span><span className="ml-auto opacity-55">{item.number}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="farm-product-ribbon mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-5 gap-px overflow-hidden rounded-2xl">
          {[["🪔",copy.products[0]],["🌱",copy.products[1]],["🥛",copy.products[2]],["🫙",copy.products[3]],["🌸",copy.products[4]]].map(([icon, label]) => (
            <a key={label} href="#store" className="farm-product-link"><span>{icon}</span><span>{label}</span><span aria-hidden="true">↗</span></a>
          ))}
        </div>
      </div>
    </section>
  );
}
