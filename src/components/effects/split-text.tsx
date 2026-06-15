"use client";

import { createElement, useRef, type ElementType } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { splitWords, splitChars } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  as?: ElementType;
  className?: string;
  splitBy?: "word" | "char";
  delay?: number;
  start?: string;
  once?: boolean;
  /** Must be a plain string — the component re-splits when text changes (e.g. locale toggle). */
  children: string;
}

export function SplitText({
  as: Tag = "div",
  className,
  splitBy = "word",
  delay = 0,
  start = "top 85%",
  once = true,
  children,
}: SplitTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const parts = splitBy === "word" ? splitWords(el) : splitChars(el);
      gsap.set(parts, { y: "110%" });
      gsap.to(parts, {
        y: "0%",
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.04,
        delay,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: once ? "play none none none" : "play reverse play reverse",
        },
      });
      return () => {
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === el)
          .forEach((t) => t.kill());
      };
    },
    { dependencies: [splitBy, delay, start, once, children], scope: ref },
  );

  // createElement sidesteps polymorphic JSX ref typing issues with ElementType.
  return createElement(
    Tag,
    { ref, className: cn(className), key: children },
    children,
  );
}
