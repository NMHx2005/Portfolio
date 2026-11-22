import { chromium, type FullConfig } from "@playwright/test";
import { projectSlugs } from "../src/content/projects";

// In dev mode Next compiles a route the first time it is asked for, and each compile makes the dev server rebuild and
// reload every page that is open. A test that happens to run next to the first request for the 404 page, a case study
// or the engine chunk then loses its page half way. Asking for all of them once, before any test starts, moves those
// compiles out of the tests. Production runs serve a finished build, so there is nothing to warm.
export default async function globalSetup(config: FullConfig) {
  if (process.env.E2E_PROD) return;
  const baseURL = config.projects[0]?.use.baseURL;
  if (!baseURL) return;

  const browser = await chromium.launch();
  try {
    const page = await (await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 } })).newPage();
    const paths = [
      "/vi",
      "/en",
      ...projectSlugs.flatMap((slug) => [`/vi/projects/${slug}`, `/en/projects/${slug}`]),
      "/vi/__warm-up", // the 404 page under a locale
      "/en/__warm-up",
      "/xx/__warm-up", // an unknown first segment
    ];
    for (const path of paths) await page.goto(path, { waitUntil: "load" });
    // The motion engine and Lenis are separate chunks that load after the page is idle.
    await page.goto("/vi");
    await page.locator("html[data-motion]").waitFor({ timeout: 30_000 }).catch(() => {});
    for (const path of ["/sitemap.xml", "/robots.txt", "/nope.png", "/en/opengraph-image", `/en/projects/${projectSlugs[0]}/opengraph-image`]) {
      await page.request.get(path, { maxRedirects: 0 }).catch(() => {});
    }
  } finally {
    await browser.close();
  }
}
