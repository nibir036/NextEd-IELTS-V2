import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../../lib/prisma';
import { getSessionUserId } from '../../../../../../../lib/session';

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

type ProgressStatus = 'in_progress' | 'completed';

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json(
      {
        error: 'Authentication required.',
      },
      { status: 401 },
    );
  }

  const { slug } = await params;

  let body: { status?: ProgressStatus };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: 'Invalid request body.',
      },
      { status: 400 },
    );
  }

  const status = body.status;

  if (status !== 'in_progress' && status !== 'completed') {
    return NextResponse.json(
      {
        error: 'Invalid progress status.',
      },
      { status: 400 },
    );
  }

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

  const progress = await prisma.user_tips_progress.upsert({
    where: {
      user_id_chapter_id: {
        user_id: userId,
        chapter_id: chapter.id,
      },
    },
    create: {
      user_id: userId,
      chapter_id: chapter.id,
      status,
    },
    update: {
      status,
    },
    select: {
      chapter_id: true,
      status: true,
    },
  });

  return NextResponse.json({
    progress: {
      chapterId: progress.chapter_id,
      status: progress.status,
    },
  });
}
