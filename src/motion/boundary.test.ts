import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";

const src = join(process.cwd(), "src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(name) ? [path] : [];
  });
}

// `from "x"`, a side-effect `import "x"`, `import("x")` and `require("x")`, whatever else is on the line.
const specifier = String.raw`(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)["']`;
const libraryImport = new RegExp(`${specifier}(?:gsap|lenis)(?:["'/])`);
const motionPath = String.raw`["'](?:@/|(?:\.\./)+)motion/([^"']+)["']`;
const staticMotionImport = new RegExp(String.raw`^\s*(?:import|export)\b[^;]*?\bfrom\s*${motionPath}|^\s*import\s*${motionPath}`, "gm");
const dynamicMotionImport = /\bimport\s*\(\s*["'](?:@\/|(?:\.\.\/)+)motion\/([^"']+)["']\s*\)/g;

const staticMotionTargets = (text: string) => [...text.matchAll(staticMotionImport)].map((match) => match[1] ?? match[2]);
const dynamicMotionTargets = (text: string) => [...text.matchAll(dynamicMotionImport)].map((match) => match[1]);

const outsideMotion = sourceFiles(src).filter((file) => !relative(src, file).startsWith(`motion${sep}`));

describe("the detectors", () => {
  it("catch every way of importing gsap or lenis", () => {
    for (const line of [
      'import { gsap } from "gsap";',
      "import Lenis from 'lenis';",
      'import type { Context } from "gsap";',
      'import { ScrollTrigger } from "gsap/ScrollTrigger";',
      'const { gsap } = await import("gsap");',
      "const Lenis = import('lenis')",
      'import "lenis/dist/lenis.css";',
      'export { gsap } from "gsap";',
      'const gsap = require("gsap");',
      'import {\n  gsap,\n} from "gsap";',
    ]) {
      expect(libraryImport.test(line), line).toBe(true);
    }
    for (const line of ['import { gsapLike } from "@/lib/gsap-like";', 'const word = "gsap";']) {
      expect(libraryImport.test(line), line).toBe(false);
    }
  });

  it("catch static and dynamic imports of the motion modules", () => {
    expect(staticMotionTargets('import { startMotion } from "@/motion/engine";')).toEqual(["engine"]);
    expect(staticMotionTargets('import type { MotionContext } from "@/motion/engine";')).toEqual(["engine"]);
    expect(staticMotionTargets("import { start } from '../motion/smooth-scroll';")).toEqual(["smooth-scroll"]);
    expect(staticMotionTargets('import "@/motion/engine";')).toEqual(["engine"]);
    expect(staticMotionTargets('import {\n  a,\n  b,\n} from "@/motion/engine";')).toEqual(["engine"]);
    expect(staticMotionTargets('export { x } from "@/motion/engine";')).toEqual(["engine"]);
    expect(staticMotionTargets('import { motionProfile } from "@/motion/gates";')).toEqual(["gates"]);
    expect(dynamicMotionTargets('import("@/motion/engine")')).toEqual(["engine"]);
    expect(dynamicMotionTargets('const m = await import("../motion/smooth-scroll");')).toEqual(["smooth-scroll"]);
  });
});

describe("motion layer boundary", () => {
  it("lets only src/motion/ import gsap or lenis", () => {
    const offenders = outsideMotion.filter((file) => libraryImport.test(readFileSync(file, "utf8")));
    expect(offenders.map((file) => relative(src, file))).toEqual([]);
  });

  it("lets nothing outside src/motion/ import from it statically except the pure gates", () => {
    const offenders = outsideMotion.flatMap((file) =>
      staticMotionTargets(readFileSync(file, "utf8"))
        .filter((target) => target !== "gates")
        .map((target) => `${relative(src, file)} -> motion/${target}`),
    );
    expect(offenders).toEqual([]);
  });

  it("has exactly one dynamic import of a motion module outside src/motion/: the engine, in motion-root.tsx", () => {
    const found = outsideMotion.flatMap((file) =>
      dynamicMotionTargets(readFileSync(file, "utf8")).map((target) => `${relative(src, file)} -> motion/${target}`),
    );
    expect(found).toEqual([`${join("components", "motion-root.tsx")} -> motion/engine`]);
  });
});
