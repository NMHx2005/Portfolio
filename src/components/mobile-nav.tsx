"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

interface MobileNavProps {
  items: { id: string; label: string }[];
  home: string;
  labels: { open: string; close: string; nav: string };
}

const iconButton =
  "flex h-11 w-11 items-center justify-center rounded-lg text-fg-muted transition-colors hover:text-fg";

export function MobileNav({ items, home, labels }: MobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
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
                  className="flex h-16 items-center justify-between text-2xl font-semibold tracking-tight"
                >
                  {item.label}
                  <span className="font-mono text-xs font-normal text-fg-subtle">0{index + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </div>
  );
}
