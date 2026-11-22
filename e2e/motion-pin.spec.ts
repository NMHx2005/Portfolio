import { expect, test, type Page } from "@playwright/test";
import { isAnalyticsScriptFailure } from "./helpers/console";
import { back, frames, settledScrollY } from "./helpers/scroll";

// These tests live in their own file because they are long, and the specs that run next to them in the same worker
// pool must not be the ones that make the dev server rebuild (the 404 pages): a rebuild reloads every open page.

const titles = ["TingTingVác", "Rankdle", "mythiep", "Hadi", "TinVid"];
const wrapper = (page: Page) => page.locator("[data-motion-pin]");
// A cold dev compile can delay the engine chunk, so the takeover gets a generous wait.
const pinReady = (page: Page) => expect(wrapper(page)).toHaveAttribute("data-pin-ready", "", { timeout: 20_000 });
const pinReleased = (page: Page) => expect(wrapper(page)).not.toHaveAttribute("data-pin-ready", { timeout: 20_000 });
const stuck = (page: Page) => wrapper(page).evaluate((el) => getComputedStyle(el).position === "fixed");
const activeTitle = (page: Page) => page.locator("[data-pin-active] h3");
const innerHeight = (page: Page) => page.evaluate(() => window.innerHeight);

// Gets the stage to the point where it has just stuck, the way a visitor would: a jump to just above it, then small wheel steps.
async function intoPin(page: Page) {
  await pinReady(page);
  await page.evaluate(() => {
    const spacer = document.querySelector(".pin-spacer")!;
    window.scrollTo({ top: spacer.getBoundingClientRect().top + window.scrollY - 500, behavior: "instant" });
  });
  await settledScrollY(page);
  await page.mouse.move(700, 450);
  await expect
    .poll(
      async () => {
        if (await stuck(page)) return true;
        await page.mouse.wheel(0, 60);
        await settledScrollY(page);
        return false;
      },
      { timeout: 20_000 },
    )
    .toBe(true);
}

// One viewport of scroll is one project.
async function step(page: Page, direction: 1 | -1 = 1) {
  await page.mouse.wheel(0, direction * (await innerHeight(page)));
  await settledScrollY(page);
}

test.describe("pinned projects", () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile, "the touch project is covered by its own test below");
  });

  test("scrolling through the pinned section shows each project in turn, with the position indicator", async ({ page }) => {
    await page.goto("/vi");
    await intoPin(page);
    for (const [i, title] of titles.entries()) {
      if (i > 0) await step(page);
      await expect(activeTitle(page)).toHaveText(title);
      await expect(page.locator("[data-pin-active]")).toHaveCount(1);
      await expect(page.locator("[data-pin-indicator]")).toHaveText(`0${i + 1} / 05`);
      await expect(page.locator("[data-pin-indicator]")).toBeVisible();
    }
    for (const [i, title] of [...titles.entries()].reverse().slice(1)) {
      await step(page, -1);
      await expect(activeTitle(page)).toHaveText(title);
      await expect(page.locator("[data-pin-indicator]")).toHaveText(`0${i + 1} / 05`);
    }
  });

  test("the pin lets go after the last project and the page goes on", async ({ page }) => {
    await page.goto("/vi");
    await intoPin(page);
    for (let i = 0; i < 4; i++) await step(page);
    await expect(activeTitle(page)).toHaveText("TinVid");
    expect(await stuck(page)).toBe(true); // the last project has its whole viewport of scroll too
    await step(page);
    await step(page);
    expect(await stuck(page)).toBe(false);
    await expect(activeTitle(page)).toHaveText("TinVid");
    await expect(page.locator("#building")).toBeInViewport();
  });

  test("the indicator is in the server markup but hidden, and only shows in the pinned state", async ({ browser }) => {
    const plain = await browser.newPage({ javaScriptEnabled: false });
    await plain.goto("/vi");
    await expect(plain.locator("[data-pin-indicator]")).toHaveCount(1);
    await expect(plain.locator("[data-pin-indicator]")).toBeHidden();
    await expect(plain.locator("[data-motion-pin] > [data-pin-item]")).toHaveCount(5);
    await plain.close();

    const page = await browser.newPage();
    await page.goto("/vi");
    await expect(page.locator("[data-pin-indicator]")).toHaveAttribute("aria-hidden", "true");
    await pinReady(page);
    await expect(page.locator("[data-pin-indicator]")).toBeVisible();
    await page.setViewportSize({ width: 900, height: 900 });
    await pinReleased(page);
    await expect(page.locator("[data-pin-indicator]")).toBeHidden();
    await page.close();
  });

  for (const [width, height] of [[1440, 900], [1024, 700]] as const) {
    test(`at ${width}x${height} the stage and the indicator fit below the fixed header with nothing clipped`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto("/vi");
      await intoPin(page);
      for (const [i, title] of titles.entries()) {
        if (i > 0) await step(page);
        await expect(activeTitle(page)).toHaveText(title);
        const fit = await page.evaluate(() => {
          const viewport = window.innerHeight;
          const item = document.querySelector("[data-pin-active]")!;
          const stage = document.querySelector("[data-motion-pin]")!.getBoundingClientRect();
          const indicator = document.querySelector("[data-pin-indicator]")!.getBoundingClientRect();
          const inside = [...item.querySelectorAll("h3, img, a, dl")].every((el) => {
            const box = el.getBoundingClientRect();
            return box.width === 0 || (box.top >= 64 && box.bottom <= viewport);
          });
          return {
            indicatorBelowHeader: indicator.top >= 64,
            indicatorAboveStage: indicator.bottom <= stage.top,
            stageInViewport: stage.top >= 64 && stage.bottom <= viewport,
            nothingTaller: item.scrollHeight <= item.clientHeight,
            inside,
          };
        });
        expect(fit, title).toEqual({ indicatorBelowHeader: true, indicatorAboveStage: true, stageInViewport: true, nothingTaller: true, inside: true });
      }
    });
  }

  test("a viewport too short for the tallest project keeps the stacked list, and pins again once it is tall enough", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 420 });
    await page.goto("/vi");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /pin/, { timeout: 20_000 });
    await page.mouse.move(700, 300);
    await page.mouse.wheel(0, 100);
    await settledScrollY(page);
    await expect(wrapper(page)).not.toHaveAttribute("data-pin-ready");
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator("[data-pin-indicator]")).toBeHidden();

    await page.setViewportSize({ width: 1440, height: 900 });
    await pinReady(page);
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
    await page.setViewportSize({ width: 1440, height: 420 });
    await pinReleased(page);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
  });

  test("crossing below 1024 px releases the pin and shows all five projects, and crossing back pins again", async ({ page }) => {
    await page.goto("/vi");
    await intoPin(page);
    await step(page);
    for (let round = 0; round < 3; round++) {
      await page.setViewportSize({ width: 900, height: 900 });
      await pinReleased(page);
      for (const title of titles) await expect(page.getByRole("heading", { level: 3, name: title, exact: true })).toBeVisible();
      expect(await page.locator(".pin-spacer").count()).toBe(0);
      await page.setViewportSize({ width: 1440, height: 900 });
      await pinReady(page);
      await expect(page.locator(".pin-spacer")).toHaveCount(1);
    }
  });

  test("below the pin, releasing and taking over the projects keeps the section that is being read where it is", async ({ page }) => {
    await page.goto("/vi#faq");
    await pinReady(page);
    const top = () => page.locator("#faq").evaluate((el) => Math.round(el.getBoundingClientRect().top));
    await settledScrollY(page);
    // Reduced motion changes nothing about the layout except the pin itself, so the page must not move.
    for (let round = 0; round < 2; round++) {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await pinReleased(page);
      await settledScrollY(page);
      expect(await top(), "released").toBeGreaterThan(0);
      expect(await top(), "released").toBeLessThan(120);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await pinReady(page);
      await settledScrollY(page);
      expect(await top(), "pinned again").toBeGreaterThan(0);
      expect(await top(), "pinned again").toBeLessThan(120);
    }
  });

  test("releasing the pin leaves the server markup and styles as they were", async ({ page, context }) => {
    await page.goto("/vi");
    await intoPin(page);
    await step(page);
    await step(page);
    await page.setViewportSize({ width: 900, height: 900 });
    await pinReleased(page);
    const released = await page.evaluate(() => {
      const section = document.querySelector("#projects")!;
      return {
        spacers: section.querySelectorAll(".pin-spacer").length,
        wrapperStyle: document.querySelector("[data-motion-pin]")!.getAttribute("style"),
        stateAttributes: [...section.querySelectorAll("[data-pin-active], [data-pin-ready]")].length,
        pinStyles: [...section.querySelectorAll("[data-pin-item], [data-pin-item] .reveal-media, [data-pin-item] .reveal-item")].filter((el) => {
          const style = el.getAttribute("style");
          return style !== null && !/^--i:\s*\d+;?$/.test(style.trim());
        }).length,
        indicator: document.querySelector("[data-pin-indicator]")!.textContent,
        html: section.outerHTML.replace(/\s*\bis-visible\b/g, ""),
      };
    });
    expect(released).toMatchObject({ spacers: 0, wrapperStyle: null, stateAttributes: 0, pinStyles: 0, indicator: "01 / 05" });

    // The same markup as a page that was never pinned (the same width, with nothing to take over).
    const fresh = await context.newPage();
    await fresh.setViewportSize({ width: 900, height: 900 });
    await fresh.goto("/vi");
    await expect(fresh.locator("html")).toHaveAttribute("data-motion", /smooth/, { timeout: 20_000 });
    const reference = await fresh.evaluate(() => document.querySelector("#projects")!.outerHTML.replace(/\s*\bis-visible\b/g, ""));
    await fresh.close();
    expect(released.html).toBe(reference);
  });

  test("when the motion layer fails to load, the indicator stays hidden and the projects stay stacked", async ({ page }) => {
    test.skip(Boolean(process.env.E2E_PROD), "production chunk names are hashed, so the engine chunk cannot be picked out");
    let aborted = 0;
    await page.route(/motion_engine|motion\/engine/, (route) => {
      aborted += 1;
      return route.abort();
    });
    await page.goto("/vi");
    await expect.poll(() => aborted).toBeGreaterThan(0);
    await expect(wrapper(page)).not.toHaveAttribute("data-pin-ready");
    await expect(page.locator("[data-pin-indicator]")).toBeHidden();
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    for (const title of titles) await expect(page.getByRole("heading", { level: 3, name: title, exact: true })).toHaveCount(1);
  });

  test("without Lenis (it fails to load) the projects are still pinned and step on native scrolling", async ({ page }) => {
    test.skip(Boolean(process.env.E2E_PROD), "production chunk names are hashed, so the Lenis chunk cannot be picked out");
    let aborted = 0;
    await page.route(/lenis/, (route) => {
      aborted += 1;
      return route.abort();
    });
    await page.goto("/vi");
    await pinReady(page);
    await expect.poll(() => aborted).toBeGreaterThan(0);
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
    await intoPin(page);
    await step(page);
    await expect(activeTitle(page)).toHaveText("Rankdle");
    await page.locator('[data-slug="hadi"] h3 a').focus();
    await expect(activeTitle(page)).toHaveText("Hadi");
    expect(await stuck(page)).toBe(true);
  });

  test("every project stays in the accessibility tree and the tab order; the inactive ones are only transparent", async ({ page }) => {
    await page.goto("/vi");
    await pinReady(page);
    for (const title of titles) await expect(page.getByRole("heading", { level: 3, name: title, exact: true })).toHaveCount(1);
    const state = await page.evaluate(() =>
      [...document.querySelectorAll("[data-pin-item]")].map((item) => {
        const own = getComputedStyle(item);
        return {
          opacity: own.opacity,
          visibility: own.visibility,
          display: own.display,
          inert: item.closest("[inert]") !== null,
          ariaHidden: item.closest("[aria-hidden]") !== null,
          links: [...item.querySelectorAll("a[href]:not([tabindex='-1'])")].length,
        };
      }),
    );
    expect(state.map((s) => s.opacity)).toEqual(["1", "0", "0", "0", "0"]);
    for (const s of state) expect(s).toMatchObject({ visibility: "visible", display: "grid", inert: false, ariaHidden: false });
    expect(state.map((s) => s.links)).toEqual([1, 2, 2, 2, 3]); // the for-sale card also has its link to the contact section
  });

  test("the pin owns the visibility of the projects: the reveal styles do not hide the active one", async ({ page }) => {
    await page.goto("/vi");
    await pinReady(page);
    // Far above the section, so the reveal observer has not marked anything visible.
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    const active = page.locator("[data-pin-active]");
    await expect(active).not.toHaveClass(/is-visible/);
    for (const item of await active.locator(".reveal-item").all()) await expect(item).toHaveCSS("opacity", "1");
    await expect(active.locator(".reveal-item").first()).toHaveCSS("transform", "none");
    await expect(active.locator(".reveal-media")).toHaveCSS("clip-path", "inset(0px)");
  });

  test("links of the inactive projects cannot be clicked by pointer; those of the active one can", async ({ page }) => {
    await page.goto("/vi");
    await pinReady(page);
    const live = (slug: string) => page.locator(`[data-slug="${slug}"] a[target=_blank]`);
    await intoPin(page); // Tingtingvac is active and has no live link: the whole-card overlay and the title are the targets
    await expect(page.locator('[data-slug="tingtingvac"] h3 a')).toBeVisible();
    await expect(live("rankdle")).toHaveCSS("pointer-events", "none");
    await expect(page.locator('[data-slug="rankdle"] h3 a')).toHaveCSS("pointer-events", "none");
    await expect(live("rankdle").click({ trial: true, timeout: 1000 })).rejects.toThrow();

    await step(page);
    await expect(activeTitle(page)).toHaveText("Rankdle");
    await expect(live("rankdle")).toHaveCSS("pointer-events", "auto");
    await live("rankdle").click({ trial: true, timeout: 5000 });
    await expect(live("mythiep")).toHaveCSS("pointer-events", "none");
  });

  test("only transform, opacity and clip-path are animated while the projects swap", async ({ page }) => {
    await page.goto("/vi");
    await intoPin(page);
    await page.evaluate(() => {
      const seen = new Set<string>();
      (window as unknown as { animated: Set<string> }).animated = seen;
      const watch = (el: Element) => {
        if (!el.closest("[data-pin-item]")) return; // the wrapper is the pin: fixed position, offsets and size are ScrollTrigger's
        for (const name of (el as HTMLElement).style) if (!name.startsWith("--")) seen.add(name);
      };
      new MutationObserver((records) => records.forEach((record) => watch(record.target as Element))).observe(document.querySelector("[data-motion-pin]")!, {
        attributes: true,
        attributeFilter: ["style"],
        subtree: true,
      });
    });
    await step(page);
    await step(page);
    const animated = await page.evaluate(() => [...(window as unknown as { animated: Set<string> }).animated].sort());
    expect(animated.length).toBeGreaterThan(0);
    for (const name of animated) expect(["opacity", "transform", "clip-path", "translate", "scale", "rotate"], name).toContain(name);
  });

  test("the incoming cover is wiped in and the text follows", async ({ page }) => {
    await page.goto("/vi");
    await intoPin(page);
    await page.evaluate(() => {
      const seen: string[] = [];
      (window as unknown as { wipes: string[] }).wipes = seen;
      const media = document.querySelector('[data-slug="rankdle"] .reveal-media') as HTMLElement;
      new MutationObserver(() => seen.push(media.style.clipPath)).observe(media, { attributes: true, attributeFilter: ["style"] });
    });
    await step(page);
    await expect(page.locator('[data-slug="rankdle"] .reveal-media')).toHaveCSS("clip-path", "inset(0px)", { timeout: 5000 });
    const wipes = await page.evaluate(() => (window as unknown as { wipes: string[] }).wipes);
    expect(wipes.length).toBeGreaterThan(2); // it moved through intermediate frames, it did not jump
    expect(wipes[0]).toMatch(/^inset\(/);
    await expect(page.locator('[data-slug="rankdle"] .reveal-item').first()).toHaveCSS("opacity", "1", { timeout: 5000 });
  });

  test("Tab reaches every project link in order, and the focused project is the visible one", async ({ page }) => {
    await page.goto("/vi");
    await pinReady(page);
    await page.locator("#hero").scrollIntoViewIfNeeded();
    const expected = [
      "/vi/projects/tingtingvac",
      "/vi/projects/rankdle",
      "https://doanrankmlbbft.com",
      "/vi/projects/mythiep",
      "https://mythiep.com",
      "/vi/projects/hadi",
      "https://hadilanguage.com",
      "/vi/projects/tinvid",
      "https://tinvid.com",
    ];
    const focused = () =>
      page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const item = el.closest("[data-pin-item]");
        const box = el.getBoundingClientRect();
        return {
          href: el.getAttribute("href"),
          inProject: item !== null,
          active: item?.hasAttribute("data-pin-active") ?? false,
          opacity: item ? getComputedStyle(item).opacity : "",
          unobscured: box.top >= 64 && box.bottom <= window.innerHeight,
          // The whole-card link lies over the title and has the same address, so what is hit is the link to the same place.
          hit: document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)?.closest("a")?.getAttribute("href") === el.getAttribute("href"),
        };
      });

    const order: string[] = [];
    for (let presses = 0; presses < 60 && order.length < expected.length; presses++) {
      await page.keyboard.press("Tab");
      const now = await focused();
      if (!now.inProject) continue;
      order.push(now.href ?? "");
      await expect.poll(focused, { timeout: 8000 }).toMatchObject({ active: true, opacity: "1", unobscured: true, hit: true });
    }
    expect(order).toEqual(expected);

    // And backwards: Shift+Tab walks the same links in reverse, each time onto the project that is shown.
    const reverse: string[] = [];
    for (let presses = 0; presses < 4; presses++) {
      await page.keyboard.press("Shift+Tab");
      const now = await focused();
      reverse.push(now.href ?? "");
      await expect.poll(focused, { timeout: 8000 }).toMatchObject({ inProject: true, active: true, opacity: "1", unobscured: true });
    }
    expect(reverse).toEqual(expected.slice(4, 8).reverse());
  });

  test("scrolling away from a focused project does not leave focus on one nobody can see", async ({ page }) => {
    await page.goto("/vi");
    await intoPin(page);
    await page.locator('[data-slug="tingtingvac"] h3 a').focus();
    await step(page);
    await step(page);
    await expect(activeTitle(page)).toHaveText("mythiep");
    const hidden = await page.evaluate(() => {
      const item = document.activeElement?.closest("[data-pin-item]");
      return item !== null && item !== undefined && !item.hasAttribute("data-pin-active");
    });
    expect(hidden).toBe(false);
  });

  test("a deep link below the pin lands on its section after the pin has initialised", async ({ page }) => {
    await page.goto("/vi#faq");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /pin/, { timeout: 20_000 });
    await pinReady(page);
    const top = () => page.locator("#faq").evaluate((el) => Math.round(el.getBoundingClientRect().top));
    await expect.poll(top).toBeLessThan(120);
    await expect.poll(top).toBeGreaterThan(0);
    await settledScrollY(page);
    expect(await top()).toBeLessThan(120);
    expect(await top()).toBeGreaterThan(0);
  });

  for (const id of ["services", "projects", "contact"]) {
    test(`/vi#${id} ends on its section once the pin is in place`, async ({ page }) => {
      await page.goto(`/vi#${id}`);
      await pinReady(page);
      await settledScrollY(page);
      const top = await page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top));
      expect(top).toBeGreaterThan(0);
      expect(top).toBeLessThan(120);
    });
  }

  test("Back from a case study returns to the projects section, on the project that was left", async ({ page }) => {
    await page.goto("/vi");
    await intoPin(page);
    await step(page);
    await step(page);
    await step(page);
    await expect(activeTitle(page)).toHaveText("Hadi");
    // A real click on the card: the whole-card link lies over the cover, so only the pointer position can be used.
    const cover = (await page.locator("[data-pin-active] .reveal-media").boundingBox())!;
    await page.mouse.click(cover.x + cover.width / 2, cover.y + cover.height / 2);
    await expect(page).toHaveURL(/\/vi\/projects\/hadi$/);
    await back(page);
    await expect(page).toHaveURL(/\/vi$/);
    await pinReady(page);
    await settledScrollY(page);
    await expect(page.locator("#projects")).toBeInViewport();
    await expect(activeTitle(page)).toHaveText("Hadi");
    expect(await stuck(page)).toBe(true);
  });

  test("anchor clicks from the header land below it while pinned, and the navigation keeps Work current throughout", async ({ page }) => {
    await page.goto("/en");
    await intoPin(page);
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await step(page);
    await step(page);
    await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "location");
    await step(page);
    await step(page);
    await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "location");

    for (const [name, id] of [["Services", "services"], ["FAQ", "faq"], ["Work", "projects"]] as const) {
      await nav.getByRole("link", { name }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await settledScrollY(page);
      const top = await page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top));
      expect(top, id).toBeGreaterThanOrEqual(64);
      expect(top, id).toBeLessThanOrEqual(96);
      await expect(nav.getByRole("link", { name })).toHaveAttribute("aria-current", "location");
    }
  });

  test("a header link clicked right after the pin is built lands on its section, not short of it", async ({ page }) => {
    await page.goto("/vi");
    await pinReady(page);
    // No wait: the pin has just added about 2400 px to the page, which the smooth scroller has to know before it aims.
    await page.locator('header nav a[href$="#faq"]').first().click();
    await expect(page).toHaveURL(/#faq$/);
    await settledScrollY(page);
    const top = await topOf(page, "faq");
    expect(top).toBeGreaterThanOrEqual(64);
    expect(top).toBeLessThanOrEqual(96);
  });

  test("ten round trips to a case study leave exactly one pin, one indicator, one smooth scroller and no extra listeners", async ({ page }) => {
    const problems: string[] = [];
    page.on("pageerror", (error) => problems.push(error.message));
    page.on("console", (message) => {
      if (isAnalyticsScriptFailure(message)) return;
      if (message.type() === "error" || message.text().startsWith("The motion layer")) problems.push(message.text());
    });
    // The window listeners that are alive right now, by event type: a leak shows as growth from one round trip to the next.
    await page.addInitScript(() => {
      const live = new Map<string, Set<EventListenerOrEventListenerObject>>();
      const add = window.addEventListener.bind(window);
      const remove = window.removeEventListener.bind(window);
      window.addEventListener = (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
        if (!live.has(type)) live.set(type, new Set());
        live.get(type)!.add(listener);
        add(type, listener, options);
      };
      window.removeEventListener = (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => {
        live.get(type)?.delete(listener);
        remove(type, listener, options);
      };
      (window as unknown as { liveListeners: () => Record<string, number> }).liveListeners = () =>
        Object.fromEntries([...live].map(([type, set]) => [type, set.size]));
    });
    const listeners = () => page.evaluate(() => (window as unknown as { liveListeners: () => Record<string, number> }).liveListeners());

    await page.goto("/vi");
    await pinReady(page);
    let afterTwo: Record<string, number> = {};
    for (let round = 0; round < 10; round++) {
      await page.locator('a[href="/vi/projects/hadi"]').first().evaluate((link: HTMLElement) => link.click());
      await expect(page).toHaveURL(/\/vi\/projects\/hadi$/);
      await expect(page.locator("html")).toHaveAttribute("data-motion", /smooth/);
      expect(await page.locator(".pin-spacer").count()).toBe(0);
      await back(page);
      await expect(page).toHaveURL(/\/vi$/);
      await pinReady(page);
      await expect(page.locator(".pin-spacer")).toHaveCount(1);
      if (round === 1) afterTwo = await listeners();
    }
    await expect(page.locator("[data-pin-indicator]")).toHaveCount(1);
    expect(await page.evaluate(() => document.querySelectorAll(".lenis").length)).toBe(1);
    expect(await listeners()).toEqual(afterTwo);
    await settledScrollY(page);
    await intoPin(page);
    await step(page);
    await expect(activeTitle(page)).toHaveText("Rankdle");
    expect(problems).toEqual([]);
  });

  test("switching reduced motion on releases the pin, switching it off pins again", async ({ page }) => {
    await page.goto("/vi");
    await intoPin(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await pinReleased(page);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    for (const item of await page.locator("[data-pin-item]").all()) await expect(item).toHaveCSS("opacity", "1");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await pinReady(page);
  });
});

// Brings a section to 200 px under the top of the screen, the way a visitor reading it would have it, and lets the page
// remember it (it is written a few frames after scrolling has stopped).
async function readSection(page: Page, id: string) {
  await page.evaluate((target) => {
    const section = document.getElementById(target)!;
    window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - 200, behavior: "instant" });
  }, id);
  await settledScrollY(page);
  await frames(page, 10);
}
const topOf = (page: Page, id: string) => page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top));
const openCaseStudy = async (page: Page) => {
  await page.locator('a[href="/vi/projects/hadi"]').first().evaluate((link: HTMLElement) => link.click());
  await expect(page).toHaveURL(/\/vi\/projects\/hadi$/);
};

test.describe("reading position around the pin", () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile, "the touch project keeps the browser's own restoration, see below");
  });

  for (const id of ["services", "faq", "contact"]) {
    test(`Back from a case study opened while reading #${id} returns to that section, where it was on screen`, async ({ page }) => {
      await page.goto("/vi");
      await pinReady(page);
      await readSection(page, id);
      const before = await topOf(page, id);
      await openCaseStudy(page);
      await back(page);
      await expect(page).toHaveURL(/\/vi$/);
      await pinReady(page);
      await settledScrollY(page);
      expect(Math.abs((await topOf(page, id)) - before), `#${id} was ${before} px from the top`).toBeLessThan(120);
      await expect(page.locator(`#${id}`)).toBeInViewport();
    });
  }

  // The header links and the palette add a history entry without the page being started again.
  const throughHeader = async (page: Page, id: string) => {
    await page.locator(`header nav a[href$="#${id}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await settledScrollY(page);
    await frames(page, 10);
  };
  const throughPalette = async (page: Page, id: string) => {
    await page.keyboard.press("Control+K");
    await page.getByRole("dialog").getByRole("combobox").fill(id);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await settledScrollY(page);
    await frames(page, 10);
  };

  for (const [how, reach] of [["a header link", throughHeader], ["the command palette", throughPalette]] as const) {
    test(`Back from a case study returns to the FAQ that ${how} had brought the page to`, async ({ page }) => {
      await page.goto("/vi");
      await pinReady(page);
      await reach(page, "faq");
      const before = await topOf(page, "faq");
      await openCaseStudy(page);
      await back(page);
      await expect(page).toHaveURL(/\/vi#faq$/);
      await pinReady(page);
      await settledScrollY(page);
      expect(Math.abs((await topOf(page, "faq")) - before)).toBeLessThan(120);
      await expect(page.locator("#faq")).toBeInViewport();
    });
  }

  test("reloading after a header link had brought the page to the FAQ comes back to the FAQ", async ({ page }) => {
    await page.goto("/vi");
    await pinReady(page);
    await throughHeader(page, "faq");
    const before = await topOf(page, "faq");
    await page.reload();
    await pinReady(page);
    await settledScrollY(page);
    expect(Math.abs((await topOf(page, "faq")) - before)).toBeLessThan(120);
  });

  test("a Back between two hash entries leaves no mark on the visits that follow it", async ({ page }) => {
    const logo = page.locator('header a[href="/vi"]').first();
    await page.goto("/vi");
    await pinReady(page);
    await throughHeader(page, "faq");
    await throughHeader(page, "services");
    await back(page); // the browser alone: back to the FAQ entry of the same page
    await expect(page).toHaveURL(/\/vi#faq$/);
    await settledScrollY(page);
    await frames(page, 10);

    await logo.click(); // a link click home, from the page it is on
    await expect(page).toHaveURL(/\/vi$/);
    await settledScrollY(page);
    await frames(page, 10);
    const reading = await topOf(page, "faq");
    await openCaseStudy(page);
    await back(page);
    await expect(page).toHaveURL(/\/vi$/);
    await pinReady(page);
    await settledScrollY(page);
    // Where the reader actually was when leaving, not the FAQ of the entry the hash Back had gone through.
    expect(Math.abs((await topOf(page, "faq")) - reading)).toBeLessThan(120);

    await openCaseStudy(page);
    await logo.click(); // a plain link click to home from a case study starts at the top
    await expect(page).toHaveURL(/\/vi$/);
    await pinReady(page);
    await settledScrollY(page);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(5);
  });

  test("reloading the page while reading the FAQ comes back to the FAQ, where it was on screen", async ({ page }) => {
    await page.goto("/vi");
    await pinReady(page);
    await readSection(page, "faq");
    const before = await topOf(page, "faq");
    await page.reload();
    await pinReady(page);
    await settledScrollY(page);
    expect(Math.abs((await topOf(page, "faq")) - before)).toBeLessThan(120);
    await expect(page.locator("#faq")).toBeInViewport();
  });

  test("a fresh visit still starts at the top and a fragment still lands on its section, whatever was remembered", async ({ page }) => {
    await page.goto("/vi");
    await pinReady(page);
    await readSection(page, "faq");
    await page.goto("/en");
    await page.goto("/vi");
    await pinReady(page);
    await settledScrollY(page);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);

    await readSection(page, "faq");
    await page.goto("/en");
    await page.goto("/vi#services");
    await pinReady(page);
    await settledScrollY(page);
    const top = await topOf(page, "services");
    expect(top).toBeGreaterThan(0);
    expect(top).toBeLessThan(120);
  });

  test("Back from inside the pin still returns to the project that was on show", async ({ page }) => {
    await page.goto("/vi");
    await intoPin(page);
    await step(page);
    await step(page);
    await expect(activeTitle(page)).toHaveText("mythiep");
    await frames(page, 10);
    await openCaseStudy(page);
    await back(page);
    await pinReady(page);
    await settledScrollY(page);
    await expect(activeTitle(page)).toHaveText("mythiep");
    expect(await stuck(page)).toBe(true);
  });

  test("where the pin does not run (a viewport too short for it) the browser's own restoration is left alone", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 420 });
    await page.goto("/vi");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /pin/, { timeout: 20_000 });
    await readSection(page, "faq");
    const before = await topOf(page, "faq");
    await openCaseStudy(page);
    await back(page);
    await expect(page.locator("html")).toHaveAttribute("data-motion", /pin/, { timeout: 20_000 });
    await settledScrollY(page);
    await expect(wrapper(page)).not.toHaveAttribute("data-pin-ready");
    expect(Math.abs((await topOf(page, "faq")) - before)).toBeLessThan(120);
  });

  test("the remembered positions stay below the cap however long the session", async ({ page }) => {
    // 25 sequential page loads: about 25 s against the dev server, so the 30 s default has no margin there.
    test.setTimeout(90_000);
    await page.goto("/vi");
    await pinReady(page);
    for (let round = 0; round < 24; round++) {
      await page.goto(round % 2 === 0 ? "/en" : "/vi");
      await pinReady(page);
      // A fixed spread of offsets, so each load remembers a different position without any randomness.
      const y = 600 + ((round * 37) % 100);
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
      await frames(page, 10);
    }
    const stored = await page.evaluate(() => Object.keys(JSON.parse(sessionStorage.getItem("portfolio:reading-anchors") ?? "{}")).length);
    expect(stored).toBeGreaterThan(0);
    expect(stored).toBeLessThanOrEqual(20);
  });
});

test.describe("projects on a touch screen", () => {
  test("they stack and each reveals; nothing is pinned", async ({ page, isMobile }) => {
    test.skip(!isMobile, "touch project only");
    await page.goto("/vi");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /count/, { timeout: 20_000 });
    await expect(wrapper(page)).not.toHaveAttribute("data-pin-ready");
    await expect(page.locator("[data-pin-indicator]")).toBeHidden();
    for (const title of titles) {
      const heading = page.getByRole("heading", { level: 3, name: title, exact: true });
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();
      await expect(heading).toHaveCSS("opacity", "1", { timeout: 5000 });
    }
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator("[data-pin-active]")).toHaveCount(0);
  });

  test("Back and reload restore the position as the browser does, nothing of ours is involved", async ({ page, isMobile }) => {
    test.skip(!isMobile, "touch project only");
    await page.goto("/vi");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /count/, { timeout: 20_000 });
    await readSection(page, "faq");
    const before = await topOf(page, "faq");
    await openCaseStudy(page);
    await back(page);
    await expect(page).toHaveURL(/\/vi$/);
    await settledScrollY(page);
    expect(Math.abs((await topOf(page, "faq")) - before)).toBeLessThan(120);
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-motion", /count/, { timeout: 20_000 });
    await settledScrollY(page);
    expect(Math.abs((await topOf(page, "faq")) - before)).toBeLessThan(120);
    expect(await page.evaluate(() => sessionStorage.getItem("portfolio:reading-anchors"))).toBeNull();
  });
});
