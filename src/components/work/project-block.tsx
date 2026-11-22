import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { RequestLink } from "@/components/request-link";
import { DeviceFrame } from "@/components/ui/device-frame";
import { projectsData } from "@/content/projects";
import type { Dictionary, ProjectSlug } from "@/content/types";
import { formatPeriod } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { localePath, projectPath } from "@/lib/i18n/paths";
import { delay } from "@/lib/css-vars";
import { cn } from "@/lib/utils";

interface ProjectBlockProps {
  locale: Locale;
  dict: Dictionary;
  slug: ProjectSlug;
  index: number;
}

const externalLink =
  "pointer-events-auto inline-flex min-h-11 items-center gap-1.5 text-fg-muted underline-offset-4 transition-colors hover:text-fg hover:underline";

export function ProjectBlock({ locale, dict, slug, index }: ProjectBlockProps) {
  const data = projectsData[slug];
  const copy = dict.work.items[slug];
  const href = projectPath(locale, slug);
  const mirrored = index % 2 === 1;
  const phone = data.cover.frame === "phone";
  const cover = (
    // Below the fold on every viewport, so no preload; `sizes` follows the 7/12 column.
    <Image
      src={data.cover.src}
      alt={copy.coverAlt}
      width={data.cover.width}
      height={data.cover.height}
      sizes="(min-width: 1152px) 615px, (min-width: 1024px) 56vw, 100vw"
      className="h-auto w-full motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.02]"
    />
  );

  return (
    <article
      data-reveal="group"
      data-pin-item
      data-slug={slug}
      className="group relative grid gap-8 has-[h3_a:focus-visible]:outline-2 has-[h3_a:focus-visible]:outline-offset-8 has-[h3_a:focus-visible]:outline-accent lg:grid-cols-12 lg:items-center lg:gap-12"
    >
      {/* The whole card is clickable. This overlay is not inside the animated text, because a transformed parent
          would become its containing block and shrink the click area while the text is still settling. */}
      <Link href={href} aria-hidden tabIndex={-1} className="absolute inset-0 z-[1]" />
      <ViewTransition name={`cover-${slug}`} share="cover-morph" default="none">
        <div
          className={cn(
            "reveal-media overflow-hidden transition-colors duration-200 lg:col-span-7",
            !phone && "border border-border bg-surface group-hover:border-border-strong",
            mirrored && "lg:order-2",
          )}
        >
          {phone ? <DeviceFrame>{cover}</DeviceFrame> : cover}
        </div>
      </ViewTransition>

      <div className="lg:col-span-5">
        <p className="reveal-item font-mono text-sm text-fg-subtle" style={delay(0)}>
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="reveal-item mt-3 text-3xl font-semibold tracking-tight" style={delay(1)}>
          <Link href={href} className="focus-visible:outline-none">
            {copy.title}
          </Link>
        </h3>
        <p className="reveal-item mt-4 text-pretty text-fg-muted" style={delay(2)}>
          {copy.summary}
        </p>

        <dl className="reveal-item mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-border pt-6 text-sm" style={delay(3)}>
          <dt className="text-fg-subtle">{dict.caseStudy.client}</dt>
          <dd>{copy.client}</dd>
          <dt className="text-fg-subtle">{dict.caseStudy.period}</dt>
          <dd>{formatPeriod(locale, data.started, data.ended)}</dd>
          <dt className="text-fg-subtle">{dict.caseStudy.platform}</dt>
          <dd>{copy.platform}</dd>
          <dt className="text-fg-subtle">{dict.caseStudy.status}</dt>
          <dd>{dict.work.statusLabels[data.status]}</dd>
        </dl>

        <div className="reveal-item pointer-events-none relative z-10 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm" style={delay(4)}>
          <span aria-hidden className="inline-flex items-center gap-1.5 font-medium text-fg">
            {dict.work.viewCaseStudy}
            <ArrowRight className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-1" />
          </span>
          {data.links.live ? (
            <a href={data.links.live} target="_blank" rel="noopener noreferrer" className={externalLink}>
              {dict.work.live}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          ) : null}
          {data.status === "forSale" ? (
            <RequestLink href={`${localePath(locale)}#contact`} kind="other" className={externalLink}>
              {dict.work.askSource}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </RequestLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}
