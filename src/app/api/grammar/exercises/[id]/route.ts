import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getSessionUserId } from '../../../../../lib/session';

type ExerciseItem = {
  id: string;
  prompt: string;
  answer?: string;
  accepted?: string[];
  reason?: string;
  bn_note?: string | null;
  corrections?: unknown;
  options?: unknown;
};

/**
 * GET /api/grammar/exercises/[id]
 * Returns exercise with items stripped of answers (for the player).
 * Pass ?reveal=1 only for admin/debug — never used by the student UI.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const reveal = req.nextUrl.searchParams.get('reveal') === '1';

  const exercise = await prisma.grammar_exercises.findFirst({
    where: { id, is_published: true },
    select: {
      id: true,
      slug: true,
      title: true,
      kind: true,
      instructions: true,
      items: true,
      position: true,
      chapter: {
        select: { id: true, slug: true, title: true },
      },
    },
  });

  if (!exercise) {
    return NextResponse.json({ error: 'Exercise not found.' }, { status: 404 });
  }

  const rawItems = (exercise.items as ExerciseItem[]) ?? [];
  const items = reveal
    ? rawItems
    : rawItems.map((item) => ({
        id: item.id,
        prompt: item.prompt,
        options: item.options ?? undefined,
        // answer / accepted / reason / bn_note / corrections withheld
      }));

  // Latest attempt for this user (optional UX: show previous score)
  const userId = await getSessionUserId();
  let lastAttempt = null;
  if (userId) {
    lastAttempt = await prisma.user_grammar_attempts.findFirst({
      where: { user_id: userId, exercise_id: exercise.id },
      orderBy: { completed_at: 'desc' },
      select: { id: true, score: true, max_score: true, completed_at: true },
    });
  }

  return NextResponse.json({
    exercise: {
      id: exercise.id,
      slug: exercise.slug,
      title: exercise.title,
      kind: exercise.kind,
      instructions: exercise.instructions,
      position: exercise.position,
      itemCount: rawItems.length,
      items,
      chapter: exercise.chapter,
      lastAttempt,
    },
  });
}
