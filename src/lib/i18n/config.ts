export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "vi";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeLabels: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

export const ogLocales: Record<Locale, string> = {
  vi: "vi_VN",
  en: "en_US",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "vi" || value === "en";
}
