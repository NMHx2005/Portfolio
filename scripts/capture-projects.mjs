// Captures public product pages at a fixed viewport into $TMPDIR/cap-projects.
// Usage: node scripts/capture-projects.mjs --design-dir <folder with trang-chu.html> [--only <slug>]
// The folder can also come from TTV_DESIGN_DIR. It is the approved TingTingVác design, read from disk.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const out = join(process.env.TMPDIR || tmpdir(), "cap-projects");
mkdirSync(out, { recursive: true });

const designFlag = process.argv.indexOf("--design-dir");
const DESIGN_DIR = (designFlag > -1 ? process.argv[designFlag + 1] : process.env.TTV_DESIGN_DIR) || "";
if (!DESIGN_DIR) {
  console.error("Missing the design folder.\nUsage: node scripts/capture-projects.mjs --design-dir <folder> [--only <slug>]\n   or: TTV_DESIGN_DIR=<folder> node scripts/capture-projects.mjs [--only <slug>]");
  process.exit(1);
}

// [name, url, optional heading] entries; public pages only, no login, no form submission.
const TARGETS = {
  mythiep: [
    ["home", "https://mythiep.com"],
    ["catalogue", "https://mythiep.com/mau-thiep"],
    ["sample", "https://mythiep.com/mau-thiep/phong-bi-gold"],
    ["demo", "https://mythiep.com/mau-thiep/phong-bi-gold/demo", null, "phone"],
  ],
  rankdle: [
    ["home", "https://doanrankmlbbft.com"],
    ["rules", "https://doanrankmlbbft.com/page/rules"],
    ["play", "https://doanrankmlbbft.com/play"],
    ["upload", "https://doanrankmlbbft.com/upload"],
    ["missions", "https://doanrankmlbbft.com/missions"],
    ["prizes", "https://doanrankmlbbft.com/leaderboard?prizes=1"],
  ],
  hadi: [
    ["home", "https://hadilanguage.com"],
    ["product", "https://hadilanguage.com/san-pham"],
    ["pricing", "https://hadilanguage.com/gia"],
  ],
  tinvid: [["home", "https://tinvid.com"]],
  // Approved static design opened from disk (read-only). Third item: heading text to scroll to.
  tingtingvac: [
    ["hero", `file://${DESIGN_DIR}/trang-chu.html`],
    ["steps", `file://${DESIGN_DIR}/trang-chu.html`, "Bốn bước"],
    ["visible", `file://${DESIGN_DIR}/trang-chu.html`, "Tin đăng hiển thị với thợ"],
  ],
};

// Panels that show player handles are hidden by style so no personal data is captured.
const HIDE = { "https://doanrankmlbbft.com": ".mini-lb" };

const argIdx = process.argv.indexOf("--only");
const only = argIdx > -1 ? process.argv[argIdx + 1] : null;
const slugs = only ? [only] : Object.keys(TARGETS);

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});

// Phone captures: 390x844 CSS px at 2x = 780x1688.
const phoneContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  reducedMotion: "reduce",
});

for (const slug of slugs) {
  const urls = TARGETS[slug];
  if (!urls) {
    console.error(`unknown slug: ${slug}`);
    continue;
  }
  for (const [name, url, heading, mode] of urls) {
    const page = await (mode === "phone" ? phoneContext : context).newPage();
    try {
      const res = await page.goto(url, { waitUntil: "load", timeout: 45000 });
      // Pages that stream media never go idle; a missed idle is not an error.
      await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
      const status = res ? res.status() : 0;
      if (status !== 200 && !url.startsWith("file:")) {
        console.log(`${slug} ${url} -> HTTP ${status}, skipped`);
        continue;
      }
      if (heading) {
        await page.evaluate((text) => {
          const el = [...document.querySelectorAll("h1,h2,h3")].find((h) => h.textContent.includes(text));
          if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 140);
        }, heading);
      }
      await page.waitForTimeout(3000);
      // Hide a fixed cookie banner by style; nothing is clicked.
      await page.evaluate(() => {
        for (const el of document.querySelectorAll("body *")) {
          const text = el.textContent ?? "";
          if (getComputedStyle(el).position === "fixed" && /cookie/i.test(text) && text.length < 600) {
            el.style.display = "none";
          }
        }
      });
      if (HIDE[url]) await page.addStyleTag({ content: `${HIDE[url]}{visibility:hidden!important}` });
      const file = join(out, `${slug}-${name}.png`);
      await page.screenshot({ path: file });
      console.log(`${slug} ${url} -> ${file}`);
    } catch (err) {
      console.log(`${slug} ${url} -> failed: ${err.message.split("\n")[0]}`);
    } finally {
      await page.close();
    }
  }
}

await browser.close();
