import type { ContactFormConfig } from "@/lib/contact/config";
import { sendEmail, verifyTurnstile } from "@/lib/contact/deliver";
import { buildContactEmail } from "@/lib/contact/email";
import { parseContactRequest } from "@/lib/contact/schema";

const MAX_BODY_BYTES = 16 * 1024;
const MAX_TOKEN_LENGTH = 2048;

function reply(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

// Reads at most MAX_BODY_BYTES; Content-Length is only a hint, so the stream itself is counted.
async function readCappedText(request: Request): Promise<string | null> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel().catch(() => undefined);
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

// A fixed message and the cause only: the log must never carry anything the visitor sent, nor a key.
export type LogFailure = (message: string, cause: string) => void;

const logToConsole: LogFailure = (message, cause) => console.error(message, cause);

export function createContactHandler(
  getConfig: () => ContactFormConfig | null,
  fetchImpl: typeof fetch,
  log: LogFailure = logToConsole,
): (request: Request) => Promise<Response> {
  return async (request) => {
    const cfg = getConfig();
    if (!cfg) return reply(404, { ok: false, error: "unavailable" });

    const type = request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
    if (type !== "application/json") return reply(415, { ok: false, error: "unsupported" });

    let raw: string | null;
    try {
      raw = await readCappedText(request);
    } catch {
      return reply(400, { ok: false, error: "invalid", fields: [] });
    }
    if (raw === null) return reply(413, { ok: false, error: "too_large" });

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return reply(400, { ok: false, error: "invalid", fields: [] });
    }

    const parsed = parseContactRequest(body);
    if (!parsed.ok) {
      if ("spam" in parsed) return reply(200, { ok: true });
      return reply(400, { ok: false, error: "invalid", fields: parsed.fields });
    }

    const token = (body as { token?: unknown }).token;
    if (typeof token !== "string" || token.length < 1 || token.length > MAX_TOKEN_LENGTH) {
      return reply(403, { ok: false, error: "verification" });
    }
    const verified = await verifyTurnstile(token, cfg, fetchImpl, (cause) => log("Contact form: Turnstile verification call failed", cause));
    if (!verified) return reply(403, { ok: false, error: "verification" });

    const sent = await sendEmail(buildContactEmail(parsed.value), cfg, fetchImpl, (cause) => log("Contact form: email delivery failed", cause));
    if (!sent) {
      return reply(502, { ok: false, error: "delivery" });
    }
    return reply(200, { ok: true });
  };
}
