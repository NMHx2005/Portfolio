import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/content/types";
import { delay } from "@/lib/css-vars";

export function ServicesSection({ dict }: { dict: Dictionary }) {
  return (
    <Section id="services" head={dict.sections.services}>
      <ol className="divide-y divide-border border-y border-border">
        {dict.services.items.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={delay(index)}
            className="grid gap-4 py-8 md:grid-cols-[3rem_1fr_1.2fr] md:gap-8"
          >
            <span className="font-mono text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
            <div>
              <p className="text-pretty text-fg-muted">{item.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <li key={tag} className="rounded-md border border-border px-2 py-1 font-mono text-xs text-fg-subtle">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
