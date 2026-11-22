export interface SiteConfig {
  name: string;
  url: string;
  twitter: string;
  jobTitle: string;
  contentUpdated: string;
  contact: {
    email: string | null;
    zalo: { display: string; url: string } | null;
    phone: { display: string; href: string };
    github: string;
    cv: string | null;
  };
}

export const siteConfig: SiteConfig = {
  name: "Nguyễn Mạnh Hùng",
  url: "https://www.nmhx.info",
  twitter: "@NMHx2005",
  jobTitle: "Software Engineer",
  contentUpdated: "2026-11-22",
  contact: {
    email: "nmhx05@gmail.com",
    zalo: { display: "0971 084 430", url: "https://zalo.me/0971084430" },
    phone: { display: "+84 971 084 430", href: "tel:+84971084430" },
    github: "https://github.com/NMHx2005",
    cv: null,
  },
};
