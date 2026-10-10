import Link from "next/link";
import { CommandPalette } from "@/components/command-palette";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { ScrollProgress } from "@/components/scroll-progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/paths";
import { buildPaletteItems } from "@/lib/palette-items";

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const home = localePath(locale);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-bg">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href={home}
            aria-label={`NMHx — ${siteConfig.name}`}
            className="inline-flex h-11 min-w-11 items-center font-mono text-sm font-semibold tracking-tight"
          >
            NMHx<span className="text-accent">.</span>
          </Link>

          <nav aria-label={dict.a11y.mainNav} className="hidden md:block">
            <ul className="flex items-center gap-1">
              {dict.nav.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`${home}#${item.id}`}
                    className="rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <CommandPalette
              items={buildPaletteItems(locale, dict)}
              labels={{ ...dict.palette, copied: dict.a11y.copied, copyFailed: dict.a11y.copyFailed }}
            />
            <LanguageSwitcher locale={locale} label={dict.a11y.switchLanguage} />
            <ThemeToggle label={dict.a11y.toggleTheme} />
            <MobileNav
              items={dict.nav}
              home={home}
              labels={{ open: dict.a11y.openMenu, close: dict.a11y.closeMenu, nav: dict.a11y.mainNav }}
            />
          </div>
        </div>
      </Container>
      <ScrollProgress />
    </header>
  );
}
