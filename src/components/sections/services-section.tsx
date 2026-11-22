import { ArrowRight } from "lucide-react";
import { RequestLink } from "@/components/request-link";
import { Section } from "@/components/ui/section";
import { isProjectSlug, projectsData, provenBy, serviceKinds } from "@/content/projects";
import type { Dictionary } from "@/content/types";
import { delay } from "@/lib/css-vars";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/paths";

// Running products are the strongest proof, so they come first; the sort is stable, so ties keep newest-first.
const liveFirst = (slug: string) => (isProjectSlug(slug) && projectsData[slug].status === "live" ? 0 : 1);

export function ServicesSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Section id="services" head={dict.sections.services}>
      <ol className="divide-y divide-border border-y border-border">
        {serviceKinds.map((kind, index) => {
          const item = dict.services.items[kind];
          const proof = provenBy(kind)
            .sort((a, b) => liveFirst(a) - liveFirst(b))
            .map((slug) => (isProjectSlug(slug) ? dict.work.items[slug].title : dict.work.building.items[slug].title));
          return (
            <li
              key={kind}
              data-service={kind}
              data-reveal
              style={delay(index)}
              className="grid gap-4 py-8 md:grid-cols-[3rem_1fr_1.2fr] md:gap-8"
            >
              <span className="font-mono text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
              <div>
                <p className="text-pretty text-fg-muted">{item.description}</p>
                {item.duration ? <p className="mt-3 text-sm text-accent">{item.duration}</p> : null}
                <p className="mt-5 text-sm">
                  <span className="text-fg-subtle">{dict.services.provenBy}: </span>
                  <span className="text-fg-muted">{proof.join(", ")}</span>
                </p>
                <RequestLink href={`${localePath(locale)}#contact`} kind={kind}>
                  {dict.services.request}
                  <ArrowRight
                    className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </RequestLink>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
