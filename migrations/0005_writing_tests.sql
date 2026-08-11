-- =====================================================================
-- Migration 0005 — Writing test bank support
--
-- 1. Allow UNLIMITED re-attempts of the same test by dropping the partial
--    unique index that enforced "one submission per (user, test)".
--    (Reversible: re-create the index to restore one-attempt-per-test.)
--
-- 2. No table changes are required for writing tests themselves — the
--    existing `tests` + `test_resources` tables already model a writing
--    "set" (one tests row; task prompts + images as test_resources rows).
--
-- Run: psql "postgresql://postgres:<pw>@localhost:5432/nexted_ielts" -f migrations/0005_writing_tests.sql
-- Safe to re-run.
-- =====================================================================

BEGIN;

-- Unlimited re-attempts: remove the "one attempt per test per user" rule.
DROP INDEX IF EXISTS uniq_submission_user_test;

COMMIT;

-- To restore one-attempt-per-test later, run:
--   CREATE UNIQUE INDEX uniq_submission_user_test
--     ON submissions (user_id, test_id) WHERE test_id IS NOT NULL;