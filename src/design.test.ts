import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(tsx|css)$/.test(name) && !/\.test\./.test(name) ? [path] : [];
  });
}

describe("design language", () => {
  it("is square: no rounded-* utility and no border-radius in components or styles", () => {
    const offenders = sourceFiles(join(process.cwd(), "src")).filter((file) => {
      const text = readFileSync(file, "utf8");
      return /(^|[\s"'`:])rounded(-[a-z0-9]+)?(?=[\s"'`])/.test(text) || /border-radius/.test(text);
    });
    expect(offenders).toEqual([]);
  });
});
