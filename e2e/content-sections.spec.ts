import { expect, test } from "@playwright/test";
import { siteConfig } from "../src/config/site";

test("services lists four kinds of work, each with the products that prove it", async ({ page }) => {
  await page.goto("/vi");
  await expect(page.locator("#services li[data-service]")).toHaveCount(4);
  await expect(page.locator('#services li[data-service="mobile"]')).toContainText(/Hadi[\s\S]*TingTingVác[\s\S]*classnote[\s\S]*Hanyu/);
  await expect(page.locator('#services li[data-service="web"]')).toContainText("1–2 tuần");
  await expect(page.locator('#services li[data-service="ai"]').getByRole("link")).toHaveAttribute("href", "/vi#contact");
});

test("about is short, skips the student framing and keeps the skills anchor", async ({ page }) => {
  await page.goto("/vi");
  const about = page.locator("#about");
  await expect(about).not.toContainText(/sinh viên/i);
  await expect(about.getByRole("heading", { level: 3, name: "Công nghệ" })).toHaveAttribute("id", "stack");
  await expect(about.locator("[data-skill-group]")).toHaveCount(5);
  await expect(about.locator("img")).toHaveCount(0);
});

test("process shows five ordered steps, ownership and the payment split", async ({ page }) => {
  await page.goto("/vi");
  const steps = page.locator("#process ol > li");
  await expect(steps).toHaveCount(5);
  await expect(steps.first().getByRole("heading", { level: 3 })).toHaveText("Trao đổi");
  await expect(steps.last().getByRole("heading", { level: 3 })).toHaveText("Hỗ trợ");
  await expect(page.locator("#process")).toContainText("30%, 40%, 30%");
  await expect(page.locator("#process")).toContainText("đứng tên bạn");
});

test("sections appear in the navigation order", async ({ page }) => {
  await page.goto("/vi");
  const ids = await page.locator("main > section[id], main section[id]").evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(["hero", "projects", "services", "process", "about", "faq", "contact"]);
});

test("FAQ is a native accordion: opens on click, exclusive, keyboard operable", async ({ page }) => {
  await page.goto("/vi");
  const items = page.locator("#faq details");
  await expect(items).toHaveCount(7);
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

test.describe("contact", () => {
  const { email, zalo, phone, github, cv } = siteConfig.contact;

  test("email is the large primary link with the copy button beside it", async ({ page }) => {
    test.skip(!email, "no public email configured");
    await page.goto("/en");
    const contact = page.locator("#contact");
    const primary = contact.getByRole("link", { name: email ?? "" });
    await expect(primary).toHaveAttribute("href", `mailto:${email}`);
    await expect(primary).not.toHaveAttribute("target", /.+/);
    await expect(primary.locator("xpath=following-sibling::button")).toHaveAccessibleName("Copy email");
  });

  test("Zalo, phone and GitHub are listed once with the right link behaviour", async ({ page }) => {
    await page.goto("/en");
    const contact = page.locator("#contact");
    if (zalo) {
      const link = contact.locator(`a[href="${zalo.url}"]`);
      await expect(link).toHaveCount(1);
      await expect(link).toContainText(zalo.display);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    const tel = contact.locator(`a[href="${phone.href}"]`);
    await expect(tel).toHaveCount(1);
    await expect(tel).not.toHaveAttribute("target", /.+/);
    const gh = contact.locator(`a[href="${github}"]`);
    await expect(gh).toHaveCount(1);
    await expect(gh).toHaveAttribute("target", "_blank");
    await expect(gh).toHaveAttribute("rel", "noopener noreferrer");
    await expect(contact.getByRole("link", { name: "Download CV" })).toHaveCount(cv ? 1 : 0);
  });

  test("no Telegram channel in contact or footer", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("#contact")).not.toContainText(/telegram/i);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).not.toContainText(/telegram/i);
    expect(await page.locator('a[href*="//t.me"], a[href*="telegram.me"]').count()).toBe(0);
  });

  test("without form keys there is no form, an empty slot that adds no space, and request links still land on #contact", async ({
    page,
  }) => {
    test.skip(!process.env.E2E_PROD, "dev runs are started with form keys");
    await page.goto("/vi");
    await expect(page.locator("form")).toHaveCount(0);
    await page.locator("#hero").getByRole("link", { name: "Gửi yêu cầu" }).click();
    await expect(page).toHaveURL(/#contact$/);
    const slot = page.locator("#contact #contact-form-slot");
    await expect(slot).toHaveCount(1);
    await expect(slot).toBeEmpty();
    const box = await slot.boundingBox();
    expect(box, "the slot is rendered, so it has a box").not.toBeNull();
    expect(box?.height).toBe(0);
  });

  test("copy button writes the email to the clipboard and announces the result", async ({ page, context, browserName }) => {
    test.skip(!email, "no public email configured");
    test.skip(browserName !== "chromium", "clipboard permissions are chromium-specific");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/en");
    await page.getByRole("button", { name: "Copy email" }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(email);
    await expect(page.getByRole("status").filter({ hasText: "Copied" })).toHaveText("Copied");
  });

  test("footer is present with a GitHub link and a back-to-top link", async ({ page }) => {
    await page.goto("/en");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", github);
    await expect(footer.getByRole("link", { name: "Back to top" })).toHaveAttribute("href", "#main");
  });
});
