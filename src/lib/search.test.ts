import { describe, expect, it } from "vitest";
import { matchesQuery, normalizeSearch } from "./search";

describe("normalizeSearch", () => {
  it("strips Vietnamese diacritics and maps đ/Đ to d", () => {
    expect(normalizeSearch("Dự án")).toBe("du an");
    expect(normalizeSearch("Đang xây")).toBe("dang xay");
    expect(normalizeSearch("  Về MÌNH ")).toBe("ve minh");
  });
});

describe("matchesQuery", () => {
  it("matches without diacritics, case-insensitively", () => {
    expect(matchesQuery("Dự án", "du an")).toBe(true);
    expect(matchesQuery("Dịch vụ", "DICH VU")).toBe(true);
    expect(matchesQuery("Đang xây", "dang")).toBe(true);
  });
  it("matches tokens in any order", () => {
    expect(matchesQuery("Dự án", "an du")).toBe(true);
  });
  it("treats an empty query as match-all and rejects non-matches", () => {
    expect(matchesQuery("Work", "")).toBe(true);
    expect(matchesQuery("Work", "   ")).toBe(true);
    expect(matchesQuery("Work", "xyz")).toBe(false);
  });
});
