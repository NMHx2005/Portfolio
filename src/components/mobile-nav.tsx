"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { headerControl } from "@/components/ui/header-control";
import { useActiveSection } from "@/lib/use-active-section";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  items: { id: string; label: string }[];
  home: string;
  labels: { open: string; close: string; nav: string };
}

const iconButton = cn(headerControl, "w-10 touch:w-11");

export function MobileNav({ items, home, labels }: MobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(["hero", ...items.map((item) => item.id)], open);

  // The trigger lives in an `lg:hidden` wrapper; an open modal would keep locking the page
  // after a rotate/resize hides that wrapper, with no visible way to close it.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    function onChange(event: MediaQueryListEvent) {
      if (event.matches) dialogRef.current?.close();
    }
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={labels.open}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
        className={iconButton}
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-nav"
        aria-label={labels.nav}
        onClose={() => setOpen(false)}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-transparent"
      >
        <div className="flex h-16 items-center justify-end px-5">
          <button type="button" aria-label={labels.close} onClick={() => dialogRef.current?.close()} className={iconButton}>
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <nav aria-label={labels.nav} className="px-5">
          <ul className="divide-y divide-border border-y border-border">
            {items.map((item, index) => (
              <li key={item.id}>
                <Link
                  href={`${home}#${item.id}`}
                  onClick={() => dialogRef.current?.close()}
                  aria-current={active === item.id ? "location" : undefined}
                  className={cn(
                    "flex h-16 items-center justify-between text-2xl font-semibold tracking-tight",
                    active === item.id ? "text-fg" : "text-fg-muted",
                  )}
                >
                  {item.label}
                  <span className={cn("font-mono text-xs font-normal", active === item.id ? "text-accent" : "text-fg-subtle")}>
                    0{index + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </div>
  );
}
