-- =====================================================================
-- Seed — IELTS Listening Test 77, PART 3 "choose TWO letters" (Q21-26)
-- Three separate 2-mark groups. Each group is ONE test_questions row
-- (not two) with points = 2, because scoring.ts's isCorrect() for
-- multi_choice compares the FULL submitted set against the FULL accepted
-- set at once — splitting into two qnumber rows would break that contract
-- (there's no way to award partial credit per letter under this scheme,
-- which correctly matches real IELTS "both or nothing" marking for these).
-- qnumber is set to the first number in each pair; the prompt/UI should
-- present both question numbers together as one 2-answer checkbox group.
--
-- Run AFTER 0008 + earlier seeds:
--   psql "postgresql://postgres:<pw>@localhost:5432/nexted_ielts" -f migrations/seed_listening_test_77_part3_multi.sql
-- Idempotent: rebuilds only this section.
-- =====================================================================
BEGIN;

DO $$
DECLARE
    v_test_id    UUID := '22222222-2222-2222-2222-222222222222';
    v_section_id UUID := '22222222-2222-2222-2222-2222222222b1';
    v_audio TEXT := 'https://firebasestorage.googleapis.com/v0/b/nexted-ielts.firebasestorage.app/o/test_demo%2F77_we.mp3?alt=media&token=d6ac5ec4-e0d6-4fa9-91ab-75f1e2373431';
    v_qid  UUID;
BEGIN
    DELETE FROM test_sections WHERE id = v_section_id;

    INSERT INTO test_sections (id, test_id, position, title, instructions, audio_url)
    VALUES (
        v_section_id, v_test_id, 3, 'Part 3 — Questions 21-26',
        'Choose TWO letters, A-E, for each question group.',
        v_audio
    );

    -- Q21-22
    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id, 21, 1, 'multi_choice',
        'Questions 21 and 22: Which TWO characteristics were shared by the subjects of Joanna''s psychology study?',
        '[{"letter":"A","text":"They had all won prizes for their music"},{"letter":"B","text":"They had all made music recordings"},{"letter":"C","text":"They were all under 27 years old"},{"letter":"D","text":"They had all toured internationally"},{"letter":"E","text":"They all played a string instrument"}]'::jsonb);
    INSERT INTO test_answers (question_id, accepted, points) VALUES (v_qid, '["b","d"]', 2);

    -- Q23-24
    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id, 23, 2, 'multi_choice',
        'Questions 23 and 24: Which TWO points does Joanna make about her use of telephone interviews?',
        '[{"letter":"A","text":"It meant rich data could be collected"},{"letter":"B","text":"It allowed the involvement of top performers"},{"letter":"C","text":"It led to a stressful atmosphere at times"},{"letter":"D","text":"It meant interview times had to be limited"},{"letter":"E","text":"It caused some technical problems"}]'::jsonb);
    INSERT INTO test_answers (question_id, accepted, points) VALUES (v_qid, '["a","b"]', 2);

    -- Q25-26
    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_section_id, 25, 3, 'multi_choice',
        'Questions 25 and 26: Which TWO topics did Joanna originally intend to investigate in her research?',
        '[{"letter":"A","text":"regulations concerning concert dress"},{"letter":"B","text":"audience reactions to the dress of performers"},{"letter":"C","text":"changes in performer attitudes to concert dress"},{"letter":"D","text":"how choice of dress relates to performer roles"},{"letter":"E","text":"links between musical instrument and dress choice"}]'::jsonb);
    INSERT INTO test_answers (question_id, accepted, points) VALUES (v_qid, '["b","e"]', 2);
END $$;

COMMIT;
