import { expect, test } from "@playwright/test";

test("desktop shows inline navigation, no menu button", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop only");
  await page.goto("/en");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("link")).toHaveText(["Work", "Services", "About", "Contact"]);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
});

test("mobile menu opens as a dialog, lists links, traps focus, closes on Escape and returns focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/en");
  await expect(page.getByRole("navigation", { name: "Main navigation" }).first()).toBeHidden();
  const open = page.getByRole("button", { name: "Open menu" });
  await expect(open).toHaveAttribute("aria-expanded", "false");
  await open.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(open).toHaveAttribute("aria-expanded", "true");
  await expect(dialog.getByRole("link")).toHaveCount(4);

  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => {
        const el = document.activeElement;
        // A native modal dialog makes the page behind it inert: focus may reach the browser UI (body) but never page content.
        return el === null || el === document.body || el.closest("dialog") !== null;
      }),
    ).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(open).toHaveAttribute("aria-expanded", "false");
  await expect(open).toBeFocused();
});

test("language switcher navigates to the other locale, remembers it and keeps query + hash", async ({ page, context }) => {
  await page.goto("/vi?utm=x#faq");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\?utm=x#faq$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const cookies = await context.cookies();
  expect(cookies.find((c) => c.name === "NEXT_LOCALE")?.value).toBe("en");
});

test("theme toggle flips the dark class on <html>", async ({ page }) => {
  await page.goto("/en");
  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Toggle light/dark theme" }).click();
  await expect(html).not.toHaveClass(/dark/);
});
