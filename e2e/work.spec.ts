import { expect, test } from "@playwright/test";
import { getDictionary } from "../src/content/dictionary";

test("work section lists all three projects with cover images that load", async ({ page }) => {
  await page.goto("/en");
  const work = page.locator("#projects");
  await expect(work.getByRole("heading", { level: 2 })).toHaveText("Shipped products");
  await expect(work.getByRole("heading", { level: 3 })).toHaveText(["mythiep", "Hadi", "crossweave"]);

  for (const img of await work.locator("img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});

test("each project title links to its localized case study", async ({ page }) => {
  await page.goto("/vi");
  await expect(page.locator("#projects h3 a")).toHaveCount(3);
  for (const [i, slug] of ["mythiep", "hadi", "crossweave"].entries()) {
    await expect(page.locator("#projects h3 a").nth(i)).toHaveAttribute("href", `/vi/projects/${slug}`);
  }
});

test("optional parts render only when configured: no empty hrefs, no empty Role row", async ({ page }) => {
  await page.goto("/en");
  const hrefs = await page.locator("#projects a").evaluateAll((els) => els.map((a) => a.getAttribute("href")));
  for (const href of hrefs) expect(href && href !== "#").toBeTruthy();

  const mythiep = getDictionary("en").work.items.mythiep;
  await expect(page.locator("#projects article").first().locator("dt", { hasText: /^Role$/ })).toHaveCount(
    mythiep.role ? 1 : 0,
  );
});

test("each project links to where it can be seen: live site or source code, opened safely", async ({ page }) => {
  await page.goto("/en");
  const external = page.locator("#projects a[target=_blank]");
  await expect(external).toHaveText([/Visit product/, /Visit product/, /Source code/]);
  await expect(external).toHaveCount(3);
  for (const link of await external.all()) {
    await expect(link).toHaveAttribute("rel", /noopener/);
    expect(await link.getAttribute("href")).toMatch(/^https:\/\//);
  }
  const hrefs = await external.evaluateAll((els) => els.map((a) => a.getAttribute("href")));
  expect(hrefs).toEqual(["https://mythiep.com", "https://hadilanguage.com", "https://github.com/NMHx2005/crossweave"]);
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

test("external links stay clickable above the whole-card link, even while the card is still settling", async ({ page }) => {
  await page.goto("/en");
  for (const link of await page.locator("#projects a[target=_blank]").all()) {
    await link.scrollIntoViewIfNeeded(); // immediately: the entrance transition has barely started
    const hit = await link.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return top?.closest("a")?.getAttribute("href") === el.getAttribute("href");
    });
    expect(hit, String(await link.getAttribute("href"))).toBe(true);
  }
});
