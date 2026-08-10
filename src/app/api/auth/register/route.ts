import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../../../../lib/prisma';
import { createSession } from '../../../../lib/session';

export async function POST(req: NextRequest) {
  try {
    const { phone, password, name, targetBand, examDate } = await req.json();

    if (!phone || !password || !name) {
      return NextResponse.json(
        { error: 'phone, password, and name are required.' },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 },
      );
    }

    const cleanPhone = String(phone).replace(/\s+/g, '');

    const existing = await prisma.users.findFirst({ where: { phone: cleanPhone } });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this phone number already exists.' },
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
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 });
  }
}