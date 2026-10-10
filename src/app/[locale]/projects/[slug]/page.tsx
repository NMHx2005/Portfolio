import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/case-study/case-study-view";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { getDictionary } from "@/content/dictionary";
import { isProjectSlug, projectSlugs } from "@/content/projects";
import { isLocale, locales } from "@/lib/i18n/config";
import { projectJsonLd, projectMetadata } from "@/lib/seo";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  return isLocale(locale) && isProjectSlug(slug) ? projectMetadata(locale, slug) : {};
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isProjectSlug(slug)) notFound();
  const dict = getDictionary(locale);

  return (
    <PageShell locale={locale} dict={dict}>
      <JsonLd data={projectJsonLd(locale, slug)} />
      <CaseStudyView locale={locale} dict={dict} slug={slug} />
    </PageShell>
  );
}
