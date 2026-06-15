"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { locale } = useLocale();
  const content = siteContent[locale];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <Link
            href="#hero"
            className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-background-elevated/60 px-3.5 py-1.5 text-xs font-semibold backdrop-blur transition hover:border-primary/40 hover:text-primary sm:text-sm"
            data-cursor="hover"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex h-full w-full rounded-full bg-primary" />
            </span>
            <span>NMHx</span>
          </Link>
        </motion.div>

        <nav className="hidden items-center gap-1 md:flex">
          {content.nav.map((item, i) => (
            <motion.a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "group relative rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground",
              )}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 * i, ease: [0.23, 1, 0.32, 1] }}
              data-cursor="hover"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute inset-0 rounded-full bg-foreground/0 transition group-hover:bg-foreground/5" />
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
