"use client";

import { motion } from "framer-motion";
import { SplitText } from "@/components/effects/split-text";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";

export function ProcessSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].process;

  return (
    <section
      id="process"
      className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10 lg:py-40"
    >
      <header className="mb-16 max-w-3xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {content.eyebrow}
        </p>
        <SplitText as="h2" className="font-display text-4xl italic leading-tight sm:text-5xl md:text-6xl">
          {content.headline}
        </SplitText>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{content.description}</p>
      </header>

      <div className="relative">
        <div className="pointer-events-none absolute left-[34px] top-0 bottom-0 hidden w-px bg-gradient-to-b from-primary/0 via-primary/40 to-primary/0 sm:block" />

        <ol className="space-y-10">
          {content.steps.map((step, i) => (
            <motion.li
              key={step.title}
              className="relative grid gap-4 sm:grid-cols-[80px_1fr] sm:gap-8"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="flex items-center sm:items-start sm:justify-center">
                <div className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full border border-border/60 bg-background-elevated/80 backdrop-blur">
                  <span className="font-display text-2xl italic text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
              <div className="rounded-3xl border border-border/60 bg-background-elevated/40 p-6 backdrop-blur sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-2xl italic sm:text-3xl">{step.title}</h3>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    {step.duration}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {step.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
