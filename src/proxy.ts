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
  return NextResponse.redirect(new URL(target, request.url), 307);
}

export const config = {
  // Skip API routes, Next internals and anything with a file extension (sitemap.xml, robots.txt, images…).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
