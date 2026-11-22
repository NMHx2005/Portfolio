import { defineConfig, devices } from "@playwright/test";

// Dev runs may reuse a running dev server. Production runs (`npm run e2e:prod`) serve the artifact that was just
// built, on their own port, and are never allowed to attach to a stray server: `e2e/server-mode.spec.ts` asserts it.
const prod = Boolean(process.env.E2E_PROD);
const PORT = prod ? 3101 : 3100;

export default defineConfig({
  testDir: "./e2e",
  // Warms every route in dev mode before the first test (a no-op for production runs).
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: true,
  // Each worker is a headless Chromium hammering one Next server; more than this starves the CPU and causes timeouts.
  workers: 4,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  webServer: [
    {
      command: prod ? `npm run start -- -p ${PORT}` : `npm run dev -- -p ${PORT}`,
      url: `http://localhost:${PORT}/vi`,
      reuseExistingServer: !prod,
      timeout: 300_000,
      // Dev runs get the form keys, pointed at the local stub; production runs get none, so they prove the no-form path.
      env: prod
        ? {}
        : {
            RESEND_API_KEY: "e2e-resend-key",
            CONTACT_TO_EMAIL: "owner@example.com",
            CONTACT_FROM_EMAIL: "form@example.com",
            TURNSTILE_SECRET_KEY: "e2e-turnstile-secret",
            TURNSTILE_SITE_KEY: "e2e-site-key",
            CONTACT_EMAIL_API_URL: "http://127.0.0.1:3198/emails",
            CONTACT_TURNSTILE_VERIFY_URL: "http://127.0.0.1:3198/verify",
            CONTACT_TURNSTILE_SCRIPT_URL: "http://127.0.0.1:3198/turnstile.js",
          },
    },
    ...(prod
      ? []
      : [
          {
            command: "node e2e/stubs/contact-stub.mjs",
            url: "http://127.0.0.1:3198/__emails",
            reuseExistingServer: true,
          },
        ]),
  ],
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
