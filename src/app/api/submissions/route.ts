import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getSessionUserId } from '../../../lib/session';

// Submission History merges two stores:
//  - `submissions`   : AI-graded work (writing, diagnostic, speaking)
//  - `test_attempts` : auto-scored structured tests (listening, reading)
// Both are mapped into one timeline shape and sorted by date.
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const [subs, attempts] = await Promise.all([
    prisma.submissions.findMany({
      where: { user_id: userId },
      orderBy: { submitted_at: 'desc' },
      select: {
        id: true, skill: true, kind: true, status: true,
        band_score: true, feedback: true, answers: true, submitted_at: true,
      },
    }),
    prisma.test_attempts.findMany({
      where: { user_id: userId },
      orderBy: { submitted_at: 'desc' },
      select: {
        id: true, raw_score: true, total: true, band: true, submitted_at: true,
        tests: { select: { title: true, skill: true } },
      },
    }),
  ]);

  const fromSubmissions = subs.map((r) => {
    const answers = (r.answers ?? {}) as Record<string, unknown>;
    const feedback = (r.feedback ?? {}) as Record<string, unknown>;
    const isDiagnostic = answers.diagnostic === true;
    return {
      id: r.id,
      origin: 'submission' as const,
      skill: r.skill ?? 'writing',
      kind: r.kind,
      status: r.status,
      bandScore: r.band_score !== null ? Number(r.band_score) : null,
      submittedAt: r.submitted_at.toISOString(),
      title: isDiagnostic
        ? 'Placement Diagnostic'
        : typeof answers.taskType === 'string'
          ? `Writing — ${answers.taskType}`
          : (r.skill ? `${r.skill[0].toUpperCase()}${r.skill.slice(1)} Practice` : 'Practice'),
      summary: typeof feedback.generalSummary === 'string' ? feedback.generalSummary : '',
    };
  });

  const fromAttempts = attempts.map((a) => {
    const skill = a.tests?.skill ?? 'listening';
    return {
      id: a.id,
      origin: 'attempt' as const,
      skill,
      kind: 'single_test',
      status: 'scored',
      bandScore: a.band !== null ? Number(a.band) : null,
      submittedAt: a.submitted_at.toISOString(),
      title: a.tests?.title ?? `${skill[0].toUpperCase()}${skill.slice(1)} Test`,
      summary:
        a.raw_score !== null && a.total !== null
          ? `Scored ${a.raw_score} / ${a.total} correct.`
          : '',
    };
  });

  const submissions = [...fromSubmissions, ...fromAttempts].sort(
    (x, y) => new Date(y.submittedAt).getTime() - new Date(x.submittedAt).getTime(),
  );

  return NextResponse.json({ submissions });
}
