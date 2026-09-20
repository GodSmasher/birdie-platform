import { NextResponse } from 'next/server';
import { LOCALE_COOKIE, normalizeLocale } from '../i18n';

// GET /demo/lang?to=de&next=/demo/dashboard — switch the demo language.
export function GET(req: Request) {
  const url = new URL(req.url);
  const locale = normalizeLocale(url.searchParams.get('to'));
  const next = url.searchParams.get('next') || '/demo/dashboard';
  const target = next.startsWith('/demo') ? next : '/demo/dashboard';
  const res = NextResponse.redirect(new URL(target, url.origin));
  res.cookies.set(LOCALE_COOKIE, locale, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });
  return res;
}
