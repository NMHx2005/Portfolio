"use client";

import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    if (!mounted) {
        return (
            <span className="h-10 w-10 rounded-full border border-border/60 bg-background/80" />
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <motion.button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
                "relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background/80 text-foreground shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            )}
            whileTap={{ scale: 0.95 }}
            aria-label={isDark ? "Activate light mode" : "Activate dark mode"}
        >
            <motion.span
                key={isDark ? "dark" : "light"}
                initial={{ opacity: 0, y: 8, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -8, rotate: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center justify-center"
            >
                {isDark ? (
                    <SunMedium className="h-5 w-5" aria-hidden />
                ) : (
                    <MoonStar className="h-5 w-5" aria-hidden />
                )}
            </motion.span>
        </motion.button>
    );
}


