import { isLocale, type Locale } from "./config";

export function localePath(locale: Locale, path = ""): string {
  return `/${locale}${path}`;
}

export function projectPath(locale: Locale, slug: string): string {
  return localePath(locale, `/projects/${slug}`);
}

export function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  if (isLocale(segments[1])) {
    segments[1] = target;
    return segments.join("/");
  }
  return localePath(target, pathname === "/" ? "" : pathname);
}

/** Locale switch that keeps the visitor's context (query string and hash). */
export function localeHref(pathname: string, search: string, hash: string, target: Locale): string {
  return `${switchLocalePath(pathname, target)}${search}${hash}`;
}
