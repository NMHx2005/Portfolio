import type { Dictionary } from "./types";

export const en: Dictionary = {
  meta: {
    title: "Nguyễn Mạnh Hùng — Software Engineer in Hanoi",
    description:
      "Software engineer in Hanoi building websites, web apps, mobile apps and AI features end to end for businesses and shops: on contract, with a weekly demo, handing over the full source code and accounts.",
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
    { id: "process", label: "Process" },
    { id: "about", label: "About" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact" },
  ],
  hero: {
    status: "Open to new projects · Hanoi, UTC+7",
    headline: "Software built through to launch day.",
    intro:
      "I'm Nguyễn Mạnh Hùng, a software engineer in Hanoi. I build websites, web apps, mobile apps and AI features end to end for businesses and shops: on contract, with a weekly demo, handing over the full source code and accounts.",
    primaryCta: "Send a request",
    secondaryCta: "See projects",
    stripLabel: "Screenshots of the products I built",
    stripGroupLabel: "Product screenshots",
    stripPause: "Pause the screenshots",
    statsLabel: "Key figures",
    figures: {
      live: "products running live",
      total: "products built or in the making",
      sameClient: "products ordered in a row by the same client",
      rankdleDays: "days from the first line of code to Rankdle going live",
    },
  },
  sections: {
    projects: {
      index: "01",
      label: "Work",
      heading: "Products I have built",
      lede: "Five products, each with its client, the time it took and where it stands today.",
    },
    services: {
      index: "02",
      label: "Services",
      heading: "Work I take on",
      lede: "Four kinds of work, each with the products that prove it. Don't see what you need? Send a message and I'll give you an honest answer.",
    },
    process: {
      index: "03",
      label: "Process",
      heading: "How I work",
      lede: "Five clear steps. You always know where the project is and what comes next.",
    },
    about: {
      index: "04",
      label: "About",
      heading: "One person who builds it from start to launch day",
    },
    faq: {
      index: "05",
      label: "FAQ",
      heading: "Frequently asked questions",
      lede: "What clients ask most before we start.",
    },
    contact: {
      index: "06",
      label: "Contact",
      heading: "Send me a request",
      lede: "Tell me what you need. Pick whichever channel suits you and I'll reply within 24 hours.",
    },
  },
  work: {
    viewCaseStudy: "View project",
    live: "Visit the product",
    askSource: "Ask about the source code",
    statusLabels: {
      live: "Live",
      launching: "Launching soon",
      forSale: "Source for sale",
      building: "In development",
      testBuild: "Test build",
    },
    items: {
      tingtingvac: {
        title: "TingTingVác",
        client: "Công ty TNHH Liên Phong Group",
        platform: "iOS and Android app, web admin, website",
        summary:
          "A platform that connects people who need moving, loading or furniture installation with vetted workers in Hanoi.",
        problem:
          "People in Hanoi who need moving, loading or furniture installation need a place to post the job and receive quotes from vetted workers.",
        delivered: [
          "Customers post a job, workers bid, the customer picks among the ten lowest bids, accepts the work and rates it.",
          "Worker applications reviewed by staff, with support for teams and substitute workers.",
          "A prepaid fee account for workers, where every change to the money needs two people's approval.",
          "A staff admin site, an emergency duty portal, the public website and an account-deletion page.",
          "Login by SMS code and Google, push notifications and server monitoring.",
          "6,049 database test cases passing; servers at Viettel IDC with a staging twin.",
        ],
        coverAlt: "The TingTingVác website home page: a headline about hiring a mover nearby and the in-app list of quotes from workers",
        galleryAlt: [
          "The four-step section of the TingTingVác website, from posting a job with photos to acceptance, with the in-app posting and quote screens",
          "The website section showing how a job appears to workers, the kinds of work they can choose and the quote-sending screen",
        ],
      },
      rankdle: {
        title: "Rankdle",
        client: "team Levi",
        platform: "Web, installable like an app",
        summary: "A daily game where Mobile Legends players watch clips and guess the rank of the player in each clip.",
        delivered: [
          "Three scored clips a day drawn from a pool, plus up to six extra unscored clips.",
          "Leaderboards by period, by season and by day streak, with a prize table.",
          "Players submit clips; an admin approves them and masks details before they go up.",
          "Anti-cheat: at most three accounts per device, and lists of suspicious accounts.",
          "Notifications by email and inside the site.",
          "An admin panel to edit content, view statistics, back up and restore, and switch on maintenance mode.",
          "3,570 automated tests.",
        ],
        coverAlt: "The Rankdle home page: the Guess the MLBB Rank headline, the prizes and a Play now button",
        galleryAlt: [
          "The How to play Rankdle dialog with three steps: watch the clip, pick a rank and climb the leaderboard",
          "The Rankdle rules page with the terms, the scoring and the prize structure",
        ],
      },
      mythiep: {
        title: "mythiep",
        client: "mythiep brand owner",
        platform: "Web",
        summary:
          "Self-service online invitations: pick a template, pay once, edit in the browser and share a link.",
        problem:
          "Hosts want to finish an invitation themselves: pick a template, personalise it, send a link and collect replies, without hiring a designer.",
        delivered: [
          "51 templates in six types: wedding, birthday, baby's first birthday, housewarming, event and graduation.",
          "One-time VietQR payment through SePay, with a bank-webhook fallback and reconciliation.",
          "A Basic tier to edit text and photos and a Pro tier to edit the layout by drag and drop.",
          "RSVP, guest wishes and virtual gifts.",
          "A full-screen display for the wedding reception.",
          "An admin site for templates, prices and orders.",
          "Agency and referral partner programmes.",
        ],
        choices: [
          {
            title: "SePay VietQR payments: one payment per invitation, bank payment notifications verified with a secret header, and a reconciliation fallback",
          },
          { title: "Invitation images are stored on Cloudflare R2 as webp in several sizes (768/1200/1600 px) and served with srcset instead of next/image" },
          {
            title: "Next.js and Prisma on PostgreSQL with 80 migrations; the app and Redis run in Docker on a VPS",
          },
          { title: "Cloudflare Turnstile on the RSVP and wishes forms, so a public invitation takes replies without accounts while limiting spam" },
        ],
        coverAlt: "The mythiep template catalogue with 51 templates, split by invitation type and filters",
        galleryAlt: [
          "The Gold envelope wedding template page with its feature list and the try and demo buttons",
          "A demo invitation on a phone: an envelope with a gold wax seal, tap to open the invitation",
        ],
      },
      hadi: {
        title: "Hadi",
        client: "Hadi product owner",
        platform: "iOS and Android app, marketing website, Chrome extension",
        summary:
          "An app that records a lecture and shows live translated subtitles between Korean or Japanese and Vietnamese, in both directions.",
        problem:
          "Learners of Korean and Japanese need live translated subtitles during a lecture, with timestamped notes.",
        delivered: [
          "Real-time bilingual subtitles, translated between Korean or Japanese and Vietnamese, in both directions.",
          "AI summaries, mind maps and vocabulary cards.",
          "Offline-first storage with multi-device sync, and no audio stored.",
          "In-app purchases on Apple and Google Play, verified on the server.",
          "An interface in four languages: Vietnamese, English, Korean and Japanese.",
          "The Hadi Live Chrome extension and the marketing website.",
          "The iOS app is on the App Store (version 1.5); the Android app is in closed testing.",
        ],
        choices: [
          {
            title: "The phone streams audio straight to Soniox stt-rt-v6 over a raw WebSocket, using a single-use temporary key issued by a Cloud Function",
            why: "The provider's master key never lives in the client. The temporary key can only transcribe and expires after 300 seconds.",
            tradeoff: "Soniox is the only provider on the recording path: if it goes down, recording and realtime translation stop too, so balance alerts and error monitoring are mandatory.",
          },
          {
            title: "All post-processing AI runs in Cloud Functions: summaries, re-translation, politeness labels and Hanja lookup",
          },
          { title: "Offline-first: lessons are stored in expo-sqlite and synced across devices through Firestore after each session" },
          { title: "No audio is stored, only the transcript and translation; Firestore security rules block any cross-user access" },
          {
            title: "A shared design-token package with a test that fails on any hard-coded colour and a numeric WCAG AA contrast check over 56 colour pairs",
          },
        ],
        coverAlt: "The Hadi website home page: a Keep up with the lecture headline and the app screen recording a lesson",
        galleryAlt: [
          "The transcript screen in the Hadi app: original Korean sentences alternating with Vietnamese translations by timestamp",
          "A transcript screen with an AI summary showing the main points, terms and review questions",
          "A vocabulary card in the app: a Korean noun with its meaning and an explanation in Vietnamese",
          "The Hadi app home screen with the Start recording button, the listening modes and the featured features",
          "A screen recording a lecture, with bilingual subtitles appearing in real time",
        ],
      },
      tinvid: {
        title: "TinVid",
        client: "In-house product",
        platform: "Command line, local web interface and Telegram bot",
        summary:
          "Turns an article link, a topic or a piece of text into a finished short video with a script, motion graphics and a Vietnamese voice-over.",
        delivered: [
          "An AI-written script with a fact-check step.",
          "A Vietnamese voice with word-level captions.",
          "11 scene templates and 4 colour themes.",
          "Vertical and horizontal versions in a single run, with a thumbnail, title and description.",
          "Usable from the command line, a local web interface or a Telegram bot.",
          "A cost estimate before the video is rendered.",
          "It ran as a paid hosted service at tinvid.com before I switched to selling the source code.",
        ],
        coverAlt: "The TinVid home page: a headline about turning an article into a Vietnamese-voiced video, with horizontal and vertical video previews",
        galleryAlt: [],
      },
    },
    building: {
      heading: "Hadi's client ordered two more apps",
      lede: "The same client who ordered Hadi ordered these two apps next. Neither is released yet.",
      items: {
        classnote: {
          title: "classnote",
          summary:
            "A mobile app for tutors: schedule, attendance, automatic tuition, receipts with VietQR, automatic bank-transfer reconciliation and reports for parents.",
        },
        hanyu: {
          title: "Hanyu",
          summary:
            "An iPhone app for Vietnamese learners of Chinese: 87 HSK 1–3 lessons, a 1,049-entry offline dictionary and 680 speaking items scored for pronunciation. Version 0.1.0.",
        },
      },
    },
  },
  caseStudy: {
    back: "All projects",
    client: "Client",
    period: "Period",
    platform: "Platform",
    status: "Status",
    problem: "The need",
    delivered: "What was delivered",
    gallery: "Pictures",
    links: "Links",
    technical: "Technical detail, for technical readers",
    why: "Why",
    tradeoff: "Trade-off",
    stack: "Technology",
    next: "Next project",
    previous: "Previous project",
  },
  services: {
    provenBy: "Products I built",
    request: "Send a request for this kind of work",
    items: {
      web: {
        title: "Company and shop websites",
        description: "A website for your company, shop or product that looks right on a phone, with basic SEO.",
        duration: "Landing page: 1–2 weeks",
      },
      webapp: {
        title: "Web apps and management systems",
        description: "A system you use every day in the browser: login, payments, an admin site and statistics.",
        duration: "1–3 months, depending on scope",
      },
      mobile: {
        title: "iOS and Android apps",
        description: "Apps for iPhone and Android, with offline use and sync across devices when your product needs them.",
      },
      ai: {
        title: "AI integration",
        description: "AI inside your product: live subtitles and translation, summaries, script writing and voice-over.",
      },
    },
  },
  about: {
    paragraphs: [
      "I'm Nguyễn Mạnh Hùng, a software engineer in Hanoi. I build a whole product: from the database and server to the web and mobile interface, and then I put it live.",
      "I work remotely with clients in Vietnam and abroad, meet over Zoom or Google Meet, and can meet in person in Hanoi.",
      "Every product on this page shows its real status, including the ones that are not released. If you need someone to build it end to end, send me a request.",
    ],
    skillsTitle: "Technology",
    skillGroups: [
      { name: "Web", items: ["React", "React Router", "Next.js", "TypeScript"] },
      { name: "Mobile", items: ["React Native", "Expo", "Flutter", "SQLite"] },
      { name: "Server & data", items: ["Node.js", "Python", "FastAPI", "PostgreSQL", "Prisma", "Redis", "Firebase", "Cloud Functions"] },
      { name: "Infrastructure", items: ["Docker", "Cloudflare Workers", "Cloudflare D1", "Cloudflare R2", "Mux", "Amazon SES", "Sentry"] },
      { name: "AI & video", items: ["Claude", "ElevenLabs", "Soniox", "Remotion"] },
    ],
  },
  process: {
    steps: [
      { title: "Discovery", duration: "1–2 days", description: "I listen to what you need and settle the scope and what will be handed over. The first conversation is free." },
      { title: "Design and plan", duration: "3–5 days", description: "A sketch of the interface and a working plan. You approve before I start writing code." },
      { title: "Build", duration: "Scope-dependent", description: "I work on contract and demo every week so you can give feedback. You always know where the project stands." },
      { title: "Launch", duration: "1–2 days", description: "Going live, connecting your domain, basic SEO, and showing you how to use the admin site." },
      { title: "Support", duration: "30 days free", description: "Bug fixes and guidance for the first 30 days. After that there is a monthly maintenance plan if you need it." },
    ],
    ownership: "After full payment, the source code, the domain and the app-store accounts are handed over in your name.",
    payment: "Payment in three instalments: 30%, 40%, 30%.",
  },
  faq: {
    items: [
      { q: "How long does a product take?", a: "Landing page: 1–2 weeks. Web app: 1–3 months depending on scope. I'll give you a concrete timeline after the first conversation." },
      { q: "Do you work with clients outside Hanoi or overseas?", a: "Yes. I work fully remote, with calls on Zoom or Google Meet and messages over email or Zalo, whichever you prefer. If you are in Hanoi, I can meet in person." },
      { q: "Do you support the product after launch?", a: "The first 30 days of bug fixes are free. After that there's an optional monthly maintenance plan if you want me long-term." },
      { q: "What tech do you use? Do I need to know code?", a: "It depends on the problem. My recent products use Next.js, React Native (Expo), Flutter and Node.js. You don't need to know code: I explain in everyday language." },
      { q: "I already have a site. Can you upgrade it?", a: "Yes, as long as it isn't locked into a closed platform (Wix, Squarespace). I review it for free before quoting." },
      { q: "How does payment work?", a: "Usually three instalments: 30% on signing, 40% mid-project (once the demo works), 30% on handover. Vietnamese bank transfer, or Wise for international clients." },
      { q: "Do I own the source code?", a: "Yes. After full payment the source code is 100% yours, handed over with deployment and editing guides." },
    ],
  },
  contact: {
    labels: { zalo: "Zalo", phone: "Phone", email: "Email", github: "GitHub", cv: "Download CV" },
    response: "Replies within 24 hours",
    form: {
      title: "Send a request",
      fields: {
        name: "Your name",
        company: "Company or shop (optional)",
        reply: "Phone, Zalo or email to reach you",
        kind: "Kind of work",
        message: "What do you need",
        timeline: "Desired timeline (optional)",
      },
      kindPrompt: "Choose a kind of work",
      kinds: {
        web: "Company or shop website",
        webapp: "Web app, management system",
        mobile: "iOS and Android app",
        ai: "AI integration",
        other: "Something else",
      },
      placeholders: {
        message: "Briefly describe what you need, who will use it and what for.",
        timeline: "For example: needed before March",
      },
      submit: "Send request",
      sending: "Sending…",
      success: "Sent. I'll reply within 24 hours.",
      failure: "Your request could not be sent. Please message me on Zalo or call +84 971 084 430.",
      invalid: {
        name: "Please enter your name.",
        company: "The company or shop name is too long.",
        reply: "Please enter a valid phone number, Zalo or email.",
        kind: "Please choose a kind of work.",
        message: "Please describe what you need.",
        timeline: "The desired timeline is too long.",
      },
      noScript: "The form needs JavaScript. You can reach me directly through the channels beside it.",
    },
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
