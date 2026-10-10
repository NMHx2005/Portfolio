import { expect, test } from "@playwright/test";

const opacityNotOne = (els: Element[]) => els.filter((el) => getComputedStyle(el).opacity !== "1").length;

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("nothing hides, animates, transitions or smooth-scrolls", async ({ page, isMobile }) => {
    await page.goto("/en");
    expect(await page.locator("[data-reveal]").evaluateAll(opacityNotOne)).toBe(0);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("animation-name", "none");
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
