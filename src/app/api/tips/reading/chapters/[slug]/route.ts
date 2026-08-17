import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { getSessionUserId } from '../../../../../../lib/session';

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/tips/reading/chapters/[slug]
 *
 * Returns one published Reading Tips & Tricks chapter,
 * together with its neighbouring chapters and the
 * current user's progress.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  const { slug } = await params;
  const userId = await getSessionUserId();

  const chapter = await prisma.tips_chapters.findFirst({
    where: {
      slug,
      is_published: true,
      module: {
        skill: 'reading',
        is_published: true,
      },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      position: true,
      estimated_min: true,
      summary: true,
      content: true,

      module: {
        select: {
          id: true,
          slug: true,
          title: true,
          position: true,
        },
      },
    },
  });

  if (!chapter) {
    return NextResponse.json(
      {
        error: 'Reading chapter not found.',
      },
      { status: 404 },
    );
  }

  const [previous, next, progress] = await Promise.all([
    prisma.tips_chapters.findFirst({
      where: {
        module_id: chapter.module.id,
        is_published: true,
        position: {
          lt: chapter.position,
        },
      },
      orderBy: {
        position: 'desc',
      },
      select: {
        slug: true,
        title: true,
      },
    }),

    prisma.tips_chapters.findFirst({
      where: {
        module_id: chapter.module.id,
        is_published: true,
        position: {
          gt: chapter.position,
        },
      },
      orderBy: {
        position: 'asc',
      },
      select: {
        slug: true,
        title: true,
      },
    }),

    userId
      ? prisma.user_tips_progress.findUnique({
          where: {
            user_id_chapter_id: {
              user_id: userId,
              chapter_id: chapter.id,
            },
          },
          select: {
            status: true,
          },
        })
      : null,
  ]);

  return NextResponse.json({
    chapter: {
      id: chapter.id,
      slug: chapter.slug,
      title: chapter.title,
      estimatedMin: chapter.estimated_min,
      summary: chapter.summary,
      content: chapter.content,

      status: progress?.status ?? 'not_started',

      module: {
        title: chapter.module.title,
      },

      prev: previous,
      next,
    },
  });
}
