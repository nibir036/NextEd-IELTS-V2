import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getSessionUserId } from '../../../../lib/session';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const { id } = await params;

  const row = await prisma.submissions.findUnique({
    where: { id },
    select: {
      id: true,
      user_id: true,
      skill: true,
      kind: true,
      status: true,
      band_score: true,
      feedback: true,
      answers: true,
      submitted_at: true,
    },
  });

  // Never leak another user's submission.
  if (!row || row.user_id !== userId) {
    return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
  }

  const answers = (row.answers ?? {}) as Record<string, unknown>;
  const feedback = (row.feedback ?? {}) as Record<string, unknown>;

  return NextResponse.json({
    submission: {
      id: row.id,
      skill: row.skill ?? 'writing',
      kind: row.kind,
      status: row.status,
      bandScore: row.band_score !== null ? Number(row.band_score) : null,
      submittedAt: row.submitted_at.toISOString(),
      answers,
      feedback,
    },
  });
}
