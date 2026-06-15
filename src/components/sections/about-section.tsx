"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SplitText } from "@/components/effects/split-text";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";

export function AboutSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].about;

  return (
    <section
      id="about"
      className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10 lg:py-40"
    >
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col gap-6"
        >
          <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-3xl border border-border/60 bg-background-elevated/60 sm:w-64 lg:mx-0">
            <Image
              src="/portrait.svg"
              alt="Portrait"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 256px, 192px"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {content.values.map((v) => (
              <span
                key={v}
                className="rounded-full border border-border/60 bg-background-elevated/40 px-4 py-1.5 text-sm font-medium text-foreground/80 backdrop-blur"
              >
                {v}
              </span>
            ))}
          </div>
        </motion.div>

        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {content.eyebrow}
          </p>
          <SplitText as="h2" className="font-display text-4xl italic leading-tight sm:text-5xl md:text-6xl">
            {content.headline}
          </SplitText>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {content.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.23, 1, 0.32, 1] }}
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
