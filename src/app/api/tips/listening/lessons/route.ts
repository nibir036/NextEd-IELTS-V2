import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

/**
 * GET /api/tips/listening/lessons
 *
 * Lists published listening bite-sized lessons -- the quick-read layer
 * that sits in front of the full chapters. Each lesson optionally
 * points at a chapter slug so the client can deep-link into "read more".
 */
export async function GET() {
  const lessons = await prisma.tips_lessons.findMany({
    where: {
      is_published: true,
      module: {
        skill: 'listening',
        is_published: true,
      },
    },
    orderBy: {
      position: 'asc',
    },
    select: {
      id: true,
      slug: true,
      title: true,
      source_label: true,
      bite: true,
      detail_md: true,
      estimated_min: true,
      read_more_anchor_block_id: true,
      chapter: {
        select: {
          slug: true,
        },
      },
    },
  });

  const payload = lessons.map((lesson) => ({
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    sourceLabel: lesson.source_label,
    bite: lesson.bite,
    detailMd: lesson.detail_md,
    estimatedMin: lesson.estimated_min,
    chapterSlug: lesson.chapter?.slug ?? null,
    anchorBlockId: lesson.read_more_anchor_block_id,
  }));

  return NextResponse.json({
    lessons: payload,
  });
}
