"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/effects/magnetic";
import { cn } from "@/lib/utils";
import type { ActionLink } from "@/content";

const variants: Record<NonNullable<ActionLink["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.6)] hover:shadow-[0_16px_48px_-12px_hsl(var(--primary)/0.7)]",
  secondary:
    "bg-background-elevated/80 text-foreground border border-border backdrop-blur hover:border-primary/40 hover:text-primary",
  ghost:
    "text-foreground hover:bg-foreground/5",
};

interface ActionButtonProps {
  action: ActionLink;
  index?: number;
}

export function ActionButton({ action, index = 0 }: ActionButtonProps) {
  const variant = action.variant ?? "primary";
  const className = cn(
    "group relative inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-13 sm:px-8 sm:text-base",
    variants[variant],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.05 * index, ease: [0.23, 1, 0.32, 1] }}
      viewport={{ once: true }}
      className="inline-block"
    >
      <Magnetic strength={0.25}>
        <Link
          href={action.href}
          target={action.external ? "_blank" : undefined}
          rel={action.external ? "noopener noreferrer" : undefined}
          className={className}
          data-cursor="hover"
        >
          <span>{action.label}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Magnetic>
    </motion.div>
  );
}
