import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getSessionUserId } from '../../../../lib/session';
import { checkTestAccess } from '../../../../lib/paywall';

// Returns a writing test set (Task 1 + Task 2) with Task 1's image URL.
// If ?id= is given, fetches that specific test; otherwise the first published one.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  // Writing is a paywalled, AI-graded module (see src/lib/paywall.ts) --
  // require a session and refuse to hand back the actual task content for
  // a test this user has already used or has no free slot left for. Without
  // this, the lock is purely cosmetic: anyone could still GET the prompt
  // directly even if TestSelector's UI blurs the card.
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Please log in to take this test.' }, { status: 401 });
  }

  const test = id
    ? await prisma.tests.findFirst({
        where: { id, skill: 'writing', is_published: true },
        select: {
          id: true, title: true, instructions: true, duration_seconds: true,
          test_resources: {
            select: { kind: true, content: true, url: true, position: true },
            orderBy: { position: 'asc' },
          },
        },
      })
    : await prisma.tests.findFirst({
        where: { skill: 'writing', is_published: true },
        orderBy: { position: 'asc' },
        select: {
          id: true, title: true, instructions: true, duration_seconds: true,
          test_resources: {
            select: { kind: true, content: true, url: true, position: true },
            orderBy: { position: 'asc' },
          },
        },
      });

  if (!test) {
    return NextResponse.json({ error: 'No writing test is available yet.' }, { status: 404 });
  }

  const access = await checkTestAccess(userId, 'writing', test.id);
  if (!access.ok) {
    return NextResponse.json({ error: access.message, reason: access.reason }, { status: 403 });
  }

  const promptFor = (pos: number) =>
    test.test_resources.find((r) => r.kind === 'task_prompt' && r.position === pos)?.content ?? '';
  const imageFor = (pos: number) =>
    test.test_resources.find((r) => r.kind === 'task_image' && r.position === pos)?.url ?? null;

  return NextResponse.json({
    test: {
      id: test.id,
      title: test.title,
      instructions: test.instructions,
      durationSeconds: test.duration_seconds,
      task1: { prompt: promptFor(1), imageUrl: imageFor(1) },
      task2: { prompt: promptFor(2), imageUrl: imageFor(2) },
    },
  });
}
