# Portfolio Redesign Implementation Plan

> **Superseded** by the 2026-10-10 Product Engineer redesign (`docs/superpowers/specs/2026-10-10-product-engineer-redesign-design.md`). Kept for history.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Next.js portfolio into a "Dark Aurora Studio" freelance-positioning site with heavy GSAP + Framer Motion effects, 8 redesigned sections, and a multi-channel contact block.

**Architecture:** Single-page (`app/page.tsx`) Next.js 16 App Router site. Sections are independent components under `src/components/sections/`. Reusable effect primitives live in `src/components/effects/` and `src/hooks/`. GSAP plugins register once in `src/lib/gsap.ts`; reusable timelines live in `src/lib/animations.ts`. All copy in `src/content/index.ts` (VI/EN). Smooth scroll via Lenis (kept). Default theme `dark`, default locale `vi`.

**Tech Stack:** Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS v4 · Framer Motion 12 · GSAP 3.13 (+ `@gsap/react`) · Lenis · next-themes · lucide-react · Zod (kept for future), Geist Sans/Mono + Instrument Serif.

**Verification model:** This is a UI-only refactor with no existing test suite. Each task verifies via lint (`npm run lint`), and phase boundaries verify via dev server visual check + production build (`npm run build`). No unit tests are added; that would require setting up a test framework outside scope.

**⚠️ Broken middle:** From Task C2 (content schema rewrite) through Task G8 (last section rewrite), existing section files reference content fields that no longer exist. `npm run lint` will still pass (no type-aware rules). `npm run build` and `npm run dev` WILL fail with type errors in this window — that is expected. Do NOT run dev/build between C2 and G8 unless investigating a specific failure. The final verification phase (I1, I2) is the canonical signal.

**Spec source:** `docs/superpowers/specs/2026-06-15-portfolio-redesign-design.md`

---

## Phase A — Foundation

### Task A1: Install GSAP, remove pdf-parse

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json` (auto)

- [ ] **Step 1: Install GSAP packages**

Run from project root:

```bash
npm install gsap@^3.13.0 @gsap/react@^2.1.2
```

Expected: `package.json` dependencies now contain `gsap` and `@gsap/react`. No errors.

- [ ] **Step 2: Remove unused pdf-parse**

Run:

```bash
npm uninstall pdf-parse
```

Expected: `pdf-parse` removed from devDependencies.

- [ ] **Step 3: Verify**

Run:

```bash
npm run lint
```

Expected: PASS (no new warnings).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add gsap + @gsap/react, drop unused pdf-parse"
```

---

### Task A2: Rewrite globals.css with Dark Aurora tokens

**Files:**

- Modify: `src/app/globals.css` (full replace)

- [ ] **Step 1: Replace `src/app/globals.css` entirely with the following**

```css
@import "tailwindcss";

:root {
  /* Light mode tokens */
  --background: 0 0% 98%;
  --background-elevated: 0 0% 100%;
  --foreground: 240 60% 8%;
  --muted: 240 10% 92%;
  --muted-foreground: 240 12% 38%;
  --border: 240 14% 88%;
  --primary: 262 83% 60%;
  --primary-foreground: 0 0% 100%;
  --secondary: 328 86% 60%;
  --secondary-foreground: 0 0% 100%;
  --accent: 188 95% 45%;
  --accent-foreground: 0 0% 100%;
  --ring: 262 83% 60%;
}

.dark {
  /* Dark mode tokens — Aurora studio */
  --background: 240 56% 6%;
  --background-elevated: 240 36% 10%;
  --foreground: 240 20% 96%;
  --muted: 240 32% 14%;
  --muted-foreground: 240 12% 70%;
  --border: 240 20% 18%;
  --primary: 262 88% 68%;
  --primary-foreground: 240 60% 8%;
  --secondary: 328 86% 68%;
  --secondary-foreground: 240 60% 8%;
  --accent: 188 95% 60%;
  --accent-foreground: 240 60% 8%;
  --ring: 262 88% 68%;
}

@theme inline {
  --color-background: hsl(var(--background));
  --color-background-elevated: hsl(var(--background-elevated));
  --color-foreground: hsl(var(--foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-border: hsl(var(--border));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-ring: hsl(var(--ring));
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --font-display: var(--font-instrument-serif);
}

@layer base {
  * {
    @apply border-border box-border;
  }

  html {
    @apply overflow-x-hidden;
  }

  body {
    @apply bg-background font-sans text-foreground antialiased;
    @apply w-full overflow-x-hidden;
  }

  ::selection {
    @apply bg-primary/40 text-foreground;
  }

  /* Aurora gradient used by hero + section accents */
  .gradient-aurora {
    background: linear-gradient(
      135deg,
      hsl(var(--primary)) 0%,
      hsl(var(--accent)) 50%,
      hsl(var(--secondary)) 100%
    );
  }

  .text-gradient-aurora {
    background: linear-gradient(
      135deg,
      hsl(var(--primary)) 0%,
      hsl(var(--accent)) 50%,
      hsl(var(--secondary)) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  /* Hide scrollbar */
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* Respect reduced motion globally */
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
}
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: rewrite globals.css with Dark Aurora tokens + reduced motion"
```

---

### Task A3: Update layout.tsx — add Instrument Serif, default dark theme

**Files:**

- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace `src/app/layout.tsx` with the following**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { siteConfig } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.twitter,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} min-h-screen w-full overflow-x-hidden bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider defaultTheme="dark">
          <LocaleProvider>
            <LenisProvider>{children}</LenisProvider>
          </LocaleProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add Instrument Serif display font, default dark theme + vi lang"
```

---

### Task A4: Create `src/lib/gsap.ts` — register plugins client-side

**Files:**

- Create: `src/lib/gsap.ts`

- [ ] **Step 1: Create `src/lib/gsap.ts` with the following**

```ts
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/gsap.ts
git commit -m "feat: register GSAP + ScrollTrigger + useGSAP plugins"
```

---

### Task A5: Create `src/lib/animations.ts` — split text + reusable timelines

**Files:**

- Create: `src/lib/animations.ts`

- [ ] **Step 1: Create `src/lib/animations.ts` with the following**

```ts
"use client";

import { gsap } from "@/lib/gsap";

/**
 * Wrap each word of an element's text in <span class="word"><span class="inner">word</span></span>
 * so GSAP can animate the inner span (y, opacity) without affecting layout.
 * Returns the array of inner spans.
 */
export function splitWords(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent ?? "";
  el.textContent = "";
  const words = text.split(/\s+/).filter(Boolean);
  const inners: HTMLSpanElement[] = [];
  words.forEach((word, i) => {
    const outer = document.createElement("span");
    outer.className = "inline-block overflow-hidden align-bottom";
    const inner = document.createElement("span");
    inner.className = "inline-block";
    inner.textContent = word;
    outer.appendChild(inner);
    el.appendChild(outer);
    if (i < words.length - 1) {
      el.appendChild(document.createTextNode(" "));
    }
    inners.push(inner);
  });
  return inners;
}

/**
 * Same as splitWords but per character. Preserves spaces.
 */
export function splitChars(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent ?? "";
  el.textContent = "";
  const inners: HTMLSpanElement[] = [];
  for (const ch of text) {
    if (ch === " ") {
      el.appendChild(document.createTextNode(" "));
      continue;
    }
    const outer = document.createElement("span");
    outer.className = "inline-block overflow-hidden align-bottom";
    const inner = document.createElement("span");
    inner.className = "inline-block";
    inner.textContent = ch;
    outer.appendChild(inner);
    el.appendChild(outer);
    inners.push(inner);
  }
  return inners;
}

/**
 * Fade + slide up an array of elements with stagger.
 */
export function revealStagger(
  targets: gsap.TweenTarget,
  options: gsap.TweenVars = {},
) {
  return gsap.fromTo(
    targets,
    { y: 32, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.06,
      ease: "power3.out",
      ...options,
    },
  );
}

/**
 * Standard scroll-trigger config for an element.
 */
export function inViewTrigger(
  el: Element,
  onceOnly = true,
): ScrollTrigger.Vars {
  return {
    trigger: el,
    start: "top 80%",
    toggleActions: onceOnly
      ? "play none none none"
      : "play reverse play reverse",
  };
}
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/animations.ts
git commit -m "feat: add splitWords/splitChars + reusable GSAP timelines"
```

---

## Phase B — Cleanup unused files

### Task B1: Delete dead sections, blog route, contact API, schemas

**Files:**

- Delete: `src/app/blog/`
- Delete: `src/app/api/`
- Delete: `src/components/sections/awards-section.tsx`
- Delete: `src/components/sections/testimonials-section.tsx`
- Delete: `src/components/sections/blog-section.tsx`
- Delete: `src/components/sections/experience-section.tsx`
- Delete: `src/lib/schemas.ts`

- [ ] **Step 1: Remove files**

```bash
rm -rf "src/app/blog" "src/app/api"
rm "src/components/sections/awards-section.tsx" \
   "src/components/sections/testimonials-section.tsx" \
   "src/components/sections/blog-section.tsx" \
   "src/components/sections/experience-section.tsx" \
   "src/lib/schemas.ts"
```

- [ ] **Step 2: Verify nothing else imports these**

```bash
grep -rE "(awards-section|testimonials-section|blog-section|experience-section|@/lib/schemas|/api/contact)" src
```

Expected: No matches.

- [ ] **Step 3: Commit**

```bash
git add -A src/app src/components src/lib
git commit -m "chore: remove unused blog route, contact API, dead sections"
```

---

## Phase C — Content rewrite

### Task C1: Update `src/config/site.ts` — freelance positioning + SEO

**Files:**

- Modify: `src/config/site.ts`

- [ ] **Step 1: Replace `src/config/site.ts` with the following**

```ts
export const siteConfig = {
  name: "Nguyễn Mạnh Hùng — Freelance Web Developer",
  description:
    "Tôi xây website nhanh, đẹp, chạy mượt — từ landing page đến web app full-stack. Freelance Web Developer tại Hà Nội, làm việc với React, Next.js, Node.js.",
  url: "http://nmhx.info",
  ogImage: "/og-cover.svg",
  keywords: [
    "freelance web developer",
    "thuê làm website",
    "web developer hanoi",
    "next.js developer",
    "react developer",
    "node.js developer",
    "full-stack developer vietnam",
    "portfolio",
    "nmhx",
    "nguyen manh hung",
  ],
  authors: [{ name: "Nguyễn Mạnh Hùng", url: "http://nmhx.info" }],
  creator: "Nguyễn Mạnh Hùng",
  twitter: "@NMHx2005",
};

export type SiteConfig = typeof siteConfig;
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/config/site.ts
git commit -m "feat: update siteConfig for freelance positioning + Vi SEO keywords"
```

---

### Task C2: Rewrite `src/content/index.ts` — full freelance copy (VI + EN)

**Files:**

- Modify: `src/content/index.ts` (full replace)

- [ ] **Step 1: Replace `src/content/index.ts` entirely with the following**

```ts
export type Locale = "vi" | "en";

export interface ActionLink {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
}

export interface ServiceItem {
  icon: "layout" | "code" | "shopping" | "wrench";
  title: string;
  forWho: string;
  bullets: string[];
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  title: string;
  category: string;
  problem: string;
  solution: string;
  highlights: string[];
  metrics: ProjectMetric[];
  techStack: string[];
  links: ActionLink[];
  image: { src: string; alt: string };
}

export interface ProcessStep {
  title: string;
  duration: string;
  description: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ContactChannel {
  type: "email" | "zalo" | "phone" | "github" | "linkedin";
  label: string;
  value: string;
  href: string;
}

export interface SiteContent {
  hero: {
    greeting: string;
    name: string;
    role: string;
    valueProp: string;
    actions: ActionLink[];
    codeProfile: { fileName: string; seniority: string; skills: string[] };
  };
  services: {
    eyebrow: string;
    headline: string;
    description: string;
    items: ServiceItem[];
  };
  projects: {
    eyebrow: string;
    headline: string;
    description: string;
    items: Project[];
  };
  stack: {
    eyebrow: string;
    headline: string;
    description: string;
    groups: { name: string; items: string[] }[];
  };
  process: {
    eyebrow: string;
    headline: string;
    description: string;
    steps: ProcessStep[];
  };
  about: {
    eyebrow: string;
    headline: string;
    paragraphs: string[];
    values: string[];
  };
  faq: {
    eyebrow: string;
    headline: string;
    description: string;
    items: FaqItem[];
  };
  contact: {
    eyebrow: string;
    headline: string;
    description: string;
    channels: ContactChannel[];
  };
  footer: { tagline: string; note: string };
  nav: { id: string; label: string }[];
}

export const supportedLocales: { code: Locale; label: string }[] = [
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
];

const sharedSkills = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Express",
  "MongoDB",
  "Tailwind CSS",
  "GSAP",
  "Framer Motion",
];

const sharedProjectImages = {
  lms: "/projects/aurora-cover.svg",
  minhloc: "/projects/pulse-dashboard.svg",
};

export const siteContent: Record<Locale, SiteContent> = {
  vi: {
    hero: {
      greeting: "Xin chào, tôi là",
      name: "Nguyễn Mạnh Hùng",
      role: "Freelance Web Developer",
      valueProp:
        "Tôi xây website nhanh, đẹp, chạy mượt — từ landing page đến web app full-stack.",
      actions: [
        { label: "Xem dự án", href: "#projects", variant: "primary" },
        { label: "Thuê tôi", href: "#contact", variant: "secondary" },
      ],
      codeProfile: {
        fileName: "developer.ts",
        seniority: "Freelance",
        skills: sharedSkills,
      },
    },
    services: {
      eyebrow: "Dịch vụ",
      headline: "Tôi nhận làm gì?",
      description:
        "Bốn loại dự án tôi nhận thường xuyên. Nếu bạn không thấy thứ mình cần, cứ inbox — tôi sẽ trả lời thật.",
      items: [
        {
          icon: "layout",
          title: "Landing Page / Website giới thiệu",
          forWho: "Doanh nghiệp nhỏ, sự kiện, cá nhân, portfolio",
          bullets: [
            "SEO chuẩn, mobile-first",
            "Animation đẹp, mượt trên mọi thiết bị",
            "Deploy free trên Vercel",
            "Bàn giao source code",
          ],
        },
        {
          icon: "code",
          title: "Web Application Full-Stack",
          forWho: "SaaS, dashboard, hệ thống nội bộ",
          bullets: [
            "React + Next.js frontend",
            "API Node.js + Express",
            "Database + auth + admin panel",
            "Architecture mở rộng được",
          ],
        },
        {
          icon: "shopping",
          title: "E-Commerce / Bán hàng online",
          forWho: "Shop, brand, đa kênh",
          bullets: [
            "Quản lý sản phẩm, đơn hàng",
            "Thanh toán + giao hàng",
            "Tích hợp Zalo, Facebook",
            "Dashboard quản trị",
          ],
        },
        {
          icon: "wrench",
          title: "Custom CMS / Bảo trì website",
          forWho: "Khách đã có web cần nâng cấp",
          bullets: [
            "Refactor + performance",
            "SEO audit + tối ưu",
            "Content editor riêng",
            "Bảo trì hàng tháng",
          ],
        },
      ],
    },
    projects: {
      eyebrow: "Dự án",
      headline: "Đã làm gì",
      description:
        "Hai case study tiêu biểu. Cả hai đều đang chạy thật ngoài production.",
      items: [
        {
          title: "Learning Management System",
          category: "E-Learning · Full-stack",
          problem:
            "Một startup giáo dục cần nền tảng quản lý khóa học, học viên, nội dung — không muốn dùng WordPress vì khó tùy biến.",
          solution:
            "Hệ thống full-stack riêng: React + TypeScript + Material-UI frontend, Node.js + Express + MongoDB backend, RESTful API.",
          highlights: [
            "Backend Node.js + Express + MongoDB với TypeScript",
            "Frontend React + TypeScript + Material-UI",
            "Quản lý khóa học, học viên, payment, role",
            "Đang chạy production tại lms-vietnam.xyz",
          ],
          metrics: [
            { label: "Khóa học", value: "50+" },
            { label: "Học viên", value: "500+" },
            { label: "Uptime", value: "99.9%" },
          ],
          techStack: [
            "React",
            "TypeScript",
            "Node.js",
            "Express",
            "MongoDB",
            "Material-UI",
          ],
          links: [
            {
              label: "Xem website",
              href: "https://www.lms-vietnam.xyz/",
              variant: "primary",
              external: true,
            },
            {
              label: "GitHub",
              href: "https://github.com/NMHx2005/lms-frontend",
              variant: "secondary",
              external: true,
            },
          ],
          image: {
            src: sharedProjectImages.lms,
            alt: "Learning Management System preview",
          },
        },
        {
          title: "MinhLoc Group",
          category: "Real Estate + E-Commerce",
          problem:
            "MinhLoc Group bán cả bất động sản và sản phẩm nhân sâm, cần 1 nền tảng thống nhất, SEO tốt, tốc độ cao.",
          solution:
            "Next.js 14 SSR + Material-UI cho SEO, backend Node.js + Express + MongoDB, tích hợp Cloudinary, JWT auth, email service.",
          highlights: [
            "Next.js 14 SSR cho SEO",
            "Backend Node.js + TypeScript + MongoDB",
            "Cloudinary media, JWT auth, email service",
            "Đạt PageSpeed Insights 9x",
          ],
          metrics: [
            { label: "PageSpeed", value: "94" },
            { label: "Sản phẩm", value: "200+" },
            { label: "SEO score", value: "9x" },
          ],
          techStack: [
            "Next.js 14",
            "TypeScript",
            "Material-UI",
            "Node.js",
            "MongoDB",
            "Cloudinary",
          ],
          links: [
            {
              label: "Xem website",
              href: "https://www.minhlocgroup.vn/",
              variant: "primary",
              external: true,
            },
            {
              label: "GitHub",
              href: "https://github.com/NMHx2005/MinhLoc_FE",
              variant: "secondary",
              external: true,
            },
          ],
          image: {
            src: sharedProjectImages.minhloc,
            alt: "MinhLoc Group platform preview",
          },
        },
      ],
    },
    stack: {
      eyebrow: "Tech Stack",
      headline: "Công cụ tôi dùng hàng ngày",
      description:
        "Tôi không gò mình vào 1 framework. Tôi chọn công cụ phù hợp nhất với dự án.",
      groups: [
        {
          name: "Frontend",
          items: [
            "React",
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "GSAP",
            "Material-UI",
          ],
        },
        {
          name: "Backend",
          items: [
            "Node.js",
            "Express",
            "MongoDB",
            "MySQL",
            "Socket.io",
            "JWT",
            "Cloudinary",
          ],
        },
        {
          name: "Tools",
          items: ["Git", "GitHub", "Vercel", "Postman", "Figma"],
        },
      ],
    },
    process: {
      eyebrow: "Quy trình",
      headline: "Tôi làm việc thế nào",
      description:
        "Quy trình 5 bước rõ ràng. Bạn biết chính xác đang ở đâu, sắp có gì.",
      steps: [
        {
          title: "Discovery",
          duration: "1–2 ngày",
          description:
            "Nghe yêu cầu, xác định scope, deliverable, báo giá. Không tính phí.",
        },
        {
          title: "Design & Plan",
          duration: "3–5 ngày",
          description:
            "Wireframe, design mockup, tech plan. Bạn duyệt rồi mới code.",
        },
        {
          title: "Build",
          duration: "Theo scope",
          description:
            "Code, demo từng tuần, feedback loop. Không bao giờ biến mất.",
        },
        {
          title: "Launch",
          duration: "1–2 ngày",
          description:
            "Deploy, domain, SEO basics, hướng dẫn admin. Sẵn sàng đón khách.",
        },
        {
          title: "Support",
          duration: "30 ngày miễn phí",
          description:
            "Fix bug, hướng dẫn. Sau đó option bảo trì hàng tháng nếu cần.",
        },
      ],
    },
    about: {
      eyebrow: "Về tôi",
      headline: "Một người làm web hiểu cả code lẫn UX",
      paragraphs: [
        "Tôi là Hùng, sinh viên năm 3 Công nghệ Thông tin tại Đại học Mở Hà Nội. Nhưng tôi không chờ tốt nghiệp mới bắt đầu — tôi đã làm web full-stack được vài năm và đang nhận dự án freelance.",
        "Tôi thích những thứ chạy nhanh, nhìn đẹp, và làm xong rồi vẫn còn dùng tốt 5 năm sau. Nếu bạn cần một người làm web hiểu cả code lẫn UX, gửi mình email.",
      ],
      values: ["Clean code", "User-first", "Ship on time"],
    },
    faq: {
      eyebrow: "FAQ",
      headline: "Câu hỏi thường gặp",
      description: "Những thứ khách hay hỏi nhất trước khi bắt đầu.",
      items: [
        {
          q: "Một website tốn bao lâu để làm xong?",
          a: "Landing page: 1–2 tuần. Web app: 1–3 tháng tùy scope. Mình sẽ báo timeline cụ thể sau buổi Discovery.",
        },
        {
          q: "Chi phí trung bình bao nhiêu?",
          a: "Phụ thuộc vào scope. Landing page khởi đầu từ vài triệu, web app từ vài chục triệu. Inbox để mình báo giá cụ thể cho dự án của bạn.",
        },
        {
          q: "Anh nhận khách ngoài Hà Nội / nước ngoài không?",
          a: "Có. Mình làm việc remote toàn bộ. Gọi qua Zoom/Google Meet, giao tiếp qua email/Zalo/Slack tùy bạn quen.",
        },
        {
          q: "Có hỗ trợ sau khi launch không?",
          a: "30 ngày đầu miễn phí fix bug. Sau đó có gói bảo trì hàng tháng nếu bạn muốn mình duy trì lâu dài.",
        },
        {
          q: "Anh dùng công nghệ gì? Tôi có cần biết code không?",
          a: "Mặc định React + Next.js cho frontend, Node.js cho backend. Bạn không cần biết code — mình giải thích bằng ngôn ngữ thường ngày.",
        },
        {
          q: "Tôi đã có web cũ, anh nâng cấp được không?",
          a: "Được, miễn là không bị khóa vào platform riêng (Wix, Squarespace). Mình audit miễn phí trước khi báo giá.",
        },
        {
          q: "Thanh toán theo dạng nào?",
          a: "Thường chia 3 đợt: 30% khi ký, 40% giữa dự án (demo OK), 30% khi bàn giao. Chuyển khoản Việt Nam hoặc Wise cho khách nước ngoài.",
        },
        {
          q: "Tôi có sở hữu source code sau khi xong không?",
          a: "Có. Sau khi thanh toán đủ, source code thuộc về bạn 100%. Mình bàn giao kèm hướng dẫn deploy + chỉnh sửa.",
        },
      ],
    },
    contact: {
      eyebrow: "Liên hệ",
      headline: "Hãy nói chuyện với tôi",
      description:
        "Sẵn sàng nhận dự án mới. Chọn kênh tiện nhất với bạn, mình sẽ trả lời trong vòng 24 giờ.",
      channels: [
        {
          type: "email",
          label: "Email",
          value: "",
          href: "mailto:",
        },
        {
          type: "zalo",
          label: "Zalo",
          value: "+84 971 084 430",
          href: "https://zalo.me/0971084430",
        },
        {
          type: "phone",
          label: "Phone",
          value: "+84 971 084 430",
          href: "tel:+84971084430",
        },
        {
          type: "github",
          label: "GitHub",
          value: "@NMHx2005",
          href: "https://github.com/NMHx2005",
        },
        {
          type: "linkedin",
          label: "LinkedIn",
          value: "Chưa có",
          href: "https://www.linkedin.com/",
        },
      ],
    },
    footer: {
      tagline: "Sẵn sàng cho dự án mới.",
      note: "© 2026 Nguyễn Mạnh Hùng. Xây dựng tại Hà Nội bằng Next.js + GSAP.",
    },
    nav: [
      { id: "services", label: "Dịch vụ" },
      { id: "projects", label: "Dự án" },
      { id: "process", label: "Quy trình" },
      { id: "about", label: "Về tôi" },
      { id: "faq", label: "FAQ" },
      { id: "contact", label: "Liên hệ" },
    ],
  },
  en: {
    hero: {
      greeting: "Hi, I'm",
      name: "Nguyễn Mạnh Hùng",
      role: "Freelance Web Developer",
      valueProp:
        "I build fast, beautiful, reliable websites — from landing pages to full-stack web apps.",
      actions: [
        { label: "View work", href: "#projects", variant: "primary" },
        { label: "Hire me", href: "#contact", variant: "secondary" },
      ],
      codeProfile: {
        fileName: "developer.ts",
        seniority: "Freelance",
        skills: sharedSkills,
      },
    },
    services: {
      eyebrow: "Services",
      headline: "What I build",
      description:
        "Four kinds of project I take on regularly. Don't see your need? Send a message — I'll be honest.",
      items: [
        {
          icon: "layout",
          title: "Landing Page / Marketing Site",
          forWho: "Small business, event, personal, portfolio",
          bullets: [
            "SEO-ready, mobile-first",
            "Beautiful animations, smooth on every device",
            "Free Vercel deployment",
            "Source code handover",
          ],
        },
        {
          icon: "code",
          title: "Full-Stack Web Application",
          forWho: "SaaS, dashboard, internal tools",
          bullets: [
            "React + Next.js frontend",
            "Node.js + Express API",
            "Database + auth + admin panel",
            "Architecture that scales",
          ],
        },
        {
          icon: "shopping",
          title: "E-Commerce / Online Store",
          forWho: "Shop, brand, multichannel",
          bullets: [
            "Product + order management",
            "Payment + shipping",
            "Zalo, Facebook integration",
            "Admin dashboard",
          ],
        },
        {
          icon: "wrench",
          title: "Custom CMS / Maintenance",
          forWho: "Existing site needing an upgrade",
          bullets: [
            "Refactor + performance",
            "SEO audit + optimization",
            "Custom content editor",
            "Monthly maintenance",
          ],
        },
      ],
    },
    projects: {
      eyebrow: "Work",
      headline: "What I've shipped",
      description:
        "Two flagship case studies. Both running in production today.",
      items: [
        {
          title: "Learning Management System",
          category: "E-Learning · Full-stack",
          problem:
            "An education startup needed a custom platform for courses, students, and content — WordPress couldn't be customized enough.",
          solution:
            "Custom full-stack: React + TypeScript + Material-UI frontend, Node.js + Express + MongoDB backend, RESTful API.",
          highlights: [
            "Node.js + Express + MongoDB backend in TypeScript",
            "React + TypeScript + Material-UI frontend",
            "Course, student, payment, role management",
            "Live in production at lms-vietnam.xyz",
          ],
          metrics: [
            { label: "Courses", value: "50+" },
            { label: "Students", value: "500+" },
            { label: "Uptime", value: "99.9%" },
          ],
          techStack: [
            "React",
            "TypeScript",
            "Node.js",
            "Express",
            "MongoDB",
            "Material-UI",
          ],
          links: [
            {
              label: "Live site",
              href: "https://www.lms-vietnam.xyz/",
              variant: "primary",
              external: true,
            },
            {
              label: "GitHub",
              href: "https://github.com/NMHx2005/lms-frontend",
              variant: "secondary",
              external: true,
            },
          ],
          image: {
            src: sharedProjectImages.lms,
            alt: "Learning Management System preview",
          },
        },
        {
          title: "MinhLoc Group",
          category: "Real Estate + E-Commerce",
          problem:
            "MinhLoc Group sells both real estate and ginseng products — needed one unified platform with great SEO and fast load times.",
          solution:
            "Next.js 14 SSR + Material-UI for SEO, Node.js + Express + MongoDB backend, Cloudinary, JWT auth, email service.",
          highlights: [
            "Next.js 14 SSR for SEO",
            "Node.js + TypeScript + MongoDB backend",
            "Cloudinary media, JWT auth, email service",
            "PageSpeed Insights 9x",
          ],
          metrics: [
            { label: "PageSpeed", value: "94" },
            { label: "Products", value: "200+" },
            { label: "SEO score", value: "9x" },
          ],
          techStack: [
            "Next.js 14",
            "TypeScript",
            "Material-UI",
            "Node.js",
            "MongoDB",
            "Cloudinary",
          ],
          links: [
            {
              label: "Live site",
              href: "https://www.minhlocgroup.vn/",
              variant: "primary",
              external: true,
            },
            {
              label: "GitHub",
              href: "https://github.com/NMHx2005/MinhLoc_FE",
              variant: "secondary",
              external: true,
            },
          ],
          image: {
            src: sharedProjectImages.minhloc,
            alt: "MinhLoc Group platform preview",
          },
        },
      ],
    },
    stack: {
      eyebrow: "Tech Stack",
      headline: "Tools I use daily",
      description:
        "I'm not tied to one framework. I pick the right tool for each project.",
      groups: [
        {
          name: "Frontend",
          items: [
            "React",
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "GSAP",
            "Material-UI",
          ],
        },
        {
          name: "Backend",
          items: [
            "Node.js",
            "Express",
            "MongoDB",
            "MySQL",
            "Socket.io",
            "JWT",
            "Cloudinary",
          ],
        },
        {
          name: "Tools",
          items: ["Git", "GitHub", "Vercel", "Postman", "Figma"],
        },
      ],
    },
    process: {
      eyebrow: "Process",
      headline: "How I work",
      description:
        "A clear 5-step process. You always know where we are and what's next.",
      steps: [
        {
          title: "Discovery",
          duration: "1–2 days",
          description:
            "Listen to requirements, define scope, deliverables, quote. Free of charge.",
        },
        {
          title: "Design & Plan",
          duration: "3–5 days",
          description:
            "Wireframe, design mockup, tech plan. You approve before code starts.",
        },
        {
          title: "Build",
          duration: "Scope-dependent",
          description: "Code, weekly demos, feedback loop. I never go dark.",
        },
        {
          title: "Launch",
          duration: "1–2 days",
          description:
            "Deploy, domain, SEO basics, admin handover. Ready for customers.",
        },
        {
          title: "Support",
          duration: "30 days free",
          description:
            "Bug fixes, guidance. Optional monthly maintenance after that.",
        },
      ],
    },
    about: {
      eyebrow: "About",
      headline: "A developer who understands both code and UX",
      paragraphs: [
        "I'm Hùng, a 3rd-year IT student at Hanoi Open University. But I haven't been waiting for graduation — I've been building full-stack websites for years and taking freelance projects now.",
        "I like things that load fast, look beautiful, and still work great five years later. If you want a developer who understands both the code and the user, drop me an email.",
      ],
      values: ["Clean code", "User-first", "Ship on time"],
    },
    faq: {
      eyebrow: "FAQ",
      headline: "Frequently asked",
      description: "The questions clients ask me most before we start.",
      items: [
        {
          q: "How long does a website take?",
          a: "Landing page: 1–2 weeks. Web app: 1–3 months depending on scope. I'll give you a concrete timeline after Discovery.",
        },
        {
          q: "What does it cost on average?",
          a: "Depends on scope. Landing pages start from a few million VND, web apps from tens of millions. Send a message and I'll quote your specific project.",
        },
        {
          q: "Do you work with clients outside Hanoi / overseas?",
          a: "Yes. I work fully remote. Calls via Zoom/Google Meet, async via email/Zalo/Slack — whichever you prefer.",
        },
        {
          q: "Do you support the site after launch?",
          a: "First 30 days: bug fixes are free. After that, an optional monthly maintenance package if you want me long-term.",
        },
        {
          q: "What tech do you use? Do I need to know code?",
          a: "Default React + Next.js for frontend, Node.js for backend. You don't need to know code — I'll explain in everyday language.",
        },
        {
          q: "I already have a site, can you upgrade it?",
          a: "Yes, as long as it's not locked into a closed platform (Wix, Squarespace). Free audit before any quote.",
        },
        {
          q: "How does payment work?",
          a: "Usually three milestones: 30% on signing, 40% mid-project (working demo), 30% on handover. Vietnamese bank transfer or Wise for international.",
        },
        {
          q: "Do I own the source code?",
          a: "Yes. After full payment, the source code is 100% yours. Handed over with deployment + edit guides.",
        },
      ],
    },
    contact: {
      eyebrow: "Contact",
      headline: "Let's talk",
      description:
        "Available for new projects. Pick your favorite channel — I respond within 24 hours.",
      channels: [
        {
          type: "email",
          label: "Email",
          value: "",
          href: "mailto:",
        },
        {
          type: "zalo",
          label: "Zalo",
          value: "+84 971 084 430",
          href: "https://zalo.me/0971084430",
        },
        {
          type: "phone",
          label: "Phone",
          value: "+84 971 084 430",
          href: "tel:+84971084430",
        },
        {
          type: "github",
          label: "GitHub",
          value: "@NMHx2005",
          href: "https://github.com/NMHx2005",
        },
        {
          type: "linkedin",
          label: "LinkedIn",
          value: "Not yet",
          href: "https://www.linkedin.com/",
        },
      ],
    },
    footer: {
      tagline: "Ready for your next project.",
      note: "© 2026 Nguyễn Mạnh Hùng. Built in Hanoi with Next.js + GSAP.",
    },
    nav: [
      { id: "services", label: "Services" },
      { id: "projects", label: "Work" },
      { id: "process", label: "Process" },
      { id: "about", label: "About" },
      { id: "faq", label: "FAQ" },
      { id: "contact", label: "Contact" },
    ],
  },
};
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: PASS (errors elsewhere in repo expected — they reference fields that no longer exist; ignore until those files are rewritten in later tasks).

- [ ] **Step 3: Commit**

```bash
git add src/content/index.ts
git commit -m "feat: rewrite content for freelance positioning + new section schemas"
```

---

### Task C3: Update `LocaleProvider` — VI default + browser detect

**Files:**

- Modify: `src/components/providers/locale-provider.tsx` (full replace)

- [ ] **Step 1: Replace `src/components/providers/locale-provider.tsx` with the following**

```tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { Locale } from "@/content";

interface LocaleContextValue {
  locale: Locale;
  setLocale: Dispatch<SetStateAction<Locale>>;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const STORAGE_KEY = "portfolio.locale";

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "vi";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "vi" || stored === "en") return stored;
  return window.navigator.language?.toLowerCase().startsWith("en")
    ? "en"
    : "vi";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("vi");

  useEffect(() => {
    setLocale(detectInitialLocale());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/providers/locale-provider.tsx
git commit -m "feat: locale provider with vi default, browser detect, localStorage persist"
```

---

## Phase D — Hooks

### Task D1: `useMediaQuery` hook

**Files:**

- Create: `src/hooks/use-media-query.ts`

- [ ] **Step 1: Create `src/hooks/use-media-query.ts` with the following**

```ts
"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export const useIsDesktop = () =>
  useMediaQuery("(min-width: 1024px) and (pointer: fine)");
export const useReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/hooks/use-media-query.ts
git commit -m "feat: useMediaQuery + useIsDesktop + useReducedMotion hooks"
```

---

### Task D2: `useMagnetic` hook

**Files:**

- Create: `src/hooks/use-magnetic.ts`

- [ ] **Step 1: Create `src/hooks/use-magnetic.ts` with the following**

```ts
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsDesktop, useReducedMotion } from "@/hooks/use-media-query";

interface MagneticOptions {
  strength?: number;
}

export function useMagnetic<T extends HTMLElement>({
  strength = 0.4,
}: MagneticOptions = {}) {
  const ref = useRef<T | null>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !isDesktop || reducedMotion) return;

    const xTo = gsap.quickTo(el, "x", {
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [isDesktop, reducedMotion, strength]);

  return ref;
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/hooks/use-magnetic.ts
git commit -m "feat: useMagnetic hook with GSAP quickTo + reduced-motion respect"
```

---

### Task D3: `useTilt` hook

**Files:**

- Create: `src/hooks/use-tilt.ts`

- [ ] **Step 1: Create `src/hooks/use-tilt.ts` with the following**

```ts
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsDesktop, useReducedMotion } from "@/hooks/use-media-query";

interface TiltOptions {
  max?: number;
  scale?: number;
}

export function useTilt<T extends HTMLElement>({
  max = 8,
  scale = 1.02,
}: TiltOptions = {}) {
  const ref = useRef<T | null>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !isDesktop || reducedMotion) return;

    const rxTo = gsap.quickTo(el, "rotateX", {
      duration: 0.5,
      ease: "power3.out",
    });
    const ryTo = gsap.quickTo(el, "rotateY", {
      duration: 0.5,
      ease: "power3.out",
    });
    const scaleTo = gsap.quickTo(el, "scale", {
      duration: 0.5,
      ease: "power3.out",
    });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rxTo(-py * max);
      ryTo(px * max);
      scaleTo(scale);
    };

    const onLeave = () => {
      rxTo(0);
      ryTo(0);
      scaleTo(1);
    };

    gsap.set(el, { transformPerspective: 800, transformStyle: "preserve-3d" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [isDesktop, reducedMotion, max, scale]);

  return ref;
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/hooks/use-tilt.ts
git commit -m "feat: useTilt hook for 3D card rotation on cursor move"
```

---

## Phase E — Effect components

### Task E1: `Magnetic` wrapper component

**Files:**

- Create: `src/components/effects/magnetic.tsx`

- [ ] **Step 1: Create `src/components/effects/magnetic.tsx` with the following**

```tsx
"use client";

import type { ReactNode } from "react";
import { useMagnetic } from "@/hooks/use-magnetic";
import { cn } from "@/lib/utils";

interface MagneticProps {
  strength?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Wraps children in an inline-block div that follows the cursor with elastic spring.
 * The extra wrapper div is intentional — it sidesteps ref-forwarding/type variance
 * issues with cloneElement when children is a Link or polymorphic component.
 */
export function Magnetic({
  strength = 0.4,
  className,
  children,
}: MagneticProps) {
  const ref = useMagnetic<HTMLDivElement>({ strength });
  return (
    <div
      ref={ref}
      className={cn("inline-block will-change-transform", className)}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/effects/magnetic.tsx
git commit -m "feat: Magnetic wrapper component"
```

---

### Task E2: `TiltCard` component

**Files:**

- Create: `src/components/effects/tilt-card.tsx`

- [ ] **Step 1: Create `src/components/effects/tilt-card.tsx` with the following**

```tsx
"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  max?: number;
  scale?: number;
}

export function TiltCard({
  children,
  className,
  max,
  scale,
  ...rest
}: TiltCardProps) {
  const ref = useTilt<HTMLDivElement>({ max, scale });
  return (
    <div ref={ref} className={cn("will-change-transform", className)} {...rest}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/effects/tilt-card.tsx
git commit -m "feat: TiltCard component using useTilt hook"
```

---

### Task E3: `SplitText` component (GSAP scroll-triggered word reveal)

**Files:**

- Create: `src/components/effects/split-text.tsx`

- [ ] **Step 1: Create `src/components/effects/split-text.tsx` with the following**

```tsx
"use client";

import { createElement, useRef, type ElementType } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { splitWords, splitChars } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  as?: ElementType;
  className?: string;
  splitBy?: "word" | "char";
  delay?: number;
  start?: string;
  once?: boolean;
  /** Must be a plain string — the component re-splits when text changes (e.g. locale toggle). */
  children: string;
}

export function SplitText({
  as: Tag = "div",
  className,
  splitBy = "word",
  delay = 0,
  start = "top 85%",
  once = true,
  children,
}: SplitTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      // React-rendered textContent is set from `children` before this effect runs.
      const parts = splitBy === "word" ? splitWords(el) : splitChars(el);
      gsap.set(parts, { y: "110%" });
      gsap.to(parts, {
        y: "0%",
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.04,
        delay,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: once
            ? "play none none none"
            : "play reverse play reverse",
        },
      });
      return () => {
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === el)
          .forEach((t) => t.kill());
      };
    },
    // children included so locale toggles re-trigger the split + animation
    { dependencies: [splitBy, delay, start, once, children], scope: ref },
  );

  // createElement sidesteps polymorphic JSX ref typing issues with ElementType.
  return createElement(
    Tag,
    { ref, className: cn(className), key: children },
    children,
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/effects/split-text.tsx
git commit -m "feat: SplitText component with GSAP scroll-triggered word reveal"
```

---

### Task E4: `AuroraBackground` component

**Files:**

- Create: `src/components/effects/aurora-background.tsx`

- [ ] **Step 1: Create `src/components/effects/aurora-background.tsx` with the following**

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-media-query";

export function AuroraBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const blobs =
        containerRef.current?.querySelectorAll<HTMLElement>("[data-blob]");
      if (!blobs) return;

      blobs.forEach((blob, i) => {
        gsap.to(blob, {
          x: `+=${(i + 1) * 60 * (i % 2 === 0 ? 1 : -1)}`,
          y: `+=${(i + 1) * 40 * (i % 2 === 0 ? -1 : 1)}`,
          scale: 1.15,
          duration: 14 + i * 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { dependencies: [reducedMotion], scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        data-blob
        className="absolute -top-32 left-1/2 h-[60vw] w-[60vw] max-h-[800px] max-w-[800px] -translate-x-1/2 rounded-full opacity-50 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.8), transparent 60%)",
        }}
      />
      <div
        data-blob
        className="absolute left-[5%] top-[40%] h-[40vw] w-[40vw] max-h-[600px] max-w-[600px] rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.7), transparent 60%)",
        }}
      />
      <div
        data-blob
        className="absolute right-[-10%] bottom-[-10%] h-[50vw] w-[50vw] max-h-[700px] max-w-[700px] rounded-full opacity-40 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(var(--secondary) / 0.7), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
    </div>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/effects/aurora-background.tsx
git commit -m "feat: AuroraBackground with GSAP-animated radial gradient blobs"
```

---

### Task E5: `CustomCursor` component

**Files:**

- Create: `src/components/effects/custom-cursor.tsx`

- [ ] **Step 1: Create `src/components/effects/custom-cursor.tsx` with the following**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsDesktop, useReducedMotion } from "@/hooks/use-media-query";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isDesktop || reducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.style.cursor = "none";

    const dotX = gsap.quickTo(dot, "x", { duration: 0.18, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.18, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    const ringY = gsap.quickTo(ring, "y", {
      duration: 0.5,
      ease: "power3.out",
    });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onEnterInteractive = () => {
      gsap.to(ring, { scale: 1.8, duration: 0.25, ease: "power3.out" });
    };
    const onLeaveInteractive = () => {
      gsap.to(ring, { scale: 1, duration: 0.25, ease: "power3.out" });
    };

    document.addEventListener("mousemove", onMove);
    const interactiveSelector = "a, button, [role=button], [data-cursor=hover]";
    document.querySelectorAll(interactiveSelector).forEach((el) => {
      el.addEventListener("mouseenter", onEnterInteractive);
      el.addEventListener("mouseleave", onLeaveInteractive);
    });

    return () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
    };
  }, [isDesktop, reducedMotion]);

  if (!isDesktop || reducedMotion) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground mix-blend-difference"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/60 mix-blend-difference"
      />
    </>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/effects/custom-cursor.tsx
git commit -m "feat: CustomCursor with dual dot+ring + interactive scale"
```

---

### Task E6: `NumberCounter` component

**Files:**

- Create: `src/components/effects/number-counter.tsx`

- [ ] **Step 1: Create `src/components/effects/number-counter.tsx` with the following**

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface NumberCounterProps {
  value: string;
  className?: string;
}

/**
 * Animates the leading number in `value` from 0 → target on scroll into view.
 * Non-numeric suffix (e.g. "+", "%", "x") is preserved.
 */
export function NumberCounter({ value, className }: NumberCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
      if (!match) {
        el.textContent = value;
        return;
      }
      const [, numStr, suffix] = match;
      const target = parseFloat(numStr);
      const decimals = (numStr.split(".")[1] ?? "").length;
      const obj = { n: 0 };
      gsap.to(obj, {
        n: target,
        duration: 1.6,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = obj.n.toFixed(decimals) + suffix;
        },
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { dependencies: [value], scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/effects/number-counter.tsx
git commit -m "feat: NumberCounter component with GSAP scroll-trigger animation"
```

---

## Phase F — Shell components

### Task F1: Rewrite `ActionButton` with Magnetic wrapper + new variants

**Files:**

- Modify: `src/components/action-button.tsx` (full replace)

- [ ] **Step 1: Replace `src/components/action-button.tsx` with the following**

```tsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/effects/magnetic";
import { cn } from "@/lib/utils";
import type { ActionLink } from "@/content";

const variants: Record<NonNullable<ActionLink["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.6)] hover:shadow-[0_16px_48px_-12px_hsl(var(--primary)/0.7)]",
  secondary:
    "bg-background-elevated/80 text-foreground border border-border backdrop-blur hover:border-primary/40 hover:text-primary",
  ghost: "text-foreground hover:bg-foreground/5",
};

interface ActionButtonProps {
  action: ActionLink;
  index?: number;
}

export function ActionButton({ action, index = 0 }: ActionButtonProps) {
  const variant = action.variant ?? "primary";
  const className = cn(
    "group relative inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-13 sm:px-8 sm:text-base",
    variants[variant],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.05 * index,
        ease: [0.23, 1, 0.32, 1],
      }}
      viewport={{ once: true }}
      className="inline-block"
    >
      <Magnetic strength={0.25}>
        <Link
          href={action.href}
          target={action.external ? "_blank" : undefined}
          rel={action.external ? "noopener noreferrer" : undefined}
          className={className}
          data-cursor="hover"
        >
          <span>{action.label}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Magnetic>
    </motion.div>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/action-button.tsx
git commit -m "feat: ActionButton with Magnetic wrapper + aurora gradient primary"
```

---

### Task F2: Rewrite `SiteHeader` with new nav from content.nav

**Files:**

- Modify: `src/components/site-header.tsx` (full replace)

- [ ] **Step 1: Replace `src/components/site-header.tsx` with the following**

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { locale } = useLocale();
  const content = siteContent[locale];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <Link
            href="#hero"
            className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-background-elevated/60 px-3.5 py-1.5 text-xs font-semibold backdrop-blur transition hover:border-primary/40 hover:text-primary sm:text-sm"
            data-cursor="hover"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex h-full w-full rounded-full bg-primary" />
            </span>
            <span>NMHx</span>
          </Link>
        </motion.div>

        <nav className="hidden items-center gap-1 md:flex">
          {content.nav.map((item, i) => (
            <motion.a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "group relative rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground",
              )}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.05 * i,
                ease: [0.23, 1, 0.32, 1],
              }}
              data-cursor="hover"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute inset-0 rounded-full bg-foreground/0 transition group-hover:bg-foreground/5" />
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/site-header.tsx
git commit -m "feat: SiteHeader fixed, glass, driven by content.nav"
```

---

### Task F3: Tighten `SiteFooter`

**Files:**

- Modify: `src/components/site-footer.tsx` (full replace)

- [ ] **Step 1: Replace `src/components/site-footer.tsx` with the following**

```tsx
"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";

export function SiteFooter() {
  const { locale } = useLocale();
  const { footer } = siteContent[locale];

  return (
    <footer className="relative border-t border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <motion.p
          className="font-medium text-foreground"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {footer.tagline}
        </motion.p>
        <motion.p
          className="text-xs"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {footer.note}
        </motion.p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/site-footer.tsx
git commit -m "refactor: simplify footer for new content schema"
```

---

### Task F4: Tighten `LanguageSwitcher` (size)

**Files:**

- Modify: `src/components/language-switcher.tsx` (small tweak)

- [ ] **Step 1: Replace `min-w-[92px]` → `min-w-[64px]` and `text-sm` defaults adjusted**

Replace the whole file with:

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/components/providers/locale-provider";
import { supportedLocales } from "@/content";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="inline-flex items-center rounded-full border border-border/60 bg-background-elevated/60 p-1 text-xs shadow-sm backdrop-blur">
      {supportedLocales.map((item) => {
        const isActive = locale === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLocale(item.code)}
            className={cn(
              "relative flex min-w-[56px] items-center justify-center rounded-full px-3 py-1.5 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            data-cursor="hover"
            aria-label={`Switch to ${item.label}`}
          >
            <span className="relative z-10">{item.code.toUpperCase()}</span>
            <AnimatePresence>
              {isActive ? (
                <motion.span
                  layoutId="language-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-primary to-secondary"
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                />
              ) : null}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/language-switcher.tsx
git commit -m "refactor: LanguageSwitcher compact + aurora pill"
```

---

## Phase G — Sections

### Task G1: Hero section

**Files:**

- Modify: `src/components/sections/hero-section.tsx` (full replace)
- Delete: `src/components/hero/coder-profile-card.tsx` (no longer used after this task)

- [ ] **Step 1: Replace `src/components/sections/hero-section.tsx` with the following**

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { splitWords } from "@/lib/animations";
import { ActionButton } from "@/components/action-button";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";

export function HeroSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].hero;
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;
      const nameEl = root.querySelector<HTMLElement>("[data-anim=name]");
      const roleEl = root.querySelector<HTMLElement>("[data-anim=role]");
      const valueEl = root.querySelector<HTMLElement>("[data-anim=value]");
      const greetEl = root.querySelector<HTMLElement>("[data-anim=greet]");
      const cardEl = root.querySelector<HTMLElement>("[data-anim=card]");

      if (!nameEl || !roleEl || !valueEl || !greetEl || !cardEl) return;

      const nameWords = splitWords(nameEl);
      const roleWords = splitWords(roleEl);
      const valueWords = splitWords(valueEl);

      gsap.set([nameWords, roleWords, valueWords], { y: "110%" });
      gsap.set(greetEl, { opacity: 0, y: 10 });
      gsap.set(cardEl, { opacity: 0, y: 32, scale: 0.96 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(greetEl, { opacity: 1, y: 0, duration: 0.6 })
        .to(nameWords, { y: "0%", duration: 0.9, stagger: 0.05 }, "-=0.25")
        .to(roleWords, { y: "0%", duration: 0.8, stagger: 0.04 }, "-=0.6")
        .to(valueWords, { y: "0%", duration: 0.7, stagger: 0.025 }, "-=0.55")
        .to(
          cardEl,
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "expo.out" },
          "-=0.7",
        );
    },
    // locale included so timeline re-runs when text content changes
    { dependencies: [locale], scope: containerRef },
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:px-10"
    >
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <span
            data-anim="greet"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background-elevated/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur w-fit"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70 opacity-75" />
              <span className="relative inline-flex h-full w-full rounded-full bg-accent" />
            </span>
            {content.greeting}
          </span>

          <h1
            data-anim="name"
            className="text-balance font-display text-5xl italic leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]"
          >
            {content.name}
          </h1>

          <p
            data-anim="role"
            className="text-gradient-aurora text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
          >
            {content.role}
          </p>

          <p
            data-anim="value"
            className="max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {content.valueProp}
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            {content.actions.map((action, i) => (
              <ActionButton key={action.label} action={action} index={i} />
            ))}
          </div>
        </div>

        <motion.div
          data-anim="card"
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 blur-2xl" />
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-background-elevated/80 p-6 backdrop-blur-xl shadow-[0_24px_60px_-20px_hsl(var(--primary)/0.4)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                {content.codeProfile.fileName}
              </span>
              <span className="rounded-full bg-accent/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
                {content.codeProfile.seniority}
              </span>
            </div>
            <div className="relative mx-auto mb-4 aspect-square w-32 overflow-hidden rounded-2xl border border-border/60 bg-background">
              <Image
                src="/portrait.svg"
                alt="Portrait"
                fill
                className="object-cover"
                sizes="128px"
                priority
              />
            </div>
            <ul className="font-mono text-[11px] leading-relaxed text-muted-foreground">
              <li>
                <span className="text-secondary">const</span>{" "}
                <span className="text-foreground">skills</span> = [
              </li>
              {content.codeProfile.skills.map((s) => (
                <li key={s} className="pl-4">
                  <span className="text-accent">&quot;{s}&quot;</span>,
                </li>
              ))}
              <li>];</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Delete the now-unused coder profile card**

```bash
rm "src/components/hero/coder-profile-card.tsx"
rmdir "src/components/hero" 2>/dev/null || true
```

- [ ] **Step 3: Lint + commit**

```bash
npm run lint
git add -A src/components/sections/hero-section.tsx src/components/hero
git commit -m "feat: Hero section with GSAP split-word timeline + glass code card"
```

---

### Task G2: Services section (NEW)

**Files:**

- Create: `src/components/sections/services-section.tsx`

- [ ] **Step 1: Create `src/components/sections/services-section.tsx` with the following**

```tsx
"use client";

import {
  Code2,
  Layout,
  ShoppingBag,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { TiltCard } from "@/components/effects/tilt-card";
import { SplitText } from "@/components/effects/split-text";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent, type ServiceItem } from "@/content";

const iconMap: Record<ServiceItem["icon"], LucideIcon> = {
  layout: Layout,
  code: Code2,
  shopping: ShoppingBag,
  wrench: Wrench,
};

export function ServicesSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].services;

  return (
    <section
      id="services"
      className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10 lg:py-40"
    >
      <header className="mb-14 max-w-3xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {content.eyebrow}
        </p>
        <SplitText
          as="h2"
          className="font-display text-4xl italic leading-tight sm:text-5xl md:text-6xl"
        >
          {content.headline}
        </SplitText>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          {content.description}
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {content.items.map((item, i) => {
          const Icon = iconMap[item.icon];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <TiltCard
                className="group relative h-full overflow-hidden rounded-3xl border border-border/60 bg-background-elevated/60 p-7 backdrop-blur-xl transition-colors hover:border-primary/40"
                data-cursor="hover"
              >
                <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-background/60">
                    <Icon className="h-5 w-5 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.forWho}
                    </p>
                  </div>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    {item.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/sections/services-section.tsx
git commit -m "feat: Services section with tilt cards + 4 service types"
```

---

### Task G3: Projects section (sticky scroll case study)

**Files:**

- Modify: `src/components/sections/projects-section.tsx` (full replace)

- [ ] **Step 1: Replace `src/components/sections/projects-section.tsx` with the following**

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SplitText } from "@/components/effects/split-text";
import { NumberCounter } from "@/components/effects/number-counter";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent, type Project } from "@/content";

function ProjectCase({ project, index }: { project: Project; index: number }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const image = wrap.querySelector<HTMLElement>("[data-image]");
      if (!image) return;

      gsap.fromTo(
        image,
        { y: 0, scale: 1.05 },
        {
          y: -60,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      return () => {
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === wrap)
          .forEach((t) => t.kill());
      };
    },
    { scope: wrapRef },
  );

  return (
    <div
      ref={wrapRef}
      className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16"
    >
      <div className={index % 2 === 0 ? "" : "lg:order-2"}>
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-background-elevated/40 shadow-[0_20px_80px_-30px_hsl(var(--primary)/0.5)]">
          <div
            data-image
            className="relative aspect-[4/3] w-full will-change-transform"
          >
            <Image
              src={project.image.src}
              alt={project.image.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 600px, 100vw"
            />
          </div>
        </div>
      </div>

      <motion.div
        className={
          index % 2 === 0
            ? "lg:sticky lg:top-28"
            : "lg:sticky lg:top-28 lg:order-1"
        }
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      >
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {project.category}
        </p>
        <h3 className="font-display text-3xl italic leading-tight sm:text-4xl md:text-5xl">
          {project.title}
        </h3>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          {project.problem}
        </p>
        <p className="mt-3 text-base leading-relaxed text-foreground/90">
          {project.solution}
        </p>

        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          {project.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <div className="mt-7 grid grid-cols-3 gap-3 rounded-2xl border border-border/60 bg-background-elevated/40 p-4">
          {project.metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div className="font-display text-2xl italic text-primary sm:text-3xl">
                <NumberCounter value={m.value} />
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.techStack.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border/60 bg-background/50 px-3 py-1 font-mono text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          {project.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              data-cursor="hover"
              className={
                link.variant === "primary"
                  ? "inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-primary hover:text-primary-foreground"
                  : "inline-flex items-center gap-2 rounded-full border border-border bg-background-elevated/60 px-5 py-2.5 text-sm font-semibold transition hover:border-primary/40 hover:text-primary"
              }
            >
              {link.label}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function ProjectsSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].projects;

  return (
    <section
      id="projects"
      className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10 lg:py-40"
    >
      <header className="mb-16 max-w-3xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {content.eyebrow}
        </p>
        <SplitText
          as="h2"
          className="font-display text-4xl italic leading-tight sm:text-5xl md:text-6xl"
        >
          {content.headline}
        </SplitText>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          {content.description}
        </p>
      </header>

      <div className="space-y-24 lg:space-y-40">
        {content.items.map((project, i) => (
          <ProjectCase key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/sections/projects-section.tsx
git commit -m "feat: Projects section sticky case-study + metric counters + parallax"
```

---

### Task G4: Tech Stack section with marquee (NEW)

**Files:**

- Create: `src/components/sections/stack-section.tsx`

- [ ] **Step 1: Create `src/components/sections/stack-section.tsx` with the following**

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitText } from "@/components/effects/split-text";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";

function MarqueeRow({
  items,
  direction = 1,
}: {
  items: string[];
  direction?: 1 | -1;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;
      const width = track.scrollWidth / 2;
      gsap.set(track, { x: direction === 1 ? 0 : -width });
      gsap.to(track, {
        x: direction === 1 ? -width : 0,
        duration: 30,
        repeat: -1,
        ease: "none",
      });
    },
    { dependencies: [direction], scope: trackRef },
  );

  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <div ref={trackRef} className="flex w-max gap-3 py-3">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center rounded-full border border-border/60 bg-background-elevated/40 px-5 py-2 font-mono text-sm text-foreground/80 backdrop-blur"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function StackSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].stack;

  const row1 = content.groups.flatMap((g) => g.items).slice(0, 12);
  const row2 = content.groups.flatMap((g) => g.items).slice(-12);

  return (
    <section
      id="stack"
      className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10 lg:py-40"
    >
      <header className="mb-12 max-w-3xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {content.eyebrow}
        </p>
        <SplitText
          as="h2"
          className="font-display text-4xl italic leading-tight sm:text-5xl md:text-6xl"
        >
          {content.headline}
        </SplitText>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          {content.description}
        </p>
      </header>

      <div className="space-y-2">
        <MarqueeRow items={row1} direction={1} />
        <MarqueeRow items={row2} direction={-1} />
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {content.groups.map((g) => (
          <div
            key={g.name}
            className="rounded-2xl border border-border/60 bg-background-elevated/40 p-5 backdrop-blur"
          >
            <h3 className="mb-3 text-xs font-mono uppercase tracking-[0.2em] text-accent">
              {g.name}
            </h3>
            <ul className="flex flex-wrap gap-1.5 text-sm text-muted-foreground">
              {g.items.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-border/50 px-2 py-0.5"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/sections/stack-section.tsx
git commit -m "feat: Stack section with dual GSAP marquee + grouped list"
```

---

### Task G5: Process section (NEW)

**Files:**

- Create: `src/components/sections/process-section.tsx`

- [ ] **Step 1: Create `src/components/sections/process-section.tsx` with the following**

```tsx
"use client";

import { motion } from "framer-motion";
import { SplitText } from "@/components/effects/split-text";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";

export function ProcessSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].process;

  return (
    <section
      id="process"
      className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10 lg:py-40"
    >
      <header className="mb-16 max-w-3xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {content.eyebrow}
        </p>
        <SplitText
          as="h2"
          className="font-display text-4xl italic leading-tight sm:text-5xl md:text-6xl"
        >
          {content.headline}
        </SplitText>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          {content.description}
        </p>
      </header>

      <div className="relative">
        <div className="pointer-events-none absolute left-[34px] top-0 bottom-0 hidden w-px bg-gradient-to-b from-primary/0 via-primary/40 to-primary/0 sm:block" />

        <ol className="space-y-10">
          {content.steps.map((step, i) => (
            <motion.li
              key={step.title}
              className="relative grid gap-4 sm:grid-cols-[80px_1fr] sm:gap-8"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.06,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <div className="flex items-center sm:items-start sm:justify-center">
                <div className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full border border-border/60 bg-background-elevated/80 backdrop-blur">
                  <span className="font-display text-2xl italic text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
              <div className="rounded-3xl border border-border/60 bg-background-elevated/40 p-6 backdrop-blur sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-2xl italic sm:text-3xl">
                    {step.title}
                  </h3>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    {step.duration}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {step.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/sections/process-section.tsx
git commit -m "feat: Process section with vertical timeline + numbered steps"
```

---

### Task G6: About section

**Files:**

- Modify: `src/components/sections/about-section.tsx` (full replace)

- [ ] **Step 1: Replace `src/components/sections/about-section.tsx` with the following**

```tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SplitText } from "@/components/effects/split-text";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";

export function AboutSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].about;

  return (
    <section
      id="about"
      className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10 lg:py-40"
    >
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col gap-6"
        >
          <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-3xl border border-border/60 bg-background-elevated/60 sm:w-64 lg:mx-0">
            <Image
              src="/portrait.svg"
              alt="Portrait"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 256px, 192px"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {content.values.map((v) => (
              <span
                key={v}
                className="rounded-full border border-border/60 bg-background-elevated/40 px-4 py-1.5 text-sm font-medium text-foreground/80 backdrop-blur"
              >
                {v}
              </span>
            ))}
          </div>
        </motion.div>

        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {content.eyebrow}
          </p>
          <SplitText
            as="h2"
            className="font-display text-4xl italic leading-tight sm:text-5xl md:text-6xl"
          >
            {content.headline}
          </SplitText>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {content.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + i * 0.08,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/sections/about-section.tsx
git commit -m "feat: About section refactor with portrait + values + freelance copy"
```

---

### Task G7: FAQ section (NEW)

**Files:**

- Create: `src/components/sections/faq-section.tsx`

- [ ] **Step 1: Create `src/components/sections/faq-section.tsx` with the following**

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { SplitText } from "@/components/effects/split-text";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10 lg:py-40"
    >
      <header className="mb-14 text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {content.eyebrow}
        </p>
        <SplitText
          as="h2"
          className="font-display text-4xl italic leading-tight sm:text-5xl md:text-6xl"
        >
          {content.headline}
        </SplitText>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          {content.description}
        </p>
      </header>

      <div className="space-y-3">
        {content.items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className={cn(
                "overflow-hidden rounded-2xl border bg-background-elevated/40 backdrop-blur transition-colors",
                isOpen
                  ? "border-primary/40"
                  : "border-border/60 hover:border-border",
              )}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:p-6"
                aria-expanded={isOpen}
                data-cursor="hover"
              >
                <span className="text-base font-semibold sm:text-lg">
                  {item.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6 sm:text-base">
                      {item.a}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/sections/faq-section.tsx
git commit -m "feat: FAQ section with accordion (Motion AnimatePresence)"
```

---

### Task G8: Contact section (CTA tiles)

**Files:**

- Modify: `src/components/sections/contact-section.tsx` (full replace)

- [ ] **Step 1: Replace `src/components/sections/contact-section.tsx` with the following**

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { SplitText } from "@/components/effects/split-text";
import { TiltCard } from "@/components/effects/tilt-card";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent, type ContactChannel } from "@/content";

const iconMap: Record<ContactChannel["type"], LucideIcon> = {
  email: Mail,
  zalo: MessageCircle,
  phone: Phone,
  github: Github,
  linkedin: Linkedin,
};

export function ContactSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].contact;

  return (
    <section
      id="contact"
      className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10 lg:py-40"
    >
      <header className="mb-14 max-w-3xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {content.eyebrow}
        </p>
        <SplitText
          as="h2"
          className="font-display text-4xl italic leading-tight sm:text-5xl md:text-6xl"
        >
          {content.headline}
        </SplitText>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          {content.description}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.channels.map((ch, i) => {
          const Icon = iconMap[ch.type];
          const isExternal = ch.href.startsWith("http");
          return (
            <motion.div
              key={ch.type}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.06,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <TiltCard
                max={6}
                className="group relative h-full overflow-hidden rounded-3xl border border-border/60 bg-background-elevated/60 p-6 backdrop-blur transition-colors hover:border-primary/40"
              >
                <Link
                  href={ch.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="absolute inset-0 z-10"
                  aria-label={`${ch.label}: ${ch.value}`}
                  data-cursor="hover"
                />
                <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-background/60">
                      <Icon className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {ch.label}
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
                      {ch.value}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/sections/contact-section.tsx
git commit -m "feat: Contact section with 5 channel tiles + tilt effect"
```

---

## Phase H — Page assembly

### Task H1: Rewrite `src/app/page.tsx` — mount sections + global effects

**Files:**

- Modify: `src/app/page.tsx` (full replace)

- [ ] **Step 1: Replace `src/app/page.tsx` with the following**

```tsx
"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuroraBackground } from "@/components/effects/aurora-background";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { StackSection } from "@/components/sections/stack-section";
import { ProcessSection } from "@/components/sections/process-section";
import { AboutSection } from "@/components/sections/about-section";
import { FaqSection } from "@/components/sections/faq-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <AuroraBackground />
      <CustomCursor />
      <SiteHeader />
      <main className="relative">
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <StackSection />
        <ProcessSection />
        <AboutSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 2: Delete unused `AnimatedSection` if no longer referenced**

```bash
grep -r "AnimatedSection\|animated-section" src
```

Expected: zero matches. If zero, run:

```bash
rm "src/components/animated-section.tsx"
```

If matches exist, leave the file in place.

- [ ] **Step 3: Lint + commit**

```bash
npm run lint
git add -A src/app/page.tsx src/components/animated-section.tsx
git commit -m "feat: assemble page.tsx with all 8 sections + aurora + cursor + skip link"
```

---

## Phase I — Verification

### Task I1: Run dev server and visually verify each section

**Files:** none

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Open http://localhost:3000.

- [ ] **Step 2: Verify each section**

Scroll through and confirm:

- Hero: name + role + value prop animate in via split-word reveal. Code card fades + scales in. CTAs are magnetic on hover.
- Services: 4 cards in 2×2 grid. Tilt on hover (desktop). Each has icon + title + bullets.
- Projects: LMS first, MinhLoc second. Sticky text + parallax image. Number counters animate. Tech chips visible. Two CTAs each.
- Stack: 2 marquee rows scrolling opposite directions. 3 group cards below.
- Process: 5 numbered steps with vertical line connecting them. Each step has duration tag.
- About: portrait left, 2 paragraphs + 3 value chips right.
- FAQ: 8 questions, first one open by default, click toggles.
- Contact: 5 tiles (Email/Zalo/Phone/GitHub/LinkedIn). Each clickable to its URL.
- Header sticky at top with nav anchors, language switcher, theme toggle.
- Footer with tagline + copyright.

- [ ] **Step 3: Theme + locale toggle**

Click theme toggle: page switches dark ↔ light cleanly (no flash). Click language switcher: all copy flips VI ↔ EN.

- [ ] **Step 4: Reduced motion check**

In DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`. Reload. Verify: no aurora blob animation, no custom cursor, no large GSAP timelines. Static content visible.

- [ ] **Step 5: Stop dev server**

Ctrl+C in the terminal.

- [ ] **Step 6: No commit**

This task only verifies — no file change.

---

### Task I2: Run production build + lint

**Files:** none

- [ ] **Step 1: Lint**

```bash
npm run lint
```

Expected: PASS (zero errors, zero warnings ideally).

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected:

- Build succeeds
- No TypeScript errors
- No "module not found" errors
- All sections statically prerender (page.tsx is "use client" but the route renders)

- [ ] **Step 3: If build fails**

Read the error. Most likely causes:

- Missing import → add it
- Type mismatch with new content schemas → align the consumer with `src/content/index.ts` types
- Server/client component boundary → ensure files using GSAP / hooks / Motion start with `"use client"`

Fix the issue, re-run `npm run build`, repeat until success.

- [ ] **Step 4: Commit any build fixes**

```bash
git add -A
git commit -m "fix: address build errors uncovered during production verification"
```

(If no fixes needed, no commit.)

---

### Task I3: Final pass + push

**Files:** none

- [ ] **Step 1: Verify Acceptance Criteria from spec section 13**

For each of the 12 items in spec § 13, confirm:

1. ✅ 8 sections render correctly responsive ≥360px
2. ✅ Hero intro timeline smooth, no layout shift
3. ✅ Projects section sticky + parallax works in current browser
4. ✅ Tech marquee infinite, pause-on-hover not required for v1
5. ✅ Custom cursor desktop-only, no lag
6. ✅ Theme toggle works, no flash
7. ✅ Locale toggle works, default VI
8. ✅ `prefers-reduced-motion` respected
9. ⚠️ Lighthouse: manual audit, target ≥90 mobile (defer if score < 90 and add as follow-up task)
10. ✅ No console error/warning
11. ✅ `npm run build` succeeds
12. ✅ All CTA contacts dial correct mailto/tel/https

- [ ] **Step 2: Commit final state if anything tweaked**

```bash
git status
# if anything is unstaged from minor polish
git add -A
git commit -m "polish: final adjustments after acceptance pass"
```

- [ ] **Step 3: Inform user of completion**

Tell the user:

- Implementation complete
- Mention any items deferred (e.g., Lighthouse, real Zalo/LinkedIn link, real images)
- Suggest reviewing section 14 of spec for the 5 production-blocking open questions
- Optionally `git push` after user confirmation

---

## Summary

**Total tasks:** 25

- Phase A (Foundation): 5
- Phase B (Cleanup): 1
- Phase C (Content): 3
- Phase D (Hooks): 3
- Phase E (Effects): 6
- Phase F (Shell): 4
- Phase G (Sections): 8 — wait, recount below
- Phase H (Assembly): 1
- Phase I (Verify): 3

Recount: A1–A5 (5), B1 (1), C1–C3 (3), D1–D3 (3), E1–E6 (6), F1–F4 (4), G1–G8 (8), H1 (1), I1–I3 (3) = **34 tasks**.

Each task is bite-sized (most are file replace + lint + commit, 5–10 min). Phase boundaries are natural review checkpoints.

**Estimated wall time** (single-agent inline): ~4–6 hours assuming familiar tools. Subagent-driven likely faster with fresh context per task.
