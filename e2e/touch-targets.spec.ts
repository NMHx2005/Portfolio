import { expect, test } from "@playwright/test";

// The project promises 44x44 CSS px targets on coarse pointers. The phone layout hides the inline nav and the
// palette button, so tablet widths and the 404 page must be covered separately.
const controls = "header button:visible, header a:visible, footer a:visible, summary:visible, #contact a:visible, #contact button:visible";

for (const width of [390, 768, 1024]) {
  test.describe(`coarse pointer, ${width}px`, () => {
    test.use({ viewport: { width, height: 900 }, hasTouch: true, isMobile: true });

    for (const [path, selector] of [
      ["/en", controls],
      ["/en/projects/hadi", controls],
      ["/en/does-not-exist", `${controls}, main a:visible`],
    ] as const) {
      test(`${path} controls are at least 44x44`, async ({ page }, info) => {
        test.skip(info.project.name !== "desktop", "viewport and touch emulation are set here, so one project is enough");
        const response = await page.goto(path);
        expect(response?.status()).toBe(path.endsWith("does-not-exist") ? 404 : 200);
        await expect(page.locator(selector).first()).toBeVisible(); // guards against a vacuous pass on an empty page
        expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
        const tooSmall = await page.locator(selector).evaluateAll((els) =>
          els
            .map((el) => {
              const r = el.getBoundingClientRect();
              return {
                name: el.getAttribute("aria-label") ?? el.textContent?.trim().slice(0, 30) ?? el.tagName,
                w: Math.round(r.width),
                h: Math.round(r.height),
              };
            })
            .filter((x) => x.w < 44 || x.h < 44),
        );
        expect(tooSmall).toEqual([]);
      });
    }
  });
}
