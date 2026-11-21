import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { work, type Project } from "../content";
import { useProjectModal } from "../components/ProjectModal";

// Everything beyond the three lead projects, as a typographic index. On fine
// pointers the project image rides along with the cursor; on touch the
// thumbnail sits inline so nothing depends on hover.

const FEATURED_TITLES = new Set([
  work.product.projects[0].title,
  work.product.projects[1].title,
  work.creative.projects[2].title,
]);

const ROWS: Project[] = [...work.creative.projects, ...work.product.projects, ...work.technical.projects].filter(
  (p) => !p.hidden && !FEATURED_TITLES.has(p.title),
);

const ACRONYMS: Record<string, string> = { oop: "OOP", "ui/ux": "UI/UX", "c++": "C++" };
const sentence = (s: string) =>
  (s.charAt(0) + s.slice(1).toLowerCase()).replace(/(^|\s)(oop|ui\/ux|c\+\+)(?=\s|$)/gi, (_, sp, w) => sp + ACRONYMS[w.toLowerCase()]);

export function WorkIndex() {
  const { openProject } = useProjectModal();
  const [hover, setHover] = useState<Project | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28 });
  const sy = useSpring(y, { stiffness: 260, damping: 28 });
  const vx = useMotionValue(0);
  const rot = useSpring(vx, { stiffness: 150, damping: 15 });

  return (
    <section
      data-inspect="WorkIndex"
      className="relative mx-auto max-w-[1400px] px-5 py-28 sm:px-8 md:py-40"
      onPointerMove={(e) => {
        vx.set(Math.max(-8, Math.min(8, (e.clientX - x.get()) * 0.15)));
        x.set(e.clientX);
        y.set(e.clientY);
      }}
    >
      <div className="mb-10 flex items-end justify-between gap-6">
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.6rem)] leading-[1] tracking-[-0.01em]">
          More work
        </h2>
        <Link to="/projects" className="text-sm font-semibold underline decoration-line underline-offset-4 hover:decoration-ink">
          All projects
        </Link>
      </div>

      <ul onPointerLeave={() => setHover(null)}>
        {ROWS.map((p) => (
          <li key={p.title} className="border-t border-line last:border-b">
            <button
              type="button"
              onClick={() => openProject(p)}
              onPointerEnter={() => setHover(p)}
              onFocus={() => setHover(p)}
              onBlur={() => setHover(null)}
              data-cursor="View"
              className="group grid w-full grid-cols-1 items-center gap-4 py-6 text-left md:grid-cols-12 md:py-8"
            >
              {p.image && (
                <img src={p.image} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover md:hidden" />
              )}
              <span className="font-display text-[clamp(1.6rem,4vw,3.4rem)] leading-[1.02] tracking-[-0.01em] transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:text-accent md:col-span-8">
                {p.title.split(" — ")[0]}
              </span>
              <span className="text-sm text-muted md:col-span-4 md:text-right">
                {sentence(p.kind)}
                <span className="text-faint">, {p.contribution.toLowerCase()}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[50] hidden w-[min(34vw,460px)] md:block"
        style={{ x: sx, y: sy, rotate: rot, translateX: "-50%", translateY: "-55%" }}
      >
        <AnimatePresence>
          {hover?.image && (
            <motion.img
              key={hover.image}
              src={hover.image}
              alt=""
              className="absolute inset-x-0 top-0 aspect-[16/9] w-full object-cover shadow-[0_30px_80px_-20px_rgb(0_0_0/0.45)]"
              initial={{ opacity: 0, scale: 0.85, clipPath: "inset(50% 0 50% 0)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0 0% 0)" }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
