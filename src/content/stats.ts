import { buildingData, buildingSlugs, projectSlugs, projectsData } from "./projects";

export interface HeroFigures {
  live: number;
  total: number;
  sameClient: number;
  rankdleDays: number;
}

const DAY_MS = 86_400_000;

export function heroFigures(): HeroFigures {
  const { started, launched } = projectsData.rankdle;
  if (!launched) throw new Error("Rankdle needs a launch date for the hero figure");
  return {
    live: projectSlugs.filter((slug) => projectsData[slug].status === "live").length,
    total: projectSlugs.length + buildingSlugs.length,
    sameClient:
      projectSlugs.filter((slug) => projectsData[slug].clientGroup === "hadi").length +
      buildingSlugs.filter((slug) => buildingData[slug].clientGroup === "hadi").length,
    rankdleDays: Math.round((Date.parse(launched) - Date.parse(started)) / DAY_MS),
  };
}
