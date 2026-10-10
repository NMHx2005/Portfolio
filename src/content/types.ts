export type SectionId = "projects" | "services" | "about" | "process" | "faq" | "contact";
export type ProjectSlug = "hnwedding" | "hadi";
export type ProjectKind = "web" | "mobile";
export type MetricKey = "themes" | "migrations" | "commits" | "languages" | "version";

export interface SectionHead {
  index: string;
  label: string;
  heading: string;
  lede?: string;
}

/** A technical fact about the project. `why`/`tradeoff` exist only when the owner has supplied them. */
export interface TechnicalChoice {
  title: string;
  why?: string;
  tradeoff?: string;
}

export interface ProjectCopy {
  title: string;
  category: string;
  summary: string;
  role?: string;
  status: string;
  problem: string;
  choices: TechnicalChoice[];
  flow: string[];
  services: { label: string; detail: string }[];
  shipped: string[];
  imageAlt: string;
}

export interface Dictionary {
  meta: { title: string; description: string };
  a11y: {
    skip: string;
    mainNav: string;
    openMenu: string;
    closeMenu: string;
    toggleTheme: string;
    switchLanguage: string;
    copyEmail: string;
    copied: string;
    copyFailed: string;
    backToTop: string;
  };
  nav: { id: SectionId; label: string }[];
  hero: {
    status: string;
    headline: string;
    intro: string;
    primaryCta: string;
    secondaryCta: string;
    nowTitle: string;
    updatedLabel: string;
    now: { label: string; value: string }[];
  };
  sections: Record<SectionId, SectionHead>;
  work: {
    viewCaseStudy: string;
    live: string;
    repository: string;
    metricLabels: Record<MetricKey, string>;
    items: Record<ProjectSlug, ProjectCopy>;
  };
  caseStudy: {
    back: string;
    role: string;
    platform: string;
    status: string;
    stack: string;
    links: string;
    problem: string;
    choices: string;
    why: string;
    tradeoff: string;
    architecture: string;
    flow: string;
    services: string;
    shipped: string;
    facts: string;
    next: string;
    previous: string;
    platforms: Record<ProjectKind, string>;
  };
  services: { items: { title: string; description: string; tags: string[] }[] };
  about: {
    paragraphs: string[];
    principlesLabel: string;
    principles: string[];
    skillsTitle: string;
    skillGroups: { name: string; items: string[] }[];
    portraitAlt: string;
  };
  process: { steps: { title: string; duration: string; description: string }[] };
  faq: { items: { q: string; a: string }[] };
  contact: {
    labels: Record<"email" | "telegram" | "phone" | "github" | "cv", string>;
    response: string;
  };
  palette: {
    open: string;
    placeholder: string;
    empty: string;
    groups: { sections: string; projects: string; actions: string };
    actions: { copyEmail: string; github: string; switchLanguage: string; toggleTheme: string };
    hint: string;
  };
  footer: { tagline: string; note: string };
}
