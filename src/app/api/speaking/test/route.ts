import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

interface SpeakingTopic {
  topic: string;
  questions: string[];
}

interface SpeakingScript {
  part1: { intro: string; topics: SpeakingTopic[] };
  part2: { cueCardTitle: string; points: string[]; roundingOff: string[] };
  part3: { topics: SpeakingTopic[] };
}

// Returns a full speaking test (Part 1 interview, Part 2 cue card, Part 3 discussion).
// If ?id= is given, fetches that specific test; otherwise the first published one.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  const where = id
    ? { id, skill: 'speaking' as const, is_published: true }
    : { skill: 'speaking' as const, is_published: true };

  const test = await prisma.tests.findFirst({
    where,
    orderBy: { position: 'asc' },
    select: {
      id: true,
      title: true,
      instructions: true,
      duration_seconds: true,
      test_resources: {
        where: { kind: 'speaking_script' },
        select: { content: true },
        take: 1,
      },
    },
  });

  if (!test) {
    return NextResponse.json({ error: 'No speaking test is available yet.' }, { status: 404 });
  }

  const raw = test.test_resources[0]?.content;
  if (!raw) {
    return NextResponse.json({ error: 'This speaking test has no content yet.' }, { status: 404 });
  }

  let script: SpeakingScript;
  try {
    script = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'This speaking test is malformed.' }, { status: 500 });
  }

  return NextResponse.json({
    test: {
      id: test.id,
      title: test.title,
      instructions: test.instructions,
      durationSeconds: test.duration_seconds,
      part1: script.part1,
      part2: script.part2,
      part3: script.part3,
    },
  });
}
