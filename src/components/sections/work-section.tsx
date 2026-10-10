import { ProjectBlock } from "@/components/work/project-block";
import { Section } from "@/components/ui/section";
import { projectSlugs } from "@/content/projects";
import type { Dictionary } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";

export function WorkSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Section id="projects" head={dict.sections.projects} wide>
      <div className="space-y-24 md:space-y-32">
        {projectSlugs.map((slug, index) => (
          <ProjectBlock key={slug} locale={locale} dict={dict} slug={slug} index={index} />
        ))}
      </div>
    </Section>
  );
}
