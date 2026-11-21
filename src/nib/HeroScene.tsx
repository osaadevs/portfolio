import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import type { MotionValue } from "framer-motion";
import { NIB_PATH } from "../brand/osa";
import { useLoaded } from "./store";

// The hero's WebGL layer: the LinkedIn cover gradient brought to life as a
// grain shader, and a polished chrome pen nib (extruded from the logo's own
// nib vector, then bent like a real fountain-pen nib) that turns to point at
// the visitor's cursor and swings down toward the work as the page scrolls.

// Pointer in normalised device coords, tracked on the window so the nib keeps
// aiming even while the cursor is over buttons layered above the canvas.
const POINTER = new THREE.Vector2(0, 0);
if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => POINTER.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1),
    { passive: true },
  );
}

const COLORS = { g1: "#050a16", g2: "#0b3f78", g3: "#3aa7d6", g4: "#cdeff7" };

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime; uniform vec2 uRes; uniform vec2 uPointer;
uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform vec3 uC4;
varying vec2 vUv;
${NOISE}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 uv=vUv;
  vec2 p=vec2(uv.x*uRes.x/uRes.y,uv.y);
  float t=uTime*0.05;
  float n=snoise(vec3(p*0.85,t))*0.55+snoise(vec3(p*2.0+3.0,t*1.5))*0.2;
  // A light band on the top-left to bottom-right diagonal, like the cover.
  vec2 m=uPointer*0.5+0.5;
  float d=(uv.x+uv.y-1.1)+n*0.4+(length(uv-m)-0.5)*0.1;
  float b=pow(1.0-smoothstep(0.0,0.95,abs(d)),1.5);
  vec3 col=mix(uC1,uC2,smoothstep(0.0,0.4,b));
  col=mix(col,uC3,smoothstep(0.35,0.78,b));
  col=mix(col,uC4,smoothstep(0.75,1.0,b)*0.85);
  col+=(hash(uv*uRes+fract(uTime)*91.0)-0.5)*0.07;
  gl_FragColor=vec4(col,1.0);
}`;

function GradientPlane() {
  const { size } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uC1: { value: new THREE.Color(COLORS.g1) },
      uC2: { value: new THREE.Color(COLORS.g2) },
      uC3: { value: new THREE.Color(COLORS.g3) },
      uC4: { value: new THREE.Color(COLORS.g4) },
    }),
    [],
  );
  useFrame((_, dt) => {
    uniforms.uTime.value += Math.min(dt, 0.05);
    uniforms.uRes.value.set(size.width, size.height);
    uniforms.uPointer.value.lerp(POINTER, 0.04);
  });
  return (
    <mesh renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader="varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.9999,1.0); }"
        fragmentShader={FRAG}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/** Extrude the nib, point its tip along +Y, and curve it like a real nib. */
function useNibGeometry() {
  return useMemo(() => {
    const data = new SVGLoader().parse(
      `<svg xmlns="http://www.w3.org/2000/svg"><path fill="#000" d="${NIB_PATH}"/></svg>`,
    );
    const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 26,
      bevelEnabled: true,
      bevelThickness: 9,
      bevelSize: 6,
      bevelSegments: 8,
      curveSegments: 48,
      steps: 1,
    });
    // SVG is y-down: flip, then centre the nib's body (not its bbox) at 0.
    geo.scale(1, -1, 1);
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    geo.translate(-(bb.min.x + bb.max.x) / 2, -(bb.min.y + bb.max.y) / 2, -13);
    // The tip points up-right at ~46°; rotate it to point straight up.
    geo.rotateZ((44 * Math.PI) / 180);
    geo.computeBoundingBox();
    const h = geo.boundingBox!.max.y - geo.boundingBox!.min.y;
    geo.scale(1 / h, 1 / h, 1 / h);
    // Bend across the width so the nib is a curved shell, not a flat plate.
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, pos.getZ(i) - x * x * 0.55 - (0.5 - y) * 0.05);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function Nib({ scroll, reduced }: { scroll: MotionValue<number>; reduced: boolean }) {
  const geo = useNibGeometry();
  const group = useRef<THREE.Group>(null);
  const loaded = useLoaded();
  const intro = useRef(reduced ? 1 : 0);
  const aim = useRef(-0.6);
  const { viewport } = useThree();
  const pointer = POINTER;

  const portrait = viewport.aspect < 1;
  const height = portrait ? viewport.height * 0.3 : viewport.height * 0.52;
  const baseX = portrait ? viewport.width * 0.12 : viewport.width * 0.22;
  const baseY = portrait ? viewport.height * 0.2 : viewport.height * 0.12;

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    if (loaded) intro.current = Math.min(1, intro.current + dt / 1.8);
    const e = 1 - Math.pow(1 - intro.current, 4);
    const sp = scroll.get();
    const t = state.clock.elapsedTime;

    // Aim the tip at the pointer (screen plane), easing; idle sway otherwise.
    const px = (pointer.x * viewport.width) / 2 - baseX;
    const py = (pointer.y * viewport.height) / 2 - baseY;
    const toPointer = Math.atan2(py, px) - Math.PI / 2;
    const idle = Math.sin(t * 0.6) * 0.15 - 0.55;
    const target = reduced ? -0.55 : Math.hypot(px, py) < 0.4 ? idle : toPointer;
    // Shortest angular path.
    let diff = target - aim.current;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    aim.current += diff * (1 - Math.pow(0.02, dt));
    // On scroll, swing the tip down toward the work.
    const pointDown = Math.PI;
    let toDown = pointDown - aim.current;
    toDown = Math.atan2(Math.sin(toDown), Math.cos(toDown));
    g.rotation.z = aim.current + toDown * sp + (1 - e) * 1.6;

    g.rotation.x = (reduced ? 0 : Math.sin(t * 0.8) * 0.08) - pointer.y * 0.1 + (1 - e) * 0.8;
    g.rotation.y = (reduced ? 0.2 : 0.2 + Math.sin(t * 0.5) * 0.14) + pointer.x * 0.18 - (1 - e) * 2.4;

    const s = height * (0.6 + 0.4 * e) * (1 - sp * 0.2);
    g.scale.setScalar(s);
    g.position.set(
      baseX,
      baseY + (reduced ? 0 : Math.sin(t * 0.9) * 0.06) + sp * viewport.height * 0.25,
      -sp * 1.5,
    );
  });

  return (
    <group ref={group}>
      <mesh geometry={geo}>
        <meshPhysicalMaterial
          color="#dfe9f3"
          metalness={1}
          roughness={0.14}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={1.7}
        />
      </mesh>
    </group>
  );
}

export default function HeroScene({ scroll, active }: { scroll: MotionValue<number>; active: boolean }) {
  const reduced = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={reduced ? "demand" : active ? "always" : "never"}
      camera={{ position: [0, 0, 10], fov: 30 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <GradientPlane />
      {/* Studio lighting, no network fetch: cyan and blue strips give the
          chrome its Deep Signal reflections. */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={4} color="#ffffff" position={[0, 5, 5]} scale={[14, 1.5, 1]} />
        <Lightformer intensity={3} color="#7fd8f0" position={[-6, 1, 3]} rotation-y={Math.PI / 2} scale={[10, 2.5, 1]} />
        <Lightformer intensity={2.5} color="#1f6feb" position={[6, -1, 3]} rotation-y={-Math.PI / 2} scale={[8, 6, 1]} />
        <Lightformer intensity={1.2} color="#cdeff7" position={[0, -5, 2]} rotation-x={-Math.PI / 2} scale={[14, 4, 1]} />
        <Lightformer intensity={1.6} color="#e8f6ff" position={[0, 0, 9]} scale={[7, 7, 1]} />
        <Lightformer intensity={0.8} form="ring" color="#7fd8f0" position={[2, 2, -6]} scale={4} />
      </Environment>
      <ambientLight intensity={0.2} />
      <Nib scroll={scroll} reduced={reduced} />
    </Canvas>
  );
}
