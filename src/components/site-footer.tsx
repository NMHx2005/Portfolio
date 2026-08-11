"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";

export function SiteFooter() {
  const { locale } = useLocale();
  const { footer } = siteContent[locale];

  return (
    <footer className="relative border-t border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <motion.p
          className="font-medium text-foreground"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {footer.tagline}
        </motion.p>
        <div className="flex items-center gap-4">
          <motion.p
            className="text-xs"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {footer.note}
          </motion.p>
          <Link
            href="https://github.com/NMHx2005"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            data-cursor="hover"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <Github className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </footer>
  );
}
