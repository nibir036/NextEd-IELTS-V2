import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getSessionUserId } from '../../../../../lib/session';

/**
 * GET /api/grammar/chapters/[slug]
 * Full chapter content (blocks) + exercise metadata (no answer keys).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const userId = await getSessionUserId();

  const chapter = await prisma.grammar_chapters.findFirst({
    where: { slug, is_published: true },
    select: {
      id: true,
      slug: true,
      title: true,
      position: true,
      estimated_min: true,
      difficulty: true,
      band_target: true,
      summary: true,
      content: true,
      module: {
        select: { id: true, slug: true, title: true, position: true },
      },
      exercises: {
        where: { is_published: true },
        orderBy: { position: 'asc' },
        select: {
          id: true,
          slug: true,
          title: true,
          kind: true,
          instructions: true,
          position: true,
          // items intentionally excluded — load via exercise endpoint when starting
        },
      },
    },
  });

  if (!chapter) {
    return NextResponse.json({ error: 'Chapter not found.' }, { status: 404 });
  }

  let status = 'not_started';
  if (userId) {
    const progress = await prisma.user_grammar_progress.findUnique({
      where: {
        user_id_chapter_id: { user_id: userId, chapter_id: chapter.id },
      },
      select: { status: true, last_position: true },
    });
    if (progress) status = progress.status;
  }

  // Sibling chapters for prev/next navigation
  const siblings = await prisma.grammar_chapters.findMany({
    where: { module_id: chapter.module.id, is_published: true },
    orderBy: { position: 'asc' },
    select: { slug: true, title: true, position: true },
  });

  const idx = siblings.findIndex((s) => s.slug === chapter.slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  return NextResponse.json({
    chapter: {
      id: chapter.id,
      slug: chapter.slug,
      title: chapter.title,
      position: chapter.position,
      estimatedMin: chapter.estimated_min,
      difficulty: chapter.difficulty,
      bandTarget: chapter.band_target,
      summary: chapter.summary,
      content: chapter.content,
      status,
      module: {
        id: chapter.module.id,
        slug: chapter.module.slug,
        title: chapter.module.title,
        position: chapter.module.position,
      },
      exercises: chapter.exercises.map((e) => ({
        id: e.id,
        slug: e.slug,
        title: e.title,
        kind: e.kind,
        instructions: e.instructions,
        position: e.position,
      })),
      prev: prev ? { slug: prev.slug, title: prev.title } : null,
      next: next ? { slug: next.slug, title: next.title } : null,
    },
  });
}
