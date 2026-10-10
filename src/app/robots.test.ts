import { describe, expect, it } from "vitest";
import { getSiteUrl } from "@/lib/site-url";
import robots from "./robots";

describe("robots", () => {
  it("allows everything and points at the sitemap on the canonical site url", () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(r.sitemap).toBe(`${getSiteUrl()}/sitemap.xml`);
  });
});
