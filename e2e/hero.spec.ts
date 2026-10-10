import { expect, test } from "@playwright/test";

test.describe("hero", () => {
  test("h1 states the positioning, is painted (not transparent) and wraps sensibly", async ({ page }) => {
    await page.goto("/en");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText("Product engineer");
    await expect(h1).toHaveCSS("color", /^(?!rgba\(0, 0, 0, 0\)).+/);
    await expect(h1).toHaveCSS("opacity", "1");
  });

  test("h1 never needs more than 4 lines at 320 px, in either language", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    for (const path of ["/en", "/vi"]) {
      await page.goto(path);
      const lines = await page.getByRole("heading", { level: 1 }).evaluate((el) => {
        const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight);
        return Math.round(el.getBoundingClientRect().height / lineHeight);
      });
      expect(lines, path).toBeLessThanOrEqual(4);
    }
  });

  test("shows the availability line, four key numbers, two CTAs and the stack tokens", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByText("Open to freelance · Hanoi, UTC+7")).toBeVisible();
    const stats = page.getByRole("group", { name: "Key numbers" });
    await expect(stats.locator("dt")).toHaveCount(4);
    await expect(stats.locator("dd")).toHaveText(["3", "4,200+", "1,600+", "99"]);
    await expect(page.getByText(/^Now$|Currently studying|Information Technology, Hanoi Open University/)).toHaveCount(0);
    await expect(page.getByRole("link", { name: "View work" })).toHaveAttribute("href", "/en#projects");
    await expect(page.getByRole("link", { name: "Get in touch" })).toHaveAttribute("href", "/en#contact");
    expect(await page.getByRole("list", { name: "Technology" }).locator("li").count()).toBeGreaterThanOrEqual(5);
  });

  test("Vietnamese copy renders with diacritics intact and numbers use a dot as thousands separator", async ({ page }) => {
    await page.goto("/vi");
    await expect(page.getByRole("group", { name: "Con số chính" }).locator("dd")).toHaveText(["3", "4.200+", "1.600+", "99"]);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("xây sản phẩm web và mobile");
  });
});

test.describe("hero without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("headline is still rendered and ends fully opaque", async ({ page }) => {
    await page.goto("/en");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText("Product engineer");
    await expect(h1).toHaveCSS("opacity", "1");
  });
});
