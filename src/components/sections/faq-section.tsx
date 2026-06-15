"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { SplitText } from "@/components/effects/split-text";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10 lg:py-40"
    >
      <header className="mb-14 text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {content.eyebrow}
        </p>
        <SplitText as="h2" className="font-display text-4xl italic leading-tight sm:text-5xl md:text-6xl">
          {content.headline}
        </SplitText>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{content.description}</p>
      </header>

      <div className="space-y-3">
        {content.items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className={cn(
                "overflow-hidden rounded-2xl border bg-background-elevated/40 backdrop-blur transition-colors",
                isOpen ? "border-primary/40" : "border-border/60 hover:border-border",
              )}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:p-6"
                aria-expanded={isOpen}
                data-cursor="hover"
              >
                <span className="text-base font-semibold sm:text-lg">{item.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6 sm:text-base">
                      {item.a}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
