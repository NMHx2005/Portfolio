import { describe, expect, it } from "vitest";
import { formatPeriod } from "./format";

describe("formatPeriod", () => {
  it("shows an open period as running until now", () => {
    expect(formatPeriod("vi", "2026-10-20")).toBe("10/2026 – nay");
    expect(formatPeriod("en", "2026-10-20")).toBe("Oct 2026 – present");
  });
  it("shows a closed period with both months", () => {
    expect(formatPeriod("vi", "2026-06-30", "2026-08-10")).toBe("06/2026 – 08/2026");
    expect(formatPeriod("en", "2026-06-30", "2026-08-10")).toBe("Jun 2026 – Aug 2026");
  });
});
