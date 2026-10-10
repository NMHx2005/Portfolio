"use client";

import { useEffect, useState } from "react";

/**
 * Which of the page's sections the visitor is reading: the last one (in `ids` order) that crosses a thin
 * band just above the middle of the viewport. Between two sections, or when none is on the page, the
 * previous answer stands, so the highlight never flickers off while scrolling.
 */
export function useActiveSection(ids: string[], enabled = true): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    if (!enabled) return;
    const targets = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const order = targets.map((el) => el.id);
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = order.filter((id) => visible.has(id)).pop();
        if (current) setActive(current);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, [key, enabled]);

  return active;
}
