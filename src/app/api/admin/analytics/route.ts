import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/admin';

const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 30;

// UTC calendar-day key, matching the convention already used in
// /api/dashboard/stats (dayKey()) -- the project has no timezone handling
// anywhere, everything buckets by UTC day.
function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function utcDayStart(d: Date): Date {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

// GET /api/admin/analytics -- admin-only. Today's headline numbers plus a
// day-by-day trend for the last 30 days: signups (users.created_at, always
// accurate historically), logins (login_events, only accurate from the day
// that table was added -- see its migration comment), and Writing/Speaking
// submissions (submissions.submitted_at, always accurate) since those are
// the two paywalled, AI-cost-incurring modules.
export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const todayStart = utcDayStart(new Date());
  const windowStart = new Date(todayStart.getTime() - (WINDOW_DAYS - 1) * DAY_MS);

  const [totalUsers, usersInWindow, loginsInWindow, writingInWindow, speakingInWindow] =
    await Promise.all([
      prisma.users.count(),
      prisma.users.findMany({
        where: { created_at: { gte: windowStart } },
        select: { created_at: true },
      }),
      prisma.login_events.findMany({
        where: { created_at: { gte: windowStart } },
        select: { created_at: true, user_id: true },
      }),
      prisma.submissions.findMany({
        where: { skill: 'writing', submitted_at: { gte: windowStart } },
        select: { submitted_at: true },
      }),
      prisma.submissions.findMany({
        where: { skill: 'speaking', submitted_at: { gte: windowStart } },
        select: { submitted_at: true },
      }),
    ]);

  const days: string[] = [];
  for (let i = WINDOW_DAYS - 1; i >= 0; i--) {
    days.push(dayKey(new Date(todayStart.getTime() - i * DAY_MS)));
  }

  const registeredByDay = new Map<string, number>();
  for (const u of usersInWindow) {
    const k = dayKey(u.created_at);
    registeredByDay.set(k, (registeredByDay.get(k) ?? 0) + 1);
  }

  // Logins counted as DISTINCT users per day, not raw event count -- "how
  // many users logged in" means headcount, not session count.
  const loginUsersByDay = new Map<string, Set<string>>();
  for (const ev of loginsInWindow) {
    const k = dayKey(ev.created_at);
    if (!loginUsersByDay.has(k)) loginUsersByDay.set(k, new Set());
    loginUsersByDay.get(k)!.add(ev.user_id);
  }

  const writingByDay = new Map<string, number>();
  for (const s of writingInWindow) {
    const k = dayKey(s.submitted_at);
    writingByDay.set(k, (writingByDay.get(k) ?? 0) + 1);
  }

  const speakingByDay = new Map<string, number>();
  for (const s of speakingInWindow) {
    const k = dayKey(s.submitted_at);
    speakingByDay.set(k, (speakingByDay.get(k) ?? 0) + 1);
  }

  const daily = days.map((date) => ({
    date,
    registered: registeredByDay.get(date) ?? 0,
    loggedIn: loginUsersByDay.get(date)?.size ?? 0,
    writingSubmissions: writingByDay.get(date) ?? 0,
    speakingSubmissions: speakingByDay.get(date) ?? 0,
  }));

  const today = daily[daily.length - 1];

  return NextResponse.json({
    today: {
      registered: today.registered,
      loggedIn: today.loggedIn,
      writingSubmissions: today.writingSubmissions,
      speakingSubmissions: today.speakingSubmissions,
    },
    totalUsers,
    daily,
  });
}
