import { expect, test, type Page } from "@playwright/test";
import { isAnalyticsScriptFailure } from "./helpers/console";
import { back } from "./helpers/scroll";

// The browser's View Transitions API is watched, not mocked: `startViewTransition` still runs, and every pseudo-element
// animation it creates is recorded once the transition is ready.
interface Watch {
  started: number;
  rejected: number;
  finished: number;
  animations: { n: number; pseudo: string; duration: number; display: string }[];
  scrolls: number[];
}

const watchTransitions = (page: Page) =>
  page.addInitScript(() => {
    const w = window as unknown as { vt: Watch };
    w.vt = { started: 0, rejected: 0, finished: 0, animations: [], scrolls: [] };
    const original = document.startViewTransition?.bind(document);
    if (!original) return;
    document.startViewTransition = (arg?: ViewTransitionUpdateCallback | StartViewTransitionOptions) => {
      const transition = original(arg);
      const n = ++w.vt.started;
      w.vt.scrolls.push(Math.round(scrollY));
      transition.ready.then(
        () => {
          for (const animation of document.getAnimations()) {
            const effect = animation.effect as KeyframeEffect | null;
            if (!effect?.pseudoElement) continue;
            w.vt.animations.push({
              n,
              pseudo: effect.pseudoElement,
              duration: Number(effect.getComputedTiming().endTime),
              display: getComputedStyle(document.documentElement, effect.pseudoElement).display,
            });
          }
        },
        () => w.vt.rejected++,
      );
      transition.finished.then(
        () => w.vt.finished++,
        () => w.vt.finished++,
      );
      return transition;
    };
  });

const watched = (page: Page) => page.evaluate(() => (window as unknown as { vt: Watch }).vt);
const reset = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { vt: Watch };
    w.vt = { started: 0, rejected: 0, finished: 0, animations: [], scrolls: [] };
  });
// Names of the covers that took part, whichever pseudo-element they were seen through.
const coverNames = (vt: Watch) => [...new Set(vt.animations.map((a) => /\((cover-[^)]+)\)/.exec(a.pseudo)?.[1]).filter(Boolean))];
const pseudosOf = (vt: Watch, name: string) => vt.animations.filter((a) => a.pseudo.includes(`(${name})`)).map((a) => a.pseudo.replace(/\(.*\)/, ""));
const noneRunning = (page: Page) =>
  expect
    .poll(() => page.evaluate(() => document.getAnimations().filter((a) => (a.effect as KeyframeEffect | null)?.pseudoElement).length))
    .toBe(0);

// Every transition that started has ended.
const settled = (page: Page) =>
  expect.poll(async () => { const vt = await watched(page); return vt.started - vt.finished; }, { timeout: 10_000 }).toBe(0);

const wrapper = (page: Page) => page.locator("[data-motion-pin]");
const pinReady = (page: Page) => expect(wrapper(page)).toHaveAttribute("data-pin-ready", "", { timeout: 20_000 });
const caseCover = (page: Page) => page.locator("[data-motion-parallax] img");

// Nothing is excused except the Vercel analytics script (see helpers/console.ts) and Next's dev-only LCP hint about a
// lazy cover on the home page. A scripted scroll paints a cover before any input, so Chrome reports it as the LCP; a
// visitor's own input ends that observation, so the hint never describes a visitor. Making every cover eager would
// fetch all five on a direct load (docs/performance.md, "The project covers and Next's LCP hint").
// The hint names the image it is about, so only a project cover is excused.
const lcpHint = /Image with src "\/projects\/[a-z]+\/cover[^"]*" was detected as the Largest Contentful Paint/;

const problems = (page: Page) => {
  const list: string[] = [];
  page.on("console", (message) => {
    if (!["error", "warning"].includes(message.type())) return;
    if (isAnalyticsScriptFailure(message) || lcpHint.test(message.text())) return;
    list.push(`${message.text()} ${message.location().url}`);
  });
  page.on("pageerror", (error) => list.push(error.message));
  return list;
};

// A real click in the middle of the cover, the way a visitor would: the whole-card link lies over the picture.
async function clickCover(page: Page, article: ReturnType<Page["locator"]>) {
  await article.locator(".reveal-media").scrollIntoViewIfNeeded();
  const box = (await article.locator(".reveal-media").boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

test.describe("cover morph", () => {
  test.use({ reducedMotion: "no-preference" });

  test("pinned home: the active cover morphs into the case study; the transparent ones stay out of it", async ({ page, isMobile }) => {
    test.skip(isMobile, "pinned only with a fine pointer and a wide screen");
    const errors = problems(page);
    await watchTransitions(page);
    await page.goto("/en");
    await pinReady(page);
    const card = page.locator("#projects article").nth(1);
    await card.locator("h3 a").focus();
    await expect(card).toHaveAttribute("data-pin-active", "");
    await expect(card.locator(".reveal-media")).toBeInViewport();
    await reset(page);

    await clickCover(page, card);
    await expect(page).toHaveURL(/\/en\/projects\/rankdle$/);
    await expect.poll(async () => (await watched(page)).finished, { timeout: 10_000 }).toBeGreaterThan(0);

    const vt = await watched(page);
    expect(vt.started).toBeGreaterThan(0);
    expect(vt.rejected).toBe(0);
    expect(coverNames(vt)).toEqual(["cover-rankdle"]);
    // The pair: one group, an old and a new snapshot.
    expect(pseudosOf(vt, "cover-rankdle")).toEqual(expect.arrayContaining(["::view-transition-group", "::view-transition-old", "::view-transition-new"]));
    await noneRunning(page);
    await expect(caseCover(page)).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("stacked home: the cover morphs when the browser supports it", async ({ page }) => {
    // Narrow desktop: the list is stacked, without the pin.
    await page.setViewportSize({ width: 900, height: 900 });
    await watchTransitions(page);
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("data-reveal-ready", "");
    const card = page.locator("#projects article").nth(2);
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveClass(/is-visible/);
    await reset(page);

    await clickCover(page, card);
    await expect(page).toHaveURL(/\/en\/projects\/mythiep$/);
    await expect.poll(async () => (await watched(page)).finished, { timeout: 10_000 }).toBeGreaterThan(0);
    const vt = await watched(page);
    expect(vt.rejected).toBe(0);
    expect(coverNames(vt)).toEqual(["cover-mythiep"]);
    expect(pseudosOf(vt, "cover-mythiep")).toContain("::view-transition-group");
    await expect(caseCover(page)).toBeVisible();
  });

  test("Back restores the reading position on the same project and leaves no cover behind", async ({ page, isMobile }) => {
    await watchTransitions(page);
    await page.goto("/en");
    if (!isMobile) await pinReady(page);
    const card = page.locator("#projects article").nth(1);
    if (!isMobile) {
      await card.locator("h3 a").focus();
      await expect(card).toHaveAttribute("data-pin-active", "");
    }
    await clickCover(page, card);
    await expect(page).toHaveURL(/\/en\/projects\/rankdle$/);
    await expect(caseCover(page)).toBeVisible();
    await settled(page);
    await reset(page);

    await back(page);
    await expect(page).toHaveURL(/\/en$/);
    if (!isMobile) await pinReady(page);
    await expect(page.locator("#projects")).toBeInViewport({ timeout: 20_000 });
    await expect(page.locator("#projects article").nth(1).locator("h3")).toBeInViewport();
    await settled(page);
    await noneRunning(page);
    expect((await watched(page)).rejected).toBe(0);
  });

  // Observed, not designed for: in this stack a history traversal (Back, Forward) never calls `document.startViewTransition`.
  // Logging the vendored react-dom's commits showed the traversal's page swap committing with lanes 1026, which include
  // SyncLane (2) next to a transition lane, while the forward link click commits with lanes 512 and does start one. The
  // view-transition work in a commit is gated on lanes that are transition lanes only, and `flushSyncWorkAcrossRoots_impl`
  // adds SyncLane to the lanes of a transition it flushes eagerly inside a popstate event. Unknown: whether that is
  // intended, and whether the guide's "Navigating back reverses the morph" holds in some other setup. Plain links, the
  // logo and "All projects" are ordinary navigations and do transition.
  test.fixme("Back morphs the cover home", async ({ page }) => {
    await watchTransitions(page);
    await page.goto("/en");
    await pinReady(page);
    const card = page.locator("#projects article").nth(1);
    await card.locator("h3 a").focus();
    await clickCover(page, card);
    await expect(page).toHaveURL(/\/en\/projects\/rankdle$/);
    await settled(page);
    await reset(page);
    await back(page);
    await expect(page).toHaveURL(/\/en$/);
    await expect.poll(async () => coverNames(await watched(page))).toEqual(["cover-rankdle"]);
  });

  test("the case-study parallax starts from the served position once the morph has ended", async ({ page, isMobile }) => {
    await watchTransitions(page);
    await page.goto("/en");
    const card = page.locator("#projects article").nth(0);
    if (!isMobile) await pinReady(page);
    await clickCover(page, card);
    await expect(page).toHaveURL(/\/en\/projects\/tingtingvac$/);
    await expect.poll(async () => (await watched(page)).finished, { timeout: 10_000 }).toBeGreaterThan(0);
    await noneRunning(page);
    await expect(page.locator("[data-motion-parallax][data-parallax-ready]")).toHaveCount(1, { timeout: 20_000 });
    const served = await page.evaluate(() => {
      const figure = document.querySelector("[data-motion-parallax]")!;
      const box = figure.getBoundingClientRect();
      const img = figure.querySelector("img")!.getBoundingClientRect();
      const matrix = new DOMMatrix(getComputedStyle(figure.querySelector("img")!).transform === "none" ? "" : getComputedStyle(figure.querySelector("img")!).transform);
      return { scrollY: window.scrollY, shift: matrix.f, scale: matrix.a, drift: Math.abs(img.top - box.top - figure.clientTop) };
    });
    expect(served.scrollY).toBe(0);
    expect(served.shift).toBe(0);
    expect(served.scale).toBe(1);
    expect(served.drift).toBeLessThan(0.5);
  });

  test("the command palette opens a project without a stuck transition or errors", async ({ page }) => {
    const errors = problems(page);
    await watchTransitions(page);
    await page.goto("/en");
    await page.keyboard.press("Control+K");
    await page.getByRole("dialog").getByRole("combobox").fill("had");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/en\/projects\/hadi$/);
    await expect(caseCover(page)).toBeVisible();
    await settled(page);
    await noneRunning(page);
    expect((await watched(page)).rejected).toBe(0);
    // Nothing is left over the page: a click lands.
    await page.getByRole("link", { name: /All projects/ }).first().click();
    await expect(page).toHaveURL(/\/en#projects$/);
    expect(errors).toEqual([]);
  });

  test("the logo link and the language switcher are unaffected", async ({ page }) => {
    const errors = problems(page);
    await watchTransitions(page);
    await page.goto("/en/projects/hadi");
    await page.getByRole("link", { name: /^NMHx/ }).click();
    await expect(page).toHaveURL(/\/en$/);
    await settled(page);
    // The case-study cover has no partner in view: it leaves at once instead of fading across the home page.
    for (const a of (await watched(page)).animations.filter((a) => a.pseudo.includes("(cover-"))) expect(a.display).toBe("none");
    await page.getByRole("link", { name: "Tiếng Việt" }).click();
    await expect(page).toHaveURL(/\/vi$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    expect(errors).toEqual([]);
  });

  // A transition keeps the new page's effects (the palette's key listener among them) waiting until it has ended, so a
  // navigation with no cover to morph must not hold one open: nothing it creates may run longer than a few frames.
  const palette = (page: Page) => page.getByRole("dialog");
  const noLongAnimation = async (page: Page) => {
    await settled(page);
    expect((await watched(page)).animations.filter((a) => a.duration > 50)).toEqual([]);
  };

  test("the language switcher costs no delay: the palette shortcut opens on the first press", async ({ page }) => {
    await watchTransitions(page);
    await page.goto("/en");
    await reset(page);
    await page.getByRole("link", { name: "Tiếng Việt" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    await page.keyboard.press("Control+K");
    await expect(palette(page)).toBeVisible();
    await expect(palette(page).getByRole("combobox")).toBeFocused();
    await noLongAnimation(page);
  });

  test("the logo from a case study costs no delay: the palette shortcut opens on the first press", async ({ page }) => {
    await watchTransitions(page);
    await page.goto("/en/projects/hadi");
    await reset(page);
    await page.getByRole("link", { name: /^NMHx/ }).click();
    await expect(page.locator("#hero")).toBeVisible();
    await page.keyboard.press("Control+K");
    await expect(palette(page)).toBeVisible();
    await expect(palette(page).getByRole("combobox")).toBeFocused();
    await noLongAnimation(page);
  });

  test("after a morph the shortcut opens on the first press; Escape or another navigation mid-morph leaves nothing pending", async ({ page, isMobile }) => {
    const errors = problems(page);
    await watchTransitions(page);
    const open = async () => {
      await page.goto("/en");
      if (!isMobile) await pinReady(page);
      await reset(page);
      await clickCover(page, page.locator("#projects article").first());
      await expect(page).toHaveURL(/\/en\/projects\/tingtingvac$/);
    };

    await open();
    await settled(page);
    await noneRunning(page);
    await page.keyboard.press("Control+K");
    await expect(palette(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(palette(page)).toBeHidden();

    // Escape while the cover is still moving.
    await open();
    await page.keyboard.press("Escape");
    await settled(page);
    await noneRunning(page);
    await page.keyboard.press("Control+K");
    await expect(palette(page)).toBeVisible();

    // Another navigation while the cover is still moving: the first transition is skipped, the second one completes.
    await open();
    await page.getByRole("link", { name: /^NMHx/ }).click();
    await expect(page).toHaveURL(/\/en$/);
    await settled(page);
    await noneRunning(page);
    await expect(page.locator("#hero")).toBeVisible();
    await page.keyboard.press("Control+K");
    await expect(palette(page)).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("Back while the cover is still morphing ends the morph at once", async ({ page, isMobile }) => {
    await watchTransitions(page);
    await page.goto("/en");
    if (!isMobile) await pinReady(page);
    await clickCover(page, page.locator("#projects article").first());
    await expect(page).toHaveURL(/\/en\/projects\/tingtingvac$/);
    await expect.poll(async () => (await watched(page)).animations.some((a) => a.pseudo.includes("(cover-"))).toBe(true);
    await back(page);
    await expect(page).toHaveURL(/\/en$/);
    // The morph takes 0.5 s; what is left of it must not run on after the traversal.
    await expect
      .poll(() => page.evaluate(() => document.getAnimations().filter((a) => (a.effect as KeyframeEffect | null)?.pseudoElement).length), { timeout: 250 })
      .toBe(0);
    await settled(page);
  });

  test("two quick theme toggles both end in the right theme and leave no class behind", async ({ page }) => {
    await watchTransitions(page);
    await page.goto("/en");
    await reset(page);
    // The second press comes 100 ms after the first, while its 0.5 s fade is still running.
    await page.evaluate(async () => {
      const toggle = document.querySelector<HTMLButtonElement>('button[aria-label="Toggle light/dark theme"]')!;
      toggle.click();
      await new Promise((resolve) => setTimeout(resolve, 100));
      toggle.click();
    });
    await expect.poll(async () => (await watched(page)).started).toBe(2);
    await settled(page);
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.locator("html")).not.toHaveClass(/theme-swap/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
    // The second transition kept the theme's cross-fade: the first one's end must not strip the class from under it.
    const second = (await watched(page)).animations.filter((a) => a.n === 2 && a.pseudo === "::view-transition-new(root)");
    expect(second).not.toHaveLength(0);
    for (const a of second) expect(a.duration).toBe(500);
  });

  test("the theme toggle keeps its 0.5 s cross-fade; a route change does not use it", async ({ page }) => {
    await watchTransitions(page);
    await page.goto("/en");
    await reset(page);
    await page.getByRole("button", { name: "Toggle light/dark theme" }).click();
    await expect.poll(async () => (await watched(page)).animations.length, { timeout: 10_000 }).toBeGreaterThan(0);
    const theme = (await watched(page)).animations.filter((a) => a.pseudo === "::view-transition-new(root)");
    expect(theme).not.toHaveLength(0);
    for (const a of theme) expect(a.duration).toBe(500);
    await noneRunning(page);

    await page.goto("/en/projects/hadi");
    await reset(page);
    await page.getByRole("link", { name: /^NMHx/ }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect.poll(async () => (await watched(page)).finished, { timeout: 10_000 }).toBeGreaterThan(0);
    // A route change cuts over: no cross-fade of the page, whatever the theme toggle uses.
    expect((await watched(page)).animations.filter((a) => /^::view-transition-(old|new)\(root\)$/.test(a.pseudo))).toEqual([]);
  });

  test("a direct load of a case study paints its cover as before: preloaded, eager, no shift", async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { shift: number };
      w.shift = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!entry.hadRecentInput) w.shift += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto("/en/projects/rankdle");
    const img = caseCover(page);
    await expect(img).toBeVisible();
    await expect(img).not.toHaveAttribute("loading", "lazy");
    await expect(page.locator('head link[rel="preload"][as="image"]')).not.toHaveCount(0);
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => (window as unknown as { shift: number }).shift)).toBeLessThan(0.01);
  });
});

test.describe("cover morph under reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("no transition animation runs and the navigation completes", async ({ page }) => {
    const errors = problems(page);
    await watchTransitions(page);
    await page.goto("/en");
    const card = page.locator("#projects article").nth(1);
    await clickCover(page, card);
    await expect(page).toHaveURL(/\/en\/projects\/rankdle$/);
    await expect(caseCover(page)).toBeVisible();
    await settled(page);
    // The browser's own zero-length bookkeeping animations may exist; nothing may actually play.
    expect((await watched(page)).animations.filter((a) => a.duration > 0)).toEqual([]);
    expect(errors).toEqual([]);
  });
});

test("without the View Transitions API the navigation is plain and silent", async ({ page, isMobile }) => {
  const errors = problems(page);
  await page.addInitScript(() => {
    Object.defineProperty(Document.prototype, "startViewTransition", { value: undefined, configurable: true });
  });
  await page.goto("/en");
  if (!isMobile) await pinReady(page);
  await clickCover(page, page.locator("#projects article").first());
  await expect(page).toHaveURL(/\/en\/projects\/tingtingvac$/);
  await expect(caseCover(page)).toBeVisible();
  expect(errors).toEqual([]);
});
