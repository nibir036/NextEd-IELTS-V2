import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

/**
 * GET /api/vocab/lessons
 *
 * Bite-sized lessons across ALL published "Zero to Band 9" vocab
 * chapters (there's no module concept here, unlike Grammar/Tips, so
 * this always returns the full set rather than being scoped by a
 * query param). Each lesson carries its parent chapter's number
 * (1-7) so the client can open the right chapter and, when present,
 * an anchor block id to scroll to for "Go to Exercises".
 */
export async function GET() {
  const lessons = await prisma.vocab_lessons.findMany({
    where: {
      is_published: true,
      lesson: { section: 'vocab', is_published: true },
    },
    orderBy: [{ lesson: { position: 'asc' } }, { position: 'asc' }],
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
      exercise_anchor_block_id: true,
      lesson: { select: { position: true } },
    },
  });

  const payload = lessons.map((lesson) => ({
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    sourceLabel: lesson.source_label,
    collection:
      lesson.collection_slug && lesson.collection_label
        ? { slug: lesson.collection_slug, label: lesson.collection_label }
        : null,
    bite: lesson.bite,
    detailMd: lesson.detail_md,
    estimatedMin: lesson.estimated_min,
    chapterNumber: lesson.lesson.position,
    anchorBlockId: lesson.read_more_anchor_block_id,
    exerciseAnchorBlockId: lesson.exercise_anchor_block_id,
  }));

  return NextResponse.json({ lessons: payload });
}
