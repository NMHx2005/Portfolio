# Performance acceptance

Targets (spec §10): Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100; LCP < 2.0 s, CLS < 0.05, TBT < 100 ms.

## Method (one method, no mixing)

- Production build served locally: `npm run build && npm run start -- -p 3101`.
- Lighthouse 13.5.0 (`npx lighthouse@13.5.0`), HeadlessChrome 156 (Playwright's Chromium via `CHROME_PATH`), mobile form factor, **applied throttling (`--throttling-method=devtools`)**, fresh profile, no extensions.
- 5 runs per URL, **median** reported. Per-run numbers: [`lighthouse/latest.json`](lighthouse/latest.json).
- Reproduce: `CHROME_PATH=<chromium> node scripts/lighthouse.mjs [baseUrl]`.
- Why not the default simulated (lantern) throttling: against localhost it models every resource as arriving before the real LCP and reports ~3 s for pages whose applied-throttling LCP is ~1.7–2.0 s. The two are different measurements and are never compared with each other.
- This is a lab approximation on a developer machine, not field data.

## Results (Next.js 16.4.0, 2026-10-10)

| URL | Perf | A11y | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/vi` | 99 | 100 | 96 | 100 | **2.02 s** | 0 | 47 ms |
| `/en` | 99 | 100 | 96 | 100 | 1.70 s | 0 | 44 ms |
| `/vi/projects/hadi` | 99 | 100 | 96 | 100 | 1.77 s | 0.004 | 42 ms |
| `/en/projects/hnwedding` | 99 | 100 | 96 | 100 | 1.78 s | 0 | 56 ms |

## Exceptions

- **`/vi` LCP 2.02 s vs. target < 2.0 s** (five runs: 1.998–2.047 s). The cause was not isolated; earlier experiments (removing the reveal opacity, the entrance animation, font preloading) did not move it and were reverted. Accepted as an exception, not rounded away: the margin is within run-to-run noise and Performance is 99.
- **Best Practices 96, not 100**: the only failing audit is the local 404 for the Vercel Analytics script (`/_vercel/insights/script.js`), which exists only on Vercel. It is expected to pass there; verify after deploy.

## Not yet covered

Safari/WebKit, VoiceOver and real-device runs are manual checks the owner still has to do (see the plan's Task 20 checklist).
