"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { Locale } from "@/content";

interface LocaleContextValue {
  locale: Locale;
  setLocale: Dispatch<SetStateAction<Locale>>;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const STORAGE_KEY = "portfolio.locale";

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "vi";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "vi" || stored === "en") return stored;
  return window.navigator.language?.toLowerCase().startsWith("en") ? "en" : "vi";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("vi");

  useEffect(() => {
    // Intentional: detect locale after mount to avoid hydration mismatch with localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(detectInitialLocale());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
