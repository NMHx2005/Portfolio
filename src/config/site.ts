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
