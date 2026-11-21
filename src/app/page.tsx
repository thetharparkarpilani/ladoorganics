"use client";

import React, { useState } from "react";

export default function LadoOrganicsPremiumHome() {
  const [lang, setLang] = useState("en");

  return (
    <div className="min-h-screen organic-gradient font-sans">
      
      {/* PREMIUM NAVIGATION */}
      <header className="glass-nav-premium sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="#" className="text-2xl md:text-3xl font-serif font-bold tracking-widest text-[var(--accent-forest)] flex items-center gap-2">
            LADO <span className="font-light text-[var(--accent-terracotta)]">ORGANICS</span>
          </a>
          
          <div className="hidden lg:flex space-x-10 text-xs font-bold tracking-[0.15em] text-[var(--text-mud)] uppercase">
            <a href="#store" className="hover:text-[var(--accent-forest)] transition-colors">The Store</a>
            <a href="#blueprint" className="hover:text-[var(--accent-forest)] transition-colors">Our Farm</a>
            <a href="#adopt" className="hover:text-[var(--accent-forest)] transition-colors">Gau Seva</a>
            <a href="#journal" className="hover:text-[var(--accent-forest)] transition-colors">Journal</a>
          </div>

          <div className="flex items-center gap-4">
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="appearance-none bg-transparent border border-[var(--border-light)] text-[var(--text-mud)] text-xs font-bold py-1.5 px-3 rounded-full cursor-pointer focus:outline-none focus:border-[var(--accent-forest)]"
            >
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="ma">मारवाड़ी</option>
            </select>
            <a href="#store" className="btn-forest px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hidden sm:block">
              Shop Now
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION: Editorial & Grounded */}
        <section className="relative pt-24 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[var(--accent-forest)] bg-[var(--accent-forest)]/5 border border-[var(--accent-forest)]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-terracotta)]"></span>
              Direct from Pilani, Rajasthan • 100% Pure Tharparkar
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.1] mb-6 text-[var(--text-charcoal)]">
              Spiritual Heritage, <br/>
              <span className="text-[var(--accent-terracotta)] italic font-light">Consciously Crafted.</span>
            </h1>
            
            <p className="text-lg text-[var(--text-muted)] mb-10 leading-relaxed font-light max-w-2xl mx-auto">
              Rooted in the &quot;Cow as a Coconut&quot; zero-waste philosophy. Empowering local farming families with verifiable A2 Bilona Ghee, pure botanicals, and Deep Work Bhunga Stays.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
              <a href="#store" className="btn-forest px-8 py-4 rounded-full font-bold text-sm tracking-wide shadow-lg">
                Explore The Collection
              </a>
              <a href="#blueprint" className="btn-outline px-8 py-4 rounded-full font-bold text-sm tracking-wide">
                Discover Our Ecosystem
              </a>
            </div>
          </div>

          {/* Premium Video/Image Placeholder */}
          <div className="max-w-5xl mx-auto w-full relative rounded-t-[3rem] overflow-hidden shadow-2xl border-t-8 border-x-8 border-[var(--bg-ivory)]">
            <div className="aspect-[21/9] w-full bg-[#204E36] relative flex items-center justify-center group cursor-pointer overflow-hidden">
              {/* Replace this div with an actual image tag in production */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-700"></div>
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10 border border-white/30 group-hover:scale-110 transition-transform duration-500">
                <span className="ml-2 text-3xl">▶</span>
              </div>
              <div className="absolute bottom-8 left-8 text-left z-10">
                <h3 className="text-white font-serif text-3xl mb-2">The Zero-Waste Ecosystem</h3>
                <p className="text-white/80 text-sm tracking-widest uppercase font-bold">Watch The Documentary</p>
              </div>
            </div>
          </div>
        </section>

        {/* 01. THE CIRCULAR STORE */}
        <section id="store" className="py-24 bg-[var(--bg-ivory)] px-4 sm:px-6 lg:px-8 border-y border-[var(--border-light)]">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.2em] text-[var(--accent-earth)] mb-4 uppercase block">01. The Circular Store</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[var(--text-charcoal)]">Ethical & Unadulterated</h2>
            </header>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Product 1 */}
              <article className="card-earthy overflow-hidden flex flex-col group">
                <div className="aspect-[4/3] bg-[var(--bg-sand)] p-8 flex items-center justify-center relative">
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-[var(--accent-forest)] shadow-sm">Farm Direct</div>
                  <div className="w-32 h-32 bg-[var(--accent-earth)]/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                    <span className="text-5xl">🏺</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-serif font-bold text-[var(--text-charcoal)] mb-3">A2 Bilona Ghee</h3>
                  <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed flex-grow">Hand-churned from indigenous Tharparkar cow curd using the traditional Vedic Bilona method.</p>
                  <div className="flex items-center justify-between pt-6 border-t border-[var(--border-light)]">
                    <span className="text-xl font-serif font-bold text-[var(--accent-terracotta)]">₹5,000 <span className="text-xs text-[var(--text-muted)] font-sans">/ 1L</span></span>
                    <button className="text-xs font-bold uppercase tracking-widest text-[var(--accent-forest)] hover:underline">Add to Bag</button>
                  </div>
                </div>
              </article>

              {/* Product 2 */}
              <article className="card-earthy overflow-hidden flex flex-col group">
                <div className="aspect-[4/3] bg-[var(--bg-sand)] p-8 flex items-center justify-center relative">
                  <div className="w-32 h-32 bg-[var(--accent-terracotta)]/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                    <span className="text-5xl">🌿</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-serif font-bold text-[var(--text-charcoal)] mb-3">Tharparkar Dhoop</h3>
                  <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed flex-grow">Crafted from indigenous cow dung and natural botanical binders for spiritual purification.</p>
                  <div className="flex items-center justify-between pt-6 border-t border-[var(--border-light)]">
                    <span className="text-xl font-serif font-bold text-[var(--accent-terracotta)]">₹1,000 <span className="text-xs text-[var(--text-muted)] font-sans">/ Box</span></span>
                    <button className="text-xs font-bold uppercase tracking-widest text-[var(--accent-forest)] hover:underline">Add to Bag</button>
                  </div>
                </div>
              </article>

              {/* Product 3 */}
              <article className="card-earthy overflow-hidden flex flex-col group">
                <div className="aspect-[4/3] bg-[var(--bg-sand)] p-8 flex items-center justify-center relative">
                  <div className="w-32 h-32 bg-[var(--accent-forest)]/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                    <span className="text-5xl">🌱</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-serif font-bold text-[var(--text-charcoal)] mb-3">Pure Kechua Khad</h3>
                  <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed flex-grow">Vermicompost enriched with biogas slurry for home, terrace, and organic gardens.</p>
                  <div className="flex items-center justify-between pt-6 border-t border-[var(--border-light)]">
                    <span className="text-xl font-serif font-bold text-[var(--accent-terracotta)]">₹2,000 <span className="text-xs text-[var(--text-muted)] font-sans">/ 5kg</span></span>
                    <button className="text-xs font-bold uppercase tracking-widest text-[var(--accent-forest)] hover:underline">Add to Bag</button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* 02. ADOPT A COW */}
        <section id="adopt" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] bg-[var(--accent-forest)] relative">
              {/* Asset Placeholder */}
              <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')]"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white/50 font-serif text-2xl px-12 text-center">
                [ Beautiful imagery of Dholi Sheri, Tara, and Roshni ]
              </div>
            </div>
            
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-[var(--accent-terracotta)] mb-4 uppercase block">02. Gaushala Community</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-[var(--text-charcoal)] leading-tight">Adopt a <br/>Tharparkar Calf.</h2>
              <p className="text-[var(--text-muted)] font-light mb-10 text-lg leading-relaxed">
                Join our inner circle. Digitally sponsor our indigenous calves—<span className="font-medium text-[var(--text-charcoal)]">Dholi Sheri, Tara, and Roshni</span>—to directly fund organic fodder and veterinary care at the Gaushala. 
              </p>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-ivory)] border border-[var(--border-light)] flex items-center justify-center text-[var(--accent-terracotta)] text-lg shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-[var(--text-charcoal)] text-lg mb-1">Direct Impact</h4>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">100% of sponsorship proceeds go directly to sustaining the herd and local farmers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-ivory)] border border-[var(--border-light)] flex items-center justify-center text-[var(--accent-forest)] text-lg shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-[var(--text-charcoal)] text-lg mb-1">Farm Privileges</h4>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">Receive exclusive monthly updates and complimentary stays at our mud-house Bhunga farm.</p>
                  </div>
                </div>
              </div>
              
              <a href="#contact" className="btn-forest px-10 py-4 rounded-full font-bold shadow-xl inline-block">
                Sponsor a Calf Today
              </a>
            </div>
          </div>
        </section>

        {/* 03. THE BLUEPRINT (Cow as a Coconut) */}
        <section id="blueprint" className="py-24 bg-[#2D241E] text-[#FDF9F5] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-xs font-bold tracking-[0.2em] text-[var(--accent-earth)] mb-4 uppercase block">03. Zero-Waste Philosophy</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold">The Cow as a Coconut</h2>
              <p className="mt-6 text-[#FDF9F5]/70 max-w-2xl mx-auto font-light leading-relaxed text-lg">
                Like the coconut tree where every part is utilized, our farm operates on an ancient circular model. Absolutely nothing goes to waste.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-white/5 p-10 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-16 h-16 bg-[var(--accent-terracotta)] rounded-full flex items-center justify-center text-2xl mb-8 font-serif">I</div>
                <h3 className="text-2xl font-serif font-bold mb-4">Nourishment</h3>
                <p className="text-white/60 font-light text-base leading-relaxed">Our Tharparkar cows produce ethical A2 milk, hand-churned into premium Bilona Ghee for your family&apos;s health.</p>
              </div>
              
              <div className="bg-white/5 p-10 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-16 h-16 bg-[var(--accent-earth)] text-[#2D241E] rounded-full flex items-center justify-center text-2xl mb-8 font-serif">II</div>
                <h3 className="text-2xl font-serif font-bold mb-4">Energy & Soil</h3>
                <p className="text-white/60 font-light text-base leading-relaxed">Manure fuels our biogas plant to power the farm. The resulting slurry feeds earthworms, creating Pure Kechua Khad.</p>
              </div>
              
              <div className="bg-white/5 p-10 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-16 h-16 bg-[var(--bg-sand)] text-[#2D241E] rounded-full flex items-center justify-center text-2xl mb-8 font-serif">III</div>
                <h3 className="text-2xl font-serif font-bold mb-4">Spirituality</h3>
                <p className="text-white/60 font-light text-base leading-relaxed">Any remaining dung is blended with botanical herbs and temple florals to craft chemical-free Tharparkar Dhoop.</p>
              </div>
            </div>

            <div className="mt-20 pt-10 border-t border-white/10 flex flex-wrap justify-center gap-8">
              <span className="text-sm font-bold tracking-widest uppercase text-white/50">ZED Bronze Certified</span>
              <span className="text-sm font-bold tracking-widest uppercase text-white/50">MSME: UDYAM-RJ-21-0104324</span>
            </div>
          </div>
        </section>

        {/* 04. CONTACT / LEAD FORM */}
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[var(--border-light)]">
          <div className="max-w-5xl mx-auto card-earthy overflow-hidden flex flex-col md:flex-row shadow-xl">
            <div className="md:w-5/12 bg-[var(--accent-forest)] p-12 text-white flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6">Connect to the Source</h2>
                <p className="text-white/80 font-light leading-relaxed mb-8">
                  Whether you want to place a B2B bulk order, schedule a Bhunga farm stay, or sponsor a calf, your details route directly to our secure internal network.
                </p>
              </div>
              <div className="text-sm text-white/60 font-mono">
                <p className="mb-2">📍 Pilani, Rajasthan</p>
                <p>✉️ thetharparkarpilani@gmail.com</p>
              </div>
            </div>
            
            <div className="md:w-7/12 p-10 lg:p-14 bg-[var(--bg-ivory)]">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block">First Name</label>
                    <input type="text" className="w-full p-4 rounded-xl bg-[var(--bg-sand)] border border-[var(--border-light)] focus:outline-none focus:border-[var(--accent-forest)] transition" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Last Name</label>
                    <input type="text" className="w-full p-4 rounded-xl bg-[var(--bg-sand)] border border-[var(--border-light)] focus:outline-none focus:border-[var(--accent-forest)] transition" required />
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Email Address</label>
                  <input type="email" className="w-full p-4 rounded-xl bg-[var(--bg-sand)] border border-[var(--border-light)] focus:outline-none focus:border-[var(--accent-forest)] transition" required />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block">I am interested in...</label>
                  <select className="w-full p-4 rounded-xl bg-[var(--bg-sand)] border border-[var(--border-light)] focus:outline-none focus:border-[var(--accent-forest)] transition text-[var(--text-charcoal)]">
                    <option>A2 Bilona Ghee Order</option>
                    <option>Adopt-a-Cow Sponsorship</option>
                    <option>Bhunga Farm Stay Booking</option>
                    <option>B2B Wholesale</option>
                  </select>
                </div>
                
                <button type="submit" className="w-full btn-forest py-4 rounded-xl font-bold text-sm tracking-widest uppercase mt-4">
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>
      
      <footer className="bg-[var(--bg-ivory)] py-10 border-t border-[var(--border-light)] text-center text-[var(--text-muted)] text-xs font-bold tracking-widest uppercase">
        <p>© 2026 Lado Organics. Based in Pilani, Rajasthan. All Rights Reserved.</p>
      </footer>

    </div>
  );
}
