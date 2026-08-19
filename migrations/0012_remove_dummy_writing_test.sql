-- =====================================================================
-- Migration 0012 — Remove the placeholder "IELTS Writing Test 1"
-- (the maps + foreign-language-essay dummy seeded by
-- seed_writing_test_1.sql) before loading the real 70-test bank.
--
-- Removing the `tests` row cascades to `test_resources`
-- (ON DELETE CASCADE) and to any `submissions` referencing it — a user's
-- writing submission on the dummy test is removed too, since
-- submissions.test_id -> tests(id) is ON DELETE RESTRICT... actually the
-- FK is RESTRICT, so submissions must be cleared first if any exist.
--
-- Run: psql "postgresql://postgres:<pw>@localhost:5432/nexted_ielts" -f migrations/0012_remove_dummy_writing_test.sql
-- Safe to re-run.
-- =====================================================================

BEGIN;

DO $$
DECLARE
    v_test_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
    -- submissions.test_id -> tests(id) is ON DELETE RESTRICT, so any
    -- existing submissions against the dummy test must go first.
    DELETE FROM submissions WHERE test_id = v_test_id;

    -- test_resources.test_id -> tests(id) is ON DELETE CASCADE, so this
    -- also removes the dummy's task_prompt / task_image rows.
    DELETE FROM tests WHERE id = v_test_id;
END $$;

COMMIT;
