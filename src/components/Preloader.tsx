import { useEffect, useState } from "react";
import { hero } from "../content";
import { HyperText } from "./HyperText";
import { useSmoothScroll } from "./SmoothScroll";

// Split-reveal preloader, adapted from animata.design's "split-reveal"
// registry item down to what this single-page site actually needs: no
// image-preload task queue, just a bright loading beat before the screen
// splits open. Reuses SmoothScroll's lockScroll (it already knows how to
// pause Lenis) instead of the registry's own body-position scroll lock.

type Phase = "loading" | "fade" | "reveal" | "done";

const HOLD_MS = 1200;
const FADE_MS = 320;
const REVEAL_MS = 950;

// Dark ink for the light preloader stage — the site's own text tokens are
// tuned for the dark theme and read too faint on white.
const INK = "#141517";

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [percent, setPercent] = useState(0);
  const { lockScroll } = useSmoothScroll();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    lockScroll(true);

    const timers: number[] = [];
    let raf = 0;

    if (reduce) {
      timers.push(window.setTimeout(() => setPhase("done"), 200));
    } else {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / HOLD_MS);
        setPercent(Math.round(t * 100));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      timers.push(
        window.setTimeout(() => {
          setPhase("fade");
          timers.push(
            window.setTimeout(() => {
              setPhase("reveal");
              timers.push(window.setTimeout(() => setPhase("done"), REVEAL_MS));
            }, FADE_MS),
          );
        }, HOLD_MS),
      );
    }

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === "done") lockScroll(false);
  }, [phase, lockScroll]);

  if (phase === "done") return null;

  const revealing = phase === "reveal";
  const contentHidden = phase !== "loading";
  const revealAnim = `${REVEAL_MS}ms cubic-bezier(0.76,0,0.24,1) forwards`;

  return (
    <div className="fixed inset-0 z-[200] touch-none overscroll-none" aria-hidden="true">
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-white"
        style={revealing ? { animation: `preloader-shutter-top ${revealAnim}` } : undefined}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-white"
        style={revealing ? { animation: `preloader-shutter-bottom ${revealAnim}` } : undefined}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 transition-opacity duration-300 ease-out"
        style={{ opacity: contentHidden ? 0 : 1 }}
      >
        <div className="flex flex-col items-center gap-2">
          <HyperText
            as="p"
            duration={900}
            className="font-mono text-lg font-bold uppercase tracking-[3px] sm:text-2xl sm:tracking-[4px]"
            style={{ color: INK }}
          >
            {hero.name}
          </HyperText>
          <p
            className="font-mono text-[11px] font-medium uppercase tracking-[3px]"
            style={{ color: "rgba(20, 21, 23, 0.45)" }}
          >
            Design meets development
          </p>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <div className="h-[3px] w-56 overflow-hidden rounded-full bg-black/10">
            <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
          </div>
          <p
            className="font-mono text-[11px] font-medium uppercase tracking-[2px]"
            style={{ color: "rgba(20, 21, 23, 0.45)" }}
          >
            Loading <span className="tabular-nums">{percent}%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
