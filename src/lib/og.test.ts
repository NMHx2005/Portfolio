import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ogText } from "./og";

describe("ogText", () => {
  it("replaces glyphs Inter lacks so they do not render as emoji", () => {
    expect(ogText("Hàn/Nhật ↔ Việt")).toBe("Hàn/Nhật – Việt");
  });
});

describe("og fonts", () => {
  it.each(["latin-400", "vietnamese-400", "latin-600", "vietnamese-600"])("Inter-%s.woff is bundled", (name) => {
    expect(existsSync(join(process.cwd(), "assets/fonts", `Inter-${name}.woff`))).toBe(true);
  });
});
