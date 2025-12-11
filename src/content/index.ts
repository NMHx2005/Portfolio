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
  links?: ActionLink[]; // Optional array for multiple links (GitHub, Website, etc.)
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
      role: "Intern Web Developer",
      tagline:
        "Passionate about building modern web applications with React, Next.js, and Node.js. Currently a 3rd-year IT student exploring full-stack development.",
      highlight: "Building modern web applications",
      greeting: "Hello, I'm",
      location: "Hoàng Mai - Hà Nội, Vietnam",
      availability: "Open for internship and collaboration opportunities",
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
          href: "/assets/Nguyễn-Mạnh-Hùng-FlowCV-Resume-20251211.pdf",
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
        seniority: "Intern",
        skills: [
          "React",
          "Next.js",
          "TypeScript",
          "Node.js",
          "Express",
          "MongoDB",
          "MySQL",
          "Tailwind CSS",
          "Material-UI",
          "Firebase",
          "Git",
          "GitHub",
        ],
      },
    },
    about: {
      eyebrow: "About",
      headline: "Passionate about web development",
      story:
        "I'm a 3rd-year Information Technology student at Hanoi Open University, passionate about building modern web applications. I enjoy working with React, Next.js, and Node.js to create full-stack solutions that solve real-world problems.",
      mission:
        "Continuously learning and improving my skills to build scalable, user-friendly web applications that make a positive impact.",
      values: [
        "Continuous learning and growth",
        "Clean and maintainable code",
        "User-centered design",
        "Collaboration and teamwork",
      ],
      skills: [
        {
          category: "Frontend",
          items: [
            "HTML5, CSS3, PUG, SCSS",
            "TailwindCSS, Bootstrap",
            "JavaScript, TypeScript",
            "ReactJS, Redux, NextJS",
            "Material-UI, Ant Design",
            "Firebase, Axios",
          ],
        },
        {
          category: "Backend",
          items: [
            "Node.js, Express.js",
            "TypeScript",
            "MongoDB, Mongoose",
            "MySQL",
            "Socket.io",
            "JWT, Cloudinary",
          ],
        },
        {
          category: "Tools & Others",
          items: [
            "Git, GitHub",
            "Postman",
            "Nodemailer",
            "Express Rate Limit",
            "Helmet, CORS",
          ],
        },
      ],
      certifications: [],
    },
    projects: {
      headline: "Projects",
      description:
        "A collection of full-stack web applications I've built, showcasing my skills in React, Next.js, Node.js, and modern web technologies.",
      items: [
        {
          title: "Learning Management System",
          category: "Full-Stack Application",
          description:
            "A comprehensive Learning Management System built with modern web technologies for managing courses, students, and educational content.",
          highlights: [
            "Backend API developed with Node.js, Express.js, TypeScript, and MongoDB",
            "Frontend built with React, TypeScript, and Material-UI",
            "Full-stack solution with RESTful API architecture",
            "Live website: https://www.lms-vietnam.xyz/",
          ],
          techStack: [
            "React",
            "TypeScript",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Material-UI",
          ],
          link: {
            label: "Visit Website",
            href: "https://www.lms-vietnam.xyz/",
            variant: "primary",
          },
          links: [
            {
              label: "Visit Website",
              href: "https://www.lms-vietnam.xyz/",
              variant: "primary",
            },
            {
              label: "View on GitHub",
              href: "https://github.com/NMHx2005/lms-frontend",
              variant: "secondary",
            },
          ],
          media: {
            type: "image",
            src: "/projects/aurora-cover.svg",
            alt: "Learning Management System preview",
          },
        },
        {
          title: "MinhLoc Group - Real Estate & Ginseng Products",
          category: "E-Commerce Platform",
          description:
            "A full-stack platform combining Real Estate and Ginseng Products for MinhLoc Group, built with Next.js 14 and achieving 9x SEO score.",
          highlights: [
            "Frontend built with Next.js 14, TypeScript, and Material-UI for optimal SEO",
            "Backend API with Node.js, Express.js, TypeScript, and MongoDB",
            "Integrated JWT authentication, Cloudinary for media, and email services",
            "Live website: https://www.minhlocgroup.vn/",
          ],
          techStack: [
            "Next.js 14",
            "TypeScript",
            "Material-UI",
            "Node.js",
            "Express.js",
            "MongoDB",
            "JWT",
            "Cloudinary",
          ],
          link: {
            label: "Visit Website",
            href: "https://www.minhlocgroup.vn/",
            variant: "secondary",
          },
          links: [
            {
              label: "Visit Website",
              href: "https://www.minhlocgroup.vn/",
              variant: "primary",
            },
            {
              label: "View on GitHub",
              href: "https://github.com/NMHx2005/MinhLoc_FE",
              variant: "secondary",
            },
          ],
          media: {
            type: "image",
            src: "/projects/pulse-dashboard.svg",
            alt: "MinhLoc Group platform preview",
          },
        },
      ],
    },
    experience: {
      headline: "Experience & Education",
      items: [],
      education: [
        {
          institution: "Hanoi Open University",
          program: "Information Technology",
          start: "2023",
          end: "2027",
          details:
            "3rd-year student pursuing a degree in Information Technology. Focused on web development, software engineering, and modern technologies.",
        },
      ],
    },
    blog: {
      headline: "",
      description: "",
      posts: [],
    },
    testimonials: {
      headline: "",
      items: [],
    },
    awards: {
      headline: "",
      description: "",
      items: [],
    },
    contact: {
      headline: "Let's connect",
      description:
        "I'm open to internship opportunities, collaboration projects, and learning experiences. Feel free to reach out!",
      content: {
        intro:
          "If you have an interesting project, internship opportunity, or just want to connect, I'd love to hear from you. I'm particularly interested in full-stack development, modern web technologies, and building impactful applications.",
        availability: "Currently available for internship and collaboration opportunities.",
        email: "22092005nguyenhung@gmail.com",
        phone: "+84 971 084 430",
        location: "Hoàng Mai - Hà Nội, Vietnam (UTC+7)",
        socials: [
          { label: "Website", href: "http://nmhx.info" },
          { label: "GitHub", href: "https://github.com/NMHx2005" },
        ],
      },
    },
    footer: {
      availability: "Available for internship and collaboration opportunities.",
      note: "© 2025 Nguyễn Mạnh Hùng. Built with passion in Hanoi.",
    },
  },
  vi: {
    hero: {
      name: "Nguyễn Mạnh Hùng",
      role: "Thực tập sinh Web Developer",
      tagline:
        "Đam mê xây dựng các ứng dụng web hiện đại với React, Next.js và Node.js. Hiện đang là sinh viên năm 3 ngành Công nghệ Thông tin, khám phá phát triển full-stack.",
      highlight: "Xây dựng ứng dụng web hiện đại",
      greeting: "Xin chào, tôi là",
      location: "Hoàng Mai - Hà Nội, Việt Nam",
      availability: "Sẵn sàng cho cơ hội thực tập và hợp tác",
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
          href: "/assets/Nguyễn-Mạnh-Hùng-FlowCV-Resume-20251211.pdf",
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
        seniority: "Thực tập sinh",
        skills: [
          "React",
          "Next.js",
          "TypeScript",
          "Node.js",
          "Express",
          "MongoDB",
          "MySQL",
          "Tailwind CSS",
          "Material-UI",
          "Firebase",
          "Git",
          "GitHub",
        ],
      },
    },
    about: {
      eyebrow: "Về tôi",
      headline: "Đam mê phát triển web",
      story:
        "Tôi là sinh viên năm 3 ngành Công nghệ Thông tin tại Trường Đại học Mở Hà Nội, đam mê xây dựng các ứng dụng web hiện đại. Tôi thích làm việc với React, Next.js và Node.js để tạo ra các giải pháp full-stack giải quyết các vấn đề thực tế.",
      mission:
        "Không ngừng học hỏi và cải thiện kỹ năng để xây dựng các ứng dụng web có thể mở rộng, thân thiện với người dùng và tạo ra tác động tích cực.",
      values: [
        "Học hỏi và phát triển liên tục",
        "Code sạch và dễ bảo trì",
        "Thiết kế hướng người dùng",
        "Hợp tác và làm việc nhóm",
      ],
      skills: [
        {
          category: "Frontend",
          items: [
            "HTML5, CSS3, PUG, SCSS",
            "TailwindCSS, Bootstrap",
            "JavaScript, TypeScript",
            "ReactJS, Redux, NextJS",
            "Material-UI, Ant Design",
            "Firebase, Axios",
          ],
        },
        {
          category: "Backend",
          items: [
            "Node.js, Express.js",
            "TypeScript",
            "MongoDB, Mongoose",
            "MySQL",
            "Socket.io",
            "JWT, Cloudinary",
          ],
        },
        {
          category: "Công cụ & Khác",
          items: [
            "Git, GitHub",
            "Postman",
            "Nodemailer",
            "Express Rate Limit",
            "Helmet, CORS",
          ],
        },
      ],
      certifications: [],
    },
    projects: {
      headline: "Dự án",
      description:
        "Tuyển tập các ứng dụng web full-stack tôi đã xây dựng, thể hiện kỹ năng với React, Next.js, Node.js và các công nghệ web hiện đại.",
      items: [
        {
          title: "Hệ thống Quản lý Học tập",
          category: "Ứng dụng Full-Stack",
          description:
            "Hệ thống quản lý học tập toàn diện được xây dựng với các công nghệ web hiện đại để quản lý khóa học, sinh viên và nội dung giáo dục.",
          highlights: [
            "Backend API được phát triển với Node.js, Express.js, TypeScript và MongoDB",
            "Frontend được xây dựng với React, TypeScript và Material-UI",
            "Giải pháp full-stack với kiến trúc RESTful API",
            "Website đã triển khai: https://www.lms-vietnam.xyz/",
          ],
          techStack: [
            "React",
            "TypeScript",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Material-UI",
          ],
          link: {
            label: "Truy cập Website",
            href: "https://www.lms-vietnam.xyz/",
            variant: "primary",
          },
          links: [
            {
              label: "Truy cập Website",
              href: "https://www.lms-vietnam.xyz/",
              variant: "primary",
            },
            {
              label: "Xem trên GitHub",
              href: "https://github.com/NMHx2005/lms-frontend",
              variant: "secondary",
            },
          ],
          media: {
            type: "image",
            src: "/projects/aurora-cover.svg",
            alt: "Preview hệ thống quản lý học tập",
          },
        },
        {
          title: "MinhLoc Group - Bất động sản & Sản phẩm Nhân sâm",
          category: "Nền tảng E-Commerce",
          description:
            "Nền tảng full-stack kết hợp Bất động sản và Sản phẩm Nhân sâm cho MinhLoc Group, được xây dựng với Next.js 14 và đạt điểm SEO 9x.",
          highlights: [
            "Frontend được xây dựng với Next.js 14, TypeScript và Material-UI để tối ưu SEO",
            "Backend API với Node.js, Express.js, TypeScript và MongoDB",
            "Tích hợp xác thực JWT, Cloudinary cho media và dịch vụ email",
            "Website đã triển khai: https://www.minhlocgroup.vn/",
          ],
          techStack: [
            "Next.js 14",
            "TypeScript",
            "Material-UI",
            "Node.js",
            "Express.js",
            "MongoDB",
            "JWT",
            "Cloudinary",
          ],
          link: {
            label: "Truy cập Website",
            href: "https://www.minhlocgroup.vn/",
            variant: "secondary",
          },
          links: [
            {
              label: "Truy cập Website",
              href: "https://www.minhlocgroup.vn/",
              variant: "primary",
            },
            {
              label: "Xem trên GitHub",
              href: "https://github.com/NMHx2005/MinhLoc_FE",
              variant: "secondary",
            },
          ],
          media: {
            type: "image",
            src: "/projects/pulse-dashboard.svg",
            alt: "Preview nền tảng MinhLoc Group",
          },
        },
      ],
    },
    experience: {
      headline: "Kinh nghiệm & Học vấn",
      items: [],
      education: [
        {
          institution: "Trường Đại học Mở Hà Nội",
          program: "Ngành Công Nghệ Thông Tin",
          start: "2023",
          end: "2027",
          details:
            "Sinh viên năm 3 theo học chương trình Công nghệ Thông Tin. Tập trung vào phát triển web, kỹ thuật phần mềm và các công nghệ hiện đại.",
        },
      ],
    },
    blog: {
      headline: "",
      description: "",
      posts: [],
    },
    testimonials: {
      headline: "",
      items: [],
    },
    awards: {
      headline: "",
      description: "",
      items: [],
    },
    contact: {
      headline: "Kết nối cùng nhau",
      description:
        "Tôi sẵn sàng cho các cơ hội thực tập, dự án hợp tác và trải nghiệm học tập. Đừng ngại liên hệ!",
      content: {
        intro:
          "Nếu bạn có dự án thú vị, cơ hội thực tập hoặc chỉ muốn kết nối, tôi rất muốn nghe từ bạn. Tôi đặc biệt quan tâm đến phát triển full-stack, công nghệ web hiện đại và xây dựng các ứng dụng có tác động.",
        availability: "Hiện đang sẵn sàng cho các cơ hội thực tập và hợp tác.",
        email: "22092005nguyenhung@gmail.com",
        phone: "+84 971 084 430",
        location: "Hoàng Mai - Hà Nội, Việt Nam (UTC+7)",
        socials: [
          { label: "Website", href: "http://nmhx.info" },
          { label: "GitHub", href: "https://github.com/NMHx2005" },
        ],
      },
    },
    footer: {
      availability: "Sẵn sàng cho các cơ hội thực tập và hợp tác.",
      note: "© 2025 Nguyễn Mạnh Hùng. Xây dựng với đam mê tại Hà Nội.",
    },
  },
};


