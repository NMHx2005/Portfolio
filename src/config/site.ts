export interface SiteConfig {
  name: string;
  url: string;
  twitter: string;
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
  url: "https://www.nmhx.info",
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
