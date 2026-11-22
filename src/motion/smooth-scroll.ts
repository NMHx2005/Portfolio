import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface SmoothScroll {
  scrollTo(target: number | HTMLElement, immediate?: boolean): void;
  destroy(): void;
}

// Instances can briefly overlap while a restart is in flight; the ticker setting is restored by the last one out.
let live = 0;

// Resolves to null when Lenis cannot be loaded or the start was cancelled while it loaded; in both cases nothing was
// constructed, so there is nothing to undo.
export async function startSmoothScroll(isCancelled: () => boolean): Promise<SmoothScroll | null> {
  // Touch devices never get here, so they never download Lenis.
  const loaded = await import("lenis").catch((error: unknown) => {
    console.warn("Inertial scrolling could not load; the page keeps native scrolling.", error);
    return null;
  });
  // Lenis.destroy() strips every `lenis*` class from <html>, so a stale start must never get as far as constructing one.
  if (!loaded || isCancelled()) return null;
  const Lenis = loaded.default;

  // Lenis reads the root's `scroll-padding-top` for anchors, so they land below the fixed header like native ones.
  const lenis = new Lenis({ autoRaf: false, anchors: true });
  const tick = (time: number) => lenis.raf(time * 1000);

  live += 1;
  gsap.ticker.lagSmoothing(0); // a catch-up jump would desynchronise ScrollTrigger from the scroll position
  gsap.ticker.add(tick);
  lenis.on("scroll", () => ScrollTrigger.update());
  // A pin adds its spacer when ScrollTrigger refreshes, and Lenis would only notice 250 ms later: until then it clamps
  // every anchor target to the old end of the page, and a header link clicked in that window falls short of its section.
  const measure = () => lenis.resize();
  ScrollTrigger.addEventListener("refresh", measure);

  // A modal dialog does not lock the page behind it; Lenis would still smooth wheel and touch input into it.
  const syncDialogs = () => (document.querySelector("dialog[open]") ? lenis.stop() : lenis.start());
  const dialogs = new MutationObserver(syncDialogs);
  dialogs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
  syncDialogs();

  return {
    scrollTo(target, immediate) {
      // Lenis measures the page lazily, and an immediate move follows a layout change (a pin adding its spacer): scrolling
      // with the old height would stop at the old end of the page.
      if (immediate) lenis.resize();
      lenis.scrollTo(target, { immediate });
    },
    destroy() {
      dialogs.disconnect();
      ScrollTrigger.removeEventListener("refresh", measure);
      gsap.ticker.remove(tick);
      lenis.destroy();
      live -= 1;
      if (live === 0) gsap.ticker.lagSmoothing(500, 33);
    },
  };
}
