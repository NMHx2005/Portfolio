"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsDesktop, useReducedMotion } from "@/hooks/use-media-query";

interface TiltOptions {
  max?: number;
  scale?: number;
}

export function useTilt<T extends HTMLElement>({ max = 8, scale = 1.02 }: TiltOptions = {}) {
  const ref = useRef<T | null>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !isDesktop || reducedMotion) return;

    const rxTo = gsap.quickTo(el, "rotateX", { duration: 0.5, ease: "power3.out" });
    const ryTo = gsap.quickTo(el, "rotateY", { duration: 0.5, ease: "power3.out" });
    const scaleTo = gsap.quickTo(el, "scale", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rxTo(-py * max);
      ryTo(px * max);
      scaleTo(scale);
    };

    const onLeave = () => {
      rxTo(0);
      ryTo(0);
      scaleTo(1);
    };

    gsap.set(el, { transformPerspective: 800, transformStyle: "preserve-3d" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [isDesktop, reducedMotion, max, scale]);

  return ref;
}
