import { describe, expect, it } from "vitest";
import { copyText } from "@/lib/clipboard";

describe("copyText", () => {
  it("reports copied when the write succeeds", async () => {
    const written: string[] = [];
    const result = await copyText("a@b.c", async (t) => void written.push(t), () => true);
    expect(result).toBe("copied");
    expect(written).toEqual(["a@b.c"]);
  });

  it("reports failed when the write is rejected", async () => {
    const result = await copyText("x", () => Promise.reject(new Error("denied")), () => true);
    expect(result).toBe("failed");
  });

  it("reports failed when the Clipboard API throws synchronously", async () => {
    const result = await copyText("x", () => {
      throw new TypeError("clipboard is undefined");
    }, () => true);
    expect(result).toBe("failed");
  });

  it("reports stale when the context ended while the write was pending", async () => {
    let current = true;
    let finish!: () => void;
    const pending = copyText("x", () => new Promise<void>((resolve) => (finish = resolve)), () => current);
    current = false;
    finish();
    expect(await pending).toBe("stale");
  });

  it("reports stale even when the late write fails", async () => {
    let current = true;
    let fail!: (error: Error) => void;
    const pending = copyText("x", () => new Promise<void>((_, reject) => (fail = reject)), () => current);
    current = false;
    fail(new Error("late"));
    expect(await pending).toBe("stale");
  });
});
