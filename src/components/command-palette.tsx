"use client";

import { Search } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { rememberLocale } from "@/lib/i18n/cookie";
import { switchLocalePath } from "@/lib/i18n/paths";
import type { PaletteGroup, PaletteItem } from "@/lib/palette-items";
import { matchesQuery } from "@/lib/search";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  items: PaletteItem[];
  labels: {
    open: string;
    placeholder: string;
    empty: string;
    hint: string;
    copied: string;
    copyFailed: string;
    groups: Record<PaletteGroup, string>;
  };
}

const groupOrder: PaletteGroup[] = ["sections", "projects", "actions"];

export function CommandPalette({ items, labels }: CommandPaletteProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const listId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState("");

  const results = useMemo(
    () => groupOrder.flatMap((group) => items.filter((item) => item.group === group && matchesQuery(item.label, query))),
    [items, query],
  );
  const activeItem = results[active];

  const openPalette = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setQuery("");
    setActive(0);
    setNotice("");
    dialogRef.current?.showModal();
  }, []);

  const closePalette = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogRef.current?.open) closePalette();
        else openPalette();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(closeTimer.current);
    };
  }, [openPalette, closePalette]);

  useEffect(() => {
    if (!activeItem) return;
    document.getElementById(`${listId}-${activeItem.id}`)?.scrollIntoView({ block: "nearest" });
  }, [activeItem, listId]);

  function run(item: PaletteItem) {
    const { action } = item;
    if (action.kind === "copy") {
      // Keep the dialog open just long enough to tell the visitor what happened.
      // `Promise.resolve().then` also catches the synchronous throw when the Clipboard API is unavailable.
      Promise.resolve()
        .then(() => navigator.clipboard.writeText(action.value))
        .then(
          () => setNotice(labels.copied),
          () => setNotice(labels.copyFailed),
        )
        .finally(() => {
          closeTimer.current = window.setTimeout(closePalette, 900);
        });
      return;
    }
    closePalette();
    if (action.kind === "link") {
      if (action.href.startsWith("http")) window.open(action.href, "_blank", "noopener,noreferrer");
      else router.push(action.href);
    } else if (action.kind === "theme") {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    } else {
      rememberLocale(action.target);
      router.push(switchLocalePath(pathname, action.target));
    }
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeItem) run(activeItem);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        aria-label={labels.open}
        aria-haspopup="dialog"
        aria-keyshortcuts="Control+K Meta+K"
        className="hidden h-10 items-center gap-2 rounded-lg px-2.5 text-fg-muted transition-colors hover:text-fg sm:flex"
      >
        <Search className="h-[18px] w-[18px]" aria-hidden />
        <kbd className="hidden rounded-md border border-border px-1.5 py-0.5 font-mono text-[11px] lg:inline">Ctrl K</kbd>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={labels.open}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePalette();
        }}
        className="palette fixed inset-auto left-1/2 top-[14vh] m-0 w-[min(36rem,calc(100vw-2rem))] max-w-none -translate-x-1/2 rounded-xl border border-border-strong bg-surface p-0 text-fg backdrop:bg-black/50"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 focus-within:border-accent">
          <Search className="h-4 w-4 shrink-0 text-fg-subtle" aria-hidden />
          <input
            role="combobox"
            aria-label={labels.placeholder}
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeItem ? `${listId}-${activeItem.id}` : undefined}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder={labels.placeholder}
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-fg-subtle"
          />
        </div>

        <div id={listId} role="listbox" aria-label={labels.open} className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-fg-subtle">{labels.empty}</p>
          ) : (
            groupOrder.map((group) => {
              const groupItems = results.filter((item) => item.group === group);
              if (groupItems.length === 0) return null;
              return (
                <div key={group} role="group" aria-label={labels.groups[group]}>
                  <p aria-hidden className="px-3 pb-1 pt-3 text-xs text-fg-subtle">
                    {labels.groups[group]}
                  </p>
                  {groupItems.map((item) => {
                    const index = results.indexOf(item);
                    const selected = index === active;
                    return (
                      <div
                        key={item.id}
                        id={`${listId}-${item.id}`}
                        role="option"
                        aria-selected={selected}
                        onMouseMove={() => setActive(index)}
                        onClick={() => run(item)}
                        className={cn(
                          "flex h-11 cursor-pointer items-center rounded-lg px-3 text-sm",
                          selected ? "bg-fg/10 text-fg" : "text-fg-muted",
                        )}
                      >
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <p role="status" aria-live="polite" className="border-t border-border px-4 py-3 text-xs text-fg-subtle">
          {notice || labels.hint}
        </p>
      </dialog>
    </>
  );
}
