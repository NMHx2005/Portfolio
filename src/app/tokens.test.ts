import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

function tokens(selector: RegExp): Record<string, string> {
  const body = css.match(selector)?.[1] ?? "";
  const out: Record<string, string> = {};
  for (const [, name, value] of body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    out[name as string] = value as string;
  }
  return out;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (channels[0] as number) + 0.7152 * (channels[1] as number) + 0.0722 * (channels[2] as number);
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const themes = {
  light: tokens(/:root\s*\{([^}]*)\}/),
  dark: tokens(/\.dark\s*\{([^}]*)\}/),
};

const required = ["bg", "surface", "border", "border-strong", "fg", "fg-muted", "fg-subtle", "accent", "on-accent"];

describe.each(Object.entries(themes))("%s theme tokens", (_name, t) => {
  it("defines every token as a 6-digit hex", () => {
    for (const key of required) expect(t[key], key).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("text tokens meet WCAG AA (4.5:1) on bg and surface", () => {
    for (const fg of ["fg", "fg-muted", "fg-subtle"]) {
      for (const bg of ["bg", "surface"]) {
        expect(ratio(t[fg] as string, t[bg] as string), `${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("accent is readable on bg, and on-accent is readable on accent", () => {
    expect(ratio(t.accent as string, t.bg as string)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(t["on-accent"] as string, t.accent as string)).toBeGreaterThanOrEqual(4.5);
  });
});
