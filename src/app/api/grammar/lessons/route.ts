import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

/**
 * GET /api/grammar/lessons?module=<module-slug>
 *
 * Lists published bite-sized Grammar lessons for one module -- the
 * quick-read layer that sits in front of the full chapters, mirroring
 * /api/tips/{skill}/lessons. Unlike Tips lessons, each one can also
 * carry a linked exercise, since Grammar chapters have real practice
 * drills attached (the bite-lesson modal offers "Read More" into the
 * chapter and, when present, "Go to Exercises" into that drill).
 */
export async function GET(req: NextRequest) {
  const moduleSlug = req.nextUrl.searchParams.get('module');
  if (!moduleSlug) {
    return NextResponse.json({ error: 'Missing "module" query param.' }, { status: 400 });
  }

  const lessons = await prisma.grammar_lessons.findMany({
    where: {
      is_published: true,
      module: {
        slug: moduleSlug,
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
      collection_slug: true,
      collection_label: true,
      bite: true,
      detail_md: true,
      estimated_min: true,
      read_more_anchor_block_id: true,
      chapter: {
        select: { slug: true },
      },
      exercise: {
        select: { slug: true, title: true },
      },
    },
  });

  const payload = lessons.map((lesson) => ({
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    sourceLabel: lesson.source_label,
    collection: lesson.collection_slug && lesson.collection_label
      ? { slug: lesson.collection_slug, label: lesson.collection_label }
      : null,
    bite: lesson.bite,
    detailMd: lesson.detail_md,
    estimatedMin: lesson.estimated_min,
    chapterSlug: lesson.chapter?.slug ?? null,
    anchorBlockId: lesson.read_more_anchor_block_id,
    exerciseSlug: lesson.exercise?.slug ?? null,
    exerciseTitle: lesson.exercise?.title ?? null,
  }));

  return NextResponse.json({
    lessons: payload,
  });
}
