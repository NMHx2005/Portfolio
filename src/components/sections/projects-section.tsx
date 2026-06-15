"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SplitText } from "@/components/effects/split-text";
import { NumberCounter } from "@/components/effects/number-counter";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent, type Project } from "@/content";

function ProjectCase({ project, index }: { project: Project; index: number }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const image = wrap.querySelector<HTMLElement>("[data-image]");
      if (!image) return;

      gsap.fromTo(
        image,
        { y: 0, scale: 1.05 },
        {
          y: -60,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      return () => {
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === wrap)
          .forEach((t) => t.kill());
      };
    },
    { scope: wrapRef },
  );

  return (
    <div
      ref={wrapRef}
      className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16"
    >
      <div className={index % 2 === 0 ? "" : "lg:order-2"}>
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-background-elevated/40 shadow-[0_20px_80px_-30px_hsl(var(--primary)/0.5)]">
          <div data-image className="relative aspect-[4/3] w-full will-change-transform">
            <Image
              src={project.image.src}
              alt={project.image.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 600px, 100vw"
            />
          </div>
        </div>
      </div>

      <motion.div
        className={index % 2 === 0 ? "lg:sticky lg:top-28" : "lg:sticky lg:top-28 lg:order-1"}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      >
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {project.category}
        </p>
        <h3 className="font-display text-3xl italic leading-tight sm:text-4xl md:text-5xl">
          {project.title}
        </h3>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">{project.problem}</p>
        <p className="mt-3 text-base leading-relaxed text-foreground/90">{project.solution}</p>

        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          {project.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <div className="mt-7 grid grid-cols-3 gap-3 rounded-2xl border border-border/60 bg-background-elevated/40 p-4">
          {project.metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div className="font-display text-2xl italic text-primary sm:text-3xl">
                <NumberCounter value={m.value} />
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.techStack.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border/60 bg-background/50 px-3 py-1 font-mono text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          {project.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              data-cursor="hover"
              className={
                link.variant === "primary"
                  ? "inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-primary hover:text-primary-foreground"
                  : "inline-flex items-center gap-2 rounded-full border border-border bg-background-elevated/60 px-5 py-2.5 text-sm font-semibold transition hover:border-primary/40 hover:text-primary"
              }
            >
              {link.label}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function ProjectsSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].projects;

  return (
    <section
      id="projects"
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

      <div className="space-y-24 lg:space-y-40">
        {content.items.map((project, i) => (
          <ProjectCase key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
