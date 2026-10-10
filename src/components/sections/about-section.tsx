import Image from "next/image";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/content/types";
import { cn } from "@/lib/utils";

export function AboutSection({ dict }: { dict: Dictionary }) {
  const { about } = dict;
  const portrait = siteConfig.portrait;

  return (
    <Section id="about" head={dict.sections.about}>
      <div className={cn("grid gap-12", portrait && "lg:grid-cols-[14rem_1fr]")}>
        {portrait ? (
          <Image
            src={portrait.src}
            alt={about.portraitAlt}
            width={portrait.width}
            height={portrait.height}
            sizes="(min-width: 1024px) 224px, 60vw"
            className="h-auto w-full max-w-56 border border-border object-cover"
          />
        ) : null}

        <div>
          <div data-reveal className="max-w-2xl space-y-5 text-pretty text-lg text-fg-muted">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <h3 className="mt-14 text-sm font-medium text-fg-muted">{about.habitsLabel}</h3>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {about.habits.map((habit) => (
              <li key={habit.title} className="grid gap-2 py-5 sm:grid-cols-[14rem_1fr] sm:gap-6">
                <p className="font-medium">{habit.title}</p>
                <p className="text-sm text-fg-muted">{habit.detail}</p>
              </li>
            ))}
          </ul>

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
