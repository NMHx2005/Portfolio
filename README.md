# Nguyễn Mạnh Hùng — Portfolio

Bilingual (vi/en) portfolio for a product engineer working on web and mobile. Next.js 16 App Router; content pages are prerendered per locale and a proxy negotiates the locale per request.

## Requirements

Node.js 22.12+ or 24+ (Vitest 5 sets this floor; `engines` and `.nvmrc` pin it). `nvm use` picks the right version.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (webpack) |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript |
| `npm test` | Vitest unit tests |
| `npm run e2e` | Playwright against the dev server on port 3100 |
| `npm run e2e:prod` | Builds, then runs Playwright against `next start` on port 3101 (stop any dev server first — both use `.next`) |
| `npm run check:content` | Lists optional owner inputs still missing (email, portrait, CV, project links, roles) |

## Structure

- `src/app/[locale]/…` — pages (`/vi`, `/en`, `/{locale}/projects/{slug}`), OG images
- `src/proxy.ts` — redirects un-prefixed URLs to a locale (cookie → Accept-Language → vi)
- `src/content/` — `projects.ts` (language-neutral facts), `vi.ts` / `en.ts` (typed dictionaries)
- `src/components/` — server sections + a few client islands (theme, language, mobile nav, command palette, reveal, copy-email)
- `src/app/globals.css` — design tokens (light/dark) and motion primitives
- `e2e/` — Playwright specs · `scripts/` — content readiness check

## Content rules

Dictionaries hold only facts. Roles, rationale/trade-offs and the public email are optional fields: leave them out until they are confirmed, and components render nothing for them.

## Adding a project

1. Add the slug to `ProjectSlug` (`content/types.ts`) and `projectSlugs`; add its data to `projectsData`.
2. Add a `ProjectCopy` for it in **both** `vi.ts` and `en.ts` (the type checker and `content.test.ts` enforce parity).
3. Drop a 4:3 cover in `public/projects/`.

## Configuration

- `NEXT_PUBLIC_SITE_URL` — canonical origin for metadata, sitemap, robots and JSON-LD (defaults to `siteConfig.url`).
- `src/config/site.ts` — contact channels, portrait, CV, hero stack, `contentUpdated` (bump when content changes; it feeds the sitemap and the hero's "Updated" date).
