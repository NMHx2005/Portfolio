import { expect, test } from "@playwright/test";

test("sitemap lists both locales and every case study with hreflang alternates", async ({ request }) => {
  const body = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/vi", "/en", "/vi/projects/hadi", "/en/projects/mythiep", "/en/projects/crossweave"]) expect(body).toContain(path);
  expect(body).toContain('hreflang="en"');
  expect(body).toContain('hreflang="vi"');
});

test("robots.txt references the sitemap", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
});

test("open graph images render as PNG for home and a case study", async ({ request }) => {
  for (const path of ["/vi/opengraph-image", "/en/projects/hadi/opengraph-image"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  }
});

test("pages advertise their og:image", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
  await page.goto("/en/projects/hadi");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /projects\/hadi\/opengraph-image/);
});
