import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../lib/prisma';
import { verifyProof } from '../../../../lib/otp';

// POST /api/auth/reset-password { phone, newPassword, otpProof }
// Final step of the "forgot password" flow. Requires a proof string minted
// by /api/auth/otp/verify for purpose "password_reset" and bound to this
// exact phone -- so a client can't set a new password without having
// actually received and entered the texted code for that number. Does not
// log the candidate in; they return to the login page and sign in with the
// new password, same as the requested workflow.
export async function POST(req: NextRequest) {
  try {
    const { phone, newPassword, otpProof } = await req.json();

    if (!phone || !newPassword || !otpProof) {
      return NextResponse.json(
        { error: 'Phone, new password, and OTP verification are required.' },
        { status: 400 },
      );
    }

    const cleanPhone = String(phone).replace(/\s+/g, '');

    if (!verifyProof(otpProof, cleanPhone, 'password_reset')) {
      return NextResponse.json(
        { error: 'Phone verification has expired. Please request a new code.' },
        { status: 400 },
      );
    }

    if (String(newPassword).length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 },
      );
    }

    const user = await prisma.users.findFirst({ where: { phone: cleanPhone } });
    if (!user) {
      // Shouldn't happen -- /api/auth/otp/send already checked the phone
      // exists before texting a code for this purpose -- but handled
      // defensively in case the account was removed between send and reset.
      return NextResponse.json(
        { error: 'No account found with this phone number.' },
        { status: 404 },
      );
    }

    const passwordHash = await bcrypt.hash(String(newPassword), 10);
    await prisma.users.update({
      where: { id: user.id },
      data: { password_hash: passwordHash },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });
  }
}
