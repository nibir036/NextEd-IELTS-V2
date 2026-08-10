import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getSessionUserId } from '../../../../lib/session';

const SKILLS = ['listening', 'reading', 'writing', 'speaking'] as const;
type Skill = (typeof SKILLS)[number];

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  // --- Pull the raw rows we need in parallel ---
  const [userRow, skillBandRows, scoredCount, allSubs, mockCount] = await Promise.all([
    prisma.users.findUnique({
      where: { id: userId },
      select: { total_practice_time: true, overall_band: true, target_band: true },
    }),
    prisma.user_skill_bands.findMany({
      where: { user_id: userId },
      select: { skill: true, band: true },
    }),
    prisma.submissions.count({ where: { user_id: userId, status: 'scored' } }),
    prisma.submissions.findMany({
      where: { user_id: userId },
      select: {
        submitted_at: true,
        band_score: true,
        skill: true,
        kind: true,
        status: true,
      },
      orderBy: { submitted_at: 'desc' },
    }),
    prisma.submissions.count({ where: { user_id: userId, kind: 'full_mock' } }),
  ]);

  // --- Streak: consecutive days (ending today) with at least one submission ---
  const dayKeys = Array.from(new Set(allSubs.map((s) => dayKey(s.submitted_at))));
  let streakDays = 0;
  if (dayKeys.length > 0) {
    const cursor = new Date();
    for (const key of dayKeys) {
      if (key === dayKey(cursor)) {
        streakDays += 1;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
      } else {
        break;
      }
    }
  }

  const practiceHours = userRow
    ? Number((userRow.total_practice_time / 3600).toFixed(1))
    : 0;

  // --- Per-skill bands (from user_skill_bands) ---
  const skillBands: Record<Skill, number | null> = {
    listening: null,
    reading: null,
    writing: null,
    speaking: null,
  };
  for (const row of skillBandRows) {
    if (row.skill && SKILLS.includes(row.skill as Skill)) {
      skillBands[row.skill as Skill] = row.band !== null ? Number(row.band) : null;
    }
  }

  // --- Weekly activity: which of the last 7 days had a submission ---
  const activeDaySet = new Set(dayKeys);
  const weeklyActivity: { date: string; active: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = dayKey(d);
    weeklyActivity.push({ date: key, active: activeDaySet.has(key) });
  }

  // --- Mock vs modular counts (scored only for modular practice sets) ---
  const modularCount = allSubs.filter(
    (s) => s.kind === 'single_test' && s.status === 'scored',
  ).length;

  // --- 30-day trend: earliest vs latest scored band within the window ---
  const now = Date.now();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const scoredInWindow = allSubs
    .filter((s) => s.status === 'scored' && s.band_score !== null)
    .filter((s) => now - s.submitted_at.getTime() <= THIRTY_DAYS)
    .sort((a, b) => a.submitted_at.getTime() - b.submitted_at.getTime());

  let trend: { startBand: number; latestBand: number; gain: number } | null = null;
  if (scoredInWindow.length > 0) {
    const startBand = Number(scoredInWindow[0].band_score);
    const latestBand = Number(scoredInWindow[scoredInWindow.length - 1].band_score);
    trend = {
      startBand,
      latestBand,
      gain: Number((latestBand - startBand).toFixed(1)),
    };
  }

  return NextResponse.json({
    // Existing fields (kept for backwards compatibility)
    testsCompleted: scoredCount,
    streakDays,
    practiceHours,
    // Extended dashboard data
    overallBand: userRow?.overall_band !== null && userRow?.overall_band !== undefined
      ? Number(userRow.overall_band)
      : null,
    targetBand: userRow?.target_band !== null && userRow?.target_band !== undefined
      ? Number(userRow.target_band)
      : null,
    skillBands,
    weeklyActivity,
    mockCount,
    modularCount,
    trend,
  });
}
