import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ chapter: string }>;
  },
) {
  try {
    const { chapter } = await context.params;
    const chapterNumber = Number(chapter);

    if (
      !Number.isInteger(chapterNumber) ||
      chapterNumber < 1 ||
      chapterNumber > 7
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Chapter must be a number between 1 and 7',
        },
        { status: 400 },
      );
    }

    const lesson = await prisma.lessons.findFirst({
      where: {
        section: 'vocab',
        position: chapterNumber,
        is_published: true,
      },
      select: {
        id: true,
        title: true,
        difficulty: true,
        position: true,
        body: true,
        updated_at: true,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        {
          success: false,
          error: `Vocabulary Chapter ${chapterNumber} not found`,
        },
        { status: 404 },
      );
    }

    let content: unknown;

    try {
      content = JSON.parse(lesson.body);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Chapter content is not valid JSON',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      chapter: {
        id: lesson.id,
        number: lesson.position,
        title: lesson.title,
        difficulty: lesson.difficulty,
        updatedAt: lesson.updated_at,
      },
      content,
    });
  } catch (error) {
    console.error('GET /api/vocab/[chapter] failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load vocabulary chapter',
      },
      { status: 500 },
    );
  }
}