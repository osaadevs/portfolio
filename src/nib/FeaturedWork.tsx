import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useProjectModal } from "../components/ProjectModal";
import { FEATURED, shortTitle, type Featured } from "./featured";

// Three lead projects as artboards in a sticky stack. Each one is tinted by
// its own image (a blurred copy glows behind it), the pen "selects" the image
// with a Figma-style frame, and the facts sit in a short spec list.

const DESKTOP = "(min-width: 768px) and (min-height: 620px)";
function useDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(DESKTOP);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(DESKTOP).matches,
  );
}

function SelectionFrame() {
  const corners = [
    [0, 0],
    [100, 0],
    [0, 100],
    [100, 100],
  ];
  const view = { amount: 0.5 } as const;
  return (
    <div className="pointer-events-none absolute -inset-2" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
        <motion.rect
          width="100"
          height="100"
          fill="none"
          stroke="var(--p-accent)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={view}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
      {corners.map(([l, t], i) => (
        <motion.span
          key={i}
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 border border-accent bg-bg"
          style={{ left: `${l}%`, top: `${t}%` }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={view}
          transition={{ delay: 0.9 + i * 0.05, type: "spring", stiffness: 500, damping: 22 }}
        />
      ))}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-faint">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>
  );
}

function Artboard({
  item,
  index,
  total,
  progress,
}: {
  item: Featured;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const { openProject } = useProjectModal();
  const { project } = item;
  const stack = useDesktop();
  const last = index === total - 1 || !stack;
  // Input ranges stay inside 0..1 (scroll timelines reject anything else).
  const step = 1 / (total - 1);
  const start = Math.min(index * step, 1 - step);
  const end = Math.min(start + step, 1);
  const scale = useTransform(progress, [start, end], last ? [1, 1] : [1, 0.9]);
  const dim = useTransform(progress, [start, end], last ? [0, 0] : [0, 0.6]);
  const tools = project.tagsUnconfirmed ? null : project.tags.slice(0, 4).join(", ");

  return (
    <div
      className={`flex justify-center px-3 sm:px-5 ${
        stack ? "sticky top-0 h-[100dvh] items-center pb-6 pt-[84px]" : "py-2"
      }`}
    >
      <motion.article
        data-inspect="Artboard"
        style={{ scale }}
        className="relative w-full max-w-[1400px] origin-top overflow-hidden border border-line bg-surface md:max-h-full"
      >
        {/* Ambient tint from the project's own image. */}
        <img
          src={project.image}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-30 blur-3xl saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-surface/40 via-surface/80 to-surface" />

        <div className="relative grid grid-cols-1 gap-8 p-5 sm:p-8 md:grid-cols-12 md:gap-10 md:p-10 lg:p-12">
          <div className="relative self-center md:col-span-7 lg:col-span-8">
            <button
              type="button"
              onClick={() => openProject(project)}
              data-cursor="View"
              className="group relative block w-full overflow-hidden"
              aria-label={`Open ${project.title}`}
            >
              <img
                src={project.image}
                alt=""
                className="aspect-[16/9] w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
              />
            </button>
            <SelectionFrame />
          </div>

          <div className="flex flex-col justify-between gap-8 md:col-span-5 lg:col-span-4">
            <div>
              <p className="text-sm text-accent">{item.meta}</p>
              <h3 data-inspect="h3" className="mt-3 font-display text-[clamp(1.6rem,2.5vw,2.5rem)] leading-[1.05]">
                {shortTitle(project.title)}
              </h3>
              <p data-inspect="p" className="mt-4 max-w-[42ch] leading-relaxed text-muted">
                {item.line}
              </p>
            </div>
            <div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                <Spec label="Role" value={item.role} />
                {tools && <Spec label="Tools" value={tools} />}
                {project.award && (
                  <div className="col-span-2">
                    <Spec label="Recognition" value={project.award.replace(" — ", ", ")} />
                  </div>
                )}
              </dl>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openProject(project)}
                  className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  View project
                </button>
                {project.liveLink && (
                  <a
                    href={project.liveLink.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="Open"
                    className="rounded-full border border-line px-5 py-3 text-sm font-semibold transition-colors hover:border-ink/40"
                  >
                    {project.liveLink.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <motion.div className="pointer-events-none absolute inset-0 bg-bg" style={{ opacity: dim }} />
      </motion.article>
    </div>
  );
}

export function FeaturedWork() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="work" data-inspect="FeaturedWork" className="relative">
      <div className="mx-auto grid max-w-[1400px] gap-6 px-5 pb-8 pt-28 sm:px-8 md:grid-cols-12 md:items-end md:pt-40">
        <h2 className="font-display text-[clamp(2.4rem,6.5vw,6rem)] leading-[0.95] md:col-span-8">Selected work</h2>
        <p className="max-w-[40ch] leading-relaxed text-muted md:col-span-4 md:pb-2">
          Product, interface and identity work. Open any project for the full story.
        </p>
      </div>
      <div ref={ref} className="relative">
        {FEATURED.map((item, i) => (
          <Artboard key={item.project.title} item={item} index={i} total={FEATURED.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
