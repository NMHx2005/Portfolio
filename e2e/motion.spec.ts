import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { isAnalyticsScriptFailure } from "./helpers/console";
import { back, frames, scrollY, settledScrollY } from "./helpers/scroll";

const opacityNotOne = (els: Element[]) => els.filter((el) => getComputedStyle(el).opacity !== "1").length;

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("nothing hides, animates, transitions or smooth-scrolls", async ({ page, isMobile }) => {
    await page.goto("/en");
    expect(await page.locator("[data-reveal]").evaluateAll(opacityNotOne)).toBe(0);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("animation-name", "none");
    await expect(page.locator("h1 .word").first()).toHaveCSS("animation-name", "none");
    await expect(page.locator(".reveal-media").first()).toHaveCSS("clip-path", "none"); // the entrance is off, nothing is clipped
    await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
    await expect(page.locator(".scroll-progress")).toBeHidden();

    if (!isMobile) {
      const card = page.locator("#projects article").first();
      await card.scrollIntoViewIfNeeded();
      await card.hover(); // the stretched title link covers the card, so hover the card, not the image
      await expect(card.locator("img")).toHaveCSS("transform", "none");
    }

    await page.locator("#faq summary").first().click();
    await expect(page.locator("#faq summary svg").first()).toHaveCSS("transition-duration", /^(0s|1e-05s)$/);
  });

  test("the motion layer never starts", async ({ page }) => {
    const requested: string[] = [];
    page.on("request", (request) => requested.push(request.url()));
    await page.goto("/vi");
    // The reveal arms in the same commit as the motion layer's effect, so from here on the layer has had its chance.
    await expect(page.locator("html")).toHaveAttribute("data-reveal-ready", "");
    // Idle callbacks run in order: when this one fires, the idle slot in which the engine would have been imported has
    // passed (the layer waits for idle with a 2s timeout).
    await page.evaluate(() => new Promise<void>((resolve) => window.requestIdleCallback(() => setTimeout(resolve, 0), { timeout: 2500 })));
    await expect(page.locator("html")).not.toHaveAttribute("data-motion");
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
    expect(requested.filter((url) => /gsap|lenis|motion/i.test(url))).toEqual([]);
  });
});

test("if the application scripts fail to load, no content is hidden", async ({ page }) => {
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await page.goto("/en");
  await expect(page.locator("html")).not.toHaveAttribute("data-reveal-ready", /.*/);
  expect(await page.locator("[data-reveal]").evaluateAll(opacityNotOne)).toBe(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Software built through to launch day.");
});

test("when scripts run, the reveal arms itself: below-the-fold content waits, on-screen content never flashes", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("data-reveal-ready", "");
  const below = page.locator("#faq h2");
  await expect(below).toHaveCSS("opacity", "0");
  await below.scrollIntoViewIfNeeded();
  await expect(below).toHaveCSS("opacity", "1");

  // A section that is already on screen at load (deep link) must never be hidden by arming.
  await page.goto("/en#faq");
  await expect(page.locator("html")).toHaveAttribute("data-reveal-ready", "");
  await expect(page.locator("#faq h2")).toHaveCSS("opacity", "1");
});

test("scrolling the whole page reveals every section", async ({ page }) => {
  await page.goto("/en");
  await page.mouse.move(700, 450);
  // Scroll the way a visitor does and poll for the outcome. Only wheel input and a locator are used in the loop, so a
  // page that the dev server reloads mid-way (scroll back at 0) simply gets scrolled again instead of failing.
  await expect
    .poll(
      async () => {
        await page.mouse.wheel(0, 600);
        return page.locator("[data-reveal]:not(.is-visible)").count();
      },
      { timeout: 25_000, intervals: [250] },
    )
    .toBe(0);
});

test.describe("inertial scrolling", () => {
  test("is on for a fine pointer and announces itself", async ({ page, isMobile }) => {
    test.skip(isMobile, "touch devices keep native scrolling");
    await page.goto("/vi");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /smooth/);
    await expect(page.locator("html")).toHaveClass(/lenis/);
    await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  });

  test("is torn down when reduced motion is switched on, and comes back when it is switched off", async ({ page, isMobile }) => {
    test.skip(isMobile, "touch devices keep native scrolling");
    const html = page.locator("html");
    await page.goto("/en");
    await expect(html).toHaveAttribute("data-motion", /smooth/);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(html).not.toHaveAttribute("data-motion");
    await expect(html).not.toHaveClass(/lenis/);
    await page.mouse.move(700, 450);
    await page.mouse.wheel(0, 400); // plain native scrolling again
    await expect.poll(() => scrollY(page)).toBeGreaterThan(0);

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(html).toHaveAttribute("data-motion", /smooth/);
    expect(await page.evaluate(() => document.querySelectorAll(".lenis").length)).toBe(1);
  });

  test("touch devices keep native scrolling", async ({ page, isMobile }) => {
    test.skip(!isMobile, "touch project only");
    await page.goto("/vi");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /count/);
    await expect(page.locator("html")).not.toHaveAttribute("data-motion", /smooth/);
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
  });

  test("the page still reads and scrolls when the motion layer fails to load", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop project is enough");
    test.skip(Boolean(process.env.E2E_PROD), "production chunk names are hashed, so the engine chunk cannot be picked out");
    let aborted = 0;
    await page.route(/motion_engine|motion\/engine/, (route) => {
      aborted += 1;
      return route.abort();
    });
    await page.goto("/en");
    // The pattern is a guess at the dev chunk name: prove it matched before trusting what follows.
    await expect.poll(() => aborted).toBeGreaterThan(0);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Software built through to launch day.");
    await page.mouse.move(700, 450);
    await page.mouse.wheel(0, 800);
    await expect.poll(() => scrollY(page)).toBeGreaterThan(0);
    await expect(page.locator("html")).not.toHaveAttribute("data-motion");
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
  });

  test("keyboard scrolling keeps working", async ({ page, isMobile }) => {
    test.skip(isMobile, "no keyboard on the touch project");
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /smooth/);
    await page.keyboard.press("PageDown");
    await expect.poll(() => scrollY(page)).toBeGreaterThan(300);
    await page.keyboard.press("End");
    await expect
      .poll(() => page.evaluate(() => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1))
      .toBe(true);
    await page.keyboard.press("Home");
    await expect.poll(() => scrollY(page)).toBe(0);
    await page.keyboard.press("Space");
    await expect.poll(() => scrollY(page)).toBeGreaterThan(300);
  });

  test("Tab focus scrolls the focused link into view, below the fixed header", async ({ page, isMobile }) => {
    test.skip(isMobile, "no keyboard on the touch project");
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /smooth/);
    expect(await scrollY(page)).toBe(0);

    const onLinkBelowTheFold = async () =>
      (await scrollY(page)) > 0 && (await page.evaluate(() => document.activeElement?.tagName === "A"));
    // Every Tab lands on the next focusable element; the header links are on screen, the first link below the fold
    // makes the browser scroll it into view (the screenshot strip before it is a focusable region, not a link).
    for (let presses = 0; presses < 80 && !(await onLinkBelowTheFold()); presses++) await page.keyboard.press("Tab");
    await settledScrollY(page);

    expect(await scrollY(page)).toBeGreaterThan(0);
    const focus = await page.evaluate(() => {
      const el = document.activeElement!;
      const rect = el.getBoundingClientRect();
      return { tag: el.tagName, top: rect.top, bottom: rect.bottom, viewport: window.innerHeight };
    });
    expect(focus.tag).toBe("A");
    expect(focus.top).toBeGreaterThanOrEqual(64);
    expect(focus.bottom).toBeLessThanOrEqual(focus.viewport);
  });

  test("wheel input is smoothed and lands on the exact distance", async ({ page, isMobile }) => {
    test.skip(isMobile, "touch devices keep native scrolling");
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /smooth/);
    await page.mouse.move(700, 450);
    await page.mouse.wheel(0, 400);
    await expect.poll(async () => Math.abs((await scrollY(page)) - 400)).toBeLessThanOrEqual(1);
  });

  test("the scroll progress bar follows the smoothed scroll", async ({ page, isMobile }) => {
    test.skip(isMobile, "touch devices keep native scrolling");
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /smooth/);
    const bar = page.locator(".scroll-progress");
    const fill = () => bar.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);
    expect(await fill()).toBe(0);
    await page.keyboard.press("End");
    await expect.poll(fill).toBeGreaterThan(0.99);
  });

  test("a dialog freezes the page behind it and its own list still scrolls", async ({ page, isMobile }) => {
    test.skip(isMobile, "touch devices keep native scrolling");
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /smooth/);
    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: "instant" }));
    await expect.poll(() => scrollY(page)).toBe(1200);

    await page.keyboard.press("Control+K");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const list = dialog.getByRole("listbox");

    await page.mouse.move(60, 450); // the backdrop, well left of the palette
    await page.mouse.wheel(0, 600);
    await frames(page);
    expect(await scrollY(page)).toBe(1200);

    const box = (await list.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, 200);
    await expect.poll(() => list.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    await frames(page);
    expect(await scrollY(page)).toBe(1200);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await page.mouse.move(60, 450);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => scrollY(page)).toBeGreaterThan(1200);
  });

  test("the mobile menu freezes the page behind it too", async ({ page, isMobile }) => {
    test.skip(isMobile, "a fine pointer on a narrow window");
    await page.setViewportSize({ width: 800, height: 700 });
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /smooth/);
    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: "instant" }));
    await expect.poll(() => scrollY(page)).toBe(1200);

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.mouse.move(400, 600);
    await page.mouse.wheel(0, 600);
    await frames(page);
    expect(await scrollY(page)).toBe(1200);

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await page.mouse.wheel(0, 600);
    await expect.poll(() => scrollY(page)).toBeGreaterThan(1200);
  });

  test("going to a case study and back leaves no motion listeners behind", async ({ page, isMobile }) => {
    test.skip(isMobile, "touch devices keep native scrolling");
    const problems: string[] = [];
    page.on("pageerror", (error) => problems.push(error.message));
    page.on("console", (message) => {
      if (isAnalyticsScriptFailure(message)) return;
      if (message.type() === "error" || message.text().startsWith("The motion layer")) problems.push(message.text());
    });

    const html = page.locator("html");
    await page.goto("/vi");
    await expect(html).toHaveAttribute("data-motion", /smooth/);
    for (let round = 0; round < 3; round++) {
      // A DOM click keeps the page at the top, so there is no scroll position for Back to restore later.
      await page.locator('a[href="/vi/projects/hadi"]').first().evaluate((link: HTMLElement) => link.click());
      await expect(page).toHaveURL(/\/vi\/projects\/hadi$/);
      await expect(html).toHaveAttribute("data-motion", /smooth/);
      await back(page);
      await expect(page).toHaveURL(/\/vi$/);
      await expect(html).toHaveAttribute("data-motion", /smooth/);
    }
    expect(await page.locator(".lenis").count()).toBe(1);
    expect(await page.evaluate(() => document.querySelectorAll(".lenis").length)).toBe(1);

    // One live instance: a wheel step moves the page by its distance, with nothing else fighting it.
    expect(await settledScrollY(page)).toBe(0);
    await page.mouse.move(700, 450);
    await page.mouse.wheel(0, 300);
    await expect.poll(async () => Math.abs((await scrollY(page)) - 300)).toBeLessThanOrEqual(1);
    expect(problems).toEqual([]);
  });

  test("Back restores the reading position", async ({ page, isMobile }) => {
    test.skip(isMobile, "touch devices keep native scrolling");
    await page.goto("/vi");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /smooth/);
    await page.mouse.move(700, 450);
    await page.mouse.wheel(0, 1500);
    const left = await settledScrollY(page);
    expect(left).toBeGreaterThan(1000);

    // A DOM click: Playwright's own click would first scroll the link into view and change the position being restored.
    await page.locator('a[href="/vi/projects/hadi"]').first().evaluate((link: HTMLElement) => link.click());
    await expect(page).toHaveURL(/\/vi\/projects\/hadi$/);
    await back(page);
    await expect(page).toHaveURL(/\/vi$/);
    await expect.poll(async () => Math.abs((await settledScrollY(page)) - left)).toBeLessThanOrEqual(1);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("all sections are present, readable and not hidden by reveal styles", async ({ page }) => {
    await page.goto("/en");
    for (const id of ["projects", "services", "about", "process", "faq", "contact"]) {
      await expect(page.locator(`#${id} h2`)).toHaveCSS("opacity", "1");
    }
    await expect(page.locator("#faq details")).toHaveCount(7);
    await expect(page.locator("#contact a").first()).toBeVisible();
  });
});

test.describe("entrance motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the headline slides in word by word and still reads as one sentence", async ({ page }) => {
    await page.goto("/en");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveText("Software built through to launch day.");
    const words = h1.locator(".word");
    expect(await words.count()).toBe(6);
    await expect(words.first()).toHaveCSS("animation-name", "word-up");
    const delays = await words.evaluateAll((els) => els.map((el) => Number.parseFloat(getComputedStyle(el).animationDelay)));
    expect(delays).toEqual([...delays].sort((a, b) => a - b)); // each word starts after the previous one
    expect(new Set(delays).size).toBe(delays.length);
    await expect(words.last()).toHaveCSS("transform", /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/, { timeout: 5000 }); // everything ends in place
  });

  test("hero numbers rise one after another", async ({ page }) => {
    await page.goto("/en");
    const delays = await page
      .getByRole("group", { name: "Key figures" })
      .locator(".rise")
      .evaluateAll((els) => els.map((el) => Number.parseFloat(getComputedStyle(el).animationDelay)));
    expect(delays).toHaveLength(4);
    expect(new Set(delays).size).toBe(4);
  });

  test("a project's image is uncovered and its text follows in sequence when it scrolls into view", async ({ page, isMobile }) => {
    // Below 1024 px the projects stack and reveal; on a wide screen they are pinned instead (see "pinned projects").
    if (!isMobile) await page.setViewportSize({ width: 900, height: 900 });
    await page.goto("/en");
    const second = page.locator("#projects article").nth(1);
    await expect(second.locator(".reveal-media")).toHaveCSS("clip-path", /^inset\(0px 0px 100%/);
    await expect(second.locator(".reveal-item").first()).toHaveCSS("opacity", "0");

    await second.scrollIntoViewIfNeeded();
    await expect(second.locator(".reveal-media")).toHaveCSS("clip-path", "inset(0px)", { timeout: 5000 });
    for (const item of await second.locator(".reveal-item").all()) await expect(item).toHaveCSS("opacity", "1", { timeout: 5000 });

    const delays = await second
      .locator(".reveal-item")
      .evaluateAll((els) => els.map((el) => Number.parseFloat(getComputedStyle(el).transitionDelay)));
    expect(delays).toEqual([...delays].sort((a, b) => a - b));
    expect(new Set(delays).size).toBe(delays.length);
  });

  test("the command palette opens with a soft entrance", async ({ page }) => {
    await page.goto("/en");
    await page.keyboard.press("Control+K");
    await expect(page.locator(".palette[open]")).toHaveCSS("animation-name", "palette-in");
  });
});

const stripX = (page: Page) => page.locator("[data-motion-strip]").evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
// A cold dev compile can delay the engine chunk, so the takeover gets a generous wait.
const takenOver = (page: Page) => expect(page.locator("[data-motion-strip-viewport]")).toHaveAttribute("data-strip-ready", "", { timeout: 20_000 });
const coverWidths = (page: Page) => page.locator("[data-motion-strip] li").evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
// The strip's offset in each of the next `count` frames, read from inside the page so that no timer is involved.
const stripOverFrames = (page: Page, count: number) =>
  page.evaluate(
    (n) =>
      new Promise<number[]>((resolve) => {
        const list = document.querySelector("[data-motion-strip]");
        const xs: number[] = [];
        const step = () => {
          xs.push(list ? new DOMMatrix(getComputedStyle(list).transform).m41 : Number.NaN);
          if (xs.length >= n) resolve(xs);
          else requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }),
    count,
  );
const standsStill = async (page: Page) => {
  const xs = await stripOverFrames(page, 20);
  expect(new Set(xs).size, `offsets over 20 frames: ${xs.join(", ")}`).toBe(1);
};
const noOverflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

test.describe("hero motion", () => {
  test("hero figures count up and settle on the real values", async ({ page }) => {
    await page.goto("/vi");
    await expect(page.locator("#hero dd")).toHaveText(["3", "7", "3", "13"], { timeout: 4000 });
    for (const text of await page.locator("#hero dd").allTextContents()) expect(text).toMatch(/^\d+$/);
  });

  test("the figures start from zero, not from their final value", async ({ page }) => {
    // Every value each figure shows, from before any page script runs: sampling afterwards can only see where it ended.
    await page.addInitScript(() => {
      const shown: string[][] = [];
      (window as unknown as { shown: string[][] }).shown = shown;
      new MutationObserver(() => {
        document.querySelectorAll("#hero dd[data-count-to]").forEach((dd, i) => {
          const values = (shown[i] ??= []);
          // What a sighted visitor sees: the counting text, which is hidden from assistive technology.
          const text = dd.querySelector("[aria-hidden]")?.textContent ?? dd.textContent ?? "";
          if (values[values.length - 1] !== text) values.push(text);
        });
      }).observe(document, { childList: true, subtree: true, characterData: true });
    });
    await page.goto("/vi");
    // The engine writes the zeros before it marks the page, so the figures can only reach their values by counting.
    await expect(page.locator("html")).toHaveAttribute("data-motion", /count/, { timeout: 20_000 });
    await expect(page.locator("#hero dd")).toHaveText(["3", "7", "3", "13"], { timeout: 4000 });
    const targets = await page.locator("#hero dd[data-count-to]").evaluateAll((els) => els.map((el) => Number((el as HTMLElement).dataset.countTo)));
    const shown = await page.evaluate(() => (window as unknown as { shown: string[][] }).shown);

    expect(shown).toHaveLength(targets.length);
    shown.forEach((values, i) => {
      // The server markup shows the final value first; the zero comes right after it, then the count.
      const counted = values[0] === String(targets[i]) ? values.slice(1) : values;
      expect(counted[0], `figure ${i} started from`).toBe("0");
      expect(counted[counted.length - 1], `figure ${i} ended on`).toBe(String(targets[i]));
      for (const value of counted) {
        expect(value).toMatch(/^\d+$/);
        expect(Number(value)).toBeLessThanOrEqual(targets[i]);
      }
    });
  });

  test("assistive technology gets each real figure from the first frame, not the counting text", async ({ page }) => {
    await page.addInitScript(() => {
      const heard: Set<string>[] = [];
      (window as unknown as { heard: Set<string>[] }).heard = heard;
      new MutationObserver(() => {
        document.querySelectorAll("#hero dd[data-count-to]").forEach((dd, i) => {
          // The text that is left once everything hidden from assistive technology is taken out.
          const text = [...dd.childNodes]
            .filter((node) => !(node instanceof HTMLElement && node.getAttribute("aria-hidden") === "true"))
            .map((node) => node.textContent ?? "")
            .join("");
          (heard[i] ??= new Set()).add(text);
        });
      }).observe(document, { childList: true, subtree: true, characterData: true });
    });
    await page.goto("/vi");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /count/, { timeout: 20_000 });
    await expect(page.locator("#hero dd")).toHaveText(["3", "7", "3", "13"], { timeout: 4000 });
    const heard = await page.evaluate(() => (window as unknown as { heard: Set<string>[] }).heard.map((values) => [...values]));
    expect(heard).toEqual([["3"], ["7"], ["3"], ["13"]]);
  });

  test.describe("a fine pointer", () => {
    test.beforeEach(({ isMobile }) => {
      test.skip(isMobile, "the strip is taken over on fine pointers only");
    });

    test("the screenshot strip drifts on its own", async ({ page }) => {
      await page.goto("/vi");
      await takenOver(page);
      const x1 = await stripX(page);
      await page.waitForTimeout(600);
      expect(await stripX(page)).not.toBe(x1);
    });

    test("clones are hidden from assistive technology and the list keeps its five items", async ({ page }) => {
      await page.goto("/en");
      await takenOver(page);
      await expect(page.getByRole("list", { name: "Screenshots of the products I built" }).getByRole("listitem")).toHaveCount(5);
      const clone = page.locator("[data-motion-strip-clone]");
      await expect(clone).toHaveAttribute("aria-hidden", "true");
      expect(await clone.locator("img").evaluateAll((els) => els.map((el) => [el.getAttribute("alt"), el.getAttribute("loading")]))).toEqual(
        Array(5).fill(["", "lazy"]),
      );
      expect(await clone.locator("a, button, input, [tabindex]").count()).toBe(0);
      expect(await noOverflow(page)).toBe(true);
    });

    test("the strip pauses under the pointer and while focus is inside it", async ({ page }) => {
      await page.goto("/vi");
      const viewport = page.locator("[data-motion-strip-viewport]");
      await takenOver(page);
      await viewport.focus();
      const held = await stripX(page);
      await page.waitForTimeout(500);
      expect(await stripX(page)).toBe(held);
      await viewport.evaluate((el) => (el as HTMLElement).blur());
      await expect.poll(() => stripX(page).then((x) => x !== held)).toBe(true);

      await viewport.hover();
      const hovered = await stripX(page);
      await page.waitForTimeout(500);
      expect(await stripX(page)).toBe(hovered);
    });

    test("the strip waits while the hero is out of view", async ({ page }) => {
      await page.goto("/vi");
      await takenOver(page);
      await page.evaluate(() => window.scrollTo({ top: 3000, behavior: "instant" }));
      await page.waitForTimeout(400);
      const away = await stripX(page);
      await page.waitForTimeout(500);
      expect(await stripX(page)).toBe(away);
    });

    test("the strip waits while the document is hidden and moves again when it is shown", async ({ page }) => {
      await page.goto("/vi");
      await takenOver(page);
      await page.locator("[data-motion-strip-viewport]").scrollIntoViewIfNeeded();
      await page.evaluate(() => Object.defineProperty(document, "hidden", { get: () => true, configurable: true }));
      await page.waitForTimeout(300);
      const held = await stripX(page);
      await page.waitForTimeout(500);
      expect(await stripX(page)).toBe(held);
      await page.evaluate(() => Object.defineProperty(document, "hidden", { get: () => false, configurable: true }));
      await expect.poll(() => stripX(page).then((x) => x !== held)).toBe(true);
    });

    test.describe("the pause control", () => {
      const pause = (page: Page) => page.locator("[data-strip-pause]");

      test("appears with the takeover, is named from the dictionary and is a real pressed-state button", async ({ page }) => {
        await page.goto("/vi");
        await takenOver(page);
        const button = page.getByRole("button", { name: "Dừng dải ảnh" });
        await expect(button).toBeVisible();
        await expect(button).toHaveAttribute("aria-pressed", "false");
        expect(await button.evaluate((el) => [el.tagName, el.getAttribute("type")])).toEqual(["BUTTON", "button"]);
        await expect(page.getByRole("group", { name: "Ảnh chụp sản phẩm" })).toHaveCount(1);
        await page.goto("/en");
        await takenOver(page);
        await expect(page.getByRole("button", { name: "Pause the screenshots" })).toBeVisible();
        await expect(page.getByRole("group", { name: "Product screenshots" })).toHaveCount(1);
      });

      test("pressing it stops the strip; leaving the strip or its focus does not restart it; pressing again resumes", async ({ page }) => {
        await page.goto("/en");
        await takenOver(page);
        const viewport = page.locator("[data-motion-strip-viewport]");
        expect(new Set(await stripOverFrames(page, 20)).size).toBeGreaterThan(1); // it does move on its own

        await pause(page).click();
        await expect(pause(page)).toHaveAttribute("aria-pressed", "true");
        // One name for both states: only the pressed state changes (a changing name would read "Play, pressed").
        await expect(page.getByRole("button", { name: "Pause the screenshots", pressed: true })).toBeVisible();
        await standsStill(page);

        await viewport.hover();
        await page.mouse.move(2, 2); // out again: a hover-out would restart a strip that was only held by the pointer
        await standsStill(page);
        await viewport.focus();
        await viewport.evaluate((el) => (el as HTMLElement).blur());
        await standsStill(page);
        await page.evaluate(() => window.scrollTo({ top: 3000, behavior: "instant" })); // out of view, then back
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
        await standsStill(page);

        await pause(page).click();
        await expect(page.getByRole("button", { name: "Pause the screenshots", pressed: false })).toBeVisible();
        await expect.poll(async () => new Set(await stripOverFrames(page, 10)).size > 1).toBe(true);
      });

      test("works from the keyboard with the visible focus ring", async ({ page }) => {
        await page.goto("/en");
        await takenOver(page);
        await pause(page).focus();
        await expect(pause(page)).toHaveCSS("outline-style", "solid");
        await page.keyboard.press("Enter");
        await expect(pause(page)).toHaveAttribute("aria-pressed", "true");
        await standsStill(page);
        await page.keyboard.press("Space");
        await expect(pause(page)).toHaveAttribute("aria-pressed", "false");
        await expect.poll(async () => new Set(await stripOverFrames(page, 10)).size > 1).toBe(true);
      });

      test("showing it moves nothing", async ({ page, browser }) => {
        const reference = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
        const plain = await reference.newPage();
        const measure = (p: Page) =>
          p.evaluate(() => {
            const wrapper = document.querySelector("[data-strip-pause]")?.parentElement;
            const hero = document.querySelector("#hero");
            if (!wrapper) throw new Error("the pause button or its wrapper is missing");
            if (!hero) throw new Error("the hero section is missing");
            // The wrapper is not animated, so its box is the layout itself. The pin below the hero adds its own
            // spacer, so the page height is not comparable; the hero's is.
            const box = wrapper.getBoundingClientRect();
            return [box.top + window.scrollY, box.height, hero.getBoundingClientRect().height];
          });
        await plain.goto("/en");
        await plain.waitForLoadState("load");
        const expected = await measure(plain);
        await reference.close();

        await page.goto("/en");
        await takenOver(page);
        await expect(pause(page)).toBeVisible();
        await page.waitForLoadState("load");
        const [top, height, total] = await measure(page);
        expect(Math.abs(top - expected[0])).toBeLessThanOrEqual(1);
        expect(height).toBe(expected[1]);
        expect(Math.abs(total - expected[2])).toBeLessThanOrEqual(1);
      });

      test("axe is clean with the control showing, in both states", async ({ page }) => {
        await page.goto("/en");
        await takenOver(page);
        await expect(pause(page)).toBeVisible();
        // The entrance animations fade the text in; axe would measure the colour of a half-faded paragraph.
        await page.evaluate(() =>
          Promise.all(
            document
              .querySelector("#hero")!
              .getAnimations({ subtree: true })
              .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
              .map((animation) => animation.finished),
          ),
        );
        const scan = () => new AxeBuilder({ page }).include("#hero").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
        expect((await scan()).violations).toEqual([]);
        await pause(page).click();
        expect((await scan()).violations).toEqual([]);
      });

      test("switching to reduced motion rolls everything back: button hidden and reset, strip and figures as served", async ({ page }) => {
        await page.goto("/en");
        await takenOver(page);
        await pause(page).click();
        await page.emulateMedia({ reducedMotion: "reduce" });
        await expect(page.locator("html")).not.toHaveAttribute("data-motion", /.+/);
        await expect(pause(page)).toBeHidden();
        await expect(pause(page)).toHaveAttribute("aria-pressed", "false");
        await expect(pause(page)).toHaveAttribute("aria-label", "Pause the screenshots");
        await expect(page.locator("[data-motion-strip-viewport]")).not.toHaveAttribute("data-strip-ready");
        await expect(page.locator("[data-motion-strip-clone]")).toHaveCount(0);
        await expect(page.locator("#hero dd")).toHaveText(["3", "7", "3", "13"]);
        expect(await page.locator("#hero dd").evaluateAll((els) => els.map((el) => el.children.length))).toEqual([0, 0, 0, 0]);
      });
    });

    test("a row scrolled before the takeover starts from zero, without a gap", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await page.addInitScript(() => {
        const scrollRow = () => {
          const row = document.querySelector("[data-motion-strip-viewport]");
          if (row && !row.hasAttribute("data-strip-ready")) {
            row.scrollLeft = 300;
            requestAnimationFrame(scrollRow);
          }
        };
        document.addEventListener("DOMContentLoaded", scrollRow);
      });
      await page.goto("/vi");
      await takenOver(page);
      const row = page.locator("[data-motion-strip-viewport]");
      expect(await row.evaluate((el) => el.scrollLeft)).toBe(0);
      const geometry = await page.evaluate(() => {
        const wrap = document.querySelector("[data-motion-strip-viewport]")!.getBoundingClientRect();
        const first = document.querySelector("[data-motion-strip] li")!.getBoundingClientRect();
        const twin = document.querySelector("[data-motion-strip-clone] li")!.getBoundingClientRect();
        const last = document.querySelector("[data-motion-strip] li:last-child")!.getBoundingClientRect();
        const shift = new DOMMatrix(getComputedStyle(document.querySelector("[data-motion-strip]")!).transform).m41;
        return { fromEdge: first.left - wrap.left - shift, seam: twin.left - last.right };
      });
      expect(Math.abs(geometry.fromEdge)).toBeLessThan(1);
      expect(Math.abs(geometry.seam - 16)).toBeLessThan(1); // one gap between the last cover and the first clone
    });

    test("after the takeover a resize gives the covers the width they have without the script", async ({ page, browser }) => {
      await page.goto("/vi");
      await takenOver(page);
      for (const size of [{ width: 1280, height: 900 }, { width: 820, height: 900 }]) {
        const reference = await browser.newContext({ reducedMotion: "reduce", viewport: size });
        const plain = await reference.newPage();
        await plain.goto("/vi");
        const expected = await coverWidths(plain);
        await reference.close();

        await page.setViewportSize(size);
        await expect
          .poll(async () => (await coverWidths(page)).every((width, i) => Math.abs(width - expected[i]) <= 1), { timeout: 10_000 })
          .toBe(true);
        expect(await noOverflow(page)).toBe(true);
      }
    });

    test("leaving the page restores the server markup exactly", async ({ page }) => {
      await page.goto("/vi");
      const viewport = page.locator("[data-motion-strip-viewport]");
      await takenOver(page);
      await page.locator('a[href="/vi/projects/hadi"]').first().evaluate((link: HTMLElement) => link.click());
      await expect(page).toHaveURL(/\/vi\/projects\/hadi$/);
      await back(page);
      await expect(page).toHaveURL(/\/vi$/);
      await takenOver(page);
      await expect(page.locator("[data-motion-strip-clone]")).toHaveCount(1);
      await expect(page.locator("[data-motion-strip] li")).toHaveCount(5);
      await expect(viewport).toHaveAttribute("data-strip-ready", "");
    });

    test("a modified arrow key is left to the browser", async ({ page }) => {
      await page.goto("/vi");
      await takenOver(page);
      await page.locator("[data-motion-strip-viewport]").focus();
      await page.evaluate(() => {
        (window as unknown as { prevented: boolean[] }).prevented = [];
        window.addEventListener("keydown", (event) => {
          if (event.key === "ArrowLeft") (window as unknown as { prevented: boolean[] }).prevented.push(event.defaultPrevented);
        });
      });
      await page.keyboard.press("Alt+ArrowLeft");
      await page.keyboard.press("ArrowLeft");
      expect(await page.evaluate(() => (window as unknown as { prevented: boolean[] }).prevented)).toEqual([false, true]);
    });
  });

  test.describe("a coarse pointer", () => {
    test.beforeEach(({ isMobile }) => {
      test.skip(!isMobile, "the touch project only");
    });

    test("keeps the native swipe row: no takeover, no clones, every cover reachable", async ({ page }) => {
      await page.goto("/vi");
      await expect(page.locator("html")).toHaveAttribute("data-motion", /count/);
      await expect(page.locator("#hero dd")).toHaveText(["3", "7", "3", "13"], { timeout: 4000 });
      const row = page.locator("[data-motion-strip-viewport]");
      await expect(row).not.toHaveAttribute("data-strip-ready");
      await expect(page.locator("[data-motion-strip-clone]")).toHaveCount(0);
      await expect(page.locator("[data-motion-strip]")).toHaveCSS("transform", "none");
      expect(await row.evaluate((el) => getComputedStyle(el).overflowX)).toBe("auto");
      await row.evaluate((el) => el.scrollTo({ left: el.scrollWidth, behavior: "instant" }));
      expect(await row.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
      const last = page.locator("[data-motion-strip] li").last();
      expect(
        await last.evaluate((el) => {
          const box = el.getBoundingClientRect();
          const wrap = el.closest("[data-motion-strip-viewport]")!.getBoundingClientRect();
          return box.left >= wrap.left - 1 && box.right <= wrap.right + 1;
        }),
      ).toBe(true);
      await expect(page.locator("[data-motion-strip] li")).toHaveCount(5);
      await expect(page.locator("[data-strip-pause]")).toBeHidden();
      await expect(page.getByRole("button", { name: "Dừng dải ảnh" })).toHaveCount(0);
    });
  });

  test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("the strip is still and the figures are final from the first frame", async ({ page }) => {
      await page.goto("/vi");
      await expect(page.locator("#hero dd")).toHaveText(["3", "7", "3", "13"]);
      await expect(page.locator("[data-motion-strip-viewport]")).not.toHaveAttribute("data-strip-ready");
      await expect(page.locator("[data-motion-strip-clone]")).toHaveCount(0);
      await expect(page.locator("[data-motion-strip]")).toHaveCSS("transform", "none");
      await expect(page.locator("[data-strip-pause]")).toBeHidden();
      await expect(page.getByRole("button", { name: "Dừng dải ảnh" })).toHaveCount(0);
    });
  });
});

const readyCover = (page: Page) => page.locator("[data-motion-parallax][data-parallax-ready]");
const coverShift = (page: Page) =>
  page.locator("[data-motion-parallax] img").evaluate((img) => {
    const matrix = new DOMMatrix(getComputedStyle(img).transform === "none" ? "" : getComputedStyle(img).transform);
    return matrix.f;
  });
const jumpTo = async (page: Page, top: number) => {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
  await settledScrollY(page);
};
// The order in which the gallery figures turn visible.
const watchGallery = (page: Page) =>
  page.addInitScript(() => {
    const w = window as unknown as { shown: number[] };
    w.shown = [];
    new MutationObserver((records) => {
      for (const record of records) {
        const el = record.target as HTMLElement;
        if (!el.matches("#gallery figure") || !el.classList.contains("is-visible")) continue;
        const index = [...document.querySelectorAll("#gallery figure")].indexOf(el);
        if (!w.shown.includes(index)) w.shown.push(index);
      }
    }).observe(document, { attributes: true, attributeFilter: ["class"], subtree: true });
  });

test.describe("case-study motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the cover moves at its own rate, inside a box that never changes", async ({ page }) => {
    await page.goto("/vi/projects/rankdle");
    await expect(readyCover(page)).toHaveCount(1, { timeout: 20_000 });
    const figure = page.locator("[data-motion-parallax]");
    const sizeAt = () => figure.evaluate((el) => el.getBoundingClientRect().height);
    const height = await sizeAt();
    expect(await coverShift(page)).toBe(0);

    for (const top of [400, 900]) {
      await jumpTo(page, top);
      await expect.poll(() => coverShift(page)).not.toBe(0);
      expect(await sizeAt()).toBe(height);
      const covered = await page.evaluate(() => {
        const fig = document.querySelector("[data-motion-parallax]")!;
        const box = fig.getBoundingClientRect();
        const img = fig.querySelector("img")!.getBoundingClientRect();
        return { top: img.top - box.top - fig.clientTop, bottom: box.bottom - fig.clientTop - img.bottom, height: box.height };
      });
      // The picture may only grow past the clip: never short of it, and the shift stays within 8 % of the height.
      expect(covered.top).toBeLessThanOrEqual(0.5);
      expect(covered.bottom).toBeLessThanOrEqual(0.5);
      expect(Math.abs(await coverShift(page))).toBeLessThanOrEqual(covered.height * 0.08);
    }
  });

  for (const width of [1440, 390]) {
    test(`the grown cover keeps a margin past the clip at ${width} px wide, and is the served picture at the top`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/vi/projects/rankdle");
      await expect(readyCover(page)).toHaveCount(1, { timeout: 20_000 });
      const box = () =>
        page.evaluate(() => {
          const fig = document.querySelector("[data-motion-parallax]")!;
          const f = fig.getBoundingClientRect();
          const i = fig.querySelector("img")!.getBoundingClientRect();
          const top = f.top + fig.clientTop;
          const bottom = f.bottom - fig.clientTop;
          return { above: top - i.top, below: i.bottom - bottom, imgHeight: i.height, innerHeight: bottom - top, end: f.bottom + window.scrollY };
        });

      const served = await box();
      expect(Math.abs(served.above)).toBeLessThan(0.5);
      expect(Math.abs(served.below)).toBeLessThan(0.5);
      expect(Math.abs(served.imgHeight - served.innerHeight)).toBeLessThan(0.5);
      expect(await coverShift(page)).toBe(0);

      // Progress is the scroll position over the distance to the figure's bottom edge reaching the top of the page.
      for (const progress of [0.1, 0.3, 0.6, 0.9, 1]) {
        await jumpTo(page, Math.round(served.end * progress));
        const now = await box();
        expect(now.above, `top at ${progress}`).toBeGreaterThanOrEqual(0.5);
        expect(now.below, `bottom at ${progress}`).toBeGreaterThanOrEqual(0.5);
      }
    });
  }

  test("gallery pictures become visible in DOM order", async ({ page }) => {
    await watchGallery(page);
    await page.goto("/vi/projects/rankdle");
    const figures = page.locator("#gallery figure");
    await expect(figures).toHaveCount(2);
    for (let top = 0; top < 4000; top += 200) {
      await jumpTo(page, top);
      if ((await page.locator("#gallery figure.is-visible").count()) === 2) break;
    }
    for (const figure of await figures.all()) await expect(figure).toHaveCSS("opacity", "1", { timeout: 5000 });
    expect(await page.evaluate(() => (window as unknown as { shown: number[] }).shown)).toEqual([0, 1]);
  });

  test("the pointer pull follows a fine pointer by at most 12 px and lets go on leave", async ({ page, isMobile }) => {
    test.skip(isMobile, "coarse pointers never get the pull");
    await page.goto("/vi");
    const button = page.locator("#hero a[data-magnetic]").first();
    await expect(button).toHaveAttribute("data-magnetic-ready", "", { timeout: 20_000 });
    const shift = () => button.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform === "none" ? "" : getComputedStyle(el).transform).e);
    const box = await button.boundingBox();
    expect(box).not.toBeNull();
    await button.hover({ position: { x: box!.width / 2 + 20, y: box!.height / 2 } });
    await expect.poll(shift).toBeGreaterThanOrEqual(1);
    expect(await shift()).toBeLessThanOrEqual(12);
    // The hit area is unchanged: the button's layout box is where it was.
    expect(await button.evaluate((el: HTMLElement) => el.offsetWidth)).toBe(Math.round(box!.width));

    await page.mouse.move(5, 5);
    await expect.poll(shift).toBe(0);
  });

  // Proves the real GSAP stop and restart path: the pull works again after the takeover was switched off and on, and
  // stays in range and towards the pointer. It cannot detect a stale cached offset (the 12 px cap hides one); the unit
  // tests in src/motion/magnetic.test.ts do.
  test("the pull starts afresh after the takeover has been switched off and on", async ({ page, isMobile }) => {
    test.skip(isMobile, "coarse pointers never get the pull");
    await page.goto("/vi");
    const button = page.locator("#hero a[data-magnetic]").first();
    await expect(button).toHaveAttribute("data-magnetic-ready", "", { timeout: 20_000 });
    const shift = () => button.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform === "none" ? "" : getComputedStyle(el).transform).e);
    const box = (await button.boundingBox())!;
    await button.hover({ position: { x: box.width / 2 + 40, y: box.height / 2 } });
    await expect.poll(shift).toBeGreaterThanOrEqual(1);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(button).not.toHaveAttribute("data-magnetic-ready");
    await expect(button).toHaveCSS("transform", "none");

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(button).toHaveAttribute("data-magnetic-ready", "", { timeout: 20_000 });
    const again = (await button.boundingBox())!;
    await page.mouse.move(again.x + again.width / 2 - 40, again.y + again.height / 2);
    await page.mouse.move(again.x + again.width / 2 - 20, again.y + again.height / 2);
    await expect.poll(shift).toBeLessThanOrEqual(-1);
    expect(await shift()).toBeGreaterThanOrEqual(-12);
  });

  test("keyboard focus alone never moves a button", async ({ page, isMobile }) => {
    test.skip(isMobile, "coarse pointers never get the pull");
    await page.goto("/vi");
    const button = page.locator("#hero a[data-magnetic]").first();
    await expect(button).toHaveAttribute("data-magnetic-ready", "", { timeout: 20_000 });
    await button.focus();
    await frames(page, 20);
    await expect(button).toHaveCSS("transform", "none");
  });

  test("a coarse pointer gets no pull, but the cover still moves", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the touch project only");
    await page.goto("/vi");
    await expect(page.locator("html")).toHaveAttribute("data-motion", /count/, { timeout: 20_000 });
    await expect(page.locator("[data-magnetic-ready]")).toHaveCount(0);
    await expect(page.locator("#hero a[data-magnetic]").first()).toHaveCSS("transform", "none");
    await page.goto("/vi/projects/rankdle");
    await expect(readyCover(page)).toHaveCount(1, { timeout: 20_000 });
  });

  test("leaving the takeover restores the server markup exactly", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/vi/projects/rankdle");
    const figure = page.locator("[data-motion-parallax]");
    const server = await figure.evaluate((el) => el.outerHTML);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(readyCover(page)).toHaveCount(1, { timeout: 20_000 });
    await jumpTo(page, 400);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("[data-parallax-ready]")).toHaveCount(0);
    expect(await figure.evaluate((el) => el.outerHTML)).toBe(server);
  });

  test("project covers fade their border on hover, stacked or pinned", async ({ page, isMobile }) => {
    test.skip(isMobile, "no hover on touch");
    const covers = () =>
      page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("#projects article")].map((article) => {
          const media = article.querySelector<HTMLElement>(".reveal-media")!;
          const panel = media.matches(".border") ? media : media.querySelector<HTMLElement>(".border")!;
          const style = getComputedStyle(panel);
          const at = style.transitionProperty.split(", ").indexOf("border-color");
          const durations = style.transitionDuration.split(", "); // a shorter list repeats
          return { duration: at < 0 ? "none" : durations[at % durations.length], color: style.borderTopColor };
        }),
      );
    for (const width of [900, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/en");
      if (width === 1440) await expect(page.locator("[data-motion-pin]")).toHaveAttribute("data-pin-ready", "", { timeout: 20_000 });
      const rest = await covers();
      expect(rest.map((cover) => cover.duration)).toEqual(rest.map(() => "0.2s"));
      // Stacked: every cover. Pinned: only the one on show takes the pointer.
      const hovered = width === 1440 ? [0] : rest.map((_, i) => i);
      for (const index of hovered) {
        const article = page.locator("#projects article").nth(index);
        await article.scrollIntoViewIfNeeded();
        await article.hover();
        await expect.poll(async () => (await covers())[index].color).not.toBe(rest[index].color);
        await page.mouse.move(0, 0);
      }
    }
  });

  test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("a hovered cover changes colour without a transition", async ({ page, isMobile }) => {
      test.skip(isMobile, "no hover on touch");
      await page.goto("/en");
      const cover = page.locator("#projects article").first().locator(".reveal-media");
      const before = await cover.evaluate((el) => getComputedStyle(el).borderTopColor);
      await page.locator("#projects article").first().hover();
      await expect.poll(() => cover.evaluate((el) => getComputedStyle(el).borderTopColor)).not.toBe(before);
      await expect(cover).toHaveCSS("transition-duration", /^(0s|1e-05s)$/);
    });

    test("no cover shift, no pull, and every picture is visible", async ({ page, isMobile }) => {
      await page.goto("/vi/projects/rankdle");
      await expect(page.locator("#gallery figure")).toHaveCount(2);
      for (const figure of await page.locator("#gallery figure").all()) await expect(figure).toHaveCSS("opacity", "1");
      await jumpTo(page, 400);
      await frames(page, 10);
      await expect(page.locator("[data-motion-parallax] img")).toHaveCSS("transform", "none");
      await expect(page.locator("[data-parallax-ready]")).toHaveCount(0);

      await page.goto("/vi");
      const button = page.locator("#hero a[data-magnetic]").first();
      if (!isMobile) {
        const box = await button.boundingBox();
        await button.hover({ position: { x: box!.width / 2 + 20, y: box!.height / 2 } });
        await frames(page, 20);
      }
      await expect(button).toHaveCSS("transform", "none");
      await expect(page.locator("[data-magnetic-ready]")).toHaveCount(0);
    });
  });
});
