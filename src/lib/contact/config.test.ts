import { describe, expect, it } from "vitest";
import { getContactFormConfig } from "@/lib/contact/config";

const all = {
  RESEND_API_KEY: "re_test",
  CONTACT_TO_EMAIL: "owner@example.com",
  CONTACT_FROM_EMAIL: "site@example.com",
  TURNSTILE_SECRET_KEY: "secret_test",
  TURNSTILE_SITE_KEY: "site_test",
};

describe("getContactFormConfig", () => {
  it("is null when nothing is configured", () => {
    expect(getContactFormConfig({})).toBeNull();
  });

  it("is null when any required variable is empty or blank", () => {
    expect(getContactFormConfig({ ...all, TURNSTILE_SECRET_KEY: "" })).toBeNull();
    expect(getContactFormConfig({ ...all, RESEND_API_KEY: "  " })).toBeNull();
    expect(getContactFormConfig({ ...all, CONTACT_TO_EMAIL: undefined })).toBeNull();
  });

  it("returns the values with default endpoints", () => {
    expect(getContactFormConfig(all)).toEqual({
      apiKey: "re_test",
      to: "owner@example.com",
      from: "site@example.com",
      turnstileSecret: "secret_test",
      turnstileSiteKey: "site_test",
      turnstileScriptUrl: "https://challenges.cloudflare.com/turnstile/v0/api.js",
      emailApiUrl: "https://api.resend.com/emails",
      verifyUrl: "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    });
  });

  const overrides = {
    CONTACT_EMAIL_API_URL: "http://localhost:9/mail",
    CONTACT_TURNSTILE_VERIFY_URL: "http://localhost:9/verify",
    CONTACT_TURNSTILE_SCRIPT_URL: "http://localhost:9/widget.js",
  };

  it.each(["development", "test", undefined])("honours endpoint overrides when NODE_ENV is %s", (nodeEnv) => {
    expect(getContactFormConfig({ ...all, ...overrides, NODE_ENV: nodeEnv })).toMatchObject({
      emailApiUrl: "http://localhost:9/mail",
      verifyUrl: "http://localhost:9/verify",
      turnstileScriptUrl: "http://localhost:9/widget.js",
    });
  });

  it("ignores every endpoint override in production, so the key and the script cannot be redirected", () => {
    expect(getContactFormConfig({ ...all, ...overrides, NODE_ENV: "production" })).toMatchObject({
      emailApiUrl: "https://api.resend.com/emails",
      verifyUrl: "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      turnstileScriptUrl: "https://challenges.cloudflare.com/turnstile/v0/api.js",
    });
  });
});
