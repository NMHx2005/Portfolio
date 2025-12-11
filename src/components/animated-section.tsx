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
    amount: 0.25,
    margin: "0px 0px -80px 0px",
  });

  return (
    <motion.section
      id={id}
      ref={ref}
      className={cn(
        "relative mx-auto w-full max-w-6xl px-6 py-24 sm:px-10 lg:px-16",
        className,
      )}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay }}
    >
      {children}
    </motion.section>
  );
}


