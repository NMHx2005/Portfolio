import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { SectionHeader } from "@/components/section-header";
import type { Locale, Testimonial } from "@/content";

const eyebrowLabel: Record<Locale, string> = {
  en: "Testimonials",
  vi: "Cảm nhận",
};

export function TestimonialsSection({
  locale,
  headline,
  testimonials,
}: {
  locale: Locale;
  headline: string;
  testimonials: Testimonial[];
}) {
  return (
    <AnimatedSection id="testimonials">
      <SectionHeader eyebrow={eyebrowLabel[locale]} title={headline} align="center" />
      <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
        {testimonials.map((item, index) => (
          <motion.blockquote
            key={item.name}
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
            <div className="relative">
              <span className="text-6xl font-bold leading-none text-primary/30 lg:text-7xl">
                "
              </span>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground lg:text-lg">
                {item.quote}
              </p>
              <footer className="mt-6 space-y-1 border-t border-border/40 pt-6">
                <p className="text-sm font-bold text-foreground lg:text-base">
                  {item.name}
                </p>
                <p className="text-xs font-medium text-muted-foreground lg:text-sm">
                  {item.role}
                </p>
              </footer>
            </div>
          </motion.blockquote>
        ))}
      </div>
    </AnimatedSection>
  );
}


