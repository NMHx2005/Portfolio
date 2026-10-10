import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content/dictionary";
import { isLocale, locales } from "@/lib/i18n/config";
import { renderOg } from "@/lib/og";
import { getSiteUrl } from "@/lib/site-url";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.jobTitle}`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return renderOg({
    eyebrow: dict.hero.status,
    title: siteConfig.name,
    subtitle: dict.hero.headline,
    footer: new URL(getSiteUrl()).host,
  });
}
