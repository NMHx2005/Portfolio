import { expect, test } from "@playwright/test";
import { getDictionary } from "../src/content/dictionary";

test("work section lists both projects with cover images that load", async ({ page }) => {
  await page.goto("/en");
  const work = page.locator("#projects");
  await expect(work.getByRole("heading", { level: 2 })).toHaveText("Shipped products");
  await expect(work.getByRole("heading", { level: 3 })).toHaveText(["HNWedding", "Hadi"]);

  for (const img of await work.locator("img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});

test("each project title links to its localized case study", async ({ page }) => {
  await page.goto("/vi");
  await expect(page.locator("#projects h3 a").nth(0)).toHaveAttribute("href", "/vi/projects/hnwedding");
  await expect(page.locator("#projects h3 a").nth(1)).toHaveAttribute("href", "/vi/projects/hadi");
});

test("optional parts render only when configured: no empty hrefs, no empty Role row", async ({ page }) => {
  await page.goto("/en");
  const hrefs = await page.locator("#projects a").evaluateAll((els) => els.map((a) => a.getAttribute("href")));
  for (const href of hrefs) expect(href && href !== "#").toBeTruthy();

  const hnwedding = getDictionary("en").work.items.hnwedding;
  await expect(page.locator("#projects article").first().locator("dt", { hasText: /^Role$/ })).toHaveCount(
    hnwedding.role ? 1 : 0,
  );
});

test("under reduced motion the hover effect does not move the image", async ({ page, isMobile }) => {
  test.skip(isMobile, "hover is a pointer interaction");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  const card = page.locator("#projects article").first();
  const image = card.locator("img");
  await card.scrollIntoViewIfNeeded();
  // The stretched title link covers the whole card, so hover the card itself, not the image.
  await card.hover();
  await expect(image).toHaveCSS("transform", "none");
});
