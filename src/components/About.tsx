import { motion } from "framer-motion";
import { about, hero } from "../content";
import { EASE, FactCard, Reveal, Section, SectionHeader, fadeUp, staggerContainer } from "./ui";

export function About() {
  return (
    <Section id="about">
      <Reveal className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeader eyebrow={about.eyebrow} heading={about.heading} />
          <motion.div variants={fadeUp} className="mt-10 hidden max-w-sm lg:block">
            <motion.div
              whileHover={{ rotate: -1, scale: 1.01 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden rounded-xl border border-border bg-bg-surface"
            >
              <img
                src="/portrait.jpg"
                alt="Osanda Senevirathna"
                width={900}
                height={900}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            </motion.div>
            <div className="mt-4">
              <p className="text-lg font-semibold text-text-primary">{hero.name}</p>
              <p className="text-sm text-text-secondary">{hero.title}</p>
            </div>
          </motion.div>
        </div>
        <div className="space-y-5 pt-1 lg:pt-16">
          {about.body.map((paragraph, i) => (
            <motion.p key={i} variants={fadeUp} className="text-lg leading-[1.75] text-text-secondary">
              {paragraph}
            </motion.p>
          ))}
        </div>
      </Reveal>

      <motion.dl
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {about.facts.map((fact) => (
          <FactCard key={fact.label} label={fact.label} value={fact.value} />
        ))}
      </motion.dl>
    </Section>
  );
}
