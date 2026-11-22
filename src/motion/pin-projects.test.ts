import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MotionContext } from "./engine";
import { pinProjects } from "./pin-projects";

// Just enough of a DOM for the module: attributes, a few selectors, parents and replaceWith.
class FakeEl {
  attrs = new Map<string, string>();
  classes = new Set<string>();
  children: FakeEl[] = [];
  parentElement: FakeEl | null = null;
  text = "";
  offsetHeight = 0;
  listeners = new Map<string, number>();

  constructor(attrs: Record<string, string> = {}) {
    for (const [name, value] of Object.entries(attrs)) this.attrs.set(name, value);
  }
  append(child: FakeEl) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }
  getAttribute(name: string) {
    return this.attrs.get(name) ?? null;
  }
  hasAttribute(name: string) {
    return this.attrs.has(name);
  }
  setAttribute(name: string, value: string) {
    this.attrs.set(name, value);
  }
  removeAttribute(name: string) {
    this.attrs.delete(name);
  }
  toggleAttribute(name: string, force: boolean) {
    if (force) this.attrs.set(name, "");
    else this.attrs.delete(name);
  }
  get classList() {
    return { contains: (name: string) => this.classes.has(name) };
  }
  get textContent() {
    return this.text;
  }
  set textContent(value: string) {
    this.text = value;
  }
  contains(other: unknown): boolean {
    return other === this || this.children.some((child) => child.contains(other));
  }
  addEventListener(type: string) {
    this.listeners.set(type, (this.listeners.get(type) ?? 0) + 1);
  }
  removeEventListener(type: string) {
    this.listeners.set(type, (this.listeners.get(type) ?? 0) - 1);
  }
  replaceWith(node: FakeEl) {
    const parent = this.parentElement!;
    node.parentElement?.children.splice(node.parentElement.children.indexOf(node), 1);
    parent.children.splice(parent.children.indexOf(this), 1, node);
    node.parentElement = parent;
    this.parentElement = null;
  }
  private descendants(): FakeEl[] {
    return this.children.flatMap((child) => [child, ...child.descendants()]);
  }
  querySelectorAll(selector: string): FakeEl[] {
    if (selector === ":scope > [data-pin-indicator]") return this.children.filter((c) => c.hasAttribute("data-pin-indicator"));
    if (selector === ":scope > [data-pin-item]") return this.children.filter((c) => c.hasAttribute("data-pin-item"));
    if (selector === ".reveal-media") return this.descendants().filter((c) => c.classes.has("reveal-media"));
    if (selector === ".reveal-item") return this.descendants().filter((c) => c.classes.has("reveal-item"));
    return [];
  }
  querySelector(selector: string) {
    return this.querySelectorAll(selector)[0] ?? null;
  }
}

function page(options: { itemHeight?: number; viewport?: number } = {}) {
  const container = new FakeEl();
  const wrapper = container.append(new FakeEl({ "data-motion-pin": "true" }));
  const indicator = wrapper.append(new FakeEl({ "data-pin-indicator": "true" }));
  indicator.text = "01 / 05";
  const items = Array.from({ length: 5 }, (_, i) => {
    const item = wrapper.append(new FakeEl({ "data-pin-item": "", "data-slug": `p${i}` }));
    item.offsetHeight = options.itemHeight ?? 425;
    const media = item.append(new FakeEl());
    media.classes.add("reveal-media");
    for (let n = 0; n < 2; n++) {
      const text = item.append(new FakeEl({ style: `--i:${n}` }));
      text.classes.add("reveal-item");
    }
    return item;
  });
  vi.stubGlobal("document", {
    querySelector: (selector: string) => (selector === "[data-motion-pin]" ? wrapper : null),
    querySelectorAll: () => [],
    activeElement: null,
  });
  const windowListeners = new Map<string, number>();
  vi.stubGlobal("window", {
    innerHeight: options.viewport ?? 900,
    addEventListener: (type: string) => windowListeners.set(type, (windowListeners.get(type) ?? 0) + 1),
    removeEventListener: (type: string) => windowListeners.set(type, (windowListeners.get(type) ?? 0) - 1),
  });
  vi.stubGlobal("requestAnimationFrame", () => 1);
  vi.stubGlobal("cancelAnimationFrame", () => {});
  return { container, wrapper, indicator, items, windowListeners };
}

function context(create: (vars: unknown) => unknown) {
  const refreshListeners = { added: 0, removed: 0 };
  const ctx = {
    gsap: { killTweensOf: vi.fn(), set: vi.fn(), to: vi.fn(), fromTo: vi.fn() },
    ScrollTrigger: {
      create: vi.fn(create),
      addEventListener: () => refreshListeners.added++,
      removeEventListener: () => refreshListeners.removed++,
    },
    scrollTo: vi.fn(),
    profile: { smooth: true, pin: true, magnetic: true, strip: true, count: true, parallax: true },
  };
  return { ctx: ctx as unknown as MotionContext, mocks: ctx, refreshListeners };
}

const liveTrigger = () => ({ start: 0, end: 4500, progress: 0, kill: vi.fn() });

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("the pin's takeover and its rollback", () => {
  it("marks the wrapper ready before the pin is created, because the pin measures the stage layout", () => {
    const { wrapper } = page();
    const seen: boolean[] = [];
    const { ctx } = context(() => {
      seen.push(wrapper.hasAttribute("data-pin-ready"));
      return liveTrigger();
    });
    pinProjects(ctx);
    expect(seen).toEqual([true]);
    expect(wrapper.hasAttribute("data-pin-ready")).toBe(true);
  });

  it("puts the stacked list back when create() throws, and carries on without throwing", () => {
    const { wrapper, indicator, items } = page();
    items[0].toggleAttribute("data-pin-active", true);
    const { ctx } = context(() => {
      throw new Error("boom");
    });
    expect(() => pinProjects(ctx)).not.toThrow();
    expect(wrapper.hasAttribute("data-pin-ready")).toBe(false);
    expect(items.some((item) => item.hasAttribute("data-pin-active"))).toBe(false);
    expect(wrapper.getAttribute("style")).toBeNull();
    expect(indicator.text).toBe("01 / 05");
    expect(console.warn).toHaveBeenCalled();
  });

  it("removes a spacer the pin had already put in when create() throws afterwards, and restores the inline styles", () => {
    const { container, wrapper, items } = page();
    const { ctx } = context(() => {
      // What ScrollTrigger has done by the time it fails: a spacer around the wrapper and inline styles on both.
      const spacer = new FakeEl();
      spacer.classes.add("pin-spacer");
      wrapper.replaceWith(spacer);
      spacer.append(wrapper);
      wrapper.setAttribute("style", "position: fixed; top: 289px;");
      items[1].setAttribute("style", "opacity: 0;");
      items[1].children[2].setAttribute("style", "--i:1; transform: translate(0px, 28px);");
      throw new Error("boom after the spacer");
    });
    pinProjects(ctx);
    expect(container.children).toEqual([wrapper]);
    expect(wrapper.parentElement).toBe(container);
    expect(wrapper.getAttribute("style")).toBeNull();
    expect(wrapper.hasAttribute("data-pin-ready")).toBe(false);
    expect(items[1].getAttribute("style")).toBeNull();
    expect(items[1].children[2].getAttribute("style")).toBe("--i:1");
  });

  it("does not retry after a failure when the page is measured again", () => {
    page();
    const { ctx, mocks } = context(() => {
      throw new Error("boom");
    });
    pinProjects(ctx);
    expect(mocks.ScrollTrigger.create).toHaveBeenCalledTimes(1);
  });

  it("keeps the stacked list when the tallest project does not fit below the header", () => {
    const { wrapper } = page({ itemHeight: 700, viewport: 700 });
    const { ctx, mocks } = context(() => liveTrigger());
    pinProjects(ctx);
    expect(mocks.ScrollTrigger.create).not.toHaveBeenCalled();
    expect(wrapper.hasAttribute("data-pin-ready")).toBe(false);
  });

  it("leaves everything as the server sent it, and no listener behind, when it is released", () => {
    const { wrapper, indicator, items, windowListeners } = page();
    const trigger = liveTrigger();
    const { ctx, refreshListeners } = context(() => {
      const spacer = new FakeEl();
      spacer.classes.add("pin-spacer");
      wrapper.replaceWith(spacer);
      spacer.append(wrapper);
      trigger.kill.mockImplementation(() => spacer.replaceWith(wrapper));
      items[2].setAttribute("style", "opacity: 0;");
      return trigger;
    });
    const release = pinProjects(ctx) as () => void;
    expect(wrapper.hasAttribute("data-pin-ready")).toBe(true);
    expect(items[0].hasAttribute("data-pin-active")).toBe(true);
    expect(indicator.text).toBe("01 / 05");

    release();
    expect(trigger.kill).toHaveBeenCalledWith(true);
    expect(wrapper.hasAttribute("data-pin-ready")).toBe(false);
    expect(items.some((item) => item.hasAttribute("data-pin-active"))).toBe(false);
    expect(items[2].getAttribute("style")).toBeNull();
    expect(wrapper.listeners.get("focusin")).toBe(0);
    expect(windowListeners.get("resize")).toBe(0);
    expect(refreshListeners.removed).toBe(refreshListeners.added);
  });
});
