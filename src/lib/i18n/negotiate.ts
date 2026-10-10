import { defaultLocale, isLocale, locales, type Locale } from "./config";

export function pickLocale(
  cookie: string | undefined,
  acceptLanguage: string | null | undefined,
): Locale {
  if (isLocale(cookie)) return cookie;
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const weight = q ? Number.parseFloat(q.slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), weight: Number.isNaN(weight) ? 0 : weight, index };
    })
    .filter((entry) => entry.tag !== "" && entry.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.index - b.index);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    const match = locales.find((locale) => locale === primary);
    if (match) return match;
  }
  return defaultLocale;
}

export function hasLocalePrefix(pathname: string): boolean {
  return locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

interface RedirectInput {
  pathname: string;
  search: string;
  cookie?: string;
  acceptLanguage?: string | null;
}

export function resolveRedirect({ pathname, search, cookie, acceptLanguage }: RedirectInput): string | null {
  if (hasLocalePrefix(pathname)) return null;
  const locale = pickLocale(cookie, acceptLanguage);
  const rest = pathname === "/" ? "" : pathname;
  return `/${locale}${rest}${search}`;
}
