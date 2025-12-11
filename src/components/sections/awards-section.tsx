import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { SectionHeader } from "@/components/section-header";
import type { Award, Locale } from "@/content";

const eyebrowLabel: Record<Locale, string> = {
  en: "Recognition",
  vi: "Ghi nhận",
};

export function AwardsSection({
  locale,
  headline,
  description,
  items,
}: {
  locale: Locale;
  headline: string;
  description: string;
  items: Award[];
}) {
  return (
    <AnimatedSection id="awards">
      <SectionHeader
        eyebrow={eyebrowLabel[locale]}
        title={headline}
        description={description}
      />
      <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
        {items.map((award, index) => (
          <motion.article
            key={award.name}
            className="group relative overflow-hidden rounded-[32px] border border-border/50 bg-gradient-to-br from-background/90 via-background/80 to-background/90 p-6 shadow-[0_4px_24px_-4px_rgba(124,58,237,0.15)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_12px_48px_-12px_rgba(124,58,237,0.3)] lg:p-8"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: index * 0.1,
              ease: [0.23, 1, 0.32, 1],
            }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative space-y-4">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary">
                {award.year}
              </span>
              <h3 className="text-xl font-bold text-foreground lg:text-2xl">
                {award.name}
              </h3>
              <p className="text-sm font-semibold text-primary lg:text-base">
                {award.issuer}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                {award.description}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </AnimatedSection>
  );
}


