-- =====================================================================
-- Seed — IELTS Listening Test 77, PART 2 (Q11-20)
-- Q11-16: matching, 7 comments (A-G) matched to 6 museum collections.
-- Q17-20: map_label, basement plan letters (A-H) matched to 4 facilities.
--
-- ⚠️ Q17-20 needs a real image_url for the basement floor plan — left NULL
-- below. Upload the plan image the same way the audio was uploaded to
-- Firebase Storage, then update test_sections.image_url for section
-- '22222222-2222-2222-2222-2222222222a6' with the resulting URL.
--
-- Run AFTER 0008 + earlier Part 1 seeds:
--   psql "postgresql://postgres:<pw>@localhost:5432/nexted_ielts" -f migrations/seed_listening_test_77_part2.sql
-- Idempotent: rebuilds only these two sections.
-- =====================================================================
BEGIN;

DO $$
DECLARE
    v_test_id      UUID := '22222222-2222-2222-2222-222222222222';
    v_section_id_a UUID := '22222222-2222-2222-2222-2222222222a5'; -- Q11-16 matching
    v_section_id_b UUID := '22222222-2222-2222-2222-2222222222a6'; -- Q17-20 map_label
    v_audio TEXT := 'https://firebasestorage.googleapis.com/v0/b/nexted-ielts.firebasestorage.app/o/test_demo%2F77_we.mp3?alt=media&token=d6ac5ec4-e0d6-4fa9-91ab-75f1e2373431';
    v_qid  UUID;
    v_comments TEXT := '[
        {"letter":"A","text":"was given by one person"},
        {"letter":"B","text":"was recently publicized in the media"},
        {"letter":"C","text":"includes some items given by members of the public"},
        {"letter":"D","text":"includes some items given by the artists"},
        {"letter":"E","text":"includes the most popular exhibits in the museum"},
        {"letter":"F","text":"is the largest of its kind in the country"},
        {"letter":"G","text":"has had some of its contents relocated"}
    ]';
    v_rooms TEXT := '[{"letter":"A"},{"letter":"B"},{"letter":"C"},{"letter":"D"},{"letter":"E"},{"letter":"F"},{"letter":"G"},{"letter":"H"}]';
BEGIN
    -- ---- Q11-16: matching ----
    DELETE FROM test_sections WHERE id = v_section_id_a;

    INSERT INTO test_sections (id, test_id, position, title, instructions, audio_url)
    VALUES (
        v_section_id_a, v_test_id, 2, 'Part 2 — Questions 11-16',
        'What does the speaker say about each of the following collections? Choose SIX answers from the box and write the correct letter A-G.',
        v_audio
    );

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id_a, 11, 1, 'matching', '20th- and 21st-century paintings', v_comments::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["e"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id_a, 12, 2, 'matching', '19th-century paintings', v_comments::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["d"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id_a, 13, 3, 'matching', 'Sculptures', v_comments::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["g"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id_a, 14, 4, 'matching', '''Around the world'' exhibition', v_comments::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["b"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id_a, 15, 5, 'matching', 'Coins', v_comments::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["c"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id_a, 16, 6, 'matching', 'Porcelain and glass', v_comments::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["a"]');

    -- ---- Q17-20: map_label ----
    DELETE FROM test_sections WHERE id = v_section_id_b;

    INSERT INTO test_sections (id, test_id, position, title, instructions, audio_url, image_url)
    VALUES (
        v_section_id_b, v_test_id, 2, 'Part 2 — Questions 17-20 (Basement of museum)',
        'Label the plan below. Write the correct letter A-H next to questions 17-20.',
        v_audio, NULL -- TODO: set to the hosted basement plan image URL
    );

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id_b, 17, 1, 'map_label', 'restaurant', v_rooms::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["f"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id_b, 18, 2, 'map_label', 'café', v_rooms::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["h"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id_b, 19, 3, 'map_label', 'baby-changing facilities', v_rooms::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["c"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id_b, 20, 4, 'map_label', 'cloakroom', v_rooms::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["b"]');
END $$;

COMMIT;
