import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18nConfig, isValidLocale, type Locale } from './lib/i18n-config';

// Dil kontrolünden muaf tutulacak yollar (API rotaları, statik varlıklar ve görseller)
const PUBLIC_FILE = /\.(.*)$/;

function getLocale(request: NextRequest): Locale {
  // 1. Önce çereze (cookie) bak: 'NEXT_LOCALE' veya 'derin_lang'
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value || request.cookies.get('derin_lang')?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale.toLowerCase() as Locale;
  }

  // 2. Tarayıcı Accept-Language başlığına bak
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferred = acceptLanguage.toLowerCase();
    if (preferred.startsWith('tr') || preferred.includes(',tr')) {
      return 'tr';
    }
    if (preferred.startsWith('en') || preferred.includes(',en')) {
      return 'en';
    }
  }

  return i18nConfig.defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Next.js dahili dosyaları, API ve public dosyaları atla
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') || // Admin / CMS rotası doğrudan korunur
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Pathname zaten desteklenen bir dil ile mi başlıyor? (/tr, /en)
  const pathnameIsMissingLocale = i18nConfig.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const redirectUrl = new URL(
      `/${locale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`,
      request.url
    );

    // Varsa arama sorgularını (search params) da aktar
    redirectUrl.search = request.nextUrl.search;

    const response = NextResponse.redirect(redirectUrl);
    // Çerezi eşitle
    response.cookies.set('NEXT_LOCALE', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  // URL'deki mevcut dille çerezi senkronize et
  const currentLocale = pathname.split('/')[1];
  const response = NextResponse.next();
  if (isValidLocale(currentLocale)) {
    response.cookies.set('NEXT_LOCALE', currentLocale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  }

  return response;
}

export const config = {
  // Statik dosyaları ve API'leri hariç tutan matcher
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
