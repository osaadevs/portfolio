import { motion } from "framer-motion";
import type { Project } from "../content";
import { Icon } from "./Icon";
import { Tag, fadeUp } from "./ui";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      variants={fadeUp}
      initial="rest"
      whileHover="hover"
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-bg-surface transition-colors duration-300 hover:border-accent/40"
    >
      <div className="m-5 mb-0 h-[200px] overflow-hidden rounded-lg bg-bg-elevated">
        <motion.div
          variants={{ rest: { scale: 1 }, hover: { scale: 1.03 } }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex h-full w-full items-center justify-center"
        >
          <span className="px-4 text-center text-sm text-text-muted">{project.title} — image pending</span>
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold tracking-[1px] text-accent">{project.kind}</p>
        <h3 className="mt-3 text-2xl font-bold text-text-primary">{project.title}</h3>
        <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-text-secondary">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag} muted={project.tagsUnconfirmed}>
              {tag}
            </Tag>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="text-text-muted">{project.contribution}</span>
          <div className="flex gap-4">
            {project.liveLink ? (
              <a
                href={project.liveLink.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-accent hover:text-text-primary"
              >
                {project.liveLink.label}
                <motion.span variants={{ rest: { x: 0 }, hover: { x: 4 } }} transition={{ duration: 0.2 }}>
                  <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
                </motion.span>
              </a>
            ) : null}
            {project.showRepoLink && project.repoHref ? (
              <a
                href={project.repoHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-accent hover:text-text-primary"
              >
                Repo
                <motion.span variants={{ rest: { x: 0 }, hover: { x: 4 } }} transition={{ duration: 0.2 }}>
                  <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
                </motion.span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
