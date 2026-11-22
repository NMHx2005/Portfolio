import { expect, test } from "@playwright/test";

test("work section lists the five case studies, newest first, with covers that load", async ({ page }) => {
  await page.goto("/vi");
  const work = page.locator("#projects");
  await expect(work.getByRole("heading", { level: 2 })).toHaveText("Sản phẩm tôi đã làm");
  await expect(page.locator("#projects article[data-pin-item] h3")).toHaveText(["TingTingVác", "Rankdle", "mythiep", "Hadi", "TinVid"]);
  await expect(page.locator("[data-motion-pin] > article[data-pin-item]")).toHaveCount(5);

  for (const img of await work.locator("article img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});

test("each project title links to its localized case study", async ({ page }) => {
  await page.goto("/vi");
  await expect(page.locator("#projects article h3 a")).toHaveCount(5);
  for (const [i, slug] of ["tingtingvac", "rankdle", "mythiep", "hadi", "tinvid"].entries()) {
    await expect(page.locator("#projects article h3 a").nth(i)).toHaveAttribute("href", `/vi/projects/${slug}`);
  }
});

test("each project shows client, period, platform and its honest status", async ({ page }) => {
  await page.goto("/vi");
  const first = page.locator('article[data-slug="tingtingvac"]');
  await expect(first).toContainText("Công ty TNHH Liên Phong Group");
  await expect(first).toContainText("10/2026 – nay");
  await expect(first).toContainText("Sắp phát hành");
  await expect(page.locator('article[data-slug="tinvid"]')).toContainText("06/2026 – 08/2026");
  await expect(page.locator('article[data-slug="tinvid"]')).toContainText("Bán mã nguồn");
});

test("a live link renders only for products that have one", async ({ page }) => {
  await page.goto("/vi");
  await expect(page.locator('article[data-slug="tingtingvac"]')).toContainText("Sắp phát hành");
  await expect(page.locator('article[data-slug="tingtingvac"]').getByRole("link", { name: /Xem sản phẩm/ })).toHaveCount(0);
  await expect(page.locator('article[data-slug="rankdle"]').getByRole("link", { name: /Xem sản phẩm/ })).toHaveAttribute(
    "href",
    "https://doanrankmlbbft.com",
  );
  const external = page.locator("#projects article a[target=_blank]");
  const hrefs = await external.evaluateAll((els) => els.map((a) => a.getAttribute("href")));
  expect(hrefs).toEqual(["https://doanrankmlbbft.com", "https://mythiep.com", "https://hadilanguage.com", "https://tinvid.com"]);
  for (const link of await external.all()) await expect(link).toHaveAttribute("rel", /noopener/);
});

test("the in-development group has two rows and no case-study pages", async ({ page }) => {
  await page.goto("/vi");
  await expect(page.locator("#projects #building")).toHaveCount(1);
  await expect(page.locator("#building li")).toHaveCount(2);
  await expect(page.locator("#building")).toContainText("Đang phát triển");
  await expect(page.locator("#building")).toContainText("Bản thử nghiệm");
  await expect(page.locator("#building a")).toHaveCount(0);
});

test("every link in the section has a real href", async ({ page }) => {
  await page.goto("/en");
  const hrefs = await page.locator("#projects a").evaluateAll((els) => els.map((a) => a.getAttribute("href")));
  for (const href of hrefs) expect(href && href !== "#").toBeTruthy();
});

test("under reduced motion the hover effect does not move the image", async ({ page, isMobile }) => {
  test.skip(isMobile, "hover is a pointer interaction");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  const card = page.locator("#projects article").first();
  const image = card.locator("img");
  await card.scrollIntoViewIfNeeded();
  await card.hover();
  await expect(image).toHaveCSS("transform", "none");
});

test("external links stay clickable above the whole-card link, even while the card is still settling", async ({ page, isMobile }) => {
  await page.goto("/en");
  // On a wide screen the projects are pinned and only the one on show takes clicks, so each link is reached the way a
  // keyboard user reaches it: focusing it brings its project forward, and the hit test waits for that project to be on show.
  if (!isMobile) await expect(page.locator("[data-motion-pin]")).toHaveAttribute("data-pin-ready", "", { timeout: 20_000 });
  for (const link of await page.locator("#projects a[target=_blank]").all()) {
    if (isMobile) await link.scrollIntoViewIfNeeded();
    else {
      await link.focus();
      await expect(link.locator("xpath=ancestor::article")).toHaveAttribute("data-pin-active", "");
    }
    const hit = await link.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return top?.closest("a")?.getAttribute("href") === el.getAttribute("href");
    });
    expect(hit, String(await link.getAttribute("href"))).toBe(true);
  }
});

test("only the for-sale product offers a link to the contact section about its source code", async ({ page }) => {
  for (const [locale, name] of [["vi", "Hỏi mua mã nguồn"], ["en", "Ask about the source code"]] as const) {
    await page.goto(`/${locale}`);
    const link = page.locator("#projects").getByRole("link", { name });
    await expect(link).toHaveCount(1);
    await expect(page.locator('article[data-slug="tinvid"]').getByRole("link", { name })).toHaveAttribute("href", `/${locale}#contact`);
  }
});
