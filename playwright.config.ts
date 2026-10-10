import { defineConfig, devices } from "@playwright/test";

// Dev runs may reuse a running dev server. Production runs (`npm run e2e:prod`) serve the artifact that was just
// built, on their own port, and are never allowed to attach to a stray server: `e2e/server-mode.spec.ts` asserts it.
const prod = Boolean(process.env.E2E_PROD);
const PORT = prod ? 3101 : 3100;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // Each worker is a headless Chromium hammering one Next server; more than this starves the CPU and causes timeouts.
  workers: 4,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  webServer: {
    command: prod ? `npm run start -- -p ${PORT}` : `npm run dev -- -p ${PORT}`,
    url: `http://localhost:${PORT}/vi`,
    reuseExistingServer: !prod,
    timeout: 300_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
