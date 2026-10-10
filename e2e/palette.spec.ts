import { expect, test } from "@playwright/test";
import { siteConfig } from "../src/config/site";

test("Ctrl+K and Meta+K toggle the palette; the input is labelled and focused", async ({ page }) => {
  await page.goto("/en");
  for (const combo of ["Control+K", "Meta+K"]) {
    await page.keyboard.press(combo);
    const input = page.getByRole("combobox", { name: "Search sections, projects or actions…" });
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
    await page.keyboard.press(combo);
    await expect(page.getByRole("dialog")).toBeHidden();
  }
});

test("the trigger button opens it and Escape returns focus to the trigger", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 640, "trigger is hidden below sm; the shortcut still works");
  await page.goto("/en");
  const trigger = page.getByRole("button", { name: "Open command palette" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("Tab and Shift+Tab never leave the dialog", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Control+K");
  for (const key of ["Tab", "Tab", "Shift+Tab", "Shift+Tab", "Shift+Tab"]) {
    await page.keyboard.press(key);
    expect(
      await page.evaluate(() => {
        const el = document.activeElement;
        // A native modal dialog makes the page behind it inert: focus may reach the browser UI (body) but never page content.
        return el === null || el === document.body || el.closest("dialog") !== null;
      }),
    ).toBe(true);
  }
});

test("arrow keys move the selection, wrap around and keep it scrolled into view", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 420 });
  await page.goto("/en");
  await page.keyboard.press("Control+K");
  const options = page.getByRole("option");
  await expect(options.first()).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("ArrowDown");
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("ArrowUp"); // wraps to the last option
  const last = options.last();
  await expect(last).toHaveAttribute("aria-selected", "true");

  const list = (await page.getByRole("listbox").boundingBox())!;
  const box = (await last.boundingBox())!;
  expect(box.y).toBeGreaterThanOrEqual(list.y - 1);
  expect(box.y + box.height).toBeLessThanOrEqual(list.y + list.height + 1);
});

test("Vietnamese search works without diacritics and Enter navigates", async ({ page }) => {
  await page.goto("/vi");
  await page.keyboard.press("Control+K");
  await page.getByRole("combobox").fill("du an");
  await expect(page.getByRole("option", { name: "Dự án" }).first()).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).toHaveURL(/\/vi#projects$/);
});

test("filtering then Enter opens the selected project", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Control+K");
  await page.getByRole("combobox").fill("had");
  await expect(page.getByRole("option", { name: "Hadi" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en\/projects\/hadi$/);
});

test("no-match query shows the empty state", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Control+K");
  await page.getByRole("combobox").fill("zzzz");
  await expect(page.getByText("No results")).toBeVisible();
});

test("copy email action gives feedback; it does not exist without a public email", async ({ page, context, browserName }) => {
  await page.goto("/en");
  await page.keyboard.press("Control+K");
  await page.getByRole("combobox").fill("copy");
  if (!siteConfig.contact.email) {
    await expect(page.getByRole("option")).toHaveCount(0);
    return;
  }
  test.skip(browserName !== "chromium", "clipboard permissions are chromium-specific");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(siteConfig.contact.email);
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("actions: switch language and toggle theme", async ({ page }) => {
  await page.goto("/vi");
  await page.keyboard.press("Control+K");
  await page.getByRole("combobox").fill("switch");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en$/);

  await page.keyboard.press("Control+K");
  await page.getByRole("combobox").fill("theme");
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("scroll-progress bar is present normally and hidden under reduced motion", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator(".scroll-progress")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".scroll-progress")).toBeHidden();
});
