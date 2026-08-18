import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getSessionUserId } from '../../../../../lib/session';

/**
 * GET /api/tips/listening/modules
 *
 * Lists published Listening Tips & Tricks modules with chapter summaries
 * and the current user's progress.
 */
export async function GET() {
  const userId = await getSessionUserId();

  const modules = await prisma.tips_modules.findMany({
    where: {
      skill: 'listening',
      is_published: true,
    },
    orderBy: {
      position: 'asc',
    },
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
      description: true,
      position: true,
      chapters: {
        where: {
          is_published: true,
        },
        orderBy: {
          position: 'asc',
        },
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
      where: {
        user_id: userId,
      },
      select: {
        chapter_id: true,
        status: true,
      },
    });

    for (const row of rows) {
      progressByChapter[row.chapter_id] = row.status;
    }
  }

  const payload = modules.map((module) => ({
    id: module.id,
    slug: module.slug,
    title: module.title,
    subtitle: module.subtitle,
    description: module.description,
    position: module.position,

    chapters: module.chapters.map((chapter) => ({
      id: chapter.id,
      slug: chapter.slug,
      title: chapter.title,
      position: chapter.position,
      estimatedMin: chapter.estimated_min,
      summary: chapter.summary,
      status: progressByChapter[chapter.id] ?? 'not_started',
    })),
  }));

  return NextResponse.json({
    modules: payload,
  });
}
