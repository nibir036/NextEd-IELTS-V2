import { prisma } from './prisma';

// Writing and Speaking are the only two modules that cost real money per
// attempt (Gemini grading for Writing; the external FastAPI scoring
// service for Speaking, which also does transcription). Reading/Listening
// are answer-key auto-scored -- essentially free to serve -- so they are
// deliberately NOT touched by any of this.
export const FREE_TEST_QUOTA = {
  writing: 2,
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
): Promise<(T & { attempted: boolean; locked: boolean })[]> {
  const attempted = await attemptedTestIds(userId, skill);
  const hasFreeSlot = attempted.size < FREE_TEST_QUOTA[skill];
  return tests.map((t) => ({
    ...t,
    attempted: attempted.has(t.id),
    locked: !attempted.has(t.id) && !hasFreeSlot,
  }));
}
