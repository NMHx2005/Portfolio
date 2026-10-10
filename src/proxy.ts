import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE } from "@/lib/i18n/config";
import { resolveRedirect } from "@/lib/i18n/negotiate";

export function proxy(request: NextRequest) {
  const target = resolveRedirect({
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    cookie: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
  });
  if (!target) return NextResponse.next();
  const response = NextResponse.redirect(new URL(target, request.url), 307);
  // The target depends on the Cookie and Accept-Language headers, so a shared cache must never reuse it for another visitor.
  response.headers.set("Vary", "Accept-Language, Cookie");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  // Skip API routes and Next internals (whole path segments only: /apiary is a normal page path) and anything with a
  // file extension (sitemap.xml, robots.txt, images…).
  matcher: ["/((?!api(?:/|$)|_next(?:/|$)|.*\\..*).*)"],
};
