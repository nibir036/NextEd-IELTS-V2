import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getSessionUserId } from '../../../lib/session';

// POST /api/feedback -- the support widget's "Have any feedback/review?"
// option, on both the landing page and the dashboard. Feedback is
// "unanonymous": a logged-in submission is tied to that account via
// user_id; a logged-out visitor must supply a phone number instead. This
// matches the CHECK constraint on feedback_submissions (see migration
// 0029) -- neither field being present is never accepted.
export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUserId();

    const body = await req.json().catch(() => null);
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
    const pagePath = typeof body?.pagePath === 'string' ? body.pagePath.slice(0, 200) : null;

    if (!message) {
      return NextResponse.json({ error: 'Please enter your feedback.' }, { status: 400 });
    }
    if (message.length > 4000) {
      return NextResponse.json({ error: 'Feedback is too long.' }, { status: 400 });
    }

    if (!userId) {
      // Logged-out visitor -- phone is required and lightly validated
      // (digits, spaces, +, -, parentheses; 6-20 chars covers any real
      // phone format without being fussy about country-specific rules).
      if (!phone) {
        return NextResponse.json(
          { error: 'Please enter your phone number.' },
          { status: 400 },
        );
      }
      if (!/^[0-9+\-\s()]{6,20}$/.test(phone)) {
        return NextResponse.json(
          { error: 'Please enter a valid phone number.' },
          { status: 400 },
        );
      }
    }

    await prisma.$executeRaw`
      INSERT INTO feedback_submissions (user_id, phone, message, page_path)
      VALUES (${userId}, ${userId ? null : phone}, ${message}, ${pagePath})
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Feedback submit error:', err);
    return NextResponse.json({ error: 'Failed to submit feedback. Please try again.' }, { status: 500 });
  }
}
