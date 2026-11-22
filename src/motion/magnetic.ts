import type { MotionModule } from "./engine";
import { magneticPull } from "./magnetic-math";

export const magnetic: MotionModule = ({ gsap }) => {
  const targets = [...document.querySelectorAll<HTMLElement>("[data-magnetic]")];
  const undo: (() => void)[] = [];

  for (const el of targets) {
    const serverStyle = el.getAttribute("style");
    const moveX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    // The resting rectangle is measured once per hover (and again after a scroll or resize), not on every move; the pull
    // is measured from where the element rests, not from where it currently is, or it would chase the pointer.
    let rest: { x: number; y: number; width: number; height: number } | null = null;
    const measure = () => {
      const box = el.getBoundingClientRect();
      return {
        x: box.left + box.width / 2 - Number(gsap.getProperty(el, "x")),
        y: box.top + box.height / 2 - Number(gsap.getProperty(el, "y")),
        width: box.width,
        height: box.height,
      };
    };
    const forget = () => {
      rest = null;
    };
    const unwatch = () => {
      window.removeEventListener("scroll", forget);
      window.removeEventListener("resize", forget);
      rest = null;
    };
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      rest = measure();
      window.addEventListener("scroll", forget, { passive: true });
      window.addEventListener("resize", forget);
    };
    const onLeave = () => {
      unwatch();
      moveX(0);
      moveY(0);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      rest ??= measure();
      const pull = magneticPull(event.clientX - rest.x, event.clientY - rest.y, rest.width, rest.height);
      moveX(pull.x);
      moveY(pull.y);
    };
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointercancel", onLeave);
    el.setAttribute("data-magnetic-ready", "");
    undo.push(() => {
      unwatch();
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointercancel", onLeave);
      gsap.killTweensOf(el);
      // Without this gsap keeps its cached offset, and a restart would begin from it.
      gsap.set(el, { clearProps: "transform" });
      el.removeAttribute("data-magnetic-ready");
      if (serverStyle === null) el.removeAttribute("style");
      else el.setAttribute("style", serverStyle);
    });
  }

  return () => {
    for (const cleanup of undo) cleanup();
  };
};
