"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuroraBackground } from "@/components/effects/aurora-background";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { StackSection } from "@/components/sections/stack-section";
import { ProcessSection } from "@/components/sections/process-section";
import { AboutSection } from "@/components/sections/about-section";
import { FaqSection } from "@/components/sections/faq-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <AuroraBackground />
      <CustomCursor />
      <SiteHeader />
      <main className="relative">
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <StackSection />
        <ProcessSection />
        <AboutSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
