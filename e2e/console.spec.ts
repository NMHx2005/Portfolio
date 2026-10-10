import { expect, test } from "@playwright/test";

// The Vercel analytics script only exists on Vercel; a local server answers it with a 404 that is not ours.
const foreign = /_vercel\/insights|Failed to load resource/;

for (const path of ["/en", "/vi", "/en/projects/hadi", "/vi/does-not-exist"]) {
  test(`no console errors or warnings while loading and scrolling ${path}`, async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type()) && !foreign.test(message.text())) problems.push(message.text());
    });
    page.on("pageerror", (error) => problems.push(error.message));
    await page.goto(path);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await page.waitForTimeout(300);
    expect(problems).toEqual([]);
  });
}
