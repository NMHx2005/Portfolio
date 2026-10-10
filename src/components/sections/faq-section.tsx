import { Plus } from "lucide-react";
import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/content/types";

export function FaqSection({ dict }: { dict: Dictionary }) {
  return (
    <Section id="faq" head={dict.sections.faq}>
      <div data-reveal className="divide-y divide-border border-y border-border">
        {dict.faq.items.map((item) => (
          <details key={item.q} name="faq" className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-base font-medium [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus
                className="h-4 w-4 shrink-0 text-fg-subtle motion-safe:transition-transform motion-safe:duration-200 group-open:rotate-45"
                aria-hidden
              />
            </summary>
            <p className="max-w-2xl text-pretty pb-6 text-fg-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
