import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { projectSlugs } from "@/content/projects";
import { locales, type Locale } from "@/lib/i18n/config";
import { localePath, projectPath } from "@/lib/i18n/paths";
import { absoluteUrl, languageUrls } from "@/lib/seo";

export function sitemapEntries(): MetadataRoute.Sitemap {
  const lastModified = new Date(siteConfig.contentUpdated);
  const pages: { pathFor: (l: Locale) => string; priority: number }[] = [
    { pathFor: (l) => localePath(l), priority: 1 },
    ...projectSlugs.map((slug) => ({ pathFor: (l: Locale) => projectPath(l, slug), priority: 0.8 })),
  ];

  return pages.flatMap(({ pathFor, priority }) =>
    locales.map((locale) => ({
      url: absoluteUrl(pathFor(locale)),
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: languageUrls(pathFor) },
    })),
  );
}
