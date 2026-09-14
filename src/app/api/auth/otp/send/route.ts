import { NextRequest, NextResponse } from 'next/server';
import { createOtp, OtpError } from '../../../../../lib/otp';
import { sendSms, SmsError } from '../../../../../lib/sms';

// POST /api/auth/otp/send { phone, purpose }
// Generates and texts a 6-digit code via Alpha SMS. Only "signup" exists
// today (verifying phone ownership before an account can be created) --
// the allowlist keeps this from silently accepting some other purpose
// later without a deliberate decision to support it.
const ALLOWED_PURPOSES = new Set(['signup']);

export async function POST(req: NextRequest) {
  try {
    const { phone, purpose } = await req.json();

    if (!phone || !purpose || !ALLOWED_PURPOSES.has(purpose)) {
      return NextResponse.json({ error: 'A valid phone and purpose are required.' }, { status: 400 });
    }

    const cleanPhone = String(phone).replace(/\s+/g, '');
    if (cleanPhone.length < 8) {
      return NextResponse.json({ error: 'Please enter a valid mobile phone number.' }, { status: 400 });
    }

    const code = await createOtp(cleanPhone, purpose);

    await sendSms(cleanPhone, `Your AI IELTS Pro OTP Code is ${code}. It expires in 5 minutes.`);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err instanceof OtpError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.code === 'rate_limited' ? 429 : 400 },
      );
    }
    if (err instanceof SmsError) {
      console.error('SMS send error:', err);
      return NextResponse.json(
        { error: err.message || 'Failed to send verification code.' },
        { status: 502 },
      );
    }
    console.error('OTP send error:', err);
    return NextResponse.json({ error: 'Failed to send verification code.' }, { status: 500 });
  }
}
