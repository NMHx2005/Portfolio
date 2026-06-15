"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/components/providers/locale-provider";
import { supportedLocales } from "@/content";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="inline-flex items-center rounded-full border border-border/60 bg-background-elevated/60 p-1 text-xs shadow-sm backdrop-blur">
      {supportedLocales.map((item) => {
        const isActive = locale === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLocale(item.code)}
            className={cn(
              "relative flex min-w-[56px] items-center justify-center rounded-full px-3 py-1.5 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
            data-cursor="hover"
            aria-label={`Switch to ${item.label}`}
          >
            <span className="relative z-10">{item.code.toUpperCase()}</span>
            <AnimatePresence>
              {isActive ? (
                <motion.span
                  layoutId="language-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-primary to-secondary"
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                />
              ) : null}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}
