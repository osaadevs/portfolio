import { motion } from "framer-motion";
import { experienceEducation as ee } from "../content";
import type { TimelineItem } from "../content";
import { EASE, Eyebrow, Reveal, Section, fadeUp, staggerContainer } from "./ui";

function isPresent(period: string) {
  return /present/i.test(period);
}

function Timeline({ title, entries }: { title: string; entries: TimelineItem[] }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-text-primary">{title}</h3>

      <motion.ol
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative mt-8 pl-8"
      >
        {/* Continuous rail, drawn from the top on scroll-in */}
        <motion.span
          aria-hidden="true"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="absolute left-[6px] top-2 bottom-2 w-px origin-top bg-border"
        />

        {entries.map((entry) => (
          <motion.li key={`${entry.role}-${entry.period}`} variants={fadeUp} className="relative pb-9 last:pb-0">
            {/* Node */}
            <span
              className={`absolute -left-8 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 bg-bg-base ${
                isPresent(entry.period) ? "border-accent" : "border-border"
              }`}
            >
              {isPresent(entry.period) ? <span className="h-1.5 w-1.5 rounded-full bg-accent" /> : null}
            </span>

            <p className="text-xs font-semibold uppercase tracking-[1px] text-text-muted">{entry.period}</p>
            <h4 className="mt-1.5 text-base font-semibold text-text-primary">{entry.role}</h4>
            {entry.org ? <p className="mt-0.5 text-sm text-accent">{entry.org}</p> : null}
            {entry.note ? (
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{entry.note}</p>
            ) : null}
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}

export function ExperienceEducation() {
  return (
    <Section id="experience">
      <Reveal>
        {/* Eyebrow doubles as the section h2 so heading order stays h1 -> h2 -> h3. */}
        <motion.h2 variants={fadeUp}>
          <Eyebrow>{ee.eyebrow}</Eyebrow>
        </motion.h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-14 lg:grid-cols-2">
        <Timeline title={ee.experience.title} entries={ee.experience.entries} />
        <Timeline title={ee.education.title} entries={ee.education.entries} />
      </div>
    </Section>
  );
}
