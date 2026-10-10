import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content/dictionary";
import { isProjectSlug, projectSlugs, projectsData } from "@/content/projects";
import { isLocale, locales } from "@/lib/i18n/config";
import { renderOg } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Case study";

export function generateStaticParams() {
  return locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isProjectSlug(slug)) notFound();
  const copy = getDictionary(locale).work.items[slug];
  return renderOg({
    eyebrow: copy.category,
    title: copy.title,
    subtitle: copy.summary,
    footer: `${siteConfig.name} · ${projectsData[slug].stack.slice(0, 4).join(" · ")}`,
  });
}
