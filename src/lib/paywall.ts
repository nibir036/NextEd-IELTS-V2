import { prisma } from './prisma';

// Reading/Listening are ungated and meant to be retaken (see the comment
// on hasAttempted below), so they never went through annotateTestLocks at
// all -- the browse list never showed a "Completed" state for them, unlike
// writing/speaking. Their completion history lives in `test_attempts`
// (auto-scored), not `submissions` (AI-graded), so this is a separate,
// much simpler annotator: attempted-only, no locking, no quota.
export async function annotateUngatedAttempted<T extends { id: string }>(
  userId: string,
  tests: T[],
): Promise<(T & { attempted: boolean; lastAttemptId: string | null })[]> {
  if (tests.length === 0) return [];
  // Reading/listening allow unlimited retakes, so a test can have many
  // test_attempts rows -- order newest-first and keep only the first (most
  // recent) id per test_id, for the browse-list "history" button to open.
  const rows = await prisma.test_attempts.findMany({
    where: { user_id: userId, test_id: { in: tests.map((t) => t.id) } },
    orderBy: { submitted_at: 'desc' },
    select: { id: true, test_id: true },
  });
  const lastIdByTest = new Map<string, string>();
  for (const r of rows) {
    if (!lastIdByTest.has(r.test_id)) lastIdByTest.set(r.test_id, r.id);
  }
  return tests.map((t) => ({
    ...t,
    attempted: lastIdByTest.has(t.id),
    lastAttemptId: lastIdByTest.get(t.id) ?? null,
  }));
}

// Writing and Speaking are the only two modules that cost real money per
// attempt (Gemini grading for Writing; the external FastAPI scoring
// service for Speaking, which also does transcription). Reading/Listening
// are answer-key auto-scored -- essentially free to serve -- so they are
// deliberately NOT touched by any of this.
export const FREE_TEST_QUOTA = {
  writing: 4,
  speaking: 4,
} as const;

export type GatedSkill = keyof typeof FREE_TEST_QUOTA;

export function isGatedSkill(skill: string): skill is GatedSkill {
  return skill === 'writing' || skill === 'speaking';
}

export interface AccessCheck {
  ok: boolean;
  reason?: 'already_attempted' | 'quota_exceeded';
  message?: string;
}

// A test is locked for retake the moment ANY submission exists for this
// (user, skill, test). See the schema comment on `submissions` -- real
// dev data already has a user with 6 legitimate speaking retries against
// the same test_id from before this feature existed, which is why this is
// enforced here (going forward only) instead of as a DB constraint that
// would conflict with that existing history.
async function hasAttempted(userId: string, skill: GatedSkill, testId: string): Promise<boolean> {
  const existing = await prisma.submissions.findFirst({
    where: { user_id: userId, skill, test_id: testId },
    select: { id: true },
  });
  return existing !== null;
}

// Distinct tests this user has ever submitted for this skill, checked
// against FREE_TEST_QUOTA to decide whether a never-attempted test is
// still free to start.
async function attemptedTestIds(userId: string, skill: GatedSkill): Promise<Set<string>> {
  const rows = await prisma.submissions.findMany({
    where: { user_id: userId, skill, test_id: { not: null } },
    select: { test_id: true },
    distinct: ['test_id'],
  });
  return new Set(rows.map((r) => r.test_id as string));
}

// Most-recent submission id per test_id -- for the browse-list "history"
// button. Writing/speaking are one-shot going forward, but the schema
// comment on `submissions` notes real historic duplicates from before that
// was enforced, so this still orders newest-first and keeps just the first
// (latest) id per test, same as annotateUngatedAttempted does.
async function lastSubmissionIdByTest(
  userId: string,
  skill: GatedSkill,
  testIds: string[],
): Promise<Map<string, string>> {
  if (testIds.length === 0) return new Map();
  const rows = await prisma.submissions.findMany({
    where: { user_id: userId, skill, test_id: { in: testIds } },
    orderBy: { submitted_at: 'desc' },
    select: { id: true, test_id: true },
  });
  const out = new Map<string, string>();
  for (const r of rows) {
    if (r.test_id && !out.has(r.test_id)) out.set(r.test_id, r.id);
  }
  return out;
}

// Gate for actually starting/submitting ONE specific test -- used by
// writing/test, speaking/test (before returning test content) and
// writing/evaluate, speaking/evaluate (before spending anything on AI
// grading).
export async function checkTestAccess(
  userId: string,
  skill: GatedSkill,
  testId: string,
): Promise<AccessCheck> {
  if (await hasAttempted(userId, skill, testId)) {
    return {
      ok: false,
      reason: 'already_attempted',
      message: 'You have already completed this test. Each test can only be taken once.',
    };
  }
  const attempted = await attemptedTestIds(userId, skill);
  if (attempted.size >= FREE_TEST_QUOTA[skill]) {
    return {
      ok: false,
      reason: 'quota_exceeded',
      message: `You've used all ${FREE_TEST_QUOTA[skill]} free ${skill} tests. Upgrade to unlock more.`,
    };
  }
  return { ok: true };
}

// Per-test lock/attempted flags for the browse list -- GET /api/tests?skill=writing|speaking.
export async function annotateTestLocks<T extends { id: string }>(
  userId: string,
  skill: GatedSkill,
  tests: T[],
): Promise<(T & { attempted: boolean; locked: boolean; lastAttemptId: string | null })[]> {
  const attempted = await attemptedTestIds(userId, skill);
  const hasFreeSlot = attempted.size < FREE_TEST_QUOTA[skill];
  const lastIdByTest = await lastSubmissionIdByTest(userId, skill, tests.map((t) => t.id));
  return tests.map((t) => ({
    ...t,
    attempted: attempted.has(t.id),
    locked: !attempted.has(t.id) && !hasFreeSlot,
    lastAttemptId: lastIdByTest.get(t.id) ?? null,
  }));
}
