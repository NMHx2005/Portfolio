import Link from "next/link";
import { motion } from "framer-motion";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#about", label: { en: "About", vi: "Về tôi" } },
  { href: "#projects", label: { en: "Projects", vi: "Dự án" } },
  { href: "#experience", label: { en: "Experience", vi: "Kinh nghiệm" } },
  { href: "#blog", label: { en: "Blog", vi: "Blog" } },
  { href: "#contact", label: { en: "Contact", vi: "Liên hệ" } },
];

export function SiteHeader() {
  const { locale } = useLocale();
  const hero = siteContent[locale].hero;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:px-8 lg:px-10 xl:px-16">
        <motion.div
          className="flex items-center gap-2 sm:gap-3"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <Link
            href="#hero"
            className="group flex items-center gap-2 rounded-full border border-border/50 bg-background/90 px-3 py-1.5 text-xs font-semibold tracking-tight text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_4px_12px_rgba(124,58,237,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-background/80 sm:gap-2.5 sm:px-4 sm:py-2 sm:text-sm"
          >
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex h-full w-full rounded-full bg-primary shadow-[0_0_0_2px_rgba(124,58,237,0.15)] sm:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]" />
            </span>
            <span className="transition-transform duration-300 group-hover:scale-105">
              {hero.name.split(" ")[0]}
            </span>
          </Link>
          <span className="hidden text-[10px] font-medium text-muted-foreground sm:inline-flex sm:text-xs lg:text-sm">
            {hero.role.split("&")[0].trim()}
          </span>
        </motion.div>
        <nav className="hidden items-center gap-0.5 sm:gap-1 md:flex">
          {navItems.map((item, index) => (
            <motion.a
              key={item.href}
              href={item.href}
              className={cn(
                "group relative rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 sm:px-4 sm:py-2 sm:text-sm",
              )}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.05,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <span className="relative z-10">{item.label[locale]}</span>
              <span className="absolute inset-0 rounded-full bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-2.5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}


