-- =====================================================================
-- Seed - IELTS Listening Test 77, PART 3 single-choice (Q27-30)
-- Multiple choice A/B/C, choose one. type = single_choice.
-- options JSON: [{"letter":"A","text":"..."}, ...]
-- answer accepted: ["<correct letter lowercased>"]
-- Run AFTER 0008 + the earlier seeds:
--   psql "postgresql://postgres:1234@localhost:5432/nexted_ielts" -f migrations/seed_listening_test_77_part3_mc.sql
-- Idempotent: rebuilds only this Part 3 (single-choice) section.
-- =====================================================================
BEGIN;

DO $$
DECLARE
    v_test_id    UUID := '22222222-2222-2222-2222-222222222222';
    v_section_id UUID := '22222222-2222-2222-2222-2222222222b3';
    v_audio TEXT := 'https://firebasestorage.googleapis.com/v0/b/nexted-ielts.firebasestorage.app/o/test_demo%2F77_we.mp3?alt=media&token=d6ac5ec4-e0d6-4fa9-91ab-75f1e2373431';
    v_qid  UUID;
BEGIN
    DELETE FROM test_sections WHERE id = v_section_id;

    INSERT INTO test_sections (id, test_id, position, title, instructions, audio_url)
    VALUES (
        v_section_id, v_test_id, 3, 'Part 3 - Questions 27-30',
        'Choose the correct letter, A, B or C.',
        v_audio
    );

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id, 27, 1, 'single_choice',
        'Joanna concentrated on women performers because',
        '[{"letter":"A","text":"women are more influenced by fashion"},{"letter":"B","text":"women''s dress has led to more controversy"},{"letter":"C","text":"women''s code of dress is less strict than men''s"}]');
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["c"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id, 28, 2, 'single_choice',
        'Mike Frost''s article suggests that in popular music, women''s dress is affected by',
        '[{"letter":"A","text":"their wish to be taken seriously"},{"letter":"B","text":"their tendency to copy each other"},{"letter":"C","text":"their reaction to the masculine nature of the music"}]');
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["a"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id, 29, 3, 'single_choice',
        'What did Joanna''s subjects say about the audience at a performance?',
        '[{"letter":"A","text":"The musicians'' choice of clothing is linked to respect for the audience"},{"letter":"B","text":"The clothing should not distract the audience from the music"},{"letter":"C","text":"The audience should make the effort to dress appropriately"}]');
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["a"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id, 30, 4, 'single_choice',
        'According to the speakers, musicians could learn from sports scientists about',
        '[{"letter":"A","text":"the importance of clothing for physical freedom"},{"letter":"B","text":"the part played by clothing in improving performance"},{"letter":"C","text":"the way clothing may protect against physical injury"}]');
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["c"]');
END $$;

COMMIT;