import { ArrowUp, Github } from "lucide-react";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/content/types";

const iconLink =
  "flex h-10 w-10 items-center justify-center rounded-lg border border-border text-fg-muted transition-colors hover:border-fg hover:text-fg touch:h-11 touch:w-11";

export function SiteFooter({ dict }: { dict: Dictionary }) {
  return (
    <footer className="border-t border-border py-10">
      <Container>
        <div className="flex flex-col gap-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">{dict.footer.tagline}</p>
            <p className="mt-1 text-xs text-fg-subtle">{dict.footer.note}</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={siteConfig.contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={iconLink}>
              <Github className="h-4 w-4" aria-hidden />
            </a>
            <a href="#main" aria-label={dict.a11y.backToTop} className={iconLink}>
              <ArrowUp className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
