import { afterEach, describe, expect, it, vi } from "vitest";
import { sendEmail, verifyTurnstile } from "@/lib/contact/deliver";
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

interface Call {
  url: string;
  init: RequestInit | undefined;
}

function stub(respond: () => Response | Promise<Response>): { fetchImpl: typeof fetch; calls: Call[] } {
  const calls: Call[] = [];
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init });
    return respond();
  }) as typeof fetch;
  return { fetchImpl, calls };
}

// Never resolves; rejects like a real fetch when its signal aborts.
function hanging(): { fetchImpl: typeof fetch; calls: Call[] } {
  const calls: Call[] = [];
  const fetchImpl = ((input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init });
    return new Promise<Response>((_resolve, reject) => {
      const abort = () => reject(new DOMException("aborted", "TimeoutError"));
      if (init?.signal?.aborted) abort();
      else init?.signal?.addEventListener("abort", abort);
    });
  }) as typeof fetch;
  return { fetchImpl, calls };
}

// AbortSignal.timeout runs on Node's own timer, which fake timers do not drive,
// so the test makes the signal it hands out already aborted.
function abortOnTimeout() {
  return vi.spyOn(AbortSignal, "timeout").mockImplementation(() => AbortSignal.abort());
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("verifyTurnstile", () => {
  it("posts secret and response as form data and returns success", async () => {
    const { fetchImpl, calls } = stub(() => Response.json({ success: true }));
    expect(await verifyTurnstile("tok", cfg, fetchImpl)).toBe(true);
    expect(calls[0]?.url).toBe(cfg.verifyUrl);
    expect(calls[0]?.init?.method).toBe("POST");
    const form = new URLSearchParams(String(calls[0]?.init?.body));
    expect(form.get("secret")).toBe("secret_test");
    expect(form.get("response")).toBe("tok");
    expect(calls[0]?.init?.signal).toBeInstanceOf(AbortSignal);
  });

  it("gives up with false when the provider hangs past the timeout", async () => {
    const timeout = abortOnTimeout();
    const { fetchImpl } = hanging();
    expect(await verifyTurnstile("tok", cfg, fetchImpl)).toBe(false);
    expect(timeout).toHaveBeenCalledWith(8000);
  });

  it("is false when the provider says success is false", async () => {
    const { fetchImpl } = stub(() => Response.json({ success: false }));
    expect(await verifyTurnstile("tok", cfg, fetchImpl)).toBe(false);
  });

  it("is false when success is not the boolean true", async () => {
    const { fetchImpl } = stub(() => Response.json({ success: "true" }));
    expect(await verifyTurnstile("tok", cfg, fetchImpl)).toBe(false);
  });

  it("is false on a non-2xx response", async () => {
    const { fetchImpl } = stub(() => Response.json({ success: true }, { status: 500 }));
    expect(await verifyTurnstile("tok", cfg, fetchImpl)).toBe(false);
  });

  it("is false when fetch throws", async () => {
    const { fetchImpl } = stub(() => {
      throw new TypeError("network");
    });
    expect(await verifyTurnstile("tok", cfg, fetchImpl)).toBe(false);
  });

  it("is false on invalid JSON", async () => {
    const { fetchImpl } = stub(() => new Response("<html>"));
    expect(await verifyTurnstile("tok", cfg, fetchImpl)).toBe(false);
  });
});

describe("sendEmail", () => {
  const email = { subject: "S", text: "T", replyTo: "lan@example.com" };

  it("posts JSON with a bearer key and reply_to", async () => {
    const { fetchImpl, calls } = stub(() => Response.json({ id: "1" }));
    expect(await sendEmail(email, cfg, fetchImpl)).toBe(true);
    expect(calls[0]?.url).toBe(cfg.emailApiUrl);
    const headers = new Headers(calls[0]?.init?.headers);
    expect(headers.get("authorization")).toBe("Bearer re_test");
    expect(headers.get("content-type")).toBe("application/json");
    expect(JSON.parse(String(calls[0]?.init?.body))).toEqual({
      from: "site@example.com",
      to: "owner@example.com",
      subject: "S",
      text: "T",
      reply_to: "lan@example.com",
    });
    expect(calls[0]?.init?.signal).toBeInstanceOf(AbortSignal);
  });

  it("gives up with false when the provider hangs past the timeout", async () => {
    const timeout = abortOnTimeout();
    const { fetchImpl } = hanging();
    expect(await sendEmail(email, cfg, fetchImpl)).toBe(false);
    expect(timeout).toHaveBeenCalledWith(8000);
  });

  it("omits reply_to when there is none", async () => {
    const { fetchImpl, calls } = stub(() => Response.json({}));
    await sendEmail({ subject: "S", text: "T" }, cfg, fetchImpl);
    expect(JSON.parse(String(calls[0]?.init?.body))).not.toHaveProperty("reply_to");
  });

  it("is false on a non-2xx response", async () => {
    const { fetchImpl } = stub(() => new Response("nope", { status: 422 }));
    expect(await sendEmail(email, cfg, fetchImpl)).toBe(false);
  });

  it("never throws", async () => {
    const { fetchImpl } = stub(() => {
      throw new Error("boom");
    });
    expect(await sendEmail(email, cfg, fetchImpl)).toBe(false);
  });
});
