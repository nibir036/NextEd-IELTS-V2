import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../../lib/prisma';
import { getSessionUserId } from '../../../../../../../lib/session';

/**
 * POST /api/tips/writing/chapters/[slug]/progress
 * Body: { status: "in_progress" | "completed" | "not_started", lastPosition?: string }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
  }

  const { slug } = await params;
  const body = await req.json().catch(() => ({}));
  const status = body.status as string | undefined;
  const lastPosition = body.lastPosition as string | undefined;

  if (!status || !['in_progress', 'completed', 'not_started'].includes(status)) {
    return NextResponse.json(
      { error: 'status must be in_progress, completed, or not_started.' },
      { status: 400 },
    );
  }

  const chapter = await prisma.tips_chapters.findFirst({
    where: { slug, is_published: true },
    select: { id: true },
  });
  if (!chapter) {
    return NextResponse.json({ error: 'Chapter not found.' }, { status: 404 });
  }

  const now = new Date();
  const data: {
    status: string;
    updated_at: Date;
    last_position?: string | null;
    started_at?: Date;
    completed_at?: Date | null;
  } = {
    status,
    updated_at: now,
  };

  if (lastPosition !== undefined) {
    data.last_position = lastPosition;
  }
  if (status === 'in_progress') {
    data.started_at = now;
  }
  if (status === 'completed') {
    data.completed_at = now;
  }
  if (status === 'not_started') {
    data.completed_at = null;
  }

  const row = await prisma.user_tips_progress.upsert({
    where: { user_id_chapter_id: { user_id: userId, chapter_id: chapter.id } },
    create: {
      user_id: userId,
      chapter_id: chapter.id,
      status,
      started_at: status !== 'not_started' ? now : null,
      completed_at: status === 'completed' ? now : null,
      last_position: lastPosition ?? null,
    },
    update: data,
  });

  return NextResponse.json({
    progress: {
      chapterId: row.chapter_id,
      status: row.status,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      lastPosition: row.last_position,
    },
  });
}
