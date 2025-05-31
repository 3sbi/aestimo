import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";
import { i18nConfig } from "./i18n/get-dictionary";

export const LOCALE_HEADER_KEY = "x-locale";

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = JSON.parse(JSON.stringify(i18nConfig.locales));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  const locale = matchLocale(languages, locales, i18nConfig.defaultLocale);
  return locale;
}

export function middleware(request: NextRequest) {
  const requestHeaders: Headers = new Headers(request.headers);
  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = i18nConfig.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const locale = pathname.split("/").filter((x) => !!x)[0];
    requestHeaders.set(LOCALE_HEADER_KEY, locale);
    const updatedResponse = NextResponse.next({ headers: requestHeaders });
    return updatedResponse;
  }

  // Redirect if there is no locale
  const locale = getLocale(request);
  requestHeaders.set(LOCALE_HEADER_KEY, locale);

  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(
    new URL(
      `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
      request.url
    ),
    { headers: requestHeaders }
  );

}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!api|_next).*)",
  ],
};
