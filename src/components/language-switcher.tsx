"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { localeLabels, locales, type Locale } from "@/lib/i18n/config";
import { rememberLocale } from "@/lib/i18n/cookie";
import { localeHref, switchLocalePath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function onClick(event: MouseEvent<HTMLAnchorElement>, target: Locale) {
    rememberLocale(target);
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    if (modified) return;
    // The plain href (no query/hash) is the no-JS fallback; with JS we keep the visitor's context.
    event.preventDefault();
    router.push(localeHref(pathname, window.location.search, window.location.hash, target));
  }

  return (
    <div role="group" aria-label={label} className="flex items-center rounded-lg border border-border p-0.5">
      {locales.map((target) => {
        const active = target === locale;
        return (
          <Link
            key={target}
            href={switchLocalePath(pathname, target)}
            hrefLang={target}
            lang={target}
            aria-label={localeLabels[target]}
            aria-current={active ? "true" : undefined}
            onClick={(event) => onClick(event, target)}
            className={cn(
              "flex h-8 min-w-9 items-center justify-center rounded-md px-2 font-mono text-xs uppercase transition-colors touch:h-11 touch:min-w-11",
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
