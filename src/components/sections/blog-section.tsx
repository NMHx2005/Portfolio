import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { SectionHeader } from "@/components/section-header";
import type { BlogContent, Locale } from "@/content";

const labels: Record<
  Locale,
  {
    readMore: string;
  }
> = {
  en: { readMore: "Read article" },
  vi: { readMore: "Đọc bài viết" },
};

export function BlogSection({
  locale,
  content,
}: {
  locale: Locale;
  content: BlogContent;
}) {
  const copy = labels[locale];

  return (
    <AnimatedSection id="blog">
      <SectionHeader
        eyebrow={locale === "en" ? "Blog" : "Blog"}
        title={content.headline}
        description={content.description}
      />
      <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
        {content.posts.map((post, index) => (
          <motion.article
            key={post.slug}
            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[32px] border border-border/50 bg-gradient-to-br from-background/90 via-background/80 to-background/90 p-6 shadow-[0_4px_24px_-4px_rgba(124,58,237,0.15)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_12px_48px_-12px_rgba(124,58,237,0.3)] lg:p-8"
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
            <div className="relative flex h-full flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {post.date}
                  </span>
                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                    {post.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-8 space-y-5">
                <div className="flex flex-wrap gap-2.5">
                  {post.tags.map((tag, tagIdx) => (
                    <motion.span
                      key={tag}
                      className="rounded-full border border-border/50 bg-background/90 px-3.5 py-1.5 text-xs font-bold text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1 + 0.2 + tagIdx * 0.03,
                      }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-border/40 pt-5">
                  <span className="text-xs font-medium text-muted-foreground">
                    {post.readingTime}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group/link inline-flex items-center gap-2 text-sm font-bold text-primary transition-all duration-300 hover:gap-3"
                  >
                    {copy.readMore}
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
                  </Link>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </AnimatedSection>
  );
}


