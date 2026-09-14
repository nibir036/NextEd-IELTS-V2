/**
 * One-off diagnostic: checks whether the `speaking_*` tables (which
 * are NOT tracked in schema.prisma) still exist and still hold their
 * data, and whether the new `grammar_lessons` table exists. Written
 * to answer a specific question after `prisma db push` warned about
 * dropping those tables and then errored out partway through -- run
 * this once, read the output, then this file can be deleted.
 *
 *   npx tsx --env-file=.env scripts/check-db-state.ts
 */
import { Client } from 'pg';

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const allTables = await client.query(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`,
    );
    const tableNames = new Set(allTables.rows.map((r) => r.tablename as string));

    console.log('=== All tables currently in the database ===');
    for (const t of allTables.rows) console.log(' -', t.tablename);
    console.log();

    console.log('=== speaking_* tables (were flagged for deletion) ===');
    const speakingTables = ['speaking_parts', 'speaking_reports', 'speaking_sessions', 'speaking_training_samples'];
    for (const t of speakingTables) {
      if (!tableNames.has(t)) {
        console.log(` ${t}: TABLE MISSING (dropped)`);
        continue;
      }
      const { rows } = await client.query(`SELECT count(*)::int AS n FROM "${t}"`);
      console.log(` ${t}: exists, ${rows[0].n} rows`);
    }
    console.log();

    console.log('=== New grammar_lessons table ===');
    if (tableNames.has('grammar_lessons')) {
      const { rows } = await client.query(`SELECT count(*)::int AS n FROM "grammar_lessons"`);
      console.log(` grammar_lessons: exists, ${rows[0].n} rows`);
    } else {
      console.log(' grammar_lessons: TABLE MISSING');
    }
    console.log();

    console.log('=== submissions unique constraint + duplicate check ===');
    const dupes = await client.query(
      `SELECT user_id, test_id, count(*)::int AS n
       FROM submissions
       WHERE test_id IS NOT NULL
       GROUP BY user_id, test_id
       HAVING count(*) > 1
       ORDER BY n DESC`,
    );
    console.log(` duplicate (user_id, test_id) pairs: ${dupes.rows.length}`);
    for (const r of dupes.rows.slice(0, 10)) {
      console.log(`   user_id=${r.user_id} test_id=${r.test_id} count=${r.n}`);
    }
    const constraintCheck = await client.query(
      `SELECT conname FROM pg_constraint WHERE conname = 'uniq_submission_user_test'`,
    );
    console.log(
      ` uniq_submission_user_test constraint present: ${constraintCheck.rows.length > 0 ? 'YES' : 'NO (this is why db push errored)'}`,
    );
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
