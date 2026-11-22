import { describe, expect, it } from "vitest";
import { motionProfile, profileNames } from "./gates";

const none = { smooth: false, pin: false, magnetic: false, strip: false, count: false, parallax: false };

describe("motionProfile", () => {
  it("turns everything off under reduced motion, whatever the device", () => {
    expect(motionProfile({ reducedMotion: true, finePointer: true, width: 1440 })).toEqual(none);
    expect(motionProfile({ reducedMotion: true, finePointer: false, width: 390 })).toEqual(none);
  });

  it("turns everything on for a fine pointer on a wide screen", () => {
    expect(motionProfile({ reducedMotion: false, finePointer: true, width: 1440 })).toEqual({
      smooth: true,
      pin: true,
      magnetic: true,
      strip: true,
      count: true,
      parallax: true,
    });
  });

  it("only pins from 1024px up", () => {
    expect(motionProfile({ reducedMotion: false, finePointer: true, width: 1023 }).pin).toBe(false);
    expect(motionProfile({ reducedMotion: false, finePointer: true, width: 1024 }).pin).toBe(true);
  });

  it("keeps native scrolling and drops pointer effects without a fine pointer", () => {
    expect(motionProfile({ reducedMotion: false, finePointer: false, width: 1440 })).toMatchObject({
      smooth: false,
      pin: false,
      magnetic: false,
      strip: false,
      count: true,
      parallax: true,
    });
  });
});

describe("profileNames", () => {
  it("is empty when nothing is enabled", () => {
    expect(profileNames(motionProfile({ reducedMotion: true, finePointer: true, width: 1440 }))).toBe("");
  });

  it("lists the enabled features, space separated", () => {
    expect(profileNames(motionProfile({ reducedMotion: false, finePointer: false, width: 390 }))).toBe("count parallax");
    expect(profileNames(motionProfile({ reducedMotion: false, finePointer: true, width: 1440 }))).toBe(
      "smooth pin magnetic strip count parallax",
    );
  });
});
