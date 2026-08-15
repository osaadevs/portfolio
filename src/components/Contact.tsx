import { motion } from "framer-motion";
import { contact } from "../content";
import { Button, ContactRowItem, Reveal, Section, SectionHeader, staggerContainer } from "./ui";

export function Contact() {
  return (
    <Section id="contact" className="border-b-0">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <Reveal>
          <SectionHeader eyebrow={contact.eyebrow} heading={contact.heading} intro={contact.intro} />
          <motion.div
            variants={staggerContainer(0.06)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Button href={contact.primaryCta.href}>{contact.primaryCta.label}</Button>
            <Button href={contact.secondaryCta.href} variant="ghost">
              {contact.secondaryCta.label}
            </Button>
          </motion.div>
        </Reveal>

        <motion.div
          variants={staggerContainer(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="divide-y divide-border border-t border-border lg:border-t-0"
        >
          {contact.rows.map((row) => (
            <ContactRowItem key={row.label} {...row} />
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
