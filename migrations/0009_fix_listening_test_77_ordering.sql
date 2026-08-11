-- =====================================================================
-- Migration 0009 — Fix section ordering + wire in the basement plan image
-- for IELTS Listening Test 77.
--
-- Root cause: each seed file set `position` relative only to its own
-- "Part," so multiple sections within the same Part ended up sharing a
-- position value (e.g. Q1-7 and Q8-10 both got position=1). The listening
-- test route sorts sections by `orderBy: { position: 'asc' }` with no
-- secondary tiebreaker, so ties fell back to Postgres's unstable default
-- row order — which is why Q8-10 rendered before Q1-7.
--
-- Fix: renumber every section's position globally & uniquely (1-7) so
-- the query order is deterministic and matches the real question order.
--
-- Run:
--   psql "postgresql://postgres:<pw>@localhost:5432/nexted_ielts" -f migrations/0009_fix_listening_test_77_ordering.sql
-- Idempotent: safe to re-run.
-- =====================================================================
BEGIN;

UPDATE test_sections SET position = 1 WHERE id = '22222222-2222-2222-2222-2222222222a1'; -- Q1-7
UPDATE test_sections SET position = 2 WHERE id = '22222222-2222-2222-2222-2222222222a2'; -- Q8-10
UPDATE test_sections SET position = 3 WHERE id = '22222222-2222-2222-2222-2222222222a5'; -- Q11-16
UPDATE test_sections SET position = 4 WHERE id = '22222222-2222-2222-2222-2222222222a6'; -- Q17-20
UPDATE test_sections SET position = 5 WHERE id = '22222222-2222-2222-2222-2222222222b1'; -- Q21-26
UPDATE test_sections SET position = 6 WHERE id = '22222222-2222-2222-2222-2222222222b3'; -- Q27-30
UPDATE test_sections SET position = 7 WHERE id = '22222222-2222-2222-2222-2222222222a4'; -- Q31-40

-- Wire in the basement plan image for the map_label section (Q17-20).
UPDATE test_sections
   SET image_url = 'https://firebasestorage.googleapis.com/v0/b/nexted-ielts.firebasestorage.app/o/test_demo%2FL11.1_img1.png?alt=media&token=57b53039-1c58-41bc-98a6-d048fa30119e'
 WHERE id = '22222222-2222-2222-2222-2222222222a6';

COMMIT;