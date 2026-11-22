import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { followsInThisTab, requestContactKind, takePendingContactKind, type ClickLike } from "@/lib/contact/preselect";

// The module only needs an event target; Node's own is enough.
beforeEach(() => {
  Object.assign(globalThis, { window: new EventTarget() });
});

afterEach(() => {
  takePendingContactKind();
  Reflect.deleteProperty(globalThis, "window");
});

function mountedForm() {
  const seen: unknown[] = [];
  window.addEventListener("contact:kind", (event) => {
    if (event instanceof CustomEvent) {
      seen.push(event.detail);
      event.preventDefault();
    }
  });
  return seen;
}

describe("requestContactKind", () => {
  it("tells a mounted form and leaves nothing waiting for the next one", () => {
    const seen = mountedForm();
    requestContactKind("other", 1000);
    expect(seen).toEqual(["other"]);
    expect(takePendingContactKind(1000)).toBeNull();
  });

  it("keeps the choice for a form that mounts after the navigation", () => {
    requestContactKind("other", 1000);
    expect(takePendingContactKind(1500)).toBe("other");
    expect(takePendingContactKind(1500)).toBeNull(); // handed out once
  });

  it("drops a choice nobody picked up in time", () => {
    requestContactKind("other", 1000);
    expect(takePendingContactKind(1000 + 10_001)).toBeNull();
  });

  it("keeps only the latest choice", () => {
    requestContactKind("ai", 1000);
    requestContactKind("other", 1100);
    expect(takePendingContactKind(1200)).toBe("other");
  });
});

describe("followsInThisTab", () => {
  const plain: ClickLike = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false };

  it("accepts an unmodified primary click", () => {
    expect(followsInThisTab(plain)).toBe(true);
  });

  it("rejects every click that does not navigate this tab", () => {
    const others: Partial<ClickLike>[] = [{ button: 1 }, { button: 2 }, { metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { defaultPrevented: true }];
    for (const change of others) expect(followsInThisTab({ ...plain, ...change }), JSON.stringify(change)).toBe(false);
  });
});
