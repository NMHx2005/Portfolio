import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content/dictionary";
import { projectsData } from "@/content/projects";
import {
  absoluteUrl,
  alternatesFor,
  homeMetadata,
  personJsonLd,
  projectJsonLd,
  projectMetadata,
  serializeJsonLd,
} from "./seo";

describe("alternatesFor", () => {
  it("emits self-canonical plus hreflang for both locales and x-default=vi", () => {
    const alt = alternatesFor("en", (l) => `/${l}`);
    expect(alt.canonical).toBe(absoluteUrl("/en"));
    expect(alt.languages).toEqual({
      vi: absoluteUrl("/vi"),
      en: absoluteUrl("/en"),
      "x-default": absoluteUrl("/vi"),
    });
  });
});

describe("metadata", () => {
  it("home metadata is localized and self-canonical", () => {
    const m = homeMetadata("vi");
    expect(m.alternates?.canonical).toBe(absoluteUrl("/vi"));
    expect(m.openGraph).toMatchObject({ locale: "vi_VN", url: absoluteUrl("/vi") });
  });
  it("project metadata points at the project path in each locale", () => {
    const m = projectMetadata("en", "hadi");
    expect(m.alternates?.canonical).toBe(absoluteUrl("/en/projects/hadi"));
    expect(m.alternates?.languages).toMatchObject({ vi: absoluteUrl("/vi/projects/hadi") });
    expect(String(m.title)).toContain("Hadi");
  });
  it("project titles are the name plus the platform in each locale", () => {
    for (const locale of ["vi", "en"] as const) {
      const copy = getDictionary(locale).work.items.hadi;
      const m = projectMetadata(locale, "hadi");
      expect(m.title).toBe(`${copy.title} — ${copy.platform}`);
      expect(m.openGraph?.title).toBe(m.title);
      expect(m.twitter?.title).toBe(m.title);
    }
  });
});

describe("json-ld", () => {
  it("person has the Software Engineer title and omits email when none is configured", () => {
    const p = personJsonLd("vi", { email: null });
    expect(p["@type"]).toBe("Person");
    expect(p.jobTitle).toBe("Software Engineer");
    expect("image" in p).toBe(false);
    expect("email" in p).toBe(false);
  });
  it("person includes the email once it is configured", () => {
    expect(personJsonLd("en", { email: "hi@example.com" }).email).toBe("mailto:hi@example.com");
  });
  it("person uses the configured email and lists GitHub only in sameAs", () => {
    const p = personJsonLd("en");
    expect(p.email).toBe(`mailto:${siteConfig.contact.email}`);
    expect(p.sameAs).toEqual([siteConfig.contact.github]);
  });
  it("project json-ld references the localized url", () => {
    const g = projectJsonLd("en", "mythiep") as { "@graph": Record<string, unknown>[] };
    const creative = g["@graph"].find((n) => n["@type"] === "CreativeWork");
    expect(creative?.url).toBe(absoluteUrl("/en/projects/mythiep"));
  });
  it("project json-ld is a CreativeWork with the cover URL and keywords limited to the stack", () => {
    const g = projectJsonLd("vi", "rankdle") as { "@graph": Record<string, unknown>[] };
    const creative = g["@graph"].find((n) => n["@type"] === "CreativeWork");
    expect(creative?.image).toBe(absoluteUrl(projectsData.rankdle.cover.src));
    expect(String(creative?.keywords).split(", ")).toEqual(projectsData.rankdle.stack);
  });
  it("serialization escapes < so a value can never close the script tag", () => {
    expect(serializeJsonLd({ a: "</script><b>" })).not.toContain("</script>");
  });
});
