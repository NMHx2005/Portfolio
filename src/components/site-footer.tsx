"use client";

import { motion } from "framer-motion";
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
        <motion.p
          className="text-xs"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {footer.note}
        </motion.p>
      </div>
    </footer>
  );
}
