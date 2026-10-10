import { describe, expect, it } from "vitest";
import { getDictionary } from "./dictionary";
import { projectSlugs, projectsData } from "./projects";

const numberOf = (text: string) => Number(text.replace(/[^\d]/g, ""));
const total = (key: "commits" | "testFiles") =>
  projectSlugs.reduce((sum, slug) => sum + numberOf(projectsData[slug].metrics.find((m) => m.key === key)?.value ?? "0"), 0);

// The hero numbers are approximate claims, but they must stay in step with the project figures they summarise.
describe("hero stats", () => {
  const en = getDictionary("en").hero.stats.map((s) => s.value);
  const vi = getDictionary("vi").hero.stats.map((s) => s.value);

  it("counts every featured project", () => {
    expect(numberOf(en[0] ?? "")).toBe(projectSlugs.length);
  });

  it("sums commits and test files over the projects (each figure is a floor, shown with a +)", () => {
    expect(numberOf(en[1] ?? "")).toBe(total("commits"));
    expect(numberOf(en[2] ?? "")).toBe(total("testFiles"));
    expect(en[1]).toMatch(/\+$/);
    expect(en[2]).toMatch(/\+$/);
  });

  it("shows the same figures in Vietnamese, only with a dot as thousands separator", () => {
    expect(vi.map((v) => v.replace(/\./g, ","))).toEqual(en);
  });
});
