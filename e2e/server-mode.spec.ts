import { expect, test } from "@playwright/test";

test("production runs really hit a production server", async ({ request }) => {
  test.skip(!process.env.E2E_PROD, "only meaningful for npm run e2e:prod");
  const res = await request.get("/vi");
  // `next dev` answers with `no-store, must-revalidate`; a prerendered production page is cacheable.
  expect(res.headers()["cache-control"] ?? "").not.toContain("no-store");
});
