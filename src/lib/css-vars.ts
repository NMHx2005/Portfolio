import type { CSSProperties } from "react";

export function delay(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}
