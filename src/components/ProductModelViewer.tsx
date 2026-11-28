"use client";

import React, { useEffect, useRef, useState } from "react";

type Kind = "milk" | "ghee" | "dhoop" | "soil" | "kesar" | "farm";
type V = [number, number, number];
type Profile = [number, number];

function meshFor(kind: Kind): Float32Array {
  const out: number[] = [];
  const push = (a: V, b: V, c: V, color: V) => {
    const ab: V = [b[0]-a[0],b[1]-a[1],b[2]-a[2]], ac: V = [c[0]-a[0],c[1]-a[1],c[2]-a[2]];
    const n: V = [ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]];
    const l = Math.hypot(...n) || 1, normal: V = [n[0]/l,n[1]/l,n[2]/l];
    for (const p of [a,b,c]) out.push(...p,...normal,...color);
  };
  const lathe = (profile: Profile[], color: V, segments=40) => {
    for(let j=0;j<profile.length-1;j++) for(let i=0;i<segments;i++) {
      const a=i/segments*Math.PI*2,b=(i+1)/segments*Math.PI*2,[r0,y0]=profile[j],[r1,y1]=profile[j+1];
      const p=(r:number,y:number,t:number):V=>[Math.cos(t)*r,y,Math.sin(t)*r];
      const p1=p(r0,y0,a),p2=p(r0,y0,b),p3=p(r1,y1,b),p4=p(r1,y1,a);
      push(p1,p2,p3,color); push(p1,p3,p4,color);
    }
  };
  const band = (y:number,r:number,h:number,color:V) => lathe([[r,y],[r,y+h]],color);
  if(kind==="milk") {
    lathe([[0,-1.05],[.48,-1.05],[.55,-.82],[.55,.48],[.42,.68],[.27,.78],[.27,1.02],[.31,1.06]], [.82,.85,.76]);
    band(.78,.285,.12,[.72,.58,.32]); band(-.62,.554,.035,[.72,.58,.32]);
  } else if(kind==="ghee") {
    lathe([[0,-.94],[.56,-.94],[.62,-.76],[.62,.62],[.54,.78],[.48,.82],[.48,.96],[.52,1.0]], [.78,.61,.30]);
    band(.72,.625,.075,[.78,.69,.48]); band(-.18,.626,.24,[.92,.82,.58]); band(.97,.53,.12,[.25,.34,.23]);
  } else if(kind==="kesar") {
    lathe([[0,-1.05],[.28,-1.05],[.31,-.9],[.31,.72],[.24,.82],[.16,.88],[.16,1.08],[.19,1.1]], [.60,.25,.18]);
    band(.87,.17,.17,[.78,.65,.38]); band(-.8,.315,.045,[.82,.64,.28]);
  } else if(kind==="dhoop") {
    lathe([[0,-1.0],[.44,-1.0],[.42,-.88],[.31,-.42],[.19,.05],[.08,.5],[.015,.78]], [.28,.19,.12],36);
    band(-.98,.45,.09,[.66,.48,.27]);
  } else if(kind==="soil") {
    lathe([[0,-.92],[.62,-.92],[.66,-.75],[.57,.72],[.5,.84],[.04,.84],[0,.84]], [.43,.30,.20],36);
    band(.5,.56,.13,[.27,.36,.23]); band(-.82,.64,.08,[.68,.51,.31]);
  } else {
    lathe([[0,-.9],[.48,-.9],[.55,-.72],[.52,.4],[.32,.72],[.12,.9],[.02,.94]], [.74,.65,.46]);
    band(.62,.35,.12,[.27,.36,.23]);
  }
  return new Float32Array(out);
}

function kindFromSlug(slug: string): Kind {
  if(slug.includes("milk")) return "milk";
  if(slug.includes("ghee")) return "ghee";
  if(slug.includes("dhoop")) return "dhoop";
  if(slug.includes("khad") || slug.includes("compost")) return "soil";
  if(slug.includes("kesar")) return "kesar";
  return "farm";
}

export default function ProductModelViewer({ slug, name }: { slug: string; name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open,setOpen] = useState(false);
  useEffect(() => {
    if(!open) return;
    const canvas=canvasRef.current, gl=canvas?.getContext("webgl",{alpha:true,antialias:true});
    if(!canvas || !gl) return;
    const compile=(type:number,src:string) => {
      const shader=gl.createShader(type); if(!shader) return null;
      gl.shaderSource(shader,src); gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}
      return shader;
    };
    const vs=compile(gl.VERTEX_SHADER,`attribute vec3 p;attribute vec3 n;attribute vec3 c;uniform mat4 m;varying vec3 col;varying float lit;void main(){gl_Position=m*vec4(p,1.);col=c;lit=.62+.42*abs(dot(normalize(n),normalize(vec3(-.4,.8,.5))));}`);
    const fs=compile(gl.FRAGMENT_SHADER,`precision mediump float;varying vec3 col;varying float lit;void main(){gl_FragColor=vec4(col*lit,1.);}`);
    if(!vs||!fs) return;
    const program=gl.createProgram(); if(!program)return;
    gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
    gl.useProgram(program);
    const data=meshFor(kindFromSlug(slug)),buffer=gl.createBuffer(); if(!buffer)return;
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
    const stride=36;
    for(const [key,size,offset] of [["p",3,0],["n",3,12],["c",3,24]] as const){
      const loc=gl.getAttribLocation(program,key);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,stride,offset);
    }
    const loc=gl.getUniformLocation(program,"m");
    gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
    let frame=0,drag=0,target=0,down=0;
    const pointer=(e:PointerEvent)=>{if(e.type==="pointerdown")down=e.clientX;else if(e.type==="pointerup")target+=(e.clientX-down)*.012;};
    canvas.addEventListener("pointerdown",pointer);canvas.addEventListener("pointerup",pointer);
    const draw=(time:number)=>{
      frame=requestAnimationFrame(draw);
      drag+=(target-drag)*.08;
      const a=time*.00045+drag,c=Math.cos(a),s=Math.sin(a),scale=1.05;
      const m=new Float32Array([c*scale,0,-s*scale,0,0,scale,0,0,s*scale,0,c*scale,0,0,0,-3.1,1]);
      gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      const aspect=canvas.width/canvas.height,f=1/Math.tan(Math.PI/7),proj=new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,-1.02,-1,0,0,-.202,0]);
      const result=new Float32Array(16);
      for(let col=0;col<4;col++)for(let row=0;row<4;row++)for(let k=0;k<4;k++)result[col*4+row]+=proj[k*4+row]*m[col*4+k];
      gl.uniformMatrix4fv(loc,false,result);gl.drawArrays(gl.TRIANGLES,0,data.length/9);
    };
    frame=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(frame);canvas.removeEventListener("pointerdown",pointer);canvas.removeEventListener("pointerup",pointer);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);};
  },[open,slug]);
  return <div className="mt-3">
    <button type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-2 text-[10px] font-bold uppercase tracking-[.14em] hover:border-[var(--terracotta)]">
      <span aria-hidden="true">◈</span>{open?"Close 3D view":"Explore 3D model"}
    </button>
    {open && <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-[radial-gradient(ellipse_at_50%_35%,#fffdf7,#e9e1d0)]">
      <canvas ref={canvasRef} width={520} height={360} aria-label={`Rotating 3D concept model of ${name}`} className="block h-56 w-full touch-pan-y" />
      <p className="px-3 pb-3 text-center text-[9px] font-semibold uppercase tracking-[.16em] text-[var(--muted)]">Interactive concept model · drag to rotate</p>
    </div>}
  </div>;
}
