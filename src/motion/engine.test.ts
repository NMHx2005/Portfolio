import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MotionProfile } from "./gates";

const all: MotionProfile = { smooth: true, pin: true, magnetic: true, strip: true, count: true, parallax: true };

interface Deferred {
  promise: Promise<void>;
  resolve(): void;
}

function deferred(): Deferred {
  let resolve = () => {};
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

// Fakes for everything the engine touches. Like the real Lenis, every instance shares <html>: constructing adds the
// class and destroying one instance removes it for all of them.
function setup(options: { lenis: "ok" | "fails"; gate?: Deferred; manualFrames?: boolean }) {
  vi.resetModules();
  const htmlClasses = new Set<string>();
  const state = {
    constructed: 0,
    destroyed: 0,
    tickers: 0,
    lagSmoothing: [] as unknown[][],
    scrolls: [] as unknown[][],
    resizes: 0,
    // The ScrollTrigger "refresh" listeners that are registered right now.
    refreshListeners: new Set<() => void>(),
    // The tops of the page's sections. A module that runs while the context is added pushes the later ones down, like a
    // pin's spacer.
    tops: [-900, 40, 1300],
    onAdd: () => {},
  };
  const frames: (() => void)[] = [];

  class FakeLenis {
    constructor() {
      state.constructed += 1;
      htmlClasses.add("lenis");
    }
    on() {}
    raf() {}
    resize() {
      state.resizes += 1;
    }
    stop() {}
    start() {}
    scrollTo(...args: unknown[]) {
      state.scrolls.push(args);
    }
    destroy() {
      state.destroyed += 1;
      htmlClasses.clear();
    }
  }

  // One shared promise, so two imports in flight at once see the same module.
  const lenisModule = (async () => {
    await options.gate?.promise;
    if (options.lenis === "fails") throw new Error("chunk failed to load");
    return { default: FakeLenis };
  })();
  lenisModule.catch(() => {});
  vi.doMock("lenis", () => lenisModule);
  vi.doMock("gsap", () => ({
    gsap: {
      registerPlugin() {},
      matchMedia: () => ({
        add(_conditions: unknown, run: () => void) {
          run();
          state.onAdd();
          return this;
        },
        revert() {},
      }),
      ticker: {
        add: () => (state.tickers += 1),
        remove: () => (state.tickers -= 1),
        lagSmoothing: (...args: unknown[]) => state.lagSmoothing.push(args),
      },
    },
  }));
  vi.doMock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {
      update() {},
      refresh() {},
      addEventListener: (_type: string, run: () => void) => state.refreshListeners.add(run),
      removeEventListener: (_type: string, run: () => void) => state.refreshListeners.delete(run),
    },
  }));
  vi.stubGlobal("document", {
    body: {},
    querySelector: () => null,
    querySelectorAll: (selector: string) =>
      selector === "main section" ? state.tops.map((_, i) => ({ getBoundingClientRect: () => ({ top: state.tops[i] }) })) : [],
    fonts: { ready: Promise.resolve() },
  });
  vi.stubGlobal("window", { scrollY: 1000, location: { pathname: "/vi", search: "" }, addEventListener() {}, removeEventListener() {} });
  vi.stubGlobal("requestAnimationFrame", (run: (time: number) => void) => {
    if (options.manualFrames) frames.push(() => run(performance.now()));
    else queueMicrotask(() => run(performance.now()));
    return 0;
  });
  vi.stubGlobal(
    "MutationObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );

  const flushFrame = async () => {
    for (const run of frames.splice(0)) run();
    await new Promise((resolve) => setTimeout(resolve, 0)); // every pending microtask runs first
  };

  return { state, htmlClasses, flushFrame, load: () => import("./engine") };
}

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.doUnmock("lenis");
  vi.doUnmock("gsap");
  vi.doUnmock("gsap/ScrollTrigger");
  vi.doUnmock("./hero");
  vi.doUnmock("./pin-projects");
});

describe("startMotion", () => {
  it("starts everything and reports it, then releases Lenis and the ticker on stop", async () => {
    const { state, htmlClasses, load } = setup({ lenis: "ok" });
    const { startMotion } = await load();

    const stop = await startMotion(all);
    expect(stop.started).toBe("smooth pin magnetic strip count parallax");
    expect(state.constructed).toBe(1);
    expect(state.tickers).toBe(1);
    expect(state.lagSmoothing).toEqual([[0]]);

    stop();
    expect(state.destroyed).toBe(1);
    expect(state.tickers).toBe(0);
    expect(htmlClasses.size).toBe(0);
    expect(state.lagSmoothing.at(-1)).toEqual([500, 33]);
  });

  it("has Lenis measure the page again whenever ScrollTrigger refreshes, and stops listening on stop", async () => {
    const { state, load } = setup({ lenis: "ok" });
    const { startMotion } = await load();

    const stop = await startMotion(all);
    expect(state.refreshListeners.size).toBe(1);
    const before = state.resizes;
    for (const run of state.refreshListeners) run();
    expect(state.resizes).toBe(before + 1);

    stop();
    expect(state.refreshListeners.size).toBe(0);
  });

  it("never loads Lenis when smooth scrolling is off", async () => {
    const { state, load } = setup({ lenis: "ok" });
    const { startMotion } = await load();

    const stop = await startMotion({ ...all, smooth: false, pin: false, magnetic: false });
    expect(stop.started).toBe("strip count parallax");
    expect(state.constructed).toBe(0);
  });

  it("constructs nothing when the start is cancelled while Lenis is still loading", async () => {
    const gate = deferred();
    const { state, htmlClasses, load } = setup({ lenis: "ok", gate });
    const { startMotion } = await load();

    let cancelled = false;
    const start = startMotion(all, () => cancelled);
    cancelled = true;
    gate.resolve();
    const stop = await start;

    expect(state.constructed).toBe(0);
    expect(state.tickers).toBe(0);
    expect(stop.started).toBe("");
    stop();
    expect(htmlClasses.size).toBe(0);
  });

  it("constructs nothing when it is cancelled before it begins", async () => {
    const { state, load } = setup({ lenis: "ok" });
    const { startMotion } = await load();
    const stop = await startMotion(all, () => true);
    expect(stop.started).toBe("");
    expect(state.constructed).toBe(0);
  });

  it("lets an older start that finishes after a newer one leave the newer one's state alone", async () => {
    const gate = deferred();
    const { state, htmlClasses, load } = setup({ lenis: "ok", gate });
    const { startMotion } = await load();

    let olderCancelled = false;
    const older = startMotion(all, () => olderCancelled);
    olderCancelled = true; // a navigation happened: a newer start replaces it
    gate.resolve();
    const stopOlder = await older;
    const newer = await startMotion(all);

    stopOlder();
    expect(state.constructed).toBe(1);
    expect(state.destroyed).toBe(0);
    expect(htmlClasses.has("lenis")).toBe(true);
    expect(state.tickers).toBe(1);

    newer();
    expect(htmlClasses.size).toBe(0);
  });

  it("keeps the features that do not need Lenis when Lenis fails to load, and says so", async () => {
    const { state, load } = setup({ lenis: "fails" });
    const { startMotion } = await load();

    const stop = await startMotion(all);
    expect(stop.started).toBe("pin magnetic strip count parallax");
    expect(state.constructed).toBe(0);
    expect(state.tickers).toBe(0);
    expect(console.warn).toHaveBeenCalled();
    expect(() => stop()).not.toThrow();
  });

  it("builds nothing until the browser has rendered two frames, so a pending scroll restoration is applied first", async () => {
    const { state, htmlClasses, flushFrame, load } = setup({ lenis: "ok", manualFrames: true });
    const { startMotion } = await load();

    const start = startMotion(all);
    await flushFrame();
    expect(state.constructed).toBe(0); // one frame is not enough
    await flushFrame();
    const stop = await start;
    expect(state.constructed).toBe(1);
    expect(htmlClasses.has("lenis")).toBe(true);
    stop();
  });

  it("builds nothing when it is cancelled while it waits for those frames", async () => {
    const { state, flushFrame, load } = setup({ lenis: "ok", manualFrames: true });
    const { startMotion } = await load();

    let cancelled = false;
    const start = startMotion(all, () => cancelled);
    cancelled = true;
    await flushFrame();
    await flushFrame();
    const stop = await start;
    expect(state.constructed).toBe(0);
    expect(stop.started).toBe("");
  });

  it("finds the section the visitor was reading again after the modules changed the layout above it", async () => {
    const { state, load } = setup({ lenis: "ok" });
    // The first section is the one being read (the second starts at 400): it does not move, the others are pushed down.
    state.tops = [-900, 400, 1300];
    state.onAdd = () => (state.tops = [-900, 400 + 4500, 1300 + 4500]);
    const { startMotion } = await load();
    (await startMotion(all))();
    expect(state.scrolls).toEqual([]); // the first section did not move: nothing to put back

    state.tops = [-3000, -40, 900];
    state.onAdd = () => (state.tops = [-3000, -40 + 4500, 900 + 4500]);
    (await startMotion(all))();
    expect(state.scrolls).toEqual([[1000 + 4500, { immediate: true }]]);
  });

  it("stops the modules that had already started, and releases Lenis, when a later module throws", async () => {
    const { state, htmlClasses, load } = setup({ lenis: "ok" });
    const stopHero = vi.fn();
    vi.doMock("./hero", () => ({ hero: () => stopHero }));
    vi.doMock("./pin-projects", () => ({
      pinProjects: () => {
        throw new Error("module failed");
      },
    }));
    const { startMotion } = await load();

    await expect(startMotion(all)).rejects.toThrow("module failed");
    expect(stopHero).toHaveBeenCalledTimes(1);
    expect(state.destroyed).toBe(1);
    expect(htmlClasses.size).toBe(0);
  });
});
