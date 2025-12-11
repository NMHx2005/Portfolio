"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/components/providers/locale-provider";
import { supportedLocales } from "@/content";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
    const { locale, setLocale } = useLocale();

    return (
        <div className="inline-flex items-center rounded-full border border-border/60 bg-background/80 p-1 text-sm shadow-sm backdrop-blur">
            {supportedLocales.map((item) => {
                const isActive = locale === item.code;
                return (
                    <button
                        key={item.code}
                        type="button"
                        onClick={() => setLocale(item.code)}
                        className={cn(
                            "relative flex min-w-[92px] items-center justify-center rounded-full px-3 py-1.5 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                            isActive ? "text-foreground" : "text-muted-foreground",
                        )}
                    >
                        <span className="relative z-10">{item.label}</span>
                        <AnimatePresence>
                            {isActive ? (
                                <motion.span
                                    layoutId="language-pill"
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/90 via-primary to-primary/90"
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


