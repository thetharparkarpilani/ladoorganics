"use client";

import { useEffect, useRef } from "react";

type V3 = [number, number, number];
type Color = [number, number, number];
type Vertex = { p: V3; n: V3; c: Color };

function normalize(v: V3): V3 {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}
function cross(a: V3, b: V3): V3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function subtract(a: V3, b: V3): V3 { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }

function createSceneVertices(): Float32Array {
  const vertices: Vertex[] = [];
  const tri = (a: V3, b: V3, c: V3, color: Color, normals?: [V3,V3,V3]) => {
    const normal = normalize(cross(subtract(b, a), subtract(c, a)));
    [a,b,c].forEach((p,i) => vertices.push({ p, n: normals?.[i] ?? normal, c: color }));
  };
  const quad = (a: V3,b: V3,c: V3,d: V3,color: Color) => { tri(a,b,c,color); tri(a,c,d,color); };
  const box = (center: V3, size: V3, color: Color) => {
    const [x,y,z]=center,[w,h,d]=size, x0=x-w/2,x1=x+w/2,y0=y-h/2,y1=y+h/2,z0=z-d/2,z1=z+d/2;
    quad([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],color);
    quad([x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],color);
    quad([x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],color);
    quad([x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],color);
    quad([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],color);
    quad([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],color);
  };
  const sphere = (center: V3, scale: V3, color: Color, segments=18, rings=12) => {
    for(let y=0;y<rings;y++) for(let x=0;x<segments;x++) {
      const point=(u:number,v:number):V3=>{
        const theta=u*Math.PI*2, phi=v*Math.PI;
        return [center[0]+Math.cos(theta)*Math.sin(phi)*scale[0],center[1]+Math.cos(phi)*scale[1],center[2]+Math.sin(theta)*Math.sin(phi)*scale[2]];
      };
      const u0=x/segments,u1=(x+1)/segments,v0=y/rings,v1=(y+1)/rings;
      const a=point(u0,v0),b=point(u1,v0),c=point(u1,v1),d=point(u0,v1);
      const norm=(p:V3):V3=>normalize([(p[0]-center[0])/(scale[0]*scale[0]),(p[1]-center[1])/(scale[1]*scale[1]),(p[2]-center[2])/(scale[2]*scale[2])]);
      tri(a,b,c,color,[norm(a),norm(b),norm(c)]); tri(a,c,d,color,[norm(a),norm(c),norm(d)]);
    }
  };
  const cylinder = (base: V3, radius: number, height: number, color: Color, segments=10, topRadius=radius) => {
    for(let i=0;i<segments;i++){
      const a=i/segments*Math.PI*2,b=(i+1)/segments*Math.PI*2;
      const p1:[number,number,number]=[base[0]+Math.cos(a)*radius,base[1],base[2]+Math.sin(a)*radius];
      const p2:[number,number,number]=[base[0]+Math.cos(b)*radius,base[1],base[2]+Math.sin(b)*radius];
      const p3:[number,number,number]=[base[0]+Math.cos(b)*topRadius,base[1]+height,base[2]+Math.sin(b)*topRadius];
      const p4:[number,number,number]=[base[0]+Math.cos(a)*topRadius,base[1]+height,base[2]+Math.sin(a)*topRadius];
      quad(p1,p2,p3,p4,color); tri([base[0],base[1]+height,base[2]],p4,p3,color);
    }
  };

  // Rolling cultivated land: a real triangulated 3D height field.
  const terrain = (x:number,z:number) => -0.15 + Math.sin(x*.22+z*.12)*.22 + Math.cos(z*.28)*.18 + Math.sin(x*.09-z*.16)*.16;
  const cols=72, rows=54, xMin=-18, xMax=18, zMin=-13, zMax=14;
  for(let iz=0;iz<rows;iz++) for(let ix=0;ix<cols;ix++){
    const x0=xMin+(xMax-xMin)*ix/cols,x1=xMin+(xMax-xMin)*(ix+1)/cols;
    const z0=zMin+(zMax-zMin)*iz/rows,z1=zMin+(zMax-zMin)*(iz+1)/rows;
    const a:[number,number,number]=[x0,terrain(x0,z0),z0],b:[number,number,number]=[x1,terrain(x1,z0),z0],c:[number,number,number]=[x1,terrain(x1,z1),z1],d:[number,number,number]=[x0,terrain(x0,z1),z1];
    const tint=((ix*13+iz*7)%9)/100;
    const color:Color=[.24+tint,.34+tint,.20+tint*.55];
    quad(a,b,c,d,color);
  }
  // Distant ridgelines and warm horizon.
  sphere([-10,1.05,-7],[8,2.0,2.2],[.34,.40,.29],24,10);
  sphere([0,1.15,-8],[10,2.4,2.4],[.39,.44,.31],24,10);
  sphere([11,1.1,-7],[8,2.1,2.2],[.31,.39,.28],24,10);
  // Farmhouse, courtyard and shaded roof.
  box([-2.5,.95,-2.8],[3.4,1.9,2.4],[.68,.48,.30]);
  tri([-4.35,1.88,-4.1],[-.65,1.88,-4.1],[-2.5,3.15,-2.8],[.28,.19,.13]);
  tri([-.65,1.88,-1.5],[-4.35,1.88,-1.5],[-2.5,3.15,-2.8],[.34,.22,.14]);
  box([-2.5,.68,-1.56],[.62,1.35,.08],[.22,.25,.18]);
  box([-3.55,1.12,-1.54],[.48,.48,.08],[.20,.31,.29]);
  box([-1.45,1.12,-1.54],[.48,.48,.08],[.20,.31,.29]);
  box([-.1,.2,-2.5],[1.4,.35,3.5],[.49,.39,.26]);
  // Native trees: trunks and layered crowns.
  const tree=(x:number,z:number,s=1)=>{
    cylinder([x,terrain(x,z),z],.13*s,1.05*s,[.30,.20,.12]);
    sphere([x,terrain(x,z)+1.48*s,z],[.72*s,.92*s,.68*s],[.20,.32,.20],14,10);
    sphere([x-.3*s,terrain(x,z)+1.72*s,z+.08*s],[.52*s,.65*s,.52*s],[.25,.38,.23],14,9);
  };
  tree(-6,-3,1.25); tree(-7.4,-.8,.86); tree(1.4,-4,.95); tree(5,-3,1.2); tree(7,-5,.9); tree(-4,2,.75);
  // Tharparkar cattle silhouettes with sculpted 3D bodies, heads and legs.
  const cow=(x:number,z:number,s=1)=>{
    const ground=terrain(x,z);
    sphere([x,ground+.88*s,z],[.88*s,.55*s,.43*s],[.82,.78,.65],18,12);
    // Distinctive indigenous zebu shoulder hump and dewlap.
    sphere([x-.34*s,ground+1.25*s,z],[.39*s,.48*s,.37*s],[.82,.78,.65],16,11);
    sphere([x+.68*s,ground+1.08*s,z-.02*s],[.30*s,.38*s,.30*s],[.82,.78,.65],16,10);
    sphere([x+.88*s,ground+.86*s,z+.05*s],[.22*s,.13*s,.23*s],[.40,.29,.20],12,8);
    sphere([x+.58*s,ground+1.08*s,z-.28*s],[.20*s,.09*s,.10*s],[.77,.73,.62],10,7);
    sphere([x+.58*s,ground+1.08*s,z+.24*s],[.20*s,.09*s,.10*s],[.77,.73,.62],10,7);
    sphere([x+.54*s,ground+1.44*s,z-.02*s],[.08*s,.23*s,.08*s],[.78,.74,.60],10,8);
    cylinder([x+.51*s,ground+1.38*s,z-.2*s],.035*s,.24*s,[.70,.65,.52],8,0);
    cylinder([x+.51*s,ground+1.38*s,z+.16*s],.035*s,.24*s,[.70,.65,.52],8,0);
    // Tapered horns, tail and udder complete the cattle silhouette.
    cylinder([x+.73*s,ground+1.35*s,z-.19*s],.055*s,.24*s,[.55,.47,.35],8,.012*s);
    cylinder([x+.73*s,ground+1.35*s,z+.15*s],.055*s,.24*s,[.55,.47,.35],8,.012*s);
    cylinder([x-.86*s,ground+.98*s,z],.035*s,.5*s,[.73,.68,.57],7,.018*s);
    sphere([x+.04*s,ground+.42*s,z],[.19*s,.16*s,.19*s],[.70,.59,.48],12,8);
    for(const dx of [-.52,.52]) for(const dz of [-.24,.24]) cylinder([x+dx*s,ground+.08*s,z+dz*s],.085*s,.68*s,[.72,.67,.55],8,.065*s);
  };
  cow(3.2,-1.2,1.0); cow(5.25,.2,.78);
  // Warm sun and a few low farm boundary posts.
  sphere([6.8,6.8,-10],[1.08,1.08,1.08],[1.0,.78,.43],24,16);
  for(let i=0;i<8;i++) cylinder([-8+i*1.9,terrain(-8+i*1.9,4),4],.055,.55,[.39,.30,.19],6,.045);
  const data:number[]=[];
  for(const v of vertices) data.push(...v.p,...v.n,...v.c);
  return new Float32Array(data);
}

function perspective(fov:number,aspect:number,near:number,far:number):Float32Array{
  const f=1/Math.tan(fov/2),nf=1/(near-far);
  return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);
}
function lookAt(eye:V3,center:V3,up:V3):Float32Array{
  const z=normalize(subtract(eye,center)),x=normalize(cross(up,z)),y=cross(z,x);
  return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]),-(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]),-(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]),1]);
}
function multiply(a:Float32Array,b:Float32Array):Float32Array{
  const out=new Float32Array(16);
  for(let c=0;c<4;c++) for(let r=0;r<4;r++) out[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];
  return out;
}

export default function ImmersiveFarmScene(){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const hostRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const canvas=canvasRef.current,host=hostRef.current;
    if(!canvas||!host) return;
    const gl=canvas.getContext("webgl",{alpha:true,antialias:true,powerPreference:"high-performance"});
    if(!gl) return;
    const vertexSource=`
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute vec3 aColor;
      uniform mat4 uMvp;
      varying vec3 vColor;
      varying float vLight;
      void main(){
        gl_Position=uMvp*vec4(aPosition,1.0);
        vec3 lightDir=normalize(vec3(-0.45,0.82,0.34));
        vLight=0.66+0.38*abs(dot(normalize(aNormal),lightDir));
        vColor=aColor;
      }`;
    const fragmentSource=`
      precision mediump float;
      varying vec3 vColor;
      varying float vLight;
      void main(){ gl_FragColor=vec4(vColor*vLight,1.0); }`;
    const compile=(type:number,source:string)=>{
      const shader=gl.createShader(type); if(!shader) return null;
      gl.shaderSource(shader,source);gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}
      return shader;
    };
    const vs=compile(gl.VERTEX_SHADER,vertexSource),fs=compile(gl.FRAGMENT_SHADER,fragmentSource);
    if(!vs||!fs) return;
    const program=gl.createProgram();if(!program)return;
    gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
    gl.useProgram(program);
    const vertices=createSceneVertices(),buffer=gl.createBuffer();if(!buffer)return;
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    const stride=9*4;
    const position=gl.getAttribLocation(program,"aPosition"),normal=gl.getAttribLocation(program,"aNormal"),color=gl.getAttribLocation(program,"aColor");
    gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,3,gl.FLOAT,false,stride,0);
    gl.enableVertexAttribArray(normal);gl.vertexAttribPointer(normal,3,gl.FLOAT,false,stride,12);
    gl.enableVertexAttribArray(color);gl.vertexAttribPointer(color,3,gl.FLOAT,false,stride,24);
    const mvpLocation=gl.getUniformLocation(program,"uMvp");
    gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
    gl.clearColor(0,0,0,0);
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pointerX=0,pointerY=0,targetX=0,targetY=0,scroll=0,frame=0,visible=true;
    const onPointer=(event:PointerEvent)=>{
      const rect=host.getBoundingClientRect();
      targetX=((event.clientX-rect.left)/rect.width-.5)*2;
      targetY=((event.clientY-rect.top)/rect.height-.5)*2;
    };
    const onLeave=()=>{targetX=0;targetY=0;};
    const onScroll=()=>{const rect=host.getBoundingClientRect();scroll=Math.max(-1,Math.min(1,-rect.top/Math.max(window.innerHeight,1)));};
    host.addEventListener("pointermove",onPointer);host.addEventListener("pointerleave",onLeave);
    window.addEventListener("scroll",onScroll,{passive:true});onScroll();
    const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;});
    observer.observe(host);
    const resize=()=>{
      const rect=host.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.6);
      const width=Math.max(1,Math.floor(rect.width*dpr)),height=Math.max(1,Math.floor(rect.height*dpr));
      if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);}
    };
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resize();
    const draw=(time:number)=>{
      frame=requestAnimationFrame(draw);
      if(!visible)return;
      pointerX+=(targetX-pointerX)*.035;pointerY+=(targetY-pointerY)*.035;
      const t=reduced?0:time*.00018;
      const cameraX=pointerX*1.15+Math.sin(t)*.12;
      const cameraY=4.7+pointerY*.36+Math.max(0,scroll)*.38;
      const cameraZ=13.2-Math.max(0,scroll)*1.25;
      const view=lookAt([cameraX,cameraY,cameraZ],[-.1,1.45+Math.max(0,scroll)*.16,-1.1],[0,1,0]);
      const projection=perspective(Math.PI/3.15,canvas.width/Math.max(1,canvas.height),.1,80);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(mvpLocation,false,multiply(projection,view));
      gl.drawArrays(gl.TRIANGLES,0,vertices.length/9);
    };
    frame=requestAnimationFrame(draw);
    return()=>{
      cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();
      host.removeEventListener("pointermove",onPointer);host.removeEventListener("pointerleave",onLeave);window.removeEventListener("scroll",onScroll);
      gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
    };
  },[]);
  return <div ref={hostRef} className="lado-3d-farm-scene" role="img" aria-label="Interactive three-dimensional view of a Rajasthan farm with a traditional farmhouse, trees, Tharparkar cattle and rolling fields">
    <canvas ref={canvasRef} aria-hidden="true" />
    <div className="lado-3d-scene-vignette" />
    <div className="lado-3d-scene-label"><span>THE LADO LANDSCAPE</span><strong>Pilani · Rajasthan</strong></div>
    <div className="lado-3d-scene-hint">MOVE TO EXPLORE <span>↗</span></div>
  </div>;
}
