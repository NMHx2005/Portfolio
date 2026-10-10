import { describe, expect, it } from "vitest";
import { absoluteUrl } from "./seo";
import { sitemapEntries } from "./sitemap-entries";

describe("sitemapEntries", () => {
  const entries = sitemapEntries();

  it("lists home + every project for every locale", () => {
    expect(entries.map((e) => e.url).sort()).toEqual(
      [
        "/en",
        "/en/projects/crossweave",
        "/en/projects/hadi",
        "/en/projects/mythiep",
        "/vi",
        "/vi/projects/crossweave",
        "/vi/projects/hadi",
        "/vi/projects/mythiep",
      ].map(absoluteUrl),
    );
  });
  it("carries hreflang alternates and a stable lastModified", () => {
    const home = entries.find((e) => e.url === absoluteUrl("/vi"));
    expect(home?.alternates?.languages).toMatchObject({ en: absoluteUrl("/en") });
    expect(new Set(entries.map((e) => String(e.lastModified))).size).toBe(1);
  });
});
