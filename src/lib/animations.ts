"use client";

import { gsap } from "@/lib/gsap";

/**
 * Wrap each word of an element's text in <span class="word"><span class="inner">word</span></span>
 * so GSAP can animate the inner span (y, opacity) without affecting layout.
 * Returns the array of inner spans.
 */
export function splitWords(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent ?? "";
  el.textContent = "";
  const words = text.split(/\s+/).filter(Boolean);
  const inners: HTMLSpanElement[] = [];
  words.forEach((word, i) => {
    const outer = document.createElement("span");
    outer.className = "inline-block overflow-hidden align-bottom";
    const inner = document.createElement("span");
    inner.className = "inline-block";
    inner.textContent = word;
    outer.appendChild(inner);
    el.appendChild(outer);
    if (i < words.length - 1) {
      el.appendChild(document.createTextNode(" "));
    }
    inners.push(inner);
  });
  return inners;
}

/**
 * Same as splitWords but per character. Preserves spaces.
 */
export function splitChars(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent ?? "";
  el.textContent = "";
  const inners: HTMLSpanElement[] = [];
  for (const ch of text) {
    if (ch === " ") {
      el.appendChild(document.createTextNode(" "));
      continue;
    }
    const outer = document.createElement("span");
    outer.className = "inline-block overflow-hidden align-bottom";
    const inner = document.createElement("span");
    inner.className = "inline-block";
    inner.textContent = ch;
    outer.appendChild(inner);
    el.appendChild(outer);
    inners.push(inner);
  }
  return inners;
}

/**
 * Fade + slide up an array of elements with stagger.
 */
export function revealStagger(targets: gsap.TweenTarget, options: gsap.TweenVars = {}) {
  return gsap.fromTo(
    targets,
    { y: 32, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.06,
      ease: "power3.out",
      ...options,
    },
  );
}

/**
 * Standard scroll-trigger config for an element.
 */
export function inViewTrigger(el: Element, onceOnly = true): ScrollTrigger.Vars {
  return {
    trigger: el,
    start: "top 80%",
    toggleActions: onceOnly ? "play none none none" : "play reverse play reverse",
  };
}
