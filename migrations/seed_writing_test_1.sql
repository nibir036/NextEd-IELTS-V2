-- =====================================================================
-- Seed — IELTS Writing Test 1 (one writing "set": Task 1 + Task 2)
--
-- Model:
--   * 1 row in `tests`            → the writing test/set
--   * `test_resources` rows       → the two task prompts + Task 1's map image
--       kind='task_prompt', position=1  → Task 1 text
--       kind='task_image',  position=1  → Task 1 image (Firebase public URL)
--       kind='task_prompt', position=2  → Task 2 text
--
-- BEFORE RUNNING: replace the Firebase URL below if the image moves.
-- Idempotent: re-running replaces this test's resources cleanly.
--
-- Run: psql "postgresql://postgres:<pw>@localhost:5432/nexted_ielts" -f migrations/seed_writing_test_1.sql
-- =====================================================================

BEGIN;

DO $$
DECLARE
    v_test_id UUID := '11111111-1111-1111-1111-111111111111';
    v_image_url TEXT := 'https://firebasestorage.googleapis.com/v0/b/nexted-ielts.firebasestorage.app/o/test_demo%2FTest1_img1.png?alt=media&token=77e32e53-8c9a-4250-96c3-6627c7da5a9e';
BEGIN
    INSERT INTO tests (id, skill, title, instructions, duration_seconds, position, is_published)
    VALUES (
        v_test_id,
        'writing',
        'IELTS Writing Test 1',
        'Complete both tasks. Task 1: write at least 150 words. Task 2: write at least 250 words. You should spend about 20 minutes on Task 1 and 40 minutes on Task 2.',
        3600,
        1,
        TRUE
    )
    ON CONFLICT (id) DO UPDATE
        SET title = EXCLUDED.title,
            instructions = EXCLUDED.instructions,
            duration_seconds = EXCLUDED.duration_seconds,
            is_published = EXCLUDED.is_published,
            updated_at = now();

    DELETE FROM test_resources WHERE test_id = v_test_id;

    INSERT INTO test_resources (test_id, kind, content, position)
    VALUES (
        v_test_id,
        'task_prompt',
        'The two maps below show road access to a city hospital in 2007 and 2010. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
        1
    );

    INSERT INTO test_resources (test_id, kind, url, position)
    VALUES (
        v_test_id,
        'task_image',
        v_image_url,
        1
    );

    INSERT INTO test_resources (test_id, kind, content, position)
    VALUES (
        v_test_id,
        'task_prompt',
        'Living in a country where you have to speak a foreign language can cause serious social problems, as well as practical problems. To what extent do you agree or disagree with this statement? Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
        2
    );
END $$;

COMMIT;