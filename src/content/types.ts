export type SectionId = "projects" | "services" | "about" | "process" | "faq" | "contact";
import type { HeroFigures } from "./stats";

export type ProjectSlug = "tingtingvac" | "rankdle" | "mythiep" | "hadi" | "tinvid";
export type BuildingSlug = "classnote" | "hanyu";
export type ProjectStatus = "live" | "launching" | "forSale" | "building" | "testBuild";
export type ServiceKind = "web" | "webapp" | "mobile" | "ai";
export type ContactKind = ServiceKind | "other";
export type ContactField = "name" | "company" | "reply" | "kind" | "message" | "timeline";

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
  client: string;
  platform: string;
  summary: string;
  problem?: string;
  delivered: string[];
  choices?: TechnicalChoice[];
  coverAlt: string;
  galleryAlt: string[];
}

export interface ContactFormCopy {
  title: string;
  fields: Record<ContactField, string>;
  kindPrompt: string;
  kinds: Record<ContactKind, string>;
  placeholders: { message: string; timeline: string };
  submit: string;
  sending: string;
  success: string;
  failure: string;
  invalid: Record<ContactField, string>;
  noScript: string;
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
    stripLabel: string;
    stripGroupLabel: string;
    stripPause: string;
    statsLabel: string;
    figures: Record<keyof HeroFigures, string>;
  };
  sections: Record<SectionId, SectionHead>;
  work: {
    viewCaseStudy: string;
    live: string;
    askSource: string;
    statusLabels: Record<ProjectStatus, string>;
    items: Record<ProjectSlug, ProjectCopy>;
    building: {
      heading: string;
      lede: string;
      items: Record<BuildingSlug, { title: string; summary: string }>;
    };
  };
  caseStudy: {
    back: string;
    client: string;
    period: string;
    platform: string;
    status: string;
    problem: string;
    delivered: string;
    gallery: string;
    links: string;
    technical: string;
    why: string;
    tradeoff: string;
    stack: string;
    next: string;
    previous: string;
  };
  services: {
    provenBy: string;
    request: string;
    items: Record<ServiceKind, { title: string; description: string; duration?: string }>;
  };
  about: {
    paragraphs: string[];
    skillsTitle: string;
    skillGroups: { name: string; items: string[] }[];
  };
  process: {
    steps: { title: string; duration: string; description: string }[];
    ownership: string;
    payment: string;
  };
  faq: { items: { q: string; a: string }[] };
  contact: {
    labels: Record<"zalo" | "phone" | "email" | "github" | "cv", string>;
    response: string;
    form: ContactFormCopy;
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
