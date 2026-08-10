import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../../../../lib/prisma';
import { createSession } from '../../../../lib/session';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { phone, password, name, email, targetBand, examDate } = await req.json();

    if (!phone || !password || !name || !email) {
      return NextResponse.json(
        { error: 'phone, password, name, and email are required.' },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 },
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 },
      );
    }

    const cleanPhone = String(phone).replace(/\s+/g, '');

    const existingPhone = await prisma.users.findFirst({ where: { phone: cleanPhone } });
    if (existingPhone) {
      return NextResponse.json(
        { error: 'An account with this phone number already exists.' },
        { status: 409 },
      );
    }

    const existingEmail = await prisma.users.findFirst({ where: { email: cleanEmail } });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    const trimmedName = name.trim();
    const nameParts = trimmedName.split(' ');
    const avatar =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : trimmedName.slice(0, 2).toUpperCase();

    const user = await prisma.users.create({
      data: {
        id,
        phone: cleanPhone,
        email: cleanEmail,
        password_hash: passwordHash,
        display_name: trimmedName,
        avatar,
        target_band: targetBand ?? 8.0,
        exam_date: examDate ? new Date(examDate) : null,
        onboarding_complete: false,
      },
      select: {
        id: true,
        phone: true,
        email: true,
        display_name: true,
        avatar: true,
        target_band: true,
        exam_date: true,
        onboarding_complete: true,
        role: true,
      },
    });

    await createSession(user.id);

    return NextResponse.json({ user }, { status: 201 });
  } catch (err: any) {
    console.error('Register error:', err);
    // Prisma unique-constraint violation (belt-and-suspenders — the explicit
    // checks above should catch this first, but the DB constraint is the
    // real guarantee under concurrent signups).
    if (err?.code === 'P2002') {
      const field = Array.isArray(err?.meta?.target) ? err.meta.target[0] : 'phone or email';
      return NextResponse.json(
        { error: `An account with this ${field} already exists.` },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 });
  }
}
