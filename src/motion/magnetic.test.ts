import { afterEach, describe, expect, it, vi } from "vitest";
import type { MotionContext } from "./engine";
import { magnetic } from "./magnetic";

class FakeButton {
  attrs = new Map<string, string>();
  listeners = new Map<string, (event: unknown) => void>();
  measured = 0;
  getAttribute = (name: string) => this.attrs.get(name) ?? null;
  setAttribute = (name: string, value: string) => void this.attrs.set(name, value);
  removeAttribute = (name: string) => void this.attrs.delete(name);
  addEventListener = (type: string, fn: (event: unknown) => void) => void this.listeners.set(type, fn);
  removeEventListener = (type: string) => void this.listeners.delete(type);
  getBoundingClientRect = () => {
    this.measured++;
    return { left: 100, top: 100, width: 200, height: 44 };
  };
}

// `offset` is what gsap reports as the element's current translation; `set` with clearProps forgets it, as gsap does.
function setup(options: { style?: string | null; offset?: number; button?: FakeButton } = {}) {
  const button = options.button ?? new FakeButton();
  if (options.style != null) button.attrs.set("style", options.style);
  const state = { offset: options.offset ?? 0 };
  const handlers = new Map<string, () => void>();
  vi.stubGlobal("document", { querySelectorAll: () => [button] });
  vi.stubGlobal("window", {
    addEventListener: (type: string, fn: () => void) => void handlers.set(type, fn),
    removeEventListener: (type: string) => void handlers.delete(type),
  });
  const moves: Record<string, number[]> = { x: [], y: [] };
  const gsap = {
    quickTo: (_el: unknown, prop: string) => (value: number) => moves[prop].push(value),
    getProperty: () => state.offset,
    killTweensOf: vi.fn(),
    set: vi.fn(() => {
      state.offset = 0;
    }),
  };
  const cleanup = magnetic({ gsap } as unknown as MotionContext) as () => void;
  const pointer = (type: string, clientX = 0, clientY = 0) => button.listeners.get(type)!({ pointerType: "mouse", clientX, clientY });
  return { button, moves, cleanup, gsap, state, handlers, pointer };
}

afterEach(() => vi.unstubAllGlobals());

describe("the pointer pull", () => {
  it("pulls towards a mouse pointer, capped at 12 px, and ignores touch input", () => {
    const { button, moves, pointer } = setup();
    pointer("pointerenter", 220, 122);
    pointer("pointermove", 220, 122);
    expect(moves.x.at(-1)).toBeCloseTo(2.4);
    expect(moves.y.at(-1)).toBeCloseTo(0);
    pointer("pointermove", 300, 144);
    expect(moves.x.at(-1)).toBe(12);
    const count = moves.x.length;
    button.listeners.get("pointermove")!({ pointerType: "touch", clientX: 300, clientY: 144 });
    expect(moves.x).toHaveLength(count);
  });

  it("measures from the resting centre, not from where the pull has already moved the element", () => {
    // The button is drawn 8 px to the right of its rest (centre 208 on screen): the rest centre is 200.
    const { moves, pointer } = setup({ offset: 8 });
    pointer("pointerenter");
    pointer("pointermove", 250, 122);
    // From the rest centre (192): 58 px of 100 -> 6.96; chasing the drawn box (200) would give 6.
    expect(moves.x.at(-1)).toBeCloseTo((58 / 100) * 12);
  });

  it("reads layout once per hover, and again only after a scroll or a resize", () => {
    const { button, handlers, pointer } = setup();
    pointer("pointerenter", 200, 122);
    for (let i = 0; i < 5; i++) pointer("pointermove", 200 + i, 122);
    expect(button.measured).toBe(1);
    expect([...handlers.keys()].sort()).toEqual(["resize", "scroll"]);

    handlers.get("scroll")!();
    expect(button.measured).toBe(1); // forgetting is lazy: nothing is read until the next move
    pointer("pointermove", 205, 122);
    pointer("pointermove", 206, 122);
    expect(button.measured).toBe(2);

    handlers.get("resize")!();
    pointer("pointermove", 207, 122);
    expect(button.measured).toBe(3);

    pointer("pointerleave");
    expect(handlers.size).toBe(0);
  });

  it("returns to rest when the pointer leaves and listens to nothing about focus", () => {
    const { button, moves, pointer } = setup();
    pointer("pointerleave");
    expect([moves.x.at(-1), moves.y.at(-1)]).toEqual([0, 0]);
    expect([...button.listeners.keys()].sort()).toEqual(["pointercancel", "pointerenter", "pointerleave", "pointermove"]);
  });

  it("is marked ready, and cleanup removes listeners, tweens, gsap's cached offset, the mark and any style it added", () => {
    const { button, cleanup, gsap, handlers, pointer } = setup();
    expect(button.attrs.has("data-magnetic-ready")).toBe(true);
    pointer("pointerenter", 200, 122);
    button.attrs.set("style", "transform: translate(5px, 0px)");
    cleanup();
    expect(button.listeners.size).toBe(0);
    expect(handlers.size).toBe(0);
    expect(gsap.killTweensOf).toHaveBeenCalledWith(button);
    expect(gsap.set).toHaveBeenCalledWith(button, { clearProps: "transform" });
    expect(button.attrs.size).toBe(0);
  });

  it("restores a server style exactly", () => {
    const { button, cleanup } = setup({ style: "color: red" });
    button.attrs.set("style", "color: red; transform: translate(5px, 0px)");
    cleanup();
    expect(button.attrs.get("style")).toBe("color: red");
  });

  it("restarts from a zero offset: the first move after a restart is not shifted by the earlier pull", () => {
    const first = setup({ offset: 8 });
    first.cleanup();
    expect(first.state.offset).toBe(0);
    // gsap would otherwise still report 8 for the element, and the rest centre would come out 8 px off.
    const second = setup({ offset: first.state.offset, button: first.button });
    second.pointer("pointerenter");
    second.pointer("pointermove", 250, 122);
    expect(second.moves.x.at(-1)).toBeCloseTo((50 / 100) * 12);
  });
});
