import { motion } from "framer-motion";
import type { Project } from "../content";
import { Icon } from "./Icon";
import { EASE, fadeUp } from "./ui";

function ProjectLinkRow({ project }: { project: Project }) {
  const links = [
    ...(project.liveLink ? [{ label: project.liveLink.label, href: project.liveLink.href }] : []),
    ...(project.showRepoLink && project.repoHref ? [{ label: "Repo", href: project.repoHref }] : []),
  ];
  if (links.length === 0) return null;
  return (
    <div className="flex items-center gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="group/link inline-flex items-center gap-1 text-accent transition-colors hover:text-text-primary"
        >
          {link.label}
          <motion.span variants={{ rest: { x: 0 }, hover: { x: 3 } }} transition={{ duration: 0.25, ease: EASE }}>
            <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
          </motion.span>
        </a>
      ))}
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      variants={fadeUp}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-bg-surface transition-colors duration-300 hover:border-accent/40"
    >
      {/* Media */}
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-elevated">
        <motion.div
          variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex h-full w-full items-center justify-center"
        >
          {/* Swap for a real <img> export later; alt = project.title */}
          <span className="px-4 text-center text-xs text-text-muted">{project.title}</span>
        </motion.div>
        <span className="absolute left-3 top-3 rounded-full border border-border bg-bg-base/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[1px] text-accent backdrop-blur">
          {project.kind}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-text-primary">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">{project.description}</p>

        <p
          className={`mt-4 text-xs leading-relaxed ${
            project.tagsUnconfirmed ? "italic text-text-muted" : "text-text-muted"
          }`}
        >
          {project.tags.join("  ·  ")}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
          <span className="text-text-muted">{project.contribution}</span>
          <ProjectLinkRow project={project} />
        </div>
      </div>
    </motion.article>
  );
}
