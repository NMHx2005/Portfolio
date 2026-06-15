"use client";

import type { ReactNode } from "react";
import { useMagnetic } from "@/hooks/use-magnetic";
import { cn } from "@/lib/utils";

interface MagneticProps {
  strength?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Wraps children in an inline-block div that follows the cursor with elastic spring.
 * The extra wrapper div is intentional — it sidesteps ref-forwarding/type variance
 * issues with cloneElement when children is a Link or polymorphic component.
 */
export function Magnetic({ strength = 0.4, className, children }: MagneticProps) {
  const ref = useMagnetic<HTMLDivElement>({ strength });
  return (
    <div ref={ref} className={cn("inline-block will-change-transform", className)}>
      {children}
    </div>
  );
}
