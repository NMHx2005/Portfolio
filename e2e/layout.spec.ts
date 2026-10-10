import { expect, test } from "@playwright/test";

const paths = ["/vi", "/en", "/vi/projects/hadi", "/en/projects/hnwedding"];

for (const width of [320, 390, 768, 1440]) {
  for (const path of paths) {
    test(`no horizontal overflow at ${width}px: ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}

for (const path of paths) {
  test(`every anchor has a real href and every image loads: ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    const hrefs = await page.locator("a").evaluateAll((els) => els.map((a) => a.getAttribute("href")));
    for (const href of hrefs) expect(href && href !== "#", `bad href: ${String(href)}`).toBeTruthy();

    for (const img of await page.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
  });
}

test("section anchors land below the fixed header", async ({ page, isMobile }) => {
  test.skip(isMobile, "inline nav is desktop only");
  await page.goto("/en");
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Services" }).click();
  await expect(page).toHaveURL(/#services$/);
  await expect.poll(async () => (await page.locator("#services").boundingBox())?.y ?? -1).toBeGreaterThanOrEqual(64);
});

test("old shared links still work: /#projects (through the locale redirect) and /en#stack", async ({ page }) => {
  await page.goto("/#projects");
  // The fragment survives the locale redirect; the locale itself follows Chromium's Accept-Language (en-US).
  await expect(page).toHaveURL(/\/(vi|en)#projects$/);
  await expect(page.locator("#projects")).toBeInViewport();

  // Leave the document first: a URL that differs only by fragment is a same-document navigation, which the
  // browser would scroll *smoothly* (and slowly under load) instead of performing a real page load.
  await page.goto("about:blank");
  await page.goto("/en#stack");
  await expect(page.getByRole("heading", { level: 3, name: "Technology" })).toBeInViewport();
});

test("exactly one h1 per page", async ({ page }) => {
  for (const path of paths) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
  }
});
