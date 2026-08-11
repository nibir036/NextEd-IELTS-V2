import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getSessionUserId } from '../../../lib/session';

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const rows = await prisma.submissions.findMany({
    where: { user_id: userId },
    orderBy: { submitted_at: 'desc' },
    select: {
      id: true,
      skill: true,
      kind: true,
      status: true,
      band_score: true,
      feedback: true,
      answers: true,
      submitted_at: true,
    },
  });

  const submissions = rows.map((r) => {
    const answers = (r.answers ?? {}) as Record<string, unknown>;
    const feedback = (r.feedback ?? {}) as Record<string, unknown>;
    return {
      id: r.id,
      skill: r.skill ?? 'writing',
      kind: r.kind,
      status: r.status,
      bandScore: r.band_score !== null ? Number(r.band_score) : null,
      submittedAt: r.submitted_at.toISOString(),
      title: typeof answers.taskType === 'string'
        ? `Writing — ${answers.taskType}`
        : (r.skill ? `${r.skill[0].toUpperCase()}${r.skill.slice(1)} Practice` : 'Practice'),
      summary: typeof feedback.generalSummary === 'string' ? feedback.generalSummary : '',
    };
  });

  return NextResponse.json({ submissions });
}
