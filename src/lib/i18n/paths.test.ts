import { describe, expect, it } from "vitest";
import { localeHref, localePath, projectPath, switchLocalePath } from "./paths";

describe("paths", () => {
  it("builds locale and project paths", () => {
    expect(localePath("vi")).toBe("/vi");
    expect(localePath("en", "/projects/hadi")).toBe("/en/projects/hadi");
    expect(projectPath("vi", "hnwedding")).toBe("/vi/projects/hnwedding");
  });
  it("switches the locale segment and keeps the rest", () => {
    expect(switchLocalePath("/vi", "en")).toBe("/en");
    expect(switchLocalePath("/vi/projects/hadi", "en")).toBe("/en/projects/hadi");
    expect(switchLocalePath("/en/", "vi")).toBe("/vi/");
  });
  it("prefixes an unprefixed path", () => {
    expect(switchLocalePath("/", "en")).toBe("/en");
    expect(switchLocalePath("/foo", "en")).toBe("/en/foo");
  });
  it("keeps query string and hash when building the switched href", () => {
    expect(localeHref("/vi/projects/hadi", "?utm=x", "#faq", "en")).toBe("/en/projects/hadi?utm=x#faq");
    expect(localeHref("/vi", "", "", "en")).toBe("/en");
    expect(localeHref("/en", "?a=1&b=2", "", "vi")).toBe("/vi?a=1&b=2");
  });
});
