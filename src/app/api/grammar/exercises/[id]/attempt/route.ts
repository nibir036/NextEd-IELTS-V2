import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { getSessionUserId } from '../../../../../../lib/session';

type ExerciseItem = {
  id: string;
  prompt: string;
  answer?: string;
  accepted?: string[];
  reason?: string;
  bn_note?: string | null;
  corrections?: unknown;
};

function normalise(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .toLowerCase();
}

function isMatch(userAnswer: string, item: ExerciseItem): boolean {
  const n = normalise(userAnswer);
  if (!n) return false;

  const candidates = [
    item.answer,
    ...(item.accepted ?? []),
  ].filter(Boolean) as string[];

  return candidates.some((c) => normalise(c) === n);
}

/**
 * POST /api/grammar/exercises/[id]/attempt
 * Body: { answers: Record<itemId, string> }
 * Scores correction / identification / mcq items.
 * Essay-edit is stored but scored leniently (manual review later or exact match).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const answers = (body.answers ?? {}) as Record<string, string>;

  const exercise = await prisma.grammar_exercises.findFirst({
    where: { id, is_published: true },
    select: {
      id: true,
      kind: true,
      items: true,
      chapter_id: true,
    },
  });

  if (!exercise) {
    return NextResponse.json({ error: 'Exercise not found.' }, { status: 404 });
  }

  const items = (exercise.items as ExerciseItem[]) ?? [];
  let score = 0;
  const feedback = items.map((item) => {
    const userAnswer = answers[item.id] ?? '';
    const correct = isMatch(userAnswer, item);
    if (correct) score += 1;
    return {
      id: item.id,
      correct,
      yourAnswer: userAnswer,
      expected: item.answer ?? null,
      reason: item.reason ?? null,
      bnNote: item.bn_note ?? null,
      corrections: item.corrections ?? null,
    };
  });

  const maxScore = items.length;

  const attempt = await prisma.user_grammar_attempts.create({
    data: {
      user_id: userId,
      exercise_id: exercise.id,
      answers,
      score,
      max_score: maxScore,
      feedback,
    },
  });

  // Mark chapter in_progress if not already completed
  await prisma.user_grammar_progress.upsert({
    where: {
      user_id_chapter_id: {
        user_id: userId,
        chapter_id: exercise.chapter_id,
      },
    },
    create: {
      user_id: userId,
      chapter_id: exercise.chapter_id,
      status: 'in_progress',
      started_at: new Date(),
    },
    update: {
      status: 'in_progress',
      updated_at: new Date(),
    },
  });

  return NextResponse.json({
    attempt: {
      id: attempt.id,
      score,
      maxScore,
      feedback,
      completedAt: attempt.completed_at,
    },
  });
}
