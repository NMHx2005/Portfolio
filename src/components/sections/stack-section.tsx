"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitText } from "@/components/effects/split-text";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";

function MarqueeRow({ items, direction = 1 }: { items: string[]; direction?: 1 | -1 }) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;
      const width = track.scrollWidth / 2;
      gsap.set(track, { x: direction === 1 ? 0 : -width });
      gsap.to(track, {
        x: direction === 1 ? -width : 0,
        duration: 30,
        repeat: -1,
        ease: "none",
      });
    },
    { dependencies: [direction], scope: trackRef },
  );

  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <div ref={trackRef} className="flex w-max gap-3 py-3">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center rounded-full border border-border/60 bg-background-elevated/40 px-5 py-2 font-mono text-sm text-foreground/80 backdrop-blur"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function StackSection() {
  const { locale } = useLocale();
  const content = siteContent[locale].stack;

  const row1 = content.groups.flatMap((g) => g.items).slice(0, 12);
  const row2 = content.groups.flatMap((g) => g.items).slice(-12);

  return (
    <section
      id="stack"
      className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10 lg:py-40"
    >
      <header className="mb-12 max-w-3xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {content.eyebrow}
        </p>
        <SplitText as="h2" className="font-display text-4xl italic leading-tight sm:text-5xl md:text-6xl">
          {content.headline}
        </SplitText>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{content.description}</p>
      </header>

      <div className="space-y-2">
        <MarqueeRow items={row1} direction={1} />
        <MarqueeRow items={row2} direction={-1} />
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {content.groups.map((g) => (
          <div
            key={g.name}
            className="rounded-2xl border border-border/60 bg-background-elevated/40 p-5 backdrop-blur"
          >
            <h3 className="mb-3 text-xs font-mono uppercase tracking-[0.2em] text-accent">
              {g.name}
            </h3>
            <ul className="flex flex-wrap gap-1.5 text-sm text-muted-foreground">
              {g.items.map((item) => (
                <li key={item} className="rounded-md border border-border/50 px-2 py-0.5">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
