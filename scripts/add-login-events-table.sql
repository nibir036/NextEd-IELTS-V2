-- Additive-only DDL for a new login_events table -- one row per successful
-- login, backing the admin analytics page's "logged in today" / daily
-- login trend numbers. Written by hand and run directly via psql -- NOT
-- through `prisma db push` or `prisma migrate dev` -- specifically so this
-- cannot touch, drop, or drift-check any other table in the database. It
-- only creates one new table and its indexes/FK; nothing else in the
-- schema is read or modified. Matches the pattern already used for
-- vocab_lessons (scripts/add-vocab-lessons-table.sql) and tips_lessons
-- (migrations/0018_add_tips_lessons.sql).
--
-- Why this table exists: users.last_active_at only ever holds the single
-- MOST RECENT login timestamp per user -- it gets overwritten on every
-- login, so it cannot answer "how many users logged in on day X" for any
-- day other than the most recent one. A dedicated append-only event log is
-- the only way to get an accurate day-by-day login trend, today onward.
-- Logins before this table existed are not retroactively recoverable.
--
-- Run it with:
--   psql "$DATABASE_URL" -f scripts/add-login-events-table.sql
--
-- Safe to re-run: every statement is guarded with IF NOT EXISTS.

BEGIN;

CREATE TABLE IF NOT EXISTS login_events (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_login_events_user ON login_events(user_id);
CREATE INDEX IF NOT EXISTS idx_login_events_created_at ON login_events(created_at);

COMMIT;
