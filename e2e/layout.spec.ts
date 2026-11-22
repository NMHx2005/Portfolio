import { expect, test, type Page } from "@playwright/test";

const paths = ["/vi", "/en", "/vi/projects/hadi", "/en/projects/mythiep"];

for (const width of [320, 390, 768, 1024, 1440]) {
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

// The section's top edge once the page has stopped moving: neither Lenis nor a native smooth scroll is still travelling.
async function settledTop(page: Page, id: string) {
  const top = () => page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top));
  const frames = () =>
    page.evaluate(async () => {
      for (let i = 0; i < 6; i++) await new Promise((resolve) => requestAnimationFrame(resolve));
    });
  await expect
    .poll(async () => {
      const before = await top();
      await frames();
      return before === (await top()) && before >= 0 && before <= 96;
    })
    .toBe(true);
  return top();
}

test("with inertial scrolling on, anchors still land below the fixed header and the navigation follows", async ({ page, isMobile }) => {
  test.skip(isMobile, "inline nav and inertial scrolling are desktop only");
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("data-motion", /smooth/);
  const nav = page.getByRole("navigation", { name: "Main navigation" });

  for (const [name, id] of [["Services", "services"], ["FAQ", "faq"], ["Work", "projects"]] as const) {
    await nav.getByRole("link", { name }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    expect(await settledTop(page, id)).toBeGreaterThanOrEqual(64);
    await expect(nav.getByRole("link", { name })).toHaveAttribute("aria-current", "location");
  }
});

test("with inertial scrolling on, the palette's section jumps and the language switcher's hash both still work", async ({ page, isMobile }) => {
  test.skip(isMobile, "inertial scrolling is desktop only");
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("data-motion", /smooth/);
  await page.keyboard.press("Control+K");
  await page.getByRole("dialog").getByRole("combobox").fill("faq");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#faq$/);
  expect(await settledTop(page, "faq")).toBeGreaterThanOrEqual(0);
  await expect(page.locator("#faq h2")).toBeInViewport();

  await page.getByRole("link", { name: "Tiếng Việt" }).click();
  await expect(page).toHaveURL(/\/vi#faq$/);
  await expect(page.locator("html")).toHaveAttribute("data-motion", /smooth/);
  await settledTop(page, "faq");
  await expect(page.locator("#faq h2")).toBeInViewport();
});

test("a deep link that is still scrolling when inertial scrolling starts ends on its section", async ({ page, isMobile }) => {
  test.skip(isMobile, "inertial scrolling is desktop only");
  await page.goto("/en#faq");
  await expect(page.locator("html")).toHaveAttribute("data-motion", /smooth/);
  // The browser's own scroll to the fragment lands 60 or 80px under the top depending on timing, with or without
  // Lenis, so only "in view, below the viewport top and at rest" is asserted here.
  await settledTop(page, "faq");
  await expect(page.locator("#faq h2")).toBeInViewport();
});

test("with inertial scrolling on, the skip link still jumps to the main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "inertial scrolling is desktop only");
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("data-motion", /smooth/);
  await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" }));
  await page.getByRole("link", { name: "Skip to main content" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  expect(await settledTop(page, "main")).toBeGreaterThanOrEqual(0);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
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
