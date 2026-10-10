"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useReducer, useSyncExternalStore, type MouseEvent } from "react";
import { localeLabels, locales, type Locale } from "@/lib/i18n/config";
import { rememberLocale } from "@/lib/i18n/cookie";
import { localeHref, switchLocalePath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

const currentSuffix = () => window.location.search + window.location.hash;
const noSuffix = () => "";
function subscribeToLocation(notify: () => void) {
  window.addEventListener("popstate", notify);
  window.addEventListener("hashchange", notify);
  return () => {
    window.removeEventListener("popstate", notify);
    window.removeEventListener("hashchange", notify);
  };
}

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();
  // Query and hash are only known in the browser, so the server renders the plain href (the no-JS fallback).
  // After hydration the real href carries them too, which is what "open in new tab" and "copy link" use.
  const suffix = useSyncExternalStore(subscribeToLocation, currentSuffix, noSuffix);
  // Next pushes hash-only navigations through history.pushState, which fires no event; re-read just before use.
  const [, refresh] = useReducer((n: number) => n + 1, 0);

  function onClick(event: MouseEvent<HTMLAnchorElement>, target: Locale) {
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    if (modified) return; // opening in a new tab must not change this tab's remembered choice
    rememberLocale(target);
    event.preventDefault();
    router.push(localeHref(pathname, window.location.search, window.location.hash, target));
  }

  return (
    <div role="group" aria-label={label} className="flex h-10 items-stretch inset-ring-1 inset-ring-border touch:h-11">
      {locales.map((target) => {
        const active = target === locale;
        return (
          <Link
            key={target}
            href={`${switchLocalePath(pathname, target)}${suffix}`}
            hrefLang={target}
            lang={target}
            aria-label={localeLabels[target]}
            aria-current={active ? "true" : undefined}
            onPointerEnter={refresh}
            onPointerDown={refresh}
            onFocus={refresh}
            onContextMenu={refresh}
            onClick={(event) => onClick(event, target)}
            className={cn(
              "flex min-w-10 items-center justify-center px-2.5 font-mono text-xs uppercase transition-colors touch:min-w-11",
              active ? "bg-fg text-bg" : "text-fg-muted hover:text-fg",
            )}
          >
            {target}
          </Link>
        );
      })}
    </div>
  );
}
