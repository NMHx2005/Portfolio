"use client";

import Link from "next/link";
import { useActiveSection } from "@/lib/use-active-section";
import { cn } from "@/lib/utils";

interface HeaderNavProps {
  items: { id: string; label: string }[];
  home: string;
  label: string;
}

export function HeaderNav({ items, home, label }: HeaderNavProps) {
  const active = useActiveSection(["hero", ...items.map((item) => item.id)]);

  return (
    <nav aria-label={label} className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const current = active === item.id;
          return (
            <li key={item.id}>
              <Link
                href={`${home}#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "inline-flex items-center px-3 py-2 text-sm underline decoration-2 underline-offset-[10px] transition-colors hover:text-fg touch:min-h-11",
                  current ? "text-fg decoration-accent" : "text-fg-muted decoration-transparent",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
