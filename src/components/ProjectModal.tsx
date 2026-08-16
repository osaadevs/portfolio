import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "../content";
import { Icon } from "./Icon";
import { EASE, StatusBadge, Tag } from "./ui";
import { useSmoothScroll } from "./SmoothScroll";

type Ctx = { openProject: (p: Project) => void };
const ModalCtx = createContext<Ctx>({ openProject: () => {} });
export const useProjectModal = () => useContext(ModalCtx);

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-4 w-4">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ModalLinks({ project }: { project: Project }) {
  const links = [
    ...(project.liveLink ? [{ label: project.liveLink.label, href: project.liveLink.href, primary: true }] : []),
    ...(project.showRepoLink && project.repoHref ? [{ label: "View repository", href: project.repoHref, primary: false }] : []),
  ];
  if (links.length === 0) return null;
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className={`group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
            link.primary
              ? "bg-accent text-on-accent hover:bg-accent-press"
              : "border border-border bg-bg-elevated text-text-primary hover:border-text-muted"
          }`}
        >
          {link.label}
          <span className="transition-transform group-hover:translate-x-0.5">
            <Icon name="arrow-up-right" className="h-4 w-4" />
          </span>
        </a>
      ))}
    </div>
  );
}

function ModalPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prevActive = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prevActive?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      data-lenis-prevent
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.98 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-2xl border border-border bg-bg-surface outline-none"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-base/70 text-text-secondary backdrop-blur transition-colors hover:border-accent/50 hover:text-accent"
      >
        <CloseIcon />
      </button>

      {/* Media — framed separately with its own thin border, no overlay
          badge (project images carry their own logos/text, so a floating
          pill collided with them). */}
      <div className="p-6 pb-0 sm:p-8 sm:pb-0">
        <div className="aspect-[16/9] overflow-hidden rounded-lg border border-border bg-bg-elevated">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} preview`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="px-6 text-center text-sm text-text-muted">{project.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[1px] text-accent">{project.kind}</p>
        <h2 id="project-modal-title" className="mt-2 text-2xl font-bold text-text-primary sm:text-3xl">
          {project.title}
        </h2>

        {project.award ? (
          <div className="mt-4">
            <StatusBadge reveal={false}>{project.award}</StatusBadge>
          </div>
        ) : null}

        {/* Role — highlighted */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs uppercase tracking-[1px] text-text-muted">Role</span>
          <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            {project.contribution}
          </span>
        </div>

        <p className="mt-6 text-[15px] leading-relaxed text-text-secondary">{project.description}</p>

        {/* Stack */}
        <div className="mt-8">
          <p className="text-xs uppercase tracking-[1px] text-text-muted">Stack</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Tag key={tag} muted={project.tagsUnconfirmed}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>

        <ModalLinks project={project} />
      </div>
    </motion.div>
  );
}

export function ProjectModalProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Project | null>(null);
  const { lockScroll } = useSmoothScroll();

  const openProject = useCallback((p: Project) => setActive(p), []);
  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    lockScroll(!!active);
    return () => lockScroll(false);
  }, [active, lockScroll]);

  return (
    <ModalCtx.Provider value={{ openProject }}>
      {children}
      <AnimatePresence>
        {active ? (
          <motion.div
            key="project-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
            <div className="relative w-full max-w-2xl">
              <ModalPanel project={active} onClose={close} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ModalCtx.Provider>
  );
}
