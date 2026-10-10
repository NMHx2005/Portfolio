import { expect, test } from "@playwright/test";

test("desktop shows inline navigation, no menu button", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop only");
  await page.goto("/en");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("link")).toHaveText(["Work", "Services", "About", "Process", "FAQ", "Contact"]);
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
  await expect(dialog.getByRole("link")).toHaveCount(6);

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

test("the inline navigation takes over exactly at 1024px; below it the menu button is shown", async ({ page }) => {
  await page.setViewportSize({ width: 1023, height: 800 });
  await page.goto("/en");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Main navigation" }).first()).toBeHidden();

  await page.setViewportSize({ width: 1024, height: 800 });
  await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link")).toHaveCount(6);
});

test("the navigation highlights the section being read while scrolling", async ({ page, isMobile }) => {
  test.skip(isMobile, "inline navigation is desktop only");
  await page.emulateMedia({ reducedMotion: "reduce" }); // makes the jumps instant instead of smooth
  await page.goto("/en");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  const current = nav.locator("a[aria-current]");

  await expect(current).toHaveCount(0); // the hero is not in the navigation
  for (const [id, label] of [
    ["services", "Services"],
    ["about", "About"],
    ["faq", "FAQ"],
    ["contact", "Contact"],
  ] as const) {
    await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView());
    await expect(current).toHaveCount(1);
    await expect(current).toHaveText(label);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(current).toHaveCount(0);
});

test("the controls on the right of the header share one height and one centre line", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 640, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/en");
    const boxes = await page
      .locator("header .flex.items-center.gap-2 > :visible")
      .evaluateAll((els) => els.map((el) => {
        const r = el.getBoundingClientRect();
        return { h: Math.round(r.height), centre: Math.round(r.top + r.height / 2) };
      }));
    expect(boxes.length).toBeGreaterThanOrEqual(3);
    expect(new Set(boxes.map((b) => b.h)).size, JSON.stringify(boxes)).toBe(1);
    expect(new Set(boxes.map((b) => b.centre)).size, JSON.stringify(boxes)).toBe(1);
  }
});
