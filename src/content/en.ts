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
