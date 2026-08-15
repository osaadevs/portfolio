import { skills } from "../content";
import { Reveal, Section, SectionHeader, SkillCard } from "./ui";

export function Skills() {
  return (
    <Section id="skills">
      <Reveal>
        <SectionHeader eyebrow={skills.eyebrow} heading={skills.heading} />
      </Reveal>

      <Reveal className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3" stagger={0.06}>
        {skills.groups.map((group) => (
          <SkillCard key={group.title} title={group.title} tags={group.tags} />
        ))}
      </Reveal>
    </Section>
  );
}
