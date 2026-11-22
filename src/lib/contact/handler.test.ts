import { describe, expect, it } from "vitest";
import { createContactHandler, type LogFailure } from "@/lib/contact/handler";
import { HONEYPOT_FIELD } from "@/lib/contact/schema";
import type { ContactFormConfig } from "@/lib/contact/config";

const cfg: ContactFormConfig = {
  apiKey: "re_test",
  to: "owner@example.com",
  from: "site@example.com",
  turnstileSecret: "secret_test",
  turnstileSiteKey: "site_test",
  turnstileScriptUrl: "https://widget.example.com/api.js",
  emailApiUrl: "https://mail.example.test/emails",
  verifyUrl: "https://verify.example.test/siteverify",
};

const good = {
  name: "Lan",
  company: "Nội thất An",
  reply: "lan@example.com",
  kind: "web",
  message: "Cần website bán hàng có thanh toán.",
  timeline: "2 tháng",
  locale: "vi",
  token: "tok",
};

interface Setup {
  handler: (request: Request) => Promise<Response>;
  urls: string[];
  logs: [string, string][];
}

function setup(opts: { config?: ContactFormConfig | null; verify?: () => Response; mail?: () => Response } = {}): Setup {
  const urls: string[] = [];
  const fetchImpl = (async (input: RequestInfo | URL) => {
    const url = String(input);
    urls.push(url);
    if (url === cfg.verifyUrl) return (opts.verify ?? (() => Response.json({ success: true })))();
    return (opts.mail ?? (() => Response.json({ id: "1" })))();
  }) as typeof fetch;
  const config = opts.config === undefined ? cfg : opts.config;
  const logs: [string, string][] = [];
  const log: LogFailure = (message, cause) => logs.push([message, cause]);
  return { handler: createContactHandler(() => config, fetchImpl, log), urls, logs };
}

function post(body: unknown, headers: Record<string, string> = { "content-type": "application/json" }): Request {
  return new Request("https://site.test/api/contact", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function json(res: Response): Promise<unknown> {
  return res.json();
}

describe("createContactHandler", () => {
  it("returns 404 unavailable when the form is not configured", async () => {
    const { handler, urls } = setup({ config: null });
    const res = await handler(post(good));
    expect(res.status).toBe(404);
    expect(await json(res)).toEqual({ ok: false, error: "unavailable" });
    expect(urls).toEqual([]);
  });

  it("returns 415 for a non-JSON content type", async () => {
    const { handler } = setup();
    const res = await handler(post(good, { "content-type": "text/plain" }));
    expect(res.status).toBe(415);
    expect(await json(res)).toEqual({ ok: false, error: "unsupported" });
  });

  it("returns 415 when the content type is missing", async () => {
    const { handler } = setup();
    const res = await handler(post(good, {}));
    expect(res.status).toBe(415);
  });

  it("accepts a JSON content type with a charset parameter", async () => {
    const { handler } = setup();
    const res = await handler(post(good, { "content-type": "application/json; charset=utf-8" }));
    expect(res.status).toBe(200);
  });

  it("returns 413 for a 50 KB body without calling any provider", async () => {
    const { handler, urls } = setup();
    const res = await handler(post({ ...good, message: "x".repeat(50 * 1024) }));
    expect(res.status).toBe(413);
    expect(await json(res)).toEqual({ ok: false, error: "too_large" });
    expect(urls).toEqual([]);
  });

  it("caps the stream even when Content-Length is absent or lying", async () => {
    const { handler, urls } = setup();
    const chunk = new TextEncoder().encode("x".repeat(4096));
    let sent = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        sent += 1;
        if (sent > 100) controller.close();
        else controller.enqueue(chunk);
      },
    });
    const req = new Request("https://site.test/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "content-length": "10" },
      body: stream,
      duplex: "half",
    } as RequestInit);
    const res = await handler(req);
    expect(res.status).toBe(413);
    expect(sent).toBeLessThan(10);
    expect(urls).toEqual([]);
  });

  it("returns 400 for malformed JSON and for a non-object body", async () => {
    const { handler, urls } = setup();
    for (const body of ["{not json", "[]", "null", ""]) {
      const res = await handler(post(body));
      expect(res.status).toBe(400);
      expect(await json(res)).toEqual({ ok: false, error: "invalid", fields: [] });
    }
    expect(urls).toEqual([]);
  });

  it("returns 400 with the failing fields and sends nothing", async () => {
    const { handler, urls } = setup();
    const res = await handler(post({ ...good, name: "", message: "x" }));
    expect(res.status).toBe(400);
    expect(await json(res)).toEqual({ ok: false, error: "invalid", fields: ["name", "message"] });
    expect(urls).toEqual([]);
  });

  it("answers 200 for a filled honeypot and sends nothing", async () => {
    const { handler, urls } = setup();
    const res = await handler(post({ ...good, [HONEYPOT_FIELD]: "http://spam" }));
    expect(res.status).toBe(200);
    expect(await json(res)).toEqual({ ok: true });
    expect(urls).toEqual([]);
  });

  it("returns 403 for a missing, malformed or rejected token", async () => {
    const noToken = { ...good, token: undefined };
    for (const body of [noToken, { ...good, token: "" }, { ...good, token: 5 }, { ...good, token: "x".repeat(2049) }]) {
      const { handler, urls } = setup();
      const res = await handler(post(body));
      expect(res.status).toBe(403);
      expect(await json(res)).toEqual({ ok: false, error: "verification" });
      expect(urls).toEqual([]);
    }
    const { handler, urls } = setup({ verify: () => Response.json({ success: false }) });
    const res = await handler(post(good));
    expect(res.status).toBe(403);
    expect(urls).toEqual([cfg.verifyUrl]);
  });

  it("returns 403 when the verification provider fails", async () => {
    const { handler } = setup({ verify: () => new Response("x", { status: 500 }) });
    expect((await handler(post(good))).status).toBe(403);
  });

  it("returns 502 with exactly the delivery body when the email API fails", async () => {
    const { handler } = setup({ mail: () => new Response("secret upstream detail", { status: 500 }) });
    const res = await handler(post(good));
    expect(res.status).toBe(502);
    expect(await res.text()).toBe('{"ok":false,"error":"delivery"}');
  });

  it("returns 200 and sends one email on success", async () => {
    const { handler, urls } = setup();
    const res = await handler(post(good));
    expect(res.status).toBe(200);
    expect(await json(res)).toEqual({ ok: true });
    expect(urls).toEqual([cfg.verifyUrl, cfg.emailApiUrl]);
  });

  it("returns 403 when the verification fetch throws", async () => {
    const throwing = (async () => {
      throw new Error("down");
    }) as typeof fetch;
    const res = await createContactHandler(() => cfg, throwing)(post(good));
    expect(res.status).toBe(403);
  });

  describe("failure log", () => {
    // Every value the visitor or the operator supplied that must never reach the log.
    const secrets = [good.name, good.company, good.reply, good.message, good.timeline, good.token, cfg.apiKey, cfg.turnstileSecret, cfg.to, cfg.from];

    it("records a failed delivery with a fixed message and the upstream status only", async () => {
      const { handler, logs } = setup({ mail: () => new Response(`upstream said ${good.message} ${cfg.apiKey}`, { status: 429 }) });
      expect((await handler(post(good))).status).toBe(502);
      expect(logs).toEqual([["Contact form: email delivery failed", "HTTP 429"]]);
      for (const secret of secrets) expect(JSON.stringify(logs)).not.toContain(secret);
    });

    it("records a failed verification call with the upstream status only", async () => {
      const { handler, logs } = setup({ verify: () => new Response("x", { status: 500 }) });
      expect((await handler(post(good))).status).toBe(403);
      expect(logs).toEqual([["Contact form: Turnstile verification call failed", "HTTP 500"]]);
    });

    it("records a thrown error by its class, without its message", async () => {
      const throwing = (async () => {
        throw new TypeError(`connect failed for ${good.message} with ${cfg.apiKey}`);
      }) as typeof fetch;
      const logs: [string, string][] = [];
      const handler = createContactHandler(() => cfg, throwing, (message, cause) => logs.push([message, cause]));
      expect((await handler(post(good))).status).toBe(403);
      expect(logs).toEqual([["Contact form: Turnstile verification call failed", "TypeError"]]);
      for (const secret of secrets) expect(JSON.stringify(logs)).not.toContain(secret);
    });

    it("stays silent when the visitor merely fails the challenge, is spam or sends an invalid form", async () => {
      const failed = setup({ verify: () => Response.json({ success: false }) });
      expect((await failed.handler(post(good))).status).toBe(403);
      const spam = setup();
      await spam.handler(post({ ...good, [HONEYPOT_FIELD]: "x" }));
      const invalid = setup();
      await invalid.handler(post({ ...good, name: "" }));
      expect([failed.logs, spam.logs, invalid.logs]).toEqual([[], [], []]);
    });

    it("stays silent on success", async () => {
      const { handler, logs } = setup();
      await handler(post(good));
      expect(logs).toEqual([]);
    });
  });
});
