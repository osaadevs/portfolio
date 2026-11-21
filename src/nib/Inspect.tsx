import { useEffect, useReducer, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { setInspect, useInspect } from "./store";

// Inspect mode: the site shows how it was built. Every [data-inspect] block
// gets an outline and its component name; whatever is under the pointer gets
// a devtools-style box model (size, padding, type spec, colour). A token
// panel lists the live palette. Toggle with "I", leave with Esc.

const TOKENS = ["--p-bg", "--p-surface", "--p-elevated", "--p-ink", "--p-muted", "--p-accent", "--p-deep"];

function toHex(c: string) {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return c;
  const [r, g, b, a] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  const hex = "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  return a !== undefined && a < 1 ? `${hex} ${Math.round(a * 100)}%` : hex;
}

const px = (v: string) => Math.round(parseFloat(v) || 0);

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
}

export function useInspectShortcut() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e)) return;
      if (e.key.toLowerCase() === "i") setInspect(!document.documentElement.classList.contains("inspecting"));
      if (e.key === "Escape") setInspect(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

function Overlay() {
  const [, tick] = useReducer((n: number) => n + 1, 0);
  const hover = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      tick();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onMove = (e: PointerEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      hover.current = el && !el.closest("[data-inspect-ui]") ? el : null;
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const blocks = Array.from(document.querySelectorAll<HTMLElement>("[data-inspect]"))
    .map((el) => ({ el, r: el.getBoundingClientRect(), name: el.dataset.inspect! }))
    .filter(({ r }) => r.bottom > 0 && r.top < vh && r.width > 0);

  const h = hover.current;
  const hr = h?.getBoundingClientRect();
  const cs = h ? getComputedStyle(h) : null;
  const hasText = !!h && Array.from(h.childNodes).some((n) => n.nodeType === 3 && n.textContent?.trim());
  const root = getComputedStyle(document.documentElement);
  const gutter = vw < 640 ? 20 : 32;
  const gridW = Math.min(1400, vw) - gutter * 2;
  const gridL = (vw - Math.min(1400, vw)) / 2 + gutter;

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] font-code text-[10.5px] leading-none" aria-hidden="true">
      {/* 12-column grid of the main container */}
      <div className="absolute inset-y-0 grid grid-cols-12 gap-4" style={{ left: gridL, width: gridW }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="h-full bg-accent/[0.05]" />
        ))}
      </div>

      {blocks.map(({ r, name }, i) => (
        <div
          key={i}
          className="absolute border border-dashed border-accent/60"
          style={{ left: r.left, top: r.top, width: r.width, height: r.height }}
        >
          <span className="absolute left-0 top-0 bg-accent px-1 py-0.5 text-on-accent">{`<${name}>`}</span>
        </div>
      ))}

      {h && hr && cs && (
        <>
          {/* padding bands */}
          <div
            className="absolute"
            style={{
              left: hr.left,
              top: hr.top,
              width: hr.width,
              height: hr.height,
              borderStyle: "solid",
              borderColor: "rgb(255 170 60 / .35)",
              borderWidth: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
              outline: "1.5px solid var(--p-accent)",
            }}
          />
          {/* margin redline above */}
          {px(cs.marginTop) > 0 && (
            <div
              className="absolute border-l border-[#ff3b6b]"
              style={{ left: hr.left + hr.width / 2, top: hr.top - px(cs.marginTop), height: px(cs.marginTop) }}
            >
              <span className="absolute left-1 top-1/2 -translate-y-1/2 bg-[#ff3b6b] px-1 py-0.5 text-white">
                {px(cs.marginTop)}
              </span>
            </div>
          )}
          <div
            className="absolute flex flex-col gap-1 bg-[#0b0d12] px-2 py-1.5 text-[#e8eef6] shadow-lg"
            style={{
              left: Math.min(hr.left, vw - 240),
              top: hr.bottom + 8 > vh - 80 ? Math.max(8, hr.top - 70) : hr.bottom + 8,
            }}
          >
            <span>
              <span className="text-[#7fd8f0]">{h.tagName.toLowerCase()}</span>
              {h.dataset.inspect ? <span className="text-[#ffb08c]"> {h.dataset.inspect}</span> : null}
              <span className="text-[#8b97ab]">
                {"  "}
                {Math.round(hr.width)} × {Math.round(hr.height)}
              </span>
            </span>
            {hasText && (
              <span className="text-[#8b97ab]">
                {cs.fontFamily.split(",")[0].replace(/"/g, "")} {px(cs.fontSize)}/{px(cs.lineHeight) || "normal"}{" "}
                w{cs.fontWeight}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-[#8b97ab]">
              <span className="inline-block h-2.5 w-2.5 border border-white/30" style={{ background: cs.color }} />
              {toHex(cs.color)}
              {cs.backgroundColor !== "rgba(0, 0, 0, 0)" && (
                <>
                  <span className="ml-1 inline-block h-2.5 w-2.5 border border-white/30" style={{ background: cs.backgroundColor }} />
                  {toHex(cs.backgroundColor)}
                </>
              )}
            </span>
          </div>
        </>
      )}

      <div
        data-inspect-ui
        className="absolute right-4 top-20 w-52 bg-[#0b0d12]/95 p-3 text-[#e8eef6] shadow-xl"
      >
        <p className="mb-2.5 text-[#8b97ab]">tokens</p>
        <ul className="space-y-1.5">
          {TOKENS.map((t) => {
            const v = root.getPropertyValue(t).trim();
            return (
              <li key={t} className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 border border-white/20" style={{ background: v }} />
                <span className="flex-1 text-[#8b97ab]">{t}</span>
                <span>{v}</span>
              </li>
            );
          })}
        </ul>
        <p className="mb-2 mt-4 text-[#8b97ab]">type</p>
        <p>Zalando Sans Expanded, display</p>
        <p className="mt-1">Geist, text</p>
        <p className="mt-4 text-[#8b97ab]">I or Esc to close</p>
      </div>
    </div>
  );
}

export function Inspect() {
  const on = useInspect();
  useInspectShortcut();
  return (
    <AnimatePresence>
      {on && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <Overlay />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
