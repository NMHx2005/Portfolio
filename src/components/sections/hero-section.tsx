import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/link-button";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/content/types";
import { delay } from "@/lib/css-vars";
import { formatMonthYear } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

export function HeroSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { hero } = dict;
  const home = localePath(locale);
  const hasNow = hero.now.length > 0;

  return (
    <section id="hero" aria-labelledby="hero-heading" className="pb-24 pt-20 md:pb-32 md:pt-32">
      <Container>
        <div className={cn("grid gap-16", hasNow && "lg:grid-cols-[1fr_20rem] lg:gap-20")}>
          <div>
            <p className="rise inline-flex items-center gap-3 text-sm text-fg-muted" style={delay(0)}>
              <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
              {hero.status}
            </p>
            <h1
              id="hero-heading"
              className="rise mt-8 max-w-4xl text-balance text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.035em]"
              style={delay(1)}
            >
              {hero.headline}
            </h1>
            <p className="rise mt-6 max-w-xl text-pretty text-lg text-fg-muted" style={delay(2)}>
              {hero.intro}
            </p>
            <div className="rise mt-10 flex flex-wrap gap-3" style={delay(3)}>
              <LinkButton href={`${home}#projects`}>{hero.primaryCta}</LinkButton>
              <LinkButton href={`${home}#contact`} variant="secondary">
                {hero.secondaryCta}
              </LinkButton>
            </div>
          </div>

          {hasNow ? (
            <div
              role="group"
              aria-label={hero.nowTitle}
              className="rise self-end border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
              style={delay(4)}
            >
              <h2 className="text-sm font-medium text-fg-muted">{hero.nowTitle}</h2>
              <dl className="mt-5 space-y-5 text-sm">
                {hero.now.map((item) => (
                  <div key={item.label}>
                    <dt className="text-fg-subtle">{item.label}</dt>
                    <dd className="mt-1 text-fg">{item.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-xs text-fg-subtle">
                {hero.updatedLabel} {formatMonthYear(locale, siteConfig.contentUpdated)}
              </p>
            </div>
          ) : null}
        </div>

        <ul
          aria-label={dict.about.skillsTitle}
          className="rise mt-20 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 font-mono text-xs text-fg-subtle"
          style={delay(5)}
        >
          {siteConfig.heroStack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
