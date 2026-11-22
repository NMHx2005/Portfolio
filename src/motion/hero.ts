import type { MotionContext, MotionModule } from "./engine";
import { STRIP_BASE_SPEED, approach, countValue, stripSpeed, wrapOffset } from "./hero-math";
import { createPauseControl, stripHeld, type PauseControl } from "./strip-control";

const COUNT_DURATION = 1.4;
// The figures rise in with the CSS entrance (100 ms + 90 ms per index, figures start at index 4); counting begins as each lands.
const countDelay = (index: number) => 0.4 + (4 + index) * 0.09;

function runStrip({ gsap }: MotionContext): (() => void) | undefined {
  const viewport = document.querySelector<HTMLElement>("[data-motion-strip-viewport]");
  const list = viewport?.querySelector<HTMLElement>("[data-motion-strip]");
  if (!viewport || !list || list.children.length === 0) return undefined;

  // Without a way to stop it the strip may not move on its own (WCAG 2.2.2): the native row stays.
  const pauseButton = viewport.parentElement?.querySelector<HTMLElement>("[data-strip-pause]");
  if (!pauseButton) return undefined;

  const items = [...list.children] as HTMLElement[];
  const clones = list.cloneNode(true) as HTMLElement;
  clones.removeAttribute("data-motion-strip");
  clones.removeAttribute("aria-label");
  clones.setAttribute("data-motion-strip-clone", "");
  clones.setAttribute("aria-hidden", "true");
  for (const img of clones.querySelectorAll("img")) {
    img.alt = "";
    img.loading = "lazy";
    img.removeAttribute("fetchpriority");
  }
  const cloneItems = [...clones.children] as HTMLElement[];

  const state = { base: 0, shift: 0 };
  let shiftTarget = 0; // rapid presses add to where the shift is heading, not to where it happens to be mid-tween
  let loop = 0;
  let step = 0;
  const render = () => {
    const transform = `translate3d(${-wrapOffset(state.base + state.shift, loop)}px,0,0)`;
    list.style.transform = transform;
    clones.style.transform = transform;
  };

  // The covers share the row (flex-1) on wide screens, so fixed widths stop the clones from squeezing them. They are
  // always measured in the native layout (takeover off), which is what the row looks like without the script.
  const lock = (): boolean => {
    viewport.removeAttribute("data-strip-ready");
    list.removeAttribute("style");
    for (const el of [...items, ...cloneItems]) el.removeAttribute("style");
    const widths = items.map((el) => el.getBoundingClientRect().width);
    if (widths.some((width) => !(width > 0))) return false;
    items.forEach((el, i) => {
      el.style.cssText = `flex:none;width:${widths[i]}px`;
      cloneItems[i].style.cssText = `flex:none;width:${widths[i]}px`;
    });
    if (!clones.isConnected) viewport.append(clones);
    viewport.scrollLeft = 0; // the loop maths assume the row starts at 0
    viewport.setAttribute("data-strip-ready", "");
    loop = clones.offsetLeft - list.offsetLeft;
    step = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : loop;
    render();
    return loop > 0;
  };

  let hovering = false;
  let focused = false;
  let inView = false;
  let control: PauseControl | null = null;
  // The visitor's pause is sticky: hover, focus, visibility and the tab coming back never end it.
  const paused = () => stripHeld(control?.isPaused() ?? false, { hovering, focused, inView, documentHidden: document.hidden });

  let speed = STRIP_BASE_SPEED;
  let lastScrollY = window.scrollY;
  const tick = (_time: number, deltaMs: number) => {
    const seconds = Math.min(deltaMs, 100) / 1000;
    const velocity = seconds > 0 ? (window.scrollY - lastScrollY) / seconds : 0;
    lastScrollY = window.scrollY;
    speed = approach(speed, stripSpeed(velocity), seconds);
    if (paused()) return;
    state.base += speed * seconds;
    render();
  };

  const onEnter = (event: PointerEvent) => {
    if (event.pointerType === "mouse") hovering = true;
  };
  const onLeave = () => {
    hovering = false;
  };
  const onFocusIn = () => {
    focused = true;
  };
  const onFocusOut = (event: FocusEvent) => {
    if (!(event.relatedTarget instanceof Node && viewport.contains(event.relatedTarget))) focused = false;
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return; // browser and assistive shortcuts
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    shiftTarget += event.key === "ArrowRight" ? step : -step;
    gsap.to(state, { shift: shiftTarget, duration: 0.5, ease: "power2.out", overwrite: true, onUpdate: render });
  };

  let width = viewport.clientWidth;
  const resize = new ResizeObserver(() => {
    if (viewport.clientWidth === width) return;
    width = viewport.clientWidth;
    lock();
  });
  const visibility = new IntersectionObserver((entries) => {
    inView = entries[entries.length - 1].isIntersecting;
  });

  const release = () => {
    gsap.ticker.remove(tick);
    gsap.killTweensOf(state);
    resize.disconnect();
    visibility.disconnect();
    viewport.removeEventListener("pointerenter", onEnter);
    viewport.removeEventListener("pointerleave", onLeave);
    viewport.removeEventListener("focusin", onFocusIn);
    viewport.removeEventListener("focusout", onFocusOut);
    viewport.removeEventListener("keydown", onKey);
    control?.release();
    clones.remove();
    // The server markup carries no inline style on these, so removing the attribute restores it exactly.
    list.removeAttribute("style");
    for (const el of items) el.removeAttribute("style");
    viewport.removeAttribute("data-strip-ready");
  };

  // Everything that can throw comes first and the takeover is marked ready last: a failure leaves the native row.
  try {
    resize.observe(viewport);
    visibility.observe(viewport);
    viewport.addEventListener("pointerenter", onEnter);
    viewport.addEventListener("pointerleave", onLeave);
    viewport.addEventListener("focusin", onFocusIn);
    viewport.addEventListener("focusout", onFocusOut);
    viewport.addEventListener("keydown", onKey);
    // Before the takeover, so that the button is already there when the strip starts to move.
    control = createPauseControl(pauseButton);
    if (!lock()) {
      release();
      return undefined;
    }
    gsap.ticker.add(tick);
  } catch {
    release();
    return undefined;
  }
  return release;
}

function runCount({ gsap }: MotionContext): (() => void) | undefined {
  const figures = [...document.querySelectorAll<HTMLElement>("#hero [data-count-to]")];
  if (figures.length === 0) return undefined;
  const finals = figures.map((el) => el.textContent ?? "");

  // Showing 0 is safe: the observer below is created in the same step, and cleanup restores the server text. The
  // counting text is hidden from assistive technology, which gets the real value from the first frame.
  const shown = figures.map((el, index) => {
    const visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    visual.textContent = "0";
    const real = document.createElement("span");
    real.className = "sr-only";
    real.textContent = finals[index];
    el.replaceChildren(visual, real);
    return visual;
  });
  const tweens: gsap.core.Tween[] = [];
  const seen = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    seen.disconnect();
    figures.forEach((el, index) => {
      const target = Number(el.dataset.countTo);
      if (!Number.isInteger(target)) {
        el.textContent = finals[index];
        return;
      }
      const progress = { value: 0 };
      tweens.push(
        gsap.to(progress, {
          value: 1,
          duration: COUNT_DURATION,
          delay: countDelay(index),
          ease: "power2.out",
          onUpdate: () => (shown[index].textContent = String(countValue(target, progress.value))),
          onComplete: () => (el.textContent = finals[index]),
        }),
      );
    });
  });
  seen.observe(figures[0].closest("dl") ?? figures[0]);

  return () => {
    seen.disconnect();
    for (const tween of tweens) tween.kill();
    figures.forEach((el, index) => (el.textContent = finals[index]));
  };
}

export const hero: MotionModule = (ctx) => {
  const cleanups = [ctx.profile.strip ? runStrip(ctx) : undefined, ctx.profile.count ? runCount(ctx) : undefined];
  return () => {
    for (const cleanup of cleanups) cleanup?.();
  };
};
