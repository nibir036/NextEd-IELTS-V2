import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getSessionUserId } from '../../../../lib/session';

/**
 * GET /api/grammar/progress
 * Aggregate grammar progress for the current user (dashboard / learning path).
 */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
  }

  const [chapters, progress, recentAttempts] = await Promise.all([
    prisma.grammar_chapters.findMany({
      where: { is_published: true },
      select: {
        id: true,
        slug: true,
        title: true,
        module: { select: { slug: true, title: true, position: true } },
      },
      orderBy: [{ module: { position: 'asc' } }, { position: 'asc' }],
    }),
    prisma.user_grammar_progress.findMany({
      where: { user_id: userId },
      select: {
        chapter_id: true,
        status: true,
        started_at: true,
        completed_at: true,
      },
    }),
    prisma.user_grammar_attempts.findMany({
      where: { user_id: userId },
      orderBy: { completed_at: 'desc' },
      take: 10,
      select: {
        id: true,
        score: true,
        max_score: true,
        completed_at: true,
        exercise: {
          select: {
            title: true,
            slug: true,
            chapter: { select: { slug: true, title: true } },
          },
        },
      },
    }),
  ]);

  const byChapter = new Map(progress.map((p) => [p.chapter_id, p]));
  const completed = progress.filter((p) => p.status === 'completed').length;
  const inProgress = progress.filter((p) => p.status === 'in_progress').length;

  return NextResponse.json({
    summary: {
      totalChapters: chapters.length,
      completed,
      inProgress,
      notStarted: chapters.length - completed - inProgress,
    },
    chapters: chapters.map((c) => {
      const p = byChapter.get(c.id);
      return {
        id: c.id,
        slug: c.slug,
        title: c.title,
        moduleSlug: c.module.slug,
        moduleTitle: c.module.title,
        status: p?.status ?? 'not_started',
        startedAt: p?.started_at ?? null,
        completedAt: p?.completed_at ?? null,
      };
    }),
    recentAttempts: recentAttempts.map((a) => ({
      id: a.id,
      score: a.score,
      maxScore: a.max_score,
      completedAt: a.completed_at,
      exerciseTitle: a.exercise.title,
      exerciseSlug: a.exercise.slug,
      chapterSlug: a.exercise.chapter.slug,
      chapterTitle: a.exercise.chapter.title,
    })),
  });
}
