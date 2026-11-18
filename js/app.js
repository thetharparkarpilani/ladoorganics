const WHATSAPP_NUMBER = "919636100337";

const TRANSLATIONS = {
  en: {
    nav_store: "THE STORE",
    nav_adopt: "ADOPT-A-COW",
    nav_blueprint: "BLUEPRINT",
    nav_journal: "JOURNAL",
    hero_badge: "DIRECT FROM PILANI • 100% PURE THARPARKAR TRADITION",
    hero_title_1: "Spiritual Heritage,",
    hero_title_2: "Consciously Crafted.",
    hero_sub: "Rooted in the 'Cow as a Coconut' zero-waste Hindu philosophy. Empowering 100+ Pilani farming families while delivering unadulterated A2 wellness directly to you.",
    hero_cta_shop: "Shop The Collection",
    hero_cta_story: "Watch Build in Public",
    store_tag: "THE CIRCULAR STORE",
    store_title: "Ethical & Unadulterated",
    store_sub: "Click any product to place an instant direct-from-farm order on WhatsApp.",
    adopt_tag: "COMMUNITY INITIATIVE",
    adopt_title: "Adopt a Tharparkar Calf",
    adopt_desc: "Digitally sponsor our indigenous calves—Dholi Sheri, Tara, and Roshni—to directly fund fodder, shelter, and veterinary care at our Pilani Gaushala.",
    adopt_cta: "Sponsor a Calf on WhatsApp",
    blueprint_tag: "ZERO-WASTE PHILOSOPHY",
    blueprint_title: "The Cow as a Coconut",
    blueprint_sub: "Like the sacred coconut tree where every part serves life, our Pilani ecosystem operates on a closed-loop circular cycle.",
    journal_tag: "THE PILANI JOURNAL",
    journal_title: "Wisdom, Soil & Science",
    contact_title: "Connect to the Source",
    contact_sub: "Bulk B2B A2 Ghee orders, Bhunga farm stays, or Gaushala sponsorships—reach our Pilani team directly.",
    contact_submit: "Save & Send Inquiry"
  },
  hi: {
    nav_store: "उत्पाद भंडार",
    nav_adopt: "गौ सेवा",
    nav_blueprint: "शून्य-अपशिष्ट मॉडल",
    nav_journal: "ब्लॉग और ज्ञान",
    hero_badge: "सीधे पिलानी से • 100% शुद्ध थारपारकर परंपरा",
    hero_title_1: "आध्यात्मिक विरासत,",
    hero_title_2: "शुद्धता के साथ निर्मित।",
    hero_sub: "'गाय एक कल्पवृक्ष (नारियल)' के शून्य-अपशिष्ट सिद्धांत पर आधारित। पिलानी के 100+ किसान परिवारों को सशक्त बनाते हुए शुद्ध A2 उत्पाद सीधे आपके घर तक।",
    hero_cta_shop: "उत्पाद देखें",
    hero_cta_story: "हमारी यात्रा देखें",
    store_tag: "सर्कुलर स्टोर",
    store_title: "शुद्ध और नैतिक उत्पाद",
    store_sub: "सीधे व्हाट्सएप पर ऑर्डर करने के लिए किसी भी उत्पाद पर क्लिक करें।",
    adopt_tag: "सामुदायिक पहल",
    adopt_title: "थारपारकर बछड़ा गोद लें",
    adopt_desc: "हमारी देसी बछियों—धोली शेरी, तारा और रोशनी—के चारे और देखभाल के लिए डिजिटल रूप से सहयोग करें।",
    adopt_cta: "व्हाट्सएप पर सहयोग करें",
    blueprint_tag: "शून्य-अपशिष्ट दर्शन",
    blueprint_title: "गाय: एक संपूर्ण पारिस्थितिकी तंत्र",
    blueprint_sub: "नारियल के पेड़ की तरह जिसका हर हिस्सा उपयोगी है, हमारी गौशाला में कुछ भी व्यर्थ नहीं जाता।",
    journal_tag: "पिलानी जर्नल",
    journal_title: "आयुर्वेद, मिट्टी और विज्ञान",
    contact_title: "सीधे फार्म से जुड़ें",
    contact_sub: "थोक A2 घी ऑर्डर, भुंगा फार्म स्टे या गौशाला सहयोग के लिए संपर्क करें।",
    contact_submit: "जानकारी भेजें"
  },
  ma: {
    nav_store: "हाट बाजार",
    nav_adopt: "गऊ सेवा",
    nav_blueprint: "आपणो सिद्धांत",
    nav_journal: "बातां और ज्ञान",
    hero_badge: "सीधो पिलानी सूं • 100% चोखो थारपारकर",
    hero_title_1: "पुरखां री विरासत,",
    hero_title_2: "चोखाई सूं बण्योड़ी।",
    hero_sub: "'गाय नारियल ज्यूं गुणकारी' — पिलानी रा 100+ किसान परिवारों रे साथे मिलर, बिना मिलावट रो शुद्ध A2 घी और देसी उत्पाद सीधो आपरे आंगणे।",
    hero_cta_shop: "सामान देखो",
    hero_cta_story: "आपणो काम देखो",
    store_tag: "देसी हाट",
    store_title: "असली और चोखो माल",
    store_sub: "सीधो व्हाट्सएप माथे ऑर्डर करण खातिर नीचे बटन दबाओ।",
    adopt_tag: "गऊ वंश सेवा",
    adopt_title: "थारपारकर बाछड़ी गोद ल्यो",
    adopt_desc: "आपणी देसी बाछड़ियां—धोली शेरी, तारा और रोशनी—री सेवा और चारा-पाणी में सहयोग करो।",
    adopt_cta: "व्हाट्सएप माथे जुड़ो",
    blueprint_tag: "जीरो-वेस्ट खेती",
    blueprint_title: "गाय: हर चीज़ काम री",
    blueprint_sub: "ज्यूं नारियल रो हर हिस्सो काम आवे, बियां ही आपणी गौशाला में गोबर सूं गैस, खाद और धूप बणे है।",
    journal_tag: "पिलानी री बातां",
    journal_title: "देसी ज्ञान और खेती",
    contact_title: "सीधो संपर्क करो",
    contact_sub: "थोक घी, भुंगा फार्म स्टे या गऊ सेवा खातिर अठे लिखो।",
    contact_submit: "संदेश भेजो"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initEnterpriseApp();
});

async function initEnterpriseApp() {
  await Promise.all([renderCatalog(), renderBlogs()]);
  setupAIChat();
  setupWebhookRouting();
  setupLanguageToggle();
  initScrollAnimations();
}

function openWhatsAppOrder(productName, price, unit) {
  const text = `Namaste Lado Organics! 🙏\nI would like to order:\n• *Item:* ${productName}\n• *Price:* ₹${price} / ${unit}\n\nPlease share availability and payment details.`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

async function renderCatalog() {
  const grid = document.getElementById("product-catalog-grid");
  if (!grid) return;

  try {
    const response = await fetch("./data/products.json");
    if (!response.ok) throw new Error("Failed to load products");
    const products = await response.json();

    grid.innerHTML = products
      .map(
        (product, index) => `
      <article class="bg-[var(--surface)] rounded-3xl shadow-md border border-[var(--border)] overflow-hidden group hover:shadow-2xl transition duration-500 flex flex-col reveal" style="transition-delay: ${index * 100}ms">
        <div class="h-60 bg-[var(--earth)]/10 relative overflow-hidden border-b border-[var(--border)]">
          <img src="${product.image}" onerror="this.onerror=null;this.src='${product.fallbackImage}';" alt="${product.name}" class="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" />
          ${product.badge ? `<span class="absolute top-4 right-4 bg-[var(--terracotta)] text-white text-[10px] uppercase font-bold tracking-widest px-3.5 py-1.5 rounded-full shadow-md">${product.badge}</span>` : ""}
        </div>
        <div class="p-7 flex flex-col flex-grow">
          <h3 class="text-2xl font-serif font-bold text-[var(--mud)] mb-2">${product.name}</h3>
          <p class="text-sm text-[var(--mud)]/75 mb-6 font-light flex-grow leading-relaxed">${product.desc}</p>
          <div class="flex justify-between items-end mb-6 pt-4 border-t border-[var(--border)]">
            <div>
              <span class="block text-[11px] uppercase tracking-wider text-[var(--mud)]/50 mb-0.5">Per ${product.unit}</span>
              <span class="text-3xl font-serif font-bold text-[var(--terracotta)]">₹${product.price}</span>
            </div>
            <span class="text-xs text-green-700 font-medium bg-green-50 px-2.5 py-1 rounded-full border border-green-200">In Stock</span>
          </div>
          <button onclick='openWhatsAppOrder(${JSON.stringify(product.name)}, ${JSON.stringify(product.price)}, ${JSON.stringify(product.unit)})' class="w-full primary-btn py-3.5 rounded-xl font-semibold text-sm flex justify-center items-center gap-2 cursor-pointer">
            <i class="fab fa-whatsapp text-lg text-[#25D366]"></i> ${product.cta}
          </button>
        </div>
      </article>
    `
      )
      .join("");
  } catch (error) {
    grid.innerHTML = `<p class="col-span-full text-center text-[var(--terracotta)] p-8">Unable to load catalog. Please message us directly on WhatsApp (+91 96361 00337).</p>`;
  }
}

let loadedBlogs = [];

async function renderBlogs() {
  const grid = document.getElementById("blog-catalog-grid");
  if (!grid) return;

  try {
    const response = await fetch("./data/blogs.json");
    if (!response.ok) throw new Error("Failed to load blogs");
    loadedBlogs = await response.json();

    grid.innerHTML = loadedBlogs
      .map(
        (blog, index) => `
      <article class="bg-[var(--surface)] rounded-3xl shadow-md border border-[var(--border)] overflow-hidden flex flex-col group hover:shadow-xl transition duration-500 reveal" style="transition-delay: ${index * 100}ms">
        <div class="h-52 overflow-hidden relative">
          <img src="${blog.image}" alt="${blog.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
          <span class="absolute top-4 left-4 bg-white/90 backdrop-blur text-[var(--mud)] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">${blog.category}</span>
        </div>
        <div class="p-7 flex flex-col flex-grow">
          <div class="flex items-center gap-3 text-xs text-[var(--mud)]/50 mb-3">
            <span>${blog.date}</span> • <span>${blog.readTime}</span>
          </div>
          <h3 class="text-xl font-serif font-bold text-[var(--mud)] mb-3 group-hover:text-[var(--terracotta)] transition-colors">${blog.title}</h3>
          <p class="text-sm text-[var(--mud)]/75 font-light leading-relaxed mb-6 flex-grow">${blog.excerpt}</p>
          <button onclick="openBlogModal('${blog.id}')" class="text-left text-sm font-bold text-[var(--terracotta)] hover:text-[var(--mud)] transition-colors inline-flex items-center gap-2 cursor-pointer">
            Read Full Article <i class="fas fa-arrow-right text-xs"></i>
          </button>
        </div>
      </article>
    `
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}

window.openBlogModal = function (blogId) {
  const blog = loadedBlogs.find((b) => b.id === blogId);
  const modal = document.getElementById("blog-modal");
  const body = document.getElementById("blog-modal-body");
  if (!blog || !modal || !body) return;

  body.innerHTML = `
    <span class="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">${blog.category} • ${blog.readTime}</span>
    <h2 class="text-3xl md:text-4xl font-serif font-bold text-[var(--mud)] mt-2 mb-6 leading-tight">${blog.title}</h2>
    <img src="${blog.image}" alt="${blog.title}" class="w-full h-64 md:h-80 object-cover rounded-2xl mb-8" />
    <div class="space-y-5 text-[var(--mud)]/85 leading-relaxed text-base md:text-lg font-light">
      ${blog.content.map((p) => `<p>${p}</p>`).join("")}
    </div>
    <div class="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm font-medium text-[var(--mud)]">Want to experience this firsthand in Pilani?</p>
      <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Namaste! I just read your article on '" + blog.title + "' and would love to know more.")}" target="_blank" class="primary-btn px-6 py-3 rounded-full text-sm font-bold inline-flex items-center gap-2">
        <i class="fab fa-whatsapp text-[#25D366]"></i> Chat With Founder
      </a>
    </div>
  `;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

window.closeBlogModal = function () {
  const modal = document.getElementById("blog-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
};

function setupLanguageToggle() {
  const toggle = document.getElementById("lang-toggle");
  if (!toggle) return;

  toggle.addEventListener("change", (e) => {
    const lang = e.target.value;
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

    document.body.style.opacity = "0.65";
    setTimeout(() => {
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) {
          el.textContent = dict[key];
        }
      });
      document.body.style.opacity = "1";
    }, 180);
  });
}

function setupAIChat() {
  const trigger = document.getElementById("chat-trigger");
  const chatWindow = document.getElementById("ai-chat-window");
  const closeBtn = document.getElementById("close-chat");
  const form = document.getElementById("ai-chat-form");
  const input = document.getElementById("ai-chat-input");
  const messages = document.getElementById("ai-chat-messages");

  if (!trigger || !chatWindow || !closeBtn) return;

  trigger.addEventListener("click", () => {
    chatWindow.classList.toggle("chat-hidden");
    chatWindow.classList.toggle("chat-visible");
  });

  closeBtn.addEventListener("click", () => {
    chatWindow.classList.remove("chat-visible");
    chatWindow.classList.add("chat-hidden");
  });

  const getBotReply = (q) => {
    const query = q.toLowerCase();
    if (query.includes("ghee") || query.includes("price") || query.includes("a2")) {
      return "Our A2 Bilona Ghee is ₹5,000/Litre, hand-churned from curd of indigenous Tharparkar cows in Pilani (~28–30L milk per litre of ghee). Would you like to order via WhatsApp?";
    }
    if (query.includes("stay") || query.includes("bhunga") || query.includes("wifi") || query.includes("pilani")) {
      return "Our 'Deep Work' Bhunga Farm Stay is ₹4,000/night in Pilani, Rajasthan. It features climate-responsive mud architecture, high-speed internet, and pure A2 satvik meals.";
    }
    if (query.includes("adopt") || query.includes("cow") || query.includes("calf") || query.includes("tara")) {
      return "You can digitally sponsor our Tharparkar calves—Dholi Sheri, Tara, and Roshni! Sponsors receive monthly video updates and complimentary farm stay perks.";
    }
    if (query.includes("dhoop") || query.includes("khad") || query.includes("compost")) {
      return "Tharparkar Dhoop is ₹1,000/box (zero charcoal, pure cow dung & herbs) and Pure Kechua Khad vermicompost is ₹2,000 per 5kg bag.";
    }
    if (query.includes("zed") || query.includes("msme") || query.includes("certificate")) {
      return "Lado Organics is MSME registered (UDYAM-RJ-21-0104324) and ZED Bronze Certified under our zero-waste 'Cow as a Coconut' model.";
    }
    return "Thank you for asking! For live batch availability, custom orders, or farm bookings, click the green WhatsApp button on the bottom-left to chat directly with our Pilani team (+91 96361 00337).";
  };

  window.sendQuickQuestion = function (text) {
    if (!input || !form) return;
    input.value = text;
    form.dispatchEvent(new Event("submit"));
  };

  if (form && input && messages) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const userText = input.value.trim();
      if (!userText) return;

      const userBubble = document.createElement("div");
      userBubble.className = "bg-[var(--terracotta)] text-white p-3.5 rounded-2xl rounded-tr-sm shadow-sm w-5/6 self-end";
      userBubble.textContent = userText;
      messages.appendChild(userBubble);
      input.value = "";
      messages.scrollTop = messages.scrollHeight;

      setTimeout(() => {
        const botBubble = document.createElement("div");
        botBubble.className = "bg-white p-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-[var(--border)] w-5/6 self-start";
        botBubble.textContent = getBotReply(userText);
        messages.appendChild(botBubble);
        messages.scrollTop = messages.scrollHeight;
      }, 450);
    });
  }
}

function setupWebhookRouting() {
  const form = document.getElementById("webhook-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const firstName = document.getElementById("lead-fname").value.trim();
    const lastName = document.getElementById("lead-lname").value.trim();
    const email = document.getElementById("lead-email").value.trim();
    const interest = document.getElementById("lead-interest").value;

    // Save locally in browser CRM storage
    const existingLeads = JSON.parse(localStorage.getItem("lado_leads") || "[]");
    existingLeads.push({ firstName, lastName, email, interest, date: new Date().toISOString() });
    localStorage.setItem("lado_leads", JSON.stringify(existingLeads));

    // Also route directly to WhatsApp so no lead is ever lost without Google Apps Script
    const waMsg = `Namaste Lado Organics! 🙏\nNew Website Inquiry:\n• *Name:* ${firstName} ${lastName}\n• *Email:* ${email}\n• *Interest:* ${interest}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`, "_blank", "noopener,noreferrer");

    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Saved & Routed to WhatsApp';
    btn.classList.add("!bg-green-700");
    form.reset();

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.classList.remove("!bg-green-700");
    }, 3500);
  });
}

function initScrollAnimations() {
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("active");
      });
    },
    { threshold: 0.08 }
  );
  reveals.forEach((el) => observer.observe(el));
}
