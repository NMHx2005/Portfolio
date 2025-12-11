import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { SectionHeader } from "@/components/section-header";
import type { Locale, Project } from "@/content";
import { cn } from "@/lib/utils";

const categoryLabel: Record<Locale, string> = {
  en: "Category",
  vi: "Phân loại",
};

export function ProjectsSection({
  locale,
  headline,
  description,
  projects,
}: {
  locale: Locale;
  headline: string;
  description: string;
  projects: Project[];
}) {
  return (
    <AnimatedSection id="projects">
      <SectionHeader
        eyebrow={locale === "en" ? "Projects" : "Dự án"}
        title={headline}
        description={description}
      />
      <div className="grid gap-8 lg:gap-10 lg:grid-cols-2">
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            className={cn(
              "group relative overflow-hidden rounded-[40px] border border-border/50 bg-gradient-to-br from-background/90 via-background/80 to-background/90 shadow-[0_8px_32px_-8px_rgba(124,58,237,0.2),0_0_0_1px_rgba(124,58,237,0.1)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_16px_48px_-12px_rgba(124,58,237,0.35),0_0_0_1px_rgba(124,58,237,0.2)]",
            )}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.05,
              ease: [0.23, 1, 0.32, 1],
            }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative h-72 overflow-hidden rounded-t-[40px]">
              <Image
                src={project.media.src}
                alt={project.media.alt}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <motion.span
                className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/95 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-md shadow-sm"
                initial={{ opacity: 0, y: -8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {categoryLabel[locale]} · {project.category}
              </motion.span>
            </div>
            <div className="relative space-y-6 p-8 lg:p-10">
              <div className="space-y-3">
                <h3 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                  {project.title}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
                  {project.description}
                </p>
              </div>
              <ul className="grid gap-3 text-sm leading-relaxed text-muted-foreground">
                {project.highlights.map((highlight, idx) => (
                  <motion.li
                    key={highlight}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: index * 0.05 + 0.15 + idx * 0.02,
                    }}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <span className="mt-1.5 inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(124,58,237,0.4)]" />
                    <span>{highlight}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2.5">
                {project.techStack.map((tech, techIdx) => (
                  <motion.span
                    key={tech}
                    className="rounded-full border border-border/50 bg-background/90 px-3.5 py-1.5 text-xs font-bold text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05 + 0.2 + techIdx * 0.01,
                    }}
                    viewport={{ once: true, amount: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {project.links && project.links.length > 0 ? (
                  project.links.map((link, linkIdx) => (
                    <motion.a
                      key={linkIdx}
                      href={link.href}
                      className="group/link inline-flex items-center gap-2 text-sm font-bold text-primary transition-all duration-300 hover:gap-3"
                      whileHover={{ x: 4 }}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        link.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      <span>{link.label}</span>
                      <svg
                        className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </motion.a>
                  ))
                ) : (
                  <motion.a
                    href={project.link.href}
                    className="group/link inline-flex items-center gap-2 text-sm font-bold text-primary transition-all duration-300 hover:gap-3"
                    whileHover={{ x: 4 }}
                    target={project.link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      project.link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    <span>{project.link.label}</span>
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </motion.a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </AnimatedSection>
  );
}


