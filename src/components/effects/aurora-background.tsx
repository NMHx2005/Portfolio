"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-media-query";

export function AuroraBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const blobs = containerRef.current?.querySelectorAll<HTMLElement>("[data-blob]");
      if (!blobs) return;

      blobs.forEach((blob, i) => {
        gsap.to(blob, {
          x: `+=${(i + 1) * 60 * (i % 2 === 0 ? 1 : -1)}`,
          y: `+=${(i + 1) * 40 * (i % 2 === 0 ? -1 : 1)}`,
          scale: 1.15,
          duration: 14 + i * 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { dependencies: [reducedMotion], scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        data-blob
        className="absolute -top-32 left-1/2 h-[60vw] w-[60vw] max-h-[800px] max-w-[800px] -translate-x-1/2 rounded-full opacity-50 blur-[140px]"
        style={{ background: "radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.8), transparent 60%)" }}
      />
      <div
        data-blob
        className="absolute left-[5%] top-[40%] h-[40vw] w-[40vw] max-h-[600px] max-w-[600px] rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.7), transparent 60%)" }}
      />
      <div
        data-blob
        className="absolute right-[-10%] bottom-[-10%] h-[50vw] w-[50vw] max-h-[700px] max-w-[700px] rounded-full opacity-40 blur-[140px]"
        style={{ background: "radial-gradient(circle at 50% 50%, hsl(var(--secondary) / 0.7), transparent 60%)" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
    </div>
  );
}
