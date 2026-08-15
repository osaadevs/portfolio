import { work } from "../content";
import { ProjectCard } from "./ProjectCard";
import { Reveal, Section, SectionHeader } from "./ui";

export function Work() {
  return (
    <Section id="work">
      <Reveal>
        <SectionHeader heading={work.creative.heading} intro={work.creative.intro} />
      </Reveal>
      <Reveal className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2" stagger={0.08}>
        {work.creative.projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </Reveal>

      <Reveal className="mt-20">
        <SectionHeader heading={work.technical.heading} intro={work.technical.intro} />
      </Reveal>
      <Reveal className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2" stagger={0.08}>
        {work.technical.projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </Reveal>
    </Section>
  );
}
