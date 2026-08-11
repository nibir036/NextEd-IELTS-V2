-- =====================================================================
-- Seed — IELTS Listening Test 77, PART 1 continued (Q8-10)
-- "Who is each play suitable for?" — single_choice, A/B/C, same 3 options
-- repeated per question (same convention as the Part 3 single_choice seed).
-- Run AFTER 0008 + seed_listening_test_77_part1.sql:
--   psql "postgresql://postgres:<pw>@localhost:5432/nexted_ielts" -f migrations/seed_listening_test_77_part1_q8_10.sql
-- Idempotent: rebuilds only this section.
-- =====================================================================
BEGIN;

DO $$
DECLARE
    v_test_id    UUID := '22222222-2222-2222-2222-222222222222';
    v_section_id UUID := '22222222-2222-2222-2222-2222222222a2';
    v_audio TEXT := 'https://firebasestorage.googleapis.com/v0/b/nexted-ielts.firebasestorage.app/o/test_demo%2F77_we.mp3?alt=media&token=d6ac5ec4-e0d6-4fa9-91ab-75f1e2373431';
    v_qid  UUID;
    v_options TEXT := '[{"letter":"A","text":"mainly for children"},{"letter":"B","text":"mainly for adults"},{"letter":"C","text":"suitable for people of all ages"}]';
BEGIN
    DELETE FROM test_sections WHERE id = v_section_id;

    INSERT INTO test_sections (id, test_id, position, title, instructions, audio_url)
    VALUES (
        v_section_id, v_test_id, 1, 'Part 1 — Questions 8-10',
        'Who is each play suitable for? Write the correct letter A, B or C.',
        v_audio
    );

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id, 8, 1, 'single_choice', 'The Mystery of Muldoon', v_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["a"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id, 9, 2, 'single_choice', 'Fire and Flood', v_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["b"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id, 10, 3, 'single_choice', 'Silly Sailor', v_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["c"]');
END $$;

COMMIT;
