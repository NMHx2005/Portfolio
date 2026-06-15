"use client";

import { Code2, Layout, ShoppingBag, Wrench, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { TiltCard } from "@/components/effects/tilt-card";
import { SplitText } from "@/components/effects/split-text";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent, type ServiceItem } from "@/content";

const iconMap: Record<ServiceItem["icon"], LucideIcon> = {
  layout: Layout,
  code: Code2,
  shopping: ShoppingBag,
  wrench: Wrench,
};

export function ServicesSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].services;

  return (
    <section
      id="services"
      className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10 lg:py-40"
    >
      <header className="mb-14 max-w-3xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {content.eyebrow}
        </p>
        <SplitText as="h2" className="font-display text-4xl italic leading-tight sm:text-5xl md:text-6xl">
          {content.headline}
        </SplitText>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{content.description}</p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {content.items.map((item, i) => {
          const Icon = iconMap[item.icon];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
            >
              <TiltCard
                className="group relative h-full overflow-hidden rounded-3xl border border-border/60 bg-background-elevated/60 p-7 backdrop-blur-xl transition-colors hover:border-primary/40"
                data-cursor="hover"
              >
                <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-background/60">
                    <Icon className="h-5 w-5 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">{item.forWho}</p>
                  </div>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    {item.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
