import { Link } from "react-router-dom";
import type { Project } from "../content";
import { work } from "../content";
import { Icon } from "./Icon";
import { ProjectCard } from "./ProjectCard";
import { Reveal, Section, SectionHeader } from "./ui";

function ViewAllLink() {
  return (
    <Link
      to="/projects"
      className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-bg-surface px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-accent/50 hover:text-accent"
    >
      View all projects
      <span className="transition-transform group-hover:translate-x-0.5">
        <Icon name="arrow-up-right" className="h-4 w-4" />
      </span>
    </Link>
  );
}

const grid = "mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3";

function ProjectGrid({ projects }: { projects: Project[] }) {
  const visible = projects.filter((p) => !p.hidden);
  return (
    <Reveal className={grid} stagger={0.08}>
      {visible.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </Reveal>
  );
}

export function Work() {
  return (
    <Section id="work">
      {/* Creative */}
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader heading={work.creative.heading} intro={work.creative.intro} />
          <ViewAllLink />
        </div>
      </Reveal>
      <ProjectGrid projects={work.creative.projects} />

      {/* Product & Interface Design */}
      <Reveal className="mt-16">
        <SectionHeader heading={work.product.heading} intro={work.product.intro} />
      </Reveal>
      <ProjectGrid projects={work.product.projects} />

      {/* Technical */}
      <Reveal className="mt-16">
        <SectionHeader heading={work.technical.heading} intro={work.technical.intro} />
      </Reveal>
      <ProjectGrid projects={work.technical.projects} />
    </Section>
  );
}
