# Performance acceptance

Targets (redesign spec, mobile): Performance ≥ 90, LCP < 2.5 s, CLS < 0.05, Accessibility 100, SEO 100. Best Practices and TBT are reported as information, with no target.

## Method (one method, no mixing)

- Production build served locally: `npm run build && npm run start -- -p 3101`.
- Lighthouse 13.5.0 (`npx lighthouse@13.5.0`), HeadlessChrome 156 (Playwright 1.64's Chromium via `CHROME_PATH`), mobile form factor, **applied throttling (`--throttling-method=devtools`)**, fresh profile, no extensions.
- 5 runs per URL, **median** reported. Per-run numbers, the LCP element and the transfer size of every run: [`lighthouse/latest.json`](lighthouse/latest.json).
- Reproduce: `CHROME_PATH=<chromium> node scripts/lighthouse.mjs [baseUrl]`.
- Why not the default simulated (lantern) throttling: against localhost it models every resource as arriving before the real LCP and reports ~3 s for pages whose applied-throttling LCP is ~1.9–2.2 s (the results below). The two are different measurements and are never compared with each other.
- This is a lab approximation on a developer machine, not field data.

## Results (Next.js 16.4.6, 2026-11-22)

Median of 5 runs; the range of the five runs is in brackets.

| URL | Perf | A11y | SEO | LCP | CLS | Best Practices | TBT |
|---|---|---|---|---|---|---|---|
| `/vi` | 98 (98–98) | 100 | 100 | 2.10 s (2.07–2.11) | 0 | 96 | 31 ms (27–44) |
| `/en` | 98 (98–98) | 100 | 100 | 2.09 s (2.06–2.10) | 0.001 | 96 | 36 ms (28–57) |
| `/vi/projects/hadi` | 98 (98–98) | 100 | 100 | 2.20 s (2.20–2.22) | 0 | 96 | 33 ms (24–37) |
| `/en/projects/rankdle` | 99 (99–99) | 100 | 100 | 1.90 s (1.88–1.91) | 0 | 96 | 26 ms (23–37) |

Every target is met on all four URLs, in every one of the five runs. Transfer per page load: 608, 607, 581 and 505 KB.

Mobile LCP is higher than in the previous measurement (below), by 0.08 to 0.42 s on the three URLs measured both times: `/vi` 2.02 → 2.10 s (+0.08), `/en` 1.69 → 2.09 s (+0.40), `/vi/projects/hadi` 1.78 → 2.20 s (+0.42). The previous set measured `/en/projects/mythiep`, which is not comparable with this set's `/en/projects/rankdle` (1.90 s). None of the three comparable URLs would meet the previous < 2.0 s target; all meet the redesign's < 2.5 s.

LCP element on a direct load (from the Lighthouse trace, every run, mobile): the hero paragraph on `/vi` and `/en`, a lede paragraph on the Hadi case study, the cover picture on the Rankdle case study (`preload`, eager). On desktop (Lighthouse `--preset=desktop`, one run per page, and a `largest-contentful-paint` observer in Chromium at 1440×900 against the dev server) it is the hero heading, then the hero paragraph. A project cover on the home page is not an LCP candidate on a direct load in either form factor.

## The project covers and Next's LCP hint

In dev mode Next logs "Image with src … was detected as the Largest Contentful Paint (LCP). Please add `loading="eager"`" for a lazy project cover on the home page. A cover is the largest paint only when the page is scrolled to the projects before any user input: a scripted scroll in the e2e specs, or scroll restoration when a visitor opens the page already scrolled. Chrome stops reporting LCP candidates at the first input, so a visitor who scrolls with the wheel, keyboard or touch never makes a cover the LCP (checked in Chromium: a real wheel scroll produces no hint; a scripted `scrollIntoView` does, for whichever cover it lands on). The hint is therefore a false positive for the flows that raise it, and it is kept as an allowance in `e2e/cover-morph.spec.ts`, limited to messages that name a project cover (`/projects/<slug>/cover…`).

Why the covers stay lazy. Three variants were built and measured with the method above, on Next.js 16.4.0 before the upgrade to 16.4.6 and with an earlier hero (mobile, 5 runs, median of LCP; transfer is the page weight; these rows are the experiment and were not repeated):

| Variant | `/vi` LCP | `/en` LCP | Transfer (`/vi`, `/en`) | Hint |
|---|---|---|---|---|
| Shipped: all covers lazy | 2097 ms (2087–2127); an earlier set 2103 ms (2077–2152) | 2072 ms (2058–2095); an earlier set 2099 ms (2078–2510) | 623, 622 KB | raised for the cover a scripted scroll reaches |
| `loading="eager"` on the first cover only | 2099 ms (2019–2119) | 2086 ms (2071–2129) | 623, 622 KB | gone for the first cover, still raised for the others (mythiep in the stacked-list test) |
| `loading="eager"` on every cover | 2094 ms (2087–2105) | 2091 ms (2088–2096) | 668, 667 KB (+45 KB, +7%) | gone |

LCP does not move between variants, so eager loading is not what is rejected for speed. Eager on the first cover alone costs nothing but also removes the hint only for that cover, because the scripted scroll reaches whichever card the test targets. Eager on every cover removes the hint but makes a direct load fetch the Hadi and TinVid covers, which are several screens below the fold on mobile, for +45 KB (two more image requests) and a page that no longer lazy-loads its list. That is a cost on every real visit to silence a dev-only message that no visitor who scrolls with input triggers. A reload at a restored scroll position could trigger it, which is rare and not worth +45 KB on every visit, so the allowance stays. Rejected: `preload`, which the `next/image` docs list "multiple images that could be the LCP depending on the situation" as a case against.

## Exceptions

- **Best Practices 96, not 100**: the only failing audit is the local 404 for the Vercel Analytics script (`/_vercel/insights/script.js`), which exists only on Vercel. It is expected to pass there; verify after deploy.
- **Mobile LCP is about 2.1 s on the home page and 2.2 s on the Hadi case study** (medians in the table above), inside the target but not far from it: the LCP element is a text paragraph in every run of those two pages (the hero paragraph, the Hadi lede), not a picture. It was not investigated further because the target is met. The slowest of the twenty runs is 2.22 s.

## Previous measurement (2026-10-10)

Taken for the earlier version of the site against stricter and different targets: Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100; LCP < 2.0 s, CLS < 0.05, TBT < 100 ms. Same method. The redesign's targets (above) replace them.

| URL | Perf | A11y | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/vi` | 99 | 100 | 96 | 100 | **2.02 s** | 0 | 37 ms |
| `/en` | 99 | 100 | 96 | 100 | 1.69 s | 0 | 38 ms |
| `/vi/projects/hadi` | 99 | 100 | 96 | 100 | 1.78 s | 0 | 35 ms |
| `/en/projects/mythiep` | 99 | 100 | 96 | 100 | 1.78 s | 0 | 35 ms |

`/vi` LCP of 2.02 s missed the old < 2.0 s target (five runs: 2.005–2.026 s); it was accepted as an exception then.

## Not yet covered

Safari/WebKit, VoiceOver and real-device runs are manual checks the owner still has to do.
