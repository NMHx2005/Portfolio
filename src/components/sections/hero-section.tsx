import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/link-button";
import { SplitWords } from "@/components/ui/split-words";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/content/types";
import { delay } from "@/lib/css-vars";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/paths";

export function HeroSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { hero } = dict;
  const home = localePath(locale);

  return (
    <section id="hero" aria-labelledby="hero-heading" className="pb-24 pt-20 md:pb-32 md:pt-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[1fr_24rem] lg:items-end lg:gap-20">
          <div>
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

          <div role="group" aria-label={hero.statsLabel}>
            <dl className="grid grid-cols-2 border-l border-t border-border">
              {hero.stats.map((stat, index) => (
                <div key={stat.label} className="rise flex flex-col justify-between gap-6 border-b border-r border-border p-5" style={delay(4 + index)}>
                  <dd className="order-1 text-4xl font-semibold tracking-tight">{stat.value}</dd>
                  <dt className="order-2 text-xs leading-5 text-fg-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>
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
