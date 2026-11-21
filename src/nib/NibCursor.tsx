import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { NIB_PATH } from "../brand/osa";

// The pen nib from the logo, rotated so its tip is the hotspot (pointing
// up-left like a system arrow). Elements with data-cursor="Label" turn the
// nib into a labelled pointer. Fine pointers only, never under reduced motion.

const TIP = { x: 1692, y: 862 };
const VIEWBOX = "1684 856 350 335";
const SIZE = 26;
const SCALE = SIZE / 350;

export function NibCursor() {
  const [enabled] = useState(
    () => window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const tilt = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 900, damping: 50, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 900, damping: 50, mass: 0.3 });
  const sTilt = useSpring(tilt, { stiffness: 200, damping: 18 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-nib-cursor");
    let lastX = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      tilt.set(Math.max(-14, Math.min(14, (e.clientX - lastX) * 0.9)));
      lastX = e.clientX;
      setVisible(true);
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      setLabel(t?.dataset.cursor || null);
    };
    // Content moves under a still pointer when scrolling; re-read the label.
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.elementFromPoint(x.get(), y.get()) as HTMLElement | null;
        setLabel(el?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor || null);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const onLeave = () => setVisible(false);
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const settle = window.setInterval(() => tilt.set(0), 120);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.documentElement.classList.remove("has-nib-cursor");
      window.clearInterval(settle);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, x, y, tilt]);

  if (!enabled) return null;

  const tipX = (TIP.x - 1684) * SCALE;
  const tipY = (TIP.y - 856) * SCALE;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90]"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    >
      <motion.svg
        viewBox={VIEWBOX}
        width={SIZE}
        height={(SIZE * 335) / 350}
        className="absolute"
        style={{
          left: -tipX,
          top: -tipY,
          rotate: sTilt,
          transformOrigin: `${tipX}px ${tipY}px`,
          mixBlendMode: "difference",
        }}
        animate={{ scale: down ? 0.82 : label ? 0.7 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <path d={NIB_PATH} transform={`rotate(-90 ${TIP.x} ${TIP.y})`} fill="#fff" />
      </motion.svg>
      <AnimatePresence>
        {label && (
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.6, x: 10, y: 14 }}
            animate={{ opacity: 1, scale: 1, x: 16, y: 18 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 520, damping: 30 }}
            className="absolute left-0 top-0 origin-top-left whitespace-nowrap rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-on-accent"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
