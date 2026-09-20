import { NextResponse } from 'next/server';

// The public demo is open: it only serves static fake data (see app/lib/demo-data.ts).
// Set DEMO_ACCESS_CODE to require a code again.
const DEMO_ACCESS_CODE = process.env.DEMO_ACCESS_CODE || '';

export async function POST(req: Request) {
  try {
    if (DEMO_ACCESS_CODE) {
      const { password } = await req.json().catch(() => ({ password: '' }));
      if (password !== DEMO_ACCESS_CODE) {
        return NextResponse.json({ ok: false, error: 'Invalid access code' }, { status: 401 });
      }
    }

    const res = NextResponse.json({ ok: true });

    res.cookies.set('birdie_demo', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400,
    });

    return res;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}
