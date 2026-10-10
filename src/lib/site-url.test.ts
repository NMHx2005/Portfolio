import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "./site-url";

afterEach(() => vi.unstubAllEnvs());

describe("getSiteUrl", () => {
  it("falls back to the configured url", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl()).toBe("https://www.nmhx.info");
  });
  it("uses the env override and strips trailing slashes", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.com//");
    expect(getSiteUrl()).toBe("https://preview.example.com");
  });
});
