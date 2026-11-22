import { BuildingList } from "@/components/work/building-list";
import { ProjectBlock } from "@/components/work/project-block";
import { Section } from "@/components/ui/section";
import { projectSlugs } from "@/content/projects";
import type { Dictionary } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";

export function WorkSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Section id="projects" head={dict.sections.projects} wide>
      <div data-motion-pin className="space-y-24 md:space-y-32">
        {/* Shown only while the projects are pinned. It is in the server markup so that taking over adds nothing to the
            layout: it sits outside the flow, above the stage, and is static text, so hydration cannot disagree with it. */}
        <p data-pin-indicator aria-hidden="true" className="hidden font-mono text-sm text-fg-subtle">
          {`01 / ${String(projectSlugs.length).padStart(2, "0")}`}
        </p>
        {projectSlugs.map((slug, index) => (
          <ProjectBlock key={slug} locale={locale} dict={dict} slug={slug} index={index} />
        ))}
      </div>
      <BuildingList dict={dict} />
    </Section>
  );
}
