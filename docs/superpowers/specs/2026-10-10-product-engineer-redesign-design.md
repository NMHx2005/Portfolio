# Product Engineer Portfolio — Design Spec

**Date:** 2026-10-10
**Status:** Revision 2 — updated after an independent plan review (content rule, motion safety, legacy links, verification method)
**Supersedes:** `2026-06-15-portfolio-redesign-design.md` ("Dark Aurora Studio" — freelance positioning, heavy GSAP). That spec's visual language, positioning and animation stack are retired; its content (copy facts) is reused.

## 1. Goals

1. **Positioning:** "Product engineer — web & mobile, end to end." Freelance availability is a secondary line, not the identity.
2. **Two audiences, one page:**
   - *Clients / recruiters* (non-technical): understand within 10 s who he is, what he ships, how to contact him.
   - *Engineers* (peers, hiring managers): find evidence of depth within 60 s — real products, architecture decisions, clean code, performance, keyboard-first UX.
3. **International-standard craft:** minimal, typographic, fast, accessible, bilingual (vi/en) with real locale URLs.
4. **Motion:** purposeful, medium budget. Never decorative, never required to read content.

## 2. Non-goals

- No CMS, no blog, no contact form/backend (email + Telegram + phone are the channels).
- No new third-party animation libs. No 3D/WebGL.
- **No invented claims.** The site states only facts evidenced by the repository or by the owner's earlier site copy. Roles, rationale/trade-offs, "currently building" statements and the public email are *optional fields*: absent until the owner approves them (§12), and the UI renders nothing for an absent field. A case study is credible only if every sentence has a source.

## 3. Information architecture

```
/                       → proxy redirect → /vi | /en   (cookie NEXT_LOCALE → Accept-Language → vi)
/{locale}               → Home (single page, 7 sections; ids: hero, projects, services, about, process, faq, contact)
/{locale}/projects/{slug}  → Case study (hnwedding, hadi)
/{locale}/<anything else> → localized 404
/sitemap.xml  /robots.txt  /{locale}/opengraph-image  /{locale}/projects/{slug}/opengraph-image
```

Home section order: **Hero → Work → Services → About (+ skills) → Process → FAQ → Contact**.

**Legacy links keep working.** Section ids are unchanged from the live site (`#projects`, `#services`, `#process`, `#about`, `#faq`, `#contact`, `#hero`). The removed `#stack` section is anchored to the "Technology" heading inside About. Browsers carry a URL fragment across the locale redirect, and this is verified in a real browser, not assumed.

| # | Section | Job |
|---|---|---|
| — | Hero | Position, prove availability, "Now" panel, 2 CTAs |
| 01 | Work (`#projects`) | Two large project blocks → case studies |
| 02 | Services | 4 capabilities as hairline rows, outcome-first copy |
| 03 | About | Real portrait (when supplied), bio, principles, grouped skills |
| 04 | Process | 5 steps in one horizontal row (stacked on mobile) |
| 05 | FAQ | Native `<details>` accordion |
| 06 | Contact | Email as primary action *when a public email is confirmed* (else Telegram), other channels, CV when supplied |

Header nav: Work · Services · About · Contact + language + theme (+ command-palette trigger, enhancement). Mobile: dialog sheet with the same links.

## 4. Visual system

**Principles:** typography first; hairlines instead of boxes; one accent; imagery is the product; no glass/blur/glow/gradient text; radius `md`/`lg` for controls, `xl` for images and cards; `rounded-full` only for the status dot.

### 4.1 Tokens (authoritative values live in `src/app/globals.css`; a test enforces contrast)

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#fafaf9` | `#0a0a0b` |
| `--surface` | `#ffffff` | `#111113` |
| `--border` | `#e4e4e7` | `#26262b` |
| `--border-strong` | `#d4d4d8` | `#3a3a42` |
| `--fg` | `#111113` | `#ededef` |
| `--fg-muted` | `#52525b` | `#a1a1aa` |
| `--fg-subtle` | `#6b6b75` | `#8a8a93` |
| `--accent` | `#047857` | `#6ee7b7` |
| `--on-accent` | `#ffffff` | `#04241a` |

Contrast floors (WCAG AA): `fg`, `fg-muted`, `fg-subtle` vs `bg` and `surface` ≥ 4.5; `accent` vs `bg` ≥ 4.5; `on-accent` vs `accent` ≥ 4.5. Borders are decorative hairlines (exempt from the 3:1 non-text rule); interactive controls never rely on a border alone to be identified.

### 4.2 Typography

- **Sans:** Inter (variable) — subsets `latin`, `latin-ext`, `vietnamese` (Next 16.0.7's bundled Google-font metadata lists no `vietnamese` subset for Geist, so `next/font` cannot load it; this is a limit of that metadata, not a claim about the typeface).
- **Mono:** Geist Mono (`latin`). **Rule:** mono is used only for ASCII, non-translated tokens (indexes `01`, stack names, version tags, kbd hints). Translated labels use sans so Vietnamese diacritics never fall back.
- Scale: h1 `clamp(2.25rem, 6vw, 4.5rem)`/1.05, 600, `-0.035em`; h2 `clamp(1.75rem, 3.2vw, 2.5rem)`/1.15, 600, `-0.025em`; h3 1.25rem/1.3, 600; body 1rem/1.65; small 0.875rem; label 0.8125rem.
- No serif, no italics for display.

### 4.3 Layout

- Container `max-w-6xl` (72rem), gutters `px-5 sm:px-8`.
- Sections `py-24 md:py-32`, separated by a 1 px `--border` rule.
- Section header: 2-col grid `md:grid-cols-[11rem_1fr]` — left: mono index + translated label (sticky on `md+`), right: h2 + lede.
- Work blocks: 12-col grid; image `col-span-7`, text `col-span-5`; second project mirrored at `lg+`. Image aspect 4/3 (source 1280×960), 1 px border, 12 px radius; `sizes` follows the real column width (≈ 615 px at ≥ 1152 px viewports).
- `scroll-padding-top: 5rem` for the fixed header; anchors never hide under it.

## 5. Motion budget (medium)

| Effect | Tech | Notes |
|---|---|---|
| Hero entrance (stagger rise) | CSS keyframes + `--i` delay, inside `prefers-reduced-motion: no-preference` | Server-rendered, no JS; ends visible |
| Section reveal on scroll | `IntersectionObserver` (~30 lines) + CSS | **Content is visible by default.** The observer first marks on-screen items visible, *then* sets `html[data-reveal-ready]`; only then may CSS hide below-the-fold items. If the script never runs, nothing is hidden |
| Work block hover | `motion-safe:` image scale 1.02, arrow shift | `transform` only |
| Nav link / button states | `transition-colors` | Never `transition-all` |
| Scroll progress bar (2 px, accent) — *enhancement* | CSS `animation-timeline: scroll()` in `@supports` + `no-preference` | Hidden otherwise |
| Command palette open — *enhancement* | `<dialog>` + short CSS fade | |
| Theme toggle | instant class swap (`disableTransitionOnChange`) | |

Rules: nothing loops (no pulse); every movement is gated by `prefers-reduced-motion` (CSS inside `no-preference`, Tailwind `motion-safe:` for hover/transition transforms) plus a `reduce` backstop that flattens any remaining animation/transition; native `scroll-behavior: smooth` only under `no-preference`. State indicators (e.g. the FAQ icon's open rotation) still change under reduced motion — only the animation is removed. Removed: GSAP, `@gsap/react`, Lenis, Framer Motion, custom cursor, magnetic, tilt, aurora, marquee, number counter, split text.

## 6. Engineer-facing details

- **Ctrl/⌘ + K command palette** *(enhancement, built last)*: jump to section/project, open GitHub, switch language, toggle theme, copy email when one is public. Native `<dialog>`; labelled combobox; arrow keys keep the selected option scrolled into view; copy gives spoken/visible success or failure feedback; Tab stays in the dialog; focus returns to the trigger. Diacritic-insensitive search.
- **"Now" panel (hero):** only evidenced facts (HNWedding and Hadi in production; studying IT at Hanoi Open University) with an "Updated <month year>" line derived from `contentUpdated`. Extra lines such as "building Hadi V6" are added only after the owner confirms they are current.
- **Case studies:** meta (platform, status, stack; *role only when confirmed*), problem (the owner's own earlier text), **technical choices** (facts: what was used or built; `why`/`trade-off` rows appear only when the owner supplies them), a text-built architecture flow, what shipped, and a small "more facts" line (commits, migrations, themes — secondary, never a headline), prev/next.
- **Compact stack tokens** in hero (mono) and grouped skills in About; the marquee and duplicate stack section are removed.

## 7. Internationalisation & rendering

- `app/[locale]/…` with `generateStaticParams` for `vi`, `en`: content pages are **prerendered**. The proxy still negotiates the locale per request, so this is not a static export. Because the root layout is a dynamic segment, 404 behaviour (including asset-like paths) is verified on a real production build early, with `experimental.globalNotFound` as the documented fallback.
- `src/proxy.ts` (Next 16 successor of `middleware.ts`) redirects un-prefixed paths: cookie `NEXT_LOCALE` → `Accept-Language` → `vi`. Redirect is 307 (varies per visitor).
- `<html lang>` = locale. `alternates.languages` hreflang (`vi`, `en`, `x-default` → `/vi`), canonical self-referencing per locale.
- Language switcher = real links (`/vi/...` ↔ `/en/...`) + sets `NEXT_LOCALE` cookie; with JS it also **preserves the query string and hash** (`/vi?utm=x#faq` → `/en?utm=x#faq`); without JS the plain path link is the fallback.
- Content is split: language-neutral data in `src/content/projects.ts`; copy in `src/content/vi.ts` / `en.ts`. Same TypeScript type (`Dictionary`) for both → compile-time parity; a test also checks deep key parity.
- Server components by default. Client components only: theme toggle & provider, language switcher, mobile nav, reveal observer, copy-email button, and (last) the command palette.

## 8. SEO

- Single site-URL source: `getSiteUrl()` (`NEXT_PUBLIC_SITE_URL` ?? `siteConfig.url`), used by metadata, sitemap, robots, JSON-LD, OG.
- Per-page `generateMetadata` (title, description, OG, Twitter, canonical, hreflang).
- JSON-LD: home → `Person` (jobTitle "Product Engineer", real portrait when supplied) + `WebSite`; case study → `CreativeWork` + `BreadcrumbList`.
- Sitemap: 2 locales × (home + 2 case studies) with `alternates.languages`; `lastModified` = `siteConfig.contentUpdated` (a committed date, not `new Date()`).
- Dynamic OG images (`next/og`) per locale and per project with a bundled Inter font that includes the Vietnamese subset.

## 9. Accessibility

- Skip link to `#main`; landmarks (`header`, `nav` labelled, `main`, `footer`); one `h1` per page.
- Visible focus ring everywhere (`:focus-visible`, 2 px accent, 2 px offset). Stretched card links show the ring on the card via `:has(:focus-visible)`.
- Targets ≥ 44×44 CSS px when `pointer: coarse` (via a `touch:` variant), ≥ 24 px otherwise. FAQ via native `<details>` (keyboard + SR for free).
- Reduced motion honoured everywhere (see §5); content never depends on an animation or script to become readable.
- axe (via Playwright) reports 0 violations on `/vi`, `/en`, both case-study locales and the localized 404, light and dark, plus the open dialogs. axe does **not** prove keyboard, screen-reader or target-size quality, so those have explicit tests and a recorded manual checklist.

## 10. Performance targets (measured on `next build && next start`, mobile emulation)

Lighthouse: Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100. LCP < 2.0 s, CLS < 0.05, TBT < 100 ms. Hero is text, so the work images sit below the fold: no `priority`/preload unless a trace shows an image as the LCP element. Method (the one method for acceptance; see `docs/performance.md` for command, versions and results): production build served locally, mobile preset with **applied (`devtools`) throttling**, clean profile, **median of 5 runs** per URL; a single run is never evidence. Applied throttling is chosen because the default simulated (lantern) throttling models a localhost page as if every resource arrived before the real LCP and reports a misleadingly slow LCP; results are therefore a lab approximation of a throttled mobile device, not a field measurement. Any target missed by a hair is recorded as an explicit exception in `docs/performance.md`, never rounded away. Fonts via `next/font` (self-hosted, `display: swap`).

## 11. Testing strategy

- **Vitest (node):** locale negotiation, path helpers (incl. query/hash-preserving switch), dictionary parity and "no blank strings", content integrity, optional-field handling (absent email/role/rationale), JSON-LD builders, sitemap entries, token contrast, diacritic-insensitive search, readiness gaps.
- **Playwright:** run against the dev server for iteration and against a **verified production server** for acceptance (`npm run e2e:prod` builds, starts `next start` on its own port with `reuseExistingServer: false`, and a spec asserts the server is not `next dev`). Covers: hero `h1` painted (regression for the transparent-text bug), mobile menu (focus trap and return), no horizontal overflow at 320/390/768/1440, `<html lang>`, language switch keeping query + hash, localized 404 and asset-like 404, case studies with and without optional content, legacy links `/#projects` and `#stack`, 44 px touch targets on a coarse-pointer project, reduced motion (including hover and FAQ), **script-load failure leaves all content visible**, no-JS, axe.
- **Manual/MCP:** Lighthouse (medians), screenshots desktop/mobile × light/dark reviewed by the owner at Checkpoint 2, and a recorded keyboard/screen-reader checklist.

## 12. Owner inputs (do not guess)

Every row is **optional**: absent means the UI renders nothing for it. None has a default value. Draft wording for rows 1–3 is in the plan's Appendix A.

| Input | Used in | If missing |
|---|---|---|
| Public contact email | Contact primary action + copy button, palette "copy email", JSON-LD `email` | Telegram becomes the primary action; no email anywhere. (The owner's account email is *not* assumed to be public) |
| Role per project and scope (solo / team) | Case-study meta, project block | No "Role" row |
| Rationale and trade-offs for technical choices | Case-study "Why" / "Trade-off" rows | Choices are listed as facts only |
| Extra "Now" facts (e.g. what is being built this month) | Hero panel | Panel shows only evidenced facts + "Updated" date |
| Live/demo URL and repo URL per project | Work cards, case-study links | Link omitted |
| Real portrait photo (jpg/webp, ≥ 800 px) | About, JSON-LD `image` | Portrait column omitted |
| Which CV PDF to publish (two exist in `public/assets/`) | Contact | CV row omitted |

`npm run check:content` lists which of these are still empty.

## 13. Risks

- **Route restructure** touches every file → foundation (tests, routing, content split) comes first, with the 404/dynamic-root-layout behaviour verified on a real production build (Checkpoint 1) and a documented fallback.
- **Over-engineered first impression / generic look** → Checkpoint 2 puts hero + both project blocks in front of the owner (desktop/mobile, light/dark) before any other section is built; enhancements (palette, progress bar) come last and are droppable.
- **Satori (OG) Vietnamese glyphs** → bundle Inter latin + vietnamese `.woff`; verify by rendering and viewing the PNG.
- **`--webpack` flag** in `dev`/`build` scripts is pre-existing; left untouched.
- **Playwright browser download** may need network access in the sandbox; executor handles via `npx playwright install chromium`.
