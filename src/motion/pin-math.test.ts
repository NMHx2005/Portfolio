import { describe, expect, it } from "vitest";
import { PIN_HEADER, PIN_INDICATOR_BAND, activeIndex, formatIndicator, scrollForIndex, stageFits, stageTop } from "./pin-math";

describe("activeIndex", () => {
  it("maps the ends of the range to the first and the last of five", () => {
    expect(activeIndex(0, 5)).toBe(0);
    expect(activeIndex(1, 5)).toBe(4);
  });

  it("starts each item exactly on its step, and holds it until the next one", () => {
    expect([0, 0.2, 0.4, 0.6, 0.8].map((progress) => activeIndex(progress, 5))).toEqual([0, 1, 2, 3, 4]);
    expect([0.199, 0.399, 0.599, 0.799, 0.999].map((progress) => activeIndex(progress, 5))).toEqual([0, 1, 2, 3, 4]);
  });

  it("gives every item the same share of the range, so one viewport of scroll is one project", () => {
    const shown = Array.from({ length: 1000 }, (_, i) => activeIndex(i / 1000, 5));
    for (let item = 0; item < 5; item++) expect(shown.filter((index) => index === item)).toHaveLength(200);
  });

  it("stays on the first and the last item outside the range", () => {
    expect(activeIndex(-0.3, 5)).toBe(0);
    expect(activeIndex(1.7, 5)).toBe(4);
    expect(activeIndex(Number.NaN, 5)).toBe(0);
    expect(activeIndex(Number.POSITIVE_INFINITY, 5)).toBe(4);
  });

  it("has nothing to step through for a single item or none", () => {
    expect(activeIndex(0.8, 1)).toBe(0);
    expect(activeIndex(0.8, 0)).toBe(0);
  });
});

describe("formatIndicator", () => {
  it("shows the position and the total with two digits", () => {
    expect(formatIndicator(0, 5)).toBe("01 / 05");
    expect(formatIndicator(1, 5)).toBe("02 / 05");
    expect(formatIndicator(4, 5)).toBe("05 / 05");
  });

  it("keeps two digits only up to ten and clamps a stray index", () => {
    expect(formatIndicator(9, 12)).toBe("10 / 12");
    expect(formatIndicator(-2, 5)).toBe("01 / 05");
    expect(formatIndicator(7, 5)).toBe("05 / 05");
  });
});

describe("stageFits", () => {
  it("fits when the stage and the indicator band stay below the header and inside the viewport", () => {
    expect(stageFits(425, 900)).toBe(true);
    expect(stageFits(425, 700)).toBe(true);
    expect(stageFits(700 - PIN_HEADER - PIN_INDICATOR_BAND, 700)).toBe(true); // exactly the room there is
  });

  it("does not fit one pixel more, nor in a very short viewport", () => {
    expect(stageFits(700 - PIN_HEADER - PIN_INDICATOR_BAND + 1, 700)).toBe(false);
    expect(stageFits(425, 400)).toBe(false);
    expect(stageFits(425, 0)).toBe(false);
  });

  it("never fits a stage that has no height yet (nothing was measured)", () => {
    expect(stageFits(0, 900)).toBe(false);
    expect(stageFits(Number.NaN, 900)).toBe(false);
  });
});

describe("stageTop", () => {
  it("centres the stage in the room below the header and the indicator band", () => {
    expect(stageTop(425, 900)).toBe(PIN_HEADER + PIN_INDICATOR_BAND + 185); // 371 px are left, 185 above and 186 below
  });

  it("sits right under the indicator band when it only just fits, and never above it", () => {
    expect(stageTop(596, 700)).toBe(PIN_HEADER + PIN_INDICATOR_BAND);
    expect(stageTop(800, 700)).toBe(PIN_HEADER + PIN_INDICATOR_BAND);
  });

  it("is a whole number of pixels", () => {
    expect(Number.isInteger(stageTop(425, 901))).toBe(true);
  });
});

describe("scrollForIndex", () => {
  it("puts item i in the middle of its own stretch of the pinned range", () => {
    expect([0, 1, 2, 3, 4].map((i) => scrollForIndex(1000, 6000, i, 5))).toEqual([1500, 2500, 3500, 4500, 5500]);
  });

  it("round-trips through activeIndex", () => {
    for (let i = 0; i < 5; i++) expect(activeIndex((scrollForIndex(1000, 6000, i, 5) - 1000) / 5000, 5)).toBe(i);
  });

  it("stays at the start when there is a single item", () => {
    expect(scrollForIndex(1000, 1000, 0, 1)).toBe(1000);
  });
});
