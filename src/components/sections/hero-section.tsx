import { motion } from "framer-motion";
import { ActionButton } from "@/components/action-button";
import { AnimatedSection } from "@/components/animated-section";
import type { HeroContent } from "@/content";
import { CoderProfileCard } from "@/components/hero/coder-profile-card";

export function HeroSection({ content }: { content: HeroContent }) {
  return (
    <AnimatedSection id="hero" className="pt-16 sm:pt-20 md:pt-24 lg:pt-28">
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f4ff] p-5 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.15),0_0_0_1px_rgba(255,255,255,0.5)] backdrop-blur-xl dark:border-white/5 dark:from-[#030112] dark:via-[#080b2e] dark:to-[#0d153d] dark:shadow-[0_20px_60px_-15px_rgba(124,58,237,0.4),inset_0_0_0_1px_rgba(255,255,255,0.05)] sm:rounded-3xl sm:p-6 md:p-8 lg:rounded-3xl lg:p-8 xl:p-10">
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

        <div className="relative grid min-w-0 items-start gap-4 sm:gap-6 md:gap-8 lg:grid-cols-[1.3fr_minmax(0,0.7fr)] lg:items-center lg:gap-5 xl:gap-6">
          <div className="flex min-w-0 flex-col gap-3 sm:gap-4 md:gap-5">
            <div className="min-w-0 space-y-2 sm:space-y-3">
              <motion.h1
                className="min-w-0 text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              >
                <span className="block break-words bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                  {content.name}
                </span>
              </motion.h1>

              <motion.p
                className="min-w-0 break-words text-base font-semibold text-primary sm:text-lg md:text-xl lg:text-lg xl:text-xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
              >
                {content.role}
              </motion.p>

              <motion.p
                className="min-w-0 max-w-xl break-words text-balance text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg lg:text-base"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                {content.tagline}
              </motion.p>
            </div>

            <motion.div
              className="flex flex-wrap gap-2.5 pt-1 sm:gap-3 sm:pt-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
            >
              {content.actions.map((action, index) => (
                <ActionButton key={action.label} action={action} index={index} />
              ))}
            </motion.div>
          </div>

          <motion.div
            className="order-first min-w-0 w-full sm:mx-auto sm:max-w-[280px] lg:order-last lg:max-w-[280px] xl:max-w-[320px]"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <CoderProfileCard hero={content} />
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
