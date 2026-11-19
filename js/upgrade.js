/* Lado Organics upgrade interactions. This is a WhatsApp-assisted storefront, not a payment gateway. */
(() => {
  "use strict";
  const WA = "919636100337";
  const money = n => "₹" + Number(n || 0).toLocaleString("en-IN");
  const $ = id => document.getElementById(id);
  const safeRead = key => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch (_) { return []; } };
  let cart = safeRead("lado_cart_v2");
  let wishlist = safeRead("lado_wishlist_v2");
  let gheeSize = 1000;
  const prices = { "A2 Bilona Ghee 250 ml":1350, "A2 Bilona Ghee 500 ml":2600, "A2 Bilona Ghee 1 litre":5000, "Tharparkar Dhoop":1000, "Pure Kechua Khad 5 kg":2000 };
  const wa = message => window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
  const persist = () => { localStorage.setItem("lado_cart_v2", JSON.stringify(cart)); localStorage.setItem("lado_wishlist_v2", JSON.stringify(wishlist)); renderCart(); renderWishlist(); };
  const toast = msg => { if (typeof window.showToast === "function") window.showToast(msg); else alert(msg); };
  const add = (name, price, qty=1) => { const found=cart.find(x=>x.name===name); if(found) found.qty+=qty; else cart.push({name,price,qty}); persist(); toast(name+" added to your bag"); };
  function renderCart(){
    $("lo-cart-count").textContent=cart.reduce((n,x)=>n+x.qty,0);
    const box=$("lo-cart-items"); if(!box)return;
    if(!cart.length){box.innerHTML='<p class="lo-empty">Your bag is empty. Add a product to begin.</p>';$("lo-cart-total").textContent="";return;}
    box.innerHTML=cart.map((x,i)=>`<div class="lo-cart-line"><span>${x.name}<br><small>${money(x.price)} × ${x.qty}</small></span><span>${money(x.price*x.qty)} <button data-cart-remove="${i}" aria-label="Remove item">Remove</button></span></div>`).join("");
    $("lo-cart-total").textContent="Estimated total: "+money(cart.reduce((n,x)=>n+x.price*x.qty,0));
  }
  function renderWishlist(){
    $("lo-wishlist-count").textContent=wishlist.length;
    const box=$("lo-wishlist-items"); if(!box)return;
    box.innerHTML=wishlist.length?wishlist.map((x,i)=>`<div class="lo-cart-line"><span>${x.name}<br><small>${money(x.price)}</small></span><span><button data-wish-add="${i}">Add to bag</button> <button data-wish-remove="${i}">Remove</button></span></div>`).join(""):'<p class="lo-empty">No saved products yet.</p>';
  }
  function open(id){$(id).hidden=false;document.body.style.overflow="hidden";}
  function close(id){$(id).hidden=true;document.body.style.overflow="";}
  document.querySelectorAll("[data-lo-close]").forEach(b=>b.addEventListener("click",()=>close(b.dataset.loClose)));
  ["lo-cart-overlay","lo-wishlist-overlay","lo-lab-modal"].forEach(id=>$(id)?.addEventListener("click",e=>{if(e.target.id===id)close(id);}));
  $("lo-cart-open").addEventListener("click",()=>open("lo-cart-overlay"));
  $("lo-wishlist-open").addEventListener("click",()=>open("lo-wishlist-overlay"));
  $("lo-account").addEventListener("click",()=>wa("Namaste Lado Organics. I would like help with my customer account / order history."));
  $("lo-cart-items").addEventListener("click",e=>{const i=e.target.dataset.cartRemove;if(i!==undefined){cart.splice(Number(i),1);persist();}});
  $("lo-wishlist-items").addEventListener("click",e=>{const a=e.target.dataset.wishAdd,r=e.target.dataset.wishRemove;if(a!==undefined){const x=wishlist[Number(a)];add(x.name,x.price); } if(r!==undefined){wishlist.splice(Number(r),1);persist();}});
  $("lo-cart-checkout").addEventListener("click",()=>{if(!cart.length){toast("Your bag is empty.");return;}const lines=cart.map(x=>`• ${x.name} × ${x.qty} = ${money(x.price*x.qty)}`);const total=cart.reduce((n,x)=>n+x.price*x.qty,0);wa("Namaste Lado Organics! I would like to enquire about this bag:\n"+lines.join("\n")+"\nEstimated total: "+money(total)+"\nPlease confirm availability, shipping and final amount.");});
  document.querySelectorAll("[data-ghee-size]").forEach(b=>b.addEventListener("click",()=>{gheeSize=Number(b.dataset.gheeSize);document.querySelectorAll("[data-ghee-size]").forEach(x=>x.classList.toggle("active",x===b));}));
  $("lo-add-ghee").addEventListener("click",()=>{const label=gheeSize===250?"250 ml":gheeSize===500?"500 ml":"1 litre";const name="A2 Bilona Ghee "+label;add(name,prices[name]);if($("lo-subscribe").checked)wa("Namaste! Please set up a monthly repeat-order enquiry for "+label+" A2 Bilona Ghee. I understand this is not an automatic payment subscription and will confirm dates and payment with your team.");});
  $("lo-starter-combo").addEventListener("click",()=>wa("Namaste Lado Organics! I am interested in the Pilani Wellness Starter Box: 500 ml A2 Bilona Ghee + 1 Dhoop box + 5 kg Kechua Khad. The combined listed prices total ₹5,600. Please confirm availability and whether a current combo offer is available."));
  $("lo-trace-request").addEventListener("click",()=>wa("Namaste! Please share the current A2 Bilona Ghee batch number, production date and available traceability documents."));
  $("lo-lab-open").addEventListener("click",()=>open("lo-lab-modal"));
  $("lo-lab-request").addEventListener("click",()=>wa("Namaste! Please share the latest available batch lab report / purity and fatty-acid profile document for A2 Bilona Ghee." ));
  $("lo-sponsor").addEventListener("click",()=>wa("Namaste! I would like to sponsor care for Dholi Sheri, Tara or Roshni. Please share sponsorship options and how fodder, shelter and veterinary allocations are reported."));
  $("lo-book-stay").addEventListener("click",()=>wa("Namaste! I would like to enquire about a Deep Work Bhunga Farm Stay. Please share availability, rates, facilities and booking terms."));
  $("lo-workshop").addEventListener("click",()=>wa("Namaste! I am interested in a Bilona churning / biogas workshop during a Pilani farm visit. Please share upcoming dates and details."));
  $("lo-consult").addEventListener("click",()=>wa("Namaste! I would like to discuss biogas and zero-waste gaushala consulting. Please contact me with details."));
  $("lo-waitlist").addEventListener("click",()=>wa("Namaste! Please add my interest in future Panchagavya / Havan cups / herbal cow-dung soap launches. Kindly let me know when products are officially available."));
  $("lo-enquiry-form").addEventListener("submit",e=>{e.preventDefault();const name=$("lo-name").value.trim(),phone=$("lo-phone").value.trim(),topic=$("lo-topic").value,msg=$("lo-message").value.trim();if(!name||!phone){toast("Please enter your name and phone number.");return;}wa(`Namaste Lado Organics!\nName: ${name}\nPhone: ${phone}\nEnquiry: ${topic}\nMessage: ${msg||"Please contact me with details."}`);});
  const search=$("lo-product-search");
  search.addEventListener("input",()=>{const q=search.value.trim().toLowerCase();document.querySelectorAll("#product-catalog-grid article").forEach(card=>{card.hidden=!!q&&!card.textContent.toLowerCase().includes(q);});document.querySelectorAll("#lo-commerce .lo-panel").forEach(card=>{card.hidden=!!q&&!card.textContent.toLowerCase().includes(q);});});
  // Add wishlist controls to existing product cards after the original catalogue renders.
  const attachWishlist=()=>{document.querySelectorAll("#product-catalog-grid article").forEach(card=>{if(card.dataset.loEnhanced)return;card.dataset.loEnhanced="1";const title=card.querySelector("h3")?.textContent?.trim()||"Lado Organics product";const priceText=card.querySelector(".text-2xl")?.textContent||"0";const price=Number(priceText.replace(/[^\d]/g,""))||0;const target=card.querySelector(".p-6");const addBtn=document.createElement("button");addBtn.type="button";addBtn.className="lo-primary";addBtn.textContent="Add to bag";addBtn.style.marginTop="8px";addBtn.addEventListener("click",()=>add(title,price));const btn=document.createElement("button");btn.type="button";btn.className="lo-outline";btn.textContent="♡ Save to wishlist";btn.style.marginTop="8px";btn.addEventListener("click",()=>{if(!wishlist.some(x=>x.name===title)){wishlist.push({name:title,price});persist();toast("Saved to wishlist");}else toast("Already in your wishlist");});target?.appendChild(addBtn);target?.appendChild(btn);});};
  const catalog=$("product-catalog-grid");if(catalog){new MutationObserver(attachWishlist).observe(catalog,{childList:true,subtree:true});attachWishlist();}
  persist();
})();
