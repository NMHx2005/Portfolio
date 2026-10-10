import { describe, expect, it } from "vitest";
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
});

describe("json-ld", () => {
  it("person has Product Engineer and omits image and email when neither is configured", () => {
    const p = personJsonLd("vi", { portrait: null, email: null });
    expect(p["@type"]).toBe("Person");
    expect(p.jobTitle).toBe("Product Engineer");
    expect("image" in p).toBe(false);
    expect("email" in p).toBe(false);
  });
  it("person includes image and email once they are configured", () => {
    const p = personJsonLd("en", { portrait: { src: "/portrait.webp", width: 800, height: 800 }, email: "hi@example.com" });
    expect(p.image).toBe(absoluteUrl("/portrait.webp"));
    expect(p.email).toBe("mailto:hi@example.com");
  });
  it("project json-ld references the localized url", () => {
    const g = projectJsonLd("en", "hnwedding") as { "@graph": Record<string, unknown>[] };
    const creative = g["@graph"].find((n) => n["@type"] === "CreativeWork");
    expect(creative?.url).toBe(absoluteUrl("/en/projects/hnwedding"));
  });
  it("serialization escapes < so a value can never close the script tag", () => {
    expect(serializeJsonLd({ a: "</script><b>" })).not.toContain("</script>");
  });
});
