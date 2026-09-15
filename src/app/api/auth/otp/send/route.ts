import { NextRequest, NextResponse } from 'next/server';
import { createOtp, OtpError } from '../../../../../lib/otp';
import { sendSms, SmsError } from '../../../../../lib/sms';
import { prisma } from '../../../../../lib/prisma';

// POST /api/auth/otp/send { phone, purpose }
// Generates and texts a 6-digit code via Alpha SMS. Two purposes exist:
// "signup" (verifying phone ownership before an account can be created)
// and "password_reset" (verifying phone ownership before a forgotten
// password can be changed) -- the allowlist keeps this from silently
// accepting some other purpose later without a deliberate decision to
// support it.
const ALLOWED_PURPOSES = new Set(['signup', 'password_reset']);

const OTP_MESSAGES: Record<string, string> = {
  signup: 'Your IELTS AI OTP Code is {code}. It expires in 5 minutes.',
  password_reset:
    'Your IELTS AI password reset code is {code}. It expires in 5 minutes. If you did not request this, you can ignore this message.',
};

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

    // Password reset only ever texts a code to a number that's actually on
    // an account -- unlike signup, where the whole point is a number that
    // doesn't have one yet.
    if (purpose === 'password_reset') {
      const existing = await prisma.users.findFirst({ where: { phone: cleanPhone } });
      if (!existing) {
        return NextResponse.json({ error: 'No account found with this phone number.' }, { status: 404 });
      }
    }

    const code = await createOtp(cleanPhone, purpose);

    await sendSms(cleanPhone, OTP_MESSAGES[purpose].replace('{code}', code));

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
