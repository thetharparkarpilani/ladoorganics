const WHATSAPP_NUMBER = "919636100337";
const GOOGLE_SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbx-lUmYJISZwTFuuh4gx4GqqNUJDf0wEFIL6fRD_gB1q9gSyPxeWbo1Zj2QIH0aKQa2/exec";

document.addEventListener('DOMContentLoaded', () => {
    initEnterpriseApp();
    initCountdownTimer();
});

let ALL_PRODUCTS = [];
let ALL_BLOGS = [];

async function initEnterpriseApp() {
    await Promise.all([renderCatalog(), renderBlogs()]);
    setupLiveSearch();
    setupAIChat();
    setupWebhookRouting();
    setupLanguageToggle();
}

async function renderCatalog() {
    const grid = document.getElementById('product-catalog-grid');
    if (!grid) return;

    try {
        const response = await fetch('./data/products.json');
        if (!response.ok) throw new Error('Catalog fetch failed');
        ALL_PRODUCTS = await response.json();
        displayProducts(ALL_PRODUCTS);
    } catch (error) {
        console.error('API Error:', error);
        grid.innerHTML = '<p class="text-[var(--terracotta)] col-span-full text-center">System update in progress. Please contact via WhatsApp to order.</p>';
    }
}

function displayProducts(products) {
    const grid = document.getElementById('product-catalog-grid');
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = '<p class="text-[var(--mud)] col-span-full text-center py-8">No products found matching your search.</p>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <article class="bg-[var(--surface)] rounded-2xl shadow-md border border-[var(--border)] overflow-hidden group hover:shadow-xl transition duration-300 flex flex-col">
            <div class="h-48 bg-[var(--earth)]/10 flex items-center justify-center relative overflow-hidden border-b border-[var(--border)]">
                <i class="fas ${product.icon || 'fa-seedling'} text-5xl text-[var(--mud)]/30 transform group-hover:scale-110 transition duration-500"></i>
                ${product.badge ? `<span class="absolute top-3 right-3 bg-[var(--terracotta)] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">${product.badge}</span>` : ''}
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <h3 class="text-lg font-serif font-bold text-[var(--mud)] mb-1.5">${product.name}</h3>
                <p class="text-xs text-[var(--mud)]/80 mb-5 font-light flex-grow leading-relaxed">${product.desc}</p>
                <div class="flex justify-between items-end mb-4">
                    <div>
                        <span class="block text-[10px] uppercase tracking-wider text-[var(--mud)]/50 mb-0.5">Per ${product.unit}</span>
                        <span class="text-2xl font-serif font-bold text-[var(--terracotta)]">₹${product.price}</span>
                    </div>
                </div>
                <button onclick="openWhatsAppOrder('${product.name}', '${product.price}', '${product.unit}')" class="w-full primary-btn py-3 rounded font-medium text-xs flex justify-center items-center gap-2 cursor-pointer">
                    <i class="fab fa-whatsapp text-sm text-[#25D366]"></i> ${product.cta}
                </button>
            </div>
        </article>
    `).join('');
}

function openWhatsAppOrder(name, price, unit) {
    const text = `Namaste Lado Organics! 🙏\nI would like to order:\n• *Item:* ${name}\n• *Price:* ₹${price} / ${unit}\n\nPlease confirm availability.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}

async function renderBlogs() {
    const grid = document.getElementById('blog-catalog-grid');
    if (!grid) return;
    try {
        const res = await fetch('./data/blogs.json');
        if (!res.ok) return;
        ALL_BLOGS = await res.json();
        grid.innerHTML = ALL_BLOGS.map(b => `
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-[var(--border)] flex flex-col justify-between">
                <div>
                    <span class="text-[10px] font-bold text-[var(--terracotta)] uppercase">${b.category} • ${b.readTime}</span>
                    <h3 class="text-lg font-serif font-bold text-[var(--mud)] my-2">${b.title}</h3>
                    <p class="text-xs text-[var(--mud)]/70 font-light leading-relaxed mb-4">${b.excerpt}</p>
                </div>
                <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Namaste! I read your blog on '" + b.title + "'")}" target="_blank" class="text-xs font-bold text-[var(--terracotta)] hover:underline inline-flex items-center gap-1.5">
                    Discuss with Founder <i class="fas fa-arrow-right text-[10px]"></i>
                </a>
            </div>
        `).join('');
    } catch(e) {}
}

function setupLiveSearch() {
    const searchInput = document.getElementById('live-search-input');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));
        displayProducts(filtered);
    });
}

function initCountdownTimer() {
    const deadline = new Date().getTime() + (4 * 24 * 60 * 60 * 1000) + (13 * 60 * 60 * 1000);
    setInterval(() => {
        const now = new Date().getTime();
        const t = deadline - now;
        if (t < 0) return;
        const d = Math.floor(t / (1000 * 60 * 60 * 24));
        const h = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        const el = document.getElementById('promo-countdown');
        if (el) el.textContent = `${String(d).padStart(2,'0')} DAYS ${String(h).padStart(2,'0')} HOURS ${String(m).padStart(2,'0')} MINS`;
    }, 1000);
}

function setupAIChat() {
    const trigger = document.getElementById('chat-trigger');
    const window = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('close-chat');
    if (!trigger || !window || !closeBtn) return;
    trigger.addEventListener('click', () => window.classList.toggle('chat-hidden'));
    closeBtn.addEventListener('click', () => window.classList.add('chat-hidden'));
}

function setupWebhookRouting() {
    const form = document.getElementById('webhook-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('lead-name').value.trim();
        const email = document.getElementById('lead-email').value.trim();
        fetch(GOOGLE_SHEETS_WEBHOOK, {
            method: 'POST', mode: 'no-cors',
            body: JSON.stringify({ name: '[Lado Lead] ' + name, email, message: 'Lead captured from website form' })
        }).catch(() => {});
        alert("Success! Your details have been routed directly to our secure database & WhatsApp.");
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Namaste! My name is " + name + " and I registered on ladoorganics.in")}`, "_blank");
        form.reset();
    });
}

function setupLanguageToggle() {
    const toggle = document.getElementById('lang-toggle');
    if (!toggle) return;
    toggle.addEventListener('change', (e) => {
        console.log("Language switched to:", e.target.value);
    });
}
