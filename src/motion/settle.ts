const nextFrame = () => new Promise<number>((resolve) => requestAnimationFrame(resolve));

// How long a scroll that is still under way may hold the start back, and how many frames without a `scroll` event count
// as "stopped" where the browser cannot say so itself (`scrollend`).
export const SETTLE_LIMIT_MS = 2000;
export const QUIET_FRAMES = 3;

// ScrollTrigger measures by scrolling to 0 and back to the position it recorded. A programmatic scroll cancels the two
// things the browser may still be doing on its own: a smooth scroll to the URL fragment (it is left wherever it had got
// to) and the restoration of the position after Back (the recorded position is then still 0, and the page stays there).
// So the first measurement waits until the browser has finished placing the page. The wait is bounded: a scroll that
// never reports its end must not keep the motion layer from starting.
export async function pageSettled(isCancelled: () => boolean): Promise<void> {
  const tracksEnd = "onscrollend" in window;
  let moving = false;
  let quiet = 0; // frames since the last `scroll` event
  const onScroll = () => {
    moving = true;
    quiet = 0;
  };
  const onEnd = () => {
    moving = false;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scrollend", onEnd, { passive: true });
  try {
    // A pending restoration is applied while a frame renders, so one full frame has to pass before anything is recorded.
    const began = await nextFrame();
    quiet += 1;
    if (isCancelled()) return;
    let now = await nextFrame();
    quiet += 1;
    const stillMoving = () => (tracksEnd ? moving : moving && quiet < QUIET_FRAMES);
    while (stillMoving() && !isCancelled() && now - began < SETTLE_LIMIT_MS) {
      now = await nextFrame();
      quiet += 1;
    }
  } finally {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("scrollend", onEnd);
  }
}

// Where reading starts: just under the fixed header, which is where an anchor link puts a section (`scroll-padding-top`
// is 5rem). A pixel more allows for rounding.
const READING_LINE = 81;

// The section being read: the last one that has started by the reading line, or the first one when none has.
export function sectionAtReadingLine(tops: number[]): number {
  const started = tops.map((top, i) => (top <= READING_LINE ? i : -1)).filter((i) => i >= 0);
  return started.length > 0 ? started[started.length - 1] : 0;
}

// What the visitor is reading, kept where it is on the screen while the layout above it changes (a pin adds its
// spacer height there). Call it before the change; the function it returns, called after, puts the page back so that
// the same section is at the same place. The browser's own scroll anchoring does this too, but it also moves the page
// in the middle of ScrollTrigger's measuring, which is why the pinned layout switches it off.
export function keepPlace(): (scrollTo: (top: number) => void) => void {
  const sections = [...document.querySelectorAll<HTMLElement>("main section")];
  const anchor = sections[sectionAtReadingLine(sections.map((section) => section.getBoundingClientRect().top))];
  if (!anchor) return () => {};
  const rest = anchor.getBoundingClientRect().top;
  return (scrollTo) => {
    const shift = anchor.getBoundingClientRect().top - rest;
    if (shift !== 0) scrollTo(window.scrollY + shift);
  };
}
