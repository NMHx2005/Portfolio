import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/content/types";

export function AboutSection({ dict }: { dict: Dictionary }) {
  const { about } = dict;

  return (
    <Section id="about" head={dict.sections.about}>
      <div className="grid gap-12">
        <div>
          <div data-reveal className="max-w-2xl space-y-5 text-pretty text-lg text-fg-muted">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <h3 id="stack" className="mt-14 text-sm font-medium text-fg-muted">
            {about.skillsTitle}
          </h3>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {about.skillGroups.map((group) => (
              <div key={group.name} data-skill-group className="grid gap-2 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <p className="text-sm text-fg-subtle">{group.name}</p>
                <p className="font-mono text-xs leading-6 text-fg-muted">{group.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
