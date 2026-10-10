import type { Locale } from "@/lib/i18n/config";

/** Figures are written with a comma as the thousands separator; Vietnamese readers expect a dot. */
export function localizeNumber(locale: Locale, text: string): string {
  return locale === "vi" ? text.replace(/(\d),(?=\d{3}(?!\d))/g, "$1.") : text;
}
