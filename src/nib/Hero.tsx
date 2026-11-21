import { lazy, Suspense, useEffect, useRef, type RefObject } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { hero } from "../content";
import { registerReady, useLoaded } from "./store";

// Hero: the LinkedIn cover gradient as a live grain shader, a chrome pen nib
// that points at the visitor's cursor, and a two-line all-caps headline whose
// letters swell in weight near the pen, like pressing harder on a nib.

const sceneImport = import("./HeroScene");
registerReady(sceneImport);
const HeroScene = lazy(() => sceneImport);

const EASE = [0.16, 1, 0.3, 1] as const;
const REDUCED = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const LINES = ["Design with intent,", "build with precision."];
const BASE_W = 600;
const MAX_W = 900;

/** Pen pressure: letters near the pointer gain weight, then relax. */
function usePenPressure(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || REDUCED || !window.matchMedia("(pointer: fine)").matches) return;
    const chars = Array.from(el.querySelectorAll<HTMLElement>("[data-char]"));
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
        cur[i] += (target - cur[i]) * 0.16;
        if (Math.abs(target - cur[i]) > 0.002) moving = true;
        c.style.fontWeight = String(Math.round(BASE_W + (MAX_W - BASE_W) * cur[i]));
      });
      raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      kick();
    };
    const onLeave = () => {
      px = py = -1e4;
      kick();
    };
    const reset = () => {
      centres = [];
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", reset, { passive: true });
    window.addEventListener("resize", reset);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", reset);
      window.removeEventListener("resize", reset);
    };
  }, [root]);
}

function Headline({ loaded }: { loaded: boolean }) {
  return (
    <h1
      data-inspect="h1"
      className="font-display text-[clamp(1.9rem,5.1vw,4.8rem)] leading-[1.02] text-ink"
    >
      <span className="sr-only">Osanda Senevirathna. Design with intent, build with precision.</span>
      {LINES.map((line, li) => {
        const words = line.split(" ");
        return (
          <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={loaded ? { y: "0%" } : undefined}
              transition={{ duration: 1.15, ease: EASE, delay: 0.35 + li * 0.12 }}
            >
              {words.map((word, wi) => (
                <span key={wi} className="inline-block whitespace-nowrap">
                  {word.split("").map((ch, ci) => (
                    <span
                      key={ci}
                      data-char
                      className={`inline-block ${li === 1 && wi === 2 ? "text-accent" : ""}`}
                      style={{ fontWeight: BASE_W }}
                    >
                      {ch}
                    </span>
                  ))}
                  {wi < words.length - 1 ? " " : null}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </h1>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const loaded = useLoaded();
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  usePenPressure(ref);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: loaded ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section
      ref={ref}
      id="top"
      data-inspect="Hero"
      className="relative isolate min-h-[100dvh] overflow-hidden"
      style={{ background: "linear-gradient(135deg, #050a16 10%, #0b3f78 45%, #3aa7d6 60%, #050a16 95%)" }}
    >
      <div className="absolute inset-0 -z-10">
        <Suspense fallback={null}>
          <HeroScene scroll={scrollYProgress} active={inView} />
        </Suspense>
      </div>
      {/* Scrim so the copy reads wherever the light band drifts. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-[65%]"
        style={{ background: "linear-gradient(to top, rgb(5 10 22 / .85), rgb(5 10 22 / .4) 55%, transparent)" }}
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="pointer-events-none relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-end px-5 pb-10 pt-28 sm:px-8 lg:pb-14"
      >
        <motion.p {...fade(0.2)} className="mb-6 text-sm leading-snug">
          <span className="block font-semibold text-ink">Osanda Senevirathna</span>
          <span className="block text-ink/65">Designer and developer in Galle, Sri Lanka</span>
        </motion.p>
        <Headline loaded={loaded} />
        <motion.div
          {...fade(0.75)}
          className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <p data-inspect="p" className="max-w-[46ch] text-base leading-relaxed text-ink/75 md:text-lg">
            {hero.subline}
          </p>
          <div className="pointer-events-auto flex shrink-0 gap-3">
            <a
              href="#work"
              className="rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-on-accent transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              See work
            </a>
            <a
              href={hero.secondaryCta.href}
              target="_blank"
              rel="noreferrer"
              data-cursor="PDF"
              className="rounded-full border border-ink/20 bg-bg/50 px-6 py-3.5 text-sm font-semibold text-ink backdrop-blur-md transition-colors hover:border-ink/50 active:scale-[0.98]"
            >
              Download CV
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
