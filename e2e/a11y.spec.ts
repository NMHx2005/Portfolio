import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const paths = ["/vi", "/en", "/en/projects/hadi", "/vi/projects/mythiep", "/en/projects/crossweave", "/en/does-not-exist"];

for (const theme of ["dark", "light"] as const) {
  for (const path of paths) {
    test(`axe: ${path} (${theme})`, async ({ page }) => {
      // Reduced motion makes every [data-reveal] element fully visible so contrast is measured on real colours.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript((value) => window.localStorage.setItem("theme", value), theme);
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
    });
  }
}

test("open dialogs are accessible too (mobile menu, palette)", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
  else await page.keyboard.press("Control+K");
  const results = await new AxeBuilder({ page }).include("dialog[open]").analyze();
  expect(results.violations).toEqual([]);
});
