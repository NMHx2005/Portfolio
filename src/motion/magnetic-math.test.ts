import { describe, expect, it } from "vitest";
import { MAGNETIC_MAX, magneticPull } from "./magnetic-math";

describe("magneticPull", () => {
  it("is zero at the centre", () => {
    expect(magneticPull(0, 0, 200, 44)).toEqual({ x: 0, y: 0 });
  });

  it("grows linearly towards the pointer and is capped at 12 px on the edge", () => {
    expect(magneticPull(50, 0, 200, 44).x).toBeCloseTo(6);
    expect(magneticPull(100, 0, 200, 44).x).toBe(MAGNETIC_MAX);
    expect(MAGNETIC_MAX).toBe(12);
  });

  it("works on both axes and on the negative side", () => {
    const pull = magneticPull(-50, 11, 200, 44);
    expect(pull.x).toBeCloseTo(-6);
    expect(pull.y).toBeCloseTo(6);
    expect(magneticPull(-100, -22, 200, 44)).toEqual({ x: -12, y: -12 });
  });

  it("is zero when the pointer is outside the box, on either axis", () => {
    expect(magneticPull(101, 0, 200, 44)).toEqual({ x: 0, y: 0 });
    expect(magneticPull(0, -23, 200, 44)).toEqual({ x: 0, y: 0 });
    expect(magneticPull(150, 10, 200, 44)).toEqual({ x: 0, y: 0 });
  });

  it("is zero for an empty box", () => {
    expect(magneticPull(0, 0, 0, 0)).toEqual({ x: 0, y: 0 });
  });
});
