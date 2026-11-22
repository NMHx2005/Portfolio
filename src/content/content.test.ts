import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "./dictionary";
import { buildingSlugs, isProjectSlug, projectSlugs, projectsData, provenBy } from "./projects";

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

  it("every phone number written into a dictionary is the one in siteConfig", () => {
    // Digits only, with the country code folded into the leading 0, so "+84 971 084 430" and "0971 084 430" agree.
    const digits = (text: string) => text.replace(/\D/g, "").replace(/^84/, "0");
    const expected = digits(siteConfig.contact.phone.display);
    expect(expected).toMatch(/^0\d{9}$/);
    for (const locale of locales) {
      const found = JSON.stringify(getDictionary(locale)).match(/(?:\+84[ .]?|\b0)\d(?:[ .]?\d){8}/g) ?? [];
      expect(found.length, locale).toBeGreaterThan(0);
      for (const number of found) expect(digits(number), `${locale}: ${number}`).toBe(expected);
    }
  });

  it("keeps the client's Vietnamese legal name in both locales", () => {
    for (const locale of locales) expect(getDictionary(locale).work.items.tingtingvac.client).toBe("Công ty TNHH Liên Phong Group");
  });

  it("says the Hadi app translates in both directions, in the summary and in the delivered list", () => {
    const direction = { en: /both directions/, vi: /hai chiều/ };
    for (const locale of locales) {
      const hadi = getDictionary(locale).work.items.hadi;
      expect(hadi.summary).toMatch(direction[locale]);
      expect(hadi.delivered.join(" ")).toMatch(direction[locale]);
    }
  });

  it("has the labels of the for-sale link and of the hero strip control in both locales", () => {
    const en = getDictionary("en");
    const vi = getDictionary("vi");
    expect([en.work.askSource, vi.work.askSource]).toEqual(["Ask about the source code", "Hỏi mua mã nguồn"]);
    expect([en.hero.stripPause, vi.hero.stripPause]).toEqual(["Pause the screenshots", "Dừng dải ảnh"]);
    expect([en.hero.stripGroupLabel, vi.hero.stripGroupLabel]).toEqual(["Product screenshots", "Ảnh chụp sản phẩm"]);
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
  it("every case study has the required facts in both locales", () => {
    for (const l of locales)
      for (const slug of projectSlugs) {
        const c = getDictionary(l).work.items[slug];
        for (const key of ["title", "client", "platform", "summary", "coverAlt"] as const)
          expect(c[key].trim(), `${l}/${slug}.${key}`).not.toBe("");
        expect(c.delivered.length, `${l}/${slug}`).toBeGreaterThanOrEqual(3);
        expect(c.galleryAlt.length).toBe(projectsData[slug].gallery.length);
      }
  });

  it("optional rationale is either absent or non-blank, identically in both locales", () => {
    for (const slug of projectSlugs) {
      const vi = getDictionary("vi").work.items[slug].choices ?? [];
      const en = getDictionary("en").work.items[slug].choices ?? [];
      expect(vi.length).toBe(en.length);
      vi.forEach((choice, i) => {
        expect(Boolean(choice.why), `${slug}[${i}].why`).toBe(Boolean(en[i]?.why));
        expect(Boolean(choice.tradeoff), `${slug}[${i}].tradeoff`).toBe(Boolean(en[i]?.tradeoff));
      });
    }
  });

  it("a public link exists only for live or for-sale projects", () => {
    for (const slug of projectSlugs)
      if (projectsData[slug].links.live) expect(["live", "forSale"]).toContain(projectsData[slug].status);
  });

  it("links, when present, are absolute https URLs", () => {
    for (const slug of projectSlugs)
      for (const url of Object.values(projectsData[slug].links)) if (url) expect(url).toMatch(/^https:\/\//);
  });

  it("every image file exists and declares the agreed size", () => {
    for (const slug of projectSlugs)
      for (const img of [projectsData[slug].cover, ...projectsData[slug].gallery]) {
        expect(existsSync(join(process.cwd(), "public", img.src)), img.src).toBe(true);
        expect([img.width, img.height]).toEqual(img.frame === "phone" ? [780, 1688] : [1600, 1000]);
      }
  });

  it("in-development items are not case studies", () => {
    for (const slug of buildingSlugs) expect(isProjectSlug(slug)).toBe(false);
  });

  it("each service is proven by at least one product", () => {
    for (const kind of ["web", "webapp", "mobile", "ai"] as const) expect(provenBy(kind).length).toBeGreaterThan(0);
  });

  it("no price and no student wording anywhere", () => {
    const text = JSON.stringify([getDictionary("vi"), getDictionary("en")]).toLowerCase();
    for (const banned of ["sinh viên", "student", "triệu", "vnd", "₫"]) expect(text).not.toContain(banned);
  });
});
