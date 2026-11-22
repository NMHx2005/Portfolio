import { describe, expect, it } from "vitest";
import { projectSlugs, projectsData } from "./projects";
import { heroFigures } from "./stats";

describe("heroFigures", () => {
  it("derives every hero figure from project data", () => {
    expect(heroFigures()).toEqual({ live: 3, total: 7, sameClient: 3, rankdleDays: 13 });
  });

  it("counts live from statuses, so a status change moves the figure", () => {
    expect(heroFigures().live).toBe(projectSlugs.filter((s) => projectsData[s].status === "live").length);
  });
});
