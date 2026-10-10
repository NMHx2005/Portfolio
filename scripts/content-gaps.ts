export interface ContentGap {
  id: string;
  message: string;
}

interface ContentInputs {
  email: string | null;
  portrait: { src: string } | null;
  cv: string | null;
  projects: { slug: string; hasRole: boolean; links: { live?: string; repo?: string } }[];
}

export function findContentGaps(inputs: ContentInputs, fileExists: (publicPath: string) => boolean): ContentGap[] {
  const gaps: ContentGap[] = [];

  if (inputs.email === null) {
    gaps.push({ id: "email", message: "No public email: set siteConfig.contact.email once the owner confirms an address." });
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inputs.email)) {
    gaps.push({ id: "email-invalid", message: "siteConfig.contact.email is not a valid email address." });
  }

  if (!inputs.portrait) {
    gaps.push({ id: "portrait", message: "No portrait: set siteConfig.portrait (About section + JSON-LD image)." });
  } else if (!fileExists(inputs.portrait.src)) {
    gaps.push({ id: "portrait-file", message: `Portrait file missing in /public: ${inputs.portrait.src}` });
  }

  if (!inputs.cv) {
    gaps.push({ id: "cv", message: "No CV: set siteConfig.contact.cv to a PDF under /public." });
  } else if (!fileExists(inputs.cv)) {
    gaps.push({ id: "cv-file", message: `CV file missing in /public: ${inputs.cv}` });
  }

  for (const project of inputs.projects) {
    if (!project.links.live) gaps.push({ id: `project-${project.slug}-live`, message: `${project.slug}: no live URL.` });
    if (!project.links.repo) gaps.push({ id: `project-${project.slug}-repo`, message: `${project.slug}: no repository URL.` });
    if (!project.hasRole) gaps.push({ id: `project-${project.slug}-role`, message: `${project.slug}: no confirmed role (Appendix A).` });
  }
  return gaps;
}
