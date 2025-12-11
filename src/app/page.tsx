"use client";

import { motion } from "framer-motion";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { BlogSection } from "@/components/sections/blog-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { AwardsSection } from "@/components/sections/awards-section";
import { ContactSection } from "@/components/sections/contact-section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useLocale } from "@/components/providers/locale-provider";
import { siteContent } from "@/content";

export default function Home() {
  const { locale } = useLocale();
  const content = siteContent[locale];

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/25 via-primary/15 to-transparent blur-[180px]"
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
          className="absolute left-[10%] top-[30%] h-96 w-96 rounded-full bg-gradient-to-br from-secondary/20 via-secondary/10 to-transparent blur-[140px]"
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
          className="absolute bottom-[-10%] right-[5%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent blur-[180px]"
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
        <BlogSection locale={locale} content={content.blog} />
        <TestimonialsSection
          locale={locale}
          headline={content.testimonials.headline}
          testimonials={content.testimonials.items}
        />
        <AwardsSection
          locale={locale}
          headline={content.awards.headline}
          description={content.awards.description}
          items={content.awards.items}
        />
        <ContactSection locale={locale} content={content.contact} />
      </main>
      <SiteFooter />
    </div>
  );
}
