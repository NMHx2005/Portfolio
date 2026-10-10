import type { MetricKey, ProjectKind, ProjectSlug } from "./types";

export interface ProjectData {
  slug: ProjectSlug;
  kind: ProjectKind;
  stack: string[];
  links: { live?: string; repo?: string };
  image: { src: string; width: number; height: number };
  metrics: { key: MetricKey; value: string }[];
}

export const projectSlugs: ProjectSlug[] = ["mythiep", "hadi", "crossweave"];

export function isProjectSlug(value: string): value is ProjectSlug {
  return (projectSlugs as string[]).includes(value);
}

// Figures come from the repositories and the live sites as of `siteConfig.contentUpdated`:
// commit counts are rounded down, and the template count is the one the live catalog shows.
export const projectsData: Record<ProjectSlug, ProjectData> = {
  mythiep: {
    slug: "mythiep",
    kind: "web",
    stack: ["Next.js 16", "React 19", "TypeScript", "Prisma 7", "PostgreSQL", "Auth.js", "Puck", "SePay", "Cloudflare R2", "Redis", "Sentry"],
    links: { live: "https://mythiep.com" },
    image: { src: "/projects/mythiep-cover.webp", width: 1280, height: 800 },
    metrics: [
      { key: "templates", value: "51" },
      { key: "migrations", value: "75" },
      { key: "commits", value: "1,700+" },
    ],
  },
  hadi: {
    slug: "hadi",
    kind: "mobile",
    stack: ["React Native", "Expo", "TypeScript", "Firebase", "Soniox", "Next.js", "SQLite"],
    links: { live: "https://hadilanguage.com" },
    image: { src: "/projects/hadi-cover.webp", width: 1280, height: 800 },
    metrics: [
      { key: "languages", value: "3" },
      { key: "version", value: "1.3.2" },
      { key: "commits", value: "1,800+" },
    ],
  },
  crossweave: {
    slug: "crossweave",
    kind: "tool",
    stack: ["TypeScript", "Bun", "Electron", "Vite", "Git worktrees"],
    links: { repo: "https://github.com/NMHx2005/crossweave" },
    image: { src: "/projects/crossweave-cover.webp", width: 1280, height: 800 },
    metrics: [
      { key: "version", value: "0.5.0" },
      { key: "commits", value: "700+" },
      { key: "license", value: "MIT" },
    ],
  },
};
