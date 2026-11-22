import { expect, test } from "@playwright/test";
import { getDictionary } from "../src/content/dictionary";
import { projectSlugs, projectsData } from "../src/content/projects";

const en = getDictionary("en");

test("navigating from the home work block opens the case study", async ({ page, isMobile }) => {
  await page.goto("/en");
  const card = page.locator("#projects article").nth(1);
  if (!isMobile) {
    // On a wide screen the projects are pinned and only the one on show takes clicks: bring the second one forward the
    // way a keyboard user does, by focusing its title.
    await expect(page.locator("[data-motion-pin]")).toHaveAttribute("data-pin-ready", "", { timeout: 20_000 });
    await card.locator("h3 a").focus();
    await expect(card).toHaveAttribute("data-pin-active", "");
  }
  // The stretched title link covers the whole card; clicking the card navigates.
  await card.click();
  await expect(page).toHaveURL(/\/en\/projects\/rankdle$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Rankdle");
});

test("the facts row shows client, period, platform and status", async ({ page }) => {
  await page.goto("/vi/projects/tingtingvac");
  const facts = page.locator("article dl").first();
  await expect(facts).toContainText("Công ty TNHH Liên Phong Group");
  await expect(facts).toContainText("10/2026 – nay");
  await expect(facts).toContainText("Sắp phát hành");
  await expect(page.getByText(getDictionary("vi").work.items.tingtingvac.platform)).toHaveCount(1);
  for (const id of ["delivered", "gallery"]) await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator("#delivered li")).not.toHaveCount(0);
  await expect(page.locator("#gallery figure")).toHaveCount(projectsData.tingtingvac.gallery.length);
});

test("technical choices appear only for projects that have them", async ({ page }) => {
  await page.goto("/vi/projects/tingtingvac");
  await expect(page.locator("#technical")).toHaveCount(0);
  await page.goto("/en/projects/hadi");
  await expect(page.locator("#technical")).toBeVisible();
  const choices = en.work.items.hadi.choices ?? [];
  await expect(page.locator("#technical ol > li")).toHaveCount(choices.length);
  await expect(page.locator("#technical dt", { hasText: /^Why$/ })).toHaveCount(choices.filter((c) => c.why).length);
  await expect(page.locator("#technical dt", { hasText: /^Trade-off$/ })).toHaveCount(
    choices.filter((c) => c.tradeoff).length,
  );
});

test("the problem section is present exactly for projects that have one", async ({ page }) => {
  for (const slug of projectSlugs) {
    await page.goto(`/en/projects/${slug}`);
    if (en.work.items[slug].problem) {
      await expect(page.locator("#problem")).toBeVisible();
      await expect(page.locator("#problem h2")).toHaveText(en.caseStudy.problem);
    } else {
      await expect(page.locator("#problem")).toHaveCount(0);
    }
  }
});

test("a project with no gallery pictures renders no gallery section", async ({ page }) => {
  await page.goto("/en/projects/tinvid");
  await expect(page.locator("#gallery")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 2, name: en.caseStudy.gallery })).toHaveCount(0);
});

test("the cover and gallery expose the motion hooks; links follow the data", async ({ page }) => {
  await page.goto("/en/projects/hadi");
  await expect(page.locator("[data-motion-parallax] img")).toHaveCount(1);
  await expect(page.locator("[data-motion-sequence] > figure")).toHaveCount(projectsData.hadi.gallery.length);
  await expect(page.getByRole("link", { name: en.work.live })).toHaveAttribute("href", "https://hadilanguage.com");
  await page.goto("/en/projects/tingtingvac");
  await expect(page.getByRole("link", { name: en.work.live })).toHaveCount(0);
});

test("prev/next links walk the five projects with wrap-around", async ({ page }) => {
  await page.goto("/en/projects/tingtingvac");
  for (const slug of projectSlugs.slice(1).concat(projectSlugs[0])) {
    await page.getByRole("link", { name: /Next project/ }).click();
    await expect(page).toHaveURL(new RegExp(`/projects/${slug}$`));
  }
  await page.getByRole("link", { name: /Previous project/ }).click();
  await expect(page).toHaveURL(/\/projects\/tinvid$/);
});

test("Vietnamese case study is localized and carries structured data", async ({ page }) => {
  await page.goto("/vi/projects/mythiep");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.locator("#technical")).toBeVisible();
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join("")).toContain("CreativeWork");
});

test("unknown project slug is a 404; the back link returns to the work section", async ({ page }) => {
  const res = await page.goto("/en/projects/nope");
  expect(res?.status()).toBe(404);
  await page.goto("/en/projects/hadi");
  await expect(page.getByRole("link", { name: /All projects/ })).toHaveAttribute("href", "/en#projects");
});

test("only the for-sale case study offers a link to the contact section about its source code", async ({ page }) => {
  for (const [locale, name] of [["vi", "Hỏi mua mã nguồn"], ["en", "Ask about the source code"]] as const) {
    for (const slug of projectSlugs) {
      await page.goto(`/${locale}/projects/${slug}`);
      const link = page.getByRole("link", { name });
      if (projectsData[slug].status === "forSale") await expect(link).toHaveAttribute("href", `/${locale}#contact`);
      else await expect(link, `${locale}/${slug}`).toHaveCount(0);
    }
  }
});
