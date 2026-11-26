import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { NIB_PATH, NIB_BOX, OSA_PATHS, OSA_VIEWBOX_STR } from "../brand/osa";
import { FINE, REDUCED, gsap } from "../lib";

/* ------------------------------------------------------------------ */
/* The wordmark, as flat shapes. */
export function Osa({ className = "", title = "osa" }: { className?: string; title?: string }) {
  return (
    <svg viewBox={OSA_VIEWBOX_STR} className={className} role="img" aria-label={title} fill="currentColor">
      <path d={OSA_PATHS.o} />
      <path d={OSA_PATHS.s} />
      <path d={OSA_PATHS.a} />
    </svg>
  );
}

/** The nib on its own, tip pointing straight up. */
export function Nib({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const cx = NIB_BOX.x + NIB_BOX.w / 2;
  const cy = NIB_BOX.y + NIB_BOX.h / 2;
  return (
    <svg
      viewBox={`${cx - 230} ${cy - 230} 460 460`}
      className={className}
      style={style}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d={NIB_PATH} transform={`rotate(-46 ${cx} ${cy})`} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Nib cursor: the logo's nib is the pointer, with a label pill for
   anything marked data-cursor. Fine pointers only. */
const TIP = { x: 1692, y: 862 };
const SIZE = 26;
const SCALE = SIZE / 350;

export function Cursor() {
  const enabled = FINE && !REDUCED;
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 50, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 900, damping: 50, mass: 0.3 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    const read = (el: Element | null) =>
      setLabel((el as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor || null);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      read(e.target as Element);
    };
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => read(document.elementFromPoint(x.get(), y.get())));
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const tipX = (TIP.x - 1684) * SCALE;
  const tipY = (TIP.y - 856) * SCALE;

  return (
    <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[200]" style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}>
      <motion.svg
        viewBox="1684 856 350 335"
        width={SIZE}
        height={(SIZE * 335) / 350}
        className="absolute"
        style={{ left: -tipX, top: -tipY, transformOrigin: `${tipX}px ${tipY}px`, mixBlendMode: "difference" }}
        animate={{ scale: down ? 0.8 : label ? 0.7 : 1 }}
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
            className="absolute left-0 top-0 origin-top-left whitespace-nowrap rounded-full bg-ice px-3 py-1.5 text-xs font-semibold text-night"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic: the element leans toward the pointer and snaps back. */
export function Magnetic({ children, strength = 0.35, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !FINE || REDUCED) return;
    const inner = el.firstElementChild as HTMLElement | null;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      if (inner) gsap.to(inner, { x: dx * strength * 0.4, y: dy * strength * 0.4, duration: 0.6, ease: "power3.out" });
    };
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)" });
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)" });
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
    </div>
  );
}

/** Pill button. On hover the icon's circle swells until it fills the whole
 *  pill, the label changes colour as the fill passes under it, and the
 *  arrow straightens. One calm gesture instead of several small ones. */
export function Pill({
  href,
  onClick,
  children,
  tone = "ice",
  cursor,
  external,
  icon = "arrow",
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  tone?: "ice" | "paper" | "night" | "ghost";
  cursor?: string;
  external?: boolean;
  icon?: "arrow" | "down" | "nib";
}) {
  // [pill, circle/fill, label on hover]
  const tones = {
    ice: ["bg-ice text-night", "bg-signal text-paper", "group-hover:text-paper"],
    paper: ["bg-paper text-night", "bg-signal text-paper", "group-hover:text-paper"],
    night: ["bg-night text-paper", "bg-ice text-night", "group-hover:text-night"],
    ghost: ["text-current ring-1 ring-inset ring-current/30", "bg-paper text-night", "group-hover:text-night"],
  }[tone];
  const rest = icon === "down" ? "rotate-90" : icon === "arrow" ? "-rotate-45" : "";
  const hover = icon === "nib" ? "" : icon === "down" ? "group-hover:translate-y-0.5" : "group-hover:rotate-0";
  const glyph =
    icon === "nib" ? (
      <Nib className="size-[18px]" />
    ) : (
      <svg viewBox="0 0 24 24" className={`size-[18px] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${rest} ${hover}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    );
  const cls = `group relative isolate inline-flex h-14 items-center gap-4 overflow-hidden rounded-full pl-6 pr-2 text-[15px] font-semibold active:scale-[0.97] transition-transform ${tones[0]}`;
  const inner = (
    <>
      {/* The fill: a circle anchored on the icon that grows to cover the pill. */}
      <span
        aria-hidden="true"
        className={`absolute right-2 top-1/2 -z-10 size-10 -translate-y-1/2 rounded-full transition-transform duration-[650ms] ease-[cubic-bezier(.65,0,.35,1)] group-hover:scale-[9] ${tones[1]}`}
      />
      <span className={`transition-colors duration-300 delay-75 ${tones[2]}`}>{children}</span>
      <span className={`grid size-10 place-items-center rounded-full ${tones[1]}`}>{glyph}</span>
    </>
  );
  return (
    <Magnetic strength={0.15}>
      {href ? (
        <a href={href} className={cls} data-cursor={cursor} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={cls} data-cursor={cursor}>
          {inner}
        </button>
      )}
    </Magnetic>
  );
}
