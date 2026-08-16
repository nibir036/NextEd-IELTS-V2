import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getSessionUserId } from '../../../../../lib/session';

/**
 * GET /api/tips/writing/modules
 * Lists published Writing Tips & Tricks modules with chapter summaries
 * and the current user's progress. Separate from /api/grammar — this
 * content surfaces inside Writing Practice, not the Grammar LMS.
 */
export async function GET() {
  const userId = await getSessionUserId();

  const modules = await prisma.tips_modules.findMany({
    where: { skill: 'writing', is_published: true },
    orderBy: { position: 'asc' },
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
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
          summary: true,
        },
      },
    },
  });

  let progressByChapter: Record<string, string> = {};
  if (userId) {
    const rows = await prisma.user_tips_progress.findMany({
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
    description: m.description,
    position: m.position,
    chapters: m.chapters.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      position: c.position,
      estimatedMin: c.estimated_min,
      summary: c.summary,
      status: progressByChapter[c.id] ?? 'not_started',
    })),
  }));

  return NextResponse.json({ modules: payload });
}
