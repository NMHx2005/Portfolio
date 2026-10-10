import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/hero-section";
import { SiteHeader } from "@/components/site-header";
import { getDictionary } from "@/content/dictionary";
import { isLocale } from "@/lib/i18n/config";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main id="main" className="pt-16">
        <HeroSection locale={locale} dict={dict} />
      </main>
    </>
  );
}
