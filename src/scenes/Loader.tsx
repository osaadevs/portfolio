import { useLayoutEffect, useRef, useState } from "react";
import { OSA_PATHS, OSA_VIEWBOX } from "../brand/osa";
import { HERO_COVERS } from "../data";
import { REDUCED, gsap, lockScroll, setLoaded } from "../lib";

// Preloader. The wordmark fills with paper from the bottom like ink rising
// in a pen, a big counter tracks real loading, then the camera dives
// through the counter of the "o": the hole is cut out of the overlay, so
// the hero is already visible through it and simply opens to full screen.

const O_COUNTER = OSA_PATHS.o.split(/(?=M )/)[0];
const COUNTER = { x: 430, y: 1035 };
const MARK_C = { x: OSA_VIEWBOX.x + OSA_VIEWBOX.w / 2, y: OSA_VIEWBOX.y + OSA_VIEWBOX.h / 2 };
const KEY = "osa-v2-loaded";

function shouldSkip() {
  if (REDUCED) return true;
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function Loader() {
  const [skip] = useState(() => {
    const s = shouldSkip();
    if (s) setLoaded();
    return s;
  });
  const [done, setDone] = useState(skip);
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const fill = useRef<SVGRectElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (skip) return;
    lockScroll(true);
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Artboard units to px: the mark is min(70vw, 820px) wide.
    const s = Math.min(w * 0.7, 820) / OSA_VIEWBOX.w;
    const cx = w / 2 + (COUNTER.x - MARK_C.x) * s;
    const cy = h / 2 + (COUNTER.y - MARK_C.y) * s;
    const viewBoxAt = (z: number) => {
      const k = s * z;
      return `${COUNTER.x - cx / k} ${COUNTER.y - cy / k} ${w / k} ${h / k}`;
    };
    svg.current?.setAttribute("viewBox", viewBoxAt(1));

    const tasks: Promise<unknown>[] = [
      document.fonts.ready,
      ...HERO_COVERS.slice(0, 4).map((src) => {
        const img = new Image();
        img.src = src;
        return img.decode().catch(() => undefined);
      }),
    ];
    let finished = 0;
    tasks.forEach((t) => t.then(() => (finished += 1)));

    const p = { v: 0 };
    const start = performance.now();
    const fillTo = (v: number) => {
      const top = OSA_VIEWBOX.y + OSA_VIEWBOX.h * (1 - v);
      fill.current?.setAttribute("y", String(top));
      if (count.current) count.current.textContent = String(Math.round(v * 100));
    };
    let exiting = false;
    const tick = () => {
      const elapsed = performance.now() - start;
      const real = finished / tasks.length;
      const target = elapsed > 3600 ? 1 : Math.min(real, elapsed / 1500);
      p.v += (target - p.v) * 0.12;
      if (target === 1 && p.v > 0.996) p.v = 1;
      fillTo(p.v);
      if (p.v === 1 && !exiting) {
        exiting = true;
        gsap.ticker.remove(tick);
        exit();
      }
    };
    gsap.ticker.add(tick);

    const exit = () => {
      const zoom = { z: 1 };
      const tl = gsap.timeline({ delay: 0.25 });
      tl.to("[data-loader-chrome]", { yPercent: 120, duration: 0.6, ease: "power3.in", stagger: 0.05 })
        .add(() => setLoaded(), "-=0.1")
        .to(zoom, {
          z: 40,
          duration: 1.3,
          ease: "expo.in",
          onUpdate: () => svg.current?.setAttribute("viewBox", viewBoxAt(zoom.z)),
        }, "<")
        .add(() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {
            /* ignore */
          }
          lockScroll(false);
          setDone(true);
        });
    };

    return () => {
      gsap.ticker.remove(tick);
      lockScroll(false);
    };
  }, [skip]);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[150]" aria-hidden="true">
      <svg ref={svg} className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <mask id="v2-loader-mask" maskUnits="userSpaceOnUse" x="-30000" y="-30000" width="60000" height="60000">
            <rect x="-30000" y="-30000" width="60000" height="60000" fill="white" />
            <path d={O_COUNTER} fill="black" />
          </mask>
          <clipPath id="v2-loader-fill">
            <rect ref={fill} x={OSA_VIEWBOX.x - 50} y={OSA_VIEWBOX.y + OSA_VIEWBOX.h} width={OSA_VIEWBOX.w + 100} height={OSA_VIEWBOX.h + 50} />
          </clipPath>
        </defs>
        <g mask="url(#v2-loader-mask)">
          <rect x="-30000" y="-30000" width="60000" height="60000" fill="#070b14" />
          <g fill="#eef1f6" opacity="0.08">
            <path d={OSA_PATHS.o} />
            <path d={OSA_PATHS.s} />
            <path d={OSA_PATHS.a} />
          </g>
          <g fill="#eef1f6" clipPath="url(#v2-loader-fill)">
            <path d={OSA_PATHS.o} />
            <path d={OSA_PATHS.s} />
            <path d={OSA_PATHS.a} />
          </g>
        </g>
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between overflow-hidden px-5 pb-4 sm:px-8 sm:pb-6">
        <p data-loader-chrome className="pb-2 text-sm leading-snug text-mist">
          <span className="block text-paper">Osanda Senevirathna</span>
          Designer and developer
        </p>
        <span data-loader-chrome className="display text-[clamp(3.5rem,11vw,9rem)] tabular-nums text-paper">
          <span ref={count}>0</span>
        </span>
      </div>
    </div>
  );
}
