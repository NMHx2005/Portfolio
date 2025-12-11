import { motion } from "framer-motion";
import { siteContent } from "@/content";
import { useLocale } from "@/components/providers/locale-provider";

export function SiteFooter() {
  const { locale } = useLocale();
  const footer = siteContent[locale].footer;

  return (
    <footer className="relative border-t border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
        <motion.p
          className="font-medium"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {footer.availability}
        </motion.p>
        <motion.p
          className="text-xs font-medium sm:text-sm"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {footer.note}
        </motion.p>
      </div>
    </footer>
  );
}


