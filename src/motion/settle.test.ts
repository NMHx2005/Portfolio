import { afterEach, describe, expect, it, vi } from "vitest";
import { SETTLE_LIMIT_MS, pageSettled, sectionAtReadingLine } from "./settle";

// Frames are run by hand, 16 ms apart, so the 2 s bound and the quiet frames can be counted exactly.
function fakeBrowser(options: { scrollend: boolean }) {
  const listeners = new Map<string, Set<() => void>>();
  let frames: ((time: number) => void)[] = [];
  let time = 1000;
  const win: Record<string, unknown> = {
    addEventListener: (type: string, run: () => void) => listeners.set(type, (listeners.get(type) ?? new Set()).add(run)),
    removeEventListener: (type: string, run: () => void) => listeners.get(type)?.delete(run),
  };
  if (options.scrollend) win.onscrollend = null;
  vi.stubGlobal("window", win);
  vi.stubGlobal("requestAnimationFrame", (run: (time: number) => void) => frames.push(run));
  return {
    emit: (type: string) => listeners.get(type)?.forEach((run) => run()),
    listenerCount: () => [...listeners.values()].reduce((sum, set) => sum + set.size, 0),
    frame: async (ms = 16) => {
      time += ms;
      const due = frames;
      frames = [];
      for (const run of due) run(time);
      await new Promise((resolve) => setTimeout(resolve, 0)); // every pending microtask runs first
    },
  };
}

afterEach(() => vi.unstubAllGlobals());

function settling(isCancelled: () => boolean = () => false) {
  const state = { done: false };
  void pageSettled(isCancelled).then(() => (state.done = true));
  return state;
}

describe("pageSettled", () => {
  it("takes two frames when nothing is scrolling, and leaves no listener behind", async () => {
    const browser = fakeBrowser({ scrollend: true });
    const settled = settling();
    await browser.frame();
    expect(settled.done).toBe(false);
    await browser.frame();
    expect(settled.done).toBe(true);
    expect(browser.listenerCount()).toBe(0);
  });

  it("waits for a scroll that is still under way (a smooth scroll to a fragment) to end", async () => {
    const browser = fakeBrowser({ scrollend: true });
    const settled = settling();
    browser.emit("scroll");
    for (let i = 0; i < 5; i++) await browser.frame();
    expect(settled.done).toBe(false);
    browser.emit("scrollend");
    await browser.frame();
    expect(settled.done).toBe(true);
  });

  it("does not wait for a scroll that has already ended", async () => {
    const browser = fakeBrowser({ scrollend: true });
    const settled = settling();
    browser.emit("scroll");
    browser.emit("scrollend");
    await browser.frame();
    await browser.frame();
    expect(settled.done).toBe(true);
  });

  it("starts anyway at the bound when a scroll never reports its end", async () => {
    const browser = fakeBrowser({ scrollend: true });
    const settled = settling();
    browser.emit("scroll");
    for (let elapsed = 0; elapsed < SETTLE_LIMIT_MS - 100; elapsed += 100) await browser.frame(100);
    expect(settled.done).toBe(false);
    await browser.frame(300);
    expect(settled.done).toBe(true);
    expect(browser.listenerCount()).toBe(0);
  });

  it("without scrollend, waits for a few quiet frames after the last scroll event", async () => {
    const browser = fakeBrowser({ scrollend: false });
    const settled = settling();
    browser.emit("scroll");
    await browser.frame();
    await browser.frame();
    browser.emit("scroll"); // still moving: the count starts again
    await browser.frame();
    await browser.frame();
    expect(settled.done).toBe(false);
    await browser.frame();
    expect(settled.done).toBe(true);
  });

  it("without scrollend, a scroll that never stops ends at the same bound", async () => {
    const browser = fakeBrowser({ scrollend: false });
    const settled = settling();
    for (let elapsed = 0; elapsed < SETTLE_LIMIT_MS - 100; elapsed += 100) {
      browser.emit("scroll");
      await browser.frame(100);
    }
    expect(settled.done).toBe(false);
    browser.emit("scroll");
    await browser.frame(300);
    expect(settled.done).toBe(true);
  });

  it("resolves as soon as it is cancelled, between the first two frames or later", async () => {
    for (const cancelAfter of [1, 3]) {
      const browser = fakeBrowser({ scrollend: true });
      let cancelled = false;
      const settled = settling(() => cancelled);
      browser.emit("scroll");
      for (let i = 0; i < cancelAfter; i++) await browser.frame();
      expect(settled.done).toBe(false);
      cancelled = true;
      await browser.frame();
      expect(settled.done, `cancelled after ${cancelAfter} frames`).toBe(true);
      expect(browser.listenerCount()).toBe(0);
    }
  });
});

describe("sectionAtReadingLine", () => {
  it("is the last section that has started by the line under the header", () => {
    expect(sectionAtReadingLine([-2400, -1300, -40, 520, 1400])).toBe(2);
    expect(sectionAtReadingLine([-900, 0, 700])).toBe(1);
  });

  it("is a section that an anchor link has just put under the header (80 px), but not one a little lower", () => {
    expect(sectionAtReadingLine([-900, 80, 700])).toBe(1);
    expect(sectionAtReadingLine([-900, 81, 700])).toBe(1); // rounding
    expect(sectionAtReadingLine([-900, 82, 700])).toBe(0);
  });

  it("is the first section when none has started, and for no sections at all", () => {
    expect(sectionAtReadingLine([200, 900])).toBe(0);
    expect(sectionAtReadingLine([])).toBe(0);
  });
});
