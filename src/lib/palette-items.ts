import { siteConfig } from "@/config/site";
import { projectSlugs } from "@/content/projects";
import type { Dictionary, SectionId } from "@/content/types";
import { locales, type Locale } from "@/lib/i18n/config";
import { localePath, projectPath } from "@/lib/i18n/paths";

export type PaletteGroup = "sections" | "projects" | "actions";

export type PaletteAction =
  | { kind: "link"; href: string }
  | { kind: "copy"; value: string }
  | { kind: "theme" }
  | { kind: "locale"; target: Locale };

export interface PaletteItem {
  id: string;
  group: PaletteGroup;
  label: string;
  action: PaletteAction;
}

const sectionOrder: SectionId[] = ["projects", "services", "about", "process", "faq", "contact"];

export function buildPaletteItems(
  locale: Locale,
  dict: Dictionary,
  email: string | null = siteConfig.contact.email,
): PaletteItem[] {
  const other = locales.find((l) => l !== locale) as Locale;
  const sections = sectionOrder.map(
    (id): PaletteItem => ({
      id: `section-${id}`,
      group: "sections",
      label: dict.sections[id].label,
      action: { kind: "link", href: localePath(locale, `#${id}`) },
    }),
  );
  const projects = projectSlugs.map(
    (slug): PaletteItem => ({
      id: `project-${slug}`,
      group: "projects",
      label: dict.work.items[slug].title,
      action: { kind: "link", href: projectPath(locale, slug) },
    }),
  );
  const actions: PaletteItem[] = [
    ...(email
      ? [{ id: "copy-email", group: "actions", label: dict.palette.actions.copyEmail, action: { kind: "copy", value: email } } satisfies PaletteItem]
      : []),
    { id: "github", group: "actions", label: dict.palette.actions.github, action: { kind: "link", href: siteConfig.contact.github } },
    { id: "switch-language", group: "actions", label: dict.palette.actions.switchLanguage, action: { kind: "locale", target: other } },
    { id: "toggle-theme", group: "actions", label: dict.palette.actions.toggleTheme, action: { kind: "theme" } },
  ];
  return [...sections, ...projects, ...actions];
}
