import { motion } from "framer-motion";
import { ActionButton } from "@/components/action-button";
import { AnimatedSection } from "@/components/animated-section";
import type { HeroContent } from "@/content";
import { CoderProfileCard } from "@/components/hero/coder-profile-card";

export function HeroSection({ content }: { content: HeroContent }) {
  return (
    <AnimatedSection id="hero" className="pt-32 sm:pt-40 lg:pt-48">
      <div className="relative overflow-hidden rounded-[56px] border border-border/40 bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f4ff] p-8 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.15),0_0_0_1px_rgba(255,255,255,0.5)] backdrop-blur-xl dark:border-white/5 dark:from-[#030112] dark:via-[#080b2e] dark:to-[#0d153d] dark:shadow-[0_20px_60px_-15px_rgba(124,58,237,0.4),inset_0_0_0_1px_rgba(255,255,255,0.05)] sm:p-12 lg:p-20">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-[140px]"
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
            className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-secondary/15 via-secondary/8 to-transparent blur-[160px]"
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
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
        </div>

        <div className="relative grid items-center gap-12 lg:grid-cols-[1.15fr_minmax(0,0.85fr)] lg:gap-20">
          <div className="flex flex-col gap-8 lg:gap-10">
            <motion.div
              className="inline-flex w-max items-center gap-2.5 rounded-full border border-border/50 bg-background/90 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-white/10 dark:bg-background/80"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              {content.highlight}
            </motion.div>

            <div className="space-y-5">
              <motion.h1
                className="text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[4rem] lg:leading-[1.05]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              >
                <span className="block text-base font-medium text-muted-foreground/90 sm:text-lg lg:text-xl">
                  {content.greeting}
                </span>
                <span className="mt-3 block bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                  {content.name}
                </span>
              </motion.h1>

              <motion.p
                className="text-xl font-semibold text-primary sm:text-2xl lg:text-3xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                {content.role}
              </motion.p>

              <motion.p
                className="max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl lg:leading-relaxed"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                {content.tagline}
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="group flex items-center gap-2.5 rounded-full border border-border/50 bg-background/90 px-5 py-2.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-md transition-all hover:border-emerald-400/50 hover:bg-background dark:border-white/10">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                </span>
                <span className="text-xs sm:text-sm">{content.availability}</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-full border border-border/50 bg-background/90 px-5 py-2.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-md dark:border-white/10">
                <svg
                  className="h-4 w-4 text-muted-foreground"
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
                <span className="text-xs sm:text-sm">{content.location}</span>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3 pt-2"
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
            className="order-first w-full lg:order-last"
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
