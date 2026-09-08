import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const lessons = await prisma.lessons.findMany({
      where: {
        section: 'vocab',
        is_published: true,
        position: {
          gte: 1,
          lte: 7,
        },
      },
      select: {
        id: true,
        title: true,
        difficulty: true,
        position: true,
        updated_at: true,
      },
      orderBy: {
        position: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      chapters: lessons.map((lesson) => ({
        id: lesson.id,
        chapter: lesson.position,
        title: lesson.title,
        difficulty: lesson.difficulty,
        updatedAt: lesson.updated_at,
      })),
    });
  } catch (error) {
    console.error('GET /api/vocab failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load vocabulary chapters',
      },
      { status: 500 },
    );
  }
}