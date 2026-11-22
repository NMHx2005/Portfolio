import { gsap } from "gsap";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { MotionContext } from "./engine";
import { parallax } from "./parallax";

class FakeEl {
  attrs = new Map<string, string>();
  child: FakeEl | null = null;
  getAttribute = (name: string) => this.attrs.get(name) ?? null;
  setAttribute = (name: string, value: string) => void this.attrs.set(name, value);
  removeAttribute = (name: string) => void this.attrs.delete(name);
  querySelector = () => this.child;
}

function page(imageStyle: string | null) {
  const figure = new FakeEl();
  const image = new FakeEl();
  if (imageStyle !== null) image.attrs.set("style", imageStyle);
  figure.child = image;
  vi.stubGlobal("document", { querySelector: () => figure });
  return { figure, image };
}

type Vars = Record<string, number | string>;
function context(onFromTo: () => void = () => {}) {
  const calls: { from: Vars; to: Vars; at: number }[] = [];
  const timeline = {
    scrollTrigger: { kill: vi.fn() },
    kill: vi.fn(),
    fromTo: vi.fn((_el: unknown, from: Vars, to: Vars, at: number) => {
      onFromTo();
      calls.push({ from, to, at });
      return timeline;
    }),
  };
  const gsap = { timeline: vi.fn(() => timeline) };
  return { ctx: { gsap } as unknown as MotionContext, calls, timeline };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("the cover parallax", () => {
  it("starts from the server's own picture and moves only by transform, within 8 % and always covering the clip", () => {
    page("color:transparent");
    const { ctx, calls } = context();
    parallax(ctx);
    const shift = calls.find(({ to }) => "yPercent" in to)!;
    const grow = calls.find(({ to }) => "scale" in to)!;
    expect(shift.from).toEqual({ yPercent: 0 });
    expect(grow.from).toEqual({ scale: 1 });
    expect(calls).toHaveLength(2);
    const drift = Number(shift.to.yPercent) / 100;
    expect(drift).toBeLessThanOrEqual(0.08);
    // Half of the growth is what the picture can lose on each side: strictly more than the drift, with room to spare.
    expect((Number(grow.to.scale) - 1) / 2).toBeGreaterThan(drift);
    expect((Number(grow.to.scale) - 1) / 2 - drift).toBeGreaterThanOrEqual(0.005);
    expect(shift.at).toBe(0);
    expect(grow.at).toBe(0);
  });

  it("covers the clip at every point of the scroll range, and is the served picture at progress 0", () => {
    page("color:transparent");
    const { ctx, calls } = context();
    parallax(ctx);
    const shift = calls.find(({ to }) => "yPercent" in to)!;
    const grow = calls.find(({ to }) => "scale" in to)!;
    // The module's own end values and eases, resolved by gsap itself: what the page will really do at each progress.
    const drift = (progress: number) => (Number(shift.to.yPercent) / 100) * gsap.parseEase(String(shift.to.ease))(progress);
    const scale = (progress: number) => 1 + (Number(grow.to.scale) - 1) * gsap.parseEase(String(grow.to.ease))(progress);
    expect(drift(0)).toBe(0);
    expect(scale(0)).toBe(1);
    for (const progress of [0.02, 0.1, 0.25, 0.5, 0.75, 1]) {
      // Each side of the picture has (scale - 1) / 2 of its height to give before the clip shows an empty band.
      expect((scale(progress) - 1) / 2 - Math.abs(drift(progress)), `at ${progress}`).toBeGreaterThan(0);
    }
  });

  it("marks the figure ready last, and cleanup restores the server markup", () => {
    const { figure, image } = page("color:transparent");
    const seen: boolean[] = [];
    const { ctx, timeline } = context(() => {
      seen.push(figure.attrs.has("data-parallax-ready"));
      image.attrs.set("style", "color:transparent; transform: translate(0px, 3%)");
    });
    const cleanup = parallax(ctx) as () => void;
    expect(seen).toEqual([false, false]);
    expect(figure.attrs.has("data-parallax-ready")).toBe(true);
    cleanup();
    expect(timeline.scrollTrigger.kill).toHaveBeenCalled();
    expect(timeline.kill).toHaveBeenCalled();
    expect(figure.attrs.has("data-parallax-ready")).toBe(false);
    expect(image.attrs.get("style")).toBe("color:transparent");
  });

  it("removes an inline style the server did not have", () => {
    const { image } = page(null);
    const { ctx } = context(() => image.attrs.set("style", "transform: none"));
    (parallax(ctx) as () => void)();
    expect(image.attrs.has("style")).toBe(false);
  });

  it("rolls back, including the timeline, and does not throw when a tween cannot be created", () => {
    const { figure, image } = page("color:transparent");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const { ctx, timeline } = context(() => {
      image.attrs.set("style", "transform: scale(1)");
      throw new Error("boom");
    });
    expect(parallax(ctx)).toBeUndefined();
    expect(timeline.kill).toHaveBeenCalled();
    expect(figure.attrs.has("data-parallax-ready")).toBe(false);
    expect(image.attrs.get("style")).toBe("color:transparent");
  });

  it("does nothing on a page without a cover", () => {
    vi.stubGlobal("document", { querySelector: () => null });
    expect(parallax(context().ctx)).toBeUndefined();
  });
});
