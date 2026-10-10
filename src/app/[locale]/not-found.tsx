"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { notFoundCopy } from "@/content/not-found";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export default function NotFound() {
  const segment = usePathname().split("/")[1];
  const locale = isLocale(segment) ? segment : defaultLocale;
  const notFound = notFoundCopy[locale];

  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-5 sm:px-8">
      <p className="font-mono text-sm text-fg-subtle">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">{notFound.title}</h1>
      <p className="mt-4 max-w-md text-fg-muted">{notFound.text}</p>
      <Link href={`/${locale}`} className="mt-8 inline-flex min-h-11 w-fit items-center text-accent underline underline-offset-4">
        {notFound.cta}
      </Link>
    </main>
  );
}
