-- =====================================================================
-- Migration 0028 — Renumber Listening Mock Tests 11-14 to 3-6
--
-- Deliberately does NOT touch any id/UUID. Those tests' ids are already
-- referenced by mock_test_sections (see migrations/0026_seed_full_mock_tests.sql
-- — Full Mock Tests 1-3 link to Listening Test 11/12/13 by that exact id),
-- and test_sections/test_questions/test_answers all key off the same test_id.
-- Changing the id would orphan or duplicate all of that. This only updates
-- the display title and the ordering position, matched by their CURRENT
-- position (11/12/13/14) so it's safe to run even if you're unsure of the
-- exact id.
--
-- Run this on BOTH your local db and production (Coolify) — same as any
-- other migration:
--   psql -U postgres -d nexted_ielts -f migrations/0028_rename_listening_tests_11_14_to_3_6.sql
-- =====================================================================

BEGIN;

UPDATE tests
   SET title = 'IELTS Listening Mock Test 3',
       position = 3,
       updated_at = now()
 WHERE skill = 'listening' AND position = 11;

UPDATE tests
   SET title = 'IELTS Listening Mock Test 4',
       position = 4,
       updated_at = now()
 WHERE skill = 'listening' AND position = 12;

UPDATE tests
   SET title = 'IELTS Listening Mock Test 5',
       position = 5,
       updated_at = now()
 WHERE skill = 'listening' AND position = 13;

UPDATE tests
   SET title = 'IELTS Listening Mock Test 6',
       position = 6,
       updated_at = now()
 WHERE skill = 'listening' AND position = 14;

COMMIT;
