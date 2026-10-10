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

test("an open mobile menu is released when the viewport grows past the breakpoint, and works again when it shrinks", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/en");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.locator("dialog#mobile-nav")).not.toHaveAttribute("open", "");
  // The page behind is interactive again: the click would time out if a modal still made it inert.
  await page.getByRole("button", { name: "Toggle light/dark theme" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);

  await page.setViewportSize({ width: 393, height: 852 });
  const open = page.getByRole("button", { name: "Open menu" });
  await expect(open).toHaveAttribute("aria-expanded", "false");
  await open.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("language switcher navigates to the other locale, remembers it and keeps query + hash", async ({ page, context }) => {
  await page.goto("/vi?utm=x#faq");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\?utm=x#faq$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const cookies = await context.cookies();
  expect(cookies.find((c) => c.name === "NEXT_LOCALE")?.value).toBe("en");
});

test("language links carry query and hash in their real href, so opening them in a new tab keeps the context", async ({ page, context }) => {
  await page.goto("/vi?utm=x");
  await page.evaluate(() => (location.hash = "faq"));
  const link = page.getByRole("link", { name: "English" });
  await link.hover(); // the href is refreshed on pointer interaction, as it is for a real visitor
  await expect(link).toHaveAttribute("href", "/en?utm=x#faq");

  const popup = context.waitForEvent("page");
  await link.click({ modifiers: ["ControlOrMeta"] });
  const tab = await popup;
  await expect(tab).toHaveURL(/\/en\?utm=x#faq$/);
  await expect(page).toHaveURL(/\/vi\?utm=x#faq$/); // this tab stays where it was
  expect((await context.cookies()).find((c) => c.name === "NEXT_LOCALE")).toBeUndefined();
});

test("theme toggle flips the dark class on <html>", async ({ page }) => {
  await page.goto("/en");
  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Toggle light/dark theme" }).click();
  await expect(html).not.toHaveClass(/dark/);
});
