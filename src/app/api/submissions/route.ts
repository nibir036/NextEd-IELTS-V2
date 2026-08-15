import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

// GET: ডাটাবেজ থেকে টেস্ট হিস্ট্রি আনার জন্য
export async function GET() {
  try {
    const query = `
      SELECT 
        id,
        user_id AS "userId",
        kind AS "type",
        test_id AS "testId",
        skill,
        status,
        band_score AS "bandScore",
        details,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') AS "submittedAt"
      FROM submissions
      ORDER BY created_at DESC;
    `;
    
    const { rows } = await pool.query(query);

    const formattedData = rows.map((item) => {
      const detailsObj = typeof item.details === 'string' 
        ? JSON.parse(item.details) 
        : item.details;

      return {
        id: item.id.toString(),
        type: item.skill || item.type || 'overall',
        title: `${(item.skill || 'IELTS').toUpperCase()} Test Attempt`,
        bandScore: Number(item.bandScore),
        submittedAt: item.submittedAt,
        details: {
          userResponse: detailsObj?.userResponse || 'No candidate response recorded.',
          evaluations: detailsObj?.evaluations || [],
          feedback: detailsObj?.feedback || 'No examiner notes available.',
        },
      };
    });

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error: any) {
    console.error('Database Fetch Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submission history' },
      { status: 500 }
    );
  }
}

// POST: নতুন টেস্ট সাবমিট ও স্কোর সেভ করার জন্য
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, testId, kind, skill, bandScore, status, details } = body;

    const query = `
      INSERT INTO submissions (user_id, test_id, kind, skill, status, band_score, details, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *;
    `;

    const values = [
      userId || 'guest_user',
      testId || null,
      kind || 'practice',
      skill || 'writing',
      status || 'evaluated',
      bandScore || 0.0,
      JSON.stringify(details || {}),
    ];

    const { rows } = await pool.query(query, values);

    return NextResponse.json({ success: true, data: rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Database Insert Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save submission' },
      { status: 500 }
    );
  }
}