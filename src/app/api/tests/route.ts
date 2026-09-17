import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getSessionUserId } from '../../../lib/session';
import {
  FREE_TEST_QUOTA,
  annotateTestLocks,
  annotateUngatedAttempted,
  isGatedSkill,
} from '../../../lib/paywall';

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

  // Writing/Speaking are the only paywalled skills (see src/lib/paywall.ts)
  // -- Reading/Listening are ungated and retakeable, so they don't get the
  // lock/quota logic, but they still get an `attempted` flag for the
  // browse-list "Completed" badge (sourced from test_attempts, not
  // submissions). Browsing while logged out just skips the annotation,
  // same as before -- reading/listening never required a session.
  if (!isGatedSkill(skill)) {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ tests });
    }
    const annotated = await annotateUngatedAttempted(userId, tests);
    return NextResponse.json({ tests: annotated });
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Please log in to view tests.' }, { status: 401 });
  }

  const annotated = await annotateTestLocks(userId, skill, tests);
  return NextResponse.json({ tests: annotated, freeQuota: FREE_TEST_QUOTA[skill] });
}
