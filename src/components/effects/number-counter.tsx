"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface NumberCounterProps {
  value: string;
  className?: string;
}

/**
 * Animates the leading number in `value` from 0 → target on scroll into view.
 * Non-numeric suffix (e.g. "+", "%", "x") is preserved.
 */
export function NumberCounter({ value, className }: NumberCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
      if (!match) {
        el.textContent = value;
        return;
      }
      const [, numStr, suffix] = match;
      const target = parseFloat(numStr);
      const decimals = (numStr.split(".")[1] ?? "").length;
      const obj = { n: 0 };
      gsap.to(obj, {
        n: target,
        duration: 1.6,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = obj.n.toFixed(decimals) + suffix;
        },
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      });
    },
    { dependencies: [value], scope: ref },
  );

  return <span ref={ref} className={className}>0</span>;
}
