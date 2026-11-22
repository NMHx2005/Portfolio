import { expect, test } from "@playwright/test";
import { frames } from "./helpers/scroll";
import { isAnalyticsScriptFailure, isFailureOfDocument } from "./helpers/console";

for (const path of ["/en", "/vi", "/en/projects/hadi", "/vi/does-not-exist"]) {
  test(`no console errors or warnings while loading and scrolling ${path}`, async ({ page, baseURL }) => {
    // The not-found page is answered with a 404 on purpose; its own response is the one failure that is expected.
    const notFoundDocument = path.endsWith("/does-not-exist") ? new URL(path, baseURL).href : undefined;
    const problems: string[] = [];
    page.on("console", (message) => {
      if (!["error", "warning"].includes(message.type()) || isAnalyticsScriptFailure(message)) return;
      if (notFoundDocument && isFailureOfDocument(message, notFoundDocument)) return;
      problems.push(message.text());
    });
    page.on("pageerror", (error) => problems.push(error.message));
    await page.goto(path);
    // The motion layer starts after hydration, when the browser is idle: asserting before it has started would not
    // cover it. Only a page where it is expected to start is waited for.
    await expect(page.locator("html")).toHaveAttribute("data-motion", /.+/, { timeout: 20_000 });
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await frames(page, 10);
    expect(problems).toEqual([]);
  });
}
