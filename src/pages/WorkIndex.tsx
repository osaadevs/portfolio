import { useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { CATEGORIES, WORKS, type Work } from "../data";
import { REDUCED, ScrollTrigger, gsap, useGSAP } from "../lib";
import { TLink } from "../router";

// The full index. A filter, then a two-column editorial grid where the
// right column sits lower than the left. Every project is a tile in its
// cover's own colour; on hover the cover leans in and a detail card
// slides out from behind it.

function WorkCard({ w, i }: { w: Work; i: number }) {
  return (
    <TLink to={`/work/${w.slug}`} data-cursor="View" className="group block" aria-label={`${w.name}, ${w.kind}`}>
      <div className="relative rounded-[26px] p-3 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1.5 md:rounded-[34px] md:p-4" style={{ background: w.bg, color: w.ink }}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] md:rounded-[24px]">
          <img
            src={w.img}
            alt=""
            draggable={false}
            loading={i > 3 ? "lazy" : undefined}
            className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute -right-2 top-[18%] hidden aspect-[4/5] w-[22%] translate-x-4 rotate-6 overflow-hidden rounded-[18px] opacity-0 shadow-[0_24px_40px_-20px_rgba(0,0,0,0.6)] transition-[transform,opacity] duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0 group-hover:rotate-3 group-hover:opacity-100 md:block"
          style={{ outline: `5px solid ${w.bg}` }}
        >
          <img src={w.img} alt="" className="size-full scale-[2.3] object-cover" style={{ objectPosition: w.focus[0] }} />
        </div>
        <div className="flex items-end justify-between gap-4 px-2 pb-2 pt-5 md:px-3 md:pt-6">
          <div>
            <h2 className="display text-[clamp(1.6rem,3vw,2.8rem)]">{w.name}</h2>
            <p className="mt-2 text-sm opacity-70">{w.kind}</p>
          </div>
          <span className="grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-current/25 transition-colors duration-500 group-hover:bg-current/10">
            <svg viewBox="0 0 24 24" className="size-[18px] -rotate-45 transition-transform duration-500 group-hover:rotate-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </TLink>
  );
}

export default function WorkIndex() {
  const root = useRef<HTMLElement>(null);
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const list = cat === "All" ? WORKS : WORKS.filter((w) => w.category === cat);
  const count = (c: (typeof CATEGORIES)[number]) => (c === "All" ? WORKS.length : WORKS.filter((w) => w.category === c).length);

  useGSAP(
    () => {
      if (REDUCED) return;
      gsap.from(gsap.utils.toArray("[data-rise]", root.current), { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: 0.2 });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-ink="#eef1f6" className="relative min-h-[100svh] rounded-b-[40px] bg-night pb-28 pt-28 text-paper md:rounded-b-[64px] md:pt-36">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <h1 className="display text-[clamp(3.4rem,13vw,13rem)] md:col-span-8">
            <span className="line-mask">
              <span data-rise className="block">
                Work<sup className="ml-2 align-super text-[0.22em] tracking-normal text-ice">({String(WORKS.length).padStart(2, "0")})</sup>
              </span>
            </span>
          </h1>
          <p className="max-w-[36ch] text-paper/65 md:col-span-4 md:pb-6 md:text-lg">
            Product interfaces, visual identities and photography for clients, competitions and self-initiated concepts.
          </p>
        </div>

        <LayoutGroup>
          <div className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 md:mx-0 md:mt-14 md:px-0" role="tablist" aria-label="Filter projects">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={cat === c}
                onClick={() => {
                  setCat(c);
                  requestAnimationFrame(() => ScrollTrigger.refresh());
                }}
                className={`relative shrink-0 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${cat === c ? "text-night" : "text-paper/70 hover:text-paper"}`}
              >
                {cat === c && <motion.span layoutId="work-filter" className="absolute inset-0 rounded-full bg-ice" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative">
                  {c} <span className="opacity-60">{count(c)}</span>
                </span>
              </button>
            ))}
          </div>

          <motion.ul layout className="mt-10 grid gap-x-6 gap-y-10 md:mt-14 md:grid-cols-2 md:gap-x-8 md:gap-y-16">
            <AnimatePresence mode="popLayout">
              {list.map((w, i) => (
                <motion.li
                  key={w.slug}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 5) * 0.05 }}
                  className={i % 2 === 1 ? "md:translate-y-[22%]" : ""}
                >
                  <WorkCard w={w} i={i} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      </div>
    </section>
  );
}
