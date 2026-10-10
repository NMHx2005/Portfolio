# Product Engineer Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a minimal, bilingual (vi/en) "Product engineer — web & mobile" site with locale URLs, case-study pages and a lean, CSS-first motion system, replacing the Dark-Aurora/GSAP design. A keyboard command palette and a scroll-progress bar are enhancements delivered last.

**Architecture:** Next.js 16 App Router. Content pages are prerendered per locale under `app/[locale]/…`; `proxy.ts` negotiates the locale per request (so this is *not* a static export). Language-neutral project facts live in `src/content/projects.ts`; copy lives in typed `vi.ts`/`en.ts` dictionaries consumed by **server** components. Client components are limited to theme, language switch (cookie + query/hash preservation), mobile nav, reveal observer, copy-email and (last) the command palette. Design tokens are CSS variables in `globals.css`, mapped into Tailwind 4 via `@theme inline`. Motion is CSS only, plus one `IntersectionObserver` that **arms itself before it hides anything**.

**Tech Stack:** Next.js 16.0.x · React 19.2 · TypeScript strict · Tailwind CSS 4 · next-themes · lucide-react · Inter + Geist Mono (`next/font`) · Vitest (unit) · Playwright + axe (e2e). **Removed:** gsap, @gsap/react, lenis, framer-motion, react-hook-form, @hookform/resolvers, zod.

**Spec:** `docs/superpowers/specs/2026-10-10-product-engineer-redesign-design.md`

## Delivery checkpoints (stop and verify at each)

| CP | Tasks | Deliverable | Gate to leave the checkpoint |
|---|---|---|---|
| **1 Foundation** | 0–7 | Branch, tooling, i18n, content model, SEO builders, tokens, routing + localized 404 **verified on a real production build** | `lint`, `tsc`, `npm test`, `npm run build`, routing + 404 e2e on the production build |
| **2 Visual review** | 8–11 | Header, hero, work section (both project blocks) | Screenshots at 1440/390 px × dark/light **approved by the owner** before any further section is built |
| **3 Complete site** | 12–15 | Case studies, services, about, process, FAQ, contact, footer | Full e2e on dev server; owner has answered Appendix A (or accepted that optional content stays absent) |
| **4 Enhancements & acceptance** | 16–20 | Sitemap/OG, progress bar + command palette, cleanup, acceptance e2e on the production build, Lighthouse | Acceptance table in Task 20 |

## Global Constraints

- Node 24 / npm 11. Next `16.0.x`, React `19.2.0`, Tailwind `^4`, TypeScript `strict: true`.
- Branch `redesign/product-engineer`. Never commit to `master`. **Stage explicit paths only** (never `git add -A` / `git add .`) and run `git diff --cached --stat` before every commit; the untracked `.crossweave/` must never be staged. Never merge or push without the owner.
- Commits: English, Conventional Commits, imperative. Append an attribution trailer **only if the executing harness specifies one** — never copy a trailer from this document.
- File deletions are allowed only in Task 7 (old root `layout.tsx`/`page.tsx`) and Task 18 (the listed files).
- No `any`, no `@ts-ignore`, no `eslint-disable` without a one-line reason. No `transition-all`. No `backdrop-blur`, glow or gradient text. Radius: `rounded-md`/`rounded-lg` (controls, tags), `rounded-xl` (images, cards); `rounded-full` only for the status dot.
- Fonts: sans = Inter (`latin`, `latin-ext`, `vietnamese`), mono = Geist Mono. **Mono only for ASCII, non-translated tokens.**
- Palette values exactly as in spec §4.1. One accent.
- **Motion rules:** all movement is gated by `prefers-reduced-motion` (CSS keyframes/transitions inside `no-preference`, Tailwind movement classes prefixed `motion-safe:`). Content is visible by default; it may be hidden **only** after the reveal script has armed itself (`html[data-reveal-ready]`). No GSAP/Lenis/Framer Motion. No infinite or looping animation.
- **Touch targets:** every interactive control is ≥ 44×44 px when `pointer: coarse` (use the `touch:` variant defined in `globals.css`); ≥ 24 px otherwise.
- **Content rule (no invented claims):** dictionaries contain only facts evidenced by the repository or by the owner's earlier site copy. Roles, rationale/trade-offs, "what I'm doing now" beyond those facts, and the public email are **optional** and absent until the owner approves them (Appendix A). Components render nothing for an absent optional field. Do not add a default value to make a field look filled.
- Locales `vi` (default), `en`; cookie `NEXT_LOCALE`; redirect status 307.
- Site URL always via `getSiteUrl()`. Sitemap `lastModified` = `siteConfig.contentUpdated`.
- **Legacy URLs keep working:** section ids stay `hero`, `projects`, `services`, `process`, `about`, `faq`, `contact`; the removed `#stack` anchors the "Technology" heading in About.
- Local gate per task: `npm run lint` · `npx tsc --noEmit` · `npm test`. Build gate at checkpoint ends: `npm run build`.

## Review Focus

1. **Odd/unprefixed paths:** `/`, `/vietnam` (starts with "vi", not a locale), `/vi/`, `/projects/hadi?utm=x` → redirect to the right locale path with the query preserved, never loop. *(Task 3 unit, Task 7 e2e.)*
2. **Garbage locale input:** cookie `NEXT_LOCALE=fr`, `Accept-Language: *`, `q=0`, empty header → next valid source, finally `vi`. *(Task 3.)*
3. **Missing owner inputs, including no email at all:** no portrait, links, CV, email, role or rationale → no broken `<img>`, no empty/`#` hrefs, no empty rows, and the Contact section still has a primary action. *(Tasks 11, 12, 13, 15 + Task 19.)*
4. **Vietnamese search without diacritics** in the palette. *(Task 17.)*
5. **No-JS, JS-load-failure and reduced motion:** all copy stays visible and readable. *(Task 19.)*
6. **Narrow screens / long Vietnamese strings:** no horizontal overflow at 320, 390, 768, 1440 px. *(Task 19.)*
7. **Old shared links:** `/#projects` and `/#stack` land on the right content, in a real browser, after the locale redirect. *(Task 19.)*
8. **Language switch keeps context:** `/vi?utm=x#faq` → `/en?utm=x#faq`. *(Task 3 unit, Task 9 e2e.)*

---

## Checkpoint 1 — Foundation (Tasks 0–7)

### Task 0: Branch and baseline

**Files:** none (environment only)

- [ ] **Step 1: Create the branch**

```bash
git checkout -b redesign/product-engineer
git status --short
```
Expected: branch switched; only `?? .crossweave/` listed.

- [ ] **Step 2: Install dependencies**

```bash
npm ci
```
Expected: installs without errors (lockfile present).

- [ ] **Step 3: Record the baseline gate**

```bash
npm run lint && npx tsc --noEmit && npm run build
```
Expected: all pass. If the baseline is already red, STOP and report the exact failure to the owner before changing anything (do not "fix forward" silently).

- [ ] **Step 4: Capture "before" screenshots (for the owner's comparison)**

Use the `run` skill or the chrome-devtools MCP: start `npm run dev`, screenshot `http://localhost:3000` at 1440×900 and 390×844 into `$TMPDIR/before-desktop.png` / `before-mobile.png`. No commit.

### Task 1: Hotfix the invisible hero role (optional, shippable alone)

> The rebuild removes this code. This task exists only so the **live** site stops hiding its positioning line while the rebuild is in progress. Skip if the rebuild will ship within days. It only *prepares* the fix on its own branch: the live site changes only after the owner merges and deploys it.

**Files:**
- Modify: `src/components/sections/hero-section.tsx:31-35` (role paragraph class)

- [ ] **Step 1: Branch from master for the hotfix**

```bash
git stash list   # must be empty
git checkout master && git checkout -b hotfix/hero-role
```

- [ ] **Step 2: Replace the gradient-text class on the role line**

In `hero-section.tsx`, change the `<p data-anim="role" …>` className from
`text-gradient-aurora text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl`
to
`text-2xl font-semibold tracking-tight text-primary sm:text-3xl md:text-4xl`.

Root cause being removed: `.text-gradient-aurora` sets `color: transparent` with `background-clip: text` on the parent while `splitWords` wraps each word in `inline-block` spans that do not inherit the clipped background.

- [ ] **Step 3: Verify visually and gate**

```bash
npm run lint && npx tsc --noEmit
```
Run `npm run dev`, confirm the role line is visible at 1440 px and 390 px.

- [ ] **Step 4: Commit and hand back**

```bash
git add src/components/sections/hero-section.tsx
git commit -m "fix: make hero role line visible by dropping gradient text on split words"
git checkout redesign/product-engineer
```
Tell the owner the hotfix branch is ready. The live site is fixed only after the owner merges it to `master` and deploys.



### Task 2: Test tooling

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (scripts + devDependencies)
- Modify: `.gitignore`
- Create: `src/lib/utils.test.ts`

- [ ] **Step 1: Install**

```bash
npm install -D vitest tsx @playwright/test @axe-core/playwright
```

- [ ] **Step 2: Add `vitest.config.ts`**

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
  },
});
```

- [ ] **Step 3: Add scripts to `package.json`**

Add under `"scripts"` (keep `dev`/`build`/`start`/`lint` unchanged):

```json
"test": "vitest run",
"test:watch": "vitest",
"typecheck": "tsc --noEmit",
"e2e": "playwright test",
"e2e:prod": "npm run build && E2E_PROD=1 playwright test",
"check:content": "tsx scripts/check-content.ts"
```

- [ ] **Step 4: Ignore test output**

Append to `.gitignore`:

```
# test output
/test-results/
/playwright-report/
```

- [ ] **Step 5: Write a first failing-then-passing test (proves the alias + runner work)**

`src/lib/utils.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges conflicting tailwind classes, last wins", () => {
    expect(cn("px-2 px-4", "text-fg")).toBe("px-4 text-fg");
  });
  it("drops falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});
```

- [ ] **Step 6: Run**

```bash
npm test
```
Expected: 2 passed.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts .gitignore src/lib/utils.test.ts
git commit -m "build: add vitest, playwright, axe and tsx for the redesign"
```

### Task 3: i18n core (config, negotiation, paths)

**Files:**
- Create: `src/lib/i18n/config.ts`
- Create: `src/lib/i18n/negotiate.ts`
- Create: `src/lib/i18n/paths.ts`
- Test: `src/lib/i18n/negotiate.test.ts`, `src/lib/i18n/paths.test.ts`

**Interfaces:**
- Produces: `locales`, `Locale`, `defaultLocale`, `LOCALE_COOKIE`, `isLocale(v)`, `localeLabels`, `ogLocales`; `pickLocale(cookie, acceptLanguage)`, `hasLocalePrefix(pathname)`, `resolveRedirect({pathname, search, cookie?, acceptLanguage?}): string | null`; `localePath(locale, path?)`, `projectPath(locale, slug)`, `switchLocalePath(pathname, target)`, `localeHref(pathname, search, hash, target)`.

- [ ] **Step 1: Write the failing tests**

`src/lib/i18n/negotiate.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { hasLocalePrefix, pickLocale, resolveRedirect } from "./negotiate";

describe("pickLocale", () => {
  it("prefers a valid cookie over the header", () => {
    expect(pickLocale("en", "vi")).toBe("en");
  });
  it("ignores an invalid cookie and uses the header", () => {
    expect(pickLocale("fr", "en-US,en;q=0.9")).toBe("en");
  });
  it("honours q-values regardless of order", () => {
    expect(pickLocale(undefined, "vi;q=0.5,en;q=0.9")).toBe("en");
  });
  it("skips q=0 entries", () => {
    expect(pickLocale(undefined, "en;q=0, vi;q=0.1")).toBe("vi");
  });
  it("falls back to vi for wildcard, unknown, empty and missing headers", () => {
    expect(pickLocale(undefined, "*")).toBe("vi");
    expect(pickLocale(undefined, "fr-FR,de;q=0.8")).toBe("vi");
    expect(pickLocale(undefined, "")).toBe("vi");
    expect(pickLocale(undefined, null)).toBe("vi");
  });
});

describe("hasLocalePrefix", () => {
  it("matches only whole segments", () => {
    expect(hasLocalePrefix("/vi")).toBe(true);
    expect(hasLocalePrefix("/vi/")).toBe(true);
    expect(hasLocalePrefix("/en/projects/hadi")).toBe(true);
    expect(hasLocalePrefix("/vietnam")).toBe(false);
    expect(hasLocalePrefix("/english")).toBe(false);
    expect(hasLocalePrefix("/")).toBe(false);
  });
});

describe("resolveRedirect", () => {
  it("redirects the root to the negotiated locale", () => {
    expect(resolveRedirect({ pathname: "/", search: "" })).toBe("/vi");
    expect(resolveRedirect({ pathname: "/", search: "", cookie: "en" })).toBe("/en");
  });
  it("preserves path and query string", () => {
    expect(
      resolveRedirect({ pathname: "/projects/hadi", search: "?utm=x", acceptLanguage: "en" }),
    ).toBe("/en/projects/hadi?utm=x");
  });
  it("treats /vietnam as an unprefixed path (no loop)", () => {
    expect(resolveRedirect({ pathname: "/vietnam", search: "" })).toBe("/vi/vietnam");
  });
  it("returns null when already prefixed", () => {
    expect(resolveRedirect({ pathname: "/vi/", search: "" })).toBeNull();
    expect(resolveRedirect({ pathname: "/en/projects/hadi", search: "?a=1" })).toBeNull();
  });
});
```

`src/lib/i18n/paths.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { localeHref, localePath, projectPath, switchLocalePath } from "./paths";

describe("paths", () => {
  it("builds locale and project paths", () => {
    expect(localePath("vi")).toBe("/vi");
    expect(localePath("en", "/projects/hadi")).toBe("/en/projects/hadi");
    expect(projectPath("vi", "hnwedding")).toBe("/vi/projects/hnwedding");
  });
  it("switches the locale segment and keeps the rest", () => {
    expect(switchLocalePath("/vi", "en")).toBe("/en");
    expect(switchLocalePath("/vi/projects/hadi", "en")).toBe("/en/projects/hadi");
    expect(switchLocalePath("/en/", "vi")).toBe("/vi/");
  });
  it("prefixes an unprefixed path", () => {
    expect(switchLocalePath("/", "en")).toBe("/en");
    expect(switchLocalePath("/foo", "en")).toBe("/en/foo");
  });
  it("keeps query string and hash when building the switched href", () => {
    expect(localeHref("/vi/projects/hadi", "?utm=x", "#faq", "en")).toBe("/en/projects/hadi?utm=x#faq");
    expect(localeHref("/vi", "", "", "en")).toBe("/en");
    expect(localeHref("/en", "?a=1&b=2", "", "vi")).toBe("/vi?a=1&b=2");
  });
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npx vitest run src/lib/i18n
```
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement**

`src/lib/i18n/config.ts`:

```ts
export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "vi";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeLabels: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

export const ogLocales: Record<Locale, string> = {
  vi: "vi_VN",
  en: "en_US",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "vi" || value === "en";
}
```

`src/lib/i18n/negotiate.ts`:

```ts
import { defaultLocale, isLocale, locales, type Locale } from "./config";

export function pickLocale(
  cookie: string | undefined,
  acceptLanguage: string | null | undefined,
): Locale {
  if (isLocale(cookie)) return cookie;
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const weight = q ? Number.parseFloat(q.slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), weight: Number.isNaN(weight) ? 0 : weight, index };
    })
    .filter((entry) => entry.tag !== "" && entry.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.index - b.index);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    const match = locales.find((locale) => locale === primary);
    if (match) return match;
  }
  return defaultLocale;
}

export function hasLocalePrefix(pathname: string): boolean {
  return locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

interface RedirectInput {
  pathname: string;
  search: string;
  cookie?: string;
  acceptLanguage?: string | null;
}

export function resolveRedirect({ pathname, search, cookie, acceptLanguage }: RedirectInput): string | null {
  if (hasLocalePrefix(pathname)) return null;
  const locale = pickLocale(cookie, acceptLanguage);
  const rest = pathname === "/" ? "" : pathname;
  return `/${locale}${rest}${search}`;
}
```

`src/lib/i18n/paths.ts`:

```ts
import { isLocale, type Locale } from "./config";

export function localePath(locale: Locale, path = ""): string {
  return `/${locale}${path}`;
}

export function projectPath(locale: Locale, slug: string): string {
  return localePath(locale, `/projects/${slug}`);
}

export function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  if (isLocale(segments[1])) {
    segments[1] = target;
    return segments.join("/");
  }
  return localePath(target, pathname === "/" ? "" : pathname);
}

/** Locale switch that keeps the visitor's context (query string and hash). */
export function localeHref(pathname: string, search: string, hash: string, target: Locale): string {
  return `${switchLocalePath(pathname, target)}${search}${hash}`;
}
```

- [ ] **Step 4: Run to verify pass**

```bash
npx vitest run src/lib/i18n
```
Expected: all pass.

- [ ] **Step 5: Gate + commit**

```bash
npm run lint && npx tsc --noEmit
git add src/lib/i18n
git commit -m "feat: add locale config, negotiation and path helpers"
```

### Task 4: Content model, shared project data, vi/en dictionaries

**Files:**
- Create: `src/content/types.ts`
- Create: `src/content/projects.ts`
- Create: `src/content/vi.ts`, `src/content/en.ts`
- Create: `src/content/dictionary.ts`
- Test: `src/content/content.test.ts`

> The old `src/content/index.ts` stays untouched until Task 18 (old components still import it). New modules use different file names, so there is no collision.
>
> **Content rule applied here:** every sentence below restates a fact from the repository or from the owner's earlier site copy. Rationale (`why`/`tradeoff`), `role`, and any extra "now" facts are *optional fields that are intentionally omitted*; Appendix A lists draft wording the owner can approve later. The only `why` present (HNWedding block editor) is the owner's own earlier problem statement.

**Interfaces:**
- Produces: `ProjectSlug`, `SectionId`, `Dictionary`, `ProjectCopy`, `TechnicalChoice`; `projectsData: Record<ProjectSlug, ProjectData>`, `projectSlugs: ProjectSlug[]`, `isProjectSlug(v): v is ProjectSlug`; `getDictionary(locale: Locale): Dictionary`.

- [ ] **Step 1: Write the failing tests**

`src/content/content.test.ts`:

```ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "./dictionary";
import { projectSlugs, projectsData } from "./projects";

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, shape(v)]),
    );
  }
  return typeof value;
}

describe("dictionaries", () => {
  it("vi and en have identical structure (keys, array lengths, value types)", () => {
    expect(shape(getDictionary("en"))).toEqual(shape(getDictionary("vi")));
  });

  it("never contains blank strings — optional fields are omitted, not emptied", () => {
    const walk = (v: unknown, path: string) => {
      if (typeof v === "string") expect(v.trim(), path).not.toBe("");
      else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
      else if (v && typeof v === "object")
        Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`));
    };
    for (const l of locales) walk(getDictionary(l), l);
  });

  it("nav ids match section ids that exist", () => {
    for (const l of locales) {
      const d = getDictionary(l);
      for (const item of d.nav) expect(d.sections[item.id]).toBeDefined();
    }
  });

  it("legacy section ids are preserved", () => {
    expect(Object.keys(getDictionary("vi").sections).sort()).toEqual(
      ["about", "contact", "faq", "process", "projects", "services"],
    );
  });
});

describe("projects", () => {
  it("every project has copy in every locale with at least 3 technical choices", () => {
    for (const l of locales) {
      const d = getDictionary(l);
      for (const slug of projectSlugs) {
        expect(d.work.items[slug], `${l}/${slug}`).toBeDefined();
        expect(d.work.items[slug].choices.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("optional rationale is either absent or non-blank, identically in both locales", () => {
    for (const slug of projectSlugs) {
      const vi = getDictionary("vi").work.items[slug].choices;
      const en = getDictionary("en").work.items[slug].choices;
      vi.forEach((choice, i) => {
        expect(Boolean(choice.why), `${slug}[${i}].why`).toBe(Boolean(en[i]?.why));
        expect(Boolean(choice.tradeoff), `${slug}[${i}].tradeoff`).toBe(Boolean(en[i]?.tradeoff));
      });
      expect(Boolean(getDictionary("vi").work.items[slug].role)).toBe(
        Boolean(getDictionary("en").work.items[slug].role),
      );
    }
  });

  it("cover images exist on disk", () => {
    for (const slug of projectSlugs) {
      const file = join(process.cwd(), "public", projectsData[slug].image.src);
      expect(existsSync(file), file).toBe(true);
    }
  });

  it("links, when present, are absolute https URLs", () => {
    for (const slug of projectSlugs) {
      for (const url of Object.values(projectsData[slug].links)) {
        if (url) expect(url).toMatch(/^https:\/\//);
      }
    }
  });

  it("metric keys all have a translated label", () => {
    for (const l of locales) {
      const d = getDictionary(l);
      for (const slug of projectSlugs)
        for (const m of projectsData[slug].metrics)
          expect(d.work.metricLabels[m.key], `${l}/${m.key}`).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npx vitest run src/content
```
Expected: FAIL — modules not found.

- [ ] **Step 3: Write `src/content/types.ts`**

```ts
export type SectionId = "projects" | "services" | "about" | "process" | "faq" | "contact";
export type ProjectSlug = "hnwedding" | "hadi";
export type ProjectKind = "web" | "mobile";
export type MetricKey = "themes" | "migrations" | "commits" | "languages" | "version";

export interface SectionHead {
  index: string;
  label: string;
  heading: string;
  lede?: string;
}

/** A technical fact about the project. `why`/`tradeoff` exist only when the owner has supplied them. */
export interface TechnicalChoice {
  title: string;
  why?: string;
  tradeoff?: string;
}

export interface ProjectCopy {
  title: string;
  category: string;
  summary: string;
  role?: string;
  status: string;
  problem: string;
  choices: TechnicalChoice[];
  flow: string[];
  services: { label: string; detail: string }[];
  shipped: string[];
  imageAlt: string;
}

export interface Dictionary {
  meta: { title: string; description: string };
  a11y: {
    skip: string;
    mainNav: string;
    openMenu: string;
    closeMenu: string;
    toggleTheme: string;
    switchLanguage: string;
    copyEmail: string;
    copied: string;
    copyFailed: string;
    backToTop: string;
  };
  nav: { id: SectionId; label: string }[];
  hero: {
    status: string;
    headline: string;
    intro: string;
    primaryCta: string;
    secondaryCta: string;
    nowTitle: string;
    updatedLabel: string;
    now: { label: string; value: string }[];
  };
  sections: Record<SectionId, SectionHead>;
  work: {
    viewCaseStudy: string;
    live: string;
    repository: string;
    metricLabels: Record<MetricKey, string>;
    items: Record<ProjectSlug, ProjectCopy>;
  };
  caseStudy: {
    back: string;
    role: string;
    platform: string;
    status: string;
    stack: string;
    links: string;
    problem: string;
    choices: string;
    why: string;
    tradeoff: string;
    architecture: string;
    flow: string;
    services: string;
    shipped: string;
    facts: string;
    next: string;
    previous: string;
    platforms: Record<ProjectKind, string>;
  };
  services: { items: { title: string; description: string; tags: string[] }[] };
  about: {
    paragraphs: string[];
    principlesLabel: string;
    principles: string[];
    skillsTitle: string;
    skillGroups: { name: string; items: string[] }[];
    portraitAlt: string;
  };
  process: { steps: { title: string; duration: string; description: string }[] };
  faq: { items: { q: string; a: string }[] };
  contact: {
    labels: Record<"email" | "telegram" | "phone" | "github" | "cv", string>;
    response: string;
  };
  palette: {
    open: string;
    placeholder: string;
    empty: string;
    groups: { sections: string; projects: string; actions: string };
    actions: { copyEmail: string; github: string; switchLanguage: string; toggleTheme: string };
    hint: string;
  };
  footer: { tagline: string; note: string };
  notFound: { title: string; text: string; cta: string };
}
```

- [ ] **Step 4: Write `src/content/projects.ts`** (language-neutral facts only)

```ts
import type { MetricKey, ProjectKind, ProjectSlug } from "./types";

export interface ProjectData {
  slug: ProjectSlug;
  kind: ProjectKind;
  stack: string[];
  links: { live?: string; repo?: string };
  image: { src: string; width: number; height: number };
  metrics: { key: MetricKey; value: string }[];
}

export const projectSlugs: ProjectSlug[] = ["hnwedding", "hadi"];

export function isProjectSlug(value: string): value is ProjectSlug {
  return (projectSlugs as string[]).includes(value);
}

export const projectsData: Record<ProjectSlug, ProjectData> = {
  hnwedding: {
    slug: "hnwedding",
    kind: "web",
    stack: ["Next.js 16", "TypeScript", "Prisma 7", "PostgreSQL", "Auth.js", "PayOS", "Cloudflare R2", "Resend"],
    links: {},
    image: { src: "/projects/hnwedding-cover.png", width: 1280, height: 960 },
    metrics: [
      { key: "themes", value: "4+" },
      { key: "migrations", value: "16" },
      { key: "commits", value: "159+" },
    ],
  },
  hadi: {
    slug: "hadi",
    kind: "mobile",
    stack: ["React Native", "Expo", "TypeScript", "Firebase", "Soniox", "Gemini", "SQLite"],
    links: {},
    image: { src: "/projects/hadi-cover.png", width: 1280, height: 960 },
    metrics: [
      { key: "languages", value: "3" },
      { key: "version", value: "V6" },
      { key: "commits", value: "332+" },
    ],
  },
};
```

- [ ] **Step 5: Write `src/content/vi.ts`**

```ts
import type { Dictionary } from "./types";

export const vi: Dictionary = {
  meta: {
    title: "Nguyễn Mạnh Hùng — Product Engineer (Web & Mobile)",
    description:
      "Product engineer tại Hà Nội, xây sản phẩm web và mobile bằng React, Next.js, React Native và Node.js. Đang nhận dự án freelance.",
  },
  a11y: {
    skip: "Bỏ qua, tới nội dung chính",
    mainNav: "Điều hướng chính",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
    toggleTheme: "Đổi giao diện sáng/tối",
    switchLanguage: "Đổi ngôn ngữ",
    copyEmail: "Sao chép email",
    copied: "Đã sao chép",
    copyFailed: "Không sao chép được",
    backToTop: "Lên đầu trang",
  },
  nav: [
    { id: "projects", label: "Dự án" },
    { id: "services", label: "Dịch vụ" },
    { id: "about", label: "Về mình" },
    { id: "contact", label: "Liên hệ" },
  ],
  hero: {
    status: "Đang nhận dự án · Hà Nội, UTC+7",
    headline: "Product engineer xây sản phẩm web và mobile.",
    intro:
      "Mình là Nguyễn Mạnh Hùng. Mình xây sản phẩm web và mobile rồi đưa chúng vào production — hiện đang nhận dự án freelance.",
    primaryCta: "Xem dự án",
    secondaryCta: "Liên hệ",
    nowTitle: "Hiện tại",
    updatedLabel: "Cập nhật",
    now: [
      { label: "Đã ra mắt", value: "HNWedding và Hadi — đang chạy production" },
      { label: "Đang học", value: "Công nghệ thông tin, Đại học Mở Hà Nội" },
    ],
  },
  sections: {
    projects: {
      index: "01",
      label: "Dự án",
      heading: "Sản phẩm đã ra mắt",
      lede: "Hai sản phẩm đang chạy thật ngoài production. Mở case study để xem bài toán và các lựa chọn kỹ thuật.",
    },
    services: {
      index: "02",
      label: "Dịch vụ",
      heading: "Mình có thể giúp gì",
      lede: "Bốn loại việc mình nhận thường xuyên. Không thấy thứ bạn cần? Cứ nhắn, mình sẽ trả lời thật.",
    },
    about: {
      index: "03",
      label: "Về mình",
      heading: "Một người làm web hiểu cả code lẫn UX",
    },
    process: {
      index: "04",
      label: "Quy trình",
      heading: "Cách mình làm việc",
      lede: "Quy trình 5 bước rõ ràng. Bạn biết chính xác đang ở đâu và sắp có gì.",
    },
    faq: {
      index: "05",
      label: "FAQ",
      heading: "Câu hỏi thường gặp",
      lede: "Những điều khách hay hỏi nhất trước khi bắt đầu.",
    },
    contact: {
      index: "06",
      label: "Liên hệ",
      heading: "Hãy nói chuyện với mình",
      lede: "Sẵn sàng nhận dự án mới. Chọn kênh tiện nhất với bạn, mình sẽ trả lời trong vòng 24 giờ.",
    },
  },
  work: {
    viewCaseStudy: "Xem case study",
    live: "Xem sản phẩm",
    repository: "Mã nguồn",
    metricLabels: {
      themes: "theme thiệp",
      migrations: "DB migration",
      commits: "commit",
      languages: "ngôn ngữ",
      version: "phiên bản",
    },
    items: {
      hnwedding: {
        title: "HNWedding",
        category: "Thiệp cưới điện tử · Agency platform",
        summary:
          "Nền tảng vận hành kiểu agency: khách đặt đơn công khai, đội ngũ dựng thiệp bằng block editor riêng rồi xuất bản tại /thiep/[slug].",
        status: "Đang chạy production",
        problem:
          "Các cặp đôi muốn thiệp cưới online đẹp, cá nhân hóa theo câu chuyện riêng. Công cụ kéo-thả có sẵn không đủ tinh tế, còn thuê dev riêng cho từng thiệp thì không mở rộng được.",
        choices: [
          {
            title: "Block editor riêng để đội ngũ dựng và xuất bản thiệp",
            why: "Công cụ kéo-thả có sẵn không đủ tinh tế, còn thuê dev riêng cho từng thiệp thì không mở rộng được.",
          },
          { title: "Next.js 16 App Router + Prisma 7 + Supabase PostgreSQL, TypeScript strict" },
          { title: "Thanh toán VietQR/PayOS" },
          { title: "Ảnh lưu trên Cloudflare R2, email tự động qua Resend" },
        ],
        flow: ["Khách đặt đơn công khai", "Admin dựng thiệp bằng block editor", "Xuất bản tại /thiep/[slug]"],
        services: [
          { label: "Dữ liệu", detail: "Prisma 7 trên Supabase PostgreSQL" },
          { label: "Đăng nhập", detail: "Auth.js" },
          { label: "Thanh toán", detail: "VietQR / PayOS" },
          { label: "Ảnh", detail: "Cloudflare R2" },
          { label: "Email", detail: "Resend" },
        ],
        shipped: [
          "Luồng đặt đơn công khai → admin dựng và xuất bản thiệp qua block editor riêng.",
          "4+ theme thiệp dựng sẵn (Gold Philosopher, Sage Classic, Wing Door…).",
          "Thanh toán VietQR/PayOS, email tự động qua Resend.",
          "Đang chạy production.",
        ],
        imageAlt: "Giao diện nền tảng thiệp cưới HNWedding",
      },
      hadi: {
        title: "Hadi",
        category: "Ứng dụng di động · React Native",
        summary:
          "App stream phụ đề dịch hai chiều Hàn/Nhật ↔ Việt theo thời gian thực, lưu offline-first rồi đồng bộ Firestore sau buổi học.",
        status: "Đang chạy production",
        problem:
          "Người học tiếng Hàn, Nhật cần phụ đề dịch theo thời gian thực trong buổi giảng kèm ghi chú có mốc thời gian. Đa số app dịch giọng nói chỉ hỗ trợ một chiều, độ trễ cao hoặc không lưu lại được bài học.",
        choices: [
          { title: "WebSocket thô tới Soniox stt-rt-v5, không dùng SDK; stream hai chiều Hàn/Nhật ↔ Việt trên cùng một socket" },
          { title: "Dịch hybrid qua Cloud Functions: Gemini 3.5 Flash-Lite → Gemini 3.6 Flash → Claude (fallback)" },
          { title: "Offline-first: lưu bằng expo-sqlite, đồng bộ Firestore đa thiết bị sau buổi học" },
          { title: "Đăng nhập Apple/Email qua Firebase Auth, theo Apple HIG" },
        ],
        flow: [
          "Giọng nói",
          "Soniox stt-rt-v5 (WebSocket)",
          "Cloud Functions: Gemini → Claude fallback",
          "Phụ đề song ngữ realtime",
          "expo-sqlite (offline)",
          "Đồng bộ Firestore",
        ],
        services: [
          { label: "Lưu trữ cục bộ", detail: "expo-sqlite" },
          { label: "Đồng bộ", detail: "Firestore" },
          { label: "Xác thực", detail: "Firebase Auth (Apple, Email)" },
        ],
        shipped: [
          "Phụ đề song ngữ realtime Hàn/Nhật ↔ Việt trên cùng một socket.",
          "Lưu offline-first bằng expo-sqlite, đồng bộ Firestore đa thiết bị.",
          "Đăng nhập Apple/Email qua Firebase Auth, theo Apple HIG.",
          "Đang chạy production, phiên bản V6.",
        ],
        imageAlt: "Giao diện ứng dụng dịch bài giảng Hadi",
      },
    },
  },
  caseStudy: {
    back: "Tất cả dự án",
    role: "Vai trò",
    platform: "Nền tảng",
    status: "Trạng thái",
    stack: "Công nghệ",
    links: "Liên kết",
    problem: "Bài toán",
    choices: "Lựa chọn kỹ thuật",
    why: "Lý do",
    tradeoff: "Đánh đổi",
    architecture: "Kiến trúc",
    flow: "Luồng chính",
    services: "Dịch vụ hỗ trợ",
    shipped: "Đã bàn giao",
    facts: "Thông tin thêm",
    next: "Dự án tiếp theo",
    previous: "Dự án trước",
    platforms: { web: "Web", mobile: "Mobile" },
  },
  services: {
    items: [
      {
        title: "Sản phẩm web",
        description: "SaaS, dashboard và hệ thống nội bộ: frontend, API, database, đăng nhập và trang quản trị.",
        tags: ["Next.js", "TypeScript", "PostgreSQL", "Auth"],
      },
      {
        title: "Ứng dụng di động",
        description: "App React Native/Expo chạy offline-first, đồng bộ nhiều thiết bị, tích hợp realtime và AI.",
        tags: ["React Native", "Expo", "SQLite", "Firebase"],
      },
      {
        title: "Website và cửa hàng online",
        description: "Landing page, website giới thiệu và cửa hàng: chuẩn SEO, mobile-first, thanh toán và quản lý đơn hàng.",
        tags: ["Next.js", "SEO", "Payments"],
      },
      {
        title: "Nâng cấp và bảo trì",
        description: "Refactor, tối ưu hiệu năng và SEO, content editor riêng, bảo trì hàng tháng cho website đang chạy.",
        tags: ["Performance", "SEO", "Maintenance"],
      },
    ],
  },
  about: {
    paragraphs: [
      "Mình là Hùng, product engineer ở Hà Nội. Mình làm full-stack: từ database và API đến giao diện, rồi đưa lên production.",
      "Mình là sinh viên Công nghệ thông tin tại Đại học Mở Hà Nội, đã làm web full-stack được vài năm và đang nhận dự án freelance.",
      "Mình thích những thứ chạy nhanh, nhìn đẹp và làm xong rồi vẫn còn dùng tốt 5 năm sau. Nếu bạn cần một người làm web hiểu cả code lẫn UX, hãy nhắn mình.",
    ],
    principlesLabel: "Nguyên tắc",
    principles: ["Clean code", "User-first", "Ship on time"],
    skillsTitle: "Công nghệ",
    skillGroups: [
      { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Material-UI", "Framer Motion", "GSAP"] },
      { name: "Mobile", items: ["React Native", "Expo", "expo-sqlite"] },
      {
        name: "Backend & dữ liệu",
        items: ["Node.js", "Express", "PostgreSQL", "Prisma", "MongoDB", "MySQL", "Socket.io", "Firebase", "Auth.js", "JWT"],
      },
      { name: "Hạ tầng & công cụ", items: ["Vercel", "Supabase", "Cloudflare R2", "Git", "GitHub", "Postman", "Figma"] },
    ],
    portraitAlt: "Chân dung Nguyễn Mạnh Hùng",
  },
  process: {
    steps: [
      { title: "Discovery", duration: "1–2 ngày", description: "Nghe yêu cầu, xác định phạm vi, sản phẩm bàn giao và báo giá. Không tính phí." },
      { title: "Design & Plan", duration: "3–5 ngày", description: "Wireframe, mockup và kế hoạch kỹ thuật. Bạn duyệt rồi mới code." },
      { title: "Build", duration: "Theo phạm vi", description: "Code, demo từng tuần, phản hồi liên tục. Không bao giờ biến mất." },
      { title: "Launch", duration: "1–2 ngày", description: "Deploy, domain, SEO cơ bản, hướng dẫn quản trị. Sẵn sàng đón khách." },
      { title: "Support", duration: "30 ngày miễn phí", description: "Sửa lỗi, hướng dẫn. Sau đó có gói bảo trì hàng tháng nếu cần." },
    ],
  },
  faq: {
    items: [
      { q: "Một sản phẩm tốn bao lâu để làm xong?", a: "Landing page: 1–2 tuần. Web app: 1–3 tháng tùy phạm vi. Mình sẽ báo timeline cụ thể sau buổi Discovery." },
      { q: "Chi phí trung bình bao nhiêu?", a: "Phụ thuộc phạm vi. Landing page khởi đầu từ vài triệu, web app từ vài chục triệu. Nhắn mình để báo giá cụ thể cho dự án của bạn." },
      { q: "Bạn có nhận khách ngoài Hà Nội hoặc nước ngoài không?", a: "Có. Mình làm việc remote toàn bộ, họp qua Zoom/Google Meet, trao đổi qua email/Zalo/Slack tùy bạn quen." },
      { q: "Có hỗ trợ sau khi launch không?", a: "30 ngày đầu miễn phí sửa lỗi. Sau đó có gói bảo trì hàng tháng nếu bạn muốn mình duy trì lâu dài." },
      { q: "Bạn dùng công nghệ gì? Tôi có cần biết code không?", a: "Mặc định React + Next.js cho frontend, Node.js cho backend, React Native (Expo) cho app di động. Bạn không cần biết code — mình giải thích bằng ngôn ngữ thường ngày." },
      { q: "Tôi đã có website cũ, bạn nâng cấp được không?", a: "Được, miễn là không bị khóa vào nền tảng đóng (Wix, Squarespace). Mình audit miễn phí trước khi báo giá." },
      { q: "Thanh toán theo dạng nào?", a: "Thường chia 3 đợt: 30% khi ký, 40% giữa dự án (demo ổn), 30% khi bàn giao. Chuyển khoản Việt Nam hoặc Wise cho khách nước ngoài." },
      { q: "Tôi có sở hữu mã nguồn sau khi xong không?", a: "Có. Sau khi thanh toán đủ, mã nguồn thuộc về bạn 100%, kèm hướng dẫn deploy và chỉnh sửa." },
    ],
  },
  contact: {
    labels: { email: "Email", telegram: "Telegram", phone: "Điện thoại", github: "GitHub", cv: "Tải CV" },
    response: "Trả lời trong vòng 24 giờ",
  },
  palette: {
    open: "Mở bảng lệnh",
    placeholder: "Tìm mục, dự án hoặc hành động…",
    empty: "Không có kết quả",
    groups: { sections: "Mục", projects: "Dự án", actions: "Hành động" },
    actions: {
      copyEmail: "Sao chép email",
      github: "Mở GitHub",
      switchLanguage: "Switch to English",
      toggleTheme: "Đổi giao diện sáng/tối",
    },
    hint: "↑↓ chọn · Enter mở · Esc đóng",
  },
  footer: {
    tagline: "Sẵn sàng cho dự án mới.",
    note: "© 2026 Nguyễn Mạnh Hùng. Xây dựng tại Hà Nội bằng Next.js.",
  },
  notFound: {
    title: "Không tìm thấy trang",
    text: "Đường dẫn này không tồn tại hoặc đã được chuyển đi.",
    cta: "Về trang chủ",
  },
};
```

- [ ] **Step 6: Write `src/content/en.ts`**

```ts
import type { Dictionary } from "./types";

export const en: Dictionary = {
  meta: {
    title: "Nguyễn Mạnh Hùng — Product Engineer (Web & Mobile)",
    description:
      "Product engineer in Hanoi building web and mobile products with React, Next.js, React Native and Node.js. Open to freelance projects.",
  },
  a11y: {
    skip: "Skip to main content",
    mainNav: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toggleTheme: "Toggle light/dark theme",
    switchLanguage: "Change language",
    copyEmail: "Copy email",
    copied: "Copied",
    copyFailed: "Could not copy",
    backToTop: "Back to top",
  },
  nav: [
    { id: "projects", label: "Work" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ],
  hero: {
    status: "Open to freelance · Hanoi, UTC+7",
    headline: "Product engineer building web and mobile products.",
    intro:
      "I'm Nguyễn Mạnh Hùng. I build web and mobile products and ship them to production — currently open to freelance work.",
    primaryCta: "View work",
    secondaryCta: "Get in touch",
    nowTitle: "Now",
    updatedLabel: "Updated",
    now: [
      { label: "Shipped", value: "HNWedding and Hadi — live in production" },
      { label: "Studying", value: "Information Technology, Hanoi Open University" },
    ],
  },
  sections: {
    projects: {
      index: "01",
      label: "Work",
      heading: "Shipped products",
      lede: "Two products running in production. Open a case study for the problem and the technical choices.",
    },
    services: {
      index: "02",
      label: "Services",
      heading: "How I can help",
      lede: "Four kinds of work I take on regularly. Don't see what you need? Send a message — I'll give you an honest answer.",
    },
    about: {
      index: "03",
      label: "About",
      heading: "A developer who understands both code and UX",
    },
    process: {
      index: "04",
      label: "Process",
      heading: "How I work",
      lede: "A clear 5-step process. You always know where we are and what's next.",
    },
    faq: {
      index: "05",
      label: "FAQ",
      heading: "Frequently asked questions",
      lede: "The questions clients ask most before we start.",
    },
    contact: {
      index: "06",
      label: "Contact",
      heading: "Let's talk",
      lede: "Available for new projects. Pick the channel that suits you — I reply within 24 hours.",
    },
  },
  work: {
    viewCaseStudy: "Read case study",
    live: "Visit product",
    repository: "Source code",
    metricLabels: {
      themes: "invitation themes",
      migrations: "DB migrations",
      commits: "commits",
      languages: "languages",
      version: "version",
    },
    items: {
      hnwedding: {
        title: "HNWedding",
        category: "Wedding invitations · Agency platform",
        summary:
          "An agency-operated platform: customers submit an order publicly, the team builds the invitation in a custom block editor and publishes it at /thiep/[slug].",
        status: "Live in production",
        problem:
          "Couples want a beautiful, personalized online wedding invitation. Off-the-shelf drag-and-drop builders aren't refined enough, and hiring a developer per couple doesn't scale.",
        choices: [
          {
            title: "A custom block editor for the team to build and publish invitations",
            why: "Off-the-shelf drag-and-drop builders aren't refined enough, and hiring a developer per couple doesn't scale.",
          },
          { title: "Next.js 16 App Router + Prisma 7 + Supabase PostgreSQL, strict TypeScript" },
          { title: "Payments through VietQR/PayOS" },
          { title: "Images on Cloudflare R2, automated email via Resend" },
        ],
        flow: ["Customer submits an order", "Admin builds the invitation in the block editor", "Published at /thiep/[slug]"],
        services: [
          { label: "Data", detail: "Prisma 7 on Supabase PostgreSQL" },
          { label: "Auth", detail: "Auth.js" },
          { label: "Payments", detail: "VietQR / PayOS" },
          { label: "Images", detail: "Cloudflare R2" },
          { label: "Email", detail: "Resend" },
        ],
        shipped: [
          "Public order intake → admin builds and publishes invitations through a custom block editor.",
          "4+ ready-made invitation themes (Gold Philosopher, Sage Classic, Wing Door…).",
          "VietQR/PayOS payments, automated email via Resend.",
          "Live in production.",
        ],
        imageAlt: "HNWedding wedding invitation platform interface",
      },
      hadi: {
        title: "Hadi",
        category: "Mobile app · React Native",
        summary:
          "An app that streams two-way Korean/Japanese ↔ Vietnamese subtitles in real time, stores sessions offline-first and syncs to Firestore after each lecture.",
        status: "Live in production",
        problem:
          "Students learning Korean or Japanese need real-time translated subtitles during lectures, with timestamped notes. Most speech-translation apps are one-directional, laggy, or don't save the session.",
        choices: [
          { title: "A raw WebSocket to Soniox stt-rt-v5 with no SDK; two-way Korean/Japanese ↔ Vietnamese streaming on a single socket" },
          { title: "Hybrid translation through Cloud Functions: Gemini 3.5 Flash-Lite → Gemini 3.6 Flash → Claude fallback" },
          { title: "Offline-first: stored with expo-sqlite, synced to Firestore across devices after each session" },
          { title: "Apple/Email sign-in through Firebase Auth, following Apple HIG" },
        ],
        flow: [
          "Speech",
          "Soniox stt-rt-v5 (WebSocket)",
          "Cloud Functions: Gemini → Claude fallback",
          "Real-time bilingual subtitles",
          "expo-sqlite (offline)",
          "Firestore sync",
        ],
        services: [
          { label: "Local storage", detail: "expo-sqlite" },
          { label: "Sync", detail: "Firestore" },
          { label: "Auth", detail: "Firebase Auth (Apple, Email)" },
        ],
        shipped: [
          "Real-time bilingual Korean/Japanese ↔ Vietnamese subtitles on a single socket.",
          "Offline-first storage with expo-sqlite and multi-device sync via Firestore.",
          "Apple/Email sign-in through Firebase Auth, following Apple HIG.",
          "Live in production, version V6.",
        ],
        imageAlt: "Hadi lecture translation app interface",
      },
    },
  },
  caseStudy: {
    back: "All work",
    role: "Role",
    platform: "Platform",
    status: "Status",
    stack: "Stack",
    links: "Links",
    problem: "The problem",
    choices: "Technical choices",
    why: "Why",
    tradeoff: "Trade-off",
    architecture: "Architecture",
    flow: "Main flow",
    services: "Supporting services",
    shipped: "What shipped",
    facts: "More facts",
    next: "Next project",
    previous: "Previous project",
    platforms: { web: "Web", mobile: "Mobile" },
  },
  services: {
    items: [
      {
        title: "Web products",
        description: "SaaS, dashboards and internal tools: frontend, API, database, authentication and an admin panel.",
        tags: ["Next.js", "TypeScript", "PostgreSQL", "Auth"],
      },
      {
        title: "Mobile apps",
        description: "React Native/Expo apps that work offline-first, sync across devices and integrate realtime and AI.",
        tags: ["React Native", "Expo", "SQLite", "Firebase"],
      },
      {
        title: "Websites and online stores",
        description: "Landing pages, marketing sites and shops: SEO-ready, mobile-first, with payments and order management.",
        tags: ["Next.js", "SEO", "Payments"],
      },
      {
        title: "Upgrades and maintenance",
        description: "Refactoring, performance and SEO work, custom content editors and monthly maintenance for live sites.",
        tags: ["Performance", "SEO", "Maintenance"],
      },
    ],
  },
  about: {
    paragraphs: [
      "I'm Hùng, a product engineer in Hanoi. I work full-stack: from the database and API to the interface, and then into production.",
      "I'm an Information Technology student at Hanoi Open University, have been building full-stack websites for a few years, and take freelance projects.",
      "I like things that load fast, look beautiful, and still work great five years later. If you want a developer who understands both the code and the user, drop me a message.",
    ],
    principlesLabel: "Principles",
    principles: ["Clean code", "User-first", "Ship on time"],
    skillsTitle: "Technology",
    skillGroups: [
      { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Material-UI", "Framer Motion", "GSAP"] },
      { name: "Mobile", items: ["React Native", "Expo", "expo-sqlite"] },
      {
        name: "Backend & data",
        items: ["Node.js", "Express", "PostgreSQL", "Prisma", "MongoDB", "MySQL", "Socket.io", "Firebase", "Auth.js", "JWT"],
      },
      { name: "Infra & tools", items: ["Vercel", "Supabase", "Cloudflare R2", "Git", "GitHub", "Postman", "Figma"] },
    ],
    portraitAlt: "Portrait of Nguyễn Mạnh Hùng",
  },
  process: {
    steps: [
      { title: "Discovery", duration: "1–2 days", description: "Listen to requirements, define scope, deliverables and a quote. Free of charge." },
      { title: "Design & Plan", duration: "3–5 days", description: "Wireframes, mockups and a technical plan. You approve before code starts." },
      { title: "Build", duration: "Scope-dependent", description: "Code, weekly demos, continuous feedback. I never go dark." },
      { title: "Launch", duration: "1–2 days", description: "Deploy, domain, SEO basics, admin handover. Ready for customers." },
      { title: "Support", duration: "30 days free", description: "Bug fixes and guidance. Optional monthly maintenance after that." },
    ],
  },
  faq: {
    items: [
      { q: "How long does a product take?", a: "Landing page: 1–2 weeks. Web app: 1–3 months depending on scope. I'll give you a concrete timeline after Discovery." },
      { q: "What does it cost on average?", a: "Depends on scope. Landing pages start from a few million VND, web apps from tens of millions. Send a message and I'll quote your specific project." },
      { q: "Do you work with clients outside Hanoi or overseas?", a: "Yes. I work fully remote — calls on Zoom/Google Meet, async over email/Zalo/Slack, whichever you prefer." },
      { q: "Do you support the product after launch?", a: "The first 30 days of bug fixes are free. After that there's an optional monthly maintenance package if you want me long-term." },
      { q: "What tech do you use? Do I need to know code?", a: "By default React + Next.js for the frontend, Node.js for the backend, React Native (Expo) for mobile apps. You don't need to know code — I explain in everyday language." },
      { q: "I already have a site. Can you upgrade it?", a: "Yes, as long as it isn't locked into a closed platform (Wix, Squarespace). I audit it for free before quoting." },
      { q: "How does payment work?", a: "Usually three milestones: 30% on signing, 40% mid-project (working demo), 30% on handover. Vietnamese bank transfer, or Wise for international clients." },
      { q: "Do I own the source code?", a: "Yes. After full payment the source code is 100% yours, handed over with deployment and editing guides." },
    ],
  },
  contact: {
    labels: { email: "Email", telegram: "Telegram", phone: "Phone", github: "GitHub", cv: "Download CV" },
    response: "Replies within 24 hours",
  },
  palette: {
    open: "Open command palette",
    placeholder: "Search sections, projects or actions…",
    empty: "No results",
    groups: { sections: "Sections", projects: "Projects", actions: "Actions" },
    actions: {
      copyEmail: "Copy email",
      github: "Open GitHub",
      switchLanguage: "Chuyển sang Tiếng Việt",
      toggleTheme: "Toggle light/dark theme",
    },
    hint: "↑↓ select · Enter open · Esc close",
  },
  footer: {
    tagline: "Ready for your next project.",
    note: "© 2026 Nguyễn Mạnh Hùng. Built in Hanoi with Next.js.",
  },
  notFound: {
    title: "Page not found",
    text: "This link doesn't exist or has moved.",
    cta: "Back to home",
  },
};
```

- [ ] **Step 7: Write `src/content/dictionary.ts`**

```ts
import type { Locale } from "@/lib/i18n/config";
import { en } from "./en";
import type { Dictionary } from "./types";
import { vi } from "./vi";

const dictionaries: Record<Locale, Dictionary> = { vi, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
```

- [ ] **Step 8: Run to verify pass**

```bash
npx vitest run src/content
```
Expected: all pass (the blank-string test passes because `about` has no `lede` key at all).

- [ ] **Step 9: Gate + commit**

```bash
npm run lint && npx tsc --noEmit
git add src/content/types.ts src/content/projects.ts src/content/vi.ts src/content/en.ts src/content/dictionary.ts src/content/content.test.ts
git diff --cached --stat
git commit -m "feat: add typed vi/en dictionaries and shared project data (facts only)"
```

### Task 5: Site config, site URL, metadata and JSON-LD builders

**Files:**
- Modify: `src/config/site.ts` (full rewrite)
- Create: `src/lib/site-url.ts`
- Create: `src/lib/seo.ts`
- Create: `src/lib/sitemap-entries.ts`
- Test: `src/lib/site-url.test.ts`, `src/lib/seo.test.ts`, `src/lib/sitemap-entries.test.ts`

> `src/config/site.ts` is imported by the old `layout.tsx`, `robots.ts`, `sitemap.ts` (replaced in Tasks 7 and 17). To keep the build green in between, **keep the old exports** (`siteConfig.name/description/url/ogImage/keywords/authors/creator/twitter`) and add the new fields next to them; Task 18 removes the unused old fields.

**Interfaces:**
- Produces: `siteConfig` (adds `jobTitle`, `contentUpdated`, `contact`, `portrait`, `heroStack`); `getSiteUrl(): string`; `absoluteUrl(path)`, `alternatesFor`, `homeMetadata(locale)`, `projectMetadata(locale, slug)`, `personJsonLd(locale)`, `websiteJsonLd(locale)`, `projectJsonLd(locale, slug)`, `serializeJsonLd(obj)`; `sitemapEntries()`.

- [ ] **Step 1: Write the failing tests**

`src/lib/site-url.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "./site-url";

afterEach(() => vi.unstubAllEnvs());

describe("getSiteUrl", () => {
  it("falls back to the configured url", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl()).toBe("https://www.nmhx.info");
  });
  it("uses the env override and strips trailing slashes", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.com//");
    expect(getSiteUrl()).toBe("https://preview.example.com");
  });
});
```

`src/lib/seo.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import {
  absoluteUrl,
  alternatesFor,
  homeMetadata,
  personJsonLd,
  projectJsonLd,
  projectMetadata,
  serializeJsonLd,
} from "./seo";

describe("alternatesFor", () => {
  it("emits self-canonical plus hreflang for both locales and x-default=vi", () => {
    const alt = alternatesFor("en", (l) => `/${l}`);
    expect(alt.canonical).toBe(absoluteUrl("/en"));
    expect(alt.languages).toEqual({
      vi: absoluteUrl("/vi"),
      en: absoluteUrl("/en"),
      "x-default": absoluteUrl("/vi"),
    });
  });
});

describe("metadata", () => {
  it("home metadata is localized and self-canonical", () => {
    const m = homeMetadata("vi");
    expect(m.alternates?.canonical).toBe(absoluteUrl("/vi"));
    expect(m.openGraph).toMatchObject({ locale: "vi_VN", url: absoluteUrl("/vi") });
  });
  it("project metadata points at the project path in each locale", () => {
    const m = projectMetadata("en", "hadi");
    expect(m.alternates?.canonical).toBe(absoluteUrl("/en/projects/hadi"));
    expect(m.alternates?.languages).toMatchObject({ vi: absoluteUrl("/vi/projects/hadi") });
    expect(String(m.title)).toContain("Hadi");
  });
});

describe("json-ld", () => {
  it("person has Product Engineer and omits image when no portrait is configured", () => {
    const p = personJsonLd("vi") as Record<string, unknown>;
    expect(p["@type"]).toBe("Person");
    expect(p.jobTitle).toBe("Product Engineer");
    expect("image" in p).toBe(false);
    expect("email" in p).toBe(siteConfig.contact.email !== null);
  });
  it("project json-ld references the localized url", () => {
    const g = projectJsonLd("en", "hnwedding") as { "@graph": Record<string, unknown>[] };
    const creative = g["@graph"].find((n) => n["@type"] === "CreativeWork");
    expect(creative?.url).toBe(absoluteUrl("/en/projects/hnwedding"));
  });
  it("serialization escapes < so a value can never close the script tag", () => {
    expect(serializeJsonLd({ a: "</script><b>" })).not.toContain("</script>");
  });
});
```

`src/lib/sitemap-entries.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { absoluteUrl } from "./seo";
import { sitemapEntries } from "./sitemap-entries";

describe("sitemapEntries", () => {
  const entries = sitemapEntries();

  it("lists home + every project for every locale", () => {
    expect(entries.map((e) => e.url).sort()).toEqual(
      [
        "/en",
        "/en/projects/hadi",
        "/en/projects/hnwedding",
        "/vi",
        "/vi/projects/hadi",
        "/vi/projects/hnwedding",
      ].map(absoluteUrl),
    );
  });
  it("carries hreflang alternates and a stable lastModified", () => {
    const home = entries.find((e) => e.url === absoluteUrl("/vi"));
    expect(home?.alternates?.languages).toMatchObject({ en: absoluteUrl("/en") });
    expect(new Set(entries.map((e) => String(e.lastModified))).size).toBe(1);
  });
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npx vitest run src/lib
```
Expected: FAIL for the new modules.

- [ ] **Step 3: Rewrite `src/config/site.ts`**

```ts
export interface SiteConfig {
  // Legacy fields — still read by the old layout/sitemap/robots until Task 18.
  name: string;
  description: string;
  url: string;
  ogImage: string;
  keywords: string[];
  authors: { name: string; url: string }[];
  creator: string;
  twitter: string;
  // New fields.
  jobTitle: string;
  contentUpdated: string;
  contact: {
    email: string | null;
    telegram: { handle: string; url: string };
    phone: { display: string; href: string };
    github: string;
    cv: string | null;
  };
  portrait: { src: string; width: number; height: number } | null;
  heroStack: string[];
}

export const siteConfig: SiteConfig = {
  name: "Nguyễn Mạnh Hùng",
  description:
    "Product engineer tại Hà Nội: xây sản phẩm web và mobile từ ý tưởng đến production. React, Next.js, React Native, Node.js.",
  url: "https://www.nmhx.info",
  ogImage: "/og-cover.png",
  keywords: ["product engineer", "next.js developer", "react native developer", "full-stack developer vietnam", "nmhx"],
  authors: [{ name: "Nguyễn Mạnh Hùng", url: "https://www.nmhx.info" }],
  creator: "Nguyễn Mạnh Hùng",
  twitter: "@NMHx2005",
  jobTitle: "Product Engineer",
  contentUpdated: "2026-10-10",
  contact: {
    email: null, // set only to an address the owner has approved for publication (Appendix A)
    telegram: { handle: "@nmhx_white", url: "https://t.me/nmhx_white" },
    phone: { display: "+84 971 084 430", href: "tel:+84971084430" },
    github: "https://github.com/NMHx2005",
    cv: null,
  },
  portrait: null,
  heroStack: ["React", "Next.js", "TypeScript", "React Native", "Node.js", "PostgreSQL", "Firebase"],
};
```

> The old `layout.tsx` still reads `siteConfig.name` for its title; it is deleted in Task 7 so this change is cosmetic until then.

- [ ] **Step 4: Write `src/lib/site-url.ts`**

```ts
import { siteConfig } from "@/config/site";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
  return raw.replace(/\/+$/, "");
}
```

- [ ] **Step 5: Write `src/lib/seo.ts`**

```ts
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content/dictionary";
import { projectsData } from "@/content/projects";
import type { ProjectSlug } from "@/content/types";
import { defaultLocale, locales, ogLocales, type Locale } from "@/lib/i18n/config";
import { localePath, projectPath } from "@/lib/i18n/paths";
import { getSiteUrl } from "@/lib/site-url";

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path}`;
}

export function languageUrls(pathFor: (locale: Locale) => string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = absoluteUrl(pathFor(l));
  languages["x-default"] = absoluteUrl(pathFor(defaultLocale));
  return languages;
}

export function alternatesFor(
  locale: Locale,
  pathFor: (locale: Locale) => string,
): NonNullable<Metadata["alternates"]> {
  return { canonical: absoluteUrl(pathFor(locale)), languages: languageUrls(pathFor) };
}

function openGraph(locale: Locale, title: string, description: string, path: string): Metadata["openGraph"] {
  return {
    type: "website",
    url: absoluteUrl(path),
    siteName: siteConfig.name,
    title,
    description,
    locale: ogLocales[locale],
    alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
  };
}

export function homeMetadata(locale: Locale): Metadata {
  const d = getDictionary(locale);
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: d.meta.title, template: `%s · ${siteConfig.name}` },
    description: d.meta.description,
    authors: [{ name: siteConfig.name, url: getSiteUrl() }],
    creator: siteConfig.name,
    alternates: alternatesFor(locale, (l) => localePath(l)),
    openGraph: openGraph(locale, d.meta.title, d.meta.description, localePath(locale)),
    twitter: {
      card: "summary_large_image",
      title: d.meta.title,
      description: d.meta.description,
      creator: siteConfig.twitter,
    },
  };
}

export function projectMetadata(locale: Locale, slug: ProjectSlug): Metadata {
  const copy = getDictionary(locale).work.items[slug];
  const title = `${copy.title} — ${copy.category}`;
  return {
    title,
    description: copy.summary,
    alternates: alternatesFor(locale, (l) => projectPath(l, slug)),
    openGraph: openGraph(locale, title, copy.summary, projectPath(locale, slug)),
    twitter: { card: "summary_large_image", title, description: copy.summary, creator: siteConfig.twitter },
  };
}

export function personJsonLd(locale: Locale): Record<string, unknown> {
  const d = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.jobTitle,
    url: absoluteUrl(localePath(locale)),
    description: d.meta.description,
    ...(siteConfig.contact.email ? { email: `mailto:${siteConfig.contact.email}` } : {}),
    address: { "@type": "PostalAddress", addressLocality: "Hà Nội", addressCountry: "VN" },
    sameAs: [siteConfig.contact.github, siteConfig.contact.telegram.url],
    knowsAbout: ["React", "Next.js", "TypeScript", "React Native", "Node.js", "PostgreSQL"],
    ...(siteConfig.portrait ? { image: absoluteUrl(siteConfig.portrait.src) } : {}),
  };
}

export function websiteJsonLd(locale: Locale): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl(localePath(locale)),
    inLanguage: locale,
  };
}

export function projectJsonLd(locale: Locale, slug: ProjectSlug): Record<string, unknown> {
  const copy = getDictionary(locale).work.items[slug];
  const data = projectsData[slug];
  const url = absoluteUrl(projectPath(locale, slug));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: copy.title,
        description: copy.summary,
        url,
        inLanguage: locale,
        image: absoluteUrl(data.image.src),
        keywords: data.stack.join(", "),
        author: { "@type": "Person", name: siteConfig.name, url: absoluteUrl(localePath(locale)) },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteConfig.name, item: absoluteUrl(localePath(locale)) },
          { "@type": "ListItem", position: 2, name: copy.title, item: url },
        ],
      },
    ],
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
```

- [ ] **Step 6: Write `src/lib/sitemap-entries.ts`**

```ts
import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { projectSlugs } from "@/content/projects";
import { locales, type Locale } from "@/lib/i18n/config";
import { localePath, projectPath } from "@/lib/i18n/paths";
import { absoluteUrl, languageUrls } from "@/lib/seo";

export function sitemapEntries(): MetadataRoute.Sitemap {
  const lastModified = new Date(siteConfig.contentUpdated);
  const pages: { pathFor: (l: Locale) => string; priority: number }[] = [
    { pathFor: (l) => localePath(l), priority: 1 },
    ...projectSlugs.map((slug) => ({ pathFor: (l: Locale) => projectPath(l, slug), priority: 0.8 })),
  ];

  return pages.flatMap(({ pathFor, priority }) =>
    locales.map((locale) => ({
      url: absoluteUrl(pathFor(locale)),
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: languageUrls(pathFor) },
    })),
  );
}
```

- [ ] **Step 7: Run, gate, commit**

```bash
npm test
npm run lint && npx tsc --noEmit
git add src/config/site.ts src/lib/site-url.ts src/lib/seo.ts src/lib/sitemap-entries.ts src/lib/site-url.test.ts src/lib/seo.test.ts src/lib/sitemap-entries.test.ts
git commit -m "feat: add site config, site-url helper, metadata, json-ld and sitemap builders"
```
Expected: all tests pass, lint/tsc clean.



### Task 6: Design tokens, global CSS, contrast test

**Files:**
- Modify: `src/app/globals.css` (full rewrite)
- Test: `src/app/tokens.test.ts`

**Interfaces:**
- Produces Tailwind utilities from tokens: `bg-bg bg-surface text-fg text-fg-muted text-fg-subtle border-border border-border-strong text-accent bg-accent text-on-accent font-sans font-mono`; CSS classes `.rise` (hero entrance, uses `--i`), `[data-reveal]` + `.is-visible` (hidden only while `html[data-reveal-ready]` is set); custom variants `dark:` and `touch:` (`pointer: coarse`).

- [ ] **Step 1: Write the failing contrast test**

`src/app/tokens.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

function tokens(selector: RegExp): Record<string, string> {
  const body = css.match(selector)?.[1] ?? "";
  const out: Record<string, string> = {};
  for (const [, name, value] of body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    out[name as string] = value as string;
  }
  return out;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (channels[0] as number) + 0.7152 * (channels[1] as number) + 0.0722 * (channels[2] as number);
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const themes = {
  light: tokens(/:root\s*\{([^}]*)\}/),
  dark: tokens(/\.dark\s*\{([^}]*)\}/),
};

const required = ["bg", "surface", "border", "border-strong", "fg", "fg-muted", "fg-subtle", "accent", "on-accent"];

describe.each(Object.entries(themes))("%s theme tokens", (_name, t) => {
  it("defines every token as a 6-digit hex", () => {
    for (const key of required) expect(t[key], key).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("text tokens meet WCAG AA (4.5:1) on bg and surface", () => {
    for (const fg of ["fg", "fg-muted", "fg-subtle"]) {
      for (const bg of ["bg", "surface"]) {
        expect(ratio(t[fg] as string, t[bg] as string), `${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("accent is readable on bg, and on-accent is readable on accent", () => {
    expect(ratio(t.accent as string, t.bg as string)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(t["on-accent"] as string, t.accent as string)).toBeGreaterThanOrEqual(4.5);
  });
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npx vitest run src/app/tokens.test.ts
```
Expected: FAIL (tokens not defined in the current CSS).

- [ ] **Step 3: Rewrite `src/app/globals.css`**

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
/* Coarse pointers (touch): controls grow to 44 px. */
@custom-variant touch (@media (pointer: coarse));

:root {
  color-scheme: light;
  --bg: #fafaf9;
  --surface: #ffffff;
  --border: #e4e4e7;
  --border-strong: #d4d4d8;
  --fg: #111113;
  --fg-muted: #52525b;
  --fg-subtle: #6b6b75;
  --accent: #047857;
  --on-accent: #ffffff;
}

.dark {
  color-scheme: dark;
  --bg: #0a0a0b;
  --surface: #111113;
  --border: #26262b;
  --border-strong: #3a3a42;
  --fg: #ededef;
  --fg-muted: #a1a1aa;
  --fg-subtle: #8a8a93;
  --accent: #6ee7b7;
  --on-accent: #04241a;
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-fg-subtle: var(--fg-subtle);
  --color-accent: var(--accent);
  --color-on-accent: var(--on-accent);
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace;
}

@layer base {
  * {
    border-color: var(--border);
  }

  html {
    scroll-padding-top: 5rem;
    -webkit-text-size-adjust: 100%;
  }

  body {
    background: var(--bg);
    color: var(--fg);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  ::selection {
    background: color-mix(in srgb, var(--accent) 30%, transparent);
  }

  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

/* ---- Motion ----
 * Everything that moves is opt-in via `no-preference`. Content is visible by default and is only hidden once the
 * reveal script has armed itself (`html[data-reveal-ready]`), so a failed script never leaves the page blank. */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }

  @keyframes rise {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  .rise {
    animation: rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
    animation-delay: calc(var(--i, 0) * 70ms);
  }

  [data-reveal] {
    transition:
      opacity 0.6s cubic-bezier(0.2, 0.7, 0.2, 1),
      transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
    transition-delay: calc(var(--i, 0) * 60ms);
  }

  html[data-reveal-ready] [data-reveal]:not(.is-visible) {
    opacity: 0;
    transform: translateY(14px);
  }
}

/* Backstop: anything that still transitions or animates is flattened for users who ask for reduced motion. */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: Run, gate, commit**

```bash
npx vitest run src/app/tokens.test.ts && npm run lint && npx tsc --noEmit
git add src/app/globals.css src/app/tokens.test.ts
git commit -m "feat: add minimal design tokens, motion primitives and a contrast test"
```
Expected: 6 token tests pass (3 per theme). The old components now lose their styling — expected, they are dead code removed in Task 18.

### Task 7: Locale routing skeleton, proxy, Playwright

**Files:**
- Delete: `src/app/layout.tsx`, `src/app/page.tsx` (`git rm`)
- Create: `src/proxy.ts`
- Create: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/[...rest]/page.tsx`, `src/app/[locale]/not-found.tsx`
- Create: `playwright.config.ts`, `e2e/routing.spec.ts`

**Interfaces:**
- Consumes: Task 3 (`resolveRedirect`, `LOCALE_COOKIE`, `isLocale`, `locales`), Task 4 (`getDictionary`), Task 5 (`homeMetadata`).
- Produces: route tree `/[locale]`, root layout that renders `<html lang>`, CSS variable fonts `--font-inter`, `--font-geist-mono`.

- [ ] **Step 1: Install the browser and write the failing e2e tests**

```bash
npx playwright install chromium
```

`playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

// Dev runs may reuse a running dev server. Production runs (`npm run e2e:prod`) serve the artifact that was just
// built, on their own port, and are never allowed to attach to a stray server: `e2e/server-mode.spec.ts` asserts it.
const prod = Boolean(process.env.E2E_PROD);
const PORT = prod ? 3101 : 3100;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  webServer: {
    command: prod ? `npm run start -- -p ${PORT}` : `npm run dev -- -p ${PORT}`,
    url: `http://localhost:${PORT}/vi`,
    reuseExistingServer: !prod,
    timeout: 300_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
```

`e2e/routing.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.describe("locale redirect", () => {
  test("root redirects to /vi by default with a 307", async ({ request }) => {
    const res = await request.get("/", { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(res.headers()["location"]).toMatch(/\/vi$/);
  });

  test("Accept-Language and the NEXT_LOCALE cookie are respected (cookie wins)", async ({ request }) => {
    const en = await request.get("/", { maxRedirects: 0, headers: { "accept-language": "en-US,en;q=0.9" } });
    expect(en.headers()["location"]).toMatch(/\/en$/);
    const cookie = await request.get("/", {
      maxRedirects: 0,
      headers: { cookie: "NEXT_LOCALE=en", "accept-language": "vi" },
    });
    expect(cookie.headers()["location"]).toMatch(/\/en$/);
  });

  test("path and query string survive the redirect; /vietnam is not mistaken for a locale", async ({ request }) => {
    const a = await request.get("/projects/hadi?utm=x", { maxRedirects: 0 });
    expect(a.headers()["location"]).toMatch(/\/vi\/projects\/hadi\?utm=x$/);
    const b = await request.get("/vietnam", { maxRedirects: 0 });
    expect(b.headers()["location"]).toMatch(/\/vi\/vietnam$/);
  });
});

test.describe("locale pages", () => {
  test("html lang follows the URL", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.goto("/vi");
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  });

  test("hreflang alternates and self-canonical are present", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en$/);
    await expect(page.locator('link[rel="alternate"][hreflang="vi"]')).toHaveAttribute("href", /\/vi$/);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute("href", /\/vi$/);
  });

  test("unknown path under a locale is a localized 404", async ({ page }) => {
    const res = await page.goto("/en/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    const vi = await page.goto("/vi/khong-ton-tai");
    expect(vi?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Không tìm thấy trang" })).toBeVisible();
  });
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npx playwright test e2e/routing.spec.ts --project=desktop
```
Expected: FAIL (old app still serves `/`; `/vi` is 404).

- [ ] **Step 3: Remove the old root and add the proxy**

```bash
git rm src/app/layout.tsx src/app/page.tsx
```

`src/proxy.ts`:

```ts
import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE } from "@/lib/i18n/config";
import { resolveRedirect } from "@/lib/i18n/negotiate";

export function proxy(request: NextRequest) {
  const target = resolveRedirect({
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    cookie: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
  });
  if (!target) return NextResponse.next();
  return NextResponse.redirect(new URL(target, request.url), 307);
}

export const config = {
  // Skip API routes, Next internals and anything with a file extension (sitemap.xml, robots.txt, images…).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

- [ ] **Step 4: Add the locale layout**

`src/app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { isLocale, locales } from "@/lib/i18n/config";
import { homeMetadata } from "@/lib/seo";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? homeMetadata(locale) : {};
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh bg-bg font-sans text-fg antialiased">
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
```

`src/app/[locale]/page.tsx` (skeleton; sections are added by later tasks):

```tsx
import { notFound } from "next/navigation";
import { getDictionary } from "@/content/dictionary";
import { isLocale } from "@/lib/i18n/config";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <main id="main">
      <h1>{dict.hero.headline}</h1>
    </main>
  );
}
```

`src/app/[locale]/[...rest]/page.tsx` (turns every unknown sub-path into the localized `not-found.tsx`):

```tsx
import { notFound } from "next/navigation";

export default function CatchAll() {
  notFound();
}
```

`src/app/[locale]/not-found.tsx` (client: `not-found` receives no params, so the locale comes from the URL):

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/content/dictionary";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export default function NotFound() {
  const segment = usePathname().split("/")[1];
  const locale = isLocale(segment) ? segment : defaultLocale;
  const { notFound } = getDictionary(locale);

  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-5 sm:px-8">
      <p className="font-mono text-sm text-fg-subtle">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">{notFound.title}</h1>
      <p className="mt-4 max-w-md text-fg-muted">{notFound.text}</p>
      <Link href={`/${locale}`} className="mt-8 w-fit text-accent underline underline-offset-4">
        {notFound.cta}
      </Link>
    </main>
  );
}
```

- [ ] **Step 5: Run to verify pass**

```bash
npx playwright test e2e/routing.spec.ts --project=desktop
```
Expected: all pass. If `/en/does-not-exist` returns 200 instead of 404, check that `[...rest]/page.tsx` calls `notFound()` and the layout has no `loading.tsx` swallowing it.

- [ ] **Step 6: Spike — verify routing and 404 on a real production build (go/no-go)**

Next documents that a dynamic top-level `[locale]` root layout makes a *global* 404 harder to compose, so settle it now rather than at the end.

Create `e2e/not-found.spec.ts` and `e2e/server-mode.spec.ts`:

```ts
// e2e/not-found.spec.ts
import { expect, test } from "@playwright/test";

test("an asset-like path that matches nothing is a 404, not a 200 or a crash", async ({ request }) => {
  const res = await request.get("/nope.png", { maxRedirects: 0 });
  expect(res.status()).toBe(404);
});

test("an unknown first segment is redirected under a locale and ends in a localized 404", async ({ page }) => {
  const res = await page.goto("/xx/foo");
  expect(res?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.getByRole("heading", { level: 1, name: "Không tìm thấy trang" })).toBeVisible();
});
```

```ts
// e2e/server-mode.spec.ts
import { expect, test } from "@playwright/test";

test("production runs really hit a production server", async ({ request }) => {
  test.skip(!process.env.E2E_PROD, "only meaningful for npm run e2e:prod");
  const res = await request.get("/vi");
  // `next dev` answers with `no-store, must-revalidate`; a prerendered production page is cacheable.
  expect(res.headers()["cache-control"] ?? "").not.toContain("no-store");
});
```

Then build and run them against the production build (stop any dev server first — both use `.next`):

```bash
npm run build
```
Expected: the build succeeds. **Decision rule:** if the build fails with a missing-root-layout / `_not-found` error, or if the `/nope.png` test returns anything but 404, apply the fallback below and re-run this step; otherwise leave the fallback out.

*Fallback — global 404 (experimental in Next 16.0):* in `next.config.ts` set `experimental: { globalNotFound: true }`, and create `src/app/global-not-found.tsx`:

```tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin", "latin-ext", "vietnamese"], variable: "--font-inter", display: "swap" });

export default function GlobalNotFound() {
  return (
    <html lang="vi" className={`${inter.variable} dark`}>
      <body className="min-h-dvh bg-bg font-sans text-fg antialiased">
        <main id="main" className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-5 sm:px-8">
          <p className="font-mono text-sm text-fg-subtle">404</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Không tìm thấy trang · Page not found</h1>
          <Link href="/vi" className="mt-8 w-fit text-accent underline underline-offset-4">
            /vi
          </Link>
        </main>
      </body>
    </html>
  );
}
```

Record which path you took (with/without fallback) in the commit message body.

- [ ] **Step 7: Run the routing specs on the production build**

```bash
npm run e2e:prod -- e2e/routing.spec.ts e2e/not-found.spec.ts e2e/server-mode.spec.ts
```
Expected: all green on both projects, and `server-mode` really executes (not skipped).

- [ ] **Step 8: Checkpoint-1 gate and commit**

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build
git add playwright.config.ts e2e/routing.spec.ts e2e/not-found.spec.ts e2e/server-mode.spec.ts src/proxy.ts "src/app/[locale]"
git diff --cached --stat
git commit -m "feat: add locale-prefixed routing with proxy redirect and localized 404"
```
(`git rm` already staged the deletions of `src/app/layout.tsx` and `src/app/page.tsx`; if the fallback was needed also stage `next.config.ts` and `src/app/global-not-found.tsx`.)

## Checkpoint 2 — Visual review (Tasks 8–11)

### Task 8: UI primitives and reveal observer

**Files:**
- Create: `src/components/ui/container.tsx`, `src/components/ui/section.tsx`, `src/components/ui/link-button.tsx`
- Create: `src/components/reveal-observer.tsx`
- Create: `src/lib/css-vars.ts`
- Modify: `src/app/[locale]/layout.tsx` (mount `RevealObserver`, add skip link)

**Interfaces:**
- Produces:
  - `Container({ children, className? })`
  - `Section({ id: SectionId, head: SectionHead, children })` — renders `<section id>` with the `01 — Label` rail and `h2#<id>-heading`
  - `LinkButton({ href, variant?: "primary" | "secondary", external?, children })`
  - `delay(i: number): CSSProperties` (sets `--i`)
  - `RevealObserver()` — marks on-screen `[data-reveal]` items visible, *then* arms itself by setting `data-reveal-ready` on `<html>` (CSS hides items only after that), and reveals the rest as they enter the viewport; re-scans on route change

- [ ] **Step 1: Write the components**

`src/lib/css-vars.ts`:

```ts
import type { CSSProperties } from "react";

export function delay(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}
```

`src/components/ui/container.tsx`:

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}
```

`src/components/ui/section.tsx`:

```tsx
import type { ReactNode } from "react";
import type { SectionHead, SectionId } from "@/content/types";
import { delay } from "@/lib/css-vars";
import { Container } from "./container";

export function Section({ id, head, children }: { id: SectionId; head: SectionHead; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="border-t border-border py-24 md:py-32">
      <Container>
        <div className="grid gap-10 md:grid-cols-[11rem_1fr] md:gap-12">
          <p className="text-sm md:sticky md:top-24 md:self-start">
            <span className="font-mono text-xs text-fg-subtle">{head.index}</span>
            <span className="ml-3 text-fg-muted">{head.label}</span>
          </p>
          <div>
            <h2
              id={`${id}-heading`}
              data-reveal
              className="max-w-3xl text-balance text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.025em]"
            >
              {head.heading}
            </h2>
            {head.lede ? (
              <p data-reveal style={delay(1)} className="mt-4 max-w-2xl text-pretty text-fg-muted">
                {head.lede}
              </p>
            ) : null}
            <div className="mt-12 md:mt-16">{children}</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

`src/components/ui/link-button.tsx`:

```tsx
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-fg text-bg hover:bg-fg/85",
  secondary: "border border-border-strong text-fg hover:border-fg",
} as const;

interface LinkButtonProps {
  href: string;
  variant?: keyof typeof variants;
  external?: boolean;
  children: ReactNode;
}

export function LinkButton({ href, variant = "primary", external = false, children }: LinkButtonProps) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors duration-200",
        variants[variant],
      )}
    >
      {children}
      <Icon
        className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
```

`src/components/reveal-observer.tsx`:

```tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return; // never armed → nothing is ever hidden

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    // Content already on screen is marked visible *before* arming, so arming can never flash it away.
    const pending = targets.filter((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.classList.add("is-visible");
        return false;
      }
      return true;
    });

    // CSS may hide `[data-reveal]:not(.is-visible)` only from this point on (see globals.css).
    document.documentElement.dataset.revealReady = "";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    pending.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
```


- [ ] **Step 2: Mount observer and skip link in the layout**

In `src/app/[locale]/layout.tsx`: add `import { RevealObserver } from "@/components/reveal-observer";` and `import { getDictionary } from "@/content/dictionary";`, then inside `<body>` before `<ThemeProvider>`:

```tsx
<a
  href="#main"
  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
>
  {getDictionary(locale).a11y.skip}
</a>
```

and after `{children}` inside the provider: `<RevealObserver />`.

- [ ] **Step 3: Gate and commit**

```bash
npm run lint && npx tsc --noEmit && npm run build
git add src/components/ui src/components/reveal-observer.tsx src/lib/css-vars.ts "src/app/[locale]/layout.tsx"
git commit -m "feat: add layout primitives, link button and scroll reveal observer"
```
Expected: lint/tsc/build clean.

### Task 9: Header, mobile navigation, language and theme controls

**Files:**
- Overwrite: `src/components/site-header.tsx`, `src/components/theme-toggle.tsx`, `src/components/language-switcher.tsx`
- Create: `src/components/mobile-nav.tsx`
- Modify: `src/app/[locale]/page.tsx` (render header)
- Test: `e2e/header.spec.ts`

> The scroll-progress bar and the command-palette trigger are added to this header in Task 17 (enhancements).

**Interfaces:**
- Consumes: `Container`, `localePath`, `localeHref`, `LOCALE_COOKIE`, `Dictionary['nav'|'a11y']`.
- Produces: `SiteHeader({ locale, dict })` (server); `MobileNav`, `LanguageSwitcher`, `ThemeToggle` (client).

- [ ] **Step 1: Write the failing e2e tests**

`e2e/header.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("desktop shows inline navigation, no menu button", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop only");
  await page.goto("/en");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("link")).toHaveText(["Work", "Services", "About", "Contact"]);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
});

test("mobile menu opens as a dialog, lists links, traps focus, closes on Escape and returns focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/en");
  await expect(page.getByRole("navigation", { name: "Main navigation" }).first()).toBeHidden();
  const open = page.getByRole("button", { name: "Open menu" });
  await expect(open).toHaveAttribute("aria-expanded", "false");
  await open.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(open).toHaveAttribute("aria-expanded", "true");
  await expect(dialog.getByRole("link")).toHaveCount(4);

  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.activeElement?.closest("dialog") !== null)).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(open).toHaveAttribute("aria-expanded", "false");
  await expect(open).toBeFocused();
});

test("language switcher navigates to the other locale, remembers it and keeps query + hash", async ({ page, context }) => {
  await page.goto("/vi?utm=x#faq");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\?utm=x#faq$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const cookies = await context.cookies();
  expect(cookies.find((c) => c.name === "NEXT_LOCALE")?.value).toBe("en");
});

test("theme toggle flips the dark class on <html>", async ({ page }) => {
  await page.goto("/en");
  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Toggle light/dark theme" }).click();
  await expect(html).not.toHaveClass(/dark/);
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npx playwright test e2e/header.spec.ts
```
Expected: FAIL (no header yet).

- [ ] **Step 3: Implement the client controls**

`src/components/theme-toggle.tsx` (overwrite):

```tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-lg text-fg-muted transition-colors hover:text-fg touch:h-11 touch:w-11"
    >
      <Sun className="hidden h-[18px] w-[18px] dark:block" aria-hidden />
      <Moon className="h-[18px] w-[18px] dark:hidden" aria-hidden />
    </button>
  );
}
```

`src/components/language-switcher.tsx` (overwrite):

```tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { LOCALE_COOKIE, localeLabels, locales, type Locale } from "@/lib/i18n/config";
import { localeHref, switchLocalePath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function onClick(event: MouseEvent<HTMLAnchorElement>, target: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    if (modified) return;
    // The plain href (no query/hash) is the no-JS fallback; with JS we keep the visitor's context.
    event.preventDefault();
    router.push(localeHref(pathname, window.location.search, window.location.hash, target));
  }

  return (
    <div role="group" aria-label={label} className="flex items-center rounded-lg border border-border p-0.5">
      {locales.map((target) => {
        const active = target === locale;
        return (
          <Link
            key={target}
            href={switchLocalePath(pathname, target)}
            hrefLang={target}
            lang={target}
            aria-label={localeLabels[target]}
            aria-current={active ? "true" : undefined}
            onClick={(event) => onClick(event, target)}
            className={cn(
              "flex h-8 min-w-9 items-center justify-center rounded-md px-2 font-mono text-xs uppercase transition-colors touch:h-11 touch:min-w-11",
              active ? "bg-fg text-bg" : "text-fg-muted hover:text-fg",
            )}
          >
            {target}
          </Link>
        );
      })}
    </div>
  );
}
```

`src/components/mobile-nav.tsx`:

```tsx
"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

interface MobileNavProps {
  items: { id: string; label: string }[];
  home: string;
  labels: { open: string; close: string; nav: string };
}

const iconButton =
  "flex h-11 w-11 items-center justify-center rounded-lg text-fg-muted transition-colors hover:text-fg";

export function MobileNav({ items, home, labels }: MobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={labels.open}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
        className={iconButton}
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-nav"
        aria-label={labels.nav}
        onClose={() => setOpen(false)}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-transparent"
      >
        <div className="flex h-16 items-center justify-end px-5">
          <button type="button" aria-label={labels.close} onClick={() => dialogRef.current?.close()} className={iconButton}>
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <nav aria-label={labels.nav} className="px-5">
          <ul className="divide-y divide-border border-y border-border">
            {items.map((item, index) => (
              <li key={item.id}>
                <Link
                  href={`${home}#${item.id}`}
                  onClick={() => dialogRef.current?.close()}
                  className="flex h-16 items-center justify-between text-2xl font-semibold tracking-tight"
                >
                  {item.label}
                  <span className="font-mono text-xs font-normal text-fg-subtle">0{index + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </div>
  );
}
```

- [ ] **Step 4: Implement the header and render it**

`src/components/site-header.tsx` (overwrite):

```tsx
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/paths";

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const home = localePath(locale);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-bg">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href={home}
            aria-label={`NMHx — ${siteConfig.name}`}
            className="inline-flex h-11 items-center font-mono text-sm font-semibold tracking-tight"
          >
            NMHx<span className="text-accent">.</span>
          </Link>

          <nav aria-label={dict.a11y.mainNav} className="hidden md:block">
            <ul className="flex items-center gap-1">
              {dict.nav.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`${home}#${item.id}`}
                    className="rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <LanguageSwitcher locale={locale} label={dict.a11y.switchLanguage} />
            <ThemeToggle label={dict.a11y.toggleTheme} />
            <MobileNav
              items={dict.nav}
              home={home}
              labels={{ open: dict.a11y.openMenu, close: dict.a11y.closeMenu, nav: dict.a11y.mainNav }}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
```

Update `src/app/[locale]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getDictionary } from "@/content/dictionary";
import { isLocale } from "@/lib/i18n/config";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main id="main" className="pt-16">
        <h1>{dict.hero.headline}</h1>
      </main>
    </>
  );
}
```

- [ ] **Step 5: Run to verify pass, gate, commit**

```bash
npx playwright test e2e/header.spec.ts && npm run lint && npx tsc --noEmit
git add src/components/site-header.tsx src/components/theme-toggle.tsx src/components/language-switcher.tsx src/components/mobile-nav.tsx "src/app/[locale]/page.tsx" e2e/header.spec.ts
git diff --cached --stat
git commit -m "feat: add header with mobile dialog nav, context-preserving language switch and theme toggle"
```
Expected: desktop and mobile projects both green (tests self-skip on the other form factor).

### Task 10: Hero

**Files:**
- Overwrite: `src/components/sections/hero-section.tsx`
- Create: `src/lib/format.ts`
- Modify: `src/app/[locale]/page.tsx`
- Test: `src/lib/format.test.ts`, `e2e/hero.spec.ts`

**Interfaces:**
- Consumes: `Container`, `LinkButton`, `delay`, `siteConfig.heroStack`, `siteConfig.contentUpdated`, `Dictionary['hero']`.
- Produces: `HeroSection({ locale, dict })`; `formatMonthYear(locale, isoDate): string`.

- [ ] **Step 1: Write the failing tests**

`src/lib/format.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatMonthYear } from "./format";

describe("formatMonthYear", () => {
  it("formats in the requested locale and is timezone-stable", () => {
    expect(formatMonthYear("en", "2026-10-10")).toBe("October 2026");
    expect(formatMonthYear("vi", "2026-10-10")).toMatch(/10.*2026/);
    expect(formatMonthYear("en", "2026-01-01")).toBe("January 2026");
  });
});
```

`e2e/hero.spec.ts` (regression for the invisible-role bug):

```ts
import { expect, test } from "@playwright/test";

test.describe("hero", () => {
  test("h1 states the positioning, is painted (not transparent) and wraps sensibly", async ({ page }) => {
    await page.goto("/en");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText("Product engineer");
    await expect(h1).toHaveCSS("color", /^(?!rgba\(0, 0, 0, 0\)).+/);
    await expect(h1).toHaveCSS("opacity", "1");
  });

  test("h1 never needs more than 4 lines at 320 px, in either language", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    for (const path of ["/en", "/vi"]) {
      await page.goto(path);
      const lines = await page.getByRole("heading", { level: 1 }).evaluate((el) => {
        const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight);
        return Math.round(el.getBoundingClientRect().height / lineHeight);
      });
      expect(lines, path).toBeLessThanOrEqual(4);
    }
  });

  test("shows status, dated 'Now' facts, two CTAs and the stack tokens", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByText("Open to freelance")).toBeVisible();
    const now = page.getByRole("group", { name: "Now" });
    await expect(now.locator("dt")).toHaveCount(2);
    await expect(now.getByText(/^Updated /)).toBeVisible();
    await expect(page.getByRole("link", { name: "View work" })).toHaveAttribute("href", "/en#projects");
    await expect(page.getByRole("link", { name: "Get in touch" })).toHaveAttribute("href", "/en#contact");
    expect(await page.getByRole("list", { name: "Technology" }).locator("li").count()).toBeGreaterThanOrEqual(5);
  });

  test("Vietnamese copy renders with diacritics intact", async ({ page }) => {
    await page.goto("/vi");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("xây sản phẩm web và mobile");
  });
});

test.describe("hero without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("headline is still rendered and ends fully opaque", async ({ page }) => {
    await page.goto("/en");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText("Product engineer");
    await expect(h1).toHaveCSS("opacity", "1");
  });
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npx vitest run src/lib/format.test.ts && npx playwright test e2e/hero.spec.ts --project=desktop
```
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/lib/format.ts`:

```ts
import type { Locale } from "@/lib/i18n/config";

export function formatMonthYear(locale: Locale, isoDate: string): string {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(isoDate));
}
```

`src/components/sections/hero-section.tsx` (overwrite):

```tsx
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/link-button";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/content/types";
import { delay } from "@/lib/css-vars";
import { formatMonthYear } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

export function HeroSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { hero } = dict;
  const home = localePath(locale);
  const hasNow = hero.now.length > 0;

  return (
    <section id="hero" aria-labelledby="hero-heading" className="pb-24 pt-20 md:pb-32 md:pt-32">
      <Container>
        <div className={cn("grid gap-16", hasNow && "lg:grid-cols-[1fr_20rem] lg:gap-20")}>
          <div>
            <p className="rise inline-flex items-center gap-3 text-sm text-fg-muted" style={delay(0)}>
              <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
              {hero.status}
            </p>
            <h1
              id="hero-heading"
              className="rise mt-8 max-w-4xl text-balance text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.035em]"
              style={delay(1)}
            >
              {hero.headline}
            </h1>
            <p className="rise mt-6 max-w-xl text-pretty text-lg text-fg-muted" style={delay(2)}>
              {hero.intro}
            </p>
            <div className="rise mt-10 flex flex-wrap gap-3" style={delay(3)}>
              <LinkButton href={`${home}#projects`}>{hero.primaryCta}</LinkButton>
              <LinkButton href={`${home}#contact`} variant="secondary">
                {hero.secondaryCta}
              </LinkButton>
            </div>
          </div>

          {hasNow ? (
            <div
              role="group"
              aria-label={hero.nowTitle}
              className="rise self-end border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
              style={delay(4)}
            >
              <h2 className="text-sm font-medium text-fg-muted">{hero.nowTitle}</h2>
              <dl className="mt-5 space-y-5 text-sm">
                {hero.now.map((item) => (
                  <div key={item.label}>
                    <dt className="text-fg-subtle">{item.label}</dt>
                    <dd className="mt-1 text-fg">{item.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-xs text-fg-subtle">
                {hero.updatedLabel} {formatMonthYear(locale, siteConfig.contentUpdated)}
              </p>
            </div>
          ) : null}
        </div>

        <ul
          aria-label={dict.about.skillsTitle}
          className="rise mt-20 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 font-mono text-xs text-fg-subtle"
          style={delay(5)}
        >
          {siteConfig.heroStack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
```

In `src/app/[locale]/page.tsx` replace the placeholder `<h1>` with `<HeroSection locale={locale} dict={dict} />` (import it).

- [ ] **Step 4: Run, gate, commit**

```bash
npx vitest run src/lib/format.test.ts && npx playwright test e2e/hero.spec.ts && npm run lint && npx tsc --noEmit
git add src/lib/format.ts src/lib/format.test.ts src/components/sections/hero-section.tsx "src/app/[locale]/page.tsx" e2e/hero.spec.ts
git diff --cached --stat
git commit -m "feat: add hero with positioning, dated now panel and stack tokens"
```
Expected: pass on both projects. If the 320 px line-count test fails, lower the clamp minimum or shorten the headline in both dictionaries — do not loosen the test.

### Task 11: Work section and project blocks

**Files:**
- Create: `src/components/work/project-block.tsx`
- Create: `src/components/sections/work-section.tsx` (the old `projects-section.tsx` is deleted in Task 18)
- Modify: `src/components/ui/section.tsx` (add `wide`), `src/app/[locale]/page.tsx`
- Test: `e2e/work.spec.ts`

**Interfaces:**
- Consumes: `Section`, `projectsData`, `projectSlugs`, `projectPath`, `Dictionary['work'|'caseStudy']`.
- Produces: `Section({ id, head, children, wide? })`; `ProjectBlock({ locale, dict, slug, index })`; `WorkSection({ locale, dict })` rendering `<section id="projects">` (the legacy anchor).

- [ ] **Step 1: Write the failing e2e tests**

`e2e/work.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { getDictionary } from "../src/content/dictionary";

test("work section lists both projects with cover images that load", async ({ page }) => {
  await page.goto("/en");
  const work = page.locator("#projects");
  await expect(work.getByRole("heading", { level: 2 })).toHaveText("Shipped products");
  await expect(work.getByRole("heading", { level: 3 })).toHaveText(["HNWedding", "Hadi"]);

  for (const img of await work.locator("img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});

test("each project title links to its localized case study", async ({ page }) => {
  await page.goto("/vi");
  await expect(page.locator("#projects h3 a").nth(0)).toHaveAttribute("href", "/vi/projects/hnwedding");
  await expect(page.locator("#projects h3 a").nth(1)).toHaveAttribute("href", "/vi/projects/hadi");
});

test("optional parts render only when configured: no empty hrefs, no empty Role row", async ({ page }) => {
  await page.goto("/en");
  const hrefs = await page.locator("#projects a").evaluateAll((els) => els.map((a) => a.getAttribute("href")));
  for (const href of hrefs) expect(href && href !== "#").toBeTruthy();

  const hnwedding = getDictionary("en").work.items.hnwedding;
  await expect(page.locator("#projects article").first().locator("dt", { hasText: /^Role$/ })).toHaveCount(
    hnwedding.role ? 1 : 0,
  );
});

test("under reduced motion the hover effect does not move the image", async ({ page, isMobile }) => {
  test.skip(isMobile, "hover is a pointer interaction");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  const image = page.locator("#projects article img").first();
  await image.scrollIntoViewIfNeeded();
  await image.hover();
  await expect(image).toHaveCSS("transform", "none");
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npx playwright test e2e/work.spec.ts --project=desktop
```
Expected: FAIL.

- [ ] **Step 3: Add the `wide` option to `Section`**

Replace `src/components/ui/section.tsx` so wide sections render their children **below** the heading grid at full container width:

```tsx
import type { ReactNode } from "react";
import type { SectionHead, SectionId } from "@/content/types";
import { delay } from "@/lib/css-vars";
import { Container } from "./container";

export function Section({
  id,
  head,
  children,
  wide = false,
}: {
  id: SectionId;
  head: SectionHead;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="border-t border-border py-24 md:py-32">
      <Container>
        <div className="grid gap-10 md:grid-cols-[11rem_1fr] md:gap-12">
          <p className="text-sm md:sticky md:top-24 md:self-start">
            <span className="font-mono text-xs text-fg-subtle">{head.index}</span>
            <span className="ml-3 text-fg-muted">{head.label}</span>
          </p>
          <div>
            <h2
              id={`${id}-heading`}
              data-reveal
              className="max-w-3xl text-balance text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.025em]"
            >
              {head.heading}
            </h2>
            {head.lede ? (
              <p data-reveal style={delay(1)} className="mt-4 max-w-2xl text-pretty text-fg-muted">
                {head.lede}
              </p>
            ) : null}
            {wide ? null : <div className="mt-12 md:mt-16">{children}</div>}
          </div>
        </div>
        {wide ? <div className="mt-14 md:mt-20">{children}</div> : null}
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Implement the project block**

`src/components/work/project-block.tsx`:

```tsx
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { projectsData } from "@/content/projects";
import type { Dictionary, ProjectSlug } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";
import { projectPath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

interface ProjectBlockProps {
  locale: Locale;
  dict: Dictionary;
  slug: ProjectSlug;
  index: number;
}

const externalLink =
  "relative z-10 inline-flex min-h-11 items-center gap-1.5 text-fg-muted underline-offset-4 transition-colors hover:text-fg hover:underline";

export function ProjectBlock({ locale, dict, slug, index }: ProjectBlockProps) {
  const data = projectsData[slug];
  const copy = dict.work.items[slug];
  const href = projectPath(locale, slug);
  const mirrored = index % 2 === 1;

  return (
    <article
      data-reveal
      className="group relative grid gap-8 rounded-xl has-[h3_a:focus-visible]:outline-2 has-[h3_a:focus-visible]:outline-offset-8 has-[h3_a:focus-visible]:outline-accent lg:grid-cols-12 lg:items-center lg:gap-12"
    >
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-surface transition-colors duration-200 group-hover:border-border-strong lg:col-span-7",
          mirrored && "lg:order-2",
        )}
      >
        {/* Below the fold on every viewport (the hero is text), so no `priority`; `sizes` follows the 7/12 column. */}
        <Image
          src={data.image.src}
          alt={copy.imageAlt}
          width={data.image.width}
          height={data.image.height}
          sizes="(min-width: 1152px) 615px, (min-width: 1024px) 56vw, 100vw"
          className="h-auto w-full motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.02]"
        />
      </div>

      <div className="lg:col-span-5">
        <p className="text-sm text-fg-subtle">
          <span className="font-mono">{String(index + 1).padStart(2, "0")}</span>
          <span className="ml-3">{copy.category}</span>
        </p>
        <h3 className="mt-3 text-3xl font-semibold tracking-tight">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {copy.title}
          </Link>
        </h3>
        <p className="mt-4 text-pretty text-fg-muted">{copy.summary}</p>

        <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-border pt-6 text-sm">
          {copy.role ? (
            <>
              <dt className="text-fg-subtle">{dict.caseStudy.role}</dt>
              <dd>{copy.role}</dd>
            </>
          ) : null}
          <dt className="text-fg-subtle">{dict.caseStudy.status}</dt>
          <dd>{copy.status}</dd>
          <dt className="text-fg-subtle">{dict.caseStudy.stack}</dt>
          <dd className="font-mono text-xs leading-6 text-fg-muted">{data.stack.slice(0, 5).join(" · ")}</dd>
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <span aria-hidden className="inline-flex items-center gap-1.5 font-medium text-fg">
            {dict.work.viewCaseStudy}
            <ArrowRight className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-1" />
          </span>
          {data.links.live ? (
            <a href={data.links.live} target="_blank" rel="noopener noreferrer" className={externalLink}>
              {dict.work.live}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          ) : null}
          {data.links.repo ? (
            <a href={data.links.repo} target="_blank" rel="noopener noreferrer" className={externalLink}>
              {dict.work.repository}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
```

`src/components/sections/work-section.tsx`:

```tsx
import { ProjectBlock } from "@/components/work/project-block";
import { Section } from "@/components/ui/section";
import { projectSlugs } from "@/content/projects";
import type { Dictionary } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";

export function WorkSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Section id="projects" head={dict.sections.projects} wide>
      <div className="space-y-24 md:space-y-32">
        {projectSlugs.map((slug, index) => (
          <ProjectBlock key={slug} locale={locale} dict={dict} slug={slug} index={index} />
        ))}
      </div>
    </Section>
  );
}
```

Add `<WorkSection locale={locale} dict={dict} />` after `<HeroSection …/>` in `src/app/[locale]/page.tsx` (home page still renders header + hero + work at this stage).

- [ ] **Step 5: Run, gate, commit**

```bash
npx playwright test e2e/work.spec.ts --project=desktop && npm run lint && npx tsc --noEmit
git add src/components/ui/section.tsx src/components/work src/components/sections/work-section.tsx "src/app/[locale]/page.tsx" e2e/work.spec.ts
git diff --cached --stat
git commit -m "feat: add work section with large alternating project blocks"
```
Expected: title-link `href`s 404 until Task 12 — the tests only assert attributes, so they pass.

- [ ] **Step 6: Checkpoint 2 — owner visual review (STOP here)**

Take screenshots of `/vi` and `/en` (hero + both project blocks) at **1440 and 390 px, dark and light** (8 images), plus a keyboard focus screenshot on a project card. Hand them to the owner with these questions: is the hero headline rhythm right on a phone? does the layout have enough personality or does it read as a generic template? are the project images the focus? **Do not build any further section until the owner approves or requests changes**; fix issues in `fix:`/`refactor:` commits and re-shoot.

## Checkpoint 3 — Complete site (Tasks 12–15)

### Task 12: Case-study pages, page shell, JSON-LD

**Files:**
- Create: `src/components/page-shell.tsx`, `src/components/json-ld.tsx`
- Create: `src/components/case-study/pipeline.tsx`, `src/components/case-study/case-study-view.tsx`
- Create: `src/app/[locale]/projects/[slug]/page.tsx`
- Modify: `src/app/[locale]/page.tsx` (use `PageShell`, add JSON-LD)
- Test: `e2e/case-study.spec.ts`

**Interfaces:**
- Consumes: `isProjectSlug`, `projectSlugs`, `projectsData` (Task 4), `projectMetadata`, `projectJsonLd`, `personJsonLd`, `websiteJsonLd` (Task 5).
- Produces: `PageShell({ locale, dict, children })`; `JsonLd({ data })`; `Pipeline({ steps, label })`; `CaseStudyView({ locale, dict, slug })`.

> Optional content (`role`, `choice.why`, `choice.tradeoff`) renders **only when present**. The view must look complete without any of it.

- [ ] **Step 1: Write the failing e2e tests**

`e2e/case-study.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { getDictionary } from "../src/content/dictionary";

const hadi = getDictionary("en").work.items.hadi;

test("navigating from the home work block opens the case study", async ({ page }) => {
  await page.goto("/en");
  await page.locator("#projects article").nth(1).locator("img").click();
  await expect(page).toHaveURL(/\/en\/projects\/hadi$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hadi");
});

test("case study shows meta, problem, technical choices, architecture flow and shipped list", async ({ page }) => {
  await page.goto("/en/projects/hadi");
  await expect(page).toHaveTitle(/Hadi/);
  for (const label of ["Platform", "Status", "Stack"]) {
    await expect(page.locator("dt", { hasText: new RegExp(`^${label}$`) }).first()).toBeVisible();
  }
  await expect(page.locator("dt", { hasText: /^Role$/ })).toHaveCount(hadi.role ? 1 : 0);

  await expect(page.getByRole("heading", { level: 2, name: "The problem" })).toBeVisible();
  const choices = page.locator("#choices ol > li");
  await expect(choices).toHaveCount(hadi.choices.length);
  await expect(page.locator("#choices dt", { hasText: /^Why$/ })).toHaveCount(hadi.choices.filter((c) => c.why).length);
  await expect(page.locator("#choices dt", { hasText: /^Trade-off$/ })).toHaveCount(
    hadi.choices.filter((c) => c.tradeoff).length,
  );

  await expect(page.getByRole("list", { name: "Main flow" }).locator("li")).toHaveCount(hadi.flow.length);
  await expect(page.locator("#shipped ul > li")).toHaveCount(hadi.shipped.length);
  await expect(page.locator("#shipped dl")).toContainText("332+");
});

test("prev/next links walk the project list with wrap-around", async ({ page }) => {
  await page.goto("/en/projects/hnwedding");
  await page.getByRole("link", { name: /Next project/ }).click();
  await expect(page).toHaveURL(/\/projects\/hadi$/);
  await page.getByRole("link", { name: /Next project/ }).click();
  await expect(page).toHaveURL(/\/projects\/hnwedding$/);
});

test("Vietnamese case study is localized and carries structured data", async ({ page }) => {
  await page.goto("/vi/projects/hnwedding");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.getByRole("heading", { level: 2, name: "Lựa chọn kỹ thuật" })).toBeVisible();
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join("")).toContain("CreativeWork");
});

test("unknown project slug is a 404; the back link returns to the work section", async ({ page }) => {
  const res = await page.goto("/en/projects/nope");
  expect(res?.status()).toBe(404);
  await page.goto("/en/projects/hadi");
  await expect(page.getByRole("link", { name: /All work/ })).toHaveAttribute("href", "/en#projects");
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npx playwright test e2e/case-study.spec.ts --project=desktop
```
Expected: FAIL.

- [ ] **Step 3: Shared shell and JSON-LD**

`src/components/json-ld.tsx`:

```tsx
import { serializeJsonLd } from "@/lib/seo";

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
```

`src/components/page-shell.tsx` (the footer is added in Task 15):

```tsx
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import type { Dictionary } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";

export function PageShell({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: ReactNode }) {
  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main id="main" className="pt-16">
        {children}
      </main>
    </>
  );
}
```

Rewrite `src/app/[locale]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { HeroSection } from "@/components/sections/hero-section";
import { WorkSection } from "@/components/sections/work-section";
import { getDictionary } from "@/content/dictionary";
import { isLocale } from "@/lib/i18n/config";
import { personJsonLd, websiteJsonLd } from "@/lib/seo";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <PageShell locale={locale} dict={dict}>
      <JsonLd data={personJsonLd(locale)} />
      <JsonLd data={websiteJsonLd(locale)} />
      <HeroSection locale={locale} dict={dict} />
      <WorkSection locale={locale} dict={dict} />
    </PageShell>
  );
}
```

- [ ] **Step 4: Pipeline and case-study view**

`src/components/case-study/pipeline.tsx`:

```tsx
import { ArrowDown, ArrowRight } from "lucide-react";

export function Pipeline({ steps, label }: { steps: string[]; label: string }) {
  return (
    <ol aria-label={label} className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
      {steps.map((step, index) => (
        <li key={step} className="flex flex-col items-start gap-2 md:flex-row md:items-center">
          <span className="rounded-lg border border-border bg-surface px-3 py-2 text-sm">{step}</span>
          {index < steps.length - 1 ? (
            <>
              <ArrowDown className="ml-4 h-4 w-4 text-fg-subtle md:hidden" aria-hidden />
              <ArrowRight className="hidden h-4 w-4 shrink-0 text-fg-subtle md:block" aria-hidden />
            </>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
```

`src/components/case-study/case-study-view.tsx`:

```tsx
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Pipeline } from "@/components/case-study/pipeline";
import { Container } from "@/components/ui/container";
import { projectSlugs, projectsData } from "@/content/projects";
import type { Dictionary, ProjectSlug } from "@/content/types";
import { delay } from "@/lib/css-vars";
import type { Locale } from "@/lib/i18n/config";
import { localePath, projectPath } from "@/lib/i18n/paths";

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="grid gap-6 border-t border-border py-12 md:grid-cols-[11rem_1fr] md:gap-12 md:py-16">
      <h2 className="text-sm font-medium text-fg-muted">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export function CaseStudyView({ locale, dict, slug }: { locale: Locale; dict: Dictionary; slug: ProjectSlug }) {
  const data = projectsData[slug];
  const copy = dict.work.items[slug];
  const cs = dict.caseStudy;
  const position = projectSlugs.indexOf(slug);
  const neighbour = (offset: number) =>
    projectSlugs[(position + offset + projectSlugs.length) % projectSlugs.length] as ProjectSlug;
  const next = neighbour(1);
  const previous = neighbour(-1);
  const links = [
    data.links.live ? { href: data.links.live, label: dict.work.live } : null,
    data.links.repo ? { href: data.links.repo, label: dict.work.repository } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <Container>
      <article className="pb-24 pt-12 md:pb-32 md:pt-20">
        <Link
          href={`${localePath(locale)}#projects`}
          className="inline-flex min-h-11 items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {cs.back}
        </Link>

        <header className="mt-8">
          <p className="rise text-sm text-fg-subtle" style={delay(0)}>
            {copy.category}
          </p>
          <h1
            className="rise mt-3 text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.035em]"
            style={delay(1)}
          >
            {copy.title}
          </h1>
          <p className="rise mt-6 max-w-2xl text-pretty text-lg text-fg-muted" style={delay(2)}>
            {copy.summary}
          </p>
        </header>

        <dl
          className="rise mt-12 grid gap-x-8 gap-y-6 border-y border-border py-6 text-sm sm:grid-cols-2 lg:grid-cols-4"
          style={delay(3)}
        >
          {copy.role ? (
            <div>
              <dt className="text-fg-subtle">{cs.role}</dt>
              <dd className="mt-1">{copy.role}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-fg-subtle">{cs.platform}</dt>
            <dd className="mt-1">{cs.platforms[data.kind]}</dd>
          </div>
          <div>
            <dt className="text-fg-subtle">{cs.status}</dt>
            <dd className="mt-1">{copy.status}</dd>
          </div>
          <div>
            <dt className="text-fg-subtle">{cs.stack}</dt>
            <dd className="mt-1 font-mono text-xs leading-6 text-fg-muted">{data.stack.join(" · ")}</dd>
          </div>
        </dl>

        <figure className="mt-12 overflow-hidden rounded-xl border border-border bg-surface">
          <Image
            src={data.image.src}
            alt={copy.imageAlt}
            width={data.image.width}
            height={data.image.height}
            sizes="(min-width: 1152px) 1088px, 100vw"
            className="h-auto w-full"
          />
        </figure>

        {links.length > 0 ? (
          <ul aria-label={cs.links} className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 font-medium underline-offset-4 hover:underline"
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-16">
          <Block id="problem" title={cs.problem}>
            <p className="max-w-2xl text-pretty text-lg text-fg-muted">{copy.problem}</p>
          </Block>

          <Block id="choices" title={cs.choices}>
            <ol className="divide-y divide-border border-y border-border">
              {copy.choices.map((choice, index) => (
                <li key={choice.title} className="grid gap-3 py-6 md:grid-cols-[3rem_1fr]">
                  <span className="font-mono text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-lg font-medium tracking-tight">{choice.title}</h3>
                    {choice.why || choice.tradeoff ? (
                      <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[6rem_1fr]">
                        {choice.why ? (
                          <>
                            <dt className="text-fg-subtle">{cs.why}</dt>
                            <dd className="text-fg-muted">{choice.why}</dd>
                          </>
                        ) : null}
                        {choice.tradeoff ? (
                          <>
                            <dt className="text-fg-subtle">{cs.tradeoff}</dt>
                            <dd className="text-fg-muted">{choice.tradeoff}</dd>
                          </>
                        ) : null}
                      </dl>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </Block>

          <Block id="architecture" title={cs.architecture}>
            <Pipeline steps={copy.flow} label={cs.flow} />
            <h3 className="sr-only">{cs.services}</h3>
            <dl className="mt-10 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-[10rem_1fr]">
              {copy.services.map((service) => (
                <div key={service.label} className="contents">
                  <dt className="text-fg-subtle">{service.label}</dt>
                  <dd className="font-mono text-xs leading-6 text-fg-muted">{service.detail}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block id="shipped" title={cs.shipped}>
            <ul className="max-w-2xl list-disc space-y-3 pl-5 text-fg-muted marker:text-fg-subtle">
              {copy.shipped.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3 className="sr-only">{cs.facts}</h3>
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              {data.metrics.map((metric) => (
                <div key={metric.key} className="flex gap-2">
                  <dt className="text-fg-subtle">{dict.work.metricLabels[metric.key]}</dt>
                  <dd className="font-mono text-fg-muted">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </Block>
        </div>

        <nav aria-label={cs.next} className="grid gap-px border-t border-border pt-10 sm:grid-cols-2">
          <Link href={projectPath(locale, previous)} className="group py-4">
            <span className="flex items-center gap-2 text-sm text-fg-subtle">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {cs.previous}
            </span>
            <span className="mt-1 block text-xl font-semibold tracking-tight group-hover:text-accent">
              {dict.work.items[previous].title}
            </span>
          </Link>
          <Link href={projectPath(locale, next)} className="group py-4 sm:text-right">
            <span className="flex items-center gap-2 text-sm text-fg-subtle sm:justify-end">
              {cs.next}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
            <span className="mt-1 block text-xl font-semibold tracking-tight group-hover:text-accent">
              {dict.work.items[next].title}
            </span>
          </Link>
        </nav>
      </article>
    </Container>
  );
}
```

> Case-study images are intentionally **not** `priority`; Task 20 decides from measured LCP data whether the case-study image on mobile needs it.

- [ ] **Step 5: Implement the route**

`src/app/[locale]/projects/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/case-study/case-study-view";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { getDictionary } from "@/content/dictionary";
import { isProjectSlug, projectSlugs } from "@/content/projects";
import { isLocale, locales } from "@/lib/i18n/config";
import { projectJsonLd, projectMetadata } from "@/lib/seo";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  return isLocale(locale) && isProjectSlug(slug) ? projectMetadata(locale, slug) : {};
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isProjectSlug(slug)) notFound();
  const dict = getDictionary(locale);

  return (
    <PageShell locale={locale} dict={dict}>
      <JsonLd data={projectJsonLd(locale, slug)} />
      <CaseStudyView locale={locale} dict={dict} slug={slug} />
    </PageShell>
  );
}
```

- [ ] **Step 6: Run, gate, commit**

```bash
npm test && npx playwright test e2e/case-study.spec.ts && npm run lint && npx tsc --noEmit
git add src/components/page-shell.tsx src/components/json-ld.tsx src/components/case-study "src/app/[locale]/projects" "src/app/[locale]/page.tsx" e2e/case-study.spec.ts
git diff --cached --stat
git commit -m "feat: add fact-based case-study pages with architecture flow and structured data"
```
Expected: all green. Open `/en/projects/hadi` in both themes at 390 px: meta row wraps, the pipeline is vertical, nothing overflows, and no empty "Why/Trade-off/Role" scaffolding is visible.

### Task 13: Services and About

**Files:**
- Create: `src/components/sections/services-section.tsx` (overwrites the old file of the same name)
- Create: `src/components/sections/about-section.tsx` (overwrites)
- Modify: `src/app/[locale]/page.tsx`
- Test: `e2e/content-sections.spec.ts`

**Interfaces:**
- Consumes: `Section`, `siteConfig.portrait`, `Dictionary['services'|'about']`.
- Produces: `ServicesSection({ dict })`, `AboutSection({ dict })`. The "Technology" heading carries `id="stack"` so the legacy `#stack` link keeps landing on the skills.

- [ ] **Step 1: Write the failing e2e tests**

`e2e/content-sections.spec.ts` (extended in Tasks 14–15):

```ts
import { expect, test } from "@playwright/test";
import { siteConfig } from "../src/config/site";

test("services lists four capabilities with tags", async ({ page }) => {
  await page.goto("/en");
  const rows = page.locator("#services ol > li");
  await expect(rows).toHaveCount(4);
  await expect(rows.first().getByRole("heading", { level: 3 })).toHaveText("Web products");
  await expect(rows.last().locator("ul li")).not.toHaveCount(0);
});

test("about shows the bio, three principles and four skill groups; #stack lands on the skills", async ({ page }) => {
  await page.goto("/en");
  const about = page.locator("#about");
  await expect(about.getByRole("heading", { level: 2 })).toContainText("understands both code and UX");
  await expect(about.getByRole("list", { name: "Principles" }).locator("li")).toHaveCount(3);
  await expect(about.getByRole("heading", { level: 3, name: "Technology" })).toHaveAttribute("id", "stack");
  await expect(about.locator("[data-skill-group]")).toHaveCount(4);
});

test("portrait renders only when a real photo is configured", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("#about img")).toHaveCount(siteConfig.portrait ? 1 : 0);
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npx playwright test e2e/content-sections.spec.ts --project=desktop
```
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/components/sections/services-section.tsx`:

```tsx
import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/content/types";
import { delay } from "@/lib/css-vars";

export function ServicesSection({ dict }: { dict: Dictionary }) {
  return (
    <Section id="services" head={dict.sections.services}>
      <ol className="divide-y divide-border border-y border-border">
        {dict.services.items.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={delay(index)}
            className="grid gap-4 py-8 md:grid-cols-[3rem_1fr_1.2fr] md:gap-8"
          >
            <span className="font-mono text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
            <div>
              <p className="text-pretty text-fg-muted">{item.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <li key={tag} className="rounded-md border border-border px-2 py-1 font-mono text-xs text-fg-subtle">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
```

`src/components/sections/about-section.tsx`:

```tsx
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/content/types";
import { cn } from "@/lib/utils";

export function AboutSection({ dict }: { dict: Dictionary }) {
  const { about } = dict;
  const portrait = siteConfig.portrait;

  return (
    <Section id="about" head={dict.sections.about}>
      <div className={cn("grid gap-12", portrait && "lg:grid-cols-[14rem_1fr]")}>
        {portrait ? (
          <Image
            src={portrait.src}
            alt={about.portraitAlt}
            width={portrait.width}
            height={portrait.height}
            sizes="(min-width: 1024px) 224px, 60vw"
            className="h-auto w-full max-w-56 rounded-xl border border-border object-cover"
          />
        ) : null}

        <div>
          <div data-reveal className="max-w-2xl space-y-5 text-pretty text-lg text-fg-muted">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <ul
            aria-label={about.principlesLabel}
            className="mt-14 flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-8 font-medium"
          >
            {about.principles.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>

          <h3 id="stack" className="mt-14 text-sm font-medium text-fg-muted">
            {about.skillsTitle}
          </h3>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {about.skillGroups.map((group) => (
              <div key={group.name} data-skill-group className="grid gap-2 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <p className="text-sm text-fg-subtle">{group.name}</p>
                <p className="font-mono text-xs leading-6 text-fg-muted">{group.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
```

Add `<ServicesSection dict={dict} />` and `<AboutSection dict={dict} />` after `<WorkSection …/>` in the home page.

- [ ] **Step 4: Run, gate, commit**

```bash
npm test && npx playwright test e2e/content-sections.spec.ts --project=desktop && npm run lint && npx tsc --noEmit
git add src/components/sections/services-section.tsx src/components/sections/about-section.tsx "src/app/[locale]/page.tsx" e2e/content-sections.spec.ts
git diff --cached --stat
git commit -m "feat: add services and about sections with grouped skills and legacy #stack anchor"
```

### Task 14: Process and FAQ

**Files:**
- Create: `src/components/sections/process-section.tsx`, `src/components/sections/faq-section.tsx` (both overwrite old files)
- Modify: `src/app/[locale]/page.tsx`, `e2e/content-sections.spec.ts`

**Interfaces:**
- Produces: `ProcessSection({ dict })`, `FaqSection({ dict })`.

- [ ] **Step 1: Append failing e2e tests to `e2e/content-sections.spec.ts`**

```ts
test("process shows five ordered steps", async ({ page }) => {
  await page.goto("/en");
  const steps = page.locator("#process ol > li");
  await expect(steps).toHaveCount(5);
  await expect(steps.first().getByRole("heading", { level: 3 })).toHaveText("Discovery");
  await expect(steps.last().getByRole("heading", { level: 3 })).toHaveText("Support");
});

test("FAQ is a native accordion: opens on click, exclusive, keyboard operable", async ({ page }) => {
  await page.goto("/en");
  const items = page.locator("#faq details");
  await expect(items).toHaveCount(8);
  await expect(page.locator("#faq details[open]")).toHaveCount(0);

  await items.nth(0).locator("summary").click();
  await expect(items.nth(0)).toHaveAttribute("open", "");
  await items.nth(1).locator("summary").click();
  await expect(items.nth(1)).toHaveAttribute("open", "");
  await expect(items.nth(0)).not.toHaveAttribute("open", "");

  await items.nth(2).locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(items.nth(2)).toHaveAttribute("open", "");
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npx playwright test e2e/content-sections.spec.ts --project=desktop
```
Expected: the two new tests FAIL.

- [ ] **Step 3: Implement**

`src/components/sections/process-section.tsx`:

```tsx
import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/content/types";
import { delay } from "@/lib/css-vars";

export function ProcessSection({ dict }: { dict: Dictionary }) {
  return (
    <Section id="process" head={dict.sections.process} wide>
      <ol className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-6">
        {dict.process.steps.map((step, index) => (
          <li key={step.title} data-reveal style={delay(index)} className="border-t border-border-strong pt-5">
            <span className="font-mono text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-1 text-sm text-accent">{step.duration}</p>
            <p className="mt-4 text-sm text-fg-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
```

`src/components/sections/faq-section.tsx`:

```tsx
import { Plus } from "lucide-react";
import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/content/types";

export function FaqSection({ dict }: { dict: Dictionary }) {
  return (
    <Section id="faq" head={dict.sections.faq}>
      <div data-reveal className="divide-y divide-border border-y border-border">
        {dict.faq.items.map((item) => (
          <details key={item.q} name="faq" className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-base font-medium [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus
                className="h-4 w-4 shrink-0 text-fg-subtle motion-safe:transition-transform motion-safe:duration-200 group-open:rotate-45"
                aria-hidden
              />
            </summary>
            <p className="max-w-2xl text-pretty pb-6 text-fg-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
```

> If `tsc` rejects `name="faq"` on `<details>`, check `@types/react` version supports it (React 19 types do). Do not silence with a cast; upgrade `@types/react` within `^19`.

Add `<ProcessSection dict={dict} />` and `<FaqSection dict={dict} />` after `AboutSection` in the home page.

- [ ] **Step 4: Run, gate, commit**

```bash
npx playwright test e2e/content-sections.spec.ts --project=desktop && npm run lint && npx tsc --noEmit
git add src/components/sections/process-section.tsx src/components/sections/faq-section.tsx "src/app/[locale]/page.tsx" e2e/content-sections.spec.ts
git commit -m "feat: add process row and native details FAQ"
```

### Task 15: Contact, footer, copy-email

**Files:**
- Create: `src/components/copy-email-button.tsx`
- Create: `src/components/sections/contact-section.tsx` (overwrites), `src/components/site-footer.tsx` (overwrites)
- Modify: `src/components/page-shell.tsx`, `src/app/[locale]/page.tsx`
- Modify: `e2e/content-sections.spec.ts`

**Interfaces:**
- Consumes: `siteConfig.contact` (`email: string | null`, `telegram`, `phone`, `github`, `cv: string | null`), `Dictionary['contact'|'footer'|'a11y']`.
- Produces: `CopyEmailButton({ email, label, copiedLabel, failedLabel })` (client), `ContactSection({ dict })`, `SiteFooter({ dict })`.

> **Email is optional.** With `siteConfig.contact.email === null` (the default until the owner confirms an address) the primary action is the Telegram link, the copy button is not rendered, and Telegram is not repeated in the list below it. With an email configured, the email is the primary action.

- [ ] **Step 1: Append failing e2e tests**

```ts
test.describe("contact", () => {
  const { email, telegram, phone, github, cv } = siteConfig.contact;

  test("the primary action matches what is configured; other channels listed without duplicates", async ({ page }) => {
    await page.goto("/en");
    const contact = page.locator("#contact");
    if (email) {
      await expect(contact.getByRole("link", { name: email })).toHaveAttribute("href", `mailto:${email}`);
    } else {
      await expect(contact.locator(`a[href^="mailto:"]`)).toHaveCount(0);
      await expect(contact.getByRole("button", { name: "Copy email" })).toHaveCount(0);
    }
    await expect(contact.locator(`a[href="${telegram.url}"]`)).toHaveCount(1);
    await expect(contact.locator(`a[href="${phone.href}"]`)).toHaveCount(1);
    await expect(contact.locator(`a[href="${github}"]`)).toHaveCount(1);
    await expect(contact.getByRole("link", { name: "Download CV" })).toHaveCount(cv ? 1 : 0);
  });

  test("copy button writes the email to the clipboard and announces the result", async ({ page, context, browserName }) => {
    test.skip(!email, "no public email configured");
    test.skip(browserName !== "chromium", "clipboard permissions are chromium-specific");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/en");
    await page.getByRole("button", { name: "Copy email" }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(email);
    await expect(page.getByRole("status")).toHaveText("Copied");
  });

  test("footer is present with a GitHub link and a back-to-top link", async ({ page }) => {
    await page.goto("/en");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", github);
    await expect(footer.getByRole("link", { name: "Back to top" })).toHaveAttribute("href", "#main");
  });
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npx playwright test e2e/content-sections.spec.ts --project=desktop
```
Expected: contact tests FAIL.

- [ ] **Step 3: Implement**

`src/components/copy-email-button.tsx`:

```tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyEmailButtonProps {
  email: string;
  label: string;
  copiedLabel: string;
  failedLabel: string;
}

export function CopyEmailButton({ email, label, copiedLabel, failedLabel }: CopyEmailButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission); the mailto link stays usable.
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2000);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-fg-muted transition-colors hover:border-fg hover:text-fg"
      >
        {state === "copied" ? <Check className="h-4 w-4 text-accent" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? copiedLabel : state === "failed" ? failedLabel : ""}
      </span>
    </>
  );
}
```

`src/components/sections/contact-section.tsx`:

```tsx
import { ArrowUpRight } from "lucide-react";
import { CopyEmailButton } from "@/components/copy-email-button";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/content/types";

export function ContactSection({ dict }: { dict: Dictionary }) {
  const { contact } = siteConfig;
  const labels = dict.contact.labels;
  const primaryIsEmail = contact.email !== null;

  const rows = [
    { key: "telegram", label: labels.telegram, value: contact.telegram.handle, href: contact.telegram.url, external: true },
    { key: "phone", label: labels.phone, value: contact.phone.display, href: contact.phone.href, external: false },
    { key: "github", label: labels.github, value: contact.github.replace("https://", ""), href: contact.github, external: true },
    ...(contact.cv ? [{ key: "cv", label: labels.cv, value: "PDF", href: contact.cv, external: true }] : []),
  ].filter((row) => primaryIsEmail || row.key !== "telegram");

  const bigLink =
    "break-all text-[clamp(1.25rem,4.5vw,3rem)] font-semibold tracking-[-0.03em] transition-colors hover:text-accent";

  return (
    <Section id="contact" head={dict.sections.contact}>
      <div data-reveal>
        <p className="text-sm text-fg-subtle">{primaryIsEmail ? labels.email : labels.telegram}</p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {contact.email !== null ? (
            <>
              <a href={`mailto:${contact.email}`} className={bigLink}>
                {contact.email}
              </a>
              <CopyEmailButton
                email={contact.email}
                label={dict.a11y.copyEmail}
                copiedLabel={dict.a11y.copied}
                failedLabel={dict.a11y.copyFailed}
              />
            </>
          ) : (
            <a href={contact.telegram.url} target="_blank" rel="noopener noreferrer" className={bigLink}>
              {contact.telegram.handle}
            </a>
          )}
        </div>
        <p className="mt-3 text-sm text-fg-muted">{dict.contact.response}</p>
      </div>

      <ul className="mt-14 divide-y divide-border border-y border-border">
        {rows.map((row) => (
          <li key={row.key}>
            <a
              href={row.href}
              target={row.external ? "_blank" : undefined}
              rel={row.external ? "noopener noreferrer" : undefined}
              className="group flex min-h-14 items-center justify-between gap-4 py-3 transition-colors hover:text-accent"
            >
              <span className="text-fg-muted group-hover:text-inherit">{row.label}</span>
              <span className="flex items-center gap-2 font-mono text-sm">
                {row.value}
                <ArrowUpRight
                  className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
```

`src/components/site-footer.tsx` (overwrite):

```tsx
import { ArrowUp, Github } from "lucide-react";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/content/types";

const iconLink =
  "flex h-10 w-10 items-center justify-center rounded-lg border border-border text-fg-muted transition-colors hover:border-fg hover:text-fg touch:h-11 touch:w-11";

export function SiteFooter({ dict }: { dict: Dictionary }) {
  return (
    <footer className="border-t border-border py-10">
      <Container>
        <div className="flex flex-col gap-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">{dict.footer.tagline}</p>
            <p className="mt-1 text-xs text-fg-subtle">{dict.footer.note}</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={siteConfig.contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={iconLink}>
              <Github className="h-4 w-4" aria-hidden />
            </a>
            <a href="#main" aria-label={dict.a11y.backToTop} className={iconLink}>
              <ArrowUp className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
```

`src/components/page-shell.tsx`: import `SiteFooter` and render `<SiteFooter dict={dict} />` after `</main>`.

Add `<ContactSection dict={dict} />` after `FaqSection` in the home page.

- [ ] **Step 4: Checkpoint gate, commit**

```bash
npm test && npx playwright test --project=desktop && npm run lint && npx tsc --noEmit && npm run build
git add src/components/copy-email-button.tsx src/components/sections/contact-section.tsx src/components/site-footer.tsx src/components/page-shell.tsx "src/app/[locale]/page.tsx" e2e/content-sections.spec.ts
git diff --cached --stat
git commit -m "feat: add contact section with optional email, copy feedback and footer"
```
Expected: every desktop e2e passes; build clean. Do a full visual pass (desktop + 390 px, dark + light) and fix layout bugs in a separate `fix:` commit.

**Checkpoint 3:** hand the owner Appendix A (optional content to approve) and the `npm run check:content` output. Approved items are added to the dictionaries/config in a follow-up commit; unapproved items stay absent.

## Checkpoint 4 — Enhancements and acceptance (Tasks 16–20)

### Task 16: Sitemap, robots, dynamic Open Graph images

**Files:**
- Overwrite: `src/app/sitemap.ts`, `src/app/robots.ts`
- Create: `assets/fonts/Inter-latin-400.woff`, `Inter-vietnamese-400.woff`, `Inter-latin-600.woff`, `Inter-vietnamese-600.woff`
- Create: `src/lib/og.tsx`, `src/app/[locale]/opengraph-image.tsx`, `src/app/[locale]/projects/[slug]/opengraph-image.tsx`
- Test: `src/lib/og.test.ts`, `src/app/robots.test.ts`, `e2e/seo.spec.ts`

**Interfaces:**
- Produces: `renderOg({ eyebrow, title, subtitle, footer }): Promise<ImageResponse>`.

- [ ] **Step 1: Write the failing tests**

`src/app/robots.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getSiteUrl } from "@/lib/site-url";
import robots from "./robots";

describe("robots", () => {
  it("allows everything and points at the sitemap on the canonical site url", () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(r.sitemap).toBe(`${getSiteUrl()}/sitemap.xml`);
  });
});
```

`src/lib/og.test.ts`:

```ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("og fonts", () => {
  it.each(["latin-400", "vietnamese-400", "latin-600", "vietnamese-600"])("Inter-%s.woff is bundled", (name) => {
    expect(existsSync(join(process.cwd(), "assets/fonts", `Inter-${name}.woff`))).toBe(true);
  });
});
```

`e2e/seo.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("sitemap lists both locales and every case study with hreflang alternates", async ({ request }) => {
  const body = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/vi", "/en", "/vi/projects/hadi", "/en/projects/hnwedding"]) expect(body).toContain(path);
  expect(body).toContain('hreflang="en"');
  expect(body).toContain('hreflang="vi"');
});

test("robots.txt references the sitemap", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
});

test("open graph images render as PNG for home and a case study", async ({ request }) => {
  for (const path of ["/vi/opengraph-image", "/en/projects/hadi/opengraph-image"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  }
});

test("pages advertise their og:image", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
  await page.goto("/en/projects/hadi");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /projects\/hadi\/opengraph-image/);
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npx vitest run src/app/robots.test.ts src/lib/og.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Sitemap and robots**

`src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { sitemapEntries } from "@/lib/sitemap-entries";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries();
}
```

`src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
```

- [ ] **Step 4: Bundle the OG fonts (Latin + Vietnamese subsets; satori has no font fallback for diacritics)**

```bash
npm install --no-save @fontsource/inter
mkdir -p assets/fonts
for w in 400 600; do
  cp "node_modules/@fontsource/inter/files/inter-latin-$w-normal.woff" "assets/fonts/Inter-latin-$w.woff"
  cp "node_modules/@fontsource/inter/files/inter-vietnamese-$w-normal.woff" "assets/fonts/Inter-vietnamese-$w.woff"
done
ls -la assets/fonts
```
Expected: four `.woff` files. (`--no-save` keeps `@fontsource/inter` out of `package.json`; the files are committed. Inter is OFL-licensed.)

- [ ] **Step 5: OG renderer and routes**

`src/lib/og.tsx`:

```tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const fontFiles = [
  ["Inter-latin-400.woff", 400],
  ["Inter-vietnamese-400.woff", 400],
  ["Inter-latin-600.woff", 600],
  ["Inter-vietnamese-600.woff", 600],
] as const;

async function loadFonts() {
  return Promise.all(
    fontFiles.map(async ([file, weight]) => ({
      name: "Inter",
      data: await readFile(join(process.cwd(), "assets/fonts", file)),
      weight,
      style: "normal" as const,
    })),
  );
}

interface OgProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
}

export async function renderOg({ eyebrow, title, subtitle, footer }: OgProps) {
  const fonts = await loadFonts();
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#0a0a0b",
          color: "#ededef",
          padding: 72,
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#a1a1aa" }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#6ee7b7" }} />
          <div>{eyebrow}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 32, color: "#a1a1aa", lineHeight: 1.4, maxWidth: 940 }}>{subtitle}</div>
        </div>
        <div style={{ fontSize: 26, color: "#8a8a93" }}>{footer}</div>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );
}
```

`src/app/[locale]/opengraph-image.tsx`:

```tsx
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content/dictionary";
import { isLocale, locales } from "@/lib/i18n/config";
import { renderOg } from "@/lib/og";
import { getSiteUrl } from "@/lib/site-url";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.jobTitle}`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return renderOg({
    eyebrow: dict.hero.status,
    title: siteConfig.name,
    subtitle: dict.hero.headline,
    footer: new URL(getSiteUrl()).host,
  });
}
```

`src/app/[locale]/projects/[slug]/opengraph-image.tsx`:

```tsx
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content/dictionary";
import { isProjectSlug, projectSlugs, projectsData } from "@/content/projects";
import { isLocale, locales } from "@/lib/i18n/config";
import { renderOg } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Case study";

export function generateStaticParams() {
  return locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isProjectSlug(slug)) notFound();
  const copy = getDictionary(locale).work.items[slug];
  return renderOg({
    eyebrow: copy.category,
    title: copy.title,
    subtitle: copy.summary,
    footer: `${siteConfig.name} · ${projectsData[slug].stack.slice(0, 4).join(" · ")}`,
  });
}
```

- [ ] **Step 6: Verify, including a visual check of Vietnamese glyphs**

```bash
npx vitest run src/app/robots.test.ts src/lib/og.test.ts
npm run build
npx playwright test e2e/seo.spec.ts --project=desktop
```
Then view the Vietnamese image: start `npm run start -- -p 3100` in the background, `curl -s localhost:3100/vi/opengraph-image -o $TMPDIR/og-vi.png`, and open `$TMPDIR/og-vi.png` with the Read tool. Confirm "Nguyễn Mạnh Hùng" and "từ ý tưởng đến production" render with correct diacritics (no tofu boxes). If any glyph is missing, add `inter-latin-ext-*` to the bundle and to `fontFiles`.

- [ ] **Step 7: Gate, commit**

```bash
npm run lint && npx tsc --noEmit
git add src/app/sitemap.ts src/app/robots.ts src/app/robots.test.ts src/lib/og.tsx src/lib/og.test.ts "src/app/[locale]/opengraph-image.tsx" "src/app/[locale]/projects/[slug]/opengraph-image.tsx" assets/fonts e2e/seo.spec.ts
git commit -m "feat: add localized sitemap, robots and dynamic og images with vietnamese glyphs"
```



### Task 17: Enhancements — scroll progress and command palette (Ctrl/⌘ + K)

> Delivered **after** the core site passes its gates. If the schedule slips, this task can be dropped without touching anything else (remove the two header additions and the CSS block).

**Files:**
- Create: `src/components/scroll-progress.tsx`
- Create: `src/lib/search.ts`, `src/lib/palette-items.ts`, `src/components/command-palette.tsx`
- Modify: `src/components/site-header.tsx`, `src/app/globals.css`
- Test: `src/lib/search.test.ts`, `src/lib/palette-items.test.ts`, `e2e/palette.spec.ts`

**Interfaces:**
- Produces: `normalizeSearch(s)`, `matchesQuery(label, query)`; `PaletteGroup`, `PaletteAction`, `PaletteItem`, `buildPaletteItems(locale, dict, email?): PaletteItem[]`; `CommandPalette({ items, labels })` (client); `ScrollProgress()`.

- [ ] **Step 1: Write the failing unit tests**

`src/lib/search.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { matchesQuery, normalizeSearch } from "./search";

describe("normalizeSearch", () => {
  it("strips Vietnamese diacritics and maps đ/Đ to d", () => {
    expect(normalizeSearch("Dự án")).toBe("du an");
    expect(normalizeSearch("Đang xây")).toBe("dang xay");
    expect(normalizeSearch("  Về MÌNH ")).toBe("ve minh");
  });
});

describe("matchesQuery", () => {
  it("matches without diacritics, case-insensitively", () => {
    expect(matchesQuery("Dự án", "du an")).toBe(true);
    expect(matchesQuery("Dịch vụ", "DICH VU")).toBe(true);
    expect(matchesQuery("Đang xây", "dang")).toBe(true);
  });
  it("matches tokens in any order", () => {
    expect(matchesQuery("Dự án", "an du")).toBe(true);
  });
  it("treats an empty query as match-all and rejects non-matches", () => {
    expect(matchesQuery("Work", "")).toBe(true);
    expect(matchesQuery("Work", "   ")).toBe(true);
    expect(matchesQuery("Work", "xyz")).toBe(false);
  });
});
```

`src/lib/palette-items.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getDictionary } from "@/content/dictionary";
import { locales } from "@/lib/i18n/config";
import { buildPaletteItems } from "./palette-items";

describe("buildPaletteItems", () => {
  it.each(locales)("with an email: 6 sections, 2 projects, 4 actions for %s, unique ids", (locale) => {
    const items = buildPaletteItems(locale, getDictionary(locale), "someone@example.com");
    expect(items.filter((i) => i.group === "sections")).toHaveLength(6);
    expect(items.filter((i) => i.group === "projects")).toHaveLength(2);
    expect(items.filter((i) => i.group === "actions")).toHaveLength(4);
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
    for (const item of items) expect(item.label.trim()).not.toBe("");
  });

  it("without a public email there is no copy-email action at all", () => {
    const items = buildPaletteItems("en", getDictionary("en"), null);
    expect(items.some((i) => i.id === "copy-email")).toBe(false);
    expect(items.filter((i) => i.group === "actions")).toHaveLength(3);
  });

  it("links are locale-prefixed and use the legacy-compatible section id", () => {
    const items = buildPaletteItems("vi", getDictionary("vi"), null);
    expect(items.find((i) => i.id === "section-projects")?.action).toEqual({ kind: "link", href: "/vi#projects" });
    expect(items.find((i) => i.id === "project-hadi")?.action).toEqual({ kind: "link", href: "/vi/projects/hadi" });
  });

  it("language action targets the other locale; copy action carries the email", () => {
    const en = buildPaletteItems("en", getDictionary("en"), "a@b.co");
    expect(en.find((i) => i.id === "switch-language")?.action).toEqual({ kind: "locale", target: "vi" });
    expect(en.find((i) => i.id === "copy-email")?.action).toEqual({ kind: "copy", value: "a@b.co" });
  });
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npx vitest run src/lib/search.test.ts src/lib/palette-items.test.ts
```
Expected: FAIL (modules missing).

- [ ] **Step 3: Implement the pure modules**

`src/lib/search.ts`:

```ts
export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim();
}

export function matchesQuery(label: string, query: string): boolean {
  const tokens = normalizeSearch(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const target = normalizeSearch(label);
  return tokens.every((token) => target.includes(token));
}
```

`src/lib/palette-items.ts`:

```ts
import { siteConfig } from "@/config/site";
import { projectSlugs } from "@/content/projects";
import type { Dictionary, SectionId } from "@/content/types";
import { locales, type Locale } from "@/lib/i18n/config";
import { localePath, projectPath } from "@/lib/i18n/paths";

export type PaletteGroup = "sections" | "projects" | "actions";

export type PaletteAction =
  | { kind: "link"; href: string }
  | { kind: "copy"; value: string }
  | { kind: "theme" }
  | { kind: "locale"; target: Locale };

export interface PaletteItem {
  id: string;
  group: PaletteGroup;
  label: string;
  action: PaletteAction;
}

const sectionOrder: SectionId[] = ["projects", "services", "about", "process", "faq", "contact"];

export function buildPaletteItems(
  locale: Locale,
  dict: Dictionary,
  email: string | null = siteConfig.contact.email,
): PaletteItem[] {
  const other = locales.find((l) => l !== locale) as Locale;
  const sections = sectionOrder.map(
    (id): PaletteItem => ({
      id: `section-${id}`,
      group: "sections",
      label: dict.sections[id].label,
      action: { kind: "link", href: localePath(locale, `#${id}`) },
    }),
  );
  const projects = projectSlugs.map(
    (slug): PaletteItem => ({
      id: `project-${slug}`,
      group: "projects",
      label: dict.work.items[slug].title,
      action: { kind: "link", href: projectPath(locale, slug) },
    }),
  );
  const actions: PaletteItem[] = [
    ...(email
      ? [{ id: "copy-email", group: "actions", label: dict.palette.actions.copyEmail, action: { kind: "copy", value: email } } satisfies PaletteItem]
      : []),
    { id: "github", group: "actions", label: dict.palette.actions.github, action: { kind: "link", href: siteConfig.contact.github } },
    { id: "switch-language", group: "actions", label: dict.palette.actions.switchLanguage, action: { kind: "locale", target: other } },
    { id: "toggle-theme", group: "actions", label: dict.palette.actions.toggleTheme, action: { kind: "theme" } },
  ];
  return [...sections, ...projects, ...actions];
}
```

- [ ] **Step 4: Run to verify pass**

```bash
npx vitest run src/lib/search.test.ts src/lib/palette-items.test.ts
```
Expected: pass.

- [ ] **Step 5: Write the failing e2e tests**

`e2e/palette.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { siteConfig } from "../src/config/site";

test("Ctrl+K and Meta+K toggle the palette; the input is labelled and focused", async ({ page }) => {
  await page.goto("/en");
  for (const combo of ["Control+K", "Meta+K"]) {
    await page.keyboard.press(combo);
    const input = page.getByRole("combobox", { name: "Search sections, projects or actions…" });
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
    await page.keyboard.press(combo);
    await expect(page.getByRole("dialog")).toBeHidden();
  }
});

test("the trigger button opens it and Escape returns focus to the trigger", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 640, "trigger is hidden below sm; the shortcut still works");
  await page.goto("/en");
  const trigger = page.getByRole("button", { name: "Open command palette" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("Tab and Shift+Tab never leave the dialog", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Control+K");
  for (const key of ["Tab", "Tab", "Shift+Tab", "Shift+Tab", "Shift+Tab"]) {
    await page.keyboard.press(key);
    expect(await page.evaluate(() => document.activeElement?.closest("dialog") !== null)).toBe(true);
  }
});

test("arrow keys move the selection, wrap around and keep it scrolled into view", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 420 });
  await page.goto("/en");
  await page.keyboard.press("Control+K");
  const options = page.getByRole("option");
  await expect(options.first()).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("ArrowDown");
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("ArrowUp"); // wraps to the last option
  const last = options.last();
  await expect(last).toHaveAttribute("aria-selected", "true");

  const list = (await page.getByRole("listbox").boundingBox())!;
  const box = (await last.boundingBox())!;
  expect(box.y).toBeGreaterThanOrEqual(list.y - 1);
  expect(box.y + box.height).toBeLessThanOrEqual(list.y + list.height + 1);
});

test("Vietnamese search works without diacritics and Enter navigates", async ({ page }) => {
  await page.goto("/vi");
  await page.keyboard.press("Control+K");
  await page.getByRole("combobox").fill("du an");
  await expect(page.getByRole("option", { name: "Dự án" }).first()).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).toHaveURL(/\/vi#projects$/);
});

test("filtering then Enter opens the selected project", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Control+K");
  await page.getByRole("combobox").fill("had");
  await expect(page.getByRole("option", { name: "Hadi" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en\/projects\/hadi$/);
});

test("no-match query shows the empty state", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Control+K");
  await page.getByRole("combobox").fill("zzzz");
  await expect(page.getByText("No results")).toBeVisible();
});

test("copy email action gives feedback; it does not exist without a public email", async ({ page, context, browserName }) => {
  await page.goto("/en");
  await page.keyboard.press("Control+K");
  await page.getByRole("combobox").fill("copy");
  if (!siteConfig.contact.email) {
    await expect(page.getByRole("option")).toHaveCount(0);
    return;
  }
  test.skip(browserName !== "chromium", "clipboard permissions are chromium-specific");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(siteConfig.contact.email);
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("actions: switch language and toggle theme", async ({ page }) => {
  await page.goto("/vi");
  await page.keyboard.press("Control+K");
  await page.getByRole("combobox").fill("switch");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en$/);

  await page.keyboard.press("Control+K");
  await page.getByRole("combobox").fill("theme");
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("scroll-progress bar is present normally and hidden under reduced motion", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator(".scroll-progress")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".scroll-progress")).toBeHidden();
});
```

- [ ] **Step 6: Run to verify failure**

```bash
npx playwright test e2e/palette.spec.ts --project=desktop
```
Expected: FAIL.

- [ ] **Step 7: Implement the components**

`src/components/scroll-progress.tsx`:

```tsx
export function ScrollProgress() {
  return <div aria-hidden className="scroll-progress absolute inset-x-0 -bottom-px h-0.5 bg-accent" />;
}
```

`src/components/command-palette.tsx`:

```tsx
"use client";

import { Search } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { LOCALE_COOKIE } from "@/lib/i18n/config";
import { switchLocalePath } from "@/lib/i18n/paths";
import type { PaletteGroup, PaletteItem } from "@/lib/palette-items";
import { matchesQuery } from "@/lib/search";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  items: PaletteItem[];
  labels: {
    open: string;
    placeholder: string;
    empty: string;
    hint: string;
    copied: string;
    copyFailed: string;
    groups: Record<PaletteGroup, string>;
  };
}

const groupOrder: PaletteGroup[] = ["sections", "projects", "actions"];

export function CommandPalette({ items, labels }: CommandPaletteProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const listId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState("");

  const results = useMemo(
    () => groupOrder.flatMap((group) => items.filter((item) => item.group === group && matchesQuery(item.label, query))),
    [items, query],
  );
  const activeItem = results[active];

  const openPalette = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setQuery("");
    setActive(0);
    setNotice("");
    dialogRef.current?.showModal();
  }, []);

  const closePalette = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogRef.current?.open) closePalette();
        else openPalette();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(closeTimer.current);
    };
  }, [openPalette, closePalette]);

  useEffect(() => {
    if (!activeItem) return;
    document.getElementById(`${listId}-${activeItem.id}`)?.scrollIntoView({ block: "nearest" });
  }, [activeItem, listId]);

  function run(item: PaletteItem) {
    const { action } = item;
    if (action.kind === "copy") {
      // Keep the dialog open just long enough to tell the visitor what happened.
      // `Promise.resolve().then` also catches the synchronous throw when the Clipboard API is unavailable.
      Promise.resolve()
        .then(() => navigator.clipboard.writeText(action.value))
        .then(
          () => setNotice(labels.copied),
          () => setNotice(labels.copyFailed),
        )
        .finally(() => {
          closeTimer.current = window.setTimeout(closePalette, 900);
        });
      return;
    }
    closePalette();
    if (action.kind === "link") {
      if (action.href.startsWith("http")) window.open(action.href, "_blank", "noopener,noreferrer");
      else router.push(action.href);
    } else if (action.kind === "theme") {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    } else {
      document.cookie = `${LOCALE_COOKIE}=${action.target}; path=/; max-age=31536000; samesite=lax`;
      router.push(switchLocalePath(pathname, action.target));
    }
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeItem) run(activeItem);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        aria-label={labels.open}
        aria-haspopup="dialog"
        aria-keyshortcuts="Control+K Meta+K"
        className="hidden h-10 items-center gap-2 rounded-lg px-2.5 text-fg-muted transition-colors hover:text-fg sm:flex"
      >
        <Search className="h-[18px] w-[18px]" aria-hidden />
        <kbd className="hidden rounded-md border border-border px-1.5 py-0.5 font-mono text-[11px] lg:inline">Ctrl K</kbd>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={labels.open}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePalette();
        }}
        className="palette fixed inset-auto left-1/2 top-[14vh] m-0 w-[min(36rem,calc(100vw-2rem))] max-w-none -translate-x-1/2 rounded-xl border border-border-strong bg-surface p-0 text-fg backdrop:bg-black/50"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 focus-within:border-accent">
          <Search className="h-4 w-4 shrink-0 text-fg-subtle" aria-hidden />
          <input
            role="combobox"
            aria-label={labels.placeholder}
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeItem ? `${listId}-${activeItem.id}` : undefined}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder={labels.placeholder}
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-fg-subtle"
          />
        </div>

        <div id={listId} role="listbox" aria-label={labels.open} className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-fg-subtle">{labels.empty}</p>
          ) : (
            groupOrder.map((group) => {
              const groupItems = results.filter((item) => item.group === group);
              if (groupItems.length === 0) return null;
              return (
                <div key={group} role="group" aria-label={labels.groups[group]}>
                  <p aria-hidden className="px-3 pb-1 pt-3 text-xs text-fg-subtle">
                    {labels.groups[group]}
                  </p>
                  {groupItems.map((item) => {
                    const index = results.indexOf(item);
                    const selected = index === active;
                    return (
                      <div
                        key={item.id}
                        id={`${listId}-${item.id}`}
                        role="option"
                        aria-selected={selected}
                        onMouseMove={() => setActive(index)}
                        onClick={() => run(item)}
                        className={cn(
                          "flex h-11 cursor-pointer items-center rounded-lg px-3 text-sm",
                          selected ? "bg-fg/10 text-fg" : "text-fg-muted",
                        )}
                      >
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <p role="status" aria-live="polite" className="border-t border-border px-4 py-3 text-xs text-fg-subtle">
          {notice || labels.hint}
        </p>
      </dialog>
    </>
  );
}
```

Append to `src/app/globals.css`:

```css
/* Hidden by default: it only shows where the browser can drive it from scroll position and motion is allowed. */
.scroll-progress {
  display: none;
}

@media (prefers-reduced-motion: no-preference) {
  @keyframes palette-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .palette[open] {
    animation: palette-in 0.15s ease-out;
  }

  @supports (animation-timeline: scroll()) {
    @keyframes scroll-grow {
      from {
        transform: scaleX(0);
      }
      to {
        transform: scaleX(1);
      }
    }

    .scroll-progress {
      display: block;
      transform-origin: 0 50%;
      animation: scroll-grow linear both;
      animation-timeline: scroll(root);
    }
  }
}
```

In `src/components/site-header.tsx` add imports (`CommandPalette`, `ScrollProgress`, `buildPaletteItems`), render this first in the right-hand cluster:

```tsx
<CommandPalette
  items={buildPaletteItems(locale, dict)}
  labels={{ ...dict.palette, copied: dict.a11y.copied, copyFailed: dict.a11y.copyFailed }}
/>
```

and `<ScrollProgress />` as the last child of `<header>` (after `</Container>`).

- [ ] **Step 8: Run, gate, commit**

```bash
npm test && npx playwright test e2e/palette.spec.ts --project=desktop && npm run lint && npx tsc --noEmit
git add src/lib/search.ts src/lib/search.test.ts src/lib/palette-items.ts src/lib/palette-items.test.ts src/components/command-palette.tsx src/components/scroll-progress.tsx src/components/site-header.tsx src/app/globals.css e2e/palette.spec.ts
git diff --cached --stat
git commit -m "feat: add keyboard command palette and scroll progress bar"
```

### Task 18: Remove the old design, dependencies, readiness script, docs

**Files:**
- Delete (exact list below)
- Modify: `package.json`, `package-lock.json`, `src/config/site.ts`, `README.md`, the two June docs
- Create: `scripts/content-gaps.ts`, `scripts/check-content.ts`, `scripts/content-gaps.test.ts`

> This is the only task (besides the root-layout removal in Task 7) allowed to delete files. The list was reviewed with the plan. **Safety net:** delete first, then `tsc`/`lint`/`build`/tests must still pass — any leftover importer fails the gate, which proves the deletions were safe.

- [ ] **Step 1: Write the failing readiness test**

`scripts/content-gaps.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { findContentGaps } from "./content-gaps";

const complete = {
  email: "someone@example.com" as string | null,
  portrait: { src: "/portrait.jpg" } as { src: string } | null,
  cv: "/cv/cv.pdf" as string | null,
  projects: [{ slug: "a", hasRole: true, links: { live: "https://a.dev", repo: "https://github.com/x/a" } }],
};

describe("findContentGaps", () => {
  it("reports nothing when every owner input is present and files exist", () => {
    expect(findContentGaps(complete, () => true)).toEqual([]);
  });

  it("reports every missing optional input", () => {
    const gaps = findContentGaps(
      { email: null, portrait: null, cv: null, projects: [{ slug: "a", hasRole: false, links: {} }] },
      () => true,
    );
    expect(gaps.map((g) => g.id)).toEqual([
      "email",
      "portrait",
      "cv",
      "project-a-live",
      "project-a-repo",
      "project-a-role",
    ]);
  });

  it("reports configured files that do not exist on disk", () => {
    expect(findContentGaps(complete, () => false).map((g) => g.id)).toEqual(["portrait-file", "cv-file"]);
  });

  it("rejects a malformed email but treats null as merely 'not provided'", () => {
    expect(findContentGaps({ ...complete, email: "nope" }, () => true).map((g) => g.id)).toEqual(["email-invalid"]);
    expect(findContentGaps({ ...complete, email: null }, () => true).map((g) => g.id)).toEqual(["email"]);
  });
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npx vitest run scripts
```
Expected: FAIL.

- [ ] **Step 3: Implement the readiness helpers**

`scripts/content-gaps.ts`:

```ts
export interface ContentGap {
  id: string;
  message: string;
}

interface ContentInputs {
  email: string | null;
  portrait: { src: string } | null;
  cv: string | null;
  projects: { slug: string; hasRole: boolean; links: { live?: string; repo?: string } }[];
}

export function findContentGaps(inputs: ContentInputs, fileExists: (publicPath: string) => boolean): ContentGap[] {
  const gaps: ContentGap[] = [];

  if (inputs.email === null) {
    gaps.push({ id: "email", message: "No public email: set siteConfig.contact.email once the owner confirms an address." });
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inputs.email)) {
    gaps.push({ id: "email-invalid", message: "siteConfig.contact.email is not a valid email address." });
  }

  if (!inputs.portrait) {
    gaps.push({ id: "portrait", message: "No portrait: set siteConfig.portrait (About section + JSON-LD image)." });
  } else if (!fileExists(inputs.portrait.src)) {
    gaps.push({ id: "portrait-file", message: `Portrait file missing in /public: ${inputs.portrait.src}` });
  }

  if (!inputs.cv) {
    gaps.push({ id: "cv", message: "No CV: set siteConfig.contact.cv to a PDF under /public." });
  } else if (!fileExists(inputs.cv)) {
    gaps.push({ id: "cv-file", message: `CV file missing in /public: ${inputs.cv}` });
  }

  for (const project of inputs.projects) {
    if (!project.links.live) gaps.push({ id: `project-${project.slug}-live`, message: `${project.slug}: no live URL.` });
    if (!project.links.repo) gaps.push({ id: `project-${project.slug}-repo`, message: `${project.slug}: no repository URL.` });
    if (!project.hasRole) gaps.push({ id: `project-${project.slug}-role`, message: `${project.slug}: no confirmed role (Appendix A).` });
  }
  return gaps;
}
```

`scripts/check-content.ts`:

```ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import { siteConfig } from "../src/config/site";
import { getDictionary } from "../src/content/dictionary";
import { projectSlugs, projectsData } from "../src/content/projects";
import { findContentGaps } from "./content-gaps";

const dict = getDictionary("vi");

const gaps = findContentGaps(
  {
    email: siteConfig.contact.email,
    portrait: siteConfig.portrait,
    cv: siteConfig.contact.cv,
    projects: projectSlugs.map((slug) => ({
      slug,
      hasRole: Boolean(dict.work.items[slug].role),
      links: projectsData[slug].links,
    })),
  },
  (publicPath) => existsSync(join(process.cwd(), "public", publicPath)),
);

if (gaps.length === 0) {
  console.log("All owner inputs are provided.");
} else {
  console.log(`${gaps.length} optional owner input(s) still missing (pages render without them):`);
  for (const gap of gaps) console.log(` - ${gap.message}`);
}
```

- [ ] **Step 4: Run to verify pass**

```bash
npx vitest run scripts && npm run check:content
```
Expected: tests pass; the report lists email, portrait, cv, four project links and two roles.

- [ ] **Step 5: Delete the old design (exact list)**

Confirm each public asset is unreferenced first:

```bash
grep -rnE "aurora-cover|pulse-dashboard|sonder-showcase|og-cover|portrait\.svg|/file\.svg|/globe\.svg|/next\.svg|/vercel\.svg|/window\.svg" src e2e scripts || echo "no references"
```
Expected: only `siteConfig.ogImage` (`/og-cover.png`) in `src/config/site.ts`, removed in Step 6.

```bash
git rm \
  src/content/index.ts \
  src/components/providers/locale-provider.tsx src/components/providers/lenis-provider.tsx \
  src/components/action-button.tsx \
  src/components/effects/aurora-background.tsx src/components/effects/custom-cursor.tsx \
  src/components/effects/magnetic.tsx src/components/effects/number-counter.tsx \
  src/components/effects/split-text.tsx src/components/effects/tilt-card.tsx \
  src/hooks/use-magnetic.ts src/hooks/use-media-query.ts src/hooks/use-tilt.ts \
  src/lib/animations.ts src/lib/gsap.ts \
  src/components/sections/projects-section.tsx src/components/sections/stack-section.tsx \
  public/projects/aurora-cover.svg public/projects/pulse-dashboard.svg public/projects/sonder-showcase.svg \
  public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg \
  public/og-cover.png public/portrait.svg
```
Do not touch `public/assets/*.pdf`.

- [ ] **Step 6: Trim legacy config and dependencies**

In `src/config/site.ts` remove the legacy fields (`description`, `ogImage`, `keywords`, `authors`, `creator`) from both `SiteConfig` and `siteConfig`, keeping `name`, `url`, `twitter` and all new fields.

```bash
npm uninstall gsap @gsap/react lenis framer-motion react-hook-form @hookform/resolvers zod
```

- [ ] **Step 7: Rewrite the README and mark old docs superseded**

`README.md`:

````markdown
# Nguyễn Mạnh Hùng — Portfolio

Bilingual (vi/en) portfolio for a product engineer working on web and mobile. Next.js 16 App Router; content pages are prerendered per locale and a proxy negotiates the locale per request.

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
````

```bash
for f in docs/superpowers/specs/2026-06-15-portfolio-redesign-design.md docs/superpowers/plans/2026-06-15-portfolio-redesign.md; do
  { head -n1 "$f"; printf '\n> **Superseded** by the 2026-10-10 Product Engineer redesign (`docs/superpowers/specs/2026-10-10-product-engineer-redesign-design.md`). Kept for history.\n'; tail -n +2 "$f"; } > "$f.tmp" && mv "$f.tmp" "$f"
done
```

- [ ] **Step 8: Full gate, commit**

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build && npx playwright test --project=desktop
```
Expected: all green. If `tsc` reports a missing import, a deleted file still had a consumer — restore only that file with `git checkout HEAD -- <path>`, fix the consumer, and re-delete.

```bash
git add package.json package-lock.json README.md src/config/site.ts scripts \
  docs/superpowers/specs/2026-06-15-portfolio-redesign-design.md docs/superpowers/plans/2026-06-15-portfolio-redesign.md
git diff --cached --stat
git commit -m "chore: remove aurora/gsap design, unused deps and assets; add content readiness check"
git status --short
```
Expected after commit: only `?? .crossweave/` remains (the `git rm` deletions were already staged).

### Task 19: Cross-cutting e2e — accessibility, layout, motion, legacy links, integrity

**Files:**
- Create: `e2e/a11y.spec.ts`, `e2e/layout.spec.ts`, `e2e/motion.spec.ts`

- [ ] **Step 1: Accessibility (axe) in both themes**

`e2e/a11y.spec.ts`:

```ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const paths = ["/vi", "/en", "/en/projects/hadi", "/vi/projects/hnwedding", "/en/does-not-exist"];

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
```

> axe does **not** prove keyboard, screen-reader or target-size quality. Those are covered by the explicit tests below and by the manual checklist in Task 20.

- [ ] **Step 2: Layout, touch targets, legacy links, link integrity**

`e2e/layout.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

const paths = ["/vi", "/en", "/vi/projects/hadi", "/en/projects/hnwedding"];

for (const width of [320, 390, 768, 1440]) {
  for (const path of paths) {
    test(`no horizontal overflow at ${width}px: ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}

for (const path of paths) {
  test(`every anchor has a real href and every image loads: ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    const hrefs = await page.locator("a").evaluateAll((els) => els.map((a) => a.getAttribute("href")));
    for (const href of hrefs) expect(href && href !== "#", `bad href: ${String(href)}`).toBeTruthy();

    for (const img of await page.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
  });
}

test("touch targets are at least 44x44 CSS px on coarse pointers", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile project emulates a coarse pointer");
  await page.goto("/en");
  expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
  const tooSmall = await page
    .locator("header button:visible, header a:visible, footer a:visible, summary:visible, #contact a:visible, #contact button:visible")
    .evaluateAll((els) =>
      els
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { name: el.getAttribute("aria-label") ?? el.textContent?.trim().slice(0, 30) ?? el.tagName, w: Math.round(r.width), h: Math.round(r.height) };
        })
        .filter((x) => x.w < 44 || x.h < 44),
    );
  expect(tooSmall).toEqual([]);
});

test("section anchors land below the fixed header", async ({ page, isMobile }) => {
  test.skip(isMobile, "inline nav is desktop only");
  await page.goto("/en");
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Services" }).click();
  await expect(page).toHaveURL(/#services$/);
  await expect.poll(async () => (await page.locator("#services").boundingBox())?.y ?? -1).toBeGreaterThanOrEqual(64);
});

test("old shared links still work: /#projects (through the locale redirect) and /en#stack", async ({ page }) => {
  await page.goto("/#projects");
  await expect(page).toHaveURL(/\/vi#projects$/);
  await expect(page.locator("#projects")).toBeInViewport();

  await page.goto("/en#stack");
  await expect(page.getByRole("heading", { level: 3, name: "Technology" })).toBeInViewport();
});

test("exactly one h1 per page", async ({ page }) => {
  for (const path of paths) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
  }
});
```

> **Contingency for 320 px overflow:** if the header overflows at 320 px, move `LanguageSwitcher` and `ThemeToggle` out of the always-visible cluster into the `MobileNav` dialog (render them `hidden sm:flex` in the header and again inside the dialog). Re-run this spec; never hide the overflow with `overflow-x: hidden` on `body`.
>
> **If `/#projects` loses its fragment after the redirect**, report it with the browser version — fragments are normally inherited across redirects, so a failure means something in the proxy or a router is rewriting the URL.

- [ ] **Step 3: Motion, reduced motion, script failure and no-JS**

`e2e/motion.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

const opacityNotOne = (els: Element[]) => els.filter((el) => getComputedStyle(el).opacity !== "1").length;

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("nothing hides, animates, transitions or smooth-scrolls", async ({ page, isMobile }) => {
    await page.goto("/en");
    expect(await page.locator("[data-reveal]").evaluateAll(opacityNotOne)).toBe(0);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("animation-name", "none");
    await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
    await expect(page.locator(".scroll-progress")).toBeHidden();

    if (!isMobile) {
      const image = page.locator("#projects article img").first();
      await image.scrollIntoViewIfNeeded();
      await image.hover();
      await expect(image).toHaveCSS("transform", "none");
    }

    await page.locator("#faq summary").first().click();
    await expect(page.locator("#faq summary svg").first()).toHaveCSS("transition-duration", /^(0s|1e-05s)$/);
  });
});

test("if the application scripts fail to load, no content is hidden", async ({ page }) => {
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await page.goto("/en");
  await expect(page.locator("html")).not.toHaveAttribute("data-reveal-ready", /.*/);
  expect(await page.locator("[data-reveal]").evaluateAll(opacityNotOne)).toBe(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Product engineer");
});

test("when scripts run, the reveal arms itself: below-the-fold content waits, on-screen content never flashes", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("data-reveal-ready", "");
  const below = page.locator("#faq h2");
  await expect(below).toHaveCSS("opacity", "0");
  await below.scrollIntoViewIfNeeded();
  await expect(below).toHaveCSS("opacity", "1");
  await expect(page.locator("#projects h2")).toHaveCSS("opacity", "1");
});

test("scrolling the whole page reveals every section", async ({ page }) => {
  await page.goto("/en");
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
  await expect(page.locator("[data-reveal]:not(.is-visible)")).toHaveCount(0);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("all sections are present, readable and not hidden by reveal styles", async ({ page }) => {
    await page.goto("/en");
    for (const id of ["projects", "services", "about", "process", "faq", "contact"]) {
      await expect(page.locator(`#${id} h2`)).toHaveCSS("opacity", "1");
    }
    await expect(page.locator("#faq details")).toHaveCount(8);
    await expect(page.locator("#contact a").first()).toBeVisible();
  });
});
```

- [ ] **Step 4: Run the whole suite on a production build**

Stop any running dev server first (dev and build share `.next`), then:

```bash
npm run e2e:prod
```
Expected: every spec green on both `desktop` and `mobile`, and `server-mode.spec.ts` confirms the server is really production. For each failure find the root cause in the component — never weaken an assertion. Likely fixes: header overflow at 320 px (contingency above), axe `color-contrast` on `text-fg-subtle` over `surface`, `aria-allowed-attr` on the palette combobox, a touch target under 44 px.

- [ ] **Step 5: Commit**

```bash
npm run lint && npx tsc --noEmit && npm test
git add e2e src
git diff --cached --stat
git commit -m "test: add axe, overflow, touch-target, legacy-link, motion and script-failure coverage"
```
(Include in this commit — or a preceding `fix:` commit — the component fixes the new tests forced.)

### Task 20: Performance, manual a11y pass, acceptance, handoff

**Files:** none planned (fixes land as `perf:`/`fix:` commits)

- [ ] **Step 1: Lighthouse on the production build (fixed method)**

```bash
npm run build && npm run start -- -p 3101
```
With the chrome-devtools MCP `lighthouse_audit` use the **mobile** form factor with default simulated throttling, a fresh browser profile and no extensions, on `http://localhost:3101/vi`, `/en`, `/vi/projects/hadi`. Run each URL **5 times** and record the **median** of each category and of LCP, CLS, TBT (a single run is never evidence). Targets (spec §10): Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100; LCP < 2.0 s, CLS < 0.05, TBT < 100 ms.

- [ ] **Step 2: Fix by evidence, not by guess**

For any missed target use `performance_start_trace` / `performance_analyze_insight`. The hero is text, so the work images are below the fold on desktop and mobile: **do not add `priority`/preload to them** unless a trace shows an image as the LCP element. On the case-study page, if the cover image is the mobile LCP element, add `priority` to that one image only and record the before/after. Check `sizes`: the work-block image column is ≈ 615 px wide at ≥ 1152 px viewports — if oversized sources are downloaded, set `sizes="(min-width: 1152px) 615px, (min-width: 1024px) 56vw, 100vw"` in `ProjectBlock` and re-measure. Commit each fix separately: `perf: <what> (LCP x → y)`.

- [ ] **Step 3: Visual QA matrix**

With the `run` skill or the chrome-devtools MCP take screenshots (no commit): `/vi` and `/en` × 1440 and 390 px × dark and light, plus `/en/projects/hadi` at both widths, plus the palette and the mobile menu open. Check against the spec: one accent only, no glow/gradient/glass, hairlines not boxes, project images are the focus, Vietnamese text never overflows its container, the hero H1 rhythm reads well on a phone.

- [ ] **Step 4: Manual accessibility checklist (record pass/fail + notes for each)**

| # | Check | Pass criteria |
|---|---|---|
| 1 | Keyboard-only tour, `/en` | Tab order is skip link → header → hero → work → … → footer; no trap; a visible 2 px accent focus ring on every control, including FAQ summaries and the stretched project-card link |
| 2 | Mobile menu | Enter/Space opens; focus moves inside; Tab cycles inside; Esc closes and returns focus to the button; choosing a link closes it and the target section sits below the header |
| 3 | Palette | Ctrl+K and ⌘K open/close; arrows/Enter/Esc work; with VoiceOver the combobox label, selected option and group names are announced; copy result is announced (if an email is configured) |
| 4 | FAQ | Enter/Space toggles; opening one closes the previous |
| 5 | Language switch | `/vi?utm=x#faq` → `/en?utm=x#faq`; `html lang` follows; a screen reader switches voice for Vietnamese content |
| 6 | Zoom/reflow | 200 % text zoom and 320 CSS px width (400 %) lose no content and need no two-dimensional scrolling |
| 7 | Touch (real phone if available, else DevTools touch emulation) | No hover-only functionality; targets comfortable (≥ 44 px) |

- [ ] **Step 5: Console and network hygiene**

`list_console_messages` on `/vi` and `/en/projects/hadi`: expected zero errors/warnings. `list_network_requests`: no request to removed libraries, no 404s (fonts, images, OG).

- [ ] **Step 6: Acceptance table and final gate**

```bash
npm run lint && npx tsc --noEmit && npm test && npm run e2e:prod && npm run check:content
git status --short
git log --oneline master..HEAD
```

| Criterion | Evidence required |
|---|---|
| Lint, types, unit tests | command output |
| E2E on a **verified production server** | `e2e:prod` output incl. `server-mode.spec.ts` |
| Lighthouse medians (5 runs × 3 URLs) | table with the numbers |
| Manual a11y checklist | filled table |
| Visual QA | screenshots reviewed by the owner |
| Optional content status | `check:content` output + which Appendix A items the owner approved |
| Working tree | only `?? .crossweave/` untracked; conventional commit list |

- [ ] **Step 7: Review and hand back**

Run `/code-review` on the branch diff and apply justified fixes. Then use `superpowers:finishing-a-development-branch`. **Do not merge or push** — merging to `master` and deploying are the owner's decisions; the live site (including the hero-role bug) only changes after that. Report: checks run with results, the Lighthouse table, the `check:content` list, and the security notes (no secrets added; phone and Telegram are deliberately published and an email only if the owner confirmed one; `target=_blank` links use `rel="noopener noreferrer"`; JSON-LD is escaped; no user input is processed server-side).

---

## Self-Review

**Spec coverage** (spec § → task):
§1–3 positioning/IA → 4, 10–15 · §4 tokens/type/layout → 6, 8, 11 · §5 motion budget → 6, 8, 10, 11, 17, 18 (removals) · §6 engineer-facing details (case studies, palette, compact stack) → 12, 17 · §7 i18n/rendering and legacy links → 3, 7, 9, 13, 19 · §8 SEO → 5, 12, 16 · §9 a11y → 6, 9, 11, 14, 19, 20 · §10 performance → 20 · §11 testing → 2 and every task · §12 owner inputs → 5, 12, 13, 15, 18, Appendix A · §13 risks → 7 (404 spike on a real production build), 16 (Vietnamese OG verified visually), 19 (320 px contingency).

**Placeholder scan:** no TBD/TODO; every code step carries code. Owner-supplied values (email, portrait, CV, project URLs, roles, rationale) are modelled as `null`/absent with tests that assert the *absence* behaviour. No default values are invented for them.

**Type consistency:** `Locale`/`locales`/`isLocale` only in `lib/i18n/config`; `Dictionary`, `ProjectSlug`, `SectionId`, `TechnicalChoice` only in `content/types`; `isProjectSlug`/`projectSlugs`/`projectsData` only in `content/projects`; `localePath`/`projectPath`/`switchLocalePath`/`localeHref` in `lib/i18n/paths`; `siteConfig.contact.{email|null, telegram, phone, github, cv|null}` used identically in Tasks 5, 15, 17, 18. `Section` gains `wide` in Task 11 and is used with it in Tasks 11 and 14. `SectionId` is `"projects"` everywhere (dictionary key, nav id, palette id, `#projects` hrefs, e2e selectors); the top-level dictionary namespace `work` (project copy) is unrelated and unchanged.

**Review Focus coverage:** 1–2 → Task 3 unit + Task 7 e2e · 3 → Tasks 11/12/13/15 conditional rendering + Task 18 gaps + Task 19 href/image integrity · 4 → Task 17 · 5 → Task 19 (reduced motion, script failure, no-JS) · 6 → Task 19 overflow matrix · 7 → Task 19 legacy-link test · 8 → Task 3 unit + Task 9 e2e.

**Known execution risks to watch:** (1) `next build` with only a dynamic `[locale]` root layout — settled in Task 7 Step 6 with an explicit fallback (`experimental.globalNotFound`); (2) Satori glyph coverage (Task 16); (3) header width at 320 px (Task 19 contingency); (4) `<details name>` typing (Task 14 note); (5) `pointer: coarse` emulation in the mobile project (Task 19 asserts it first).

---

## Appendix A — Optional content awaiting owner approval

None of this is in the dictionaries or config. The owner approves, edits or rejects each row; approved rows are added in a follow-up `content:` commit (both languages) and `siteConfig.contentUpdated` is bumped. Wording below is **draft**, written by the planner from the repository's descriptions — it is not evidence of intent or scope.

| # | Item | Where it renders | Draft / what is needed |
|---|---|---|---|
| A1 | Public email address | Contact (primary action + copy button), palette "Copy email", JSON-LD `email` | Owner supplies the address they want public. Not yet decided; `null` today |
| A2 | Role per project | Case-study meta and project block | Owner states the real scope, e.g. "Solo — product, design, full-stack, deploy" or a narrower role. No default |
| A3 | Rationale for technical choices | Case study "Why" / "Trade-off" rows | Drafts below, to be corrected or deleted by the owner |
| A4 | Extra "Now" facts | Hero panel | e.g. "Building: Hadi V6", or the study year — only if still true; panel shows an "Updated" month taken from `contentUpdated` |
| A5 | Live and repository URLs | Work block + case study links | `https://` URLs per project |
| A6 | Portrait photo | About + JSON-LD `image` | jpg/webp ≥ 800 px, placed in `public/`, set `siteConfig.portrait` |
| A7 | CV | Contact row "Download CV" | Choose one of the two PDFs in `public/assets/` (or none) and copy it to an ASCII path under `public/cv/` |

**A3 draft rationale (English; translate after approval):**

| Project | Choice | Draft "Why" | Draft "Trade-off" |
|---|---|---|---|
| HNWedding | Next.js 16 + Prisma 7 + PostgreSQL, strict TypeScript | One language and one schema from database to UI, so drift is caught at build time | Needs migration discipline (16 so far); ties the data layer to Prisma |
| HNWedding | VietQR/PayOS payments | QR bank transfer is familiar to Vietnamese customers | Domestic market only |
| HNWedding | Cloudflare R2 + Resend | Keeps image storage out of the database; confirmations without running a mail server | Two more external services to configure and monitor |
| Hadi | Raw WebSocket to Soniox, no SDK | One socket carries both directions and the connection lifecycle is fully controlled | Own protocol handling, reconnection and edge cases |
| Hadi | Gemini → Gemini → Claude fallback via Cloud Functions | Latency first for live subtitles, with fallbacks for quality and availability | More moving parts to monitor |
| Hadi | expo-sqlite then Firestore sync | A lecture shouldn't lose data on a weak network; syncing afterwards enables multiple devices | Sync and conflict handling across devices |
| Hadi | Firebase Auth (Apple/Email), Apple HIG | Meets platform expectations | Authentication depends on Firebase |
