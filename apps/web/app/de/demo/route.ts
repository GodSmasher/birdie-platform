import { NextResponse } from 'next/server';

// /de/demo — German entry point into the demo.
export function GET(req: Request) {
  return NextResponse.redirect(new URL('/demo/lang?to=de', new URL(req.url).origin));
}
