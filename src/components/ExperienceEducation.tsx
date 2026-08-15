import { experienceEducation as ee } from "../content";
import type { TimelineItem } from "../content";
import { Reveal, Section, TimelineEntry, fadeUp, staggerContainer } from "./ui";
import { motion } from "framer-motion";

function Timeline({ title, entries }: { title: string; entries: TimelineItem[] }) {
  return (
    <div>
      <h3 className="text-2xl font-bold text-text-primary">{title}</h3>
      <motion.ol
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-6 space-y-8 border-t border-border pt-8"
      >
        {entries.map((entry) => (
          <TimelineEntry key={`${entry.role}-${entry.period}`} {...entry} />
        ))}
      </motion.ol>
    </div>
  );
}

export function ExperienceEducation() {
  return (
    <Section id="experience">
      <Reveal>
        {/* No separate display heading was given for this section in the
            content doc — the eyebrow doubles as the h2 so heading order
            stays unbroken (h1 hero -> h2 sections -> h3 timeline columns). */}
        <motion.h2 variants={fadeUp} className="text-[13px] font-semibold uppercase tracking-[2px] text-accent">
          {ee.eyebrow}
        </motion.h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-14 lg:grid-cols-2">
        <Timeline title={ee.experience.title} entries={ee.experience.entries} />
        <Timeline title={ee.education.title} entries={ee.education.entries} />
      </div>
    </Section>
  );
}
