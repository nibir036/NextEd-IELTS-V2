import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { requireAdmin } from '../../../../../lib/admin';

// PATCH /api/admin/feedback/[id] { reviewed: boolean } -- admin-only.
// Toggles reviewed_at between null and now() so the admin inbox can show
// an unread/reviewed state without ever deleting a submission.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const reviewed = Boolean(body?.reviewed);

  try {
    await prisma.$executeRaw`
      UPDATE feedback_submissions
      SET reviewed_at = ${reviewed ? new Date() : null}
      WHERE id = ${id}::uuid
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Admin feedback update error:', err);
    return NextResponse.json({ error: 'Failed to update feedback.' }, { status: 500 });
  }
}
