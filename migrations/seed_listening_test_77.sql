-- =====================================================================
-- Seed — IELTS Listening Test 77 (SPINE SLICE: Part 4, Q31-40 only)
-- Note completion, "ONE WORD ONLY" — text_input, exact match with
-- accepted variants. Audio hosted on Firebase.
-- Run AFTER 0008_test_engine.sql:
--   psql "postgresql://postgres:<pw>@localhost:5432/nexted_ielts" -f migrations/seed_listening_test_77.sql
-- Idempotent: re-running rebuilds this test cleanly.
-- =====================================================================
BEGIN;

DO $$
DECLARE
    v_test_id    UUID := '22222222-2222-2222-2222-222222222222';
    v_section_id UUID := '22222222-2222-2222-2222-2222222222a4';
    v_audio TEXT := 'https://firebasestorage.googleapis.com/v0/b/nexted-ielts.firebasestorage.app/o/test_demo%2F77_we.mp3?alt=media&token=d6ac5ec4-e0d6-4fa9-91ab-75f1e2373431';
    v_qid  UUID;
BEGIN
    INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
    VALUES (
        v_test_id, 'listening', 'IELTS Listening Test 77',
        'Part 4 note completion on soil and carbon dioxide. Listen once and complete the notes with ONE WORD ONLY.',
        'You will hear the recording once. Complete the notes below. Write ONE WORD ONLY for each answer.',
        1680, 1, TRUE
    )
    ON CONFLICT (id) DO UPDATE
      SET title = EXCLUDED.title, description = EXCLUDED.description,
          instructions = EXCLUDED.instructions, is_published = EXCLUDED.is_published, updated_at = now();

    DELETE FROM test_sections WHERE test_id = v_test_id;

    INSERT INTO test_sections (id, test_id, position, title, instructions, audio_url)
    VALUES (
        v_section_id, v_test_id, 4, 'Part 4 — Questions 31-40',
        'The use of soil to reduce carbon dioxide (CO2) in the atmosphere. Complete the notes below. Write ONE WORD ONLY for each answer.',
        v_audio
    );

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 31, 1, 'text_input', 'Rattan Lal: Erosion is more likely in soil that is ____', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["dry"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 32, 2, 'text_input', 'Lal found soil in Africa that was very ____', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["hard"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 33, 3, 'text_input', 'Soil and Carbon: Plants turn CO2 from the air into carbon based substance such as ____', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["sugars"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 34, 4, 'text_input', 'Some CO2 moves from the ____ of plants to microbes in soil', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["roots"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 35, 5, 'text_input', 'Regenerative agriculture: uses established practices to make sure soil remains fertile and ____', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["moist","wet","damp"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 36, 6, 'text_input', 'e.g. through year-round planting and increasing the ____ of plants that are grown', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["variety"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 37, 7, 'text_input', 'California study: taking place on a big ____ farm', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["cattle"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 38, 8, 'text_input', 'uses compost made from waste from agriculture and ____', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["gardens"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 39, 9, 'text_input', 'Australia study: aims to increase soil carbon by using ____ that are always green', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["grasses"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_section_id, 40, 10, 'text_input', 'Future developments may include giving farmers ____ for carbon storage, as well as their produce', 1);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["payment","money"]');
END $$;

COMMIT;
