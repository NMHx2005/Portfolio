import { describe, expect, it } from "vitest";
import { themeInitScript, themeStorageKey } from "@/lib/theme";

function run(stored: string | null | "throws") {
  const classes = new Set(["dark"]);
  const documentElement = { classList: { remove: (name: string) => classes.delete(name) } };
  const localStorage = {
    getItem: (key: string) => {
      if (stored === "throws") throw new Error("blocked");
      return key === themeStorageKey ? stored : null;
    },
  };
  new Function("document", "localStorage", themeInitScript)({ documentElement }, localStorage);
  return classes.has("dark");
}

describe("themeInitScript", () => {
  it("keeps the default dark theme when nothing is stored", () => {
    expect(run(null)).toBe(true);
  });
  it("keeps dark when dark is stored or the value is unknown", () => {
    expect(run("dark")).toBe(true);
    expect(run("system")).toBe(true);
  });
  it("removes the dark class when light is stored", () => {
    expect(run("light")).toBe(false);
  });
  it("never throws when storage is blocked, and keeps dark", () => {
    expect(run("throws")).toBe(true);
  });
});
