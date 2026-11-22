import type { MotionContext, MotionModule } from "./engine";
import { activeIndex, formatIndicator, scrollForIndex, stageFits, stageTop } from "./pin-math";
import { keepPlace } from "./settle";

type Trigger = ReturnType<MotionContext["ScrollTrigger"]["create"]>;

interface Project {
  item: HTMLElement;
  media: HTMLElement | null;
  texts: HTMLElement[];
}

const WIPE_FROM = "inset(0% 0% 100% 0%)";
const WIPE_TO = "inset(0% 0% 0% 0%)";

function run({ gsap, ScrollTrigger, scrollTo, profile }: MotionContext): (() => void) | undefined {
  const found = document.querySelector<HTMLElement>("[data-motion-pin]");
  const marker = found?.querySelector<HTMLElement>(":scope > [data-pin-indicator]");
  const items = found ? [...found.querySelectorAll<HTMLElement>(":scope > [data-pin-item]")] : [];
  if (!found || !marker || items.length < 2) return undefined;
  const wrapper: HTMLElement = found;
  const indicator: HTMLElement = marker;

  const projects: Project[] = items.map((item) => ({
    item,
    media: item.querySelector<HTMLElement>(".reveal-media"),
    texts: [...item.querySelectorAll<HTMLElement>(".reveal-item")],
  }));
  const animated = projects.flatMap(({ item, media, texts }) => [item, ...(media ? [media] : []), ...texts]);
  // The server markup is what cleanup restores: some of these carry a style (`--i`), the wrapper and the items carry none.
  const serverStyle = new Map<HTMLElement, string | null>([wrapper, ...animated].map((el) => [el, el.getAttribute("style")]));
  const serverIndicator = indicator.textContent;

  let trigger: Trigger | undefined;
  let current = 0;
  let failed = false;
  // While the module starts, the engine puts the visitor's place back once gsap has finished measuring.
  let starting = true;

  const tallest = () => Math.max(...items.map((item) => item.offsetHeight));

  // Nothing here reads layout, so it is safe to call from a scroll update.
  function show(next: number, animate: boolean) {
    if (next === current && animate) return;
    const previous = current;
    current = next;
    items.forEach((item, i) => item.toggleAttribute("data-pin-active", i === next));
    indicator.textContent = formatIndicator(next, items.length);
    // Focus must not stay on a link that has just been made transparent.
    if (previous !== next && items[previous].contains(document.activeElement)) (document.activeElement as HTMLElement).blur();

    const { item, media, texts } = projects[next];
    gsap.killTweensOf([item, ...(media ? [media] : []), ...texts]);
    if (!animate) {
      gsap.set(items, { opacity: (i: number) => (i === next ? 1 : 0) });
      gsap.set([...(media ? [media] : []), ...texts], { clearProps: "opacity,transform,clipPath" });
      return;
    }
    gsap.to(items[previous], { opacity: 0, duration: 0.3, ease: "power1.out", overwrite: "auto" });
    gsap.set(item, { opacity: 1 });
    if (media) gsap.fromTo(media, { clipPath: WIPE_FROM }, { clipPath: WIPE_TO, duration: 0.9, ease: "power3.out", clearProps: "clipPath" });
    gsap.fromTo(
      texts,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, delay: 0.15, clearProps: "opacity,transform" },
    );
  }

  const progressToIndex = (self: Trigger) => activeIndex(self.progress, items.length);

  // A keyboard user may land on any project: scroll the page to where that project is the one on show.
  const onFocusIn = (event: FocusEvent) => {
    const target = event.target;
    const index = target instanceof Node ? items.findIndex((item) => item.contains(target)) : -1;
    if (trigger && index >= 0 && index !== current) scrollTo(scrollForIndex(trigger.start, trigger.end, index, items.length), true);
  };

  function disarm() {
    const restorePlace = keepPlace();
    gsap.killTweensOf(animated);
    // The pin goes first: the stage layout stays until its spacer is gone, so the page is only resized once.
    trigger?.kill(true);
    trigger = undefined;
    // A create() that threw after the pin had put its spacer in leaves it behind, with nothing to revert it.
    const spacer = wrapper.parentElement;
    if (spacer?.classList.contains("pin-spacer")) spacer.replaceWith(wrapper);
    wrapper.removeAttribute("data-pin-ready");
    for (const item of items) item.removeAttribute("data-pin-active");
    indicator.textContent = serverIndicator;
    // Last: the pin restores the wrapper's inline style itself, and this puts back the server's exact attribute.
    for (const [el, style] of serverStyle) {
      if (style === null) el.removeAttribute("style");
      else el.setAttribute("style", style);
    }
    current = 0;
    restorePlace((top) => scrollTo(top, true));
  }

  function arm() {
    const restorePlace = starting ? undefined : keepPlace();
    current = 0;
    items.forEach((item, i) => item.toggleAttribute("data-pin-active", i === 0));
    try {
      // The pin measures the stage as it is laid out once ready, so the mark has to be there before it is created.
      wrapper.setAttribute("data-pin-ready", "");
      trigger = ScrollTrigger.create({
        trigger: wrapper,
        start: () => `top ${stageTop(tallest(), window.innerHeight)}px`,
        end: () => `+=${items.length * window.innerHeight}`,
        pin: true,
        pinSpacing: true,
        // Native scrolling can outrun the pin by a frame; Lenis moves the page in step with it.
        anticipatePin: profile.smooth ? 0 : 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => show(progressToIndex(self), true),
        onRefresh: (self) => show(progressToIndex(self), false),
      });
      show(progressToIndex(trigger), false);
      restorePlace?.((top) => scrollTo(top, true));
    } catch (error) {
      // Back to the stacked list, for good: retrying on every refresh would only repeat the failure.
      failed = true;
      disarm();
      console.warn("The pinned projects could not start; the projects stay stacked.", error);
    }
  }

  // The stage is as tall as the tallest project: when the viewport has no room for it the list stays stacked rather than clipped.
  function evaluate() {
    if (failed) return;
    const fits = stageFits(tallest(), window.innerHeight);
    if (fits && !trigger) arm();
    else if (!fits && trigger) disarm();
  }

  let frame = 0;
  const onResize = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(evaluate);
  };

  const release = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", onResize);
    ScrollTrigger.removeEventListener("refresh", evaluate);
    wrapper.removeEventListener("focusin", onFocusIn);
    disarm();
  };

  wrapper.addEventListener("focusin", onFocusIn);
  window.addEventListener("resize", onResize);
  ScrollTrigger.addEventListener("refresh", evaluate);
  evaluate();
  starting = false;
  return release;
}

export const pinProjects: MotionModule = (ctx) => run(ctx);
