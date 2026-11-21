import { work, type Project } from "../content";
import { registerReady } from "./store";

// The three lead projects, shared by the hero deck and the featured stack.
export type Featured = { project: Project; line: string; meta: string; role: string };

export const FEATURED: Featured[] = [
  {
    project: work.product.projects[0],
    line: "If a mother loses the paper record book, her medical history goes with it. This concept keeps it in the cloud.",
    meta: "UI/UX concept",
    role: "UI design",
  },
  {
    project: work.product.projects[1],
    line: "A full redesign of the website for a nature inspired villa, rebuilt from scratch.",
    meta: "Web design and build",
    role: "Solo, design and build",
  },
  {
    project: work.creative.projects[2],
    line: "Theme colours, typography and key visuals that ran across two hackathon campaigns.",
    meta: "Visual identity",
    role: "Lead designer",
  },
];

export const FEATURED_TITLES = new Set(FEATURED.map((f) => f.project.title));

/** "hackX 11.0 & hackX Jr 9.0" stays as is; "Taskora — Task…" drops the subtitle. */
export const shortTitle = (t: string) => t.split(" — ")[0];

// Warm the cache so the hero deck and artboards never pop in empty.
FEATURED.forEach(({ project }) => {
  if (!project.image) return;
  const img = new Image();
  img.src = project.image;
  registerReady(img.decode());
});
