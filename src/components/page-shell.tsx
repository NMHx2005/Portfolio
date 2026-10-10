import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import type { Dictionary } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";

export function PageShell({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: ReactNode }) {
  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main id="main" className="pt-16">
        {children}
      </main>
    </>
  );
}
