"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { motionProfile, PIN_MIN_WIDTH, profileNames } from "@/motion/gates";

const reducedQuery = "(prefers-reduced-motion: reduce)";
const pointerQuery = "(hover: hover) and (pointer: fine)";
const widthQuery = `(min-width: ${PIN_MIN_WIDTH}px)`;

// The motion layer is an enhancement: it must never compete with hydration or the first paint.
function whenIdle(task: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(task, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(task, 200);
  return () => window.clearTimeout(id);
}

export function MotionRoot() {
  const pathname = usePathname();

  // A layout effect, so that a route change starts and stops the motion layer when it commits. A passive effect would
  // wait for the route change's view transition to end, and a Back pressed meanwhile would be taken for the visit the
  // transition was still holding back.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const queries = [reducedQuery, pointerQuery, widthQuery].map((query) => window.matchMedia(query));

    function start(): () => void {
      const profile = motionProfile({
        reducedMotion: queries[0].matches,
        finePointer: queries[1].matches,
        // One source for the threshold: the same query object that triggers the restart.
        width: queries[2].matches ? PIN_MIN_WIDTH : 0,
      });
      if (!profileNames(profile)) return () => {};

      let cancelled = false;
      let stopMotion: (() => void) | undefined;
      const cancelIdle = whenIdle(() => {
        import("@/motion/engine")
          .then(({ startMotion }) => startMotion(profile, () => cancelled))
          .then((stop) => {
            if (cancelled) return stop();
            stopMotion = stop;
            if (stop.started) root.dataset.motion = stop.started;
          })
          // Without the engine the page simply keeps its native scrolling and CSS reveals.
          .catch((error: unknown) => console.warn("The motion layer could not start.", error));
      });

      return () => {
        cancelled = true;
        cancelIdle();
        stopMotion?.();
        delete root.dataset.motion;
      };
    }

    let stop = start();
    function restart() {
      stop();
      stop = start();
    }
    for (const query of queries) query.addEventListener("change", restart);

    return () => {
      for (const query of queries) query.removeEventListener("change", restart);
      stop();
    };
  }, [pathname]);

  return null;
}
