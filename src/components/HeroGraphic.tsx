import { useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { EASE } from "./ui";

const COLS = 7;
const ROWS = 7;
const SIZE = 320;
const GAP = SIZE / (COLS - 1);

// A handful of "active" nodes lit in accent blue, connected by a few lines —
// reads as a circuit/constellation diagram rather than a literal 3D object,
// extending the same grid-line language used across the rest of the site
// (see GridLines.tsx) instead of borrowing an unrelated visual metaphor.
const ACTIVE = [
  [1, 1],
  [4, 1],
  [1, 4],
  [5, 4],
  [3, 6],
  [4, 3],
] as const;

const LINKS: [number, number][] = [
  [0, 3],
  [0, 4],
  [1, 3],
  [3, 4],
  [3, 2],
  [2, 4],
];

function pointFor([cx, cy]: readonly [number, number]) {
  return { x: cx * GAP, y: cy * GAP };
}

export function HeroGraphic() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotateX = useTransform(sy, [-1, 1], [6, -6]);
  const rotateY = useTransform(sx, [-1, 1], [-6, 6]);

  const dots = useMemo(() => {
    const out: { x: number; y: number; active: boolean; delay: number }[] = [];
    for (let cy = 0; cy < ROWS; cy++) {
      for (let cx = 0; cx < COLS; cx++) {
        const active = ACTIVE.some(([ax, ay]) => ax === cx && ay === cy);
        out.push({ x: cx * GAP, y: cy * GAP, active, delay: (cx + cy) * 0.03 });
      }
    }
    return out;
  }, []);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }
  function handlePointerLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ perspective: 900 }}
      className="relative flex h-[280px] w-full max-w-[380px] items-center justify-center sm:h-[340px] md:h-[400px]"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative aspect-square w-full max-w-[320px] rounded-2xl border border-border bg-bg-surface"
      >
        <svg viewBox={`-20 -20 ${SIZE + 40} ${SIZE + 40}`} className="h-full w-full overflow-visible p-8">
          {LINKS.map(([a, b], i) => {
            const p1 = pointFor(ACTIVE[a]);
            const p2 = pointFor(ACTIVE[b]);
            return (
              <motion.line
                key={i}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="var(--color-accent)"
                strokeWidth={1}
                strokeOpacity={0.35}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.4 + i * 0.12, ease: EASE }}
              />
            );
          })}

          {dots.map((d, i) => (
            <motion.circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={d.active ? 4 : 2}
              fill={d.active ? "var(--color-accent)" : "var(--color-border)"}
              initial={{ opacity: 0, scale: 0 }}
              animate={
                d.active
                  ? { opacity: [0.5, 1, 0.5], scale: 1 }
                  : { opacity: 1, scale: 1 }
              }
              transition={
                d.active
                  ? { opacity: { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: d.delay }, scale: { duration: 0.4, delay: d.delay, ease: EASE } }
                  : { duration: 0.4, delay: d.delay, ease: EASE }
              }
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
