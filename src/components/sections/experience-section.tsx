import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { SectionHeader } from "@/components/section-header";
import type { ExperienceContent, Locale } from "@/content";
import { cn } from "@/lib/utils";

const labels: Record<
  Locale,
  {
    role: string;
    achievements: string;
    tools: string;
    education: string;
  }
> = {
  en: {
    role: "Role",
    achievements: "Highlights",
    tools: "Tooling",
    education: "Education",
  },
  vi: {
    role: "Vai trò",
    achievements: "Thành tựu",
    tools: "Công cụ",
    education: "Học vấn",
  },
};

export function ExperienceSection({
  locale,
  content,
}: {
  locale: Locale;
  content: ExperienceContent;
}) {
  const copy = labels[locale];

  return (
    <AnimatedSection id="experience">
      <SectionHeader
        eyebrow={locale === "en" ? "Experience" : "Kinh nghiệm"}
        title={content.headline}
      />
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative space-y-8">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 hidden h-full w-0.5 bg-gradient-to-b from-primary/20 via-primary/30 to-transparent lg:block" />
          
          {content.items.map((item, index) => (
            <motion.article
              key={`${item.company}-${item.role}`}
              className="group relative overflow-hidden rounded-[40px] border border-border/50 bg-gradient-to-br from-background/90 via-background/80 to-background/90 p-8 shadow-[0_8px_32px_-8px_rgba(124,58,237,0.2),0_0_0_1px_rgba(124,58,237,0.1)] backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-[0_12px_48px_-12px_rgba(124,58,237,0.3),0_0_0_1px_rgba(124,58,237,0.15)] lg:pl-12"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.23, 1, 0.32, 1],
              }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              {/* Timeline dot */}
              <div className="absolute -left-4 top-8 hidden h-4 w-4 rounded-full border-4 border-background bg-primary shadow-[0_0_0_4px_rgba(124,58,237,0.2)] lg:block" />
              
              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex rounded-full border border-border/50 bg-background/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-sm">
                    {item.start} – {item.end}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                    {item.company}
                  </h3>
                  <p className="text-base font-semibold text-primary lg:text-lg">
                    {copy.role}: {item.role}
                  </p>
                </div>
                
                <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
                  {item.summary}
                </p>
                
                <div className="space-y-4 rounded-2xl border border-border/40 bg-background/50 p-5 backdrop-blur-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {copy.achievements}
                  </p>
                  <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {item.achievements.map((achievement, idx) => (
                      <motion.li
                        key={achievement}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.15 + 0.2 + idx * 0.05,
                        }}
                        viewport={{ once: true }}
                      >
                        <span className="mt-1.5 inline-flex h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(20,184,166,0.4)]" />
                        <span>{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {copy.tools}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {item.tech.map((tech, techIdx) => (
                      <motion.span
                        key={tech}
                        className="rounded-full border border-border/50 bg-background/90 px-3.5 py-1.5 text-xs font-bold text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.15 + 0.3 + techIdx * 0.03,
                        }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            {copy.education}
          </h3>
          <div className="space-y-6">
            {content.education.map((item, index) => (
              <motion.div
                key={item.program}
                className={cn(
                  "group relative overflow-hidden rounded-[32px] border border-border/50 bg-gradient-to-br from-background/90 via-background/80 to-background/90 p-6 shadow-[0_4px_24px_-4px_rgba(124,58,237,0.15)] backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-[0_8px_32px_-8px_rgba(124,58,237,0.25)]",
                )}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.23, 1, 0.32, 1],
                }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {item.start} – {item.end}
                  </span>
                  <h4 className="text-xl font-bold text-foreground lg:text-2xl">
                    {item.program}
                  </h4>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.institution}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.details}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}


