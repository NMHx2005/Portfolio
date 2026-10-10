import { expect, test } from "@playwright/test";

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
});

test("if the application scripts fail to load, no content is hidden", async ({ page }) => {
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await page.goto("/en");
  await expect(page.locator("html")).not.toHaveAttribute("data-reveal-ready", /.*/);
  expect(await page.locator("[data-reveal]").evaluateAll(opacityNotOne)).toBe(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Product engineer");
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
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
  await expect(page.locator("[data-reveal]:not(.is-visible)")).toHaveCount(0);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("all sections are present, readable and not hidden by reveal styles", async ({ page }) => {
    await page.goto("/en");
    for (const id of ["projects", "services", "about", "process", "faq", "contact"]) {
      await expect(page.locator(`#${id} h2`)).toHaveCSS("opacity", "1");
    }
    await expect(page.locator("#faq details")).toHaveCount(8);
    await expect(page.locator("#contact a").first()).toBeVisible();
  });
});

test.describe("entrance motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the headline slides in word by word and still reads as one sentence", async ({ page }) => {
    await page.goto("/en");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveText("Product engineer building web and mobile products.");
    const words = h1.locator(".word");
    expect(await words.count()).toBe(7);
    await expect(words.first()).toHaveCSS("animation-name", "word-up");
    const delays = await words.evaluateAll((els) => els.map((el) => Number.parseFloat(getComputedStyle(el).animationDelay)));
    expect(delays).toEqual([...delays].sort((a, b) => a - b)); // each word starts after the previous one
    expect(new Set(delays).size).toBe(delays.length);
    await expect(words.last()).toHaveCSS("transform", /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/, { timeout: 5000 }); // everything ends in place
  });

  test("hero numbers rise one after another", async ({ page }) => {
    await page.goto("/en");
    const delays = await page
      .getByRole("group", { name: "Key numbers" })
      .locator(".rise")
      .evaluateAll((els) => els.map((el) => Number.parseFloat(getComputedStyle(el).animationDelay)));
    expect(delays).toHaveLength(4);
    expect(new Set(delays).size).toBe(4);
  });

  test("a project's image is uncovered and its text follows in sequence when it scrolls into view", async ({ page }) => {
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
