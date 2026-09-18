import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/admin';

// GET /api/admin/feedback -- admin-only. Every feedback_submissions row,
// newest first, left-joined against users so a logged-in submitter's
// name/phone shows up even though the row itself only stores user_id.
// A logged-out submitter has no users row to join, so user_display_name
// is null and f.phone (collected at submit time) is what identifies them.
export async function GET(_req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  try {
    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        message: string;
        phone: string | null;
        page_path: string | null;
        created_at: Date;
        reviewed_at: Date | null;
        user_display_name: string | null;
        user_phone: string | null;
      }>
    >`
      SELECT
        f.id,
        f.message,
        f.phone,
        f.page_path,
        f.created_at,
        f.reviewed_at,
        u.display_name AS user_display_name,
        u.phone AS user_phone
      FROM feedback_submissions f
      LEFT JOIN users u ON u.id = f.user_id
      ORDER BY f.created_at DESC
      LIMIT 500
    `;

    return NextResponse.json({ feedback: rows });
  } catch (err) {
    console.error('Admin feedback fetch error:', err);
    return NextResponse.json({ error: 'Failed to load feedback.' }, { status: 500 });
  }
}
