import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "./dictionary";
import { projectSlugs, projectsData } from "./projects";

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, shape(v)]),
    );
  }
  return typeof value;
}

describe("dictionaries", () => {
  it("vi and en have identical structure (keys, array lengths, value types)", () => {
    expect(shape(getDictionary("en"))).toEqual(shape(getDictionary("vi")));
  });

  it("never contains blank strings — optional fields are omitted, not emptied", () => {
    const walk = (v: unknown, path: string) => {
      if (typeof v === "string") expect(v.trim(), path).not.toBe("");
      else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
      else if (v && typeof v === "object")
        Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`));
    };
    for (const l of locales) walk(getDictionary(l), l);
  });

  it("nav ids match section ids that exist", () => {
    for (const l of locales) {
      const d = getDictionary(l);
      for (const item of d.nav) expect(d.sections[item.id]).toBeDefined();
    }
  });

  it("legacy section ids are preserved", () => {
    expect(Object.keys(getDictionary("vi").sections).sort()).toEqual(
      ["about", "contact", "faq", "process", "projects", "services"],
    );
  });
});

describe("projects", () => {
  it("every project has copy in every locale with at least 3 technical choices", () => {
    for (const l of locales) {
      const d = getDictionary(l);
      for (const slug of projectSlugs) {
        expect(d.work.items[slug], `${l}/${slug}`).toBeDefined();
        expect(d.work.items[slug].choices.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("optional rationale is either absent or non-blank, identically in both locales", () => {
    for (const slug of projectSlugs) {
      const vi = getDictionary("vi").work.items[slug].choices;
      const en = getDictionary("en").work.items[slug].choices;
      vi.forEach((choice, i) => {
        expect(Boolean(choice.why), `${slug}[${i}].why`).toBe(Boolean(en[i]?.why));
        expect(Boolean(choice.tradeoff), `${slug}[${i}].tradeoff`).toBe(Boolean(en[i]?.tradeoff));
      });
      expect(Boolean(getDictionary("vi").work.items[slug].role)).toBe(
        Boolean(getDictionary("en").work.items[slug].role),
      );
    }
  });

  it("cover images exist on disk", () => {
    for (const slug of projectSlugs) {
      const file = join(process.cwd(), "public", projectsData[slug].image.src);
      expect(existsSync(file), file).toBe(true);
    }
  });

  it("links, when present, are absolute https URLs", () => {
    for (const slug of projectSlugs) {
      for (const url of Object.values(projectsData[slug].links)) {
        if (url) expect(url).toMatch(/^https:\/\//);
      }
    }
  });

  it("metric keys all have a translated label", () => {
    for (const l of locales) {
      const d = getDictionary(l);
      for (const slug of projectSlugs)
        for (const m of projectsData[slug].metrics)
          expect(d.work.metricLabels[m.key], `${l}/${m.key}`).toBeTruthy();
    }
  });
});
