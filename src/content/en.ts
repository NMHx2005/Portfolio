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
    { id: "process", label: "Process" },
    { id: "faq", label: "FAQ" },
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
      { label: "Shipped", value: "mythiep and Hadi in production; crossweave open source" },
      { label: "Studying", value: "Information Technology, Hanoi Open University" },
    ],
  },
  sections: {
    projects: {
      index: "01",
      label: "Work",
      heading: "Shipped products",
      lede: "Two products in production and one open-source tool. Open a case study for the problem and the technical choices.",
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
      templates: "invitation templates",
      migrations: "DB migrations",
      commits: "commits",
      languages: "languages",
      version: "version",
      license: "license",
      testFiles: "test files",
    },
    items: {
      mythiep: {
        title: "mythiep",
        category: "Online invitations · Self-service SaaS",
        summary:
          "A self-service product for online invitations: pick a template, pay once, edit it in the browser and publish a link guests can RSVP from. No yearly fee.",
        status: "Live in production",
        problem:
          "Hosts want an invitation they can finish themselves in a day: choose a design, make it theirs, share a link and collect replies — without hiring a designer and without paying a yearly fee to keep it online.",
        choices: [
          {
            title: "Puck as the canvas editor, loaded only in the editor; public invitations render with Puck's <Render>",
            why: "Puck lays out in flow by default while invitation designs use absolute positions, so a time-boxed spike on a minimal canvas ran before the schema was written. It showed that absolute positions work when react-moveable is attached in the editor only, and the editor is never shipped to guests.",
          },
          {
            title: "SePay payments: a signed form POST (HMAC-SHA256) and a payment notification verified by a secret header, one payment per invitation, Basic/Pro pricing per invitation type",
          },
          { title: "Invitation photos stored on Cloudflare R2 as webp variants (768/1200/1600 px) and served with srcset instead of next/image" },
          {
            title: "Next.js 16 and Prisma 7 on PostgreSQL: the app and Redis on a VPS, the database on Supabase used as plain Postgres (no Supabase Auth, Storage or Realtime)",
          },
          { title: "Cloudflare Turnstile on the RSVP and wish forms, so a public invitation can take replies without accounts or spam" },
        ],
        flow: ["Pick a template", "Pay once (SePay VietQR)", "Edit in the browser", "Publish at /thiep/[slug]", "Guests reply (RSVP)"],
        services: [
          { label: "Data", detail: "Prisma 7 on PostgreSQL (Supabase)" },
          { label: "Auth", detail: "Auth.js" },
          { label: "Payments", detail: "SePay (VietQR)" },
          { label: "Images", detail: "Cloudflare R2" },
          { label: "Cache and queue", detail: "Redis" },
          { label: "Monitoring", detail: "Sentry" },
        ],
        shipped: [
          "51 templates across six invitation types: wedding, birthday, baby's first-year, housewarming, event and graduation.",
          "Basic edits through a form; Pro opens the full canvas editor.",
          "One-time purchase per invitation with SePay VietQR checkout.",
          "RSVP, guestbook and map blocks on the published invitation.",
          "An admin area for types, templates, pricing, orders and invoices.",
          "Live at mythiep.com.",
        ],
        imageAlt: "The mythiep template catalog, showing invitation templates grouped by type",
      },
      hadi: {
        title: "Hadi",
        category: "Mobile app · React Native",
        summary:
          "An app that records a lecture and shows two-way Korean/Japanese ↔ Vietnamese subtitles in real time, keeps sessions offline-first and syncs them after each lecture.",
        status: "Live in production",
        problem:
          "Students learning Korean or Japanese need real-time translated subtitles during lectures, with timestamped notes. Most speech-translation apps are one-directional, laggy, or don't save the session.",
        choices: [
          {
            title: "The phone streams audio straight to Soniox stt-rt-v5 over a raw WebSocket, using a short-lived single-use key minted by a Cloud Function",
            why: "A provider key must never ship inside the client. The temporary key is scoped to transcription and expires after 300 seconds.",
            tradeoff: "Soniox is the only provider on the recording path: if it is down, recording and live translation stop, so balance alerts and error monitoring are required.",
          },
          {
            title: "All AI post-processing runs in Cloud Functions: summaries, retranslation, politeness labels and kanji lookup",
          },
          { title: "Offline-first: sessions are stored in expo-sqlite and synced to Firestore across devices after each lecture" },
          { title: "Audio is never stored, only the transcript and its translation; Firestore security rules block any cross-user access" },
          {
            title: "A shared design-token package with a test that fails on hard-coded colours and a numeric WCAG AA contrast check over 56 colour pairs",
          },
        ],
        flow: [
          "Speech",
          "Soniox stt-rt-v5 (WebSocket, temporary key)",
          "Live bilingual subtitles",
          "expo-sqlite (offline)",
          "Firestore sync",
          "Cloud Functions: summary and retranslation",
        ],
        services: [
          { label: "Local storage", detail: "expo-sqlite" },
          { label: "Sync and data", detail: "Firestore" },
          { label: "Auth", detail: "Firebase Auth (Apple, Email)" },
          { label: "Server logic", detail: "Cloud Functions" },
          { label: "Billing", detail: "Apple in-app purchase, verified on the server" },
        ],
        shipped: [
          "Real-time bilingual Korean/Japanese ↔ Vietnamese subtitles on a single socket.",
          "Offline-first storage with expo-sqlite and multi-device sync via Firestore.",
          "A marketing website built with Next.js.",
          "Hadi Live, a Chrome extension that captions a tab's audio (in development).",
          "Live in production, app version 1.3.2.",
        ],
        imageAlt: "The Hadi website, showing the app recording a lecture with live bilingual subtitles",
      },
      crossweave: {
        title: "crossweave",
        category: "Developer tool · Open source",
        summary:
          "A local-first cockpit for running many coding sessions on one repository, each in its own git worktree, and landing them back without hand-merging.",
        status: "Open source · v0.5.0",
        problem:
          "Running several coding agents or dev servers side by side on one repository ends with hand-merging at the end of the day, and parallel runs collide on ports, caches and databases.",
        choices: [
          {
            title: "A session is a git worktree plus a shell in it, with its own port block, cache directory and optional database or Docker names",
            why: "Isolating only the files is not enough: parallel runs also collide on ports and shared state.",
          },
          {
            title: "A background daemon trial-merges sessions against each other, so landing shows what is safe to merge and in what order",
          },
          {
            title: "crossweave never picks, configures or launches the agent; what runs in the shell is yours",
            tradeoff: "Features were removed on purpose (collision radar, browser remote control, in-app voice input) and are kept reachable through release tags.",
          },
          { title: "Bun for the CLI and the daemon, shipped as compiled binaries; Electron with Vite for the desktop cockpit" },
          { title: "A debug bundle for AI: one compact, secret-scrubbed summary of why a session failed, made to paste into an assistant" },
        ],
        flow: ["cw session new", "Work in the session's worktree", "cw converge status", "cw check", "cw land all"],
        services: [
          { label: "Runtime", detail: "Bun (macOS, Linux)" },
          { label: "Desktop", detail: "Electron + Vite" },
          { label: "Distribution", detail: "GitHub Releases with a checksum-verified installer" },
        ],
        shipped: [
          "Worktree isolation with per-session ports, caches and database names.",
          "Convergence engine: a pairwise conflict matrix, a recommended merge order and land-all.",
          "A desktop cockpit with a session rail, a prompt composer that sends one prompt to several sessions, and side-by-side comparison.",
          "Distribution and self-update, a terminal UI, and notifications.",
          "Open source under the MIT licence, version 0.5.0.",
        ],
        imageAlt: "The crossweave cockpit: a rail of sessions on the left and two agent panes side by side",
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
    platforms: { web: "Web", mobile: "Mobile", tool: "Developer tool" },
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
    habitsLabel: "How I approach engineering",
    habits: [
      {
        title: "Tests live next to the code",
        detail: "900+ test files in mythiep, 500+ in Hadi and 200+ in crossweave; the habit is to write them alongside the feature, not after it.",
      },
      {
        title: "Decisions are written down before the code",
        detail: "Larger features start from a spec and a plan. mythiep ran a time-boxed spike on the editor and recorded the decision before the schema was fixed.",
      },
      {
        title: "Secrets never live in the client",
        detail: "Hadi hands the app a 300-second key; mythiep verifies payment notifications with a signature and a secret header on the server.",
      },
      {
        title: "Accessibility is measured, not eyeballed",
        detail: "Hadi has a WCAG AA contrast test over 56 colour pairs. This site runs axe in its end-to-end tests and scores 100 for accessibility on Lighthouse.",
      },
      {
        title: "Performance is measured, not guessed",
        detail: "This site scores 99 for performance on mobile Lighthouse with a CLS of 0; the method and the raw numbers are kept in the repo.",
      },
    ],
    skillsTitle: "Technology",
    skillGroups: [
      { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Material-UI", "Framer Motion", "GSAP", "Electron"] },
      { name: "Mobile", items: ["React Native", "Expo", "expo-sqlite"] },
      {
        name: "Backend & data",
        items: ["Node.js", "Express", "PostgreSQL", "Prisma", "MongoDB", "MySQL", "Socket.io", "Firebase", "Auth.js", "JWT", "Redis", "Bun"],
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
};
