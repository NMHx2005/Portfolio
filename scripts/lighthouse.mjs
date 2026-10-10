// Acceptance Lighthouse run: mobile, applied (devtools) throttling, median of N runs per URL.
// Needs a production server on the base URL (`npm run build && npm start -- -p 3101`) and a Chromium
// (set CHROME_PATH, e.g. the one Playwright installed). Usage:
//   CHROME_PATH=... node scripts/lighthouse.mjs [baseUrl]
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const LIGHTHOUSE = "lighthouse@13.5.0";
const RUNS = 5;
const base = process.argv[2] ?? "http://localhost:3101";
const paths = ["/vi", "/en", "/vi/projects/hadi", "/en/projects/hnwedding"];

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const work = mkdtempSync(join(tmpdir(), "lh-"));
const results = {};

for (const path of paths) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const out = join(work, `run-${i}.json`);
    execFileSync(
      "npx",
      [
        "--yes",
        LIGHTHOUSE,
        `${base}${path}`,
        "--output=json",
        `--output-path=${out}`,
        "--form-factor=mobile",
        "--throttling-method=devtools",
        "--only-categories=performance,accessibility,best-practices,seo",
        "--chrome-flags=--headless=new --no-sandbox",
        "--quiet",
      ],
      { stdio: ["ignore", "inherit", "inherit"] },
    );
    const lhr = JSON.parse(readFileSync(out, "utf8"));
    runs.push({
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories["best-practices"].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
      lcpMs: Math.round(lhr.audits["largest-contentful-paint"].numericValue),
      cls: Number(lhr.audits["cumulative-layout-shift"].numericValue.toFixed(3)),
      tbtMs: Math.round(lhr.audits["total-blocking-time"].numericValue),
      lighthouseVersion: lhr.lighthouseVersion,
      chrome: lhr.environment.hostUserAgent,
    });
  }
  const keys = ["performance", "accessibility", "bestPractices", "seo", "lcpMs", "cls", "tbtMs"];
  results[path] = { median: Object.fromEntries(keys.map((k) => [k, median(runs.map((r) => r[k]))])), runs };
}

mkdirSync("docs/lighthouse", { recursive: true });
const file = "docs/lighthouse/latest.json";
writeFileSync(file, `${JSON.stringify({ base, runsPerUrl: RUNS, tool: LIGHTHOUSE, results }, null, 2)}\n`);
console.table(Object.fromEntries(Object.entries(results).map(([p, r]) => [p, r.median])));
console.log(`per-run numbers written to ${file}`);
