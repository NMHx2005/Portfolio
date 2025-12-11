"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      lerp: 0.1,
      smoothWheel: true,
    });

    let frame = requestAnimationFrame(function onFrame(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(onFrame);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}


