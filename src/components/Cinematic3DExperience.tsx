"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import type { ProductDTO } from "@/types/domain";
import CartCheckoutDrawer from "@/components/CartCheckoutDrawer";
import styles from "./Cinematic3DExperience.module.css";

type Vec3 = [number, number, number];
type RGB = [number, number, number];
type ProductKind = "ghee" | "milk" | "dhoop" | "soil" | "kesar" | "generic";

function productKind(slug: string): ProductKind {
  if (slug.includes("ghee")) return "ghee";
  if (slug.includes("milk")) return "milk";
  if (slug.includes("dhoop")) return "dhoop";
  if (slug.includes("khad") || slug.includes("compost")) return "soil";
  if (slug.includes("kesar")) return "kesar";
  return "generic";
}

function makeFarmScene(kind: ProductKind): Float32Array {
  const vertices: number[] = [];
  const triangle = (a: Vec3, b: Vec3, c: Vec3, color: RGB) => {
    const ab: Vec3 = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
    const ac: Vec3 = [c[0]-a[0], c[1]-a[1], c[2]-a[2]];
    const normal: Vec3 = [ab[1]*ac[2]-ab[2]*ac[1], ab[2]*ac[0]-ab[0]*ac[2], ab[0]*ac[1]-ab[1]*ac[0]];
    const length = Math.hypot(normal[0],normal[1],normal[2]) || 1;
    const n: Vec3 = [normal[0]/length,normal[1]/length,normal[2]/length];
    for (const p of [a,b,c]) vertices.push(p[0],p[1],p[2],n[0],n[1],n[2],color[0],color[1],color[2]);
  };
  const quad = (a:Vec3,b:Vec3,c:Vec3,d:Vec3,color:RGB) => { triangle(a,b,c,color); triangle(a,c,d,color); };
  const box = (x:number,y:number,z:number,w:number,h:number,d:number,color:RGB) => {
    const x0=x-w/2,x1=x+w/2,y0=y-h/2,y1=y+h/2,z0=z-d/2,z1=z+d/2;
    quad([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],color);
    quad([x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],color);
    quad([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],color);
    quad([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],color);
    quad([x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],color);
    quad([x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],color);
  };
  const sphere = (center:Vec3,scale:Vec3,color:RGB,segments=18,rings=12) => {
    for(let r=0;r<rings;r++) for(let s=0;s<segments;s++) {
      const p=(u:number,v:number):Vec3=>[
        center[0]+Math.cos(v)*Math.sin(u)*scale[0],
        center[1]+Math.cos(u)*scale[1],
        center[2]+Math.sin(v)*Math.sin(u)*scale[2]
      ];
      const u0=Math.PI*r/rings,u1=Math.PI*(r+1)/rings,v0=Math.PI*2*s/segments,v1=Math.PI*2*(s+1)/segments;
      const a=p(u0,v0),b=p(u0,v1),c=p(u1,v1),d=p(u1,v0);
      triangle(a,b,c,color); triangle(a,c,d,color);
    }
  };
  const cylinder = (start:Vec3,end:Vec3,radius:number,color:RGB,segments=12,radiusEnd=radius) => {
    const axis:Vec3=[end[0]-start[0],end[1]-start[1],end[2]-start[2]];
    const len=Math.hypot(...axis)||1, w:Vec3=[axis[0]/len,axis[1]/len,axis[2]/len];
    const helper:Vec3=Math.abs(w[1])>.92?[1,0,0]:[0,1,0];
    const u:Vec3=[w[1]*helper[2]-w[2]*helper[1],w[2]*helper[0]-w[0]*helper[2],w[0]*helper[1]-w[1]*helper[0]];
    const ul=Math.hypot(...u)||1;u[0]/=ul;u[1]/=ul;u[2]/=ul;
    const v:Vec3=[w[1]*u[2]-w[2]*u[1],w[2]*u[0]-w[0]*u[2],w[0]*u[1]-w[1]*u[0]];
    for(let i=0;i<segments;i++){
      const a=i/segments*Math.PI*2,b=(i+1)/segments*Math.PI*2;
      const point=(origin:Vec3,r:number,t:number):Vec3=>[origin[0]+r*(u[0]*Math.cos(t)+v[0]*Math.sin(t)),origin[1]+r*(u[1]*Math.cos(t)+v[1]*Math.sin(t)),origin[2]+r*(u[2]*Math.cos(t)+v[2]*Math.sin(t))];
      const p1=point(start,radius,a),p2=point(start,radius,b),p3=point(end,radiusEnd,b),p4=point(end,radiusEnd,a);
      triangle(p1,p2,p3,color);triangle(p1,p3,p4,color);
      triangle(start,p2,p1,color);triangle(end,p4,p3,color);
    }
  };
  const tree=(x:number,z:number,size:number) => {
    cylinder([x,.05,z],[x,.72*size,z],.075*size,[.24,.16,.10]);
    sphere([x,.98*size,z],[.48*size,.66*size,.46*size],[.20,.34,.22]);
    sphere([x-.2*size,1.18*size,z+.04],[.35*size,.43*size,.34*size],[.26,.41,.25]);
  };

  // Rolling Thar desert pasture, built as real low-poly 3D geometry.
  box(0,-.20,0,34,.38,28,[.20,.31,.19]);
  sphere([-8,-1.7,-8],[9,2.3,4.4],[.29,.39,.25],24,10);
  sphere([1,-1.9,-11],[12,2.1,4.5],[.34,.42,.27],24,10);
  sphere([10,-1.7,-7],[9,2.1,4],[.27,.37,.23],24,10);
  sphere([-3,-2.5,7],[13,2.4,5],[.22,.32,.19],24,10);
  sphere([-5,5,-13],[1.65,1.65,1.65],[.91,.68,.40],24,16);

  // Farmhouse and shaded courtyard.
  box(-4,.75,-3.7,3.5,1.7,2.7,[.62,.43,.29]);
  box(-4,1.72,-3.7,4.1,.20,3.2,[.31,.22,.15]);
  quad([-6.15,1.78,-5.35],[-1.85,1.78,-5.35],[-4,2.85,-3.7],[-4,2.85,-3.7],[.38,.25,.16]);
  quad([-1.85,1.78,-2.05],[-6.15,1.78,-2.05],[-4,2.85,-3.7],[-4,2.85,-3.7],[.45,.29,.18]);
  box(-4,.48,-2.32,.68,1.05,.06,[.20,.24,.18]);
  box(-5.05,.95,-2.30,.54,.42,.07,[.77,.64,.42]);
  box(-2.95,.95,-2.30,.54,.42,.07,[.77,.64,.42]);

  tree(-8,-3,1.2);tree(-7,1,.9);tree(5,-5,1.35);tree(8,-2,1.05);tree(7,3,.9);tree(-9,4,1.1);
  for(let i=0;i<18;i++){
    const x=-12+(i%6)*4.5,z=5+Math.floor(i/6)*2.2;
    cylinder([x,.02,z],[x,.35,z],.035,[.61,.49,.27],6);
  }

  // A stylised Tharparkar cow with hump, horns, ears and four legs.
  sphere([-1.4,.98,1.0],[1.15,.62,.55],[.83,.78,.64]);
  sphere([-1.25,1.47,.95],[.53,.36,.48],[.83,.78,.64]);
  sphere([-2.22,1.23,1.0],[.38,.38,.36],[.78,.73,.61]);
  sphere([-2.42,1.02,.78],[.26,.18,.24],[.53,.31,.25]);
  sphere([-2.43,1.02,1.20],[.26,.18,.24],[.53,.31,.25]);
  sphere([-2.50,1.28,1.18],[.055,.06,.05],[.08,.08,.07],10,8);
  sphere([-2.50,1.28,.82],[.055,.06,.05],[.08,.08,.07],10,8);
  sphere([-1.20,1.57,.83],[.65,.35,.48],[.78,.72,.58]);
  cylinder([-2.1,1.47,.68],[-2.35,1.84,.62],.055,[.84,.78,.62],10,.015);
  cylinder([-1.8,1.5,1.25],[-1.92,1.88,1.31],.055,[.84,.78,.62],10,.015);
  for(const x of [-2.05,-.9]) for(const z of [.66,1.31]) cylinder([x,.68,z],[x,.08,z],.105,[.70,.65,.55],10,.075);
  cylinder([-.35,1.14,1.15],[.02,.76,1.28],.045,[.68,.61,.50],10,.02);
  sphere([-.02,.72,1.28],[.12,.13,.12],[.18,.15,.12],10,8);
  // Bell and collar.
  cylinder([-2.0,1.02,.98],[-1.72,.88,.98],.035,[.72,.48,.17],10,.035);
  sphere([-1.72,.85,.98],[.09,.12,.09],[.83,.65,.31],10,8);

  // A low circular display plinth and the selected product.
  cylinder([3,.04,1.3],[3,.38,1.3],1.55,[.19,.24,.19],48);
  cylinder([3,.37,1.3],[3,.48,1.3],1.40,[.69,.53,.31],48);
  cylinder([3,.48,1.3],[3,.56,1.3],1.32,[.30,.38,.28],48);
  const productColor:RGB = kind==="ghee"?[.76,.49,.20]:kind==="milk"?[.82,.85,.78]:kind==="dhoop"?[.30,.20,.13]:kind==="soil"?[.39,.28,.19]:kind==="kesar"?[.57,.22,.13]:[.70,.61,.42];
  if(kind==="dhoop"){
    cylinder([3,.58,1.3],[3,1.55,1.3],.40,productColor,28,.07);
  } else if(kind==="soil"){
    cylinder([3,.58,1.3],[3,1.72,1.3],.62,productColor,32,.48);
    cylinder([3,1.69,1.3],[3,1.78,1.3],.50,[.27,.36,.23],32,.50);
  } else {
    const r=kind==="kesar"?.28:.47;
    cylinder([3,.58,1.3],[3,1.45,1.3],r,productColor,32,r*.94);
    cylinder([3,1.45,1.3],[3,1.68,1.3],r*.58,productColor,32,r*.58);
    cylinder([3,1.68,1.3],[3,1.83,1.3],r*.62,[.22,.29,.20],28,r*.62);
    cylinder([3,.78,1.3+r*.96],[3,1.18,1.3+r*.96],.018,[.84,.72,.48],8);
  }
  return new Float32Array(vertices);
}

function perspective(fov:number,aspect:number,near:number,far:number):Float32Array {
  const f=1/Math.tan(fov/2),nf=1/(near-far);
  return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);
}
function lookAt(eye:Vec3,center:Vec3,up:Vec3):Float32Array {
  let z:Vec3=[eye[0]-center[0],eye[1]-center[1],eye[2]-center[2]];
  let l=Math.hypot(...z)||1;z=[z[0]/l,z[1]/l,z[2]/l];
  let x:Vec3=[up[1]*z[2]-up[2]*z[1],up[2]*z[0]-up[0]*z[2],up[0]*z[1]-up[1]*z[0]];
  l=Math.hypot(...x)||1;x=[x[0]/l,x[1]/l,x[2]/l];
  const y:Vec3=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];
  return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]),-(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]),-(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]),1]);
}
function multiply(a:Float32Array,b:Float32Array):Float32Array {
  const out=new Float32Array(16);
  for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)out[c*4+r]+=a[k*4+r]*b[c*4+k];
  return out;
}

function FarmCanvas({ kind }: { kind: ProductKind }) {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const [fallback,setFallback]=useState(false);
  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    const gl=canvas.getContext("webgl",{alpha:false,antialias:true,powerPreference:"low-power"});
    if(!gl){setFallback(true);return;}
    const compile=(type:number,source:string)=>{
      const shader=gl.createShader(type);if(!shader)return null;
      gl.shaderSource(shader,source);gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}
      return shader;
    };
    const vs=compile(gl.VERTEX_SHADER,"attribute vec3 aPosition;attribute vec3 aNormal;attribute vec3 aColor;uniform mat4 uMvp;varying vec3 vNormal;varying vec3 vColor;varying float vDepth;void main(){vec4 p=uMvp*vec4(aPosition,1.0);gl_Position=p;vNormal=aNormal;vColor=aColor;vDepth=clamp((p.z/p.w+1.0)*0.5,0.0,1.0);}");
    const fs=compile(gl.FRAGMENT_SHADER,"precision mediump float;varying vec3 vNormal;varying vec3 vColor;varying float vDepth;void main(){vec3 n=normalize(vNormal);vec3 light=normalize(vec3(-0.45,0.85,0.35));float diffuse=max(dot(n,light),0.0);float hemi=0.48+0.36*diffuse;vec3 color=vColor*hemi;vec3 fog=vec3(0.13,0.19,0.16);color=mix(color,fog,smoothstep(0.42,1.0,vDepth)*0.42);gl_FragColor=vec4(color,1.0);}");
    if(!vs||!fs){setFallback(true);return;}
    const program=gl.createProgram();if(!program){setFallback(true);return;}
    gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){setFallback(true);return;}
    gl.useProgram(program);
    const data=makeFarmScene(kind),buffer=gl.createBuffer();if(!buffer){setFallback(true);return;}
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
    const stride=36;
    for(const [name,size,offset] of [["aPosition",3,0],["aNormal",3,12],["aColor",3,24]] as const){
      const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,stride,offset);
    }
    const uniform=gl.getUniformLocation(program,"uMvp");
    gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame=0,yaw=0,targetYaw=0,dragging=false,lastX=0,visible=true;
    const resize=()=>{
      const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.5);
      const w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    };
    const pointerDown=(e:PointerEvent)=>{dragging=true;lastX=e.clientX;canvas.setPointerCapture?.(e.pointerId);};
    const pointerMove=(e:PointerEvent)=>{if(!dragging)return;targetYaw=Math.max(-.8,Math.min(.8,targetYaw+(e.clientX-lastX)*.004));lastX=e.clientX;};
    const pointerUp=()=>{dragging=false;};
    canvas.addEventListener("pointerdown",pointerDown);canvas.addEventListener("pointermove",pointerMove);canvas.addEventListener("pointerup",pointerUp);canvas.addEventListener("pointercancel",pointerUp);
    const observer="IntersectionObserver" in window?new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;if(visible&&!frame)frame=requestAnimationFrame(draw);else if(!visible&&frame){cancelAnimationFrame(frame);frame=0;}},{threshold:.02}):null;
    observer?.observe(canvas);
    const draw=(time:number)=>{
      frame=0;if(!visible)return;
      resize();
      if(!reduced&&!dragging)targetYaw=Math.sin(time*.00009)*.22;
      yaw+=(targetYaw-yaw)*.035;
      const radius=12.5,eye:Vec3=[Math.sin(yaw)*radius,4.0,Math.cos(yaw)*radius];
      const view=lookAt(eye,[0,1.0,0],[0,1,0]);
      const projection=perspective(Math.PI/3.2,canvas.width/canvas.height,.1,80);
      gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(.13,.19,.16,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(uniform,false,multiply(projection,view));gl.drawArrays(gl.TRIANGLES,0,data.length/9);
      if(!reduced)frame=requestAnimationFrame(draw);
    };
    frame=requestAnimationFrame(draw);
    const onResize=()=>resize();window.addEventListener("resize",onResize);
    return()=>{
      if(frame)cancelAnimationFrame(frame);observer?.disconnect();window.removeEventListener("resize",onResize);
      canvas.removeEventListener("pointerdown",pointerDown);canvas.removeEventListener("pointermove",pointerMove);canvas.removeEventListener("pointerup",pointerUp);canvas.removeEventListener("pointercancel",pointerUp);
      gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
    };
  },[kind]);
  return <div className={styles.canvasFrame}>
    {!fallback?<canvas ref={canvasRef} className={styles.canvas} aria-label="Interactive three-dimensional Lado farm landscape. Drag to look around." />:<div className={styles.sceneFallback} aria-label="Lado farm landscape visual fallback"><span className={styles.fallbackSun}/><span className={styles.fallbackHills}/><span className={styles.fallbackFarm}/></div>}
    <div className={styles.sceneCaption}><span>28.3670° N · PILANI, RAJASTHAN</span><span>DRAG TO EXPLORE</span></div>
  </div>;
}

export default function Cinematic3DExperience() {
  const {locale}=useLocale();
  const {addToCart,itemCount,setDrawerOpen}=useCart();
  const [products,setProducts]=useState<ProductDTO[]>([]);
  const [catalogState,setCatalogState]=useState<"loading"|"ready"|"error">("loading");
  const [selectedSlug,setSelectedSlug]=useState("");
  const [menuOpen,setMenuOpen]=useState(false);
  const selectedProduct=useMemo(()=>products.find(p=>p.slug===selectedSlug)||products[0]||null,[products,selectedSlug]);
  const selectedKind=productKind(selectedProduct?.slug||"");

  useEffect(()=>{
    let active=true;
    fetch("/api/catalog",{cache:"no-store"}).then(r=>r.ok?r.json():Promise.reject(new Error("Catalogue unavailable"))).then(data=>{
      if(!active)return;
      if(Array.isArray(data?.catalog)){setProducts(data.catalog);setSelectedSlug(data.catalog[0]?.slug||"");setCatalogState("ready");}
      else setCatalogState("error");
    }).catch(()=>{if(active)setCatalogState("error");});
    return()=>{active=false;};
  },[]);

  const productName=(product:ProductDTO)=>locale==="hi"?(product.nameHi||product.nameEn):locale==="ma"?(product.nameMa||product.nameEn):product.nameEn;
  const addSelected=()=>{
    if(!selectedProduct)return;
    const variant=selectedProduct.variants.find(v=>v.isDefault)||selectedProduct.variants[0];
    if(!variant||variant.stockQty<1)return;
    addToCart({variantId:variant.id,sku:variant.sku,title:productName(selectedProduct),priceInr:Number(variant.priceInr),quantity:1,maxStock:Math.max(1,variant.stockQty)});
  };

  return <div className={styles.experience}>
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="Lado Organics classic website"><Image src="/images/lado-organics/Ladologo.png" alt="Lado Organics — Lado Love Pure" width={150} height={84} priority /></Link>
      <button type="button" className={styles.menuButton} onClick={()=>setMenuOpen(v=>!v)} aria-expanded={menuOpen} aria-controls="lado-3d-navigation">{menuOpen?"Close":"Explore"}</button>
      <nav id="lado-3d-navigation" className={menuOpen?styles.nav+" "+styles.navOpen:styles.nav} aria-label="3D experience navigation">
        <Link href="#world" onClick={()=>setMenuOpen(false)}>The world</Link><Link href="#collection" onClick={()=>setMenuOpen(false)}>Collection</Link><Link href="/our-story" onClick={()=>setMenuOpen(false)}>Our story</Link><Link href="/trace" onClick={()=>setMenuOpen(false)}>Trace a batch</Link>
      </nav>
      <div className={styles.headerActions}><button type="button" className={styles.bagButton} onClick={()=>setDrawerOpen(true)}>Bag <span>{itemCount}</span></button><Link href="/" className={styles.modeSwitch}>Classic site <span>↗</span></Link></div>
    </header>

    <main>
      <section id="world" className={styles.hero}>
        <FarmCanvas kind={selectedKind}/>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>A LIVING LANDSCAPE · PILANI, RAJASTHAN</p>
          <h1>Come closer<br/><em>to the source.</em></h1>
          <p className={styles.intro}>Step into the world of Lado Organics. Explore the farm, discover our collection and experience the care behind every choice.</p>
          <div className={styles.heroActions}><a href="#collection" className={styles.primaryButton}>Explore the collection <span>↓</span></a><Link href="/" className={styles.textButton}>Return to classic website ↗</Link></div>
        </div>
        <div className={styles.heroFoot}><span>01 / THE LADO WORLD</span><span>AN INTERACTIVE FARM EXPERIENCE</span></div>
        <div className={styles.verticalNote}>ROOTED IN TRADITION · CLOSE TO NATURE</div>
      </section>

      <section id="collection" className={styles.collection}>
        <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>THE LADO COLLECTION</p><h2>Made with care.<br/><em>Chosen with meaning.</em></h2></div><p>Explore products currently listed in our live catalogue. Product details, available pack sizes and prices are kept in sync with the Lado store.</p></div>
        {catalogState==="loading"?<p className={styles.state}>Loading the live collection…</p>:catalogState==="error"?<p className={styles.state}>The live collection is temporarily unavailable. Please visit the <Link href="/store">classic store</Link> or try again shortly.</p>:products.length===0?<p className={styles.state}>There are no products available to display right now.</p>:<>
          <div className={styles.productRail} role="list" aria-label="Live Lado Organics products">
            {products.map(product=>{
              const active=selectedProduct?.slug===product.slug;
              const variant=product.variants.find(v=>v.isDefault)||product.variants[0];
              return <button key={product.id} type="button" role="listitem" className={active?styles.productCard+" "+styles.productActive:styles.productCard} onClick={()=>setSelectedSlug(product.slug)} aria-pressed={active}>
                <span className={styles.productImage} style={product.imageUrl?{backgroundImage:"url("+JSON.stringify(product.imageUrl)+")"}:undefined}><span className={styles.productOrb}/></span>
                <span className={styles.productInfo}><strong>{productName(product)}</strong><small>{variant?"From ₹"+Number(variant.priceInr).toLocaleString("en-IN"):"Price to be confirmed"}</small></span>
                <span className={styles.productSelect}>{active?"Selected":"View in 3D"} ↗</span>
              </button>;
            })}
          </div>
          {selectedProduct&&<div className={styles.selectedProduct}>
            <div><p className={styles.eyebrow}>CURRENTLY EXPLORING</p><h3>{productName(selectedProduct)}</h3><p>{selectedProduct.descriptionEn}</p></div>
            <div className={styles.selectedActions}><button type="button" className={styles.primaryButton} onClick={addSelected} disabled={!selectedProduct.variants.some(v=>v.stockQty>0)}>Add to bag <span>＋</span></button><Link href={"/store/"+selectedProduct.slug} className={styles.textButton}>Product details ↗</Link></div>
          </div>}
        </>}
      </section>

      <section className={styles.storyBand}>
        <div><p className={styles.eyebrow}>LADO LOVE PURE</p><h2>Tradition lives<br/><em>in every detail.</em></h2></div>
        <p>From the land around Pilani to the products in your home, discover the story behind Lado Organics at your own pace.</p>
        <Link href="/our-story" className={styles.storyLink}>Discover our story <span>↗</span></Link>
      </section>
    </main>

    <footer className={styles.footer}><Link href="/" aria-label="Back to classic Lado Organics website"><Image src="/images/lado-organics/Ladologo.png" alt="Lado Organics" width={130} height={74}/></Link><span>© {new Date().getFullYear()} Lado Organics · Pilani, Rajasthan</span><Link href="/">Switch to classic website ↗</Link></footer>
    <CartCheckoutDrawer/>
  </div>;
}
