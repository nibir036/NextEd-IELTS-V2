import { prisma } from './prisma';
import { getSessionUserId } from './session';

// Shared gate for every /api/admin/* route -- require a session AND
// role === 'admin'. Used server-side only; the client-side check in
// AdminView.tsx (redirecting non-admins away) is UX politeness, not the
// security boundary -- this is.
export type AdminCheck =
  | { ok: true; userId: string }
  | { ok: false; status: 401 | 403; error: string };

export async function requireAdmin(): Promise<AdminCheck> {
  const userId = await getSessionUserId();
  if (!userId) {
    return { ok: false, status: 401, error: 'Please log in.' };
  }
  const user = await prisma.users.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== 'admin') {
    return { ok: false, status: 403, error: 'Admin access required.' };
  }
  return { ok: true, userId };
}
