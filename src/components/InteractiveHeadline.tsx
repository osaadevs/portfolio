import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { EASE } from "./ui";

/**
 * The hero headline, rendered letter-by-letter so the type itself is the
 * interaction: letters swell, lift and glow as the cursor passes over them.
 *
 * Two nested spans per letter on purpose — the outer one is owned by
 * framer-motion (staggered entrance), the inner one is mutated directly in a
 * rAF loop (cursor response). Mixing both on one element would mean framer
 * and the loop fighting over `transform`.
 *
 * Deliberately animates transform + text-shadow only, NOT font-weight. A
 * variable-weight axis changes each glyph's advance width, so bolder letters
 * shove their neighbours sideways — the line visibly jitters while you sweep
 * across it, and any cached geometry goes stale the moment it happens.
 * Transforms never reflow, so letter positions can be measured once and
 * trusted, and the per-frame loop does zero layout reads. The only rect read
 * is one per pointermove, on the wrapper.
 */

const RADIUS = 190; // px of cursor influence
const SCALE = 0.16; // peak growth
const LIFT = 10; // px
const GLOW = 26; // px blur at peak

type Piece = { char: string; emphasis: boolean };

function parseLine(line: string): Piece[] {
  // "build with **Passion**." -> per-character pieces flagged by emphasis
  const segments = line.split(/\*\*(.+?)\*\*/g);
  const out: Piece[] = [];
  segments.forEach((seg, i) => {
    const emphasis = i % 2 === 1;
    for (const char of seg) out.push({ char, emphasis });
  });
  return out;
}

export function InteractiveHeadline({ lines }: { lines: string[] }) {
  const wrapRef = useRef<HTMLHeadingElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const parsed = useMemo(() => lines.map(parseLine), [lines]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Cached letter centres, relative to the wrapper. Measured from rects
    // rather than offsetLeft/offsetTop: the letters sit inside nested
    // inline-block spans, so offsetParent resolution is easy to get subtly
    // wrong, whereas rects are absolute. Any live transform is cleared first
    // so a scaled-up glyph doesn't report an inflated box.
    let centres: ({ x: number; y: number } | null)[] = [];
    const measure = () => {
      const prev = letterRefs.current.map((el) => el?.style.transform ?? "");
      letterRefs.current.forEach((el) => el && (el.style.transform = ""));
      const wrapRect = wrap.getBoundingClientRect();
      centres = letterRefs.current.map((el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.left - wrapRect.left + r.width / 2,
          y: r.top - wrapRect.top + r.height / 2,
        };
      });
      letterRefs.current.forEach((el, i) => el && (el.style.transform = prev[i]));
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    // The staggered entrance translates each letter, so anything measured
    // while it plays is offset. Re-measure once it has settled.
    const settleTimer = window.setTimeout(measure, 1600);

    const ro = new ResizeObserver(measure);
    ro.observe(wrap);

    const pointer = { x: -9999, y: -9999, active: false };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    // Track on the window so the effect starts before the cursor is literally
    // over a glyph — the headline reacts as you approach it.
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    // Eased per-letter state so movement glides instead of snapping.
    const current = new Float32Array(letterRefs.current.length);
    let raf = 0;

    const frame = () => {
      for (let i = 0; i < letterRefs.current.length; i++) {
        const el = letterRefs.current[i];
        const c = centres[i];
        if (!el || !c) continue;

        let target = 0;
        if (pointer.active) {
          const d = Math.hypot(c.x - pointer.x, c.y - pointer.y);
          target = Math.max(0, 1 - d / RADIUS);
          target *= target; // ease the falloff so the peak stays tight
        }

        current[i] += (target - current[i]) * 0.12;
        const t = current[i];
        if (t < 0.002) {
          el.style.transform = "";
          el.style.textShadow = "";
          continue;
        }
        el.style.transform = `translate3d(0, ${(-t * LIFT).toFixed(2)}px, 0) scale(${(1 + t * SCALE).toFixed(3)})`;
        el.style.textShadow = `0 0 ${(t * GLOW).toFixed(1)}px rgba(31, 139, 255, ${(t * 0.55).toFixed(3)})`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settleTimer);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [parsed]);

  // Continuous index across all lines so refs line up with the cached centres.
  let index = -1;

  // Per-letter spans would be announced one character at a time, so the
  // accessible name comes from the label and the glyphs are hidden.
  const plain = lines.map((l) => l.replace(/\*\*/g, "")).join(" ");

  return (
    <motion.h1
      ref={wrapRef}
      aria-label={plain}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.022, delayChildren: 0.1 } } }}
      className="relative font-extrabold leading-[0.95] tracking-[-0.04em] text-text-primary text-[clamp(2.5rem,9vw,7.5rem)]"
    >
      {parsed.map((pieces, lineIdx) => (
        <span key={lineIdx} className="block" aria-hidden="true">
          {pieces.map((piece, i) => {
            index++;
            const at = index;
            if (piece.char === " ") {
              // Non-interactive spacer, but still consumes an index slot so
              // refs and cached centres stay aligned.
              letterRefs.current[at] = null;
              return (
                <span key={i} className="inline-block w-[0.25em]" aria-hidden="true">
                  {" "}
                </span>
              );
            }
            return (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: "0.35em" },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
                className="inline-block"
              >
                <span
                  ref={(el) => {
                    letterRefs.current[at] = el;
                  }}
                  className={`inline-block will-change-transform ${piece.emphasis ? "text-accent" : ""}`}
                >
                  {piece.char}
                </span>
              </motion.span>
            );
          })}
        </span>
      ))}
    </motion.h1>
  );
}
