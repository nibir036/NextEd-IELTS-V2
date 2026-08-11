import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getSessionUserId } from '../../../../lib/session';

// Whether the current user has completed the diagnostic. Drives the dashboard
// nudge and the auto-open-after-signup behaviour.
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ completed: false });
  }

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { onboarding_complete: true },
  });

  return NextResponse.json({ completed: Boolean(user?.onboarding_complete) });
}
