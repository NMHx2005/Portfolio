import type { ReactNode } from "react";
import type { SectionHead, SectionId } from "@/content/types";
import { delay } from "@/lib/css-vars";
import { Container } from "./container";

export function Section({ id, head, children }: { id: SectionId; head: SectionHead; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="border-t border-border py-24 md:py-32">
      <Container>
        <div className="grid gap-10 md:grid-cols-[11rem_1fr] md:gap-12">
          <p className="text-sm md:sticky md:top-24 md:self-start">
            <span className="font-mono text-xs text-fg-subtle">{head.index}</span>
            <span className="ml-3 text-fg-muted">{head.label}</span>
          </p>
          <div>
            <h2
              id={`${id}-heading`}
              data-reveal
              className="max-w-3xl text-balance text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.025em]"
            >
              {head.heading}
            </h2>
            {head.lede ? (
              <p data-reveal style={delay(1)} className="mt-4 max-w-2xl text-pretty text-fg-muted">
                {head.lede}
              </p>
            ) : null}
            <div className="mt-12 md:mt-16">{children}</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
