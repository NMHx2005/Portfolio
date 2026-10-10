import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Pipeline } from "@/components/case-study/pipeline";
import { Container } from "@/components/ui/container";
import { projectSlugs, projectsData } from "@/content/projects";
import type { Dictionary, ProjectSlug } from "@/content/types";
import { delay } from "@/lib/css-vars";
import type { Locale } from "@/lib/i18n/config";
import { localePath, projectPath } from "@/lib/i18n/paths";

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
  const links = [
    data.links.live ? { href: data.links.live, label: dict.work.live } : null,
    data.links.repo ? { href: data.links.repo, label: dict.work.repository } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

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
          <p className="rise text-sm text-fg-subtle" style={delay(0)}>
            {copy.category}
          </p>
          <h1
            className="rise mt-3 text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.035em]"
            style={delay(1)}
          >
            {copy.title}
          </h1>
          <p className="rise mt-6 max-w-2xl text-pretty text-lg text-fg-muted" style={delay(2)}>
            {copy.summary}
          </p>
        </header>

        <dl
          className="rise mt-12 grid gap-x-8 gap-y-6 border-y border-border py-6 text-sm sm:grid-cols-2 lg:grid-cols-4"
          style={delay(3)}
        >
          {copy.role ? (
            <div>
              <dt className="text-fg-subtle">{cs.role}</dt>
              <dd className="mt-1">{copy.role}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-fg-subtle">{cs.platform}</dt>
            <dd className="mt-1">{cs.platforms[data.kind]}</dd>
          </div>
          <div>
            <dt className="text-fg-subtle">{cs.status}</dt>
            <dd className="mt-1">{copy.status}</dd>
          </div>
          <div>
            <dt className="text-fg-subtle">{cs.stack}</dt>
            <dd className="mt-1 font-mono text-xs leading-6 text-fg-muted">{data.stack.join(" · ")}</dd>
          </div>
        </dl>

        <figure className="mt-12 overflow-hidden rounded-xl border border-border bg-surface">
          <Image
            src={data.image.src}
            alt={copy.imageAlt}
            width={data.image.width}
            height={data.image.height}
            priority
            sizes="(min-width: 1152px) 1088px, 100vw"
            className="h-auto w-full"
          />
        </figure>

        {links.length > 0 ? (
          <ul aria-label={cs.links} className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 font-medium underline-offset-4 hover:underline"
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-16">
          <Block id="problem" title={cs.problem}>
            <p className="max-w-2xl text-pretty text-lg text-fg-muted">{copy.problem}</p>
          </Block>

          <Block id="choices" title={cs.choices}>
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

          <Block id="architecture" title={cs.architecture}>
            <Pipeline steps={copy.flow} label={cs.flow} />
            <h3 className="sr-only">{cs.services}</h3>
            <dl className="mt-10 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-[10rem_1fr]">
              {copy.services.map((service) => (
                <div key={service.label} className="contents">
                  <dt className="text-fg-subtle">{service.label}</dt>
                  <dd className="font-mono text-xs leading-6 text-fg-muted">{service.detail}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block id="shipped" title={cs.shipped}>
            <ul className="max-w-2xl list-disc space-y-3 pl-5 text-fg-muted marker:text-fg-subtle">
              {copy.shipped.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3 className="sr-only">{cs.facts}</h3>
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              {data.metrics.map((metric) => (
                <div key={metric.key} className="flex gap-2">
                  <dt className="text-fg-subtle">{dict.work.metricLabels[metric.key]}</dt>
                  <dd className="font-mono text-fg-muted">{metric.value}</dd>
                </div>
              ))}
            </dl>
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
