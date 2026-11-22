# Nguyễn Mạnh Hùng — Portfolio

Bilingual (vi/en) portfolio of a software engineer who builds websites, web apps, mobile apps and AI features for business clients. Next.js 16 App Router; content pages are prerendered per locale and a proxy negotiates the locale per request.

## Requirements

Node.js 22.12+ or 24+ (Vitest 5 sets this floor; `engines` and `.nvmrc` pin it). `nvm use` picks the right version.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (webpack) |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript |
| `npm test` | Vitest unit tests |
| `npm run e2e` | Playwright against the dev server on port 3100 (desktop 1440×900 and mobile Pixel 7) |
| `npm run e2e:prod` | Builds, then runs Playwright against `next start` on port 3101 (stop any dev server first — both use `.next`) |
| `npm run check:content` | Lists optional owner inputs still missing (public email, Zalo, CV, live links) |
| `node scripts/capture-projects.mjs --design-dir <folder> [--only <slug>]` | Captures the public product pages into `$TMPDIR/cap-projects` for the project pictures; `<folder>` (or `TTV_DESIGN_DIR`) is the approved TingTingVác design on disk |
| `CHROME_PATH=<chromium> node scripts/lighthouse.mjs [baseUrl]` | The acceptance Lighthouse run (`CHROME_PATH` is required: the Chromium that Playwright installed will do); the method and results are in [`docs/performance.md`](docs/performance.md) |

Both `npm run e2e` and `npm run e2e:prod` must pass before a merge: some timing (how soon the motion layer starts, how fast pages are served) only shows in the built app. In dev mode the e2e run starts a local stub for the contact services (port 3198), so tests never touch the real ones.

## Structure

- `src/app/[locale]/…` — pages (`/vi`, `/en`, `/{locale}/projects/{slug}`), OG images
- `src/app/api/contact/route.ts` — `POST /api/contact`, the request form's endpoint; the logic (configuration, input schema, bot check, email) lives in `src/lib/contact/`
- `src/proxy.ts` — redirects un-prefixed URLs to a locale (cookie → Accept-Language → vi)
- `src/content/` — `projects.ts` (language-neutral facts: status, dates, services, stack, pictures), `vi.ts` / `en.ts` (typed dictionaries), `types.ts`, `stats.ts` (the hero figures, computed from the facts)
- `src/config/site.ts` — site identity and contact channels
- `src/components/` — server sections (`sections/`, `work/`, `case-study/`) and a few client islands (theme, language, mobile nav, command palette, reveal, copy-email, request form with its Turnstile widget)
- `src/motion/` — the motion layer (see below)
- `src/app/globals.css` — design tokens (light/dark) and motion primitives
- Design language: square. No `rounded-*` utilities or `border-radius` anywhere (`src/design.test.ts` and `e2e/square.spec.ts` enforce it)
- `public/projects/<slug>/` — project pictures; `public/projects/CREDITS.md` says where each one comes from
- `e2e/` — Playwright specs · `scripts/` — content readiness check, picture capture, Lighthouse run · `docs/` — performance acceptance

### Motion layer

`src/motion/` is the only place GSAP and Lenis are imported. `src/components/motion-root.tsx` reaches it only through a dynamic import started when the browser is idle, so it never competes with hydration or the first paint. Everything on the page is visible and usable without JavaScript and under `prefers-reduced-motion`; the layer only adds to it.

- `gates.ts` decides what runs from the reduced-motion setting, the pointer type and the width (smooth scroll, the pinned project stage from 1024 px, magnetic buttons, the hero strip and figure count, the case-study parallax).
- `strip-control.ts` is the pause button of the hero strip (WCAG 2.2.2). It is hidden in the server markup and shown only while the strip moves on its own, so without JavaScript, under reduced motion and on touch screens (where the strip is a native scroll row) it does not exist for the visitor. A pause by the visitor is sticky: hover, focus, scrolling away or switching tabs never restart the strip; only the button does. Arrow keys on the strip still move it by hand.
- `engine.ts` starts and stops the enabled modules: `smooth-scroll.ts` (Lenis), `hero.ts`, `pin-projects.ts`, `parallax.ts`, `magnetic.ts`. `settle.ts` and `reading-anchor.ts` keep the reading position correct while the pin changes the page height.
- The cover morph between the home page and a case study uses React's `<ViewTransition>`. It runs forward only (a click on a cover, the palette); the browser's Back button is a plain navigation and does not morph the cover.

### Contact endpoint

`POST /api/contact` validates the input, checks a Cloudflare Turnstile token and sends the request by email through Resend. The form renders only when the server has its full configuration (see Configuration); otherwise the contact section shows the direct channels only.

## Content rules

Dictionaries hold only facts. Roles, rationale/trade-offs and the public email are optional fields: leave them out until they are confirmed, and components render nothing for them.

- No prices anywhere. `src/content/content.test.ts` fails on currency wording.
- No portrait.
- Client names are written exactly as they are in the dictionaries; do not shorten or restyle them elsewhere.
- Change `vi.ts` and `en.ts` together: the type checker and `content.test.ts` enforce parity, and a change in one language alone is a bug.
- Run `npm run check:content` after content changes to see which optional inputs are still missing.
- When content changes, bump `contentUpdated` in `src/config/site.ts`; it feeds the `lastModified` dates in the sitemap (nothing on the pages shows it).

## Adding a project

1. Add the slug to `ProjectSlug` (`content/types.ts`) and to `projectSlugs` (newest first); add its data to `projectsData` in `content/projects.ts`: `status` (`live`, `launching` or `forSale`), dates, `services` (`web`, `webapp`, `mobile`, `ai`), `stack`, the public link if there is one, and the pictures.
2. Add a `ProjectCopy` for it in **both** `vi.ts` and `en.ts`: client, platform, summary, what was delivered, and alt text for the cover and each gallery picture.
3. Put the pictures in `public/projects/<slug>/` as WebP at the fixed sizes: `cover.webp` and `g1.webp` … `gN.webp`, either 1600×1000 (browser frame) or 780×1688 (phone frame). `content.test.ts` checks that every file exists and that the size declared in `projectsData` is the agreed one; it does not read the pixel size of the file, so export the pictures at that size. Record each picture's source in `public/projects/CREDITS.md`. `scripts/capture-projects.mjs` captures public pages at the right size.
4. A product still in development is not a case study: add its slug to `BuildingSlug` and `buildingSlugs`, its `status` (`building` or `testBuild`) and `services` to `buildingData`, and a title and summary to `work.building.items` in both dictionaries.

## Configuration

- `NEXT_PUBLIC_SITE_URL` — canonical origin for metadata, sitemap, robots and JSON-LD (defaults to `siteConfig.url`).
- Request form (`POST /api/contact`): the form is rendered only when all five required variables below are set; without them the contact section shows just the channels and every "send a request" link still lands on `#contact`. Set these on the server (Vercel project settings), never in the repository:
  - `RESEND_API_KEY` — API key of the [Resend](https://resend.com) account that sends the email.
  - `CONTACT_TO_EMAIL` — the inbox that receives requests.
  - `CONTACT_FROM_EMAIL` — sender address on a domain verified in Resend.
  - `TURNSTILE_SECRET_KEY` — secret key of the [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) widget (server only).
  - `TURNSTILE_SITE_KEY` — site key of the same widget; the only value that reaches the browser.
  - `CONTACT_EMAIL_API_URL`, `CONTACT_TURNSTILE_VERIFY_URL`, `CONTACT_TURNSTILE_SCRIPT_URL` — test-only overrides of the email endpoint, the Turnstile verification endpoint and the Turnstile widget script. The e2e run points all three at `e2e/stubs/contact-stub.mjs`. They are ignored when `NODE_ENV` is `production`, so a stray variable cannot redirect the owner's email, the API key or the bot check to another host.
  - Pages are prerendered, so the form appears only after a rebuild or redeploy with these variables set; changing them on a running deployment has no effect until then.
- `src/config/site.ts` — contact channels, CV, `contentUpdated`.

### Setting up the request form (owner checklist)

The form stays hidden until all of this is done. No values belong in the repository.

1. Create a [Resend](https://resend.com) account and verify the domain the emails will be sent from.
2. Create a [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) site for the portfolio's domain; it gives a site key and a secret key.
3. In the Vercel project settings, set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `TURNSTILE_SECRET_KEY` and `TURNSTILE_SITE_KEY`.
4. Add every hostname that serves the site to the Turnstile site, including the Vercel Preview hostnames; or use Cloudflare's [published test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) on the Preview environment. Otherwise the form fails on preview deployments.
5. Redeploy, then send one test request from the live site.
6. A request that could not be delivered (for example an exhausted Resend quota or a revoked key) shows the visitor the failure message and writes one line to the server log (Vercel function logs): a fixed message and the HTTP status or error class, never the visitor's data. Look there if requests stop arriving.

## Performance

Targets, method and the latest results (production build, Lighthouse, five runs, median): [`docs/performance.md`](docs/performance.md).

## Known limitations

- There is no rate limiting beyond Turnstile and the hidden honeypot field. A solver farm could still flood the inbox; if that happens, add a Vercel Firewall rate-limit rule on `/api/contact`.
- The browser's Back button does not morph the cover; it is a plain navigation.
- The end-to-end tests run on Chromium only (desktop and Pixel 7 emulation). Safari/WebKit and Firefox are a manual check before a release.
