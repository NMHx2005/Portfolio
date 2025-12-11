export type Locale = "en" | "vi";

export interface ActionLink {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  download?: boolean;
}

export interface MediaAsset {
  type: "image" | "video";
  src: string;
  alt: string;
}

export interface HeroContent {
  name: string;
  role: string;
  tagline: string;
  highlight: string;
  greeting: string;
  location: string;
  availability: string;
  actions: ActionLink[];
  portrait: MediaAsset;
  codeProfile: {
    fileName: string;
    seniority: string;
    skills: string[];
  };
}

export interface AboutContent {
  eyebrow: string;
  headline: string;
  story: string;
  mission: string;
  values: string[];
  skills: {
    category: string;
    items: string[];
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: string;
  }[];
}

export interface Project {
  title: string;
  category: string;
  description: string;
  highlights: string[];
  techStack: string[];
  link: ActionLink;
  media: MediaAsset;
}

export interface ExperienceItem {
  company: string;
  role: string;
  start: string;
  end: string;
  summary: string;
  achievements: string[];
  tech: string[];
}

export interface EducationItem {
  institution: string;
  program: string;
  start: string;
  end: string;
  details: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tags: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export interface Award {
  name: string;
  issuer: string;
  year: string;
  description: string;
}

export interface ContactContent {
  intro: string;
  availability: string;
  email: string;
  phone: string;
  location: string;
  socials: {
    label: string;
    href: string;
  }[];
}

export interface ExperienceContent {
  headline: string;
  items: ExperienceItem[];
  education: EducationItem[];
}

export interface BlogContent {
  headline: string;
  description: string;
  posts: BlogPost[];
}

export interface ContactSection {
  headline: string;
  description: string;
  content: ContactContent;
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  projects: {
    headline: string;
    description: string;
    items: Project[];
  };
  experience: ExperienceContent;
  blog: BlogContent;
  testimonials: {
    headline: string;
    items: Testimonial[];
  };
  awards: {
    headline: string;
    description: string;
    items: Award[];
  };
  contact: ContactSection;
  footer: {
    availability: string;
    note: string;
  };
}

export const supportedLocales: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
];

export const siteContent: Record<Locale, SiteContent> = {
  en: {
    hero: {
      name: "Nguyễn Mạnh Hùng",
      role: "Senior Frontend Engineer & Creative Technologist",
      tagline:
        "I craft immersive web experiences at the intersection of performance, storytelling, and thoughtful interaction.",
      highlight: "Designing future-ready digital experiences",
      greeting: "Hello, I'm",
      location: "Ho Chi Minh City, Vietnam",
      availability: "Open for consulting and remote projects from Jan 2026",
      actions: [
        {
          label: "View Projects",
          href: "#projects",
          variant: "primary",
        },
        {
          label: "Contact",
          href: "#contact",
          variant: "secondary",
        },
        {
          label: "Download CV",
          href: "/assets/nguyen-manh-hung-cv.pdf",
          variant: "ghost",
          download: true,
        },
      ],
      portrait: {
        type: "image",
        src: "/portrait.svg",
        alt: "Portrait illustration",
      },
      codeProfile: {
        fileName: "coder.ts",
        seniority: "Staff-level",
        skills: [
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Framer Motion",
          "Three.js",
          "Node.js",
          "Express",
          "MongoDB",
          "PostgreSQL",
          "Firebase",
          "Figma",
          "Git",
        ],
      },
    },
    about: {
      eyebrow: "About",
      headline: "Rooted in empathy, powered by craft",
      story:
        "Over the past 7+ years, I've helped startups and global brands transform ambitious ideas into award-winning digital products. My focus lies in building resilient frontend architectures, leading cross-functional teams, and elevating brand narratives through rich, interactive storytelling.",
      mission:
        "Blend purposeful design with scalable engineering to launch experiences that feel human, inclusive, and blazingly fast.",
      values: [
        "Empathy and user-first thinking",
        "Performance as a core design principle",
        "Accessibility without compromise",
        "Continuous learning and mentorship",
      ],
      skills: [
        {
          category: "Frontend Engineering",
          items: [
            "React & Next.js",
            "TypeScript",
            "Framer Motion & GSAP",
            "Three.js & WebGL",
            "Tailwind CSS",
            "Design Systems",
          ],
        },
        {
          category: "Product & Strategy",
          items: [
            "UX Research",
            "Story-driven prototyping",
            "Design leadership",
            "Stakeholder facilitation",
            "Data-informed iterations",
          ],
        },
        {
          category: "Tools & Platforms",
          items: [
            "Figma & FigJam",
            "Notion & Linear",
            "Vercel & Netlify",
            "Playwright & Vitest",
            "GA4 & Mixpanel",
          ],
        },
      ],
      certifications: [
        {
          name: "Google UX Design Professional Certificate",
          issuer: "Google",
          year: "2023",
        },
        {
          name: "AWS Certified Cloud Practitioner",
          issuer: "Amazon Web Services",
          year: "2022",
        },
        {
          name: "Scrum Professional Product Owner",
          issuer: "Scrum.org",
          year: "2021",
        },
      ],
    },
    projects: {
      headline: "Selected Work",
      description:
        "A curated mix of product launches, immersive brand sites, and experimental playgrounds that highlight my end-to-end ownership—from research to production.",
      items: [
        {
          title: "Aurora XR Launch",
          category: "Immersive Marketing",
          description:
            "Conceptualized and delivered a cinematic landing experience for the Aurora XR headset launch with real-time 3D visualizations and dynamic storytelling.",
          highlights: [
            "Achieved 3.2× conversion uplift within the first week",
            "Coordinated cross-team narrative between design, 3D, and engineering",
            "Optimized WebGL assets to load under 2.5s on 4G networks",
          ],
          techStack: [
            "Next.js",
            "Three.js",
            "Framer Motion",
            "Web Workers",
            "Cloudinary",
          ],
          link: {
            label: "View Case Study",
            href: "https://example.com/aurora",
            variant: "primary",
          },
          media: {
            type: "image",
            src: "/projects/aurora-cover.svg",
            alt: "Aurora XR headset landing page preview",
          },
        },
        {
          title: "Pulse Analytics Platform",
          category: "Product Design & Build",
          description:
            "Led the design system and frontend build for a growth analytics platform serving 120k+ daily active users with real-time dashboards.",
          highlights: [
            "Reduced onboarding friction by 46% through guided flows",
            "Introduced design tokens that cut build time for new features by 30%",
            "Implemented dark/light theming with accessibility AA compliance",
          ],
          techStack: [
            "React",
            "Next.js App Router",
            "Recharts",
            "Radix UI",
            "Storybook",
          ],
          link: {
            label: "Open Live App",
            href: "https://example.com/pulse",
            variant: "secondary",
          },
          media: {
            type: "image",
            src: "/projects/pulse-dashboard.svg",
            alt: "Pulse analytics dashboard in dual theme view",
          },
        },
        {
          title: "Sonder Studio Brand Refresh",
          category: "Creative Technology",
          description:
            "Partnered with a boutique agency to reimagine their digital presence with playful micro-interactions, scroll-driven narratives, and editorial typography.",
          highlights: [
            "Won Awwwards Site of the Day (Dec 2024)",
            "Built custom CMS modules enabling marketing team autonomy",
            "Implemented multi-language support for English, Vietnamese, and Japanese",
          ],
          techStack: [
            "Next.js",
            "Contentful",
            "Framer Motion",
            "Lenis",
            "Lottie",
          ],
          link: {
            label: "Visit Website",
            href: "https://example.com/sonder",
            variant: "secondary",
          },
          media: {
            type: "image",
            src: "/projects/sonder-showcase.svg",
            alt: "Sonder Studio homepage with animated typography",
          },
        },
      ],
    },
    experience: {
      headline: "Experience & Education",
      items: [
        {
          company: "Flowspace Labs",
          role: "Senior Frontend Engineer",
          start: "2022",
          end: "Present",
          summary:
            "Driving the frontend engineering roadmap for a real-time collaboration suite with 2M+ users.",
          achievements: [
            "Architected migration to Next.js App Router with zero downtime",
            "Introduced automated visual regression testing reducing production bugs by 40%",
            "Mentored a squad of 6 engineers and designers across APAC and EU timezones",
          ],
          tech: ["Next.js", "TypeScript", "WebRTC", "Playwright", "GraphQL"],
        },
        {
          company: "Studio Nebula",
          role: "Lead Product Designer",
          start: "2019",
          end: "2022",
          summary:
            "Led product discovery and prototyping for immersive retail experiences across SEA markets.",
          achievements: [
            "Piloted AR try-on experience boosting time-on-site by 62%",
            "Built modular design system adopted by partner agencies",
            "Hosted quarterly workshops on inclusive design for retail partners",
          ],
          tech: ["Figma", "React", "Three.js", "Notion", "Miro"],
        },
        {
          company: "Freelance",
          role: "Creative Frontend Developer",
          start: "2016",
          end: "2019",
          summary:
            "Partnered with founders and artists to launch digital-first storytelling experiences.",
          achievements: [
            "Delivered 25+ portfolio and e-commerce sites with custom interactions",
            "Collaborated with illustrators to build interactive editorial pieces",
            "Maintained 95% client satisfaction with agile delivery loops",
          ],
          tech: ["Gatsby", "Vue", "GSAP", "Contentful", "Firebase"],
        },
      ],
      education: [
        {
          institution: "RMIT University Vietnam",
          program: "Bachelor of Design (Digital Media)",
          start: "2012",
          end: "2015",
          details:
            "Graduated with Distinction. Led the Creative Tech Society and organized the annual digital showcase.",
        },
        {
          institution: "Interaction Design Foundation",
          program: "Advanced UX Management",
          start: "2021",
          end: "2021",
          details:
            "Capstone focused on building inclusive workflows for cross-functional product teams.",
        },
      ],
    },
    blog: {
      headline: "Insights & Experiments",
      description:
        "I write about design systems, creative technology, and practices that help teams ship impactful work.",
      posts: [
        {
          title: "Designing Motion Systems that Scale",
          slug: "motion-systems-that-scale",
          excerpt:
            "A practical guide to aligning brand expression with engineering constraints when shipping motion-heavy products.",
          date: "October 2, 2025",
          readingTime: "8 min read",
          tags: ["motion", "design systems", "frontend"],
        },
        {
          title: "Leveling up Accessibility in Next.js App Router",
          slug: "nextjs-accessibility-app-router",
          excerpt:
            "Lessons learned instrumenting automated audits, live regions, and focus management in large Next.js deployments.",
          date: "August 18, 2025",
          readingTime: "6 min read",
          tags: ["accessibility", "next.js", "tooling"],
        },
        {
          title: "From Curiosity to Craft: Building a Creative Tech Career",
          slug: "creative-tech-career",
          excerpt:
            "Reflections on seven years of navigating creative tech roles, and frameworks that helped me grow intentionally.",
          date: "May 9, 2025",
          readingTime: "10 min read",
          tags: ["career", "leadership", "mindset"],
        },
      ],
    },
    testimonials: {
      headline: "Trusted by collaborators",
      items: [
        {
          name: "Linh Tran",
          role: "Design Director, Sonder Studio",
          quote:
            "An is a rare blend of visionary and builder. He translated abstract concepts into tangible experiences that moved both our clients and internal teams.",
        },
        {
          name: "Samuel Green",
          role: "Head of Product, Flowspace Labs",
          quote:
            "From architecture to micro-interactions, An consistently elevates our craft. His mentorship has grown our frontend discipline exponentially.",
        },
        {
          name: "Aya Nakamura",
          role: "Creative Producer, Aurora XR",
          quote:
            "We relied on An to orchestrate multiple teams during a critical launch. The result exceeded every metric we set and felt truly premium.",
        },
      ],
    },
    awards: {
      headline: "Recognition & Community",
      description:
        "Celebrating milestones and initiatives that keep me grounded in the creative tech community.",
      items: [
        {
          name: "Awwwards – Site of the Day",
          issuer: "Awwwards",
          year: "2024",
          description:
            "Recognized for the Sonder Studio microsite, highlighting innovative scroll choreography and editorial motion.",
        },
        {
          name: "Speaker – Web Directions Hover",
          issuer: "Web Directions",
          year: "2023",
          description:
            "Delivered a talk on building accessible motion systems for global audiences.",
        },
        {
          name: "Mentor – ADPList",
          issuer: "ADPList",
          year: "2021 - Present",
          description:
            "Providing 1:1 mentorship for early-career designers and developers worldwide.",
        },
      ],
    },
    contact: {
      headline: "Let’s collaborate",
      description:
        "Share a brief about your project or invite me to speak. I typically respond within two business days.",
      content: {
        intro:
          "Tell me about the problem you're solving and the impact you want to create. I'm especially excited about immersive storytelling, design systems, and purposeful product experiences.",
        availability: "Currently booking for Q1 2026 engagements.",
        email: "hello@manhhung.design",
        phone: "+84 908 123 456",
        location: "Ho Chi Minh City, Vietnam (UTC+7)",
        socials: [
          { label: "LinkedIn", href: "https://www.linkedin.com/in/manhhung" },
          { label: "GitHub", href: "https://github.com/manhhung" },
          { label: "Dribbble", href: "https://dribbble.com/manhhung" },
          { label: "Behance", href: "https://behance.net/manhhung" },
        ],
      },
    },
    footer: {
      availability: "Available for select collaborations from January 2026.",
      note: "© 2025 Nguyen Manh Hung. Crafted with curiosity in Saigon.",
    },
  },
  vi: {
    hero: {
      name: "Nguyễn Mạnh Hùng",
      role: "Kỹ sư Frontend Cao cấp & Creative Technologist",
      tagline:
        "Tôi tạo ra những trải nghiệm web giàu cảm xúc, cân bằng hiệu năng, câu chuyện và tương tác tinh tế.",
      highlight: "Kiến tạo trải nghiệm số bền vững cho tương lai",
      greeting: "Xin chào, tôi là",
      location: "TP. Hồ Chí Minh, Việt Nam",
      availability: "Nhận dự án tư vấn và remote từ tháng 01.2026",
      actions: [
        {
          label: "Xem dự án",
          href: "#projects",
          variant: "primary",
        },
        {
          label: "Liên hệ",
          href: "#contact",
          variant: "secondary",
        },
        {
          label: "Tải CV",
          href: "/assets/nguyen-manh-hung-cv.pdf",
          variant: "ghost",
          download: true,
        },
      ],
      portrait: {
        type: "image",
        src: "/portrait.svg",
        alt: "Chân dung mô phỏng",
      },
      codeProfile: {
        fileName: "coder.ts",
        seniority: "Senior",
        skills: [
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Framer Motion",
          "Three.js",
          "Node.js",
          "Express",
          "MongoDB",
          "PostgreSQL",
          "Firebase",
          "Figma",
          "Git",
        ],
      },
    },
    about: {
      eyebrow: "Về tôi",
      headline: "Thấu cảm dẫn đường, kỹ năng làm nên khác biệt",
      story:
        "Hơn 7 năm qua, tôi đồng hành cùng startup và các thương hiệu toàn cầu để biến ý tưởng táo bạo thành sản phẩm số đoạt giải. Tôi tập trung xây dựng kiến trúc frontend vững chắc, dẫn dắt đội ngũ đa ngành và kể câu chuyện thương hiệu bằng trải nghiệm giàu tương tác.",
      mission:
        "Kết hợp thiết kế có mục đích với kỹ thuật mở rộng để tạo nên trải nghiệm nhân văn, dễ tiếp cận và cực nhanh.",
      values: [
        "Đặt người dùng làm trung tâm",
        "Hiệu năng là tiêu chí thiết kế cốt lõi",
        "Tiếp cận toàn diện cho mọi người",
        "Luôn học hỏi và chia sẻ",
      ],
      skills: [
        {
          category: "Kỹ thuật Frontend",
          items: [
            "React & Next.js",
            "TypeScript",
            "Framer Motion & GSAP",
            "Three.js & WebGL",
            "Tailwind CSS",
            "Design Systems",
          ],
        },
        {
          category: "Sản phẩm & Chiến lược",
          items: [
            "Nghiên cứu UX",
            "Prototype theo câu chuyện",
            "Dẫn dắt thiết kế",
            "Điều phối stakeholder",
            "Lặp lại dựa trên dữ liệu",
          ],
        },
        {
          category: "Công cụ & Nền tảng",
          items: [
            "Figma & FigJam",
            "Notion & Linear",
            "Vercel & Netlify",
            "Playwright & Vitest",
            "GA4 & Mixpanel",
          ],
        },
      ],
      certifications: [
        {
          name: "Google UX Design Professional Certificate",
          issuer: "Google",
          year: "2023",
        },
        {
          name: "AWS Certified Cloud Practitioner",
          issuer: "Amazon Web Services",
          year: "2022",
        },
        {
          name: "Scrum Professional Product Owner",
          issuer: "Scrum.org",
          year: "2021",
        },
      ],
    },
    projects: {
      headline: "Dự án tiêu biểu",
      description:
        "Tuyển chọn các sản phẩm, website thương hiệu và playground thể hiện khả năng dẫn dắt từ nghiên cứu đến triển khai thực tế.",
      items: [
        {
          title: "Aurora XR Launch",
          category: "Truyền thông Immersive",
          description:
            "Thiết kế và triển khai trải nghiệm landing kịch tính cho chiến dịch ra mắt kính Aurora XR với hình ảnh 3D thời gian thực và storytelling động.",
          highlights: [
            "Tăng 3.2× tỷ lệ chuyển đổi trong tuần đầu tiên",
            "Điều phối câu chuyện giữa các nhóm thiết kế, 3D và kỹ thuật",
            "Tối ưu WebGL tải dưới 2.5s trên mạng 4G",
          ],
          techStack: [
            "Next.js",
            "Three.js",
            "Framer Motion",
            "Web Workers",
            "Cloudinary",
          ],
          link: {
            label: "Xem case study",
            href: "https://example.com/aurora",
            variant: "primary",
          },
          media: {
            type: "image",
            src: "/projects/aurora-cover.svg",
            alt: "Preview landing Aurora XR",
          },
        },
        {
          title: "Pulse Analytics Platform",
          category: "Sản phẩm số",
          description:
            "Xây dựng hệ thống thiết kế và frontend cho nền tảng analytics phục vụ 120k+ người dùng hàng ngày với dashboard realtime.",
          highlights: [
            "Giảm 46% friction onboarding nhờ flow hướng dẫn",
            "Thiết lập design tokens giúp rút ngắn 30% thời gian phát triển tính năng mới",
            "Triển khai dark/light theme đạt chuẩn AA accessibility",
          ],
          techStack: [
            "React",
            "Next.js App Router",
            "Recharts",
            "Radix UI",
            "Storybook",
          ],
          link: {
            label: "Truy cập sản phẩm",
            href: "https://example.com/pulse",
            variant: "secondary",
          },
          media: {
            type: "image",
            src: "/projects/pulse-dashboard.svg",
            alt: "Giao diện Pulse analytics ở hai chế độ",
          },
        },
        {
          title: "Sonder Studio Brand Refresh",
          category: "Creative Technology",
          description:
            "Đồng hành cùng agency tái tạo hiện diện số với micro-interaction giàu cảm xúc, storytelling theo cuộn và typography editorial.",
          highlights: [
            "Đạt giải Awwwards Site of the Day (12/2024)",
            "Xây dựng module CMS giúp marketing tự vận hành",
            "Hỗ trợ đa ngôn ngữ: Anh, Việt, Nhật",
          ],
          techStack: [
            "Next.js",
            "Contentful",
            "Framer Motion",
            "Lenis",
            "Lottie",
          ],
          link: {
            label: "Xem website",
            href: "https://example.com/sonder",
            variant: "secondary",
          },
          media: {
            type: "image",
            src: "/projects/sonder-showcase.svg",
            alt: "Trang chủ Sonder Studio với typography động",
          },
        },
      ],
    },
    experience: {
      headline: "Kinh nghiệm & Học vấn",
      items: [
        {
          company: "Flowspace Labs",
          role: "Senior Frontend Engineer",
          start: "2022",
          end: "Hiện tại",
          summary:
            "Dẫn dắt roadmap frontend cho bộ sản phẩm cộng tác realtime với hơn 2 triệu người dùng.",
          achievements: [
            "Kiến trúc chuyển đổi sang Next.js App Router không downtime",
            "Giảm 40% lỗi production nhờ visual regression testing tự động",
            "Mentor 6 thành viên kỹ sư & designer ở nhiều múi giờ",
          ],
          tech: ["Next.js", "TypeScript", "WebRTC", "Playwright", "GraphQL"],
        },
        {
          company: "Studio Nebula",
          role: "Lead Product Designer",
          start: "2019",
          end: "2022",
          summary:
            "Dẫn dắt discovery và prototype cho trải nghiệm bán lẻ immersive tại thị trường Đông Nam Á.",
          achievements: [
            "Thử nghiệm AR try-on giúp tăng 62% thời gian onsite",
            "Xây dựng design system module hóa cho đối tác sử dụng",
            "Tổ chức workshop hàng quý về inclusive design",
          ],
          tech: ["Figma", "React", "Three.js", "Notion", "Miro"],
        },
        {
          company: "Freelance",
          role: "Creative Frontend Developer",
          start: "2016",
          end: "2019",
          summary:
            "Hợp tác với founder và nghệ sĩ để kể câu chuyện số qua portfolio và e-commerce.",
          achievements: [
            "Triển khai 25+ website với tương tác tuỳ chỉnh",
            "Làm việc cùng illustrator xây dựng bài viết interactive",
            "Duy trì 95% mức độ hài lòng khách hàng nhờ quy trình linh hoạt",
          ],
          tech: ["Gatsby", "Vue", "GSAP", "Contentful", "Firebase"],
        },
      ],
      education: [
        {
          institution: "Đại học RMIT Việt Nam",
          program: "Cử nhân Thiết kế (Truyền thông số)",
          start: "2012",
          end: "2015",
          details:
            "Tốt nghiệp loại Giỏi. Chủ nhiệm Creative Tech Society và tổ chức triển lãm số hàng năm.",
        },
        {
          institution: "Interaction Design Foundation",
          program: "Advanced UX Management",
          start: "2021",
          end: "2021",
          details:
            "Đồ án tập trung xây dựng workflow bao hàm cho đội ngũ sản phẩm đa chức năng.",
        },
      ],
    },
    blog: {
      headline: "Chia sẻ & Thử nghiệm",
      description:
        "Tôi viết về design system, creative technology và phương pháp giúp đội ngũ tạo ra giá trị.",
      posts: [
        {
          title: "Thiết kế motion system có thể mở rộng",
          slug: "motion-system-mo-rong",
          excerpt:
            "Hướng dẫn thực tế để kể câu chuyện thương hiệu nhưng vẫn đảm bảo ràng buộc kỹ thuật khi triển khai motion.",
          date: "02/10/2025",
          readingTime: "8 phút đọc",
          tags: ["motion", "design systems", "frontend"],
        },
        {
          title: "Nâng tầm accessibility với Next.js App Router",
          slug: "accessibility-nextjs-app-router",
          excerpt:
            "Bài học khi triển khai audit tự động, live region và quản lý focus trong dự án Next.js quy mô lớn.",
          date: "18/08/2025",
          readingTime: "6 phút đọc",
          tags: ["accessibility", "next.js", "tooling"],
        },
        {
          title: "Xây dựng sự nghiệp Creative Tech từ tò mò đến chuyên sâu",
          slug: "creative-tech-su-nghiep",
          excerpt:
            "Những góc nhìn sau bảy năm theo đuổi lĩnh vực cùng khung tư duy giúp tôi phát triển có chủ đích.",
          date: "09/05/2025",
          readingTime: "10 phút đọc",
          tags: ["career", "leadership", "mindset"],
        },
      ],
    },
    testimonials: {
      headline: "Được tin tưởng bởi đối tác",
      items: [
        {
          name: "Linh Trần",
          role: "Design Director, Sonder Studio",
          quote:
            "An là sự kết hợp hiếm giữa người mơ và người làm. Anh ấy biến ý tưởng còn mơ hồ thành trải nghiệm chạm đến cả khách hàng lẫn nội bộ.",
        },
        {
          name: "Samuel Green",
          role: "Head of Product, Flowspace Labs",
          quote:
            "Từ kiến trúc đến vi tương tác, An luôn nâng chuẩn đội ngũ. Sự kèm cặp của anh giúp team frontend trưởng thành vượt bậc.",
        },
        {
          name: "Aya Nakamura",
          role: "Creative Producer, Aurora XR",
          quote:
            "Chúng tôi tin tưởng giao An điều phối nhiều đội nhóm trong thời gian nước rút. Kết quả vượt mọi mục tiêu và cực kỳ premium.",
        },
      ],
    },
    awards: {
      headline: "Giải thưởng & Cộng đồng",
      description:
        "Ghi nhận những cột mốc và hoạt động giúp tôi gắn kết với cộng đồng creative tech.",
      items: [
        {
          name: "Awwwards – Site of the Day",
          issuer: "Awwwards",
          year: "2024",
          description:
            "Vinh danh dự án Sonder Studio với chuyển động scroll sáng tạo và typography biên tập.",
        },
        {
          name: "Diễn giả – Web Directions Hover",
          issuer: "Web Directions",
          year: "2023",
          description:
            "Chia sẻ về xây dựng motion system tiếp cận được cho khán giả toàn cầu.",
        },
        {
          name: "Mentor – ADPList",
          issuer: "ADPList",
          year: "2021 - Nay",
          description:
            "Cố vấn 1:1 cho designer và developer mới vào nghề trên toàn thế giới.",
        },
      ],
    },
    contact: {
      headline: "Kết nối cùng nhau",
      description:
        "Gửi cho tôi vài dòng về dự án hoặc lời mời chia sẻ. Tôi sẽ phản hồi trong vòng 2 ngày làm việc.",
      content: {
        intro:
          "Kể tôi nghe vấn đề bạn muốn giải quyết và tác động mong muốn. Tôi đặc biệt hứng thú với storytelling immersive, design system và sản phẩm có ý nghĩa.",
        availability: "Đang mở lịch cho các dự án quý I/2026.",
        email: "hello@manhhung.design",
        phone: "+84 908 123 456",
        location: "TP. Hồ Chí Minh, Việt Nam (UTC+7)",
        socials: [
          { label: "LinkedIn", href: "https://www.linkedin.com/in/manhhung" },
          { label: "GitHub", href: "https://github.com/manhhung" },
          { label: "Dribbble", href: "https://dribbble.com/manhhung" },
          { label: "Behance", href: "https://behance.net/manhhung" },
        ],
      },
    },
    footer: {
      availability: "Sẵn sàng cho dự án hợp tác chọn lọc từ 01/2026.",
      note: "© 2025 Nguyễn Mạnh Hùng. Thực hiện với tất cả đam mê tại Sài Gòn.",
    },
  },
};


