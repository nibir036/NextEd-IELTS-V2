import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getSessionUserId } from '../../../../lib/session';
import { isCorrect, listeningBand } from '../../../../lib/scoring';

// Scores a listening attempt against the server-side answer key, saves it,
// and returns the band + per-question correctness for review.
export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'You must be logged in to submit.' }, { status: 401 });
    }

    const { testId, answers } = (await req.json()) ?? {};
    if (!testId || typeof answers !== 'object' || answers === null) {
      return NextResponse.json({ error: 'testId and answers are required.' }, { status: 400 });
    }

    const test = await prisma.tests.findFirst({
      where: { id: testId, skill: 'listening', is_published: true },
      select: {
        id: true,
        test_sections: {
          select: {
            questions: {
              select: { id: true, qnumber: true, type: true, answer: { select: { accepted: true, points: true } } },
            },
          },
        },
      },
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found.' }, { status: 404 });
    }

    const questions = test.test_sections.flatMap((s) => s.questions);
    let raw = 0;
    let total = 0;
    const review: Record<number, { correct: boolean; accepted: string[]; your: unknown }> = {};

    for (const q of questions) {
      const accepted = Array.isArray(q.answer?.accepted) ? (q.answer!.accepted as string[]) : [];
      const points = q.answer?.points ?? 1;
      total += points;
      const userAnswer = (answers as Record<string, unknown>)[String(q.qnumber)];
      const correct = isCorrect(q.type, userAnswer, accepted);
      if (correct) raw += points;
      review[q.qnumber] = { correct, accepted, your: userAnswer ?? '' };
    }

    const band = listeningBand(raw, total);

    await prisma.test_attempts.create({
      data: {
        user_id: userId,
        test_id: testId,
        raw_score: raw,
        total,
        band,
        answers: answers as object,
      },
    });

    return NextResponse.json({ rawScore: raw, total, band, review });
  } catch (err: unknown) {
    console.error('Listening submit error:', err);
    const e = err as Error;
    return NextResponse.json({ error: e.message || 'Failed to submit.' }, { status: 500 });
  }
}
