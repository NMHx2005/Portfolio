"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  max?: number;
  scale?: number;
}

export function TiltCard({ children, className, max, scale, ...rest }: TiltCardProps) {
  const ref = useTilt<HTMLDivElement>({ max, scale });
  return (
    <div ref={ref} className={cn("will-change-transform", className)} {...rest}>
      {children}
    </div>
  );
}
