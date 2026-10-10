import { LOCALE_COOKIE, type Locale } from "./config";

/** Remembers the visitor's explicit choice for a year; the proxy reads it on the next un-prefixed visit. */
export function rememberLocale(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
