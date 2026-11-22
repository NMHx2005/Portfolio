import type { BuildingSlug, ProjectSlug, ServiceKind } from "./types";

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  frame: "browser" | "phone";
}

export interface ProjectData {
  slug: ProjectSlug;
  status: "live" | "launching" | "forSale";
  started: string;
  launched?: string;
  ended?: string;
  clientGroup?: "hadi";
  services: ServiceKind[];
  stack: string[];
  links: { live?: string };
  cover: ProjectImage;
  gallery: ProjectImage[];
}

export interface BuildingData {
  slug: BuildingSlug;
  status: "building" | "testBuild";
  clientGroup: "hadi";
  services: ServiceKind[];
}

// Newest first. Facts come from the projects' repositories and live sites as of `siteConfig.contentUpdated`.
export const projectSlugs: ProjectSlug[] = ["tingtingvac", "rankdle", "mythiep", "hadi", "tinvid"];
export const buildingSlugs: BuildingSlug[] = ["classnote", "hanyu"];
export const serviceKinds: ServiceKind[] = ["web", "webapp", "mobile", "ai"];

export function isProjectSlug(value: string): value is ProjectSlug {
  return (projectSlugs as string[]).includes(value);
}

const browser = (src: string): ProjectImage => ({ src, width: 1600, height: 1000, frame: "browser" });
const phone = (src: string): ProjectImage => ({ src, width: 780, height: 1688, frame: "phone" });

export const projectsData: Record<ProjectSlug, ProjectData> = {
  tingtingvac: {
    slug: "tingtingvac",
    status: "launching",
    started: "2026-10-20",
    services: ["web", "webapp", "mobile"],
    stack: ["Flutter", "Node.js", "TypeScript", "PostgreSQL 16", "Next.js 16", "Docker", "Firebase"],
    links: {},
    cover: browser("/projects/tingtingvac/cover.webp"),
    gallery: [browser("/projects/tingtingvac/g1.webp"), browser("/projects/tingtingvac/g2.webp")],
  },
  rankdle: {
    slug: "rankdle",
    status: "live",
    started: "2026-10-23",
    launched: "2026-11-05",
    services: ["webapp"],
    stack: ["React Router 7", "Cloudflare Workers", "Cloudflare D1", "Cloudflare R2", "Mux", "Amazon SES", "Sentry"],
    links: { live: "https://doanrankmlbbft.com" },
    cover: browser("/projects/rankdle/cover.webp"),
    gallery: [browser("/projects/rankdle/g1.webp"), browser("/projects/rankdle/g2.webp")],
  },
  mythiep: {
    slug: "mythiep",
    status: "live",
    started: "2026-08-27",
    services: ["web", "webapp"],
    stack: ["Next.js", "Prisma", "PostgreSQL", "Redis", "Cloudflare R2", "SePay", "Sentry", "Docker"],
    links: { live: "https://mythiep.com" },
    cover: browser("/projects/mythiep/cover.webp"),
    gallery: [browser("/projects/mythiep/g1.webp"), phone("/projects/mythiep/g2.webp")],
  },
  hadi: {
    slug: "hadi",
    status: "live",
    started: "2026-07-16",
    clientGroup: "hadi",
    services: ["web", "mobile", "ai"],
    stack: ["React Native", "Expo", "Firebase", "Cloud Functions", "SQLite", "Next.js", "Soniox stt-rt-v6"],
    links: { live: "https://hadilanguage.com" },
    cover: browser("/projects/hadi/cover.webp"),
    gallery: [1, 2, 3, 4, 5].map((n) => phone(`/projects/hadi/g${n}.webp`)),
  },
  tinvid: {
    slug: "tinvid",
    status: "forSale",
    started: "2026-06-30",
    ended: "2026-08-10",
    services: ["ai"],
    stack: ["Python", "FastAPI", "React", "Remotion", "Claude", "ElevenLabs"],
    links: { live: "https://tinvid.com" },
    cover: browser("/projects/tinvid/cover.webp"),
    gallery: [],
  },
};

export const buildingData: Record<BuildingSlug, BuildingData> = {
  classnote: { slug: "classnote", status: "building", clientGroup: "hadi", services: ["mobile"] },
  hanyu: { slug: "hanyu", status: "testBuild", clientGroup: "hadi", services: ["mobile", "ai"] },
};

/** Products that prove a kind of work: case studies first, then those in development. ServicesSection puts running ones ahead. */
export function provenBy(kind: ServiceKind): (ProjectSlug | BuildingSlug)[] {
  return [
    ...projectSlugs.filter((slug) => projectsData[slug].services.includes(kind)),
    ...buildingSlugs.filter((slug) => buildingData[slug].services.includes(kind)),
  ];
}
