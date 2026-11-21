import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { allProjects, type GroupedProject } from "../content";
import { useProjectModal } from "../components/ProjectModal";
import { shortTitle } from "./featured";

// /projects: every project in an asymmetric grid. Filters slide a shared
// highlight between pills; cards re-flow with layout animation. Hovering a
// card "selects" it with the same corner handles used on the home artboards.

const GROUPS = ["All", "Product", "Creative", "Technical"] as const;
type Group = (typeof GROUPS)[number];

// Alternating spans give the grid rhythm: wide, narrow / narrow, wide.
const SPANS = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

const ACRONYMS: Record<string, string> = { oop: "OOP", "ui/ux": "UI/UX", "c++": "C++" };
const sentence = (s: string) =>
  (s.charAt(0) + s.slice(1).toLowerCase()).replace(/(^|\s)(oop|ui\/ux|c\+\+)(?=\s|$)/gi, (_, sp, w) => sp + ACRONYMS[w.toLowerCase()]);

function Card({ p, span }: { p: GroupedProject; span: string }) {
  const { openProject } = useProjectModal();
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`col-span-12 ${span}`}
    >
      <button
        type="button"
        onClick={() => openProject(p)}
        data-cursor="View"
        className="group block w-full text-left"
        aria-label={`Open ${p.title}`}
      >
        <div className="relative">
          <div className="overflow-hidden border border-line bg-surface">
            {p.image ? (
              <img
                src={p.image}
                alt=""
                loading="lazy"
                className="aspect-[16/9] w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
              />
            ) : (
              <div className="grid aspect-[16/9] place-items-center font-display text-2xl text-faint">
                {shortTitle(p.title)}
              </div>
            )}
          </div>
          {/* Selection handles on hover */}
          <span className="pointer-events-none absolute -inset-1.5 border border-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {[
            "left-[-6px] top-[-6px]",
            "right-[-6px] top-[-6px]",
            "bottom-[-6px] left-[-6px]",
            "bottom-[-6px] right-[-6px]",
          ].map((pos) => (
            <span
              key={pos}
              className={`pointer-events-none absolute ${pos} h-2 w-2 -translate-x-[1px] -translate-y-[1px] scale-0 border border-accent bg-bg transition-transform duration-300 group-hover:scale-100`}
            />
          ))}
        </div>
        <div className="mt-4 flex items-start justify-between gap-6">
          <div>
            <h2 className="font-display text-[clamp(1.15rem,1.7vw,1.6rem)] leading-tight transition-colors group-hover:text-accent">
              {shortTitle(p.title)}
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              {sentence(p.kind)}, {p.contribution.toLowerCase()}
            </p>
          </div>
          {p.award && <span className="shrink-0 text-xs text-accent">Award</span>}
        </div>
      </button>
    </motion.li>
  );
}

export function AllWork() {
  const [group, setGroup] = useState<Group>("All");
  const counts = useMemo(
    () => Object.fromEntries(GROUPS.map((g) => [g, g === "All" ? allProjects.length : allProjects.filter((p) => p.group === g).length])),
    [],
  );
  const visible = group === "All" ? allProjects : allProjects.filter((p) => p.group === group);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main data-inspect="AllWork" className="mx-auto max-w-[1400px] px-5 pb-10 pt-32 sm:px-8 md:pt-40">
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <h1 className="font-display text-[clamp(2.6rem,8vw,7rem)] leading-[0.92] md:col-span-7">
          All work
          <sup className="ml-2 align-super font-sans text-[0.22em] font-medium text-muted">{allProjects.length}</sup>
        </h1>
        <LayoutGroup>
          <div
            role="tablist"
            aria-label="Filter projects"
            className="flex flex-wrap gap-1 md:col-span-5 md:justify-end md:pb-3"
          >
            {GROUPS.map((g) => {
              const on = g === group;
              return (
                <button
                  key={g}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setGroup(g)}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${on ? "text-on-accent" : "text-muted hover:text-ink"}`}
                >
                  {on && (
                    <motion.span
                      layoutId="work-filter"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">
                    {g} <span className={on ? "opacity-60" : "text-faint"}>{counts[g]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>

      <motion.ul layout className="mt-14 grid grid-cols-12 gap-x-6 gap-y-14 md:mt-20 md:gap-x-8 md:gap-y-20">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <Card key={p.title} p={p} span={SPANS[i % SPANS.length]} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </main>
  );
}
