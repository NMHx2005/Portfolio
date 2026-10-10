import { notFound } from "next/navigation";
import { getDictionary } from "@/content/dictionary";
import { isLocale } from "@/lib/i18n/config";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <main id="main">
      <h1>{dict.hero.headline}</h1>
    </main>
  );
}
