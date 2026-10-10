import { expect, test } from "@playwright/test";
import { getDictionary } from "../src/content/dictionary";

const hadi = getDictionary("en").work.items.hadi;

test("navigating from the home work block opens the case study", async ({ page }) => {
  await page.goto("/en");
  // The stretched title link covers the whole card; clicking the card navigates.
  await page.locator("#projects article").nth(1).click();
  await expect(page).toHaveURL(/\/en\/projects\/hadi$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hadi");
});

test("case study shows meta, problem, technical choices, architecture flow and shipped list", async ({ page }) => {
  await page.goto("/en/projects/hadi");
  await expect(page).toHaveTitle(/Hadi/);
  for (const label of ["Platform", "Status", "Stack"]) {
    await expect(page.locator("dt", { hasText: new RegExp(`^${label}$`) }).first()).toBeVisible();
  }
  await expect(page.locator("dt", { hasText: /^Role$/ })).toHaveCount(hadi.role ? 1 : 0);

  await expect(page.getByRole("heading", { level: 2, name: "The problem" })).toBeVisible();
  const choices = page.locator("#choices ol > li");
  await expect(choices).toHaveCount(hadi.choices.length);
  await expect(page.locator("#choices dt", { hasText: /^Why$/ })).toHaveCount(hadi.choices.filter((c) => c.why).length);
  await expect(page.locator("#choices dt", { hasText: /^Trade-off$/ })).toHaveCount(
    hadi.choices.filter((c) => c.tradeoff).length,
  );

  await expect(page.getByRole("list", { name: "Main flow" }).locator("li")).toHaveCount(hadi.flow.length);
  await expect(page.locator("#shipped ul > li")).toHaveCount(hadi.shipped.length);
  await expect(page.locator("#shipped dl")).toContainText("1,800+");
});

test("prev/next links walk the project list with wrap-around", async ({ page }) => {
  await page.goto("/en/projects/mythiep");
  for (const slug of ["hadi", "crossweave", "mythiep"]) {
    await page.getByRole("link", { name: /Next project/ }).click();
    await expect(page).toHaveURL(new RegExp(`/projects/${slug}$`));
  }
  await page.getByRole("link", { name: /Previous project/ }).click();
  await expect(page).toHaveURL(/\/projects\/crossweave$/);
});

test("Vietnamese case study is localized and carries structured data", async ({ page }) => {
  await page.goto("/vi/projects/mythiep");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.getByRole("heading", { level: 2, name: "Lựa chọn kỹ thuật" })).toBeVisible();
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join("")).toContain("CreativeWork");
});

test("the open-source tool links to its repository and has no live site; the product links to its site", async ({ page }) => {
  await page.goto("/en/projects/crossweave");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("crossweave");
  await expect(page.getByRole("link", { name: /Source code/ })).toHaveAttribute("href", "https://github.com/NMHx2005/crossweave");
  await expect(page.getByRole("link", { name: /Visit product/ })).toHaveCount(0);
  await expect(page.locator("dt", { hasText: /^Platform$/ }).locator("xpath=following-sibling::dd[1]")).toHaveText("Developer tool");

  await page.goto("/en/projects/mythiep");
  await expect(page.getByRole("link", { name: /Visit product/ })).toHaveAttribute("href", "https://mythiep.com");
});

test("unknown project slug is a 404; the back link returns to the work section", async ({ page }) => {
  const res = await page.goto("/en/projects/nope");
  expect(res?.status()).toBe(404);
  await page.goto("/en/projects/hadi");
  await expect(page.getByRole("link", { name: /All work/ })).toHaveAttribute("href", "/en#projects");
});
