import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

const ACCENT = "#1f8bff";

/**
 * The hero's "interactive object": a distorted icosahedron that idles with a
 * slow tumble and eases toward the pointer position, wireframe-lit so it
 * reads as a technical/design artifact rather than decoration. Self-lit
 * (no HDRI fetch) to keep this a zero-network-request visual.
 */
function DistortedBlob({ reduceMotion }: { reduceMotion: boolean }) {
  const mesh = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    if (reduceMotion) return;
    mesh.current.rotation.x += delta * 0.12;
    mesh.current.rotation.y += delta * 0.18;
    // Ease rotation toward pointer for a subtle "aware" interaction.
    const targetX = state.pointer.y * 0.3;
    const targetY = state.pointer.x * 0.3;
    mesh.current.rotation.x += (targetX - mesh.current.rotation.x) * 0.02;
    mesh.current.rotation.y += (targetY - mesh.current.rotation.y) * 0.02;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.4, 8]} />
      <MeshDistortMaterial
        color={ACCENT}
        attach="material"
        distort={0.45}
        speed={reduceMotion ? 0 : 1.4}
        roughness={0.15}
        metalness={0.6}
        wireframe
      />
    </mesh>
  );
}

export function HeroScene() {
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      frameloop={reduceMotion ? "demand" : "always"}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 2, 4]} intensity={40} color={ACCENT} />
      <pointLight position={[-3, -2, -2]} intensity={15} color="#ffffff" />
      <Suspense fallback={null}>
        <DistortedBlob reduceMotion={reduceMotion} />
      </Suspense>
    </Canvas>
  );
}
