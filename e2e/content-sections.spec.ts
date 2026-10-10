import { expect, test } from "@playwright/test";
import { siteConfig } from "../src/config/site";

test("services lists four capabilities with tags", async ({ page }) => {
  await page.goto("/en");
  const rows = page.locator("#services ol > li");
  await expect(rows).toHaveCount(4);
  await expect(rows.first().getByRole("heading", { level: 3 })).toHaveText("Web products");
  await expect(rows.last().locator("ul li")).not.toHaveCount(0);
});

test("about shows the bio, three principles and four skill groups; #stack lands on the skills", async ({ page }) => {
  await page.goto("/en");
  const about = page.locator("#about");
  await expect(about.getByRole("heading", { level: 2 })).toContainText("understands both code and UX");
  await expect(about.getByRole("list", { name: "Principles" }).locator("li")).toHaveCount(3);
  await expect(about.getByRole("heading", { level: 3, name: "Technology" })).toHaveAttribute("id", "stack");
  await expect(about.locator("[data-skill-group]")).toHaveCount(4);
});

test("portrait renders only when a real photo is configured", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("#about img")).toHaveCount(siteConfig.portrait ? 1 : 0);
});
