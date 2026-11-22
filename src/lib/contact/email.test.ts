import { describe, expect, it } from "vitest";
import { buildContactEmail } from "@/lib/contact/email";
import type { ContactRequest } from "@/lib/contact/schema";

const value: ContactRequest = {
  name: "Lan",
  company: "Nội thất An",
  reply: "lan@example.com",
  kind: "web",
  message: "Cần website bán hàng.",
  timeline: "2 tháng",
  locale: "vi",
};

describe("buildContactEmail", () => {
  it("uses a fixed subject and plain text with the raw user text", () => {
    const mail = buildContactEmail({ ...value, name: "Lan <script>" });
    expect(mail.subject).toBe("Yêu cầu mới từ website: Website");
    expect(mail.text).toContain("Lan <script>");
    expect(mail.text).toContain("Cần website bán hàng.");
    expect(mail.replyTo).toBe("lan@example.com");
  });

  it("chooses one fixed subject per kind", () => {
    const subjects = (["web", "webapp", "mobile", "ai", "other"] as const).map(
      (kind) => buildContactEmail({ ...value, kind }).subject,
    );
    expect(new Set(subjects).size).toBe(5);
    for (const s of subjects) expect(s.startsWith("Yêu cầu mới từ website: ")).toBe(true);
  });

  it("never puts user text in the subject", () => {
    const mail = buildContactEmail({ ...value, name: "EVIL", company: "EVIL", message: "EVIL EVIL EVIL" });
    expect(mail.subject).not.toContain("EVIL");
  });

  it("sets replyTo only for a valid email address", () => {
    expect(buildContactEmail({ ...value, reply: "0900000000" }).replyTo).toBeUndefined();
    expect(buildContactEmail({ ...value, reply: "a@b" }).replyTo).toBeUndefined();
    expect(buildContactEmail({ ...value, reply: "a b@c.d" }).replyTo).toBeUndefined();
    expect(buildContactEmail({ ...value, reply: "a@b.c,d@e.f" }).replyTo).toBeUndefined();
    expect(buildContactEmail({ ...value, reply: "Evil <a@b.c>" }).replyTo).toBeUndefined();
  });

  it("sets replyTo only for a conservative ASCII address", () => {
    expect(buildContactEmail({ ...value, reply: "first.last+tag@mail.example.com" }).replyTo).toBe(
      "first.last+tag@mail.example.com",
    );
    for (const reply of ["a@b..c", "a@.b.c", "a@b", "a@-b.co", "a@b-.co", ".a@b.co", "a.@b.co", "a..b@c.co", "a@b.c1", "lân@example.com", "a@bücher.de"]) {
      expect(buildContactEmail({ ...value, reply }).replyTo, reply).toBeUndefined();
    }
    const long = `${"a".repeat(121 - "@example.com".length)}@example.com`;
    expect(long).toHaveLength(121);
    expect(buildContactEmail({ ...value, reply: long }).replyTo).toBeUndefined();
    expect(buildContactEmail({ ...value, reply: long.slice(1) }).replyTo).toBe(long.slice(1));
  });
});
