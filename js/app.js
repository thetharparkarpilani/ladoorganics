const WHATSAPP_NUMBER = "919636100337";
const GOOGLE_SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbx-lUmYJISZwTFuuh4gx4GqqNUJDf0wEFIL6fRD_gB1q9gSyPxeWbo1Zj2QIH0aKQa2/exec";

const TRANSLATIONS = {
  en: {
    nav_store: "STORE",
    nav_calc: "CALCULATOR",
    nav_founder: "FOUNDER",
    nav_adopt: "ADOPT-A-COW",
    nav_journal: "JOURNAL",
    hero_badge: "PILANI, RAJASTHAN • BITS PILANI ALUMNUS BACKED • ZED BRONZE",
    hero_title_1: "Pure Tharparkar Tradition,",
    hero_title_2: "Engineered With Transparency.",
    hero_sub: "Rooted in the 'Cow as a Coconut' zero-waste philosophy. Empowering 100+ Pilani farming families with verifiable A2 Bilona Ghee, Cow Dung Dhoop, Biogas Vermicompost & Deep Work Bhunga Stays.",
    hero_cta_shop: "Shop Circular Store",
    hero_cta_calc: "Calculate Custom Order",
    store_tag: "01. THE CIRCULAR STORE",
    store_title: "Ethical & Unadulterated",
    store_sub: "Direct-from-Pilani farm batches. Instant WhatsApp checkout with zero middlemen.",
    calc_tag: "02. INTERACTIVE_ORDER_&_STAY_PLANNER",
    calc_title: "Instant Bundle & Farm Stay Calculator",
    founder_tag: "03. FOUNDER_&_SYSTEMS_ARCHITECTURE",
    founder_title: "From BITS Pilani Mathematics to Regenerative Farming",
    adopt_tag: "04. GAUSHALA_COMMUNITY",
    adopt_title: "Adopt a Tharparkar Calf",
    blueprint_tag: "05. ZERO-WASTE_CYCLE",
    blueprint_title: "The Cow as a Coconut",
    journal_tag: "06. THE_PILANI_JOURNAL",
    journal_title: "Wisdom, Soil & Systems Science",
    contact_title: "Connect to the Source",
    contact_sub: "Bulk B2B A2 Ghee orders, Bhunga farm stays, or Gaushala sponsorships—reach our Pilani team directly."
  },
  hi: {
    nav_store: "भंडार",
    nav_calc: "कैलकुलेटर",
    nav_founder: "संस्थापक",
    nav_adopt: "गौ सेवा",
    nav_journal: "ब्लॉग",
    hero_badge: "पिलानी, राजस्थान • BITS पिलानी पूर्व छात्र द्वारा संचालित • ZED प्रमाणित",
    hero_title_1: "शुद्ध थारपारकर परंपरा,",
    hero_title_2: "पूर्ण पारदर्शिता के साथ।",
    hero_sub: "'गाय एक कल्पवृक्ष (नारियल)' के शून्य-अपशिष्ट सिद्धांत पर आधारित। पिलानी के 100+ किसान परिवारों को सशक्त बनाते हुए शुद्ध A2 बिलोना घी, धूप, केंचुआ खाद और भुंगा फार्म स्टे।",
    hero_cta_shop: "उत्पाद देखें",
    hero_cta_calc: "ऑर्डर कैलकुलेटर",
    store_tag: "01. सर्कुलर स्टोर",
    store_title: "शुद्ध और नैतिक उत्पाद",
    store_sub: "सीधे पिलानी फार्म से आपके घर तक। बिना किसी बिचौलिए के व्हाट्सएप पर ऑर्डर करें।",
    calc_tag: "02. ऑर्डर और फार्म स्टे कैलकुलेटर",
    calc_title: "अपना बंडल और स्टे प्लान करें",
    founder_tag: "03. संस्थापक परिचय",
    founder_title: "BITS पिलानी गणित से जैविक कृषि तक",
    adopt_tag: "04. गौशाला समुदाय",
    adopt_title: "थारपारकर बछड़ा गोद लें",
    blueprint_tag: "05. शून्य-अपशिष्ट चक्र",
    blueprint_title: "गाय: एक संपूर्ण पारिस्थितिकी तंत्र",
    journal_tag: "06. पिलानी जर्नल",
    journal_title: "आयुर्वेद, मिट्टी और विज्ञान",
    contact_title: "सीधे फार्म से जुड़ें",
    contact_sub: "थोक A2 घी ऑर्डर, भुंगा फार्म स्टे या गौशाला सहयोग के लिए संपर्क करें।"
  },
  ma: {
    nav_store: "हाट बाजार",
    nav_calc: "हिसाब-किताब",
    nav_founder: "आपणो परिचय",
    nav_adopt: "गऊ सेवा",
    nav_journal: "बातां और ज्ञान",
    hero_badge: "पिलानी, राजस्थान • BITS पिलानी इंजीनियर री पहल • ZED प्रमाणित",
    hero_title_1: "पुरखां री चोखी विरासत,",
    hero_title_2: "पूरी ईमानदारी रे साथे।",
    hero_sub: "'गाय नारियल ज्यूं गुणकारी' — पिलानी रा 100+ किसान परिवारों रे साथे मिलर, शुद्ध A2 बिलोना घी, देसी धूप, केंचुआ खाद और भुंगा फार्म स्टे।",
    hero_cta_shop: "सामान देखो",
    hero_cta_calc: "ऑर्डर हिसाब लगाओ",
    store_tag: "01. देसी हाट",
    store_title: "असली और चोखो माल",
    store_sub: "सीधो पिलानी फार्म सूं आपरे आंगणे। व्हाट्सएप माथे सीधो ऑर्डर करो।",
    calc_tag: "02. ऑर्डर और स्टे कैलकुलेटर",
    calc_title: "आपणो ऑर्डर खुद बणाओ",
    founder_tag: "03. संस्थापक री बात",
    founder_title: "BITS पिलानी री पढ़ाई सूं धरती री सेवा तक",
    adopt_tag: "04. गऊ वंश सेवा",
    adopt_title: "थारपारकर बाछड़ी गोद ल्यो",
    blueprint_tag: "05. जीरो-वेस्ट खेती",
    blueprint_title: "गाय: हर चीज़ काम री",
    journal_tag: "06. पिलानी री बातां",
    journal_title: "देसी ज्ञान और खेती",
    contact_title: "सीधो संपर्क करो",
    contact_sub: "थोक घी, भुंगा फार्म स्टे या गऊ सेवा खातिर अठे लिखो।"
  }
};

let PRODUCTS_CACHE = [];
let BLOGS_CACHE = [];

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initAmbientEcoCanvas();
  initTypingHero();
  initScrollProgress();
  initAppData();
  setupAIChat();
  setupWebhookRouting();
  setupLanguageToggle();
  setupCommandPalette();
});

function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3400);
}

/* Theme Toggle (Sun-Baked Sand vs Desert Dusk) */
function initTheme() {
  const saved = localStorage.getItem("lado_theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = saved === "dusk" ? "☀️ Sand" : "🌙 Dusk";
}

window.toggleTheme = function () {
  const cur = document.documentElement.getAttribute("data-theme") || "light";
  const next = cur === "light" ? "dusk" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("lado_theme", next);
  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = next === "dusk" ? "☀️ Sand" : "🌙 Dusk";
};

/* Scroll Progress Bar */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  });
}

/* Smooth Typing Sub-Headline (Inspired by Akash's Portfolio Hero) */
function initTypingHero() {
  const el = document.getElementById("typed-hero");
  if (!el) return;
  const phrases = [
    "100% Vedic Hand-Churned Tharparkar A2 Bilona Ghee",
    "Zero-Waste 'Cow as a Coconut' Circular Gaushala",
    "Deep Work Bhunga Mud Stays • 4 Hrs from Gurugram",
    "Empowering 100+ Farming Families in Pilani, Rajasthan"
  ];
  let p = 0, c = 0, del = false;
  (function tick() {
    const cur = phrases[p];
    el.textContent = del ? cur.substring(0, c--) : cur.substring(0, c++);
    let speed = del ? 32 : 68;
    if (!del && c === cur.length + 1) { speed = 2000; del = true; }
    else if (del && c === 0) { del = false; p = (p + 1) % phrases.length; speed = 350; }
    setTimeout(tick, speed);
  })();
}

/* Interactive Floating Farm & Zero-Waste Canvas (Inspired by Akash's Math Canvas) */
function initAmbientEcoCanvas() {
  const canvas = document.getElementById("eco-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  const glyphs = ["🌿", "🌾", "☀️", "🏺", "💧", "✦", "ॐ"];
  const nodes = [
    { label: "A2 Bilona Ghee: 30L Tharparkar Milk → 1L Golden Ghee", x: w * 0.12, y: h * 0.25, r: 24, vx: 0.16, vy: 0.11, icon: "🏺" },
    { label: "Biogas Loop: Fresh Dung → Clean Cooking Fuel & Slurry", x: w * 0.86, y: h * 0.28, r: 24, vx: -0.14, vy: 0.14, icon: "🔥" },
    { label: "Pure Kechua Khad: Biogas Slurry → Vermicompost", x: w * 0.15, y: h * 0.75, r: 24, vx: 0.13, vy: -0.12, icon: "🌱" },
    { label: "ZED Bronze & MSME Registered (UDYAM-RJ-21-0104324)", x: w * 0.84, y: h * 0.72, r: 24, vx: -0.15, vy: -0.11, icon: "🏅" }
  ];

  const particles = Array.from({ length: 18 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.22,
    vy: -0.1 - Math.random() * 0.18,
    glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
    size: 13 + Math.floor(Math.random() * 6)
  }));

  const tip = document.getElementById("ecoTooltip");
  let mx = -999, my = -999;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!tip) return;
    const hit = nodes.find((n) => Math.hypot(mx - n.x, my - n.y) <= n.r + 14);
    if (hit) {
      tip.style.display = "block";
      tip.style.left = Math.min(window.innerWidth - 310, mx + 14) + "px";
      tip.style.top = my + 14 + "px";
      tip.textContent = "✨ " + hit.label;
    } else {
      tip.style.display = "none";
    }
  });

  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  function frame() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = 0.26;
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.glyph, p.x, p.y);
    });

    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 40 || n.x > w - 40) n.vx *= -1;
      if (n.y < 90 || n.y > h - 40) n.vy *= -1;
      const hover = Math.hypot(mx - n.x, my - n.y) <= n.r + 14;
      ctx.globalAlpha = hover ? 0.85 : 0.35;
      ctx.strokeStyle = hover ? "#c2410c" : "#f59e0b";
      ctx.lineWidth = hover ? 2 : 1.2;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = "18px serif";
      ctx.fillText(n.icon, n.x - 9, n.y + 6);
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  frame();
}

/* Interactive CLI Terminal Switcher (Adapted from Akash's Portfolio) */
window.runFarmCmd = function (key) {
  const body = document.getElementById("farm-terminal-body");
  if (!body) return;
  const cmds = {
    purity: {
      c: "./verify_a2_batch.sh",
      o: `[PASS] Breed: 100% Indigenous Tharparkar (Pilani Herd)<br>[PASS] Method: Curd-Churned Wooden Bilona (~30L Milk -> 1L Ghee)<br>[PASS] Additives: 0% Preservatives, 0% Palm/Vegetable Oil`
    },
    cycle: {
      c: "./cow_as_coconut.py --audit",
      o: `"milk": "A2 Bilona Ghee (Calves Dholi Sheri, Tara & Roshni fed first)",<br>"dung_1": "Anaerobic Biogas Digester -> Clean Farm Energy",<br>"slurry": "Vermicompost Beds -> Pure Kechua Khad",<br>"dung_2": "Herbal Resin Blend -> Zero-Charcoal Tharparkar Dhoop"`
    },
    impact: {
      c: "./pilani_impact.sh",
      o: `• Network: 100+ Local Pilani Farming Families Empowered<br>• Credentials: MSME (UDYAM-RJ-21-0104324) | ZED Bronze Certified<br>• Traceability: Direct Farm-to-Doorstep Batch Logs`
    },
    founder: {
      c: "./whoami --founder",
      o: `Akash Saini • Integrated M.Sc. Mathematics, BITS Pilani<br>Applying quantitative rigor & zero-waste systems design to Gau Sanskriti.`
    }
  };
  const item = cmds[key] || cmds.purity;
  body.innerHTML = `<div><span style="color:#4ade80;">➜</span> ${item.c}</div><div class="mt-2 pl-3 border-l-2 border-[#f59e0b] text-[#fde68a]/85 leading-relaxed">${item.o}</div>`;
};

/* Load Products & Blogs */
async function initAppData() {
  try {
    const [prodRes, blogRes] = await Promise.all([
      fetch("./data/products.json"),
      fetch("./data/blogs.json")
    ]);
    if (prodRes.ok) PRODUCTS_CACHE = await prodRes.json();
    if (blogRes.ok) BLOGS_CACHE = await blogRes.json();
  } catch (e) {
    console.error("Data load error:", e);
  }
  renderCatalog();
  renderBlogs();
  updateOrderCalculator();
  initScrollAnimations();
}

window.openWhatsAppOrder = function (productName, priceFormatted, unit) {
  const text = `Namaste Lado Organics! 🙏\nI would like to order:\n• *Item:* ${productName}\n• *Price:* ₹${priceFormatted} / ${unit}\n\nPlease share availability and delivery details.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
};

function renderCatalog() {
  const grid = document.getElementById("product-catalog-grid");
  if (!grid || !PRODUCTS_CACHE.length) return;

  grid.innerHTML = PRODUCTS_CACHE.map(
    (p, idx) => `
    <article class="glass-card rounded-3xl overflow-hidden flex flex-col reveal" style="transition-delay: ${idx * 80}ms">
      <div class="h-56 bg-[var(--earth)]/10 relative overflow-hidden border-b border-[var(--border)]">
        <img src="${p.image}" onerror="this.onerror=null;this.src='${p.fallbackImage}';" alt="${p.name}" class="w-full h-full object-cover hover:scale-105 transition duration-700" />
        ${p.badge ? `<span class="absolute top-3.5 right-3.5 bg-[var(--terracotta)] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow">${p.badge}</span>` : ""}
      </div>
      <div class="p-6 flex flex-col flex-grow">
        <h3 class="text-xl font-serif font-bold text-[var(--mud)] mb-2">${p.name}</h3>
        <p class="text-sm text-[var(--muted)]/85 mb-5 font-light flex-grow leading-relaxed">${p.desc}</p>
        <div class="flex justify-between items-end mb-5 pt-3 border-t border-[var(--border)]">
          <div>
            <span class="block text-[11px] uppercase tracking-wider text-[var(--muted)]/60">Per ${p.unit}</span>
            <span class="text-2xl font-serif font-bold text-[var(--terracotta)]">₹${p.priceFormatted}</span>
          </div>
          <span class="text-[11px] font-semibold text-[var(--green)] bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/30">Fresh Batch</span>
        </div>
        <button onclick='openWhatsAppOrder(${JSON.stringify(p.name)}, ${JSON.stringify(p.priceFormatted)}, ${JSON.stringify(p.unit)})' class="w-full primary-btn py-3.5 rounded-xl font-semibold text-sm flex justify-center items-center gap-2 cursor-pointer">
          <i class="fab fa-whatsapp text-lg text-[#25D366]"></i> ${p.cta}
        </button>
      </div>
    </article>
  `
  ).join("");
}

/* Interactive Bundle & Farm Stay Calculator (Inspired by Akash's Sprint Estimator) */
window.updateOrderCalculator = function () {
  const gheeQty = parseInt(document.getElementById("calcGhee")?.value || "1", 10);
  const dhoopQty = parseInt(document.getElementById("calcDhoop")?.value || "0", 10);
  const khadQty = parseInt(document.getElementById("calcKhad")?.value || "0", 10);
  const stayNights = parseInt(document.getElementById("calcStay")?.value || "0", 10);

  document.getElementById("valGhee").textContent = `${gheeQty} L`;
  document.getElementById("valDhoop").textContent = `${dhoopQty} Box`;
  document.getElementById("valKhad").textContent = `${khadQty} Bag (5kg)`;
  document.getElementById("valStay").textContent = `${stayNights} Night(s)`;

  const subtotal = gheeQty * 5000 + dhoopQty * 1000 + khadQty * 2000 + stayNights * 4000;
  const totalEl = document.getElementById("calcTotalDisplay");
  const breakdownEl = document.getElementById("calcBreakdownDisplay");
  if (totalEl) totalEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;

  const parts = [];
  if (gheeQty > 0) parts.push(`${gheeQty}L A2 Bilona Ghee`);
  if (dhoopQty > 0) parts.push(`${dhoopQty}x Tharparkar Dhoop`);
  if (khadQty > 0) parts.push(`${khadQty}x Kechua Khad (5kg)`);
  if (stayNights > 0) parts.push(`${stayNights} Night Bhunga Stay`);
  if (breakdownEl) {
    breakdownEl.textContent = parts.length ? parts.join(" + ") : "Select at least 1 item or stay night above.";
  }
};

window.sendCalculatedBundleWhatsApp = function () {
  const gheeQty = parseInt(document.getElementById("calcGhee")?.value || "0", 10);
  const dhoopQty = parseInt(document.getElementById("calcDhoop")?.value || "0", 10);
  const khadQty = parseInt(document.getElementById("calcKhad")?.value || "0", 10);
  const stayNights = parseInt(document.getElementById("calcStay")?.value || "0", 10);
  const subtotal = gheeQty * 5000 + dhoopQty * 1000 + khadQty * 2000 + stayNights * 4000;

  if (subtotal === 0) {
    showToast("⚠️ Please select at least 1 item or night first!");
    return;
  }

  let lines = ["Namaste Lado Organics! 🙏", "I built a custom order on ladoorganics.in:"];
  if (gheeQty > 0) lines.push(`• A2 Bilona Ghee: ${gheeQty} Litre (₹${(gheeQty * 5000).toLocaleString("en-IN")})`);
  if (dhoopQty > 0) lines.push(`• Tharparkar Dhoop: ${dhoopQty} Box (₹${(dhoopQty * 1000).toLocaleString("en-IN")})`);
  if (khadQty > 0) lines.push(`• Pure Kechua Khad: ${khadQty} x 5kg Bag (₹${(khadQty * 2000).toLocaleString("en-IN")})`);
  if (stayNights > 0) lines.push(`• 'Deep Work' Bhunga Stay: ${stayNights} Night(s) (₹${(stayNights * 4000).toLocaleString("en-IN")})`);
  lines.push(`\n*Estimated Total:* ₹${subtotal.toLocaleString("en-IN")}`);
  lines.push("Please confirm dispatch / booking availability!");

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
};

/* Render Blogs & Full Reader Modal */
function renderBlogs() {
  const grid = document.getElementById("blog-catalog-grid");
  if (!grid || !BLOGS_CACHE.length) return;

  grid.innerHTML = BLOGS_CACHE.map(
    (b, idx) => `
    <article class="glass-card rounded-3xl overflow-hidden flex flex-col reveal" style="transition-delay: ${idx * 80}ms">
      <div class="h-48 overflow-hidden relative">
        <img src="${b.image}" alt="${b.title}" class="w-full h-full object-cover hover:scale-105 transition duration-700" />
        <span class="absolute top-3.5 left-3.5 bg-[var(--surface-solid)] text-[var(--mud)] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[var(--border)]">${b.category}</span>
      </div>
      <div class="p-6 flex flex-col flex-grow">
        <div class="text-xs text-[var(--muted)]/60 mb-2 font-mono">${b.date} • ${b.readTime}</div>
        <h3 class="text-lg font-serif font-bold text-[var(--mud)] mb-2.5 leading-snug">${b.title}</h3>
        <p class="text-sm text-[var(--muted)]/80 font-light leading-relaxed mb-5 flex-grow">${b.excerpt}</p>
        <button onclick="openBlogModal('${b.id}')" class="text-left text-sm font-bold text-[var(--terracotta)] hover:underline inline-flex items-center gap-2 cursor-pointer">
          Read Full Article <i class="fas fa-arrow-right text-xs"></i>
        </button>
      </div>
    </article>
  `
  ).join("");
}

window.openBlogModal = function (id) {
  const b = BLOGS_CACHE.find((x) => x.id === id);
  const modal = document.getElementById("blog-modal");
  const body = document.getElementById("blog-modal-body");
  if (!b || !modal || !body) return;

  body.innerHTML = `
    <span class="text-xs font-mono font-bold uppercase tracking-widest text-[var(--terracotta)]">${b.category} • ${b.readTime}</span>
    <h2 class="text-2xl sm:text-4xl font-serif font-bold text-[var(--mud)] mt-2 mb-5 leading-tight">${b.title}</h2>
    <img src="${b.image}" alt="${b.title}" class="w-full h-60 sm:h-72 object-cover rounded-2xl mb-6" />
    <div class="space-y-4 text-[var(--text)]/90 leading-relaxed text-base font-light">
      ${b.content.map((p) => `<p>${p}</p>`).join("")}
    </div>
    <div class="mt-8 pt-5 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
      <span class="text-xs font-mono text-[var(--muted)]">Written by Akash Saini • BITS Pilani Alumnus</span>
      <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Namaste Akash! I read your article '" + b.title + "' on ladoorganics.in.")}" target="_blank" class="primary-btn px-5 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-2">
        <i class="fab fa-whatsapp text-[#25D366] text-base"></i> Discuss on WhatsApp
      </a>
    </div>
  `;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

window.closeBlogModal = function () {
  document.getElementById("blog-modal")?.classList.add("hidden");
  document.body.style.overflow = "";
};

/* Multi-Language Switcher (EN / हिंदी / मारवाड़ी) */
function setupLanguageToggle() {
  const toggle = document.getElementById("lang-toggle");
  if (!toggle) return;
  toggle.addEventListener("change", (e) => {
    const dict = TRANSLATIONS[e.target.value] || TRANSLATIONS.en;
    document.body.style.opacity = "0.65";
    setTimeout(() => {
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) el.textContent = dict[key];
      });
      document.body.style.opacity = "1";
      showToast(`✓ Language switched to ${e.target.options[e.target.selectedIndex].text}`);
    }, 160);
  });
}

/* Grounded AI Concierge (Bottom Right) */
function setupAIChat() {
  const trigger = document.getElementById("chat-trigger");
  const win = document.getElementById("ai-chat-window");
  const closeBtn = document.getElementById("close-chat");
  const form = document.getElementById("ai-chat-form");
  const input = document.getElementById("ai-chat-input");
  const messages = document.getElementById("ai-chat-messages");
  if (!trigger || !win || !closeBtn) return;

  trigger.addEventListener("click", () => {
    win.classList.toggle("chat-hidden");
    win.classList.toggle("chat-visible");
  });
  closeBtn.addEventListener("click", () => {
    win.classList.remove("chat-visible");
    win.classList.add("chat-hidden");
  });

  const replyFor = (q) => {
    const s = q.toLowerCase();
    if (s.includes("ghee") || s.includes("bilona") || s.includes("price")) {
      return "Our A2 Bilona Ghee is ₹5,000/Litre, hand-churned from indigenous Tharparkar cow curd (~30L milk per 1L ghee). Use the Order Calculator or click any WhatsApp button to order!";
    }
    if (s.includes("stay") || s.includes("bhunga") || s.includes("wifi") || s.includes("work")) {
      return "Our 'Deep Work' Bhunga Farm Stay is ₹4,000/Night in Pilani, Rajasthan (~4 hrs from Gurugram/NCR). Includes fiber Wi-Fi, climate-responsive mud house & A2 satvik meals.";
    }
    if (s.includes("founder") || s.includes("akash") || s.includes("bits")) {
      return "Lado Organics is founded by Akash Saini (Integrated M.Sc. Mathematics, BITS Pilani) to bring scientific transparency, zero-waste engineering, and fair income to 100+ Pilani farming families.";
    }
    if (s.includes("adopt") || s.includes("cow") || s.includes("calf") || s.includes("tara")) {
      return "You can sponsor our Tharparkar calves—Dholi Sheri, Tara, and Roshni! Sponsors fund fodder & veterinary care and receive monthly farm updates.";
    }
    return "Namaste! 🙏 For instant orders, bulk B2B inquiries, or farm stay dates, tap the green WhatsApp button on the bottom-left (+91 96361 00337).";
  };

  window.sendQuickQuestion = function (txt) {
    if (!input || !form) return;
    input.value = txt;
    form.dispatchEvent(new Event("submit"));
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    const u = document.createElement("div");
    u.className = "bg-[var(--terracotta)] text-white p-3 rounded-2xl rounded-tr-sm w-5/6 self-end text-xs";
    u.textContent = val;
    messages.appendChild(u);
    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
      const b = document.createElement("div");
      b.className = "bg-[var(--surface-solid)] text-[var(--text)] p-3 rounded-2xl rounded-tl-sm border border-[var(--border)] w-5/6 self-start text-xs leading-relaxed";
      b.textContent = replyFor(val);
      messages.appendChild(b);
      messages.scrollTop = messages.scrollHeight;
    }, 380);
  });
}

/* Lead Form -> Google Apps Script Webhook + WhatsApp Routing */
function setupWebhookRouting() {
  const form = document.getElementById("webhook-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fname = document.getElementById("lead-fname").value.trim();
    const lname = document.getElementById("lead-lname").value.trim();
    const email = document.getElementById("lead-email").value.trim();
    const interest = document.getElementById("lead-interest").value;

    // 1. Send silently to Google Apps Script Webhook
    fetch(GOOGLE_SHEETS_WEBHOOK, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        name: `[Lado Organics] ${fname} ${lname}`,
        email,
        message: `Interest: ${interest}`
      })
    }).catch(() => {});

    // 2. Open pre-filled WhatsApp confirmation
    const msg = `Namaste Lado Organics! 🙏\nNew Website Inquiry:\n• *Name:* ${fname} ${lname}\n• *Email:* ${email}\n• *Interest:* ${interest}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");

    showToast("✓ Inquiry logged & opened in WhatsApp!");
    form.reset();
  });
}

/* Ctrl+K Quick Command Palette (Inspired by Akash's Portfolio) */
const LADO_COMMANDS = [
  { label: "🛒 Jump to Circular Store (A2 Ghee, Dhoop, Khad)", run: () => document.getElementById("store")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "🧮 Open Instant Order & Bhunga Stay Calculator", run: () => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "🎓 Meet the Founder (Akash Saini • BITS Pilani)", run: () => document.getElementById("founder")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "🐄 Adopt a Tharparkar Calf (Dholi Sheri, Tara, Roshni)", run: () => document.getElementById("adopt")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "📖 Read The Pilani Journal (Blogs)", run: () => document.getElementById("journal")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "💬 Direct WhatsApp Order (+91 96361 00337)", run: () => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank") },
  { label: "🌓 Toggle Sand / Desert Dusk Theme", run: () => window.toggleTheme() }
];

window.toggleCommandPalette = function () {
  const box = document.getElementById("cmd-palette");
  if (!box) return;
  const open = !box.classList.contains("hidden");
  if (open) {
    box.classList.add("hidden");
  } else {
    box.classList.remove("hidden");
    const inp = document.getElementById("cmd-search");
    if (inp) { inp.value = ""; inp.focus(); }
    filterLadoCommands("");
  }
};

window.filterLadoCommands = function (q) {
  const list = document.getElementById("cmd-list");
  if (!list) return;
  const term = (q || "").toLowerCase();
  const hits = LADO_COMMANDS.filter((c) => c.label.toLowerCase().includes(term));
  list.innerHTML = hits
    .map(
      (c) => `<button type="button" onclick="toggleCommandPalette(); LADO_COMMANDS[${LADO_COMMANDS.indexOf(c)}].run();" class="w-full text-left px-4 py-2.5 rounded-xl bg-[var(--code-bg)] hover:border-[var(--terracotta)] border border-[var(--border)] text-xs font-mono text-[var(--text)] cursor-pointer transition">${c.label}</button>`
    )
    .join("");
};

function setupCommandPalette() {
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      window.toggleCommandPalette();
    } else if (e.key === "Escape") {
      document.getElementById("cmd-palette")?.classList.add("hidden");
      window.closeBlogModal();
    }
  });
}

function initScrollAnimations() {
  const reveals = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) en.target.classList.add("active");
      });
    },
    { threshold: 0.08 }
  );
  reveals.forEach((el) => obs.observe(el));
}
