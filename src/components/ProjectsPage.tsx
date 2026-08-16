import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { allProjects, projectsPage } from "../content";
import { Icon } from "./Icon";
import { ProjectCard } from "./ProjectCard";
import { Container, Eyebrow, SplitHeading, staggerContainer } from "./ui";

type Filter = (typeof projectsPage.filters)[number];

export function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>("All");

  const visible = useMemo(
    () => (filter === "All" ? allProjects : allProjects.filter((p) => p.group === filter)),
    [filter],
  );

  return (
    <main className="pb-24 pt-32 md:pt-36">
      <Container>
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
        >
          <span className="rotate-180 transition-transform group-hover:-translate-x-0.5">
            <Icon name="arrow-up-right" className="h-4 w-4" />
          </span>
          Back to home
        </Link>

        <div className="mt-8">
          <Eyebrow>{projectsPage.eyebrow}</Eyebrow>
          <div className="mt-4">
            <SplitHeading text={projectsPage.heading} as="h1" />
          </div>
          <p className="mt-5 max-w-xl text-lg text-text-secondary">{projectsPage.intro}</p>
        </div>

        {/* Filter */}
        <div className="mt-8 flex flex-wrap gap-2">
          {projectsPage.filters.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-accent bg-accent text-on-accent"
                    : "border-border bg-bg-surface text-text-secondary hover:border-text-muted hover:text-text-primary"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <motion.div
          key={filter}
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate="show"
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </motion.div>
      </Container>
    </main>
  );
}
