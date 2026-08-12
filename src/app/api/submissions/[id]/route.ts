import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getSessionUserId } from '../../../../lib/session';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const { id } = await params;
  const origin = req.nextUrl.searchParams.get('origin'); // 'submission' | 'attempt' | null

  // ---- Structured test attempt (listening/reading) ----
  if (origin === 'attempt') {
    const a = await prisma.test_attempts.findUnique({
      where: { id },
      select: {
        id: true, user_id: true, raw_score: true, total: true, band: true,
        answers: true, submitted_at: true,
        tests: {
          select: {
            title: true, skill: true,
            test_sections: {
              orderBy: { position: 'asc' },
              select: {
                title: true,
                questions: {
                  orderBy: { position: 'asc' },
                  select: { qnumber: true, prompt: true, answer: { select: { accepted: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!a || a.user_id !== userId) {
      return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
    }

    const userAnswers = (a.answers ?? {}) as Record<string, unknown>;
    const questions = (a.tests?.test_sections ?? []).flatMap((s) =>
      s.questions.map((q) => {
        const accepted = Array.isArray(q.answer?.accepted) ? (q.answer!.accepted as string[]) : [];
        return {
          qnumber: q.qnumber,
          prompt: q.prompt,
          your: userAnswers[String(q.qnumber)] ?? '',
          accepted,
        };
      }),
    );

    return NextResponse.json({
      submission: {
        id: a.id,
        origin: 'attempt',
        skill: a.tests?.skill ?? 'listening',
        kind: 'single_test',
        status: 'scored',
        bandScore: a.band !== null ? Number(a.band) : null,
        submittedAt: a.submitted_at.toISOString(),
        rawScore: a.raw_score,
        total: a.total,
        title: a.tests?.title ?? 'Test',
        questions,
      },
    });
  }

  // ---- AI-graded submission (writing/diagnostic) ----
  const row = await prisma.submissions.findUnique({
    where: { id },
    select: {
      id: true, user_id: true, skill: true, kind: true, status: true,
      band_score: true, feedback: true, answers: true, submitted_at: true,
    },
  });

  if (!row || row.user_id !== userId) {
    return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
  }

  return NextResponse.json({
    submission: {
      id: row.id,
      origin: 'submission',
      skill: row.skill ?? 'writing',
      kind: row.kind,
      status: row.status,
      bandScore: row.band_score !== null ? Number(row.band_score) : null,
      submittedAt: row.submitted_at.toISOString(),
      answers: (row.answers ?? {}) as Record<string, unknown>,
      feedback: (row.feedback ?? {}) as Record<string, unknown>,
    },
  });
}
