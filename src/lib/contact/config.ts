export interface ContactFormConfig {
  apiKey: string;
  to: string;
  from: string;
  turnstileSecret: string;
  turnstileSiteKey: string;
  turnstileScriptUrl: string;
  emailApiUrl: string;
  verifyUrl: string;
}

const DEFAULT_EMAIL_API_URL = "https://api.resend.com/emails";
const DEFAULT_SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js";
const DEFAULT_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function value(raw: string | undefined): string | null {
  const trimmed = raw?.trim();
  return trimmed ? trimmed : null;
}

export function getContactFormConfig(env: Record<string, string | undefined> = process.env): ContactFormConfig | null {
  const apiKey = value(env.RESEND_API_KEY);
  const to = value(env.CONTACT_TO_EMAIL);
  const from = value(env.CONTACT_FROM_EMAIL);
  const turnstileSecret = value(env.TURNSTILE_SECRET_KEY);
  const turnstileSiteKey = value(env.TURNSTILE_SITE_KEY);
  if (!apiKey || !to || !from || !turnstileSecret || !turnstileSiteKey) return null;
  // The overrides exist for the local test stub. In production they would let a stray variable send the API key to
  // another host or put a foreign script on the page, so they are not read there.
  const override = (name: string) => (env.NODE_ENV === "production" ? null : value(env[name]));
  return {
    apiKey,
    to,
    from,
    turnstileSecret,
    turnstileSiteKey,
    turnstileScriptUrl: override("CONTACT_TURNSTILE_SCRIPT_URL") ?? DEFAULT_SCRIPT_URL,
    emailApiUrl: override("CONTACT_EMAIL_API_URL") ?? DEFAULT_EMAIL_API_URL,
    verifyUrl: override("CONTACT_TURNSTILE_VERIFY_URL") ?? DEFAULT_VERIFY_URL,
  };
}
