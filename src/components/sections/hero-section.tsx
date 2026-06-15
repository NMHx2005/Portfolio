"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { splitWords } from "@/lib/animations";
import { ActionButton } from "@/components/action-button";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";

export function HeroSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].hero;
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;
      const nameEl = root.querySelector<HTMLElement>("[data-anim=name]");
      const roleEl = root.querySelector<HTMLElement>("[data-anim=role]");
      const valueEl = root.querySelector<HTMLElement>("[data-anim=value]");
      const greetEl = root.querySelector<HTMLElement>("[data-anim=greet]");
      const cardEl = root.querySelector<HTMLElement>("[data-anim=card]");

      if (!nameEl || !roleEl || !valueEl || !greetEl || !cardEl) return;

      const nameWords = splitWords(nameEl);
      const roleWords = splitWords(roleEl);
      const valueWords = splitWords(valueEl);

      gsap.set([nameWords, roleWords, valueWords], { y: "110%" });
      gsap.set(greetEl, { opacity: 0, y: 10 });
      gsap.set(cardEl, { opacity: 0, y: 32, scale: 0.96 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(greetEl, { opacity: 1, y: 0, duration: 0.6 })
        .to(nameWords, { y: "0%", duration: 0.9, stagger: 0.05 }, "-=0.25")
        .to(roleWords, { y: "0%", duration: 0.8, stagger: 0.04 }, "-=0.6")
        .to(valueWords, { y: "0%", duration: 0.7, stagger: 0.025 }, "-=0.55")
        .to(cardEl, { opacity: 1, y: 0, scale: 1, duration: 1, ease: "expo.out" }, "-=0.7");
    },
    { dependencies: [locale], scope: containerRef },
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:px-10"
    >
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <span
            data-anim="greet"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background-elevated/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur w-fit"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70 opacity-75" />
              <span className="relative inline-flex h-full w-full rounded-full bg-accent" />
            </span>
            {content.greeting}
          </span>

          <h1
            data-anim="name"
            className="text-balance font-display text-5xl italic leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]"
          >
            {content.name}
          </h1>

          <p
            data-anim="role"
            className="text-gradient-aurora text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
          >
            {content.role}
          </p>

          <p
            data-anim="value"
            className="max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {content.valueProp}
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            {content.actions.map((action, i) => (
              <ActionButton key={action.label} action={action} index={i} />
            ))}
          </div>
        </div>

        <motion.div
          data-anim="card"
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 blur-2xl" />
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-background-elevated/80 p-6 backdrop-blur-xl shadow-[0_24px_60px_-20px_hsl(var(--primary)/0.4)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                {content.codeProfile.fileName}
              </span>
              <span className="rounded-full bg-accent/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
                {content.codeProfile.seniority}
              </span>
            </div>
            <div className="relative mx-auto mb-4 aspect-square w-32 overflow-hidden rounded-2xl border border-border/60 bg-background">
              <Image
                src="/portrait.svg"
                alt="Portrait"
                fill
                className="object-cover"
                sizes="128px"
                priority
              />
            </div>
            <ul className="font-mono text-[11px] leading-relaxed text-muted-foreground">
              <li><span className="text-secondary">const</span> <span className="text-foreground">skills</span> = [</li>
              {content.codeProfile.skills.map((s) => (
                <li key={s} className="pl-4">
                  <span className="text-accent">&quot;{s}&quot;</span>,
                </li>
              ))}
              <li>];</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
