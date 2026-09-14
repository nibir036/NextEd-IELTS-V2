-- =====================================================================
-- Migration 0025 — Remove IELTS Listening Test 77
--
-- Test 77 (migrations/seed_listening_test_77.sql, id
-- 22222222-2222-2222-2222-222222222222) is being retired now that
-- Listening Tests 11-14 are seeded.
--
-- `test_sections` / `test_questions` / `test_answers` / `test_attempts`
-- all cascade automatically off `tests` (onDelete: Cascade in the
-- schema), so deleting the `tests` row is enough for those. Two other
-- tables reference `tests.id` WITHOUT cascade and would block a plain
-- DELETE with a foreign-key violation if they hold any rows for this
-- test, so this migration clears those first:
--   * submissions        (onDelete: Restrict)
--   * mock_test_sections (no onDelete rule -> defaults to RESTRICT)
--
-- Run: psql "$DATABASE_URL" -f migrations/0025_remove_test_77.sql
-- Idempotent: re-running is a harmless no-op once the test is gone.
-- =====================================================================

BEGIN;
SET client_encoding = 'UTF8';

DO $$
DECLARE
    v_test_id UUID := '22222222-2222-2222-2222-222222222222';
    v_submissions_deleted INT;
    v_mock_sections_deleted INT;
BEGIN
    DELETE FROM submissions WHERE test_id = v_test_id;
    GET DIAGNOSTICS v_submissions_deleted = ROW_COUNT;

    DELETE FROM mock_test_sections WHERE test_id = v_test_id;
    GET DIAGNOSTICS v_mock_sections_deleted = ROW_COUNT;

    DELETE FROM tests WHERE id = v_test_id;

    RAISE NOTICE 'Removed test 77: % submission row(s), % mock_test_sections row(s), and the test itself (cascaded sections/questions/answers/attempts).',
        v_submissions_deleted, v_mock_sections_deleted;
END $$;

COMMIT;
