import { useEffect, useRef, useState, type ReactNode } from "react";
import { hero } from "../content";
import { HERO, HERO_COVERS } from "../data";
import { FINE, REDUCED, gsap, scrollTo, useGSAP, useLoaded } from "../lib";
import { GridField } from "../ui/GridField";
import { Nib, Pill } from "../ui/kit";

// Hero. "Interface & brand designer." set like the wordmark, with a pill of
// real covers and the (still) nib set into the type, and the last word in a
// selection frame like a design tool. Behind it, a live layout grid that
// lights up under the pointer. On scroll the hero sinks back and the
// introduction slides over it as a sheet.

const BASE_W = 800;
const LIGHT_W = 260;

function Chars({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`inline-block whitespace-nowrap ${className}`}>
      {text.split("").map((c, i) => (
        <span key={i} data-char className="inline-block" style={{ fontWeight: BASE_W }}>
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}

function Line({ children, i }: { children: ReactNode; i: number }) {
  return (
    <span className="line-mask" data-line={i}>
      <span data-line-in className="flex items-center gap-[0.14em]">
        {children}
      </span>
    </span>
  );
}

/** Letters near the pointer thin out, like ink lifting off the page. */
function useInkLift(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || REDUCED || !FINE) return;
    const chars = Array.from(el.querySelectorAll<HTMLElement>("h1 [data-char]"));
    const cur = chars.map(() => 0);
    let centres: { x: number; y: number }[] = [];
    let px = -1e4;
    let py = -1e4;
    let raf = 0;
    const tick = () => {
      if (!centres.length)
        centres = chars.map((c) => {
          const r = c.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        });
      let moving = false;
      chars.forEach((c, i) => {
        const t = Math.max(0, 1 - Math.hypot(px - centres[i].x, py - centres[i].y) / 240);
        const target = t * t * (3 - 2 * t);
        cur[i] += (target - cur[i]) * 0.14;
        if (Math.abs(target - cur[i]) > 0.002) moving = true;
        c.style.fontWeight = String(Math.round(BASE_W - (BASE_W - LIGHT_W) * cur[i]));
      });
      raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      kick();
    };
    const leave = () => {
      px = py = -1e4;
      kick();
    };
    const reset = () => {
      centres = [];
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", reset, { passive: true });
    window.addEventListener("resize", reset);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", reset);
      window.removeEventListener("resize", reset);
    };
  }, [root]);
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const loaded = useLoaded();
  const [idx, setIdx] = useState(0);
  useInkLift(root);

  // Flick through covers inside the pill.
  useEffect(() => {
    if (REDUCED) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % HERO_COVERS.length), 1400);
    return () => window.clearInterval(id);
  }, []);

  // Scroll: hold the hero in place and let it sink back under the intro.
  // fromTo with explicit values, so scrolling back up restores it exactly.
  useGSAP(
    () => {
      if (REDUCED) return;
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true, pin: true, pinSpacing: false } })
        .fromTo(q("[data-sink]"), { scale: 1, yPercent: 0, opacity: 1 }, { scale: 0.9, yPercent: -6, opacity: 0.25, ease: "none" }, 0)
        .fromTo(q("[data-grid]"), { scale: 1, opacity: 1 }, { scale: 1.12, opacity: 0.4, ease: "none" }, 0);
    },
    { scope: root },
  );

  // Intro, once the loader opens.
  useGSAP(
    () => {
      if (REDUCED) return;
      const q = gsap.utils.selector(root);
      if (!loaded) {
        gsap.set(q("[data-line-in]"), { yPercent: 110 });
        gsap.set(q("[data-fade]"), { opacity: 0, y: 14 });
        gsap.set(q("[data-pop]"), { scale: 0 });
        gsap.set(q("[data-grid]"), { opacity: 0 });
        gsap.set(q("[data-select]"), { opacity: 0, scale: 1.08 });
        return;
      }
      gsap
        .timeline({ delay: 0.1 })
        .to(q("[data-grid]"), { opacity: 1, duration: 1.6, ease: "power2.out" }, 0)
        .to(q("[data-select]"), { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" }, 0.9)
        .to(q("[data-line-in]"), { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.09 }, 0.15)
        .to(q("[data-pop]"), { scale: 1, duration: 0.9, ease: "back.out(1.8)", stagger: 0.12 }, 0.45)
        .to(q("[data-fade]"), { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.06 }, 0.55);
    },
    { scope: root, dependencies: [loaded] },
  );

  return (
    <section ref={root} id="top" data-ink="#eef1f6" className="relative h-[100svh] overflow-hidden bg-night text-paper">
      <div
        data-grid
        className="pointer-events-none absolute inset-0"
        style={{ maskImage: "radial-gradient(ellipse 90% 80% at 60% 45%, #000 40%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 60% 45%, #000 40%, transparent 100%)" }}
      >
        <GridField />
      </div>

      <div data-sink className="relative z-10 flex h-full origin-top flex-col px-5 pb-6 pt-24 sm:px-8 sm:pb-8 sm:pt-28">
        <div className="flex items-start justify-between gap-6 text-sm leading-snug sm:text-[15px]">
          <p data-fade>
            <span className="block font-semibold">{HERO.name}</span>
            <span className="text-mist">{HERO.place}</span>
          </p>
          <p data-fade className="max-w-[18ch] text-right text-mist sm:max-w-none">
            {HERO.status}
          </p>
        </div>

        <h1 className="display mt-auto text-[clamp(2.4rem,10.4vw,13rem)] leading-[0.9]">
          <span className="sr-only">Osanda Senevirathna, interface and brand designer.</span>
          <span aria-hidden="true">
            <Line i={0}>
              <Chars text="Interface" />
              <span data-pop className="relative inline-block h-[0.72em] w-[1.75em] shrink-0 overflow-hidden rounded-full bg-night-2">
                {HERO_COVERS.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    draggable={false}
                    className="absolute inset-0 size-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
                    style={{ opacity: i === idx ? 1 : 0, transform: `scale(${i === idx ? 1 : 1.15})` }}
                  />
                ))}
              </span>
            </Line>
            <Line i={1}>
              <Chars text="& brand" />
              <span data-pop className="inline-grid size-[0.74em] shrink-0 place-items-center rounded-full bg-signal text-paper">
                <span data-nib className="block size-[68%]">
                  <Nib className="block size-full" />
                </span>
              </span>
            </Line>
            <Line i={2}>
              <span className="relative inline-block">
                <Chars text="designer." className="text-ice" />
                {/* Selection frame, like the word is selected in Figma. */}
                <span data-select aria-hidden="true" className="pointer-events-none absolute -inset-x-[0.06em] bottom-[0.02em] top-[0.12em] border border-ice/70">
                  {["-left-[4px] -top-[4px]", "-right-[4px] -top-[4px]", "-left-[4px] -bottom-[4px]", "-right-[4px] -bottom-[4px]"].map((p) => (
                    <span key={p} className={`absolute ${p} size-[7px] border border-ice bg-night`} />
                  ))}
                </span>
              </span>
            </Line>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-6 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
          <p data-fade className="max-w-[40ch] text-base leading-relaxed text-paper/75 sm:text-lg">
            {HERO.sub}
          </p>
          <div data-fade className="flex flex-wrap items-center gap-3">
            <Pill onClick={() => scrollTo("#work")} icon="down" cursor="Scroll">
              See the work
            </Pill>
            <Pill href={hero.secondaryCta.href} tone="ghost" external cursor="PDF">
              CV
            </Pill>
          </div>
        </div>
      </div>
    </section>
  );
}
