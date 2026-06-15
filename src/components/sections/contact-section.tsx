"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { SplitText } from "@/components/effects/split-text";
import { TiltCard } from "@/components/effects/tilt-card";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent, type ContactChannel } from "@/content";

const iconMap: Record<ContactChannel["type"], LucideIcon> = {
  email: Mail,
  zalo: MessageCircle,
  phone: Phone,
  github: Github,
  linkedin: Linkedin,
};

export function ContactSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].contact;

  return (
    <section
      id="contact"
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.channels.map((ch, i) => {
          const Icon = iconMap[ch.type];
          const isExternal = ch.href.startsWith("http");
          return (
            <motion.div
              key={ch.type}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}
            >
              <TiltCard
                max={6}
                className="group relative h-full overflow-hidden rounded-3xl border border-border/60 bg-background-elevated/60 p-6 backdrop-blur transition-colors hover:border-primary/40"
              >
                <Link
                  href={ch.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="absolute inset-0 z-10"
                  aria-label={`${ch.label}: ${ch.value}`}
                  data-cursor="hover"
                />
                <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-background/60">
                      <Icon className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {ch.label}
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
                      {ch.value}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
