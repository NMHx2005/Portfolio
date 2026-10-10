import type { Locale } from "@/lib/i18n/config";
import { en } from "./en";
import type { Dictionary } from "./types";
import { vi } from "./vi";

const dictionaries: Record<Locale, Dictionary> = { vi, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
