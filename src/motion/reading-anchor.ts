import { sectionAtReadingLine } from "./settle";

// Where a visitor was reading, in terms that survive a change of layout: the section under the reading line and how far
// its top was from the top of the screen. The browser restores a bare scroll offset, which means something else once the
// pin has made the page about 2400 px taller above the sections that follow it.
export interface ReadingAnchor {
  sectionId: string;
  offset: number;
}

export const MAX_ANCHORS = 20;
const STORE_KEY = "portfolio:reading-anchors";
// Entries come back in insertion order only for keys that are not integer-like.
const slot = (key: string) => `k:${key}`;

// Inside the pin the section is the projects section and the offset is how far the pinned range has been scrolled, so
// the same project comes back as long as the viewport height is the one the reader left with.
export function anchorFor(sections: { id: string; top: number }[]): ReadingAnchor | null {
  if (sections.length === 0) return null;
  const section = sections[sectionAtReadingLine(sections.map(({ top }) => top))];
  return { sectionId: section.id, offset: Math.round(section.top) };
}

// The scroll position at which the anchor's section has the offset it had.
export function scrollForAnchor(anchor: ReadingAnchor, sectionTop: number, scrollY: number): number {
  return scrollY + sectionTop - anchor.offset;
}

// Adds an anchor, newest last, and drops the oldest ones beyond the cap, so a long session cannot fill the storage.
export function rememberAnchor(store: Record<string, ReadingAnchor>, key: string, anchor: ReadingAnchor, cap = MAX_ANCHORS): Record<string, ReadingAnchor> {
  const others = Object.entries(store).filter(([name]) => name !== slot(key));
  return Object.fromEntries([...others, [slot(key), anchor] as const].slice(-cap));
}

interface NavigationLike {
  currentEntry?: { key?: string } | null;
}

// A history entry keeps its key through Back and reload; without the Navigation API the address stands in for it.
export function entryKey(navigation: NavigationLike | undefined, location: { pathname: string; search: string }): string {
  return navigation?.currentEntry?.key ?? `${location.pathname}${location.search}`;
}

// Back (client-side or not) and reload bring the browser's own restored offset into a layout it does not fit; a fresh
// visit and a link click start where they start. Only the first start of a document can be a Back or a reload of it.
export function isRestoringVisit(visit: { firstStart: boolean; navigationType: string | undefined; traversal: boolean }): boolean {
  return visit.traversal || (visit.firstStart && (visit.navigationType === "back_forward" || visit.navigationType === "reload"));
}

const isAnchor = (value: unknown): value is ReadingAnchor =>
  typeof value === "object" && value !== null && typeof (value as ReadingAnchor).sectionId === "string" && Number.isFinite((value as ReadingAnchor).offset);

// Storage may be missing, full, or hold something else: all of that reads as "nothing remembered".
export function loadAnchors(storage: Pick<Storage, "getItem">): Record<string, ReadingAnchor> {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(STORE_KEY) ?? "{}");
    if (typeof parsed !== "object" || parsed === null) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([, value]) => isAnchor(value))) as Record<string, ReadingAnchor>;
  } catch {
    return {};
  }
}

export function saveAnchor(storage: Pick<Storage, "getItem" | "setItem">, key: string, anchor: ReadingAnchor): void {
  try {
    storage.setItem(STORE_KEY, JSON.stringify(rememberAnchor(loadAnchors(storage), key, anchor)));
  } catch {
    // nothing to do: the browser's own restoration is what is left
  }
}

export function savedAnchor(storage: Pick<Storage, "getItem">, key: string): ReadingAnchor | undefined {
  return loadAnchors(storage)[slot(key)];
}

const PIN = "[data-motion-pin]";

export function pinIsReady(): boolean {
  return document.querySelector(`${PIN}[data-pin-ready]`) !== null;
}

function readingAnchorNow(): ReadingAnchor | null {
  return anchorFor([...document.querySelectorAll<HTMLElement>("main section[id]")].map((el) => ({ id: el.id, top: el.getBoundingClientRect().top })));
}

// Resolved whenever it is needed: a hash link adds a history entry without the page being started again.
const currentEntryKey = () => entryKey((window as unknown as { navigation?: NavigationLike }).navigation, window.location);

// The tab's storage; where reading it throws (a `SecurityError`), there is none and nothing is remembered.
function tabStorage(): Storage | null {
  try {
    return sessionStorage;
  } catch {
    return null;
  }
}

// Writes the anchor once scrolling has stopped (a few frames without a scroll event) and when the page is hidden. It is
// the reader's own position that is kept, so nothing is written before the visit has been put back where it belongs.
export function startRecording(): () => void {
  const address = `${window.location.pathname}${window.location.search}`;
  let frame = 0;
  let quiet = 0;
  let waiting = false;
  const write = () => {
    // During a route change the address is already the next page's while the document is still this one's.
    if (`${window.location.pathname}${window.location.search}` !== address) return;
    const storage = tabStorage();
    const anchor = readingAnchorNow();
    if (storage && anchor) saveAnchor(storage, currentEntryKey(), anchor);
  };
  const tick = () => {
    quiet += 1;
    if (quiet < 3) frame = requestAnimationFrame(tick);
    else {
      waiting = false;
      write();
    }
  };
  const onScroll = () => {
    quiet = 0;
    if (!waiting) {
      waiting = true;
      frame = requestAnimationFrame(tick);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pagehide", write);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("pagehide", write);
  };
}

// Puts the page back where the remembered anchor says; false when nothing usable is remembered.
export function restoreAnchor(scrollTo: (top: number) => void): boolean {
  const storage = tabStorage();
  const anchor = storage ? savedAnchor(storage, currentEntryKey()) : undefined;
  const section = anchor ? document.getElementById(anchor.sectionId) : null;
  if (!anchor || !section) return false;
  scrollTo(scrollForAnchor(anchor, section.getBoundingClientRect().top, window.scrollY));
  return true;
}

let firstStart = true;
let traversal = false;
// The address the last start was for (only used where the Navigation API is missing).
let startedAt: string | undefined;

const addressNow = () => `${window.location.pathname}${window.location.search}`;

interface NavigateEventLike {
  navigationType?: string;
  hashChange?: boolean;
}

// What a navigation does to the "the next start is a Back" mark. A Back or Forward to another route sets it; one that only
// moves between hash entries is handled by the browser alone (no start follows), so it clears it; a link click clears it
// too. A `replace` leaves it: the router replaces the entry right after a Back to record its own state.
export function nextTraversal(current: boolean, event: NavigateEventLike): boolean {
  if (event.navigationType === "traverse") return event.hashChange === false;
  return event.navigationType === "push" ? false : current;
}

// Without the Navigation API all `popstate` says is that the address changed: landing on another address than the page
// was started for is a route change, landing on the same one is a hash entry.
export function isAddressTraversal(landedAt: string, startedFor: string | undefined): boolean {
  return landedAt !== startedFor;
}

// Keeps `traversal` describing the navigation that led to the next start, and nothing before it.
export function trackHistoryTraversal(): void {
  const navigation = (window as unknown as { navigation?: { addEventListener(type: "navigate", run: (event: NavigateEventLike) => void): void } }).navigation;
  if (navigation) navigation.addEventListener("navigate", (event) => void (traversal = nextTraversal(traversal, event)));
  else window.addEventListener("popstate", () => void (traversal = isAddressTraversal(addressNow(), startedAt)));
}

// Whether the start that is beginning now follows a Back or a reload of its page. It describes this start only.
export function takeRestoringVisit(): boolean {
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const restoring = isRestoringVisit({ firstStart, navigationType: navigation?.type, traversal });
  firstStart = false;
  traversal = false;
  startedAt = addressNow();
  return restoring;
}
