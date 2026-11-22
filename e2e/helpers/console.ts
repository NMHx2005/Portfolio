import type { ConsoleMessage } from "@playwright/test";

// The Vercel Analytics script exists only on Vercel; any other server answers it with a 404 that is not ours. That one
// request is the only console noise the specs excuse, so every other failed resource still fails them.
const analyticsScript = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/_vercel\/insights\/script\.js$/;

export const isAnalyticsScriptFailure = (message: ConsoleMessage) =>
  message.text().startsWith("Failed to load resource") && analyticsScript.test(message.location().url);

// A page that is meant to answer 404 makes the browser log that very response, against the page's own address.
export const isFailureOfDocument = (message: ConsoleMessage, documentUrl: string) =>
  message.text().startsWith("Failed to load resource") && message.location().url === documentUrl;
