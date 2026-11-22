import { expect, test } from "@playwright/test";

const linesOf = (page: import("@playwright/test").Page) =>
  page.getByRole("heading", { level: 1 }).evaluate((el) => {
    const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight);
    return Math.round(el.getBoundingClientRect().height / lineHeight);
  });

test.describe("hero", () => {
  test("h1 states the positioning and is painted (not transparent)", async ({ page }) => {
    await page.goto("/vi");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveText("Làm phần mềm tới ngày chạy thật.");
    await expect(h1).toHaveCSS("color", /^(?!rgba\(0, 0, 0, 0\)).+/);
    await expect(h1).toHaveCSS("opacity", "1");
  });

  test("h1 fits two lines at 1440 px and four at 320 px, in both languages", async ({ page }) => {
    for (const [width, max] of [[1440, 2], [320, 4]] as const) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/en", "/vi"]) {
        await page.goto(path);
        expect(await linesOf(page), `${path} at ${width}px`).toBeLessThanOrEqual(max);
      }
    }
  });

  test("shows the four figures, both actions and the strip of five covers", async ({ page }) => {
    await page.goto("/vi");
    await expect(page.locator("#hero dd")).toHaveText(["3", "7", "3", "13"]);
    await expect(page.locator("#hero dd[data-count-to]")).toHaveCount(4);
    await expect(page.locator("#hero").getByRole("link", { name: "Gửi yêu cầu" })).toHaveAttribute("href", "/vi#contact");
    await expect(page.locator("#hero").getByRole("link", { name: "Xem dự án" })).toHaveAttribute("href", "/vi#projects");
    await expect(page.locator("[data-motion-strip] img")).toHaveCount(5);
    await expect(page.locator("[data-motion-strip] li")).toHaveCount(5);
    await expect(page.getByRole("list", { name: "Ảnh chụp các sản phẩm tôi đã làm" })).toHaveCount(1);
    for (const alt of await page.locator("[data-motion-strip] img").evaluateAll((els) => els.map((e) => e.getAttribute("alt")))) {
      expect(alt?.trim().length ?? 0).toBeGreaterThan(10);
    }
  });

  test("the primary button is marked for the pointer pull", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("#hero").getByRole("link", { name: "Send a request" })).toHaveAttribute("data-magnetic", "");
  });

  test("English copy renders and the strip never widens the page", async ({ page }) => {
    await page.goto("/en");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Software built through to launch day.");
    await expect(page.locator("#hero dd")).toHaveText(["3", "7", "3", "13"]);
  });
});

test.describe("the strip wrapper with native scrolling", () => {
  test.use({ reducedMotion: "reduce" });

  test("is focusable and scrolls with the keyboard", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/vi");
    const viewport = page.locator("[data-motion-strip-viewport]");
    await viewport.focus();
    await expect(viewport).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => viewport.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  });
});

test("when the motion layer takes the strip over, the arrow keys still bring every cover into view", async ({ page, isMobile }) => {
  test.skip(isMobile, "touch devices keep the native swipe row");
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/vi");
  const viewport = page.locator("[data-motion-strip-viewport]");
  await expect(viewport).toHaveAttribute("data-strip-ready", "", { timeout: 20_000 });
  await viewport.focus();
  await expect(viewport).toBeFocused();
  const x = () => page.locator("[data-motion-strip]").evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
  const before = await x();
  expect(await viewport.evaluate((el) => el.scrollLeft)).toBe(0);
  await page.keyboard.press("ArrowRight");
  await expect.poll(async () => (await x()) - before).toBeLessThan(-150);
  await page.keyboard.press("ArrowLeft");
  await expect.poll(async () => Math.abs((await x()) - before)).toBeLessThan(2);

  // Each press settles one cover further along, so after five presses every cover has been fully on show once. The loop
  // wraps, so a cover's aria-hidden twin may be the one on show.
  const shown = new Set<number>();
  for (let press = 0; press <= 5; press++) {
    await expect.poll(async () => (await x()) === (await page.waitForTimeout(150).then(x))).toBe(true); // the glide has ended
    const inside = await page.locator("[data-motion-strip] li, [data-motion-strip-clone] li").evaluateAll((els) =>
      els.flatMap((el, index) => {
        const box = el.getBoundingClientRect();
        const wrap = el.closest("[data-motion-strip-viewport]")!.getBoundingClientRect();
        return box.left >= wrap.left - 1 && box.right <= wrap.right + 1 ? [index % 5] : [];
      }),
    );
    for (const index of inside) shown.add(index);
    await page.keyboard.press("ArrowRight");
  }
  expect([...shown].sort()).toEqual([0, 1, 2, 3, 4]);
});

test.describe("hero without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const width of [390, 1440]) {
    test(`every strip cover is reachable inside its wrapper at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/vi");
      const items = page.locator("[data-motion-strip] li");
      await expect(items).toHaveCount(5);
      // scrollIntoViewIfNeeded also scrolls an overflow:hidden box, so only the computed value proves the row is not clipped.
      await expect(page.locator("[data-motion-strip-viewport]")).toHaveCSS("overflow-x", "auto");
      for (let i = 0; i < 5; i++) {
        await items.nth(i).scrollIntoViewIfNeeded();
        const inside = await items.nth(i).evaluate((el) => {
          const box = el.getBoundingClientRect();
          const wrap = el.closest("[data-motion-strip-viewport]")?.getBoundingClientRect();
          return wrap !== undefined && box.left >= wrap.left - 1 && box.right <= wrap.right + 1;
        });
        expect(inside, `cover ${i}`).toBe(true);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  }

  test("the pause control is neither shown nor reachable: the strip does not move on its own", async ({ page }) => {
    await page.goto("/vi");
    await expect(page.locator("[data-strip-pause]")).toBeHidden();
    await expect(page.locator("[data-strip-pause]")).toHaveCSS("display", "none");
    await expect(page.getByRole("button", { name: "Dừng dải ảnh" })).toHaveCount(0);
  });

  test("headline, figures and the strip are still rendered", async ({ page }) => {
    await page.goto("/vi");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveText("Làm phần mềm tới ngày chạy thật.");
    await expect(h1).toHaveCSS("opacity", "1");
    await expect(page.locator("#hero dd")).toHaveText(["3", "7", "3", "13"]);
    await expect(page.locator("[data-motion-strip] img")).toHaveCount(5);
  });
});
