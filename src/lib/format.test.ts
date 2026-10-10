import { describe, expect, it } from "vitest";
import { formatMonthYear } from "./format";

describe("formatMonthYear", () => {
  it("formats in the requested locale and is timezone-stable", () => {
    expect(formatMonthYear("en", "2026-10-10")).toBe("October 2026");
    expect(formatMonthYear("vi", "2026-10-10")).toMatch(/10.*2026/);
    expect(formatMonthYear("en", "2026-01-01")).toBe("January 2026");
  });
});
