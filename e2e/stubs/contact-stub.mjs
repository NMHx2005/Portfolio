// Local stand-in for the three things the contact form talks to: the Turnstile script, Turnstile verification and
// the email API. Dependency-free and bound to loopback only; started by Playwright in dev mode.
import { createServer } from "node:http";

// Tests run in parallel against this one server, so failure and delay can be scoped to a marker that the test puts
// in its message; an unscoped call applies to every email.
const state = { emails: [], fail: false, delay: 0, rules: new Map(), tokenDelays: new Map() };

// The fake widget issues its token after the delay set for the test's marker (window.__stubMarker).
const WIDGET = `
const widgets = new Map();
function issue(options) {
  const marker = encodeURIComponent(window.__stubMarker || "");
  fetch("http://127.0.0.1:3198/__token-delay?marker=" + marker)
    .then((res) => res.json())
    .then((body) => body.ms)
    .catch(() => 0)
    .then((ms) => setTimeout(() => options.callback("e2e-token"), ms));
}
window.turnstile = {
  render(el, options) { const id = "w" + widgets.size; widgets.set(id, options); issue(options); return id; },
  reset(id) { issue(widgets.get(id)); },
  remove() {},
};`;

function ruleFor(email) {
  const text = typeof email.text === "string" ? email.text : "";
  for (const [marker, rule] of state.rules) if (text.includes(marker)) return rule;
  return { fail: state.fail, delay: state.delay };
}

function ruleOf(marker) {
  const rule = state.rules.get(marker) ?? { fail: false, delay: 0 };
  state.rules.set(marker, rule);
  return rule;
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
  });
}

function parseJson(body) {
  try {
    const value = body ? JSON.parse(body) : {};
    return typeof value === "object" && value !== null ? value : null;
  } catch {
    return null;
  }
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  const { pathname, searchParams } = new URL(req.url ?? "/", "http://127.0.0.1");
  const body = req.method === "POST" ? await readBody(req) : "";

  if (req.method === "GET" && pathname === "/turnstile.js") {
    res.writeHead(200, { "Content-Type": "text/javascript" });
    return res.end(WIDGET);
  }
  if (req.method === "GET" && pathname === "/__token-delay") {
    const ms = state.tokenDelays.get(searchParams.get("marker") ?? "") ?? 0;
    return send(res, 200, { ms }, { "Access-Control-Allow-Origin": "*" });
  }
  if (req.method === "GET" && pathname === "/__emails") {
    const marker = searchParams.get("marker");
    return send(res, 200, marker ? state.emails.filter((email) => String(email.text).includes(marker)) : state.emails);
  }
  if (req.method === "POST" && pathname === "/verify") {
    const token = new URLSearchParams(body).get("response");
    return send(res, 200, { success: token === "e2e-token" });
  }

  const data = parseJson(body);
  if (req.method === "POST" && data === null) return send(res, 400, { error: "malformed body" });

  if (req.method === "POST" && pathname === "/emails") {
    const rule = ruleFor(data);
    await new Promise((resolve) => setTimeout(resolve, rule.delay));
    if (rule.fail) return send(res, 500, { error: "stub failure" });
    state.emails.push(data);
    return send(res, 200, { id: "stub" });
  }
  if (req.method === "POST" && pathname === "/__fail") {
    if (typeof data.marker === "string") ruleOf(data.marker).fail = data.fail !== false;
    else state.fail = data.fail === undefined ? !state.fail : data.fail === true;
    return send(res, 200, {});
  }
  if (req.method === "POST" && pathname === "/__delay") {
    if (typeof data.marker === "string") ruleOf(data.marker).delay = Number(data.ms) || 0;
    else state.delay = Number(data.ms) || 0;
    return send(res, 200, {});
  }
  if (req.method === "POST" && pathname === "/__token-delay") {
    state.tokenDelays.set(typeof data.marker === "string" ? data.marker : "", Number(data.ms) || 0);
    return send(res, 200, {});
  }
  if (req.method === "POST" && pathname === "/__reset") {
    if (typeof data.marker === "string") {
      state.rules.delete(data.marker);
      state.tokenDelays.delete(data.marker);
      state.emails = state.emails.filter((email) => !String(email.text).includes(data.marker));
    } else {
      Object.assign(state, { emails: [], fail: false, delay: 0, rules: new Map(), tokenDelays: new Map() });
    }
    return send(res, 200, {});
  }
  send(res, 404, { error: "not found" });
});

server.listen(3198, "127.0.0.1");
