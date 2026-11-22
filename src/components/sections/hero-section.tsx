import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { headerControl } from "@/components/ui/header-control";
import { LinkButton } from "@/components/ui/link-button";
import { SplitWords } from "@/components/ui/split-words";
import { projectSlugs, projectsData } from "@/content/projects";
import { heroFigures, type HeroFigures } from "@/content/stats";
import type { Dictionary } from "@/content/types";
import { delay } from "@/lib/css-vars";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

const figureKeys: (keyof HeroFigures)[] = ["live", "total", "sameClient", "rankdleDays"];

export function HeroSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { hero } = dict;
  const home = localePath(locale);
  const figures = heroFigures();

  return (
    <section id="hero" aria-labelledby="hero-heading" className="pb-24 pt-20 md:pb-32 md:pt-32">
      <Container>
        <p className="rise inline-flex items-center gap-3 text-sm text-fg-muted" style={delay(0)}>
          <span aria-hidden className="h-2 w-2 bg-accent" />
          {hero.status}
        </p>
        <h1
          id="hero-heading"
          className="mt-8 max-w-4xl text-balance text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.035em]"
        >
          <SplitWords text={hero.headline} />
        </h1>

        <div className="mt-8 grid gap-16 lg:grid-cols-[1fr_24rem] lg:items-end lg:gap-20">
          <div>
            <p className="rise max-w-xl text-pretty text-lg text-fg-muted" style={delay(2)}>
              {hero.intro}
            </p>
            <div className="rise mt-10 flex flex-wrap gap-3" style={delay(3)}>
              <LinkButton href={`${home}#contact`}>{hero.primaryCta}</LinkButton>
              <LinkButton href={`${home}#projects`} variant="secondary">
                {hero.secondaryCta}
              </LinkButton>
            </div>
          </div>

          <div role="group" aria-label={hero.statsLabel}>
            <dl className="grid grid-cols-2 border-l border-t border-border">
              {figureKeys.map((key, index) => (
                <div key={key} className="rise flex flex-col justify-between gap-6 border-b border-r border-border p-5" style={delay(4 + index)}>
                  <dd data-count-to={figures[key]} className="order-1 text-4xl font-semibold tracking-tight">{figures[key]}</dd>
                  <dt className="order-2 text-xs leading-5 text-fg-muted">{hero.figures[key]}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="relative mt-16 md:mt-24">
          {/* Hidden (and so out of the tab order) until the motion layer makes the strip move on its own. It sits in the
              margin above the strip, so showing it moves nothing. */}
          <button
            type="button"
            hidden
            data-strip-pause
            aria-pressed="false"
            aria-label={hero.stripPause}
            className={cn(headerControl, "group absolute bottom-full right-0 mb-3 w-10")}
          >
            <Pause className="h-[18px] w-[18px] group-aria-pressed:hidden" aria-hidden />
            <Play className="hidden h-[18px] w-[18px] group-aria-pressed:block" aria-hidden />
          </button>
          <div
            data-motion-strip-viewport
            role="group"
            aria-label={hero.stripGroupLabel}
            tabIndex={0}
            className="rise snap-x snap-mandatory overflow-x-auto"
            style={delay(8)}
          >
            <ul data-motion-strip aria-label={hero.stripLabel} className="flex gap-4">
              {projectSlugs.map((slug, index) => {
                const { cover } = projectsData[slug];
                return (
                  <li key={slug} className="w-[min(16rem,62vw)] shrink-0 snap-start border border-border bg-surface md:w-auto md:min-w-0 md:flex-1">
                    <Image
                      src={cover.src}
                      alt={dict.work.items[slug].coverAlt}
                      width={cover.width}
                      height={cover.height}
                      sizes="(min-width: 1152px) 220px, (min-width: 768px) 20vw, 62vw"
                      preload={index === 0}
                      className="h-auto w-full"
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
