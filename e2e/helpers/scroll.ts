import { expect, type Page } from "@playwright/test";

// The Back button. Playwright's goBack() waits for a document load that a client-side navigation never performs, and
// fails with ERR_ABORTED if the dev server reloads the page at that moment.
export const back = (page: Page) => page.evaluate(() => history.back());
export const scrollY = (page: Page) => page.evaluate(() => window.scrollY);
// Lenis moves the page on animation frames: a few of them are enough to see whether anything is moving at all.
export const frames = (page: Page, count = 6) =>
  page.evaluate(async (n) => {
    for (let i = 0; i < n; i++) await new Promise((resolve) => requestAnimationFrame(resolve));
  }, count);
// The position once nothing is moving it any more (Lenis, a restored scroll or a native smooth scroll).
export const settledScrollY = async (page: Page) => {
  let settled = -1;
  await expect
    .poll(async () => {
      const before = await scrollY(page);
      await frames(page);
      settled = await scrollY(page);
      return settled === before;
    })
    .toBe(true);
  return settled;
};
