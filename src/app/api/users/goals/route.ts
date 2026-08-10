import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getSessionUserId } from '../../../../lib/session';

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const { targetBand, examDate } = (await req.json()) ?? {};
    const data: Record<string, unknown> = {};

    if (targetBand !== undefined && targetBand !== null && targetBand !== '') {
      const band = Number(targetBand);
      if (Number.isNaN(band) || band < 0 || band > 9) {
        return NextResponse.json(
          { error: 'Target band must be between 0 and 9.' },
          { status: 400 },
        );
      }
      data.target_band = band;
    }

    if (examDate !== undefined) {
      data.exam_date = examDate ? new Date(examDate) : null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No fields to update.' }, { status: 400 });
    }

    const user = await prisma.users.update({
      where: { id: userId },
      data,
    });

    const { password_hash, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error('Goals update error:', err);
    return NextResponse.json({ error: 'Failed to update exam goals.' }, { status: 500 });
  }
}
