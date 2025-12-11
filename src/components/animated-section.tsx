"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedSection({
  id,
  className,
  children,
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1,
    margin: "0px 0px -100px 0px",
  });

  return (
    <motion.section
      id={id}
      ref={ref}
      className={cn(
        "relative mx-auto w-full max-w-6xl min-w-0 px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-10 xl:px-16",
        className,
      )}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay }}
    >
      {children}
    </motion.section>
  );
}


