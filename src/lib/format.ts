import type { Locale } from "@/lib/i18n/config";

export function formatMonthYear(locale: Locale, isoDate: string): string {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(isoDate));
}
