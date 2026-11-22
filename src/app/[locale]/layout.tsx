import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { MotionRoot } from "@/components/motion-root";
import { RevealObserver } from "@/components/reveal-observer";
import { getDictionary } from "@/content/dictionary";
import { isLocale, locales } from "@/lib/i18n/config";
import { homeMetadata } from "@/lib/seo";
import { themeInitScript } from "@/lib/theme";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? homeMetadata(locale) : {};
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const skip = getDictionary(locale).a11y.skip;

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`dark ${inter.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh bg-bg font-sans text-fg antialiased">
        {/* A <script> element in the tree makes React warn whenever the layout is rendered on the client (the 404
            route does that). The same script as markup inside a div is parsed and run once, before first paint. */}
        <div hidden dangerouslySetInnerHTML={{ __html: `<script>${themeInitScript}</script>` }} />
        {/* axe only exempts a skip link from the landmark rule while it precedes every other link in the document. The
            dev server renders the 404 route on the client and the Next dev overlay's own link ends up first, so the
            skip link sits in a landmark of its own instead of relying on document order. */}
        <nav aria-label={skip}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
          >
            {skip}
          </a>
        </nav>
        {children}
        <RevealObserver />
        <MotionRoot />
        <Analytics />
      </body>
    </html>
  );
}
