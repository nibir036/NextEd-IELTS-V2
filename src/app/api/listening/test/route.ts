import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Returns a listening test with its sections + questions, but NEVER the answer
// key (that stays server-side; the client must not be able to read answers).
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  const test = id
    ? await prisma.tests.findFirst({ where: { id, skill: 'listening', is_published: true }, select: selectShape() })
    : await prisma.tests.findFirst({ where: { skill: 'listening', is_published: true }, orderBy: { position: 'asc' }, select: selectShape() });

  if (!test) {
    return NextResponse.json({ error: 'No listening test is available yet.' }, { status: 404 });
  }

  return NextResponse.json({
    test: {
      id: test.id,
      title: test.title,
      instructions: test.instructions,
      durationSeconds: test.duration_seconds,
      sections: test.test_sections.map((s) => ({
        id: s.id,
        title: s.title,
        instructions: s.instructions,
        audioUrl: s.audio_url,
        imageUrl: s.image_url,
        passageText: s.passage_text,
        questions: s.questions.map((q) => ({
          id: q.id,
          qnumber: q.qnumber,
          type: q.type,
          prompt: q.prompt,
          options: q.options,
          maxWords: q.max_words,
        })),
      })),
    },
  });
}

function selectShape() {
  return {
    id: true, title: true, instructions: true, duration_seconds: true,
    test_sections: {
      orderBy: { position: 'asc' as const },
      select: {
        id: true, title: true, instructions: true, audio_url: true,
        image_url: true, passage_text: true,
        questions: {
          orderBy: { position: 'asc' as const },
          // NOTE: `answer` is intentionally NOT selected — never leak the key.
          select: { id: true, qnumber: true, type: true, prompt: true, options: true, max_words: true },
        },
      },
    },
  };
}
