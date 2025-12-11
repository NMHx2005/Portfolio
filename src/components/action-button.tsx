import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActionLink } from "@/content";

const variants: Record<
  NonNullable<ActionLink["variant"]>,
  string
> = {
  primary:
    "bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground shadow-[0_4px_20px_-4px_rgba(124,58,237,0.5),0_0_0_1px_rgba(124,58,237,0.2)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-6px_rgba(124,58,237,0.6),0_0_0_1px_rgba(124,58,237,0.3)] hover:from-primary hover:via-primary/95 hover:to-primary",
  secondary:
    "bg-background/90 text-foreground border border-border/60 backdrop-blur-sm hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-foreground hover:text-background hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.15)]",
  ghost:
    "bg-background/60 text-foreground border border-transparent backdrop-blur-sm hover:-translate-y-0.5 hover:border-border/50 hover:bg-background/80 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]",
};

export function ActionButton({
  action,
  index = 0,
}: {
  action: ActionLink;
  index?: number;
}) {
  const variant = action.variant ?? "primary";
  const isExternal = action.href.startsWith("http");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.5 + index * 0.1,
        ease: [0.23, 1, 0.32, 1],
      }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={action.href}
        download={action.download}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={cn(
          "group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 sm:h-13 sm:gap-2.5 sm:px-7 sm:text-base md:px-8 md:h-14",
          variants[variant],
        )}
      >
        <span>{action.label}</span>
        {!action.download && (
          <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
        )}
      </Link>
    </motion.div>
  );
}


