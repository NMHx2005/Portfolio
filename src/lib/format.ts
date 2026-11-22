import type { Locale } from "@/lib/i18n/config";

const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function month(locale: Locale, iso: string): string {
  const [year, mm] = iso.split("-");
  return locale === "vi" ? `${mm}/${year}` : `${EN_MONTHS[Number(mm) - 1]} ${year}`;
}

/** "10/2026 – nay", "Oct 2026 – present" or a closed range. ISO dates in, month precision out. */
export function formatPeriod(locale: Locale, started: string, ended?: string): string {
  const to = ended ? month(locale, ended) : locale === "vi" ? "nay" : "present";
  return `${month(locale, started)} – ${to}`;
}
