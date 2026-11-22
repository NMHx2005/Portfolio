import { afterEach, describe, expect, it, vi } from "vitest";
import {
  MAX_ANCHORS,
  anchorFor,
  entryKey,
  isRestoringVisit,
  isAddressTraversal,
  nextTraversal,
  loadAnchors,
  rememberAnchor,
  saveAnchor,
  savedAnchor,
  scrollForAnchor,
  type ReadingAnchor,
} from "./reading-anchor";

afterEach(() => vi.unstubAllGlobals());

const sections = (tops: number[]) => tops.map((top, i) => ({ id: `s${i}`, top }));

describe("anchorFor", () => {
  it("is the section under the reading line, with its top as the offset", () => {
    expect(anchorFor(sections([-4000, -2600, -300, 900]))).toEqual({ sectionId: "s2", offset: -300 });
  });

  it("is the section an anchor link has just put under the header", () => {
    expect(anchorFor(sections([-900, 80, 800]))).toEqual({ sectionId: "s1", offset: 80 });
  });

  it("rounds the offset", () => {
    expect(anchorFor(sections([-1200.4, -3400.6]))).toEqual({ sectionId: "s1", offset: -3401 });
  });

  it("has no anchor when there are no sections", () => {
    expect(anchorFor([])).toBeNull();
  });
});

describe("scrollForAnchor", () => {
  const anchor: ReadingAnchor = { sectionId: "faq", offset: 80 };

  it("puts the section back at its remembered place whatever the layout above it did", () => {
    // The browser left the page at 7486 with the section at 80; after the pin grew the page the section is at 2476.
    expect(scrollForAnchor(anchor, 2476, 7486)).toBe(9882);
    expect(scrollForAnchor(anchor, 80, 7486)).toBe(7486);
  });

  it("works for a section the reader was inside of", () => {
    expect(scrollForAnchor({ sectionId: "projects", offset: -2800 }, -120, 3000)).toBe(3000 + -120 + 2800);
  });
});

describe("rememberAnchor", () => {
  const a = (n: number): ReadingAnchor => ({ sectionId: `s${n}`, offset: n });

  it("keeps one anchor per history entry, the newest value", () => {
    let store = rememberAnchor({}, "entry-1", a(1));
    store = rememberAnchor(store, "entry-1", a(2));
    expect(Object.values(store)).toEqual([a(2)]);
  });

  it("drops the oldest entries beyond the cap, whatever the keys look like", () => {
    let store: Record<string, ReadingAnchor> = {};
    for (let n = 0; n < MAX_ANCHORS + 5; n++) store = rememberAnchor(store, String(n), a(n));
    expect(Object.keys(store)).toHaveLength(MAX_ANCHORS);
    expect(Object.values(store).map((x) => x.offset)).toEqual(Array.from({ length: MAX_ANCHORS }, (_, i) => i + 5));
  });

  it("counts a rewritten entry as the newest, so the one being read is never the one dropped", () => {
    let store: Record<string, ReadingAnchor> = {};
    for (let n = 0; n < MAX_ANCHORS; n++) store = rememberAnchor(store, String(n), a(n));
    store = rememberAnchor(store, "0", a(99));
    store = rememberAnchor(store, "new", a(100));
    expect(savedAnchorIn(store, "0")).toEqual(a(99));
    expect(savedAnchorIn(store, "1")).toBeUndefined();
  });
});

const savedAnchorIn = (store: Record<string, ReadingAnchor>, key: string) => store[`k:${key}`];

describe("entryKey", () => {
  it("is the Navigation API's key for the current entry, which Back and reload keep", () => {
    expect(entryKey({ currentEntry: { key: "abc" } }, { pathname: "/vi", search: "" })).toBe("abc");
  });

  it("is the address where there is no Navigation API", () => {
    expect(entryKey(undefined, { pathname: "/vi", search: "?a=1" })).toBe("/vi?a=1");
    expect(entryKey({ currentEntry: null }, { pathname: "/en", search: "" })).toBe("/en");
  });
});

describe("isRestoringVisit", () => {
  const visit = { firstStart: true, navigationType: "navigate", traversal: false };

  it("is a Back or a reload of the document, or a client-side traversal", () => {
    expect(isRestoringVisit({ ...visit, navigationType: "back_forward" })).toBe(true);
    expect(isRestoringVisit({ ...visit, navigationType: "reload" })).toBe(true);
    expect(isRestoringVisit({ ...visit, traversal: true })).toBe(true);
    expect(isRestoringVisit({ ...visit, firstStart: false, traversal: true })).toBe(true);
  });

  it("is not a fresh navigation, a link click or a later start of the same document", () => {
    expect(isRestoringVisit(visit)).toBe(false);
    expect(isRestoringVisit({ ...visit, navigationType: undefined })).toBe(false);
    expect(isRestoringVisit({ ...visit, firstStart: false, navigationType: "reload" })).toBe(false);
  });
});

function fakeStorage(initial?: string) {
  const data = new Map<string, string>(initial === undefined ? [] : [["portfolio:reading-anchors", initial]]);
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    raw: () => data.get("portfolio:reading-anchors"),
  };
}

describe("the stored anchors", () => {
  it("round-trip through storage", () => {
    const storage = fakeStorage();
    saveAnchor(storage, "entry", { sectionId: "faq", offset: 90 });
    expect(savedAnchor(storage, "entry")).toEqual({ sectionId: "faq", offset: 90 });
    expect(savedAnchor(storage, "other")).toBeUndefined();
  });

  it("never hold more than the cap", () => {
    const storage = fakeStorage();
    for (let n = 0; n < MAX_ANCHORS * 3; n++) saveAnchor(storage, `entry-${n}`, { sectionId: "faq", offset: n });
    expect(Object.keys(JSON.parse(storage.raw()!))).toHaveLength(MAX_ANCHORS);
  });

  it("read as nothing remembered when the storage holds rubbish, and bad entries are skipped", () => {
    expect(loadAnchors(fakeStorage("not json"))).toEqual({});
    expect(loadAnchors(fakeStorage("[1,2"))).toEqual({});
    expect(loadAnchors(fakeStorage("null"))).toEqual({});
    expect(loadAnchors(fakeStorage(JSON.stringify({ "k:a": { sectionId: "faq", offset: 1 }, "k:b": { sectionId: 4, offset: 1 }, "k:c": { sectionId: "x", offset: "1" } })))).toEqual({
      "k:a": { sectionId: "faq", offset: 1 },
    });
  });

  it("survive a storage that refuses to write", () => {
    const storage = { getItem: () => null, setItem: () => { throw new Error("quota"); } };
    expect(() => saveAnchor(storage, "entry", { sectionId: "faq", offset: 1 })).not.toThrow();
  });
});

describe("a storage that throws", () => {
  it("is nothing remembered when reading the item throws", () => {
    const storage = { getItem: () => { throw new Error("denied"); } };
    expect(loadAnchors(storage)).toEqual({});
    expect(savedAnchor(storage, "entry")).toBeUndefined();
  });

  it("is nothing written when the pruning read or the write throws", () => {
    const reads = { getItem: () => { throw new Error("denied"); }, setItem: () => { throw new Error("quota"); } };
    expect(() => saveAnchor(reads, "entry", { sectionId: "faq", offset: 1 })).not.toThrow();
  });
});

// The module keeps the history state of the document in module variables, so each case loads it afresh. With
// `navigation: true` the browser has the Navigation API and reports every navigation; without it only `popstate`.
async function fakeDocument(options: { navigation: boolean }) {
  vi.resetModules();
  const listeners = new Map<string, (event?: unknown) => void>();
  const location = { pathname: "/vi", search: "" };
  const on = (type: string, run: (event?: unknown) => void) => listeners.set(type, run);
  vi.stubGlobal("window", {
    location,
    addEventListener: on,
    removeEventListener: () => {},
    ...(options.navigation ? { navigation: { addEventListener: (type: string, run: (event?: unknown) => void) => listeners.set(`navigation:${type}`, run) } } : {}),
  });
  vi.stubGlobal("performance", { getEntriesByType: () => [{ type: "navigate" }] });
  const anchors = await import("./reading-anchor");
  anchors.trackHistoryTraversal();
  const navigate = (type: string, hashChange: boolean, pathname?: string) => {
    if (pathname) location.pathname = pathname;
    if (options.navigation) listeners.get("navigation:navigate")?.({ navigationType: type, hashChange });
    else if (type === "traverse") listeners.get("popstate")?.();
  };
  return {
    start: () => anchors.takeRestoringVisit(),
    link: (pathname: string) => navigate("push", pathname === location.pathname, pathname),
    back: (pathname: string) => navigate("traverse", pathname === location.pathname, pathname),
    replace: () => navigate("replace", false),
  };
}

describe.each([{ navigation: true }, { navigation: false }])("which start is a Back (Navigation API: $navigation)", (options) => {
  it("is the one after a Back from a started case study", async () => {
    const page = await fakeDocument(options);
    page.start();
    page.link("/vi/projects/hadi");
    expect(page.start()).toBe(false);
    page.back("/vi");
    expect(page.start()).toBe(true);
  });

  it("is not the one after a hash-only Back followed by link clicks to another page and home", async () => {
    const page = await fakeDocument(options);
    page.start();
    page.back("/vi"); // between two hash entries of the same page
    page.link("/en");
    expect(page.start()).toBe(false);
    page.link("/vi");
    expect(page.start()).toBe(false);
  });

  it("describes only the navigation that led to this start", async () => {
    const page = await fakeDocument(options);
    page.start();
    page.link("/vi/projects/hadi");
    page.start();
    page.back("/vi");
    expect(page.start()).toBe(true);
    expect(page.start()).toBe(false); // a restart of the same page (a media change) is not a Back
  });
});

describe("which start is a Back, with the Navigation API", () => {
  it("is the one after a real Back even when it comes before the case study's own start", async () => {
    const page = await fakeDocument({ navigation: true });
    page.start(); // the home page, opened fresh
    page.link("/vi/projects/hadi");
    page.back("/vi"); // quickly: the case study never got to start
    page.replace(); // the router records its own state on the entry it landed on
    expect(page.start()).toBe(true);
  });
});

describe("which start is a Back, where only popstate is known", () => {
  it("does not take a hash Back for a route Back, when the page was started for that address", async () => {
    const page = await fakeDocument({ navigation: false });
    page.start();
    page.back("/vi");
    expect(page.start()).toBe(false);
  });
});

describe("a reload", () => {
  it("is a restoring visit only for the first start of the document", async () => {
    vi.resetModules();
    vi.stubGlobal("window", { location: { pathname: "/vi", search: "" }, addEventListener() {}, removeEventListener() {} });
    vi.stubGlobal("performance", { getEntriesByType: () => [{ type: "reload" }] });
    const anchors = await import("./reading-anchor");
    expect(anchors.takeRestoringVisit()).toBe(true);
    expect(anchors.takeRestoringVisit()).toBe(false);
  });
});

describe("nextTraversal", () => {
  it("is set by a Back or Forward that leaves the page's hash entries", () => {
    expect(nextTraversal(false, { navigationType: "traverse", hashChange: false })).toBe(true);
  });

  it("is cleared by a hash traversal and by a link click", () => {
    expect(nextTraversal(true, { navigationType: "traverse", hashChange: true })).toBe(false);
    expect(nextTraversal(true, { navigationType: "push", hashChange: false })).toBe(false);
    expect(nextTraversal(true, { navigationType: "push", hashChange: true })).toBe(false);
  });

  it("survives the router replacing the entry right after a Back", () => {
    expect(nextTraversal(true, { navigationType: "replace", hashChange: false })).toBe(true);
    expect(nextTraversal(false, { navigationType: "replace", hashChange: false })).toBe(false);
  });
});

describe("isAddressTraversal", () => {
  it("is a landing on another address than the page was started for", () => {
    expect(isAddressTraversal("/vi", "/vi/projects/hadi")).toBe(true);
    expect(isAddressTraversal("/vi", undefined)).toBe(true);
    expect(isAddressTraversal("/vi", "/vi")).toBe(false);
  });
});

describe("recording where the tab's storage cannot be read", () => {
  it("raises nothing from a scroll settling or the page being hidden", async () => {
    vi.resetModules();
    const listeners = new Map<string, () => void>();
    const frames: (() => void)[] = [];
    vi.stubGlobal("window", {
      location: { pathname: "/vi", search: "" },
      addEventListener: (type: string, run: () => void) => listeners.set(type, run),
      removeEventListener: () => {},
    });
    vi.stubGlobal("requestAnimationFrame", (run: () => void) => frames.push(run));
    vi.stubGlobal("cancelAnimationFrame", () => {});
    vi.stubGlobal("document", { querySelectorAll: () => [{ id: "faq", getBoundingClientRect: () => ({ top: 80 }) }] });
    Object.defineProperty(globalThis, "sessionStorage", { configurable: true, get: () => { throw new DOMException("denied", "SecurityError"); } });
    const { startRecording } = await import("./reading-anchor");
    const stop = startRecording();
    expect(() => listeners.get("pagehide")?.()).not.toThrow();
    listeners.get("scroll")?.();
    expect(() => {
      for (let i = 0; i < 3; i++) frames.splice(0).forEach((run) => run());
    }).not.toThrow();
    stop();
    Reflect.deleteProperty(globalThis, "sessionStorage");
  });
});
