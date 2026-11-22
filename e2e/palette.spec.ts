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
  const options = page.getByRole("dialog").getByRole("option");
  await expect(options.first()).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("ArrowDown");
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("ArrowUp"); // wraps to the last option
  const last = options.last();
  await expect(last).toHaveAttribute("aria-selected", "true");

  // Both boxes are read in one synchronous call: the dialog is still easing in (translate + scale) for 350ms, so two
  // separate reads would measure two different transforms. Polling covers the scroll that the selection triggers.
  await expect
    .poll(() =>
      last.evaluate((option) => {
        const list = option.closest('[role="listbox"]')!.getBoundingClientRect();
        const box = option.getBoundingClientRect();
        return box.top >= list.top - 1 && box.bottom <= list.bottom + 1;
      }),
    )
    .toBe(true);
});

test("Vietnamese search works without diacritics and Enter navigates", async ({ page }) => {
  await page.goto("/vi");
  await page.keyboard.press("Control+K");
  await page.getByRole("dialog").getByRole("combobox").fill("du an");
  await expect(page.getByRole("option", { name: "Dự án" }).first()).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).toHaveURL(/\/vi#projects$/);
});

test("filtering then Enter opens the selected project", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Control+K");
  await page.getByRole("dialog").getByRole("combobox").fill("had");
  await expect(page.getByRole("option", { name: "Hadi" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en\/projects\/hadi$/);
});

test("no-match query shows the empty state", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Control+K");
  await page.getByRole("dialog").getByRole("combobox").fill("zzzz");
  await expect(page.getByText("No results")).toBeVisible();
});

test("copy email action copies the configured email and confirms it", async ({ page, context, browserName }) => {
  const { email } = siteConfig.contact;
  test.skip(email === null, "no public email configured");
  test.skip(browserName !== "chromium", "clipboard permissions are chromium-specific");
  await page.goto("/en");
  await page.keyboard.press("Control+K");
  await page.getByRole("dialog").getByRole("combobox").fill("copy");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog").getByRole("status")).toHaveText("Copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(email);
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("switching language from the palette keeps query string and hash", async ({ page }) => {
  await page.goto("/vi?utm=x#faq");
  await page.keyboard.press("Control+K");
  await page.getByRole("dialog").getByRole("combobox").fill("switch");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en\?utm=x#faq$/);
});

test("actions: switch language and toggle theme", async ({ page }) => {
  await page.goto("/vi");
  await page.keyboard.press("Control+K");
  await page.getByRole("dialog").getByRole("combobox").fill("switch");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en$/);

  await page.keyboard.press("Control+K");
  await page.getByRole("dialog").getByRole("combobox").fill("theme");
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("scroll-progress bar is present normally and hidden under reduced motion", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator(".scroll-progress")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".scroll-progress")).toBeHidden();
});
