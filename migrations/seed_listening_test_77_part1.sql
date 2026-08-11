-- =====================================================================
-- Seed — IELTS Listening Test 77, PART 1 (Q1-7)
-- Table completion, "ONE WORD AND/OR A NUMBER" — text_input.
-- Adds Part 1 to the existing test (Part 4 already seeded).
-- Same audio; a section carries the audio once at the test level would be
-- ideal, but per-section audio_url is fine (same file URL).
--
-- Run AFTER 0008 + seed_listening_test_77.sql:
--   psql "postgresql://postgres:1234@localhost:5432/nexted_ielts" -f migrations/seed_listening_test_77_part1.sql
-- Idempotent: rebuilds only the Part 1 section.
-- =====================================================================
BEGIN;

DO $$
DECLARE
    v_test_id    UUID := '22222222-2222-2222-2222-222222222222';
    v_section_id UUID := '22222222-2222-2222-2222-2222222222a1';  -- Part 1
    v_audio TEXT := 'https://firebasestorage.googleapis.com/v0/b/nexted-ielts.firebasestorage.app/o/test_demo%2F77_we.mp3?alt=media&token=d6ac5ec4-e0d6-4fa9-91ab-75f1e2373431';
    v_qid  UUID;
BEGIN
    -- Rebuild ONLY the Part 1 section (leave Part 4 intact).
    DELETE FROM test_sections WHERE id = v_section_id;

    INSERT INTO test_sections (id, test_id, position, title, instructions, audio_url)
    VALUES (
        v_section_id, v_test_id, 1, 'Part 1 — Questions 1-7',
        'Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.',
        v_audio
    );

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 1, 1, 'text_input', 'Jazz band — Venue: the ____ school', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["secondary"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 2, 2, 'text_input', 'Jazz band — Notes: also appearing Carolyn Hart (plays the ____)', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["flute"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 3, 3, 'text_input', 'Duck races — Venue: start behind the ____', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["cinema"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 4, 4, 'text_input', 'Duck races — Notes: prize is tickets for ____ held at the end of the festival', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["concert"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 5, 5, 'text_input', 'Duck races — Notes: ducks can be bought in ____', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["market"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 6, 6, 'text_input', 'Flower show — Venue: ____ Hall', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["bythwaite"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 7, 7, 'text_input', 'Flower show — Notes: prizes presented at 5 pm by a well known ____', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["actor"]');
END $$;

COMMIT;