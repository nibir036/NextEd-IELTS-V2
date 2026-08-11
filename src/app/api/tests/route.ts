import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

const VALID_SKILLS = ['writing', 'reading', 'listening', 'speaking'] as const;
type Skill = (typeof VALID_SKILLS)[number];

// Lists published tests for a skill, for the test-selection cards.
export async function GET(req: NextRequest) {
  const skill = req.nextUrl.searchParams.get('skill');

  if (!skill || !VALID_SKILLS.includes(skill as Skill)) {
    return NextResponse.json(
      { error: 'A valid skill query parameter is required.' },
      { status: 400 },
    );
  }

  const rows = await prisma.tests.findMany({
    where: { skill: skill as Skill, is_published: true },
    orderBy: { position: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      band_target: true,
      duration_seconds: true,
    },
  });

  const tests = rows.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description ?? '',
    bandTarget: t.band_target !== null ? Number(t.band_target) : null,
    durationSeconds: t.duration_seconds,
  }));

  return NextResponse.json({ tests });
}
