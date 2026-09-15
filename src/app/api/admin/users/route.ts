import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/admin';

// POST /api/admin/users { phone, password, name, role } -- admin-only.
// Creates an account directly, no OTP (the admin creating it is the
// verification) and does NOT log the admin in as the new user -- unlike
// /api/auth/register, this never calls createSession(). Mirrors register's
// validation/avatar-initials logic minus the otpProof check.
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  try {
    const { phone, password, name, role } = await req.json();

    if (!phone || !password || !name) {
      return NextResponse.json(
        { error: 'Phone, password, and name are required.' },
        { status: 400 },
      );
    }
    if (role !== 'student' && role !== 'admin') {
      return NextResponse.json(
        { error: 'Role must be either "student" or "admin".' },
        { status: 400 },
      );
    }
    if (String(password).length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
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

    const passwordHash = await bcrypt.hash(String(password), 10);
    const id = crypto.randomUUID();

    const trimmedName = String(name).trim();
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
        is_phone_verified: true,
        role,
        onboarding_complete: false,
      },
      select: {
        id: true,
        phone: true,
        display_name: true,
        role: true,
        created_at: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err: any) {
    console.error('Admin create-user error:', err);
    if (err?.code === 'P2002') {
      return NextResponse.json(
        { error: 'An account with this phone number already exists.' },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
  }
}
