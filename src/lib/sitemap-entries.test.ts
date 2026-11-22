import { describe, expect, it } from "vitest";
import { absoluteUrl } from "./seo";
import { sitemapEntries } from "./sitemap-entries";

describe("sitemapEntries", () => {
  const entries = sitemapEntries();

  it("lists home + every project for every locale", () => {
    expect(entries).toHaveLength(12);
    expect(entries.map((e) => e.url).sort()).toEqual(
      ["/en", "/vi", ...["en", "vi"].flatMap((l) => ["hadi", "mythiep", "rankdle", "tingtingvac", "tinvid"].map((s) => `/${l}/projects/${s}`))]
        .sort()
        .map(absoluteUrl),
    );
  });
  it("carries hreflang alternates and a stable lastModified", () => {
    const home = entries.find((e) => e.url === absoluteUrl("/vi"));
    expect(home?.alternates?.languages).toMatchObject({ en: absoluteUrl("/en") });
    expect(new Set(entries.map((e) => String(e.lastModified))).size).toBe(1);
  });
});
