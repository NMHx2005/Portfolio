import type { ContactKind } from "@/content/types";

export const CONTACT_KIND_EVENT = "contact:kind";

// A link on another page (a case study) navigates to the home page, where the form is not mounted yet, so the choice
// is also remembered for the form that mounts next. A choice nobody picked up must not outlive the visit it was for.
const MAX_AGE_MS = 10_000;
let pending: { kind: ContactKind; at: number } | null = null;

export interface ClickLike {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  defaultPrevented: boolean;
}

// Only an unmodified primary click is followed in this tab. Ctrl, Cmd, Shift or a middle click open another tab or
// window, and Alt downloads: choosing a kind for the form here would then leak into a later visit.
export function followsInThisTab(click: ClickLike): boolean {
  return click.button === 0 && !click.metaKey && !click.ctrlKey && !click.shiftKey && !click.altKey && !click.defaultPrevented;
}

// The mounted form claims the event by cancelling it; if nobody does, the choice waits for the next form.
export function requestContactKind(kind: ContactKind, now: number = Date.now()): void {
  const event = new CustomEvent(CONTACT_KIND_EVENT, { detail: kind, cancelable: true });
  pending = window.dispatchEvent(event) ? { kind, at: now } : null;
}

export function takePendingContactKind(now: number = Date.now()): ContactKind | null {
  const found = pending && now - pending.at <= MAX_AGE_MS ? pending.kind : null;
  pending = null;
  return found;
}
