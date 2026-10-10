import { describe, expect, it } from "vitest";
import { localizeNumber } from "./format";

describe("localizeNumber", () => {
  it("keeps the comma for English", () => {
    expect(localizeNumber("en", "4,200+")).toBe("4,200+");
  });
  it("uses a dot for Vietnamese, including several groups", () => {
    expect(localizeNumber("vi", "4,200+")).toBe("4.200+");
    expect(localizeNumber("vi", "1,234,567")).toBe("1.234.567");
  });
  it("leaves numbers without a thousands group and plain text alone", () => {
    expect(localizeNumber("vi", "99")).toBe("99");
    expect(localizeNumber("vi", "v0.5.0 · MIT")).toBe("v0.5.0 · MIT");
    expect(localizeNumber("vi", "1,7")).toBe("1,7");
  });
});
