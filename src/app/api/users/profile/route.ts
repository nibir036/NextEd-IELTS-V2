import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getSessionUserId } from '../../../../lib/session';

// Allowed enum values — kept in sync with migration 0004 / schema.prisma.
const EXAM_TYPES = ['academic', 'general_training'] as const;
const ACADEMIC_BACKGROUNDS = [
  'ssc_olevels',
  'hsc_alevels',
  'diploma',
  'bachelors',
  'masters',
  'phd',
  'other',
] as const;

type ExamType = (typeof EXAM_TYPES)[number];
type AcademicBackground = (typeof ACADEMIC_BACKGROUNDS)[number];

function deriveAvatar(name: string): string {
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/);
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : trimmed.slice(0, 2).toUpperCase();
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      legalFullName,
      email,
      nativeLanguage,
      country,
      dateOfBirth,
      examType,
      academicBackground,
      hasTakenIelts,
      previousIeltsYear,
      previousIeltsBand,
    } = body ?? {};

    // Build the update payload defensively — only set fields that were sent,
    // and validate the constrained ones so bad input never reaches Postgres.
    const data: Record<string, unknown> = {};

    if (typeof name === 'string') {
      const trimmed = name.trim();
      if (!trimmed) {
        return NextResponse.json({ error: 'Name cannot be empty.' }, { status: 400 });
      }
      data.display_name = trimmed;
      data.avatar = deriveAvatar(trimmed);
    }

    if (typeof legalFullName === 'string') {
      data.legal_full_name = legalFullName.trim() || null;
    }

    if (typeof email === 'string') {
      const trimmed = email.trim();
      if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
      }
      data.email = trimmed || null;
    }

    if (typeof nativeLanguage === 'string') {
      data.native_language = nativeLanguage.trim() || null;
    }

    if (typeof country === 'string') {
      data.country = country.trim() || null;
    }

    if (dateOfBirth !== undefined) {
      data.date_of_birth = dateOfBirth ? new Date(dateOfBirth) : null;
    }

    if (examType !== undefined) {
      if (examType !== null && !EXAM_TYPES.includes(examType as ExamType)) {
        return NextResponse.json({ error: 'Invalid exam type.' }, { status: 400 });
      }
      data.exam_type = examType || null;
    }

    if (academicBackground !== undefined) {
      if (
        academicBackground !== null &&
        !ACADEMIC_BACKGROUNDS.includes(academicBackground as AcademicBackground)
      ) {
        return NextResponse.json({ error: 'Invalid academic background.' }, { status: 400 });
      }
      data.academic_background = academicBackground || null;
    }

    // Prior-IELTS trio moves together and mirrors the DB CHECK constraint:
    // if the candidate hasn't taken IELTS, year and band are forced to null.
    if (hasTakenIelts !== undefined) {
      const taken = Boolean(hasTakenIelts);
      data.has_taken_ielts = taken;

      if (taken) {
        if (previousIeltsYear !== undefined && previousIeltsYear !== null && previousIeltsYear !== '') {
          const year = Number(previousIeltsYear);
          const currentYear = new Date().getUTCFullYear();
          if (!Number.isInteger(year) || year < 1990 || year > currentYear) {
            return NextResponse.json(
              { error: `Previous IELTS year must be between 1990 and ${currentYear}.` },
              { status: 400 },
            );
          }
          data.previous_ielts_year = year;
        } else {
          data.previous_ielts_year = null;
        }

        if (previousIeltsBand !== undefined && previousIeltsBand !== null && previousIeltsBand !== '') {
          const band = Number(previousIeltsBand);
          if (Number.isNaN(band) || band < 0 || band > 9) {
            return NextResponse.json(
              { error: 'Previous IELTS band must be between 0 and 9.' },
              { status: 400 },
            );
          }
          data.previous_ielts_band = band;
        } else {
          data.previous_ielts_band = null;
        }
      } else {
        // Not taken → clear both, matching chk_prev_ielts.
        data.previous_ielts_year = null;
        data.previous_ielts_band = null;
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No fields to update.' }, { status: 400 });
    }

    const user = await prisma.users.update({
      where: { id: userId },
      data,
    });

    const { password_hash, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (err: unknown) {
    // Unique-constraint (e.g. email already used) → friendly 409.
    const e = err as { code?: string };
    if (e?.code === 'P2002') {
      return NextResponse.json(
        { error: 'That email is already in use by another account.' },
        { status: 409 },
      );
    }
    console.error('Profile update error:', err);
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }
}
