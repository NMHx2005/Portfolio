import { describe, expect, it } from "vitest";
import { HONEYPOT_FIELD, parseContactRequest } from "@/lib/contact/schema";

const good = {
  name: "Lan",
  company: "Nội thất An",
  reply: "0900000000",
  kind: "web",
  message: "Cần website bán hàng có thanh toán.",
  timeline: "2 tháng",
  locale: "vi",
  token: "t",
};

describe("parseContactRequest", () => {
  it("accepts a complete request and trims values", () => {
    expect(parseContactRequest({ ...good, name: "  Lan  " })).toEqual({
      ok: true,
      value: {
        name: "Lan",
        company: "Nội thất An",
        reply: "0900000000",
        kind: "web",
        message: "Cần website bán hàng có thanh toán.",
        timeline: "2 tháng",
        locale: "vi",
      },
    });
  });

  it("treats company and timeline as optional", () => {
    expect(parseContactRequest({ ...good, company: undefined, timeline: undefined })).toMatchObject({ ok: true, value: { company: "", timeline: "" } });
  });

  it("accepts a honeypot that is absent or empty", () => {
    expect(parseContactRequest({ ...good, [HONEYPOT_FIELD]: "" }).ok).toBe(true);
  });

  it("rejects blank required fields", () => {
    expect(parseContactRequest({ ...good, name: "  " })).toEqual({ ok: false, fields: ["name"] });
    expect(parseContactRequest({ ...good, reply: "ab" })).toEqual({ ok: false, fields: ["reply"] });
  });

  it("enforces message bounds", () => {
    expect(parseContactRequest({ ...good, message: "ngắn" })).toEqual({ ok: false, fields: ["message"] });
    expect(parseContactRequest({ ...good, message: "x".repeat(2001) })).toEqual({ ok: false, fields: ["message"] });
    expect(parseContactRequest({ ...good, message: "x".repeat(2000) }).ok).toBe(true);
  });

  it("enforces the other upper bounds", () => {
    expect(parseContactRequest({ ...good, name: "x".repeat(81) })).toEqual({ ok: false, fields: ["name"] });
    expect(parseContactRequest({ ...good, company: "x".repeat(121) })).toEqual({ ok: false, fields: ["company"] });
    expect(parseContactRequest({ ...good, reply: "x".repeat(121) })).toEqual({ ok: false, fields: ["reply"] });
    expect(parseContactRequest({ ...good, timeline: "x".repeat(121) })).toEqual({ ok: false, fields: ["timeline"] });
  });

  it("rejects an unknown kind and an unknown locale", () => {
    expect(parseContactRequest({ ...good, kind: "crypto" })).toEqual({ ok: false, fields: ["kind"] });
    expect(parseContactRequest({ ...good, locale: "fr" })).toEqual({ ok: false, fields: [] });
  });

  it("rejects control characters in single-line fields", () => {
    expect(parseContactRequest({ ...good, name: "Lan\r\nBcc: a@b.c" })).toEqual({ ok: false, fields: ["name"] });
    expect(parseContactRequest({ ...good, reply: "a@b.c\nX: y" })).toEqual({ ok: false, fields: ["reply"] });
    expect(parseContactRequest({ ...good, company: "a\u2028b" })).toEqual({ ok: false, fields: ["company"] });
    expect(parseContactRequest({ ...good, timeline: "a\u0000b" })).toEqual({ ok: false, fields: ["timeline"] });
  });

  it("rejects zero-width and bidi characters in single-line fields", () => {
    for (const ch of ["\u200b", "\u200d", "\u200f", "\u202e", "\u2066", "\u2069", "\ufeff"]) {
      expect(parseContactRequest({ ...good, name: `La${ch}n` })).toEqual({ ok: false, fields: ["name"] });
      expect(parseContactRequest({ ...good, reply: `a@b${ch}.co` })).toEqual({ ok: false, fields: ["reply"] });
    }
  });

  it("rejects bidi controls in the message but keeps emoji joiners, tabs and newlines", () => {
    for (const ch of ["\u202a", "\u202e", "\u2066", "\u2069"]) {
      expect(parseContactRequest({ ...good, message: `Xin chào ${ch} bạn nhé` })).toEqual({ ok: false, fields: ["message"] });
    }
    expect(parseContactRequest({ ...good, message: "Xin chào \u{1F468}\u200D\u{1F4BB}\tbạn\nnhé" }).ok).toBe(true);
  });

  it("allows line breaks in the message but not other control characters", () => {
    expect(parseContactRequest({ ...good, message: "Dòng một.\nDòng hai.\r\n" }).ok).toBe(true);
    expect(parseContactRequest({ ...good, message: "Xin chào\u0000 bạn" })).toEqual({ ok: false, fields: ["message"] });
  });

  it("reports every failing field", () => {
    expect(parseContactRequest({ ...good, name: "", message: "x" })).toEqual({ ok: false, fields: ["name", "message"] });
  });

  it("rejects non-string field values", () => {
    expect(parseContactRequest({ ...good, name: 1 })).toEqual({ ok: false, fields: ["name"] });
    expect(parseContactRequest({ ...good, company: ["x"] })).toEqual({ ok: false, fields: ["company"] });
  });

  it("flags a filled honeypot as spam", () => {
    expect(parseContactRequest({ ...good, [HONEYPOT_FIELD]: "http://spam" })).toEqual({ ok: false, spam: true });
    expect(parseContactRequest({ ...good, [HONEYPOT_FIELD]: 1 })).toEqual({ ok: false, spam: true });
  });

  it("does not take a value in an autofill-prone field such as `website` for spam", () => {
    expect(HONEYPOT_FIELD).not.toMatch(/website|url|email|phone|name|address|company/);
    expect(parseContactRequest({ ...good, website: "https://lan.example.com" }).ok).toBe(true);
  });

  it("rejects input that is not an object", () => {
    for (const bad of [null, "text", 42, [], { name: 1 }]) expect(parseContactRequest(bad).ok).toBe(false);
  });
});
