import { describe, expect, it } from "vitest";
import { getDictionary } from "@/content/dictionary";
import { locales } from "@/lib/i18n/config";
import { buildPaletteItems } from "./palette-items";

describe("buildPaletteItems", () => {
  it.each(locales)("with an email: 6 sections, 5 projects, 4 actions for %s, unique ids", (locale) => {
    const items = buildPaletteItems(locale, getDictionary(locale), "someone@example.com");
    expect(items.filter((i) => i.group === "sections")).toHaveLength(6);
    expect(items.filter((i) => i.group === "projects")).toHaveLength(5);
    expect(items.filter((i) => i.group === "actions")).toHaveLength(4);
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
    for (const item of items) expect(item.label.trim()).not.toBe("");
  });

  it("project ids are the five case-study slugs", () => {
    const ids = buildPaletteItems("en", getDictionary("en")).filter((i) => i.group === "projects").map((i) => i.id);
    expect(ids).toEqual(["project-tingtingvac", "project-rankdle", "project-mythiep", "project-hadi", "project-tinvid"]);
  });

  it("the configured email gives a copy-email action by default", () => {
    expect(buildPaletteItems("vi", getDictionary("vi")).some((i) => i.id === "copy-email")).toBe(true);
  });

  it("without a public email there is no copy-email action at all", () => {
    const items = buildPaletteItems("en", getDictionary("en"), null);
    expect(items.some((i) => i.id === "copy-email")).toBe(false);
    expect(items.filter((i) => i.group === "actions")).toHaveLength(3);
  });

  it("links are locale-prefixed and use the legacy-compatible section id", () => {
    const items = buildPaletteItems("vi", getDictionary("vi"), null);
    expect(items.find((i) => i.id === "section-projects")?.action).toEqual({ kind: "link", href: "/vi#projects" });
    expect(items.find((i) => i.id === "project-hadi")?.action).toEqual({ kind: "link", href: "/vi/projects/hadi" });
  });

  it("language action targets the other locale; copy action carries the email", () => {
    const en = buildPaletteItems("en", getDictionary("en"), "a@b.co");
    expect(en.find((i) => i.id === "switch-language")?.action).toEqual({ kind: "locale", target: "vi" });
    expect(en.find((i) => i.id === "copy-email")?.action).toEqual({ kind: "copy", value: "a@b.co" });
  });
});
