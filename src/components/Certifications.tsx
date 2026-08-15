import { certifications } from "../content";
import { Button, CertCard, Reveal, Section, SectionHeader } from "./ui";

export function Certifications() {
  return (
    <Section id="certifications">
      <Reveal>
        <SectionHeader eyebrow={certifications.eyebrow} heading={certifications.heading} />
      </Reveal>

      <Reveal className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
        {certifications.certs.map((cert) => (
          <CertCard key={cert.title} {...cert} />
        ))}
      </Reveal>

      <div className="mt-14">
        <h3 className="text-lg font-semibold text-text-primary">Achievements</h3>
        <Reveal className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {certifications.achievements.map((item) => (
            <CertCard key={item.title} as="h4" {...item} />
          ))}
        </Reveal>
      </div>

      <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-lg border border-accent/40 bg-bg-surface p-8 sm:flex-row sm:items-center">
        <div>
          <h4 className="text-xl font-semibold text-text-primary">{certifications.resumeBand.title}</h4>
          <p className="mt-2 text-sm text-text-secondary">{certifications.resumeBand.body}</p>
        </div>
        <Button href={certifications.resumeBand.href} download>
          {certifications.resumeBand.cta}
        </Button>
      </div>
    </Section>
  );
}
