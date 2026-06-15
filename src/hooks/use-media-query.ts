"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

export function useMediaQuery(query: string): boolean {
  const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") return noopSubscribe();
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  };

  const getSnapshot = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  };

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px) and (pointer: fine)");
export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
