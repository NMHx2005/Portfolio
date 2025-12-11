import { motion } from "framer-motion";
import { ActionButton } from "@/components/action-button";
import { AnimatedSection } from "@/components/animated-section";
import type { HeroContent } from "@/content";
import { CoderProfileCard } from "@/components/hero/coder-profile-card";

export function HeroSection({ content }: { content: HeroContent }) {
  return (
    <AnimatedSection id="hero" className="pt-24 sm:pt-32 md:pt-40 lg:pt-48">
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f4ff] p-6 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.15),0_0_0_1px_rgba(255,255,255,0.5)] backdrop-blur-xl dark:border-white/5 dark:from-[#030112] dark:via-[#080b2e] dark:to-[#0d153d] dark:shadow-[0_20px_60px_-15px_rgba(124,58,237,0.4),inset_0_0_0_1px_rgba(255,255,255,0.05)] sm:rounded-[40px] sm:p-8 md:p-10 lg:rounded-[56px] lg:p-14 xl:p-20">
        {/* Animated gradient orbs - Responsive sizes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-[100px] sm:-top-32 sm:-left-32 sm:h-80 sm:w-80 sm:blur-[120px] md:h-96 md:w-96 md:blur-[140px]"
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-gradient-to-tr from-secondary/15 via-secondary/8 to-transparent blur-[120px] sm:-bottom-32 sm:-right-32 sm:h-96 sm:w-96 sm:blur-[140px] md:h-[500px] md:w-[500px] md:blur-[160px]"
            animate={{
              x: [0, -20, 0],
              y: [0, -30, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-white/30 dark:from-white/5 dark:via-transparent dark:to-white/8" />
          {/* Subtle grid pattern - Responsive size */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:16px_16px] sm:bg-[size:20px_20px] md:bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
        </div>

        <div className="relative grid min-w-0 items-start gap-8 sm:gap-10 md:gap-12 lg:grid-cols-[1.15fr_minmax(0,0.85fr)] lg:items-center lg:gap-14 xl:gap-20">
          <div className="flex min-w-0 flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-10">
            <motion.div
              className="inline-flex w-full max-w-full items-center gap-2.5 rounded-full border border-border/50 bg-background/90 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-white/10 dark:bg-background/80 sm:max-w-fit sm:gap-3 sm:px-5 sm:py-3 sm:text-sm md:px-6 md:py-3.5"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="relative flex h-1.5 w-1.5 shrink-0 sm:h-2 sm:w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
                <span className="relative inline-flex h-full w-full rounded-full bg-primary" />
              </span>
              <span className="min-w-0 break-words text-xs leading-tight sm:text-sm">{content.highlight}</span>
            </motion.div>

            <div className="min-w-0 space-y-4 sm:space-y-5 md:space-y-6">
              <motion.h1
                className="min-w-0 text-balance text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] xl:leading-[1.05]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              >
                <span className="block text-sm font-medium text-muted-foreground/90 sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                  {content.greeting}
                </span>
                <span className="mt-2 block break-words bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent sm:mt-3 md:mt-4">
                  {content.name}
                </span>
              </motion.h1>

              <motion.p
                className="min-w-0 break-words text-lg font-semibold text-primary sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                {content.role}
              </motion.p>

              <motion.p
                className="min-w-0 max-w-2xl break-words text-balance text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                {content.tagline}
              </motion.p>
            </div>

            <motion.div
              className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 md:gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="group flex min-w-0 w-full items-center gap-2.5 rounded-full border border-border/50 bg-background/90 px-4 py-2.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-md transition-all hover:border-emerald-400/50 hover:bg-background dark:border-white/10 sm:w-auto sm:gap-3 sm:px-5 sm:py-3 md:px-6 md:py-3.5 md:text-base">
                <span className="relative flex h-2 w-2 shrink-0 sm:h-2.5 sm:w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-full w-full rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                </span>
                <span className="min-w-0 break-words text-xs leading-tight sm:text-sm md:text-base">{content.availability}</span>
              </div>
              <div className="flex min-w-0 w-full items-center gap-2.5 rounded-full border border-border/50 bg-background/90 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-md dark:border-white/10 sm:w-auto sm:gap-3 sm:px-5 sm:py-3 md:px-6 md:py-3.5 md:text-base">
                <svg
                  className="h-4 w-4 shrink-0 text-muted-foreground sm:h-4.5 sm:w-4.5 md:h-5 md:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="min-w-0 break-words text-xs leading-tight sm:text-sm md:text-base">{content.location}</span>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3 pt-2 sm:gap-4 sm:pt-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              {content.actions.map((action, index) => (
                <ActionButton key={action.label} action={action} index={index} />
              ))}
            </motion.div>
          </div>

          <motion.div
            className="order-first min-w-0 w-full sm:mx-auto sm:max-w-sm lg:order-last lg:max-w-md"
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <CoderProfileCard hero={content} />
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
