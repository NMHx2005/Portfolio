import { ArrowDown, ArrowRight } from "lucide-react";

export function Pipeline({ steps, label }: { steps: string[]; label: string }) {
  return (
    <ol aria-label={label} className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
      {steps.map((step, index) => (
        <li key={step} className="flex flex-col items-start gap-2 md:flex-row md:items-center">
          <span className="rounded-lg border border-border bg-surface px-3 py-2 text-sm">{step}</span>
          {index < steps.length - 1 ? (
            <>
              <ArrowDown className="ml-4 h-4 w-4 text-fg-subtle md:hidden" aria-hidden />
              <ArrowRight className="hidden h-4 w-4 shrink-0 text-fg-subtle md:block" aria-hidden />
            </>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
