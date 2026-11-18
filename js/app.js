document.addEventListener('DOMContentLoaded', () => {
    initEnterpriseApp();
});

async function initEnterpriseApp() {
    await renderCatalog();
    setupAIChat();
    setupWebhookRouting();
    setupLanguageToggle();
    initScrollAnimations();
}

async function renderCatalog() {
    const grid = document.getElementById('product-catalog-grid');
    if (!grid) return;

    try {
        const response = await fetch('./data/products.json').catch(() => null);
        let products = [];
        
        if (response && response.ok) {
            products = await response.json();
        } else {
            console.warn("Could not fetch products.json, check path or CORS.");
            return;
        }

        grid.innerHTML = products.map((product, index) => `
            <article class="bg-[var(--surface)] rounded-3xl shadow-md border border-[var(--border)] overflow-hidden group hover:shadow-2xl transition duration-500 flex flex-col reveal" style="transition-delay: ${index * 100}ms">
                <div class="h-64 bg-[var(--earth)]/5 flex items-center justify-center relative overflow-hidden border-b border-[var(--border)]">
                    <i class="fas ${product.icon} text-7xl text-[var(--mud)]/20 transform group-hover:scale-125 transition duration-700 ease-out"></i>
                    ${product.badge ? `<span class="absolute top-4 right-4 bg-[var(--terracotta)] text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full shadow-md">${product.badge}</span>` : ''}
                </div>
                <div class="p-8 flex flex-col flex-grow">
                    <h3 class="text-2xl font-serif font-bold text-[var(--mud)] mb-3">${product.name}</h3>
                    <p class="text-sm text-[var(--mud)]/70 mb-8 font-light flex-grow leading-relaxed">${product.desc}</p>
                    <div class="flex justify-between items-end mb-8">
                        <div>
                            <span class="block text-xs uppercase tracking-wider text-[var(--mud)]/50 mb-1">Per ${product.unit}</span>
                            <span class="text-3xl font-serif font-bold text-[var(--terracotta)]">₹${product.price}</span>
                        </div>
                    </div>
                    <button class="w-full primary-btn py-4 rounded-xl font-medium text-sm flex justify-center items-center gap-2">
                        ${product.cta}
                    </button>
                </div>
            </article>
        `).join('');
        
        initScrollAnimations();
    } catch (error) {
        grid.innerHTML = '<p class="text-[var(--terracotta)] col-span-full text-center p-8 bg-[var(--surface)] rounded-2xl">System update in progress. Please contact via WhatsApp to order.</p>';
    }
}

function setupAIChat() {
    const trigger = document.getElementById('chat-trigger');
    const window = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('close-chat');

    if (!trigger || !window || !closeBtn) return;

    trigger.addEventListener('click', () => {
        window.classList.remove('chat-hidden');
        window.classList.add('chat-visible');
    });
    
    closeBtn.addEventListener('click', () => {
        window.classList.remove('chat-visible');
        window.classList.add('chat-hidden');
    });
}

function setupWebhookRouting() {
    const form = document.getElementById('webhook-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Routing...';
        btn.disabled = true;
        
        try {
            await new Promise(r => setTimeout(r, 1500));
            
            btn.innerHTML = '<i class="fas fa-check"></i> Connected to Ecosystem';
            btn.classList.add('!bg-green-700');
            
            setTimeout(() => {
                form.reset();
                btn.innerHTML = originalText;
                btn.classList.remove('!bg-green-700');
                btn.disabled = false;
            }, 3000);
            
        } catch (error) {
            btn.innerHTML = 'Routing error. Try again.';
            btn.disabled = false;
        }
    });
}

function setupLanguageToggle() {
    const toggle = document.getElementById('lang-toggle');
    if (!toggle) return;

    toggle.addEventListener('change', (e) => {
        document.body.style.opacity = '0.7';
        setTimeout(() => document.body.style.opacity = '1', 300);
    });
}

function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    reveals.forEach(reveal => observer.observe(reveal));
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            reveal.classList.add("active");
        }
    });
}
