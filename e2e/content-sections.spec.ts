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

test("process shows five ordered steps", async ({ page }) => {
  await page.goto("/en");
  const steps = page.locator("#process ol > li");
  await expect(steps).toHaveCount(5);
  await expect(steps.first().getByRole("heading", { level: 3 })).toHaveText("Discovery");
  await expect(steps.last().getByRole("heading", { level: 3 })).toHaveText("Support");
});

test("FAQ is a native accordion: opens on click, exclusive, keyboard operable", async ({ page }) => {
  await page.goto("/en");
  const items = page.locator("#faq details");
  await expect(items).toHaveCount(8);
  await expect(page.locator("#faq details[open]")).toHaveCount(0);

  await items.nth(0).locator("summary").click();
  await expect(items.nth(0)).toHaveAttribute("open", "");
  await items.nth(1).locator("summary").click();
  await expect(items.nth(1)).toHaveAttribute("open", "");
  await expect(items.nth(0)).not.toHaveAttribute("open", "");

  await items.nth(2).locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(items.nth(2)).toHaveAttribute("open", "");
});
