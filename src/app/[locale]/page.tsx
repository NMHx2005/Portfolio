import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FaqSection } from "@/components/sections/faq-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ServicesSection } from "@/components/sections/services-section";
import { WorkSection } from "@/components/sections/work-section";
import { getDictionary } from "@/content/dictionary";
import { isLocale } from "@/lib/i18n/config";
import { personJsonLd, websiteJsonLd } from "@/lib/seo";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <PageShell locale={locale} dict={dict}>
      <JsonLd data={personJsonLd(locale)} />
      <JsonLd data={websiteJsonLd(locale)} />
      <HeroSection locale={locale} dict={dict} />
      <WorkSection locale={locale} dict={dict} />
      <ServicesSection dict={dict} />
      <AboutSection dict={dict} />
      <ProcessSection dict={dict} />
      <FaqSection dict={dict} />
      <ContactSection dict={dict} />
    </PageShell>
  );
}
