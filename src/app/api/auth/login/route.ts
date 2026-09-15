import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../lib/prisma';
import { createSession } from '../../../../lib/session';

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json();
    if (!phone || !password) {
      return NextResponse.json(
        { error: 'phone and password are required.' },
        { status: 400 },
      );
    }

    const cleanPhone = String(phone).replace(/\s+/g, '');
    const user = await prisma.users.findFirst({ where: { phone: cleanPhone } });

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: 'Invalid phone or password.' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid phone or password.' }, { status: 401 });
    }

    await createSession(user.id);
    await prisma.users.update({
      where: { id: user.id },
      data: { last_active_at: new Date() },
    });
    // Append-only login log for the admin analytics page's day-by-day
    // trend -- see prisma/schema.prisma's login_events comment for why
    // last_active_at alone can't answer this. Best-effort: a failure here
    // should never block the actual login.
    try {
      await prisma.login_events.create({ data: { user_id: user.id } });
    } catch (logErr) {
      console.error('login_events insert failed:', logErr);
    }

    const { password_hash, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}