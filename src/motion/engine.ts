import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profileNames, type MotionProfile } from "./gates";
import { hero } from "./hero";
import { magnetic } from "./magnetic";
import { parallax } from "./parallax";
import { pinProjects } from "./pin-projects";
import { pinIsReady, restoreAnchor, startRecording, takeRestoringVisit, trackHistoryTraversal } from "./reading-anchor";
import { keepPlace, pageSettled } from "./settle";
import { startSmoothScroll } from "./smooth-scroll";

gsap.registerPlugin(ScrollTrigger);
trackHistoryTraversal();

export interface MotionContext {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  // `immediate` skips the inertial animation (and the browser's smooth scrolling), for moves the visitor did not ask for.
  scrollTo(target: number | HTMLElement, immediate?: boolean): void;
  profile: MotionProfile;
}

export type MotionModule = (ctx: MotionContext) => void | (() => void);

// The cleanup also reports which features really started (space separated, like `profileNames`).
export type StopMotion = (() => void) & { readonly started: string };

const stopped = Object.assign(() => {}, { started: "" });

// Feature modules register here; one runs while any of its profile keys is on.
const modules: { features: (keyof MotionProfile)[]; run: MotionModule }[] = [
  // The hero module reads the `strip` and `count` flags itself (touch has `count` only).
  { features: ["strip", "count"], run: hero },
  { features: ["pin"], run: pinProjects },
  { features: ["parallax"], run: parallax },
  { features: ["magnetic"], run: magnetic },
];

function scrollNatively(target: number | HTMLElement, immediate?: boolean) {
  const behavior = immediate ? "instant" : "auto";
  if (typeof target === "number") window.scrollTo({ top: target, behavior });
  else target.scrollIntoView({ block: "start", behavior });
}

// `isCancelled` lets the caller abandon a start that is still loading: nothing is constructed once it returns true.
export async function startMotion(profile: MotionProfile, isCancelled: () => boolean = () => false): Promise<StopMotion> {
  await pageSettled(isCancelled);
  if (isCancelled()) return stopped;
  const smooth = profile.smooth ? await startSmoothScroll(isCancelled) : null;
  if (isCancelled()) {
    smooth?.destroy();
    return stopped;
  }
  // Modules only ever see what is really running: without Lenis `smooth` is off but the other features still start.
  const running: MotionProfile = { ...profile, smooth: smooth !== null };
  const mm = gsap.matchMedia();
  let alive = true;

  const scrollTo = smooth?.scrollTo ?? scrollNatively;
  // Modules may change the layout above what the visitor is reading (a pin adds its spacer). gsap measures once more
  // when the context has been added and puts the scroll position back to where it was recorded, so what the visitor
  // was reading is found again only after that.
  const restorePlace = keepPlace();
  // A Back or a reload brings the browser's own scroll offset, which fits the layout the reader left only if no pin has
  // changed it since; the remembered reading anchor does. Only a page that has the pin is remembered or restored.
  const restoring = takeRestoringVisit();
  const remembers = running.pin && document.querySelector("[data-motion-pin]") !== null;
  let stopRecording: (() => void) | undefined;

  try {
    // Everything a module creates inside the context is reverted with it, ScrollTriggers included.
    mm.add({ all: "all" }, () => {
      const ctx: MotionContext = { gsap, ScrollTrigger, scrollTo, profile: running };
      const cleanups: (() => void)[] = [];
      const stopAll = () => {
        for (const cleanup of cleanups.splice(0)) cleanup();
      };
      // Only gsap's own tweens are reverted with the context; a module's tickers, listeners and clones are not, so a
      // module that throws takes down the ones that already started instead of leaving them running unseen.
      try {
        for (const { features, run } of modules) {
          if (!features.some((feature) => running[feature])) continue;
          const cleanup = run(ctx);
          if (typeof cleanup === "function") cleanups.push(cleanup);
        }
      } catch (error) {
        stopAll();
        throw error;
      }
      return stopAll;
    });
    // Once gsap has measured the pinned layout (its own refresh ends the `mm.add` call), and only then.
    const restored = restoring && remembers && pinIsReady() && restoreAnchor((top) => scrollTo(top, true));
    if (!restored) restorePlace((top) => scrollTo(top, true));
    if (remembers) stopRecording = startRecording();
  } catch (error) {
    mm.revert();
    smooth?.destroy();
    throw error;
  }

  // Web fonts change line breaks and so every offset a ScrollTrigger measured. The safe form waits for a scroll in
  // progress (a Lenis animation, a restored position) to end: measuring mid-way would jump the page to where it was.
  void document.fonts.ready.then(() => {
    if (alive) ScrollTrigger.refresh(true);
  });

  return Object.assign(
    () => {
      alive = false;
      stopRecording?.();
      mm.revert();
      smooth?.destroy();
    },
    { started: profileNames(running) },
  );
}
