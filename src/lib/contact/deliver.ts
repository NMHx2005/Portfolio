import type { ContactFormConfig } from "@/lib/contact/config";
import type { ContactEmail } from "@/lib/contact/email";

// A hanging provider must not hang the function.
const TIMEOUT_MS = 8000;

// What the owner can act on is who failed and how: a status code or an error class, never anything the visitor sent.
export type ReportFailure = (cause: string) => void;

const statusCause = (status: number) => `HTTP ${status}`;
const errorCause = (error: unknown) => (error instanceof Error ? error.name : "unknown error");

export async function verifyTurnstile(
  token: string,
  cfg: ContactFormConfig,
  fetchImpl: typeof fetch = fetch,
  report: ReportFailure = () => undefined,
): Promise<boolean> {
  try {
    const res = await fetchImpl(cfg.verifyUrl, {
      method: "POST",
      body: new URLSearchParams({ secret: cfg.turnstileSecret, response: token }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      report(statusCause(res.status));
      return false;
    }
    const data: unknown = await res.json();
    return typeof data === "object" && data !== null && (data as { success?: unknown }).success === true;
  } catch (error) {
    report(errorCause(error));
    return false;
  }
}

export async function sendEmail(
  email: ContactEmail,
  cfg: ContactFormConfig,
  fetchImpl: typeof fetch = fetch,
  report: ReportFailure = () => undefined,
): Promise<boolean> {
  try {
    const res = await fetchImpl(cfg.emailApiUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: cfg.from,
        to: cfg.to,
        subject: email.subject,
        text: email.text,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) report(statusCause(res.status));
    return res.ok;
  } catch (error) {
    report(errorCause(error));
    return false;
  }
}
