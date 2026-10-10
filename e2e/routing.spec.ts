import { expect, test } from "@playwright/test";

test.describe("locale redirect", () => {
  test("root redirects to /vi by default with a 307", async ({ request }) => {
    const res = await request.get("/", { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(res.headers()["location"]).toMatch(/\/vi$/);
  });

  test("Accept-Language and the NEXT_LOCALE cookie are respected (cookie wins)", async ({ request }) => {
    const en = await request.get("/", { maxRedirects: 0, headers: { "accept-language": "en-US,en;q=0.9" } });
    expect(en.headers()["location"]).toMatch(/\/en$/);
    const cookie = await request.get("/", {
      maxRedirects: 0,
      headers: { cookie: "NEXT_LOCALE=en", "accept-language": "vi" },
    });
    expect(cookie.headers()["location"]).toMatch(/\/en$/);
  });

  test("path and query string survive the redirect; /vietnam is not mistaken for a locale", async ({ request }) => {
    const a = await request.get("/projects/hadi?utm=x", { maxRedirects: 0 });
    expect(a.headers()["location"]).toMatch(/\/vi\/projects\/hadi\?utm=x$/);
    const b = await request.get("/vietnam", { maxRedirects: 0 });
    expect(b.headers()["location"]).toMatch(/\/vi\/vietnam$/);
  });
});

test.describe("locale pages", () => {
  test("html lang follows the URL", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.goto("/vi");
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  });

  test("hreflang alternates and self-canonical are present", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en$/);
    await expect(page.locator('link[rel="alternate"][hreflang="vi"]')).toHaveAttribute("href", /\/vi$/);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute("href", /\/vi$/);
  });

  test("unknown path under a locale is a localized 404", async ({ page }) => {
    const res = await page.goto("/en/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    const vi = await page.goto("/vi/khong-ton-tai");
    expect(vi?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Không tìm thấy trang" })).toBeVisible();
  });
});
