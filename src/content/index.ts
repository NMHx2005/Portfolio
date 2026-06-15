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
          techStack: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Material-UI"],
          links: [
            { label: "Xem website", href: "https://www.lms-vietnam.xyz/", variant: "primary", external: true },
            { label: "GitHub", href: "https://github.com/NMHx2005/lms-frontend", variant: "secondary", external: true },
          ],
          image: { src: sharedProjectImages.lms, alt: "Learning Management System preview" },
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
          techStack: ["Next.js 14", "TypeScript", "Material-UI", "Node.js", "MongoDB", "Cloudinary"],
          links: [
            { label: "Xem website", href: "https://www.minhlocgroup.vn/", variant: "primary", external: true },
            { label: "GitHub", href: "https://github.com/NMHx2005/MinhLoc_FE", variant: "secondary", external: true },
          ],
          image: { src: sharedProjectImages.minhloc, alt: "MinhLoc Group platform preview" },
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
          items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "Material-UI"],
        },
        {
          name: "Backend",
          items: ["Node.js", "Express", "MongoDB", "MySQL", "Socket.io", "JWT", "Cloudinary"],
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
          description: "Nghe yêu cầu, xác định scope, deliverable, báo giá. Không tính phí.",
        },
        {
          title: "Design & Plan",
          duration: "3–5 ngày",
          description: "Wireframe, design mockup, tech plan. Bạn duyệt rồi mới code.",
        },
        {
          title: "Build",
          duration: "Theo scope",
          description: "Code, demo từng tuần, feedback loop. Không bao giờ biến mất.",
        },
        {
          title: "Launch",
          duration: "1–2 ngày",
          description: "Deploy, domain, SEO basics, hướng dẫn admin. Sẵn sàng đón khách.",
        },
        {
          title: "Support",
          duration: "30 ngày miễn phí",
          description: "Fix bug, hướng dẫn. Sau đó option bảo trì hàng tháng nếu cần.",
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
      description: "Two flagship case studies. Both running in production today.",
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
          techStack: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Material-UI"],
          links: [
            { label: "Live site", href: "https://www.lms-vietnam.xyz/", variant: "primary", external: true },
            { label: "GitHub", href: "https://github.com/NMHx2005/lms-frontend", variant: "secondary", external: true },
          ],
          image: { src: sharedProjectImages.lms, alt: "Learning Management System preview" },
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
          techStack: ["Next.js 14", "TypeScript", "Material-UI", "Node.js", "MongoDB", "Cloudinary"],
          links: [
            { label: "Live site", href: "https://www.minhlocgroup.vn/", variant: "primary", external: true },
            { label: "GitHub", href: "https://github.com/NMHx2005/MinhLoc_FE", variant: "secondary", external: true },
          ],
          image: { src: sharedProjectImages.minhloc, alt: "MinhLoc Group platform preview" },
        },
      ],
    },
    stack: {
      eyebrow: "Tech Stack",
      headline: "Tools I use daily",
      description: "I'm not tied to one framework. I pick the right tool for each project.",
      groups: [
        {
          name: "Frontend",
          items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "Material-UI"],
        },
        {
          name: "Backend",
          items: ["Node.js", "Express", "MongoDB", "MySQL", "Socket.io", "JWT", "Cloudinary"],
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
      description: "A clear 5-step process. You always know where we are and what's next.",
      steps: [
        {
          title: "Discovery",
          duration: "1–2 days",
          description: "Listen to requirements, define scope, deliverables, quote. Free of charge.",
        },
        {
          title: "Design & Plan",
          duration: "3–5 days",
          description: "Wireframe, design mockup, tech plan. You approve before code starts.",
        },
        {
          title: "Build",
          duration: "Scope-dependent",
          description: "Code, weekly demos, feedback loop. I never go dark.",
        },
        {
          title: "Launch",
          duration: "1–2 days",
          description: "Deploy, domain, SEO basics, admin handover. Ready for customers.",
        },
        {
          title: "Support",
          duration: "30 days free",
          description: "Bug fixes, guidance. Optional monthly maintenance after that.",
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
      description: "Available for new projects. Pick your favorite channel — I respond within 24 hours.",
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
