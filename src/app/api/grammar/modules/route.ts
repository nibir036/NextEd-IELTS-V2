import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getSessionUserId } from '../../../../lib/session';

/**
 * GET /api/grammar/modules
 * Lists published modules with chapter summaries and the current user's progress.
 */
export async function GET() {
  const userId = await getSessionUserId();

  const modules = await prisma.grammar_modules.findMany({
    where: { is_published: true },
    orderBy: { position: 'asc' },
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
      band_unlock: true,
      description: true,
      position: true,
      chapters: {
        where: { is_published: true },
        orderBy: { position: 'asc' },
        select: {
          id: true,
          slug: true,
          title: true,
          position: true,
          estimated_min: true,
          difficulty: true,
          band_target: true,
          summary: true,
        },
      },
    },
  });

  // Attach progress if logged in
  let progressByChapter: Record<string, string> = {};
  if (userId) {
    const rows = await prisma.user_grammar_progress.findMany({
      where: { user_id: userId },
      select: { chapter_id: true, status: true },
    });
    for (const r of rows) {
      progressByChapter[r.chapter_id] = r.status;
    }
  }

  const payload = modules.map((m) => ({
    id: m.id,
    slug: m.slug,
    title: m.title,
    subtitle: m.subtitle,
    bandUnlock: m.band_unlock,
    description: m.description,
    position: m.position,
    chapters: m.chapters.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      position: c.position,
      estimatedMin: c.estimated_min,
      difficulty: c.difficulty,
      bandTarget: c.band_target,
      summary: c.summary,
      status: progressByChapter[c.id] ?? 'not_started',
    })),
  }));

  return NextResponse.json({ modules: payload });
}
