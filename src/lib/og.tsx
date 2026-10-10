import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const fontFiles = [
  ["Inter-latin-400.woff", 400],
  ["Inter-vietnamese-400.woff", 400],
  ["Inter-latin-600.woff", 600],
  ["Inter-vietnamese-600.woff", 600],
] as const;

async function loadFonts() {
  return Promise.all(
    fontFiles.map(async ([file, weight]) => ({
      name: "Inter",
      data: await readFile(join(process.cwd(), "assets/fonts", file)),
      weight,
      style: "normal" as const,
    })),
  );
}

/** Inter has no ↔ glyph, so it would fall back to a colour emoji; use an en dash in the image. */
export function ogText(value: string): string {
  return value.replaceAll("↔", "–");
}

interface OgProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
}

export async function renderOg({ eyebrow, title, subtitle, footer }: OgProps) {
  const fonts = await loadFonts();
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#0a0a0b",
          color: "#ededef",
          padding: 72,
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#a1a1aa" }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#6ee7b7" }} />
          <div>{ogText(eyebrow)}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05 }}>{ogText(title)}</div>
          <div style={{ fontSize: 32, color: "#a1a1aa", lineHeight: 1.4, maxWidth: 940 }}>{ogText(subtitle)}</div>
        </div>
        <div style={{ fontSize: 26, color: "#8a8a93" }}>{ogText(footer)}</div>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );
}
