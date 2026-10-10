import { ArrowUpRight } from "lucide-react";
import { CopyEmailButton } from "@/components/copy-email-button";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/content/types";

export function ContactSection({ dict }: { dict: Dictionary }) {
  const { contact } = siteConfig;
  const labels = dict.contact.labels;
  const primaryIsEmail = contact.email !== null;

  const rows = [
    { key: "telegram", label: labels.telegram, value: contact.telegram.handle, href: contact.telegram.url, external: true },
    { key: "phone", label: labels.phone, value: contact.phone.display, href: contact.phone.href, external: false },
    { key: "github", label: labels.github, value: contact.github.replace("https://", ""), href: contact.github, external: true },
    ...(contact.cv ? [{ key: "cv", label: labels.cv, value: "PDF", href: contact.cv, external: true }] : []),
  ].filter((row) => primaryIsEmail || row.key !== "telegram");

  const bigLink =
    "break-all text-[clamp(1.25rem,4.5vw,3rem)] font-semibold tracking-[-0.03em] transition-colors hover:text-accent";

  return (
    <Section id="contact" head={dict.sections.contact}>
      <div data-reveal>
        <p className="text-sm text-fg-subtle">{primaryIsEmail ? labels.email : labels.telegram}</p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {contact.email !== null ? (
            <>
              <a href={`mailto:${contact.email}`} className={bigLink}>
                {contact.email}
              </a>
              <CopyEmailButton
                email={contact.email}
                label={dict.a11y.copyEmail}
                copiedLabel={dict.a11y.copied}
                failedLabel={dict.a11y.copyFailed}
              />
            </>
          ) : (
            <a href={contact.telegram.url} target="_blank" rel="noopener noreferrer" className={bigLink}>
              {contact.telegram.handle}
            </a>
          )}
        </div>
        <p className="mt-3 text-sm text-fg-muted">{dict.contact.response}</p>
      </div>

      <ul className="mt-14 divide-y divide-border border-y border-border">
        {rows.map((row) => (
          <li key={row.key}>
            <a
              href={row.href}
              target={row.external ? "_blank" : undefined}
              rel={row.external ? "noopener noreferrer" : undefined}
              className="group flex min-h-14 items-center justify-between gap-4 py-3 transition-colors hover:text-accent"
            >
              <span className="text-fg-muted group-hover:text-inherit">{row.label}</span>
              <span className="flex items-center gap-2 font-mono text-sm">
                {row.value}
                <ArrowUpRight
                  className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
