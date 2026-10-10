import { expect, test } from "@playwright/test";

// Chromium sends Accept-Language: en-US, which the proxy would honour; pin Vietnamese so the redirect target is /vi.
test.use({ locale: "vi-VN" });

test("an asset-like path that matches nothing is a 404, not a 200 or a crash", async ({ request }) => {
  const res = await request.get("/nope.png", { maxRedirects: 0 });
  expect(res.status()).toBe(404);
});

test("an unknown first segment is redirected under a locale and ends in a localized 404", async ({ page }) => {
  const res = await page.goto("/xx/foo");
  expect(res?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.getByRole("heading", { level: 1, name: "Không tìm thấy trang" })).toBeVisible();
});
