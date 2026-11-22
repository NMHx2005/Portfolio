import { describe, expect, it } from "vitest";
import { siteConfig } from "./site";

describe("siteConfig.contact", () => {
  it("holds the owner-confirmed channels", () => {
    expect(siteConfig.contact.email).toBe("nmhx05@gmail.com");
    expect(siteConfig.contact.zalo).toEqual({ display: "0971 084 430", url: "https://zalo.me/0971084430" });
    expect(siteConfig.contact.phone.href).toBe("tel:+84971084430");
  });
  it("has no CV until the owner supplies one", () => {
    expect(siteConfig.contact.cv).toBeNull();
  });
});
