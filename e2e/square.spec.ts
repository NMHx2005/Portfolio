import { expect, test } from "@playwright/test";

// The visual language is square: nothing on the page may have a rounded corner.
async function roundedElements(page: import("@playwright/test").Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((el) => {
        const s = getComputedStyle(el);
        return [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomLeftRadius, s.borderBottomRightRadius].some(
          (r) => r !== "0px",
        );
      })
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.getAttribute("class") ?? "").slice(0, 60)}`),
  );
}

for (const path of ["/en", "/vi/projects/mythiep", "/en/does-not-exist"]) {
  test(`no element has rounded corners: ${path}`, async ({ page }) => {
    await page.goto(path);
    expect(await roundedElements(page)).toEqual([]);
  });
}

test("the open command palette and mobile menu are square too", async ({ page, isMobile }) => {
  await page.goto("/en");
  await page.keyboard.press("Control+K");
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await roundedElements(page)).toEqual([]);
  await page.keyboard.press("Escape");
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(await roundedElements(page)).toEqual([]);
  }
});
