import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp, OtpError } from '../../../../../lib/otp';

// POST /api/auth/otp/verify { phone, code, purpose }
// Checks the code against the most recent unconsumed OTP for that
// phone+purpose. On success returns a short-lived signed "proof" string
// that /api/auth/register checks before creating the account -- the
// client never gets to just assert "verified: true" on its own.
const ALLOWED_PURPOSES = new Set(['signup']);

export async function POST(req: NextRequest) {
  try {
    const { phone, code, purpose } = await req.json();

    if (!phone || !code || !purpose || !ALLOWED_PURPOSES.has(purpose)) {
      return NextResponse.json({ error: 'Phone, code, and purpose are required.' }, { status: 400 });
    }

    const cleanPhone = String(phone).replace(/\s+/g, '');
    const cleanCode = String(code).trim();

    const proof = await verifyOtp(cleanPhone, cleanCode, purpose);

    return NextResponse.json({ ok: true, proof });
  } catch (err: any) {
    if (err instanceof OtpError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 400 });
    }
    console.error('OTP verify error:', err);
    return NextResponse.json({ error: 'Failed to verify code.' }, { status: 500 });
  }
}
