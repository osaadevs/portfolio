import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { NIB_BOX, OSA_PATHS, OSA_VIEWBOX } from "../brand/osa";
import { getReadyTasks, setLoaded } from "./store";

// Ink-fill loader. Ink spreads out of the pen nib until the wordmark is full,
// progress tracks real readiness (fonts + registered tasks). The exit dives
// through the counter of the "o": the counter is cut out of the overlay, so
// the live page is visible through it the whole time, and zooming in on it
// opens the window to full screen.

const O_COUNTER = OSA_PATHS.o.split(/(?=M )/)[0];
const COUNTER = { x: 430, y: 1035 }; // centre of the o counter, artboard units
const MARK_C = { x: OSA_VIEWBOX.x + OSA_VIEWBOX.w / 2, y: OSA_VIEWBOX.y + OSA_VIEWBOX.h / 2 };
const NIB_C = { x: NIB_BOX.x + NIB_BOX.w / 2, y: NIB_BOX.y + NIB_BOX.h / 2 };
const INK_MAX_R = 1650; // radius that covers the whole mark from the nib
const MIN_MS = 1100;
const MAX_MS = 3200;

function shouldSkip() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  try {
    return sessionStorage.getItem("osa-loaded") === "1";
  } catch {
    return false;
  }
}

export function Loader() {
  // Decide during render so a skipped loader marks the site loaded before
  // anything below it (the hero) renders for the first time.
  const [skip] = useState(() => {
    const s = shouldSkip();
    if (s) setLoaded();
    return s;
  });
  const [done, setDone] = useState(skip);
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const progress = useMotionValue(0); // 0..1 ink fill
  const zoom = useMotionValue(1); // exit zoom into the counter
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (skip) return;
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    document.documentElement.style.overflow = "hidden";

    let cancelled = false;
    const start = performance.now();
    const tasks = [document.fonts.ready, ...getReadyTasks()];
    let finished = 0;
    tasks.forEach((t) =>
      Promise.resolve(t).then(() => {
        finished += 1;
      }),
    );

    // Ease displayed progress toward real progress, but never faster than
    // the MIN_MS floor; force completion at MAX_MS so a slow asset can't trap
    // the visitor.
    let raf = 0;
    let last = start;
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const elapsed = now - start;
      const real = finished / tasks.length;
      const floor = Math.min(1, elapsed / MIN_MS);
      const target = elapsed > MAX_MS ? 1 : Math.min(real, floor);
      // Frame-rate independent easing toward the target.
      const next = progress.get() + (target - progress.get()) * (1 - Math.exp(-dt * 9));
      progress.set(target === 1 && next > 0.995 ? 1 : next);
      if (pctRef.current) pctRef.current.textContent = String(Math.round(progress.get() * 100)).padStart(3, "0");
      if (progress.get() >= 1) {
        exit();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const exit = async () => {
      await new Promise((r) => setTimeout(r, 220));
      if (cancelled) return;
      setLoaded();
      await animate(zoom, 34, { duration: 1.25, ease: [0.7, 0, 0.2, 1] });
      if (cancelled) return;
      try {
        sessionStorage.setItem("osa-loaded", "1");
      } catch {
        /* ignore */
      }
      document.documentElement.style.overflow = "";
      setDone(true);
    };

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.documentElement.style.overflow = "";
    };
  }, [skip, progress, zoom]);

  // Map artboard units to screen: the mark is ~min(72vw, 860px) wide.
  const s = Math.min(size.w * 0.72, 860) / OSA_VIEWBOX.w;
  // Screen position of the counter at zoom 1 (it stays fixed while zooming).
  const cx = size.w / 2 + (COUNTER.x - MARK_C.x) * s;
  const cy = size.h / 2 + (COUNTER.y - MARK_C.y) * s;

  const svgRef = useRef<SVGSVGElement>(null);
  const viewBoxAt = (z: number) => {
    const k = s * z;
    return `${COUNTER.x - cx / k} ${COUNTER.y - cy / k} ${size.w / k} ${size.h / k}`;
  };
  // Written straight to the DOM each frame; motion can't tween viewBox strings.
  useMotionValueEvent(zoom, "change", (z) => svgRef.current?.setAttribute("viewBox", viewBoxAt(z)));
  const inkR = useTransform(progress, (p) => p * INK_MAX_R);
  const chromeOpacity = useTransform(zoom, [1, 3], [1, 0]);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[100]" aria-hidden="true">
      <svg ref={svgRef} className="absolute inset-0 h-full w-full" viewBox={viewBoxAt(zoom.get())} preserveAspectRatio="none">
        <defs>
          <mask id="osa-loader-mask" maskUnits="userSpaceOnUse" x="-20000" y="-20000" width="44000" height="44000">
            <rect x="-20000" y="-20000" width="44000" height="44000" fill="white" />
            <path d={O_COUNTER} fill="black" />
          </mask>
          <clipPath id="osa-loader-ink">
            <motion.circle cx={NIB_C.x} cy={NIB_C.y} r={inkR} />
          </clipPath>
        </defs>
        <g mask="url(#osa-loader-mask)">
          <rect x="-20000" y="-20000" width="44000" height="44000" fill="var(--p-bg)" />
          <g fill="var(--p-line)">
            <path d={OSA_PATHS.o} />
            <path d={OSA_PATHS.s} />
            <path d={OSA_PATHS.a} />
          </g>
          <g fill="var(--p-ink)" clipPath="url(#osa-loader-ink)">
            <path d={OSA_PATHS.o} />
            <path d={OSA_PATHS.s} />
            <path d={OSA_PATHS.a} />
          </g>
        </g>
      </svg>
      <motion.div
        style={{ opacity: chromeOpacity }}
        className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-5 font-display text-sm text-muted sm:px-8 sm:pb-7"
      >
        <span>Osanda Senevirathna</span>
        <span className="tabular-nums">
          <span ref={pctRef}>000</span>
        </span>
      </motion.div>
    </div>
  );
}
