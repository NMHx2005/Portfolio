import { describe, expect, it } from "vitest";
import { findContentGaps } from "./content-gaps";

const complete = {
  email: "someone@example.com" as string | null,
  zalo: { url: "https://zalo.me/0900000000" } as { url: string } | null,
  cv: "/cv/cv.pdf" as string | null,
  projects: [{ slug: "a", status: "live", links: { live: "https://a.dev" } }],
};

describe("findContentGaps", () => {
  it("reports nothing when every owner input is present and files exist", () => {
    expect(findContentGaps(complete, () => true)).toEqual([]);
  });

  it("reports every missing optional input", () => {
    const gaps = findContentGaps(
      { email: null, zalo: null, cv: null, projects: [{ slug: "a", status: "live", links: {} }] },
      () => true,
    );
    expect(gaps.map((g) => g.id)).toEqual(["email", "zalo", "cv", "project-a-link"]);
  });

  it("does not ask for a link on a project that is not live", () => {
    for (const status of ["launching", "forSale"])
      expect(findContentGaps({ ...complete, projects: [{ slug: "a", status, links: {} }] }, () => true)).toEqual([]);
  });

  it("reports a configured CV file that does not exist on disk", () => {
    expect(findContentGaps(complete, () => false).map((g) => g.id)).toEqual(["cv-file"]);
  });

  it("rejects a malformed email but treats null as merely 'not provided'", () => {
    expect(findContentGaps({ ...complete, email: "nope" }, () => true).map((g) => g.id)).toEqual(["email-invalid"]);
    expect(findContentGaps({ ...complete, email: null }, () => true).map((g) => g.id)).toEqual(["email"]);
  });
});
