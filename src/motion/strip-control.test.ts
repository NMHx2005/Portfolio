import { describe, expect, it } from "vitest";
import { createPauseControl, stripHeld, type PauseButton, type StripHolds } from "./strip-control";

const clear: StripHolds = { hovering: false, focused: false, inView: true, documentHidden: false };

function fakeButton() {
  const attrs = new Map([
    ["aria-pressed", "false"],
    ["aria-label", "Pause"],
  ]);
  const listeners = new Set<() => void>();
  const button: PauseButton = {
    hidden: true,
    setAttribute: (name, value) => void attrs.set(name, value),
    addEventListener: (_type, listener) => void listeners.add(listener),
    removeEventListener: (_type, listener) => void listeners.delete(listener),
  };
  return { button, attrs, listeners, click: () => [...listeners].forEach((listener) => listener()) };
}

describe("stripHeld", () => {
  it("holds for each automatic reason alone", () => {
    expect(stripHeld(false, clear)).toBe(false);
    expect(stripHeld(false, { ...clear, hovering: true })).toBe(true);
    expect(stripHeld(false, { ...clear, focused: true })).toBe(true);
    expect(stripHeld(false, { ...clear, inView: false })).toBe(true);
    expect(stripHeld(false, { ...clear, documentHidden: true })).toBe(true);
  });

  it("keeps a visitor's pause whatever the automatic holds do, so none of them can restart the strip", () => {
    const sequence: StripHolds[] = [
      clear,
      { ...clear, hovering: true },
      clear, // pointer left
      { ...clear, focused: true },
      clear, // focus left
      { ...clear, inView: false },
      { ...clear, inView: true }, // scrolled back
      { ...clear, documentHidden: true },
      clear, // tab shown again
    ];
    for (const holds of sequence) expect(stripHeld(true, holds)).toBe(true);
  });
});

describe("createPauseControl", () => {
  it("shows the button and toggles the pause; only aria-pressed changes, never the accessible name", () => {
    const { button, attrs, click } = fakeButton();
    const control = createPauseControl(button);
    expect(button.hidden).toBe(false);
    expect(control.isPaused()).toBe(false);
    expect(attrs.get("aria-pressed")).toBe("false");

    click();
    expect(control.isPaused()).toBe(true);
    expect(attrs.get("aria-pressed")).toBe("true");
    expect(attrs.get("aria-label")).toBe("Pause");

    click();
    expect(control.isPaused()).toBe(false);
    expect(attrs.get("aria-pressed")).toBe("false");
    expect(attrs.get("aria-label")).toBe("Pause");
  });

  it("rolls back to the server markup: hidden, not pressed, no listener, no pause", () => {
    const { button, attrs, listeners, click } = fakeButton();
    const control = createPauseControl(button);
    click();
    control.release();

    expect(button.hidden).toBe(true);
    expect(attrs.get("aria-pressed")).toBe("false");
    expect(attrs.get("aria-label")).toBe("Pause");
    expect(listeners.size).toBe(0);
    expect(control.isPaused()).toBe(false);
    click(); // no listener is left, so a late click changes nothing
    expect(attrs.get("aria-pressed")).toBe("false");
  });
});
