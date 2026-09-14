// Read-only: finds every (user_id, test_id) pair in `submissions` that has
// more than one row, so we can see how big/serious the duplication problem
// actually is before deciding what to do about it. Changes nothing.
//
// Run: node _inspect_dupe_submissions.js

const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres:1234@localhost:5432/nexted_ielts?schema=public',
  });
  await client.connect();

  const dupes = await client.query(`
    SELECT user_id, test_id, COUNT(*) AS n
    FROM submissions
    WHERE test_id IS NOT NULL
    GROUP BY user_id, test_id
    HAVING COUNT(*) > 1
    ORDER BY n DESC
  `);

  console.log(`Duplicate (user_id, test_id) pairs: ${dupes.rows.length}`);
  console.table(dupes.rows);

  if (dupes.rows.length > 0) {
    const { user_id, test_id } = dupes.rows[0];
    const detail = await client.query(
      `SELECT id, status, kind, skill, band_score, submitted_at, scored_at
       FROM submissions
       WHERE user_id = $1 AND test_id = $2
       ORDER BY submitted_at`,
      [user_id, test_id],
    );
    console.log(`\nRows for the worst-offending pair (${user_id}, ${test_id}):`);
    console.table(detail.rows);
  }

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
