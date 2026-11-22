import type { ContactField, ContactKind } from "@/content/types";
import { isLocale, type Locale } from "@/lib/i18n/config";

// Not a name that autofill or a password manager targets (it filled a field called `website`, and the request was then
// silently dropped as spam).
export const HONEYPOT_FIELD = "ref_note";

export const contactKinds: readonly ContactKind[] = ["web", "webapp", "mobile", "ai", "other"];

export interface ContactRequest {
  name: string;
  company: string;
  reply: string;
  kind: ContactKind;
  message: string;
  timeline: string;
  locale: Locale;
}

export type ParseResult =
  | { ok: true; value: ContactRequest }
  | { ok: false; fields: ContactField[] }
  | { ok: false; spam: true };

// Includes NEL and the Unicode line/paragraph separators, which some mail
// systems treat as line breaks.
const LINE_CONTROL = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/;
// Zero-width and bidi controls let a name or address display as something else.
const SPOOF = /[\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/;
// The message keeps U+200D (emoji joiner) and line breaks, so only bidi controls are blocked.
const BIDI = /[\u202a-\u202e\u2066-\u2069]/;
// The message may span lines, so only tab, LF and CR are allowed through.
const TEXT_CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u2028\u2029]/;

function text(raw: unknown, min: number, max: number, multiline = false): string | null {
  if (typeof raw !== "string") return min === 0 && raw === undefined ? "" : null;
  const value = raw.trim();
  if (value.length < min || value.length > max) return null;
  const bad = multiline ? TEXT_CONTROL.test(value) || BIDI.test(value) : LINE_CONTROL.test(value) || SPOOF.test(value);
  return bad ? null : value;
}

export function parseContactRequest(input: unknown): ParseResult {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return { ok: false, fields: [] };
  const raw = input as Record<string, unknown>;

  if (raw[HONEYPOT_FIELD] !== undefined && raw[HONEYPOT_FIELD] !== "") return { ok: false, spam: true };

  const name = text(raw.name, 1, 80);
  const company = text(raw.company, 0, 120);
  const reply = text(raw.reply, 3, 120);
  const message = text(raw.message, 10, 2000, true);
  const timeline = text(raw.timeline, 0, 120);
  const kind = contactKinds.find((k) => k === raw.kind);

  const fields: ContactField[] = [];
  if (name === null) fields.push("name");
  if (company === null) fields.push("company");
  if (reply === null) fields.push("reply");
  if (kind === undefined) fields.push("kind");
  if (message === null) fields.push("message");
  if (timeline === null) fields.push("timeline");

  const locale = typeof raw.locale === "string" && isLocale(raw.locale) ? raw.locale : null;
  if (
    fields.length > 0 ||
    locale === null ||
    name === null ||
    company === null ||
    reply === null ||
    kind === undefined ||
    message === null ||
    timeline === null
  ) {
    return { ok: false, fields };
  }
  return { ok: true, value: { name, company, reply, kind, message, timeline, locale } };
}
