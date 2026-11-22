import { describe, expect, it } from "vitest";
import { STRIP_BASE_SPEED, STRIP_MAX_BOOST, approach, countValue, stripSpeed, wrapOffset } from "./hero-math";

describe("stripSpeed", () => {
  it("is the base speed at rest", () => {
    expect(stripSpeed(0)).toBe(STRIP_BASE_SPEED);
  });

  it("treats a negative velocity like a positive one", () => {
    expect(stripSpeed(-1200)).toBe(stripSpeed(1200));
  });

  it("grows with velocity but never past the bound, however hard the flick", () => {
    const max = STRIP_BASE_SPEED * (1 + STRIP_MAX_BOOST);
    expect(stripSpeed(600)).toBeGreaterThan(STRIP_BASE_SPEED);
    expect(stripSpeed(600)).toBeLessThan(stripSpeed(1800));
    expect(stripSpeed(1e6)).toBe(max);
    expect(stripSpeed(-1e9)).toBe(max);
  });

  it("falls back to the base speed for a non-finite velocity", () => {
    expect(stripSpeed(Number.NaN)).toBe(STRIP_BASE_SPEED);
    expect(stripSpeed(Number.POSITIVE_INFINITY)).toBe(STRIP_BASE_SPEED);
  });
});

describe("approach", () => {
  it("stays put for no elapsed time and never overshoots the target", () => {
    expect(approach(10, 50, 0)).toBe(10);
    expect(approach(10, 50, 100)).toBeLessThanOrEqual(50);
    expect(approach(90, 50, 100)).toBeGreaterThanOrEqual(50);
  });

  it("moves part of the way in a short step", () => {
    const next = approach(0, 100, 0.1);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(100);
  });
});

describe("wrapOffset", () => {
  it("keeps the offset inside one loop in both directions", () => {
    expect(wrapOffset(0, 100)).toBe(0);
    expect(wrapOffset(250, 100)).toBe(50);
    expect(wrapOffset(-30, 100)).toBe(70);
    expect(wrapOffset(100, 100)).toBe(0);
  });

  it("returns 0 for a loop without width", () => {
    expect(wrapOffset(42, 0)).toBe(0);
  });
});

describe("countValue", () => {
  it("is 0 at the start, half-way in the middle and the target at the end", () => {
    expect(countValue(13, 0)).toBe(0);
    expect(countValue(14, 0.5)).toBe(7);
    expect(countValue(13, 1)).toBe(13);
  });

  it("only produces whole numbers", () => {
    for (let p = 0; p <= 1; p += 0.013) expect(Number.isInteger(countValue(13, p))).toBe(true);
  });

  it("never exceeds the target or goes below zero, whatever the progress", () => {
    expect(countValue(7, 1.7)).toBe(7);
    expect(countValue(7, -0.4)).toBe(0);
    expect(countValue(7, Number.NaN)).toBe(0);
    for (let p = 0; p <= 1.2; p += 0.01) expect(countValue(3, p)).toBeLessThanOrEqual(3);
  });
});
