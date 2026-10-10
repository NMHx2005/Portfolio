import { describe, expect, it } from "vitest";
import { hasLocalePrefix, pickLocale, resolveRedirect } from "./negotiate";

describe("pickLocale", () => {
  it("prefers a valid cookie over the header", () => {
    expect(pickLocale("en", "vi")).toBe("en");
  });
  it("ignores an invalid cookie and uses the header", () => {
    expect(pickLocale("fr", "en-US,en;q=0.9")).toBe("en");
  });
  it("honours q-values regardless of order", () => {
    expect(pickLocale(undefined, "vi;q=0.5,en;q=0.9")).toBe("en");
  });
  it("skips q=0 entries", () => {
    expect(pickLocale(undefined, "en;q=0, vi;q=0.1")).toBe("vi");
  });
  it("falls back to vi for wildcard, unknown, empty and missing headers", () => {
    expect(pickLocale(undefined, "*")).toBe("vi");
    expect(pickLocale(undefined, "fr-FR,de;q=0.8")).toBe("vi");
    expect(pickLocale(undefined, "")).toBe("vi");
    expect(pickLocale(undefined, null)).toBe("vi");
  });
});

describe("hasLocalePrefix", () => {
  it("matches only whole segments", () => {
    expect(hasLocalePrefix("/vi")).toBe(true);
    expect(hasLocalePrefix("/vi/")).toBe(true);
    expect(hasLocalePrefix("/en/projects/hadi")).toBe(true);
    expect(hasLocalePrefix("/vietnam")).toBe(false);
    expect(hasLocalePrefix("/english")).toBe(false);
    expect(hasLocalePrefix("/")).toBe(false);
  });
});

describe("resolveRedirect", () => {
  it("redirects the root to the negotiated locale", () => {
    expect(resolveRedirect({ pathname: "/", search: "" })).toBe("/vi");
    expect(resolveRedirect({ pathname: "/", search: "", cookie: "en" })).toBe("/en");
  });
  it("preserves path and query string", () => {
    expect(
      resolveRedirect({ pathname: "/projects/hadi", search: "?utm=x", acceptLanguage: "en" }),
    ).toBe("/en/projects/hadi?utm=x");
  });
  it("treats /vietnam as an unprefixed path (no loop)", () => {
    expect(resolveRedirect({ pathname: "/vietnam", search: "" })).toBe("/vi/vietnam");
  });
  it("returns null when already prefixed", () => {
    expect(resolveRedirect({ pathname: "/vi/", search: "" })).toBeNull();
    expect(resolveRedirect({ pathname: "/en/projects/hadi", search: "?a=1" })).toBeNull();
  });
});
