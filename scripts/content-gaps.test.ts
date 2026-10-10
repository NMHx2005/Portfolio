import { describe, expect, it } from "vitest";
import { findContentGaps } from "./content-gaps";

const complete = {
  email: "someone@example.com" as string | null,
  portrait: { src: "/portrait.jpg" } as { src: string } | null,
  cv: "/cv/cv.pdf" as string | null,
  projects: [{ slug: "a", hasRole: true, links: { live: "https://a.dev", repo: "https://github.com/x/a" } }],
};

describe("findContentGaps", () => {
  it("reports nothing when every owner input is present and files exist", () => {
    expect(findContentGaps(complete, () => true)).toEqual([]);
  });

  it("reports every missing optional input", () => {
    const gaps = findContentGaps(
      { email: null, portrait: null, cv: null, projects: [{ slug: "a", hasRole: false, links: {} }] },
      () => true,
    );
    expect(gaps.map((g) => g.id)).toEqual([
      "email",
      "portrait",
      "cv",
      "project-a-link",
      "project-a-role",
    ]);
  });

  it("accepts a project that has only a live URL or only a repository", () => {
    for (const links of [{ live: "https://a.dev" }, { repo: "https://github.com/x/a" }]) {
      const gaps = findContentGaps({ ...complete, projects: [{ slug: "a", hasRole: true, links }] }, () => true);
      expect(gaps).toEqual([]);
    }
  });

  it("reports configured files that do not exist on disk", () => {
    expect(findContentGaps(complete, () => false).map((g) => g.id)).toEqual(["portrait-file", "cv-file"]);
  });

  it("rejects a malformed email but treats null as merely 'not provided'", () => {
    expect(findContentGaps({ ...complete, email: "nope" }, () => true).map((g) => g.id)).toEqual(["email-invalid"]);
    expect(findContentGaps({ ...complete, email: null }, () => true).map((g) => g.id)).toEqual(["email"]);
  });
});
