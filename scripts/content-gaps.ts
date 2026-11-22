export interface ContentGap {
  id: string;
  message: string;
}

interface ContentInputs {
  email: string | null;
  zalo: { url: string } | null;
  cv: string | null;
  projects: { slug: string; status: string; links: { live?: string } }[];
}

export function findContentGaps(inputs: ContentInputs, fileExists: (publicPath: string) => boolean): ContentGap[] {
  const gaps: ContentGap[] = [];

  if (inputs.email === null) {
    gaps.push({ id: "email", message: "No public email: set siteConfig.contact.email once the owner confirms an address." });
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inputs.email)) {
    gaps.push({ id: "email-invalid", message: "siteConfig.contact.email is not a valid email address." });
  }

  if (!inputs.zalo) {
    gaps.push({ id: "zalo", message: "No Zalo link: set siteConfig.contact.zalo." });
  }

  if (!inputs.cv) {
    gaps.push({ id: "cv", message: "No CV: set siteConfig.contact.cv to a PDF under /public." });
  } else if (!fileExists(inputs.cv)) {
    gaps.push({ id: "cv-file", message: `CV file missing in /public: ${inputs.cv}` });
  }

  for (const project of inputs.projects) {
    // Only a live product is expected to have a public address; launching and for-sale ones may not.
    if (project.status === "live" && !project.links.live)
      gaps.push({ id: `project-${project.slug}-link`, message: `${project.slug}: live project without a public link.` });
  }
  return gaps;
}
