import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content/dictionary";
import { projectsData } from "@/content/projects";
import type { ProjectSlug } from "@/content/types";
import { defaultLocale, locales, ogLocales, type Locale } from "@/lib/i18n/config";
import { localePath, projectPath } from "@/lib/i18n/paths";
import { getSiteUrl } from "@/lib/site-url";

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path}`;
}

export function languageUrls(pathFor: (locale: Locale) => string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = absoluteUrl(pathFor(l));
  languages["x-default"] = absoluteUrl(pathFor(defaultLocale));
  return languages;
}

export function alternatesFor(
  locale: Locale,
  pathFor: (locale: Locale) => string,
): NonNullable<Metadata["alternates"]> {
  return { canonical: absoluteUrl(pathFor(locale)), languages: languageUrls(pathFor) };
}

function openGraph(locale: Locale, title: string, description: string, path: string): Metadata["openGraph"] {
  return {
    type: "website",
    url: absoluteUrl(path),
    siteName: siteConfig.name,
    title,
    description,
    locale: ogLocales[locale],
    alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
  };
}

export function homeMetadata(locale: Locale): Metadata {
  const d = getDictionary(locale);
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: d.meta.title, template: `%s · ${siteConfig.name}` },
    description: d.meta.description,
    authors: [{ name: siteConfig.name, url: getSiteUrl() }],
    creator: siteConfig.name,
    alternates: alternatesFor(locale, (l) => localePath(l)),
    openGraph: openGraph(locale, d.meta.title, d.meta.description, localePath(locale)),
    twitter: {
      card: "summary_large_image",
      title: d.meta.title,
      description: d.meta.description,
      creator: siteConfig.twitter,
    },
  };
}

export function projectMetadata(locale: Locale, slug: ProjectSlug): Metadata {
  const copy = getDictionary(locale).work.items[slug];
  const title = `${copy.title} — ${copy.category}`;
  return {
    title,
    description: copy.summary,
    alternates: alternatesFor(locale, (l) => projectPath(l, slug)),
    openGraph: openGraph(locale, title, copy.summary, projectPath(locale, slug)),
    twitter: { card: "summary_large_image", title, description: copy.summary, creator: siteConfig.twitter },
  };
}

export function personJsonLd(
  locale: Locale,
  owner: Pick<typeof siteConfig, "portrait"> & { email: string | null } = {
    portrait: siteConfig.portrait,
    email: siteConfig.contact.email,
  },
): Record<string, unknown> {
  const d = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.jobTitle,
    url: absoluteUrl(localePath(locale)),
    description: d.meta.description,
    ...(owner.email ? { email: `mailto:${owner.email}` } : {}),
    address: { "@type": "PostalAddress", addressLocality: "Hà Nội", addressCountry: "VN" },
    sameAs: [siteConfig.contact.github, siteConfig.contact.telegram.url],
    knowsAbout: ["React", "Next.js", "TypeScript", "React Native", "Node.js", "PostgreSQL"],
    ...(owner.portrait ? { image: absoluteUrl(owner.portrait.src) } : {}),
  };
}

export function websiteJsonLd(locale: Locale): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl(localePath(locale)),
    inLanguage: locale,
  };
}

export function projectJsonLd(locale: Locale, slug: ProjectSlug): Record<string, unknown> {
  const copy = getDictionary(locale).work.items[slug];
  const data = projectsData[slug];
  const url = absoluteUrl(projectPath(locale, slug));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: copy.title,
        description: copy.summary,
        url,
        inLanguage: locale,
        image: absoluteUrl(data.image.src),
        keywords: data.stack.join(", "),
        author: { "@type": "Person", name: siteConfig.name, url: absoluteUrl(localePath(locale)) },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteConfig.name, item: absoluteUrl(localePath(locale)) },
          { "@type": "ListItem", position: 2, name: copy.title, item: url },
        ],
      },
    ],
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
