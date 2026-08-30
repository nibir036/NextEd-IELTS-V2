-- =====================================================================
-- Migration 0014 — Remove the placeholder "IELTS General Reading Test 1"
-- (the demo seeded by seed_reading_test_1.sql) before loading the real
-- 70-test bank.
--
-- Removing the `tests` row cascades to `test_sections` -> `test_questions`
-- -> `test_answers` (all ON DELETE CASCADE per migration 0008). Any
-- `test_attempts` referencing the dummy test are also cleared first,
-- since test_attempts.test_id -> tests(id) is ON DELETE CASCADE but we
-- clear explicitly for clarity/idempotency.
--
-- Run: psql "$DATABASE_URL" -f migrations/0014_remove_dummy_reading_test.sql
-- Safe to re-run.
-- =====================================================================

BEGIN;

DO $$
DECLARE
    v_test_id UUID := '33333333-3333-3333-3333-333333333333';
BEGIN
    DELETE FROM test_attempts WHERE test_id = v_test_id;
    DELETE FROM tests WHERE id = v_test_id;
END $$;

COMMIT;
