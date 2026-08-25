-- =====================================================================
-- Seed — IELTS General Reading Test 1
-- Section 1a: "Your Moulex Iron" (instructions A-F)         Q1-8
-- Section 1b: "Classic Tours — Coach Break Information"     Q9-14
-- Section 2a: "Clubs for Students"                          Q15-21
-- Section 2b: "International Students House"                Q22-29
-- Section 3:  "Paper Recycling"                              Q30-41
--
-- NOTE: Q1-4 in the original paper match four PICTURES of the iron to
-- paragraphs A-F. We don't have image assets for this test, so those
-- four questions are rendered as short text descriptions of what each
-- picture shows instead of an image — same 'matching' mechanic, same
-- answer key, just text-only. (Not every test needs images — map_label
-- is for when a real diagram/photo is hosted; this one doesn't use it.)
--
-- Run AFTER 0008_test_engine.sql:
--   psql "postgresql://postgres:<pw>@localhost:5432/nexted_ielts" -f migrations/seed_reading_test_1.sql
-- Idempotent: re-running rebuilds this test cleanly.
-- =====================================================================
BEGIN;

DO $$
DECLARE
    v_test_id     UUID := '33333333-3333-3333-3333-333333333333';
    v_sec_1a      UUID := '33333333-3333-3333-3333-3333333331a1';
    v_sec_1b      UUID := '33333333-3333-3333-3333-3333333331b1';
    v_sec_2a      UUID := '33333333-3333-3333-3333-3333333332a1';
    v_sec_2b      UUID := '33333333-3333-3333-3333-3333333332b1';
    v_sec_3       UUID := '33333333-3333-3333-3333-333333333301';
    v_qid         UUID;

    v_iron_paragraphs TEXT := '[
        {"letter":"A","text":"Filling the reservoir"},
        {"letter":"B","text":"Temperature and steam control"},
        {"letter":"C","text":"Spray button"},
        {"letter":"D","text":"Pressing button"},
        {"letter":"E","text":"Suits etc."},
        {"letter":"F","text":"Auto-clean"}
    ]';

    v_clubs_options TEXT := '[
        {"letter":"A","text":"Commonwealth Trust"},
        {"letter":"B","text":"Charles Peguy Centre"},
        {"letter":"C","text":"Kensington Committee of Friendship for Overseas Students"},
        {"letter":"D","text":"Royal Overseas League"},
        {"letter":"E","text":"YMCA London Central"},
        {"letter":"F","text":"London Inter-Varsity Club (IVC)"},
        {"letter":"G","text":"The Swimming Club"}
    ]';

    v_tf_options TEXT := '[
        {"letter":"TRUE","text":"True"},
        {"letter":"FALSE","text":"False"},
        {"letter":"NOT GIVEN","text":"Not Given"}
    ]';

    v_iron_passage TEXT := E'A. Filling the reservoir\nYour iron is designed to function using tap water. However, it will last longer if you use distilled water.\n-- Always unplug the iron before filling the reservoir.\n-- Always empty the reservoir after use.\n\nB. Temperature and steam control\nYour Moulex iron has two buttons which control the intensity of heat produced by the iron. You can, therefore, adjust the temperature of the iron and the amount of steam being given off depending upon the type of fabric being ironed.\n-- Turn the steam control to the desired intensity.\n-- Turn the thermostat control to the desired temperature.\nImportant: If your iron produces droplets of water instead of giving off steam, your temperature control is set too low.\n\nC. Spray button\nThis button activates a jet of cold water, which allows you to iron out any unintentional creases. Press the button for one second.\n\nD. Pressing button\nThis button activates a super shot of steam, which momentarily gives you an additional 40g of steam when needed.\nImportant: Do not use this more than five successive times.\n\nE. Suits etc.\nIt is possible to use this iron in a vertical position so that you can remove creases from clothes on coathangers or from curtains. Turning the thermostat control and the steam button to the maximum, hold the iron in a vertical position close to the fabric but without touching it. Hold down the pressing button for a maximum of one second. The steam produced is not always visible but is still able to remove creases.\nImportant: Hold the iron at a sufficient distance from silk and wool to avoid all risk of scorching. Do not attempt to remove creases from an item of clothing that is being worn; always use a coathanger.\n\nF. Auto-clean\nIn order that your iron does not become furred up, Moulex has integrated an auto-clean system and we advise you to use it very regularly (1-2 times per month).\n-- Turn the steam control to the off position.\n-- Fill the reservoir and turn the thermostat control to maximum.\n-- As soon as the indicator light goes out, unplug the iron and, holding it over the sink, turn the steam control to auto-clean. Any calcium deposits will be washed out by the steam. Continue the procedure until the reservoir is empty.';

    v_tours_passage TEXT := E'CLASSIC TOURS — Coach Break Information\n\n1. Luggage\nWe ask you to keep luggage down to one medium-sized suitcase per person, but a small holdall can also be taken on board the coach.\n\n2. Seat Allocation\nRequests for particular seats can be made on most coach breaks when booking, but since allocations are made on a first come first served basis, early booking is advisable. When bookings are made with us you will be offered the best seats that are available on the coach at that time.\n\n3. Travel Documents\nWhen you have paid your deposit we will send to you all the necessary documents and labels, so that you receive them in good time before the coach break departure date. Certain documents, for example, air or boat tickets, may have to be retained and your driver or courier will then issue them to you at the relevant point.\n\n4. Special Diets\nIf you require a special diet, you must inform us at the time of booking with a copy of the diet. This will be notified to the hotel or hotels on your coach break, but on certain coach breaks, the hotels used are tourist class, and whilst offering value for money within the price range, they may not have the full facilities to cope with special diets. Any extra costs incurred must be paid by you to the hotel before departure from the hotel.\n\n5. Accommodation\nMany of our coach breaks now include, within the price, accommodation with private facilities, and this will be indicated on the coach break page. Other coach breaks have a limited number of rooms with private facilities, which, subject to availability, can be reserved and guaranteed at the time of booking — the supplementary charge shown in the price panel will be added to your account. On any coach break, there are only a limited number of single rooms. When a single room is available, it may be subject to a supplementary charge and this will be shown on the brochure page.\n\n6. Entertainment\nSome of our hotels arrange additional entertainment, which could include music, dancing, film shows, etc. The nature and frequency of the entertainment presented is at the discretion of the hotel and, therefore not guaranteed and could be withdrawn if there is a lack of demand or insufficient numbers in the hotel.';

    v_clubs_passage TEXT := E'CLUBS FOR STUDENTS\nThere are a variety of Clubs which provide social and cultural activities for those wishing to meet others with similar interests from the same or from different national backgrounds.\n\nA. Commonwealth Trust\nOrganised discussion meetings, learned talks, cultural events, excursions to places of interest and invitations to major British diary events. Open to overseas visitors and students.\n\nB. Charles Peguy Centre\nFrench youth centre providing advice, support and information to young Europeans aged between 18-30. Facilities include an information and advice service regarding education, work placement and general welfare rights. Moreover the centre holds a database of jobs, accommodation and au pair placements specifically in London.\n\nC. Kensington Committee of Friendship for Overseas Students\nKCOF is the society for young people from all countries. Each month there are some 40 parties, discos, visits to theatres, concerts, walks and other gatherings where you will be able to meet lots of new people. Membership: £35 per year, plus £5 per month.\n\nD. Royal Overseas League\nOpen 365 days per year, this is a club with facilities in London and Edinburgh with restaurants, bars and accommodation. There are branches around the world and 57 reciprocal clubs world-wide.\n\nE. YMCA London Central\nFacilities include photography, art, drama, pottery, language courses, badminton, squash, exercise to music, circuit training, sports clinic, fitness testing and other activities.\n\nF. London Inter-Varsity Club (IVC)\nSocial and sporting activities, including weekends away around Britain and abroad. Most members are young English professionals, but overseas visitors are welcome.\n\nG. [Swimming Club]\nEarly-morning swimming sessions, open to all students, every day of the week from 7am.';

    v_ish_passage TEXT := E'INTERNATIONAL STUDENTS HOUSE\n\nACCOMMODATION\n» Comfortable accommodation for up to 450 people in single, twin, 3/4 bedded and multi-bedded rooms.\n» 44 self-contained flats for married students and families.\n» Long and short stays welcomed.\n\nMEMBERSHIP\nClub membership is open to all full-time students, professional trainees, student nurses and au pairs. Membership costs are kept to an absolute minimum to enable the widest possible access. You can join for as little as one month and for up to one year at a time. Membership entitles you to use the various facilities of the House including the restaurants, student bars and coffee shop. The best way to check out all we have on offer is to drop in any Tuesday evening between 7.15 pm and 8.30 pm for Open House in the Club Room. This is an opportunity for you to meet the staff and other club members, enjoy a free cup of coffee and find out all about what''s going on.\n\nADVICE SERVICE\nThanks to the support of STA Travel and in association with LCOS (the London Conference on Overseas Students), International Students House now provides the service of an International Students Adviser. This new welfare service is open to all students and helps with any personal or practical difficulties they may be experiencing. The Adviser can be seen during the evenings until about 8 pm, Monday to Thursday.\n\nCHRISTMAS & NEW YEAR\nEven if you can''t get home for the holidays, come and stay — the House will be offering reduced accommodation rates for students wishing to spend a few days in London over Christmas.';

    v_paper_passage TEXT := E'PAPER RECYCLING\n\nA. Paper is different from other waste produce because it comes from a sustainable resource: trees. Unlike the minerals and oil used to make plastics and metals, trees are replaceable. Paper is also biodegradable, so it does not pose as much threat to the environment when it is discarded. While 45 out of every 100 tonnes of wood fibre used to make paper in Australia comes from waste paper, the rest comes directly from virgin fibre from forests and plantations. By world standards, this is a good performance since the worldwide average is 33 per cent waste paper.\n\nGovernments have encouraged waste paper collection and sorting schemes, and at the same time, the paper industry has responded by developing new recycling technologies that have paved the way for even greater utilisation of used fibre. As a result, the industry''s use of recycled fibre is expected to increase at twice the rate of virgin fibre over the coming years.\n\nB. Already, waste paper constitutes 70% of paper used for packaging and advances in the technology required to remove ink from the paper have allowed a higher recycled content in newsprint and writing paper. To achieve the benefits of recycling, the community must also contribute. We can help by separating our paper products from the rest of our garbage. This helps prevent the paper from being contaminated by other materials, such as food scraps, which can render it useless for recycling. However, we need to be aware that paper cannot be recycled indefinitely — most paper is down-cycled, meaning a product made from recycled paper is generally of a lower quality than the original. So we should not become complacent about excessive paper consumption simply because we recycle.\n\nC. The process of recycling paper starts with waste paper being collected from homes, schools and offices. This paper is then sorted by hand into different grades. The sorted paper is then mixed with water and broken down into its individual fibres to make a mixture called stock.\n\nD. This stock may contain contaminants such as staples and plastic, so it is cleaned and screened to remove them. The cleaned stock is then repulped, and, if being used to make white paper, it goes through a de-inking process to remove the ink and any other unwanted matter, leaving pure cellulose fibres.\n\nE. Because recycled fibres become shorter and weaker with each cycle, the pulp is often refined and blended with some virgin fibre before it can be made into new, usable paper.\n\nNevertheless, paper recycling is an important economical and environmental practice but one which must be carried out in a rational and viable manner for it to be useful to both industry and the community.';
BEGIN
    -- ---------------------------------------------------------------
    -- Test shell
    -- ---------------------------------------------------------------
    INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
    VALUES (
        v_test_id, 'reading', 'IELTS General Reading Test 1',
        'Three passages: Your Moulex Iron & Classic Tours, Clubs for Students & International Students House, and Paper Recycling. 41 questions covering matching, short answer, multiple choice, True/False/Not Given, and summary/flow-chart completion.',
        'You should spend about 20 minutes on each set of questions below, which are based on the reading passages. Answer all questions.',
        3600, 1, TRUE
    )
    ON CONFLICT (id) DO UPDATE
      SET title = EXCLUDED.title, description = EXCLUDED.description,
          instructions = EXCLUDED.instructions, is_published = EXCLUDED.is_published, updated_at = now();

    DELETE FROM test_sections WHERE test_id = v_test_id;

    -- =================================================================
    -- SECTION 1a — Your Moulex Iron (Q1-8)
    -- =================================================================
    INSERT INTO test_sections (id, test_id, position, title, instructions, passage_text)
    VALUES (
        v_sec_1a, v_test_id, 1, 'Your Moulex Iron',
        'Questions 1-4: Match each description below to the appropriate section of the instructions (A-F). Questions 5-8: Answer using NO MORE THAN THREE WORDS.',
        v_iron_passage
    );

    -- Q1-4: matching (picture -> paragraph), described in text since no image asset is hosted
    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_1a, 1, 1, 'matching', 'Picture 1: a hand pressing a button on the iron as a strong burst of steam is released', v_iron_paragraphs::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["d"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_1a, 2, 2, 'matching', 'Picture 2: water being poured out of the iron''s reservoir after use', v_iron_paragraphs::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["a"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_1a, 3, 3, 'matching', 'Picture 3: a fine jet of cold water being sprayed onto the fabric', v_iron_paragraphs::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["c"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_1a, 4, 4, 'matching', 'Picture 4: the iron held upright, close to a garment hanging on a coathanger', v_iron_paragraphs::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["e"]');

    -- Q5-8: short answer, NO MORE THAN THREE WORDS
    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_1a, 5, 5, 'text_input', 'What sort of water are you advised to use?', 3);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["distilled water","distilled"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_1a, 6, 6, 'text_input', 'What factor makes you decide on the quantity of steam to use?', 3);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["the type of fabric","type of fabric","fabric"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_1a, 7, 7, 'text_input', 'What should you do if your iron starts to drip water?', 3);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["turn up temperature","increase temperature","turn up the temperature","increase the temperature"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_1a, 8, 8, 'text_input', 'What could damage your iron if you do not clean it?', 3);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["calcium deposits","furring up"]');

    -- =================================================================
    -- SECTION 1b — Classic Tours: Coach Break Information (Q9-14)
    -- =================================================================
    INSERT INTO test_sections (id, test_id, position, title, instructions, passage_text)
    VALUES (
        v_sec_1b, v_test_id, 2, 'Classic Tours — Coach Break Information',
        'Choose the appropriate letter A-D for each question.',
        v_tours_passage
    );

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_1b, 9, 1, 'single_choice', 'If you want to sit at the front of the coach —',
        '[{"letter":"A","text":"ask when you get on the coach."},{"letter":"B","text":"arrive early on the departure date."},{"letter":"C","text":"book your seat well in advance."},{"letter":"D","text":"avoid travelling at peak times."}]'::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["c"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_1b, 10, 2, 'single_choice', 'Your air tickets —',
        '[{"letter":"A","text":"will be sent to your departure point."},{"letter":"B","text":"must be collected before leaving."},{"letter":"C","text":"will be enclosed with other documents."},{"letter":"D","text":"may be held by your coach driver."}]'::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["d"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_1b, 11, 3, 'single_choice', 'If you need a special diet, you should —',
        '[{"letter":"A","text":"inform the hotel when you arrive."},{"letter":"B","text":"pay extra with the booking."},{"letter":"C","text":"tell the coach company."},{"letter":"D","text":"book tourist class."}]'::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["c"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_1b, 12, 4, 'single_choice', 'It may be necessary to pay extra for —',
        '[{"letter":"A","text":"a bathroom."},{"letter":"B","text":"boat tickets."},{"letter":"C","text":"additional luggage."},{"letter":"D","text":"entertainment."}]'::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["a"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_1b, 13, 5, 'single_choice', 'Entertainment is available —',
        '[{"letter":"A","text":"at all hotels."},{"letter":"B","text":"if there is a demand."},{"letter":"C","text":"upon request."},{"letter":"D","text":"for an additional cost."}]'::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["b"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_1b, 14, 6, 'single_choice', 'With every booking, Classic Tours guarantees you will be able to —',
        '[{"letter":"A","text":"request high-quality meals."},{"letter":"B","text":"take hand luggage on the coach."},{"letter":"C","text":"use your own personal bathroom."},{"letter":"D","text":"see a film if you want to."}]'::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["b"]');

    -- =================================================================
    -- SECTION 2a — Clubs for Students (Q15-21)
    -- =================================================================
    INSERT INTO test_sections (id, test_id, position, title, instructions, passage_text)
    VALUES (
        v_sec_2a, v_test_id, 3, 'Clubs for Students',
        'Which club would you contact for each requirement below? Write the appropriate letter A-G. You may use each letter more than once.',
        v_clubs_passage
    );

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_2a, 15, 1, 'matching', 'You would like to take Spanish classes.', v_clubs_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["e"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_2a, 16, 2, 'matching', 'You want to join a club that has international branches.', v_clubs_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["d"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_2a, 17, 3, 'matching', 'You would like an opportunity to speak in public.', v_clubs_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["a"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_2a, 18, 4, 'matching', 'You would like to take part in amateur theatrical productions.', v_clubs_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["e"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_2a, 19, 5, 'matching', 'You want to visit some famous sites with a group of other students.', v_clubs_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["a"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_2a, 20, 6, 'matching', 'You are interested in finding out about part-time work.', v_clubs_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["b"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_2a, 21, 7, 'matching', 'You want to meet some English people who have started their careers.', v_clubs_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["f"]');

    -- =================================================================
    -- SECTION 2b — International Students House (Q22-29) — True/False/Not Given
    -- =================================================================
    INSERT INTO test_sections (id, test_id, position, title, instructions, passage_text)
    VALUES (
        v_sec_2b, v_test_id, 4, 'International Students House',
        'Do the following statements agree with the information given in the passage? Write TRUE, FALSE, or NOT GIVEN.',
        v_ish_passage
    );

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_2b, 22, 1, 'single_choice', 'The club has long-term dormitory accommodation.', v_tf_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["true"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_2b, 23, 2, 'single_choice', 'Membership must be renewed monthly.', v_tf_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["false"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_2b, 24, 3, 'single_choice', 'The club provides subsidised restaurant meals.', v_tf_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["not given"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_2b, 25, 4, 'single_choice', 'The club is open to non-members on Tuesday evenings.', v_tf_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["true"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_2b, 26, 5, 'single_choice', 'STA Travel helps finance the Students Adviser.', v_tf_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["true"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_2b, 27, 6, 'single_choice', 'The services of the Students Adviser are free to all club members.', v_tf_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["not given"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_2b, 28, 7, 'single_choice', 'You must make an appointment to see the Students Adviser.', v_tf_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["not given"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, options)
      VALUES (v_qid, v_sec_2b, 29, 8, 'single_choice', 'There will be a surcharge for accommodation over the Christmas period.', v_tf_options::jsonb);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["false"]');

    -- =================================================================
    -- SECTION 3 — Paper Recycling (Q30-41) — summary + flow-chart completion
    -- =================================================================
    INSERT INTO test_sections (id, test_id, position, title, instructions, passage_text)
    VALUES (
        v_sec_3, v_test_id, 5, 'Paper Recycling',
        'Questions 30-36: Complete the summary using ONE OR TWO WORDS from the passage. Questions 37-41: Complete the flow chart using ONE OR TWO WORDS from the passage.',
        v_paper_passage
    );

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_3, 30, 1, 'text_input', 'Paper differs from other waste products in that firstly it comes from a resource which is ____', 2);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["sustainable","replaceable"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_3, 31, 2, 'text_input', 'and secondly it is less threatening to our environment when we throw it away because it is ____', 2);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["biodegradable"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_3, 32, 3, 'text_input', 'Although Australia''s record in the re-use of waste paper is good, it is still necessary to use a combination of recycled fibre and ____ to make new paper', 2);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["virgin fibre","pulp"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_3, 33, 4, 'text_input', 'The paper industry has contributed positively and people have also been encouraged by ____ to collect their waste on a regular basis', 2);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["governments","the government","government"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_3, 34, 5, 'text_input', 'One major difficulty is the removal of ink from used paper but ____ are being made in this area', 2);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["advances"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_3, 35, 6, 'text_input', 'However, we need to learn to accept paper which is generally of a lower ____ than before', 2);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["quality"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_3, 36, 7, 'text_input', 'and to sort our waste paper by removing ____ before discarding it for collection', 2);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["contaminants"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_3, 37, 8, 'text_input', 'Flow chart — Step 1: Waste paper is collected from homes, schools and ____', 2);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["offices"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_3, 38, 9, 'text_input', 'Flow chart — Step 2: The paper is ____ by hand into different grades', 2);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["sorted"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_3, 39, 10, 'text_input', 'Flow chart — Step 3: The stock is cleaned, screened, and ____', 2);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["repulped","re-pulped","pulped"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_3, 40, 11, 'text_input', 'Flow chart — Step 4: For white paper, the stock is put through a process to ____', 2);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["de-ink","remove ink","make white"]');

    v_qid := uuid_generate_v4();
    INSERT INTO test_questions (id, section_id, qnumber, position, type, prompt, max_words)
      VALUES (v_qid, v_sec_3, 41, 12, 'text_input', 'Flow chart — Step 5: The pulp is ____ and blended with virgin fibre before being made into new paper', 2);
    INSERT INTO test_answers (question_id, accepted) VALUES (v_qid, '["refined"]');
END $$;

COMMIT;
