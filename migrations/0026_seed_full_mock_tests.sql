-- =====================================================================
-- Migration 0026 — Seed 3 real, complete IELTS Full Mock Tests
--
-- Combines the existing Listening / Reading / Writing / Speaking Test
-- 11, 12, and 13 (one already-seeded test per skill, same number) into
-- 3 real four-skill mock tests via the existing `mock_tests` /
-- `mock_test_sections` tables:
--
--   IELTS Full Mock Test 1 -> Listening 11 + Reading 11 + Writing 11 + Speaking 11
--   IELTS Full Mock Test 2 -> Listening 12 + Reading 12 + Writing 12 + Speaking 12
--   IELTS Full Mock Test 3 -> Listening 13 + Reading 13 + Writing 13 + Speaking 13
--
-- position 1-4 = the order a student takes them in (matches the real
-- exam order: Listening, Reading, Writing, Speaking).
--
-- Run AFTER 0013 (writing bank), 0015 (reading bank), seed_speaking_tests.sql,
-- and 0024 (listening 11-14) — this migration only links existing `tests`
-- rows, it does not create them.
--   psql "$DATABASE_URL" -f migrations/0026_seed_full_mock_tests.sql
-- Idempotent: re-running replaces each mock test's section list cleanly.
-- =====================================================================

BEGIN;
SET client_encoding = 'UTF8';

DO $$
DECLARE
    v_mock_id UUID;
BEGIN
    -- ---- IELTS Full Mock Test 1 (Test 11 across all 4 skills) ----------
    v_mock_id := 'cbb7593a-5676-5fc8-8239-dd1888802694';

    INSERT INTO mock_tests (id, title, description, is_published)
    VALUES (
        v_mock_id,
        'IELTS Full Mock Test 1',
        'Complete 4-skill exam simulation under official timing: Listening, Reading, Writing, and Speaking, taken in the real exam order with a combined band report at the end.',
        TRUE
    )
    ON CONFLICT (id) DO UPDATE
        SET title = EXCLUDED.title,
            description = EXCLUDED.description,
            is_published = EXCLUDED.is_published,
            updated_at = now();

    DELETE FROM mock_test_sections WHERE mock_test_id = v_mock_id;

    INSERT INTO mock_test_sections (mock_test_id, test_id, position) VALUES
        (v_mock_id, '11f6fd45-2646-5925-a4ab-ae8ee4972ac3', 1), -- Listening Mock Test 11
        (v_mock_id, '929b7323-9b41-583a-ba18-e784ba04d1ab', 2), -- Reading Mock Test 11
        (v_mock_id, '79b6bc7a-fa74-5b88-bea6-a7340906d77d', 3), -- Writing Mock Test 11
        (v_mock_id, '33333333-3333-3333-3333-000000000011', 4) -- Speaking Test 11
    ON CONFLICT (mock_test_id, test_id) DO UPDATE SET position = EXCLUDED.position;

    -- ---- IELTS Full Mock Test 2 (Test 12 across all 4 skills) ----------
    v_mock_id := '63ec6820-f867-5b81-9f9d-9fba4ba0650f';

    INSERT INTO mock_tests (id, title, description, is_published)
    VALUES (
        v_mock_id,
        'IELTS Full Mock Test 2',
        'Complete 4-skill exam simulation under official timing: Listening, Reading, Writing, and Speaking, taken in the real exam order with a combined band report at the end.',
        TRUE
    )
    ON CONFLICT (id) DO UPDATE
        SET title = EXCLUDED.title,
            description = EXCLUDED.description,
            is_published = EXCLUDED.is_published,
            updated_at = now();

    DELETE FROM mock_test_sections WHERE mock_test_id = v_mock_id;

    INSERT INTO mock_test_sections (mock_test_id, test_id, position) VALUES
        (v_mock_id, '362791c6-a3a0-5b1c-8fde-ccb75c7d5120', 1), -- Listening Mock Test 12
        (v_mock_id, 'f4b544e3-e994-5fd1-a099-8efcc7fd7d64', 2), -- Reading Mock Test 12
        (v_mock_id, 'a8e6b16d-d5f8-5343-9d93-6ba0ff57961b', 3), -- Writing Mock Test 12
        (v_mock_id, '33333333-3333-3333-3333-000000000012', 4) -- Speaking Test 12
    ON CONFLICT (mock_test_id, test_id) DO UPDATE SET position = EXCLUDED.position;

    -- ---- IELTS Full Mock Test 3 (Test 13 across all 4 skills) ----------
    v_mock_id := '74fca32b-3117-5ff6-b536-f43a8a57e102';

    INSERT INTO mock_tests (id, title, description, is_published)
    VALUES (
        v_mock_id,
        'IELTS Full Mock Test 3',
        'Complete 4-skill exam simulation under official timing: Listening, Reading, Writing, and Speaking, taken in the real exam order with a combined band report at the end.',
        TRUE
    )
    ON CONFLICT (id) DO UPDATE
        SET title = EXCLUDED.title,
            description = EXCLUDED.description,
            is_published = EXCLUDED.is_published,
            updated_at = now();

    DELETE FROM mock_test_sections WHERE mock_test_id = v_mock_id;

    INSERT INTO mock_test_sections (mock_test_id, test_id, position) VALUES
        (v_mock_id, 'b29ed569-7e84-5b81-9184-f23b4e16cce1', 1), -- Listening Mock Test 13
        (v_mock_id, 'b4c20e95-ea48-51cb-acf3-92c39473c8b4', 2), -- Reading Mock Test 13
        (v_mock_id, 'a1ea6559-c3d6-5795-82a6-a36ebcebcb70', 3), -- Writing Mock Test 13
        (v_mock_id, '33333333-3333-3333-3333-000000000013', 4) -- Speaking Test 13
    ON CONFLICT (mock_test_id, test_id) DO UPDATE SET position = EXCLUDED.position;
END $$;

COMMIT;
