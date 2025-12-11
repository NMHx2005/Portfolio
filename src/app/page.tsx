"use client";

import { motion } from "framer-motion";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ContactSection } from "@/components/sections/contact-section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";

export default function Home() {
  const { locale } = useLocale();
  const content = siteContent[locale];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/25 via-primary/15 to-transparent blur-[120px] sm:h-[500px] sm:w-[500px] sm:blur-[150px] md:h-[600px] md:w-[600px] md:blur-[180px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute left-[10%] top-[30%] h-64 w-64 rounded-full bg-gradient-to-br from-secondary/20 via-secondary/10 to-transparent blur-[100px] sm:h-80 sm:w-80 sm:blur-[120px] md:h-96 md:w-96 md:blur-[140px]"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[5%] h-72 w-72 rounded-full bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent blur-[120px] sm:h-96 sm:w-96 sm:blur-[150px] md:h-[500px] md:w-[500px] md:blur-[180px]"
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <SiteHeader />
      <main className="relative">
        <HeroSection content={content.hero} />
        <AboutSection content={content.about} locale={locale} />
        <ProjectsSection
          locale={locale}
          headline={content.projects.headline}
          description={content.projects.description}
          projects={content.projects.items}
        />
        <ExperienceSection locale={locale} content={content.experience} />
        <ContactSection locale={locale} content={content.contact} />
      </main>
      <SiteFooter />
    </div>
  );
}
