import type { MetricKey, ProjectKind, ProjectSlug } from "./types";

export interface ProjectData {
  slug: ProjectSlug;
  kind: ProjectKind;
  stack: string[];
  links: { live?: string; repo?: string };
  image: { src: string; width: number; height: number };
  metrics: { key: MetricKey; value: string }[];
}

export const projectSlugs: ProjectSlug[] = ["hnwedding", "hadi"];

export function isProjectSlug(value: string): value is ProjectSlug {
  return (projectSlugs as string[]).includes(value);
}

export const projectsData: Record<ProjectSlug, ProjectData> = {
  hnwedding: {
    slug: "hnwedding",
    kind: "web",
    stack: ["Next.js 16", "TypeScript", "Prisma 7", "PostgreSQL", "Auth.js", "PayOS", "Cloudflare R2", "Resend"],
    links: {},
    image: { src: "/projects/hnwedding-cover.png", width: 1280, height: 960 },
    metrics: [
      { key: "themes", value: "4+" },
      { key: "migrations", value: "16" },
      { key: "commits", value: "159+" },
    ],
  },
  hadi: {
    slug: "hadi",
    kind: "mobile",
    stack: ["React Native", "Expo", "TypeScript", "Firebase", "Soniox", "Gemini", "SQLite"],
    links: {},
    image: { src: "/projects/hadi-cover.png", width: 1280, height: 960 },
    metrics: [
      { key: "languages", value: "3" },
      { key: "version", value: "V6" },
      { key: "commits", value: "332+" },
    ],
  },
};
