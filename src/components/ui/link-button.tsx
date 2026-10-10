import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-fg text-bg hover:bg-fg/85",
  secondary: "border border-border-strong text-fg hover:border-fg",
} as const;

interface LinkButtonProps {
  href: string;
  variant?: keyof typeof variants;
  external?: boolean;
  children: ReactNode;
}

export function LinkButton({ href, variant = "primary", external = false, children }: LinkButtonProps) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group inline-flex h-11 items-center justify-center gap-2 px-5 text-sm font-medium transition-colors duration-200",
        variants[variant],
      )}
    >
      {children}
      <Icon
        className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
