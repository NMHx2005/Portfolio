import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { frames } from "./helpers/scroll";

test.skip(!!process.env.E2E_PROD, "the production build has no form keys");

const STUB = "http://127.0.0.1:3198";
// The first request compiles the route in dev mode while other workers load the same server.
const SEND_TIMEOUT = 20_000;

// Two projects run this file in parallel against one stub, so every test tags its email with its own marker.
let marker = "";

// Compile the page and the endpoint before any test types into the form: in dev mode the first compile can
// hot-reload the page and wipe a request that is already in flight.
test.beforeAll(async ({ request }) => {
  await request.get("/vi");
  await request.post("/api/contact", { data: {} });
});

test.beforeEach(async ({ page, request }, info) => {
  marker = `m-${info.project.name}-${info.testId}`;
  await request.post(`${STUB}/__reset`, { data: { marker } });
  // The stub widget reads this to find its marker-scoped token delay.
  await page.addInitScript((value) => Object.assign(window, { __stubMarker: value }), marker);
});

async function emails(request: import("@playwright/test").APIRequestContext) {
  return (await (await request.get(`${STUB}/__emails?marker=${marker}`)).json()) as Record<string, unknown>[];
}

function countPosts(page: Page) {
  const posts: string[] = [];
  page.on("request", (req) => {
    if (req.method() === "POST" && new URL(req.url()).pathname === "/api/contact") posts.push(req.url());
  });
  return posts;
}

async function openForm(page: Page) {
  await page.goto("/vi");
  const form = page.locator("#contact form");
  await form.scrollIntoViewIfNeeded();
  return form;
}

async function fillValid(form: ReturnType<Page["locator"]>) {
  await form.getByLabel("Tên của bạn", { exact: true }).fill("Lan");
  await form.getByLabel("Số điện thoại, Zalo hoặc email để tôi liên hệ lại", { exact: true }).fill("lan@example.com");
  await form.getByLabel("Loại việc", { exact: true }).selectOption({ label: "App iOS và Android" });
  await form.getByLabel("Bạn cần làm gì", { exact: true }).fill(`Cần một app cho cửa hàng ${marker}`);
}

test("a valid request sends exactly one email and confirms", async ({ page, request }) => {
  const form = await openForm(page);
  await fillValid(form);
  await form.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(form.getByRole("status")).toContainText("Đã gửi", { timeout: SEND_TIMEOUT });
  const mails = await emails(request);
  expect(mails).toHaveLength(1);
  expect(mails[0]).toMatchObject({ to: "owner@example.com", reply_to: "lan@example.com" });
  await expect(form.getByLabel("Tên của bạn", { exact: true })).toHaveValue("");
});

test("double click while the provider is slow still sends one email", async ({ page, request }) => {
  await request.post(`${STUB}/__delay`, { data: { ms: 1500, marker } });
  const posts = countPosts(page);
  const form = await openForm(page);
  await fillValid(form);
  const submit = form.getByRole("button", { name: "Gửi yêu cầu" });
  await submit.dblclick();
  await expect(form.getByRole("button", { name: "Đang gửi…" })).toBeDisabled();
  await expect(form.getByRole("status")).toContainText("Đã gửi", { timeout: SEND_TIMEOUT });
  expect(posts).toHaveLength(1); // the browser sent one request, so no late second email can follow
  expect(await emails(request)).toHaveLength(1);
});

test("the submit button keeps keyboard focus while sending and ignores a second Enter", async ({ page, request }) => {
  await request.post(`${STUB}/__delay`, { data: { ms: 1500, marker } });
  const posts = countPosts(page);
  const form = await openForm(page);
  await fillValid(form);
  await form.getByRole("button", { name: "Gửi yêu cầu" }).focus();
  await page.keyboard.press("Enter");
  const sending = form.getByRole("button", { name: "Đang gửi…" });
  await expect(sending).toHaveAttribute("aria-disabled", "true");
  await expect(sending).not.toHaveAttribute("disabled", /.*/);
  await expect(sending).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(form.getByRole("status")).toContainText("Đã gửi", { timeout: SEND_TIMEOUT });
  await expect(form.getByRole("button", { name: "Gửi yêu cầu" })).toBeFocused();
  expect(posts).toHaveLength(1);
  expect(await emails(request)).toHaveLength(1);
});

test("a filled honeypot is accepted silently and sends nothing; the honeypot is out of reach and not named like a website field", async ({
  page,
  request,
}) => {
  const form = await openForm(page);
  const trap = form.locator('input[name="ref_note"]');
  await expect(trap).toHaveAttribute("autocomplete", "off");
  await expect(trap).toHaveAttribute("tabindex", "-1");
  await expect(trap.locator("xpath=..")).toHaveAttribute("aria-hidden", "true");
  await expect(form.locator('input[name="website"]')).toHaveCount(0);

  await fillValid(form);
  await trap.fill("filled by a bot");
  await form.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(form.getByRole("status")).toContainText("Đã gửi", { timeout: SEND_TIMEOUT });
  expect(await emails(request)).toHaveLength(0);
});

test("a provider failure keeps what was typed and points to the other channels", async ({ page, request }) => {
  await request.post(`${STUB}/__fail`, { data: { marker } });
  const form = await openForm(page);
  await fillValid(form);
  await form.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(form.getByRole("status")).toContainText("Zalo");
  await expect(form.getByRole("status")).toContainText("0971 084 430");
  await expect(form.getByLabel("Bạn cần làm gì", { exact: true })).toHaveValue(`Cần một app cho cửa hàng ${marker}`);
  await expect(form.getByRole("button", { name: "Gửi yêu cầu" })).toBeEnabled();
  expect(await emails(request)).toHaveLength(0);
});

test("a blocked Turnstile script fails visibly, and unblocking it lets the next submit through without a reload", async ({
  page,
  request,
}) => {
  await page.route("**/turnstile.js*", (route) => route.abort());
  const form = await openForm(page);
  await fillValid(form);
  await form.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(form.getByRole("status")).toContainText("Zalo");
  await expect(form.getByRole("button", { name: "Gửi yêu cầu" })).toBeEnabled();
  expect(await emails(request)).toHaveLength(0);

  await page.unroute("**/turnstile.js*");
  await form.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(form.getByRole("status")).toContainText("Đã gửi", { timeout: SEND_TIMEOUT });
  expect(await emails(request)).toHaveLength(1);
});

test("submitting before the token arrives waits in the sending state and then sends exactly one email", async ({
  page,
  request,
}) => {
  await request.post(`${STUB}/__token-delay`, { data: { ms: 3000, marker } });
  const posts = countPosts(page);
  const form = await openForm(page);
  await fillValid(form);
  await form.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(form.getByRole("button", { name: "Đang gửi…" })).toBeDisabled();
  expect(posts).toHaveLength(0); // nothing is sent until the token exists
  await expect(form.getByRole("status")).toContainText("Đã gửi", { timeout: SEND_TIMEOUT });
  expect(posts).toHaveLength(1);
  expect(await emails(request)).toHaveLength(1);
});

test("after a failure an immediate retry waits for the fresh token and succeeds", async ({ page, request }) => {
  await request.post(`${STUB}/__token-delay`, { data: { ms: 1000, marker } });
  await request.post(`${STUB}/__fail`, { data: { marker } });
  const form = await openForm(page);
  await fillValid(form);
  await form.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(form.getByRole("status")).toContainText("Zalo", { timeout: SEND_TIMEOUT });

  await request.post(`${STUB}/__fail`, { data: { marker, fail: false } });
  await form.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(form.getByRole("button", { name: "Đang gửi…" })).toBeDisabled();
  await expect(form.getByRole("status")).toContainText("Đã gửi", { timeout: SEND_TIMEOUT });
  expect(await emails(request)).toHaveLength(1);
});

const failures: [string, { status: number; contentType: string; body: string } | "abort"][] = [
  ["403 verification", { status: 403, contentType: "application/json", body: '{"ok":false,"error":"verification"}' }],
  ["413 too large", { status: 413, contentType: "application/json", body: '{"ok":false,"error":"too_large"}' }],
  ["502 delivery", { status: 502, contentType: "application/json", body: '{"ok":false,"error":"delivery"}' }],
  ["400 without fields", { status: 400, contentType: "application/json", body: '{"ok":false,"error":"invalid","fields":[]}' }],
  ["an HTML error page", { status: 200, contentType: "text/html", body: "<html>Bad gateway</html>" }],
  ["a network error", "abort"],
];

for (const [title, reply] of failures) {
  test(`${title} shows the failure message and keeps what was typed`, async ({ page }) => {
    await page.route("**/api/contact", (route) => (reply === "abort" ? route.abort() : route.fulfill(reply)));
    const form = await openForm(page);
    await fillValid(form);
    await form.getByRole("button", { name: "Gửi yêu cầu" }).click();
    await expect(form.getByRole("status")).toContainText("Zalo");
    await expect(form.getByLabel("Tên của bạn", { exact: true })).toHaveValue("Lan");
    await expect(form.getByRole("button", { name: "Gửi yêu cầu" })).toBeEnabled();
    await expect(form.locator("[aria-invalid=true]")).toHaveCount(0);
  });
}

test("a server 400 names the fields, ignores unknown ones and moves focus to the first", async ({ page }) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: '{"ok":false,"error":"invalid","fields":["reply","bogus","message"]}',
    }),
  );
  const form = await openForm(page);
  await fillValid(form);
  await form.getByRole("button", { name: "Gửi yêu cầu" }).click();
  const reply = form.getByLabel("Số điện thoại, Zalo hoặc email để tôi liên hệ lại", { exact: true });
  await expect(reply).toBeFocused();
  await expect(form.locator("[aria-invalid=true]")).toHaveCount(2);
  await expect(reply).toHaveAttribute("aria-describedby", "contact-reply-error");
  await expect(form.locator("#contact-reply-error")).toHaveText("Vui lòng nhập số điện thoại, Zalo hoặc email hợp lệ.");
  await expect(form.getByLabel("Bạn cần làm gì", { exact: true })).toHaveAttribute("aria-describedby", "contact-message-error");
  await expect(form.getByLabel("Tên của bạn", { exact: true })).not.toHaveAttribute("aria-invalid", "true");
});

test("the Turnstile script is requested only when the form nears the viewport", async ({ page }) => {
  let requested = false;
  page.on("request", (req) => {
    if (req.url().endsWith("/turnstile.js") || req.url().includes("/turnstile.js?")) requested = true;
  });
  await page.goto("/vi");
  await page.waitForLoadState("networkidle");
  expect(requested).toBe(false);
  await page.locator("#contact form").scrollIntoViewIfNeeded();
  await expect.poll(() => requested).toBe(true);
});

test("scrolling the whole page talks only to this server, the stub and the tolerated analytics script", async ({ page }) => {
  const hosts = new Set<string>();
  page.on("request", (req) => {
    const url = new URL(req.url());
    if (url.protocol === "http:" || url.protocol === "https:") hosts.add(url.host);
  });
  await page.goto("/vi");
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await page.waitForLoadState("networkidle");
  const allowed = new Set(["localhost:3100", "127.0.0.1:3198", "va.vercel-scripts.com"]);
  expect([...hosts].filter((host) => !allowed.has(host))).toEqual([]);
});

test("the served HTML carries no server-only form values", async ({ request }) => {
  const html = await (await request.get("/vi")).text();
  expect(html).toContain("contact-form-slot");
  // The values set in playwright.config.ts for the server; only the site key and the script URL are public.
  for (const secret of ["e2e-resend-key", "e2e-turnstile-secret", "owner@example.com", "form@example.com"]) {
    expect(html).not.toContain(secret);
  }
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the submit button is disabled, the form cannot GET and the noscript line shows", async ({ page }) => {
    await page.goto("/vi");
    await expect(page.locator("#contact form")).toHaveAttribute("method", "post");
    await expect(page.locator("#contact form").getByRole("button", { name: "Gửi yêu cầu" })).toBeDisabled();
    await expect(page.locator("#contact noscript p")).toBeVisible();
    await expect(page.locator("#contact noscript p")).toContainText("Biểu mẫu cần JavaScript");
  });
});

test("empty required fields are named, focused and nothing is sent", async ({ page, request }) => {
  const form = await openForm(page);
  await form.getByRole("button", { name: "Gửi yêu cầu" }).click();
  const name = form.getByLabel("Tên của bạn", { exact: true });
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAttribute("aria-describedby", "contact-name-error");
  await expect(form.locator("#contact-name-error")).toHaveText("Vui lòng nhập tên của bạn.");
  await expect(form.getByText("Vui lòng nhập tên của bạn.")).toBeVisible();
  for (const label of ["Số điện thoại, Zalo hoặc email để tôi liên hệ lại", "Loại việc", "Bạn cần làm gì"]) {
    await expect(form.getByLabel(label, { exact: true })).toHaveAttribute("aria-invalid", "true");
  }
  await expect(form.getByLabel("Công ty hoặc cửa hàng (nếu có)", { exact: true })).not.toHaveAttribute("aria-invalid", "true");
  expect(await emails(request)).toHaveLength(0);
});

test("a service's request link scrolls to the form with that kind selected", async ({ page }) => {
  await page.goto("/vi");
  await page.locator('#services [data-service="ai"]').getByRole("link").click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator("#contact form").getByLabel("Loại việc", { exact: true })).toHaveValue("ai");
});

test("the for-sale card's link scrolls to the form with 'something else' selected", async ({ page }) => {
  await page.goto("/en");
  const link = page.locator('#projects article[data-slug="tinvid"]').getByRole("link", { name: "Ask about the source code" });
  await link.focus(); // brings a pinned card forward, like the keyboard
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en#contact$/);
  await expect(page.locator("#contact form").getByLabel("Kind of work", { exact: true })).toHaveValue("other");
});

test("the for-sale case study's link lands on the form on the home page with 'something else' selected", async ({ page }) => {
  await page.goto("/vi/projects/tinvid");
  await page.getByRole("link", { name: "Hỏi mua mã nguồn" }).click();
  await expect(page).toHaveURL(/\/vi#contact$/);
  await expect(page.locator("#contact form").getByLabel("Loại việc", { exact: true })).toHaveValue("other");
});

test("a shift-click on the for-sale link opens another window and leaves this tab's form alone", async ({ page, context, isMobile }) => {
  test.skip(isMobile, "a touch screen has no modified clicks");
  await page.goto("/vi/projects/tinvid");
  await page.getByRole("link", { name: "Hỏi mua mã nguồn" }).click({ modifiers: ["Shift"] });
  for (const other of context.pages()) if (other !== page) await other.close(); // a window, if the browser opened one
  await expect(page).toHaveURL(/\/vi\/projects\/tinvid$/);
  await page.locator('header a[href="/vi"]').first().click(); // a client-side visit to the home page, within the expiry window
  const form = page.locator("#contact form");
  await expect(form.getByRole("button", { name: "Gửi yêu cầu" })).toBeEnabled(); // hydrated: the form has read what was pending
  await frames(page, 5);
  await expect(form.getByLabel("Loại việc", { exact: true })).toHaveValue("");
});

test("the form is labelled, keyboard operable and passes axe", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const form = await openForm(page);
  await form.getByLabel("Tên của bạn", { exact: true }).focus();
  for (const label of [
    "Công ty hoặc cửa hàng (nếu có)",
    "Số điện thoại, Zalo hoặc email để tôi liên hệ lại",
    "Loại việc",
    "Bạn cần làm gì",
    "Thời gian mong muốn (nếu có)",
  ]) {
    await page.keyboard.press("Tab");
    await expect(form.getByLabel(label, { exact: true })).toBeFocused();
  }
  await page.keyboard.press("Tab");
  await expect(form.getByRole("button", { name: "Gửi yêu cầu" })).toBeFocused();

  await form.getByRole("button", { name: "Gửi yêu cầu" }).click(); // axe also covers the error state
  const results = await new AxeBuilder({ page }).include("#contact").analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
});
