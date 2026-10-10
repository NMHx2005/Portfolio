import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/content/types";
import { delay } from "@/lib/css-vars";

export function ProcessSection({ dict }: { dict: Dictionary }) {
  return (
    <Section id="process" head={dict.sections.process} wide>
      <ol className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-6">
        {dict.process.steps.map((step, index) => (
          <li key={step.title} data-reveal style={delay(index)} className="border-t border-border-strong pt-5">
            <span className="font-mono text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-1 text-sm text-accent">{step.duration}</p>
            <p className="mt-4 text-sm text-fg-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
