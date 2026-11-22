import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { RequestLink } from "@/components/request-link";
import { Gallery } from "@/components/case-study/gallery";
import { Container } from "@/components/ui/container";
import { SplitWords } from "@/components/ui/split-words";
import { projectSlugs, projectsData } from "@/content/projects";
import type { Dictionary, ProjectSlug } from "@/content/types";
import { delay } from "@/lib/css-vars";
import { formatPeriod } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { localePath, projectPath } from "@/lib/i18n/paths";

const linkClass = "inline-flex min-h-11 items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline";

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="grid gap-6 border-t border-border py-12 md:grid-cols-[11rem_1fr] md:gap-12 md:py-16">
      <h2 className="text-sm font-medium text-fg-muted">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export function CaseStudyView({ locale, dict, slug }: { locale: Locale; dict: Dictionary; slug: ProjectSlug }) {
  const data = projectsData[slug];
  const copy = dict.work.items[slug];
  const cs = dict.caseStudy;
  const position = projectSlugs.indexOf(slug);
  const neighbour = (offset: number) =>
    projectSlugs[(position + offset + projectSlugs.length) % projectSlugs.length] as ProjectSlug;
  const next = neighbour(1);
  const previous = neighbour(-1);
  const facts: [string, string][] = [
    [cs.client, copy.client],
    [cs.period, formatPeriod(locale, data.started, data.ended)],
    [cs.platform, copy.platform],
    [cs.status, dict.work.statusLabels[data.status]],
  ];

  return (
    <Container>
      <article className="pb-24 pt-12 md:pb-32 md:pt-20">
        <Link
          href={`${localePath(locale)}#projects`}
          className="inline-flex min-h-11 items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {cs.back}
        </Link>

        <header className="mt-8">
          <h1 className="text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
            <SplitWords text={copy.title} />
          </h1>
          <p className="rise mt-6 max-w-2xl text-pretty text-lg text-fg-muted" style={delay(2)}>
            {copy.summary}
          </p>
        </header>

        <dl
          className="rise mt-12 grid gap-x-8 gap-y-6 border-y border-border py-6 text-sm sm:grid-cols-2 lg:grid-cols-4"
          style={delay(3)}
        >
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-fg-subtle">{label}</dt>
              <dd className="mt-1">{value}</dd>
            </div>
          ))}
        </dl>

        <ViewTransition name={`cover-${slug}`} share="cover-morph" default="none">
          <figure data-motion-parallax className="mt-12 overflow-hidden border border-border bg-surface">
            <Image
              src={data.cover.src}
              alt={copy.coverAlt}
              width={data.cover.width}
              height={data.cover.height}
              preload
              sizes="(min-width: 1152px) 1088px, 100vw"
              className="h-auto w-full"
            />
          </figure>
        </ViewTransition>

        <div className="mt-16">
          {copy.problem ? (
            <Block id="problem" title={cs.problem}>
              <p className="max-w-2xl text-pretty text-lg text-fg-muted">{copy.problem}</p>
            </Block>
          ) : null}

          <Block id="delivered" title={cs.delivered}>
            <ul className="max-w-2xl list-disc space-y-3 pl-5 text-fg-muted marker:text-fg-subtle">
              {copy.delivered.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Block>

          {data.gallery.length > 0 ? (
            <Block id="gallery" title={cs.gallery}>
              <Gallery images={data.gallery} alts={copy.galleryAlt} />
            </Block>
          ) : null}

          {data.links.live || data.status === "forSale" ? (
            <Block id="links" title={cs.links}>
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {data.links.live ? (
                  <a href={data.links.live} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {dict.work.live}
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                ) : null}
                {data.status === "forSale" ? (
                  <RequestLink href={`${localePath(locale)}#contact`} kind="other" className={linkClass}>
                    {dict.work.askSource}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </RequestLink>
                ) : null}
              </div>
            </Block>
          ) : null}

          {copy.choices?.length ? (
            <Block id="technical" title={cs.technical}>
              <ol className="divide-y divide-border border-y border-border">
                {copy.choices.map((choice, index) => (
                  <li key={choice.title} className="grid gap-3 py-6 md:grid-cols-[3rem_1fr]">
                    <span className="font-mono text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-lg font-medium tracking-tight">{choice.title}</h3>
                      {choice.why || choice.tradeoff ? (
                        <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[6rem_1fr]">
                          {choice.why ? (
                            <>
                              <dt className="text-fg-subtle">{cs.why}</dt>
                              <dd className="text-fg-muted">{choice.why}</dd>
                            </>
                          ) : null}
                          {choice.tradeoff ? (
                            <>
                              <dt className="text-fg-subtle">{cs.tradeoff}</dt>
                              <dd className="text-fg-muted">{choice.tradeoff}</dd>
                            </>
                          ) : null}
                        </dl>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </Block>
          ) : null}

          <Block id="stack" title={cs.stack}>
            <p className="font-mono text-xs leading-6 text-fg-muted">{data.stack.join(" · ")}</p>
          </Block>
        </div>

        <nav aria-label={cs.next} className="grid gap-px border-t border-border pt-10 sm:grid-cols-2">
          <Link href={projectPath(locale, previous)} className="group py-4">
            <span className="flex items-center gap-2 text-sm text-fg-subtle">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {cs.previous}
            </span>
            <span className="mt-1 block text-xl font-semibold tracking-tight group-hover:text-accent">
              {dict.work.items[previous].title}
            </span>
          </Link>
          <Link href={projectPath(locale, next)} className="group py-4 sm:text-right">
            <span className="flex items-center gap-2 text-sm text-fg-subtle sm:justify-end">
              {cs.next}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
            <span className="mt-1 block text-xl font-semibold tracking-tight group-hover:text-accent">
              {dict.work.items[next].title}
            </span>
          </Link>
        </nav>
      </article>
    </Container>
  );
}
