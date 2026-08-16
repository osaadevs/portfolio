import { motion } from "framer-motion";
import type { Project } from "../content";
import { Icon } from "./Icon";
import { TechIcon } from "./TechIcon";
import { TAG_ICON_MAP } from "./techIconData";
import { EASE, StatusBadge } from "./ui";
import { useProjectModal } from "./ProjectModal";

// Compact icon row — just the marks for tags that have one, so the card stays
// light and the full labelled stack lives in the modal.
function TechRow({ tags }: { tags: string[] }) {
  const withIcons = tags.filter((t) => t in TAG_ICON_MAP);
  if (withIcons.length === 0) return null;
  return (
    <div className="flex items-center gap-2">
      {withIcons.map((tag) => (
        <span
          key={tag}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-bg-elevated"
          title={tag}
        >
          <TechIcon label={tag} className="h-3.5 w-3.5" />
        </span>
      ))}
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const { openProject } = useProjectModal();

  return (
    <motion.button
      type="button"
      onClick={() => openProject(project)}
      aria-label={`View details for ${project.title}`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
      }}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg-surface text-left transition-colors duration-300 hover:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {/* Media */}
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-elevated">
        <motion.div
          variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex h-full w-full items-center justify-center"
        >
          <span className="px-4 text-center text-xs text-text-muted">{project.title}</span>
        </motion.div>
        <span className="absolute left-3 top-3 rounded-full border border-border bg-bg-base/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[1px] text-accent backdrop-blur">
          {project.kind}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-text-primary">{project.title}</h3>

        {project.award ? (
          <div className="mt-3">
            <StatusBadge compact reveal={false}>
              {project.award}
            </StatusBadge>
          </div>
        ) : null}

        <div className="mt-4 flex-1">
          <TechRow tags={project.tags} />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs">
          <span className="text-text-muted">{project.contribution}</span>
          <span className="inline-flex items-center gap-1 font-medium text-accent">
            View details
            <motion.span variants={{ rest: { x: 0 }, hover: { x: 3 } }} transition={{ duration: 0.25, ease: EASE }}>
              <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
            </motion.span>
          </span>
        </div>
      </div>
    </motion.button>
  );
}
