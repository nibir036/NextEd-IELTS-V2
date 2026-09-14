import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Lists the real, complete 4-skill "Full Mock Test" bundles (or a single
// one by id), each with its ordered Listening/Reading/Writing/Speaking
// sections. This NEVER returns test content itself — the runner loads
// each skill's actual test via the existing /api/<skill>/test endpoints
// once it's that section's turn, exactly like standalone practice does.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  const rows = await prisma.mock_tests.findMany({
    where: { is_published: true, ...(id ? { id } : {}) },
    orderBy: { created_at: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      mock_test_sections: {
        orderBy: { position: 'asc' },
        select: {
          position: true,
          tests: { select: { id: true, skill: true, title: true, duration_seconds: true } },
        },
      },
    },
  });

  const mockTests = rows.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description ?? '',
    sections: m.mock_test_sections.map((s) => ({
      position: s.position,
      skill: s.tests.skill,
      testId: s.tests.id,
      title: s.tests.title,
      durationSeconds: s.tests.duration_seconds,
    })),
    totalDurationSeconds: m.mock_test_sections.reduce(
      (sum, s) => sum + (s.tests.duration_seconds ?? 0),
      0,
    ),
  }));

  if (id) {
    if (mockTests.length === 0) {
      return NextResponse.json({ error: 'Mock test not found.' }, { status: 404 });
    }
    return NextResponse.json({ mockTest: mockTests[0] });
  }

  return NextResponse.json({ mockTests });
}
