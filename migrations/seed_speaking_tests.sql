-- =====================================================================
-- Seed — IELTS Speaking Tests 1-80
--
-- Model (mirrors the Writing seed pattern in migrations/seed_writing_test_1.sql):
--   * 1 row in `tests`             -> the speaking test (skill='speaking')
--   * 1 row in `test_resources`     -> kind='speaking_script', content = JSON
--       { part1: { intro, topics: [{topic, questions[]}] },
--         part2: { cueCardTitle, points[], roundingOff[] },
--         part3: { topics: [{topic, questions[]}] } }
--
-- Idempotent: safe to re-run (ON CONFLICT (id) DO UPDATE / DELETE+INSERT).
-- Run: psql "$DATABASE_URL" -f migrations/seed_speaking_tests.sql
-- =====================================================================

BEGIN;

-- Test 1 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000001',
    'speaking',
    'IELTS Speaking Test 1',
    'Part 1: Work or studies, Your home town, Free time. Part 2: Describe a person who has had an important influence on your life. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    1,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000001' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000001', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. My name is [examiner]. Can you tell me your full name, please? What can I call you? Can you tell me where you are from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Work or studies", "questions": ["Do you work, or are you a student?", "Why did you choose that job or subject?", "What do you enjoy most about it?", "Is there anything you would like to change about your work or studies?"]}, {"topic": "Your home town", "questions": ["Where is your home town?", "What is it best known for?", "Has it changed much in recent years?", "Would you recommend it to a visitor? Why or why not?"]}, {"topic": "Free time", "questions": ["What do you usually do in your free time?", "Do you prefer to spend free time alone or with other people?", "Has the way you spend your free time changed since you were a child?", "Do you think people today have enough free time?"]}]}, "part2": {"cueCardTitle": "Describe a person who has had an important influence on your life.", "points": ["who this person is", "how you know them", "what kind of influence they have had on you", "and explain why this influence has been so important."], "roundingOff": ["Do you still see this person often?", "Do you think they know how much they have influenced you?"]}, "part3": {"topics": [{"topic": "Influence and role models", "questions": ["What kinds of people tend to influence young people the most today?", "Do you think parents or friends have a greater influence on children?", "How has the influence of celebrities on society changed over time?"]}, {"topic": "Guidance and mentoring", "questions": ["Why is it valuable to have a mentor or guide in life?", "Should schools do more to provide students with mentors?", "Do you think people rely too much on the advice of others rather than deciding for themselves?"]}]}}', 1);

-- Test 2 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000002',
    'speaking',
    'IELTS Speaking Test 2',
    'Part 1: Where you live, Weather and seasons, Photographs. Part 2: Describe a place you have visited that you found particularly beautiful. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    2,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000002' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000002', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Where you live", "questions": ["Do you live in a house or an apartment?", "What is your favourite room in your home?", "Is there anything you would like to change about where you live?", "Would you like to move somewhere else in the future?"]}, {"topic": "Weather and seasons", "questions": ["What is the weather like where you live?", "Which season do you enjoy the most?", "Does the weather ever affect your mood or your plans?", "Do you prefer hot weather or cold weather?"]}, {"topic": "Photographs", "questions": ["Do you like taking photographs?", "What kinds of things do you usually photograph?", "Do you prefer taking photos or being in them?", "Do you keep printed photos, or only digital ones?"]}]}, "part2": {"cueCardTitle": "Describe a place you have visited that you found particularly beautiful.", "points": ["where this place is", "when you visited it", "what you did there", "and explain why you found it so beautiful."], "roundingOff": ["Would you like to go back to this place?", "Would you recommend it to other people?"]}, "part3": {"topics": [{"topic": "Beautiful and natural places", "questions": ["Why do you think people are attracted to beautiful natural scenery?", "Are natural places or man made places usually more beautiful, in your view?", "How can a country protect its most beautiful locations from damage?"]}, {"topic": "Tourism and its effects", "questions": ["What are the benefits of tourism for a beautiful area?", "Can too many tourists spoil a place? How?", "Do you think travel will become more or less popular in the future?"]}]}}', 1);

-- Test 3 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000003',
    'speaking',
    'IELTS Speaking Test 3',
    'Part 1: Technology, Shopping, Cooking and food. Part 2: Describe a useful object in your home that you could not live without. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    3,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000003' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000003', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Technology", "questions": ["How often do you use a computer or a smartphone?", "What do you mainly use technology for?", "Is there any technology you would like to learn to use better?", "Do you think you spend too much time using devices?"]}, {"topic": "Shopping", "questions": ["Do you enjoy shopping?", "Do you prefer shopping in stores or online?", "Who does most of the shopping in your household?", "Has the way you shop changed in recent years?"]}, {"topic": "Cooking and food", "questions": ["Do you like cooking?", "What kinds of food do you usually eat?", "Did you learn to cook from anyone in particular?", "Do you prefer eating at home or eating out?"]}]}, "part2": {"cueCardTitle": "Describe a useful object in your home that you could not live without.", "points": ["what the object is", "how long you have had it", "how you use it", "and explain why it is so useful to you."], "roundingOff": ["Would it be easy to replace this object?", "Do other people in your home use it too?"]}, "part3": {"topics": [{"topic": "Everyday objects and technology", "questions": ["Why do some everyday objects become essential in our lives?", "How have household objects changed over the past few decades?", "Do you think people own too many possessions nowadays?"]}, {"topic": "Consumer habits", "questions": ["Why do some people always want to buy the newest products?", "What are the disadvantages of a throwaway culture?", "How could people be encouraged to repair things rather than replace them?"]}]}}', 1);

-- Test 4 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000004',
    'speaking',
    'IELTS Speaking Test 4',
    'Part 1: Travel, Transport, Holidays. Part 2: Describe a memorable journey you have taken. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    4,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000004' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000004', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What should I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Travel", "questions": ["Do you like travelling?", "What is the best place you have ever travelled to?", "Do you prefer travelling alone or with others?", "How do you usually plan your trips?"]}, {"topic": "Transport", "questions": ["How do you usually get around your town or city?", "What is the public transport like where you live?", "Do you prefer public transport or private vehicles?", "How could transport in your area be improved?"]}, {"topic": "Holidays", "questions": ["What do you usually do during holidays?", "Do you prefer relaxing holidays or active ones?", "Do you like to visit new places or return to familiar ones?", "Are holidays important to you? Why?"]}]}, "part2": {"cueCardTitle": "Describe a memorable journey you have taken.", "points": ["where you went", "who you went with", "what happened during the journey", "and explain why it was so memorable."], "roundingOff": ["Would you like to take that journey again?", "Do you often think about this journey?"]}, "part3": {"topics": [{"topic": "Reasons for travelling", "questions": ["Why do people travel to distant places rather than staying near home?", "What can people learn from travelling to other countries?", "Do you think the reasons people travel have changed over time?"]}, {"topic": "Modern travel", "questions": ["How has technology changed the way people travel?", "What are the advantages and disadvantages of very cheap air travel?", "Do you think space travel will ever be common for ordinary people?"]}]}}', 1);

-- Test 5 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000005',
    'speaking',
    'IELTS Speaking Test 5',
    'Part 1: Studies and learning, Sports and exercise, Music. Part 2: Describe a skill you would like to learn. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    5,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000005' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000005', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where are you from? May I see your identification? Thank you.", "topics": [{"topic": "Studies and learning", "questions": ["Are you studying anything at the moment?", "What subjects did you enjoy most at school?", "Do you prefer studying in the morning or in the evening?", "Do you like studying alone or in a group?"]}, {"topic": "Sports and exercise", "questions": ["Do you play any sports?", "How often do you exercise?", "Did you play more sports when you were younger?", "Do you prefer watching sport or taking part in it?"]}, {"topic": "Music", "questions": ["What kind of music do you like?", "When do you usually listen to music?", "Have your musical tastes changed over the years?", "Can you play any musical instruments?"]}]}, "part2": {"cueCardTitle": "Describe a skill you would like to learn.", "points": ["what the skill is", "how you would learn it", "how long you think it would take", "and explain why you would like to learn this skill."], "roundingOff": ["Do you know anyone who already has this skill?", "Do you think you will learn it soon?"]}, "part3": {"topics": [{"topic": "Learning new skills", "questions": ["Why do some adults find it harder to learn new skills than children?", "Is it better to learn a skill from a teacher or by yourself?", "Which skills do you think are most useful for young people today?"]}, {"topic": "Skills and work", "questions": ["How important are practical skills compared with academic qualifications?", "Do you think schools teach students the skills they really need for life?", "How might the skills that employers value change in the future?"]}]}}', 1);

-- Test 6 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000006',
    'speaking',
    'IELTS Speaking Test 6',
    'Part 1: Reading, The internet, Weekends. Part 2: Describe a book you have read that you enjoyed. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    6,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000006' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000006', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where do you come from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Reading", "questions": ["Do you enjoy reading?", "What kinds of books or articles do you usually read?", "Do you prefer reading on paper or on a screen?", "Did you read a lot as a child?"]}, {"topic": "The internet", "questions": ["What do you mainly use the internet for?", "How much time do you spend online each day?", "Do you think the internet has made life easier?", "Is there anything about the internet that you dislike?"]}, {"topic": "Weekends", "questions": ["What do you usually do at the weekend?", "Do you prefer to stay in or go out at weekends?", "Are your weekends usually busy or relaxing?", "Would you like to change how you spend your weekends?"]}]}, "part2": {"cueCardTitle": "Describe a book you have read that you enjoyed.", "points": ["what the book was about", "when you read it", "why you decided to read it", "and explain why you enjoyed it so much."], "roundingOff": ["Would you read this book again?", "Would you recommend it to a friend?"]}, "part3": {"topics": [{"topic": "Reading and books", "questions": ["Why do you think some people read far more than others?", "What are the benefits of reading for young people?", "Do you think printed books will disappear in the future?"]}, {"topic": "Stories and information", "questions": ["How do people prefer to get their information nowadays?", "Are stories still an important way of learning about life?", "Do you think reading fiction is as valuable as reading factual books?"]}]}}', 1);

-- Test 7 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000007',
    'speaking',
    'IELTS Speaking Test 7',
    'Part 1: Friends, Neighbours, Daily routine. Part 2: Describe a time when you helped someone. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    7,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000007' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000007', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where are you from? May I see your identification? Thank you.", "topics": [{"topic": "Friends", "questions": ["Do you have a large group of friends or a few close ones?", "How did you meet your closest friend?", "What qualities do you value most in a friend?", "Do you find it easy to make new friends?"]}, {"topic": "Neighbours", "questions": ["Do you know your neighbours well?", "What makes a good neighbour?", "Do people generally know their neighbours where you live?", "Have you ever helped a neighbour, or been helped by one?"]}, {"topic": "Daily routine", "questions": ["What does a typical day look like for you?", "Are you a morning person or an evening person?", "Is your routine on weekdays different from weekends?", "Would you like to change anything about your daily routine?"]}]}, "part2": {"cueCardTitle": "Describe a time when you helped someone.", "points": ["who you helped", "what the situation was", "what you did to help", "and explain how you felt afterwards."], "roundingOff": ["Do you often help other people?", "Did that person thank you for your help?"]}, "part3": {"topics": [{"topic": "Helping others", "questions": ["Why do some people help strangers while others do not?", "Is it the responsibility of individuals or the government to help those in need?", "How can children be taught to be more helpful and kind?"]}, {"topic": "Community and cooperation", "questions": ["Do you think people in cities help each other less than people in the countryside?", "What are the benefits of doing volunteer work?", "How could communities encourage people to work together more?"]}]}}', 1);

-- Test 8 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000008',
    'speaking',
    'IELTS Speaking Test 8',
    'Part 1: Food, Clothes and fashion, Family. Part 2: Describe a festival or celebration that is important in your country. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    8,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000008' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000008', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where do you come from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Food", "questions": ["What is your favourite kind of food?", "Do you prefer home cooked meals or restaurant food?", "Is there any food you dislike?", "Has your diet changed over the years?"]}, {"topic": "Clothes and fashion", "questions": ["Do you pay much attention to fashion?", "What kind of clothes do you usually wear?", "Do you prefer comfortable clothes or fashionable ones?", "Do you enjoy shopping for clothes?"]}, {"topic": "Family", "questions": ["Do you have a large or a small family?", "Who are you closest to in your family?", "Do you spend a lot of time with your family?", "What activities do you enjoy doing together?"]}]}, "part2": {"cueCardTitle": "Describe a festival or celebration that is important in your country.", "points": ["what the festival or celebration is", "when it takes place", "what people do during it", "and explain why it is important to people in your country."], "roundingOff": ["Do you always take part in this celebration?", "Has this festival changed since you were a child?"]}, "part3": {"topics": [{"topic": "Festivals and traditions", "questions": ["Why are traditional festivals important to a society?", "Do you think festivals are becoming more commercial?", "How can young people be encouraged to value their traditions?"]}, {"topic": "Culture and change", "questions": ["How do festivals help bring communities together?", "Do you think global celebrations are replacing local ones?", "Is it important to keep old customs alive in a modern world?"]}]}}', 1);

-- Test 9 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000009',
    'speaking',
    'IELTS Speaking Test 9',
    'Part 1: Mobile phones, Social media, News. Part 2: Describe a piece of technology that you find useful. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    9,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000009' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000009', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where are you from? May I see your identification? Thank you.", "topics": [{"topic": "Mobile phones", "questions": ["How often do you use your mobile phone?", "What do you use it for most?", "Could you manage without your phone for a day?", "Do you think you use your phone too much?"]}, {"topic": "Social media", "questions": ["Do you use social media?", "Which platforms do you use most often?", "What do you like and dislike about social media?", "Do you think social media brings people closer together?"]}, {"topic": "News", "questions": ["How do you usually get your news?", "Do you follow local news or international news more?", "How often do you read or watch the news?", "Do you think the news is always reliable?"]}]}, "part2": {"cueCardTitle": "Describe a piece of technology that you find useful.", "points": ["what the technology is", "how you learned to use it", "how often you use it", "and explain why you find it so useful."], "roundingOff": ["Would you find it hard to live without it?", "Do you think you will still use it in ten years?"]}, "part3": {"topics": [{"topic": "Technology in daily life", "questions": ["How has technology changed the way people communicate?", "Are there any disadvantages to relying so heavily on technology?", "Do you think older people find new technology harder to accept?"]}, {"topic": "The future of technology", "questions": ["Which areas of life do you think technology will change most in the future?", "Should there be limits on how much technology children use?", "Do the benefits of new technology outweigh the risks?"]}]}}', 1);

-- Test 10 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000010',
    'speaking',
    'IELTS Speaking Test 10',
    'Part 1: Nature and plants, Weather, Relaxing. Part 2: Describe a natural place, such as a park, a lake or a mountain, that you like. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    10,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000010' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000010', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where do you come from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Nature and plants", "questions": ["Do you spend much time in nature?", "Do you have any plants or a garden at home?", "Did you spend time outdoors as a child?", "Do you think people today spend enough time in nature?"]}, {"topic": "Weather", "questions": ["What kind of weather do you like best?", "Does the weather affect what you do during the day?", "Is the weather where you live fairly predictable?", "Has the climate in your area changed in recent years?"]}, {"topic": "Relaxing", "questions": ["What do you do to relax?", "Where do you feel most relaxed?", "Do you find it easy to relax after a busy day?", "Do you think people today find it harder to relax than in the past?"]}]}, "part2": {"cueCardTitle": "Describe a natural place, such as a park, a lake or a mountain, that you like.", "points": ["where this place is", "how often you go there", "what you do when you are there", "and explain why you like this place."], "roundingOff": ["Do you go there alone or with others?", "Would you like to spend more time there?"]}, "part3": {"topics": [{"topic": "Nature and wellbeing", "questions": ["Why do many people feel calmer when they are in natural surroundings?", "Do you think city dwellers have enough access to green spaces?", "How can spending time in nature benefit children?"]}, {"topic": "Protecting the environment", "questions": ["What are the main threats to natural places today?", "Whose responsibility is it to protect the environment?", "Do you think enough is being done to preserve natural areas for the future?"]}]}}', 1);

-- Test 11 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000011',
    'speaking',
    'IELTS Speaking Test 11',
    'Part 1: Your home town, Older people, Free time. Part 2: Describe an older person you know and admire. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    11,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000011' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000011', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Your home town", "questions": ["Where do you live now?", "What do you like most about living there?", "Is it a good place for older people to live?", "Would you like to live there when you are older?"]}, {"topic": "Older people", "questions": ["Do you spend much time with older members of your family?", "What can younger people learn from older people?", "Do you think older people are respected in your society?", "How is life for older people today different from the past?"]}, {"topic": "Free time", "questions": ["How do you usually spend your evenings?", "Do you have more or less free time than you used to?", "What would you do with more free time?", "Do you prefer active or relaxing free time activities?"]}]}, "part2": {"cueCardTitle": "Describe an older person you know and admire.", "points": ["who this person is", "how you know them", "what they are like", "and explain why you admire them."], "roundingOff": ["Do you see this person often?", "Would you like to be like them when you are older?"]}, "part3": {"topics": [{"topic": "Age and society", "questions": ["What roles do older people usually play in families in your country?", "Do you think societies value the experience of older people enough?", "How can communities make life better for their older members?"]}, {"topic": "Generations", "questions": ["What are the main differences between the older and younger generations today?", "Do you think the gap between generations is growing?", "How can different generations understand each other better?"]}]}}', 1);

-- Test 12 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000012',
    'speaking',
    'IELTS Speaking Test 12',
    'Part 1: Work or studies, Famous people, The internet. Part 2: Describe a famous person from your country whom you admire. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    12,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000012' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000012', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Work or studies", "questions": ["Do you work or study at the moment?", "What is a typical day like for you?", "Is it something you would like to continue in the future?", "What is the most challenging part of it?"]}, {"topic": "Famous people", "questions": ["Are you interested in the lives of famous people?", "Who is a famous person that many people in your country admire?", "Do you think being famous would be enjoyable?", "Do famous people have a responsibility to behave well?"]}, {"topic": "The internet", "questions": ["How do you usually find information you need?", "Do you trust the information you read online?", "How has the internet changed the way you learn about things?", "Is there anything about the internet you would improve?"]}]}, "part2": {"cueCardTitle": "Describe a famous person from your country whom you admire.", "points": ["who this person is", "what they are famous for", "what you know about their life", "and explain why you admire them."], "roundingOff": ["Would you like to meet this person?", "Do many people in your country share your view of them?"]}, "part3": {"topics": [{"topic": "Fame and society", "questions": ["Why do you think some people become famous while others do not?", "Are the people who are famous today good role models for the young?", "Has the way people become famous changed in recent years?"]}, {"topic": "Influence of public figures", "questions": ["How much influence do famous people have on society?", "Should famous people be involved in social or political causes?", "Do you think fame usually brings happiness?"]}]}}', 1);

-- Test 13 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000013',
    'speaking',
    'IELTS Speaking Test 13',
    'Part 1: Friends, Communication, Weekends. Part 2: Describe a friend you have known for a long time. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    13,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000013' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000013', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Friends", "questions": ["How often do you see your friends?", "Do you prefer old friends or making new ones?", "What do you usually do together?", "How important are friends in your life?"]}, {"topic": "Communication", "questions": ["How do you usually keep in touch with people?", "Do you prefer talking on the phone or messaging?", "Has the way you communicate with friends changed over time?", "Do you find it easy to stay in contact with people who live far away?"]}, {"topic": "Weekends", "questions": ["What did you do last weekend?", "Do you usually plan your weekends in advance?", "Do you prefer busy weekends or quiet ones?", "Is the weekend your favourite part of the week?"]}]}, "part2": {"cueCardTitle": "Describe a friend you have known for a long time.", "points": ["who this person is", "how and when you met", "what you usually do together", "and explain why your friendship has lasted so long."], "roundingOff": ["Do you think you will stay friends in the future?", "Do you have many friends like this?"]}, "part3": {"topics": [{"topic": "Friendship", "questions": ["What qualities make a good friend?", "Do you think it is possible to have many close friends?", "Why do some friendships last a lifetime while others fade?"]}, {"topic": "Friendship and modern life", "questions": ["How has technology changed the way friendships are formed?", "Do you think online friends can be as close as friends met in person?", "Is it harder to make new friends as an adult? Why?"]}]}}', 1);

-- Test 14 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000014',
    'speaking',
    'IELTS Speaking Test 14',
    'Part 1: Your job or studies, Skills and abilities, Time management. Part 2: Describe a person you know who is very good at their job. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    14,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000014' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000014', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Your job or studies", "questions": ["What do you do, work or study?", "Why did you choose this field?", "What skills are important for what you do?", "Would you recommend it to others?"]}, {"topic": "Skills and abilities", "questions": ["Are you good at learning new things?", "What is a skill you are proud of?", "Do you prefer to learn things quickly or carefully?", "Is there a skill you wish you had?"]}, {"topic": "Time management", "questions": ["Are you usually on time?", "How do you organise your day?", "Do you ever feel short of time?", "Are you better at planning or doing things spontaneously?"]}]}, "part2": {"cueCardTitle": "Describe a person you know who is very good at their job.", "points": ["who this person is", "what job they do", "how you know they are good at it", "and explain what makes them so good at their work."], "roundingOff": ["Would you like to do the same job?", "Do you think they enjoy their work?"]}, "part3": {"topics": [{"topic": "Work and ability", "questions": ["What makes someone good at their job?", "Is natural talent or hard work more important for success at work?", "Do you think job satisfaction is more important than a high salary?"]}, {"topic": "Careers and the future", "questions": ["How have people’s attitudes towards work changed over time?", "Do you think people will change jobs more often in the future?", "Should young people focus on one career or try many different ones?"]}]}}', 1);

-- Test 15 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000015',
    'speaking',
    'IELTS Speaking Test 15',
    'Part 1: Family, Home, Food. Part 2: Describe a member of your family you are close to. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    15,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000015' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000015', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Family", "questions": ["Do you come from a large or a small family?", "Who do you get on with best in your family?", "Do families in your country usually live close together?", "How often does your family get together?"]}, {"topic": "Home", "questions": ["What kind of home do you live in?", "Which is your favourite part of your home?", "Have you lived there for a long time?", "Is there anything you would like to change about it?"]}, {"topic": "Food", "questions": ["Do you enjoy trying new foods?", "Who cooks the meals in your home?", "Do you eat together as a family?", "What is a dish that is special in your family?"]}]}, "part2": {"cueCardTitle": "Describe a member of your family you are close to.", "points": ["who this person is", "what they are like", "what you do together", "and explain why you are so close to them."], "roundingOff": ["Do you spend enough time with this person?", "Are you similar to each other?"]}, "part3": {"topics": [{"topic": "Family life", "questions": ["How important is family in your culture?", "Do you think family relationships are as strong as they were in the past?", "What can families do to spend more quality time together?"]}, {"topic": "Family and society", "questions": ["How are family roles changing in modern society?", "Do you think children should look after their parents when they grow old?", "What effect does modern working life have on family relationships?"]}]}}', 1);

-- Test 16 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000016',
    'speaking',
    'IELTS Speaking Test 16',
    'Part 1: Free time and fun, Television, Happiness. Part 2: Describe a person who often makes you laugh. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    16,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000016' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000016', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Free time and fun", "questions": ["What do you do to enjoy yourself?", "Do you prefer serious or funny films and shows?", "When was the last time you laughed a lot?", "Do you think it is important to have fun every day?"]}, {"topic": "Television", "questions": ["Do you watch much television?", "What kinds of programmes do you enjoy?", "Do you prefer watching alone or with others?", "Has the way you watch television changed recently?"]}, {"topic": "Happiness", "questions": ["What makes you happy?", "Do small things or big events make you happier?", "Do you think people today are happier than in the past?", "What could make everyday life happier for people?"]}]}, "part2": {"cueCardTitle": "Describe a person who often makes you laugh.", "points": ["who this person is", "how you know them", "what they do that is funny", "and explain how you feel when you are with them."], "roundingOff": ["Do you enjoy making other people laugh?", "Do you see this person often?"]}, "part3": {"topics": [{"topic": "Humour and people", "questions": ["Why is a sense of humour considered an attractive quality?", "Do you think humour is the same across different cultures?", "Can humour help people deal with difficult situations?"]}, {"topic": "Fun and wellbeing", "questions": ["How important is laughter for a person’s health?", "Do you think people today take life too seriously?", "What role does entertainment play in helping people relax?"]}]}}', 1);

-- Test 17 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000017',
    'speaking',
    'IELTS Speaking Test 17',
    'Part 1: Study, Learning, Reading. Part 2: Describe an intelligent person you know. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    17,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000017' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000017', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Study", "questions": ["Are you studying anything now, or have you finished?", "Which subject do you find the most interesting?", "Do you prefer studying facts or ideas?", "How do you stay focused when you study?"]}, {"topic": "Learning", "questions": ["How do you like to learn new things?", "Do you learn better by listening or by doing?", "Who has taught you the most in your life?", "Do you enjoy learning things that are challenging?"]}, {"topic": "Reading", "questions": ["Do you read for pleasure?", "What was the last thing you read?", "Do you prefer fiction or factual writing?", "Do you think reading makes people smarter?"]}]}, "part2": {"cueCardTitle": "Describe an intelligent person you know.", "points": ["who this person is", "how you know them", "what makes you think they are intelligent", "and explain how their intelligence affects those around them."], "roundingOff": ["Do you think intelligence is something people are born with?", "Would you like to be more like this person?"]}, "part3": {"topics": [{"topic": "Intelligence", "questions": ["What does it really mean to be intelligent?", "Do you think intelligence is only about academic ability?", "Can a person become more intelligent, or is it fixed?"]}, {"topic": "Education and ability", "questions": ["How well do schools measure students’ true abilities?", "Do you think exams are a fair way to judge intelligence?", "Which is more valuable in life, intelligence or hard work?"]}]}}', 1);

-- Test 18 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000018',
    'speaking',
    'IELTS Speaking Test 18',
    'Part 1: Work or studies, Groups and teamwork, Goals. Part 2: Describe a person you would like to work or study with. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    18,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000018' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000018', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Work or studies", "questions": ["Do you work or are you a student?", "Do you usually work or study with other people?", "Do you prefer working in a team or on your own?", "What makes a good colleague or classmate?"]}, {"topic": "Groups and teamwork", "questions": ["Do you enjoy doing things as part of a group?", "What are the benefits of working with others?", "Have you ever found teamwork difficult?", "Are you usually a leader or a follower in a group?"]}, {"topic": "Goals", "questions": ["Do you like to set goals for yourself?", "What is something you are working towards at the moment?", "Do you prefer short term or long term goals?", "How do you feel when you achieve a goal?"]}]}, "part2": {"cueCardTitle": "Describe a person you would like to work or study with.", "points": ["who this person is", "what they are like", "what you would do together", "and explain why you would like to work or study with them."], "roundingOff": ["Have you worked with them before?", "Do you think you would work well together?"]}, "part3": {"topics": [{"topic": "Working with others", "questions": ["What are the advantages and disadvantages of working in a team?", "Why do some people prefer to work alone?", "How can teams avoid disagreements?"]}, {"topic": "Cooperation and success", "questions": ["Do you think cooperation is becoming more important in the workplace?", "How can schools prepare students to work well with others?", "Is competition or cooperation more useful for getting good results?"]}]}}', 1);

-- Test 19 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000019',
    'speaking',
    'IELTS Speaking Test 19',
    'Part 1: Children, Play and activities, Memories. Part 2: Describe a child you know. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    19,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000019' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000019', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Children", "questions": ["Do you spend much time with children?", "What do you enjoy about being around children?", "Were you a quiet or a lively child?", "What games did you play as a child?"]}, {"topic": "Play and activities", "questions": ["What activities do children in your country enjoy?", "Do children today play differently from the past?", "Should children spend more time playing outdoors?", "Is it good for children to have a lot of free time?"]}, {"topic": "Memories", "questions": ["What is your happiest childhood memory?", "Do you remember your early school years well?", "Do you think childhood is the best time of a person’s life?", "Do you often look back on your childhood?"]}]}, "part2": {"cueCardTitle": "Describe a child you know.", "points": ["who the child is", "how old they are", "what they are like", "and explain what you enjoy about spending time with them."], "roundingOff": ["Do you see this child often?", "What do you think they will be like when they grow up?"]}, "part3": {"topics": [{"topic": "Childhood today", "questions": ["How is childhood today different from childhood in the past?", "Do you think children grow up too quickly nowadays?", "What are the most important things children should learn?"]}, {"topic": "Raising children", "questions": ["Whose responsibility is it to teach children good behaviour?", "Do you think children today have too much freedom or too little?", "How can adults help children develop into responsible people?"]}]}}', 1);

-- Test 20 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000020',
    'speaking',
    'IELTS Speaking Test 20',
    'Part 1: Your home town, Difficulties and problems, Kindness. Part 2: Describe a person who helped you in a difficult situation. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    20,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000020' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000020', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Your home town", "questions": ["Where are you from originally?", "What are the people like there?", "Is it a friendly place to live?", "Have you ever needed help from a stranger there?"]}, {"topic": "Difficulties and problems", "questions": ["Do you find it easy to ask others for help?", "Who do you usually turn to when you have a problem?", "Do you prefer to solve problems yourself?", "Are you good at staying calm in difficult situations?"]}, {"topic": "Kindness", "questions": ["Do you think people in your country are generally kind?", "Have you noticed any acts of kindness recently?", "Is it important to teach children to be kind?", "Do small kind acts make a difference?"]}]}, "part2": {"cueCardTitle": "Describe a person who helped you in a difficult situation.", "points": ["who this person is", "what the situation was", "how they helped you", "and explain how you felt about their help."], "roundingOff": ["Did you thank this person?", "Have you been able to help them in return?"]}, "part3": {"topics": [{"topic": "Helping and kindness", "questions": ["Why do some people go out of their way to help others?", "Do you think people are less willing to help strangers than in the past?", "How can a society encourage people to be more helpful?"]}, {"topic": "Support in the community", "questions": ["What kinds of support should communities offer people in difficulty?", "Is it better to receive help from family or from professionals?", "Do you think people should always help others, even when it is inconvenient?"]}]}}', 1);

-- Test 21 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000021',
    'speaking',
    'IELTS Speaking Test 21',
    'Part 1: School days, Teachers, Learning now. Part 2: Describe a teacher who influenced your education. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    21,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000021' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000021', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "School days", "questions": ["Did you enjoy your time at school?", "Which subjects were you best at?", "Did you have a favourite teacher?", "What is your strongest memory from school?"]}, {"topic": "Teachers", "questions": ["What qualities make a good teacher?", "Do you prefer strict teachers or relaxed ones?", "Have any teachers changed the way you think?", "Is teaching a respected profession in your country?"]}, {"topic": "Learning now", "questions": ["Are you still learning new things?", "How do you prefer to learn as an adult?", "Do you think people learn better when they are young?", "What would you like to learn next?"]}]}, "part2": {"cueCardTitle": "Describe a teacher who influenced your education.", "points": ["who this teacher was", "what subject they taught", "what they were like", "and explain how they influenced you."], "roundingOff": ["Are you still in contact with this teacher?", "Would you like to thank them?"]}, "part3": {"topics": [{"topic": "Teaching and learning", "questions": ["What makes a teacher truly memorable?", "Do you think the role of teachers is changing?", "How important is the relationship between a teacher and a student?"]}, {"topic": "Education systems", "questions": ["Should teachers focus more on exam results or on developing character?", "Do you think technology could ever replace teachers?", "How could the teaching profession be made more attractive?"]}]}}', 1);

-- Test 22 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000022',
    'speaking',
    'IELTS Speaking Test 22',
    'Part 1: Your country, News and events, Leadership. Part 2: Describe a leader you admire. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    22,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000022' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000022', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Your country", "questions": ["What do you like most about your country?", "What is it well known for?", "Has your country changed much recently?", "What would you show a visitor first?"]}, {"topic": "News and events", "questions": ["How do you keep up with current events?", "Do you follow national or international news more?", "Do you discuss the news with others?", "Do you think the news affects people’s opinions strongly?"]}, {"topic": "Leadership", "questions": ["Do you consider yourself a leader?", "Have you ever led a group or a team?", "What do you think makes a good leader?", "Would you like to be in a position of leadership?"]}]}, "part2": {"cueCardTitle": "Describe a leader you admire.", "points": ["who this person is", "what they are or were responsible for", "what qualities they have", "and explain why you admire them as a leader."], "roundingOff": ["Would you like to lead in the way they do?", "Do many people admire this person?"]}, "part3": {"topics": [{"topic": "Leadership", "questions": ["What are the most important qualities of a good leader?", "Are leaders born or made, in your opinion?", "Do you think good leaders always need to be popular?"]}, {"topic": "Leaders in society", "questions": ["How much influence do leaders really have on people’s lives?", "Should young people be encouraged to develop leadership skills?", "What can happen when a country has poor leadership?"]}]}}', 1);

-- Test 23 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000023',
    'speaking',
    'IELTS Speaking Test 23',
    'Part 1: Music, Talent, Performances and shows. Part 2: Describe a talented person you know, such as a musician, an artist or an athlete. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    23,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000023' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000023', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Music", "questions": ["Do you enjoy listening to music?", "What kind of music do you like best?", "Do you play any instruments?", "Is music important in your culture?"]}, {"topic": "Talent", "questions": ["Do you think you have any special talents?", "Is it better to have one talent or many skills?", "Do you admire talented people?", "Can talent be developed, or is it natural?"]}, {"topic": "Performances and shows", "questions": ["Do you enjoy going to concerts or live shows?", "Have you ever performed in front of others?", "Do you prefer live performances or recordings?", "Are performances popular in your country?"]}]}, "part2": {"cueCardTitle": "Describe a talented person you know, such as a musician, an artist or an athlete.", "points": ["who this person is", "what they are talented at", "how they developed their talent", "and explain why you think they are so talented."], "roundingOff": ["Do you think they will become well known?", "Would you like to have their talent?"]}, "part3": {"topics": [{"topic": "Talent and ability", "questions": ["Do you think talent is more important than practice?", "Why are some people talented in many areas?", "Should schools do more to identify and support talented students?"]}, {"topic": "Recognising talent", "questions": ["How can society best support gifted young people?", "Do you think talented people always achieve success?", "Is it possible for anyone to become talented at something?"]}]}}', 1);

-- Test 24 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000024',
    'speaking',
    'IELTS Speaking Test 24',
    'Part 1: Where you live, Neighbours, Community. Part 2: Describe a neighbour you get along with well. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    24,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000024' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000024', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Where you live", "questions": ["What kind of area do you live in?", "Do you know the people living near you?", "Is it a quiet or a busy neighbourhood?", "Would you like to live somewhere different?"]}, {"topic": "Neighbours", "questions": ["Do you get on well with your neighbours?", "What makes someone a good neighbour?", "Do neighbours help each other where you live?", "Have neighbours become less friendly over time?"]}, {"topic": "Community", "questions": ["Are there community events where you live?", "Do you feel part of your local community?", "What could bring your community closer together?", "Is a sense of community important to you?"]}]}, "part2": {"cueCardTitle": "Describe a neighbour you get along with well.", "points": ["who this person is", "how long you have known them", "what they are like", "and explain why you get along with them."], "roundingOff": ["Do you help each other out?", "Would you like to have more neighbours like them?"]}, "part3": {"topics": [{"topic": "Neighbours and community", "questions": ["Why is it important to have a good relationship with neighbours?", "Do you think people know their neighbours less well than in the past?", "What problems can arise between neighbours?"]}, {"topic": "Living together", "questions": ["How can neighbours build a stronger sense of community?", "Do people in cities and in the countryside treat neighbours differently?", "Should local governments do more to bring communities together?"]}]}}', 1);

-- Test 25 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000025',
    'speaking',
    'IELTS Speaking Test 25',
    'Part 1: Relaxing, Noise, Weekends and rest. Part 2: Describe a quiet place you like to go to. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    25,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000025' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000025', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Relaxing", "questions": ["What do you do when you want to relax?", "Where do you feel most peaceful?", "Do you prefer quiet places or lively ones?", "Is it easy to find quiet places where you live?"]}, {"topic": "Noise", "questions": ["Does noise bother you?", "Is the area where you live noisy?", "What kinds of noise do you find most annoying?", "Do you think cities are becoming noisier?"]}, {"topic": "Weekends and rest", "questions": ["How do you rest at the weekend?", "Do you get enough rest during the week?", "Do you prefer to rest at home or somewhere else?", "Is rest important for doing well in life?"]}]}, "part2": {"cueCardTitle": "Describe a quiet place you like to go to.", "points": ["where this place is", "how often you go there", "what you do there", "and explain why you like this quiet place."], "roundingOff": ["Do you go there alone or with others?", "Is it easy to find quiet places these days?"]}, "part3": {"topics": [{"topic": "Quiet and calm", "questions": ["Why do people need quiet places in their lives?", "Do you think modern life is too noisy and busy?", "How does a noisy environment affect people?"]}, {"topic": "Peace in cities", "questions": ["How can cities provide more peaceful spaces for people?", "Do you think people appreciate silence enough?", "Should there be more rules to control noise in public places?"]}]}}', 1);

-- Test 26 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000026',
    'speaking',
    'IELTS Speaking Test 26',
    'Part 1: Travel and places, Cities, Planning trips. Part 2: Describe a city you would like to visit. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    26,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000026' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000026', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Travel and places", "questions": ["Do you like visiting new places?", "What kind of places do you enjoy most?", "Do you prefer cities or the countryside?", "Where would you most like to travel to?"]}, {"topic": "Cities", "questions": ["Do you enjoy spending time in big cities?", "What are the advantages of living in a city?", "Are there any problems with life in cities?", "How have cities in your country changed recently?"]}, {"topic": "Planning trips", "questions": ["Do you enjoy planning trips?", "Do you prefer organised tours or independent travel?", "How do you decide where to go?", "Do you research a place before visiting it?"]}]}, "part2": {"cueCardTitle": "Describe a city you would like to visit.", "points": ["which city it is", "how you know about it", "what you would do there", "and explain why you would like to visit it."], "roundingOff": ["Do you think you will visit it one day?", "Would you go alone or with others?"]}, "part3": {"topics": [{"topic": "Cities and travel", "questions": ["Why do you think some cities attract so many visitors?", "What makes a city a good place to live in?", "How can cities cope with growing numbers of tourists?"]}, {"topic": "Urban life", "questions": ["What are the biggest challenges facing cities today?", "Do you think more people will live in cities in the future?", "How could cities be made more pleasant places to live?"]}]}}', 1);

-- Test 27 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000027',
    'speaking',
    'IELTS Speaking Test 27',
    'Part 1: History, Old buildings, Museums. Part 2: Describe a historical place or building you have visited. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    27,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000027' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000027', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "History", "questions": ["Are you interested in history?", "Did you enjoy studying history at school?", "Are there any historical places near where you live?", "Do you think it is important to learn about the past?"]}, {"topic": "Old buildings", "questions": ["Are there many old buildings in your area?", "Do you prefer old buildings or modern ones?", "Should old buildings be protected?", "Have you ever visited a very old building?"]}, {"topic": "Museums", "questions": ["Do you like visiting museums?", "When did you last go to a museum?", "Do you think museums are important?", "Are museums popular in your country?"]}]}, "part2": {"cueCardTitle": "Describe a historical place or building you have visited.", "points": ["what and where it is", "when you visited it", "what you saw there", "and explain what you found interesting about it."], "roundingOff": ["Would you recommend it to others?", "Would you like to visit it again?"]}, "part3": {"topics": [{"topic": "History and heritage", "questions": ["Why is it important to protect historical places?", "Who should be responsible for preserving old buildings?", "Do you think enough is done to protect history in your country?"]}, {"topic": "The past and the present", "questions": ["What can people learn from studying the past?", "Should modern development ever come before historical preservation?", "Do you think young people today are interested in history?"]}]}}', 1);

-- Test 28 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000028',
    'speaking',
    'IELTS Speaking Test 28',
    'Part 1: Relaxing places, Stress and busy life, Comfort. Part 2: Describe a place where you like to relax. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    28,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000028' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000028', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Relaxing places", "questions": ["Where do you go to relax?", "Do you have a favourite spot at home?", "Do you prefer to relax indoors or outdoors?", "How often do you get the chance to relax?"]}, {"topic": "Stress and busy life", "questions": ["Do you often feel busy?", "What makes your days stressful?", "How do you cope when you are under pressure?", "Do you think life is more stressful than in the past?"]}, {"topic": "Comfort", "questions": ["What makes a place feel comfortable to you?", "Do you like your home to be tidy?", "What is your favourite piece of furniture?", "Is comfort important when you choose where to live?"]}]}, "part2": {"cueCardTitle": "Describe a place where you like to relax.", "points": ["where this place is", "when you go there", "what you do to relax there", "and explain why this place helps you relax."], "roundingOff": ["Do you go there as often as you would like?", "Do other people go there too?"]}, "part3": {"topics": [{"topic": "Relaxation and wellbeing", "questions": ["Why is it important for people to relax?", "What are the best ways for people to reduce stress?", "Do you think people today relax in healthy ways?"]}, {"topic": "Modern pressures", "questions": ["Why do many people feel more stressed nowadays?", "How does work affect people’s ability to relax?", "What can employers do to help people manage stress?"]}]}}', 1);

-- Test 29 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000029',
    'speaking',
    'IELTS Speaking Test 29',
    'Part 1: Eating out, Food and cooking, Meeting people. Part 2: Describe a café or restaurant you enjoy going to. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    29,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000029' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000029', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Eating out", "questions": ["Do you like eating in restaurants?", "What kind of restaurants do you prefer?", "How often do you eat out?", "Do you prefer eating out or ordering food at home?"]}, {"topic": "Food and cooking", "questions": ["Do you enjoy cooking?", "What is your favourite meal to prepare?", "Did you learn to cook from your family?", "Do you think home cooked food is healthier?"]}, {"topic": "Meeting people", "questions": ["Do you like meeting friends for meals?", "Where do you usually meet up with people?", "Do you prefer small gatherings or large ones?", "Are meals a good way to spend time with people?"]}]}, "part2": {"cueCardTitle": "Describe a café or restaurant you enjoy going to.", "points": ["where it is", "what kind of food it serves", "who you go there with", "and explain why you enjoy going there."], "roundingOff": ["How often do you go there?", "Would you recommend it to others?"]}, "part3": {"topics": [{"topic": "Eating habits", "questions": ["Why do people enjoy eating out so much these days?", "How have people’s eating habits changed over the years?", "Do you think fast food is a serious problem?"]}, {"topic": "Food and society", "questions": ["What role does food play in bringing people together?", "Do you think restaurants will change much in the future?", "Should governments encourage people to eat more healthily?"]}]}}', 1);

-- Test 30 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000030',
    'speaking',
    'IELTS Speaking Test 30',
    'Part 1: Your home town, Change, The past. Part 2: Describe a place in your home town that has changed. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    30,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000030' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000030', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Your home town", "questions": ["How long have you lived in your home town?", "What was it like when you were younger?", "Has it changed a lot over the years?", "Do you like the changes that have happened?"]}, {"topic": "Change", "questions": ["Do you generally like change, or do you prefer things to stay the same?", "What is the biggest change in your life recently?", "Do you think change is usually a good thing?", "How do you cope with unexpected changes?"]}, {"topic": "The past", "questions": ["Do you often think about the past?", "Do you prefer old things or new things?", "What did you enjoy doing years ago that you no longer do?", "Do you think life was better in the past?"]}]}, "part2": {"cueCardTitle": "Describe a place in your home town that has changed.", "points": ["what and where the place is", "what it used to be like", "how it has changed", "and explain how you feel about the change."], "roundingOff": ["Do you prefer it now or before?", "Do you think it will change further?"]}, "part3": {"topics": [{"topic": "Change in society", "questions": ["Why do towns and cities change over time?", "Are changes to a place usually welcomed by local people?", "Do you think development always improves an area?"]}, {"topic": "Development and identity", "questions": ["How can a place develop without losing its character?", "Do you think older residents find change harder to accept?", "Should local people have a say in how their area develops?"]}]}}', 1);

-- Test 31 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000031',
    'speaking',
    'IELTS Speaking Test 31',
    'Part 1: Public places, Spending time outside the home, Facilities. Part 2: Describe a public place, such as a library, park or square, that you often visit. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    31,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000031' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000031', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Public places", "questions": ["Are there good public places where you live?", "Do you often use public libraries or parks?", "Do you prefer quiet public places or lively ones?", "Are public places well looked after in your area?"]}, {"topic": "Spending time outside the home", "questions": ["Where do you usually go when you leave the house?", "Do you spend much time outdoors?", "Do you prefer being at home or out and about?", "Has this changed since you were younger?"]}, {"topic": "Facilities", "questions": ["What facilities does your area have?", "Is there anything your area is missing?", "Are the facilities free to use?", "What new facility would you like to see?"]}]}, "part2": {"cueCardTitle": "Describe a public place, such as a library, park or square, that you often visit.", "points": ["where this place is", "how often you go there", "what you do there", "and explain why you like going there."], "roundingOff": ["Is this place popular with other people?", "Would you change anything about it?"]}, "part3": {"topics": [{"topic": "Public spaces", "questions": ["Why are public spaces important for a community?", "Do you think there are enough public places where you live?", "Who should be responsible for maintaining public spaces?"]}, {"topic": "Access and use", "questions": ["How can public places be made welcoming for everyone?", "Do people use public spaces less than they used to?", "Should public facilities always be free to use?"]}]}}', 1);

-- Test 32 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000032',
    'speaking',
    'IELTS Speaking Test 32',
    'Part 1: Water and outdoors, Weather by the water, Holidays. Part 2: Describe a place near water that you have visited, such as a river, lake or the sea. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    32,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000032' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000032', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Water and outdoors", "questions": ["Do you live near any rivers, lakes or the sea?", "Do you enjoy being near water?", "Can you swim?", "Do you prefer the sea, a lake or a river?"]}, {"topic": "Weather by the water", "questions": ["Do you like going outside in good weather?", "What outdoor activities do you enjoy?", "Does the weather affect how much time you spend outdoors?", "What is your favourite time of year to be outdoors?"]}, {"topic": "Holidays", "questions": ["Do you prefer beach holidays or city holidays?", "Where did you go on your last holiday?", "Who do you usually travel with?", "What makes a holiday relaxing for you?"]}]}, "part2": {"cueCardTitle": "Describe a place near water that you have visited, such as a river, lake or the sea.", "points": ["where this place is", "when you went there", "what you did there", "and explain why you enjoyed being near the water."], "roundingOff": ["Would you like to go back there?", "Do you often visit places near water?"]}, "part3": {"topics": [{"topic": "Water and nature", "questions": ["Why do people feel drawn to places near water?", "What are the benefits of living near water?", "How can rivers and coasts be protected from pollution?"]}, {"topic": "Water and society", "questions": ["Why is access to clean water so important?", "Do you think people take water for granted?", "What could be done to help people use water more carefully?"]}]}}', 1);

-- Test 33 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000033',
    'speaking',
    'IELTS Speaking Test 33',
    'Part 1: Shopping, Local shops, Spending money. Part 2: Describe a shop you like to go to. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    33,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000033' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000033', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Shopping", "questions": ["Do you enjoy shopping?", "What do you most like to buy?", "Do you prefer big shopping centres or small shops?", "Do you make a list before you go shopping?"]}, {"topic": "Local shops", "questions": ["Are there good shops near your home?", "Do you know any of the shopkeepers?", "Do you prefer local shops or large stores?", "Have the shops in your area changed recently?"]}, {"topic": "Spending money", "questions": ["Are you careful with money?", "Do you prefer to save or to spend?", "What do you usually spend your money on?", "Do you think young people spend money wisely?"]}]}, "part2": {"cueCardTitle": "Describe a shop you like to go to.", "points": ["what kind of shop it is", "where it is", "what it sells", "and explain why you enjoy going there."], "roundingOff": ["How often do you go to this shop?", "Would you recommend it to others?"]}, "part3": {"topics": [{"topic": "Shops and shopping", "questions": ["Why do some people enjoy shopping while others dislike it?", "How has shopping changed with the rise of online stores?", "What are the advantages of small local shops?"]}, {"topic": "Consumer culture", "questions": ["Do you think people buy more than they need these days?", "How does advertising affect people’s shopping habits?", "Will physical shops still exist in the future?"]}]}}', 1);

-- Test 34 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000034',
    'speaking',
    'IELTS Speaking Test 34',
    'Part 1: Study places, Concentration, Libraries. Part 2: Describe a place where you liked to study. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    34,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000034' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000034', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Study places", "questions": ["Where do you usually study?", "Do you prefer to study at home or elsewhere?", "What makes a good place to study?", "Do you need quiet to concentrate?"]}, {"topic": "Concentration", "questions": ["Do you find it easy to concentrate?", "What things distract you most?", "How do you stay focused on a task?", "Do you work better in the morning or at night?"]}, {"topic": "Libraries", "questions": ["Do you use libraries?", "What do you use them for?", "Are libraries popular where you live?", "Do you think libraries are still important?"]}]}, "part2": {"cueCardTitle": "Describe a place where you liked to study.", "points": ["where this place was", "when you studied there", "what it was like", "and explain why it was a good place to study."], "roundingOff": ["Do you still study there?", "Would you recommend it to others?"]}, "part3": {"topics": [{"topic": "Study environments", "questions": ["What makes a good environment for studying?", "Do you think people study better alone or with others?", "How does the place where you study affect your results?"]}, {"topic": "Learning spaces", "questions": ["How have places for study changed with technology?", "Should schools provide more spaces for independent study?", "Do you think home is a good place to study?"]}]}}', 1);

-- Test 35 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000035',
    'speaking',
    'IELTS Speaking Test 35',
    'Part 1: Busy places, Events, Cities and crowds. Part 2: Describe a crowded place you have been to. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    35,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000035' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000035', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Busy places", "questions": ["Do you like crowded places?", "Where do people gather in your town?", "Do you prefer busy places or quiet ones?", "When are the busiest times where you live?"]}, {"topic": "Events", "questions": ["Do you enjoy going to big events?", "What kinds of events are popular in your country?", "Have you been to a large event recently?", "Do you prefer big events or small gatherings?"]}, {"topic": "Cities and crowds", "questions": ["Do you feel comfortable in busy cities?", "What do you dislike about crowded places?", "Are the places where you live becoming more crowded?", "How do you feel in a large crowd?"]}]}, "part2": {"cueCardTitle": "Describe a crowded place you have been to.", "points": ["where this place was", "when you went there", "why it was so crowded", "and explain how you felt about being there."], "roundingOff": ["Would you go there again?", "Do you usually enjoy crowded places?"]}, "part3": {"topics": [{"topic": "Crowds and cities", "questions": ["Why do some places become very crowded?", "What problems can crowded places cause?", "How can crowded public places be managed better?"]}, {"topic": "Population and space", "questions": ["Do you think cities are becoming too crowded?", "How does living in a crowded place affect people?", "What can be done to reduce overcrowding in popular areas?"]}]}}', 1);

-- Test 36 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000036',
    'speaking',
    'IELTS Speaking Test 36',
    'Part 1: Gifts, Special occasions, Generosity. Part 2: Describe a gift you gave to someone. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    36,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000036' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000036', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Gifts", "questions": ["Do you enjoy giving gifts?", "How do you decide what to give someone?", "Do you prefer giving gifts or receiving them?", "When do people usually give gifts in your country?"]}, {"topic": "Special occasions", "questions": ["What occasions do you celebrate with your family?", "Do you enjoy planning celebrations?", "How do you usually celebrate birthdays?", "Are celebrations important in your culture?"]}, {"topic": "Generosity", "questions": ["Do you think you are a generous person?", "Is it better to give money or a gift?", "Do people in your country give a lot of gifts?", "Should children be taught to share?"]}]}, "part2": {"cueCardTitle": "Describe a gift you gave to someone.", "points": ["what the gift was", "who you gave it to", "why you chose that gift", "and explain how the person reacted to it."], "roundingOff": ["Do you enjoy choosing gifts for people?", "Do you find it easy to know what people want?"]}, "part3": {"topics": [{"topic": "Giving gifts", "questions": ["Why do people give gifts to one another?", "Is it the thought or the value of a gift that matters more?", "How have gift giving customs changed over time?"]}, {"topic": "Generosity and society", "questions": ["Do you think people are generous enough today?", "Should generosity be taught to children?", "Is giving to others good for the giver as well?"]}]}}', 1);

-- Test 37 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000037',
    'speaking',
    'IELTS Speaking Test 37',
    'Part 1: Memories and keepsakes, Birthdays, Special things. Part 2: Describe a gift you received that was special to you. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    37,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000037' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000037', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Memories and keepsakes", "questions": ["Do you keep things that remind you of the past?", "Do you have a favourite possession from your childhood?", "Do you like receiving presents?", "What is the best present you have ever received?"]}, {"topic": "Birthdays", "questions": ["How do you usually spend your birthday?", "Did you enjoy birthdays more as a child?", "Do you prefer big celebrations or quiet ones?", "Are birthdays important in your family?"]}, {"topic": "Special things", "questions": ["Do you own anything you consider very special?", "Would you ever give away something valuable to you?", "Do you think people become too attached to objects?", "What kinds of things do people treasure most?"]}]}, "part2": {"cueCardTitle": "Describe a gift you received that was special to you.", "points": ["what the gift was", "who gave it to you", "when you received it", "and explain why it was so special."], "roundingOff": ["Do you still have this gift?", "Do you often think about it?"]}, "part3": {"topics": [{"topic": "Meaningful possessions", "questions": ["Why do certain objects become meaningful to people?", "Do you think people value handmade gifts more than bought ones?", "Is it the memory or the object itself that people treasure?"]}, {"topic": "Materialism", "questions": ["Do you think people place too much importance on possessions?", "How can people avoid becoming too materialistic?", "Do experiences matter more than objects?"]}]}}', 1);

-- Test 38 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000038',
    'speaking',
    'IELTS Speaking Test 38',
    'Part 1: Photographs, Memories, Special moments. Part 2: Describe a photograph you like. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    38,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000038' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000038', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Photographs", "questions": ["Do you like taking photos?", "Do you often look back at old photographs?", "Do you keep your photos printed or digital?", "Who takes the most photos in your family?"]}, {"topic": "Memories", "questions": ["Do you have a good memory?", "What kinds of things do you remember best?", "Do photos help you remember events?", "Do you prefer photos or videos for keeping memories?"]}, {"topic": "Special moments", "questions": ["Do you like to record important moments?", "What was the last special event you photographed?", "Do you share your photos with others?", "Do you think people take too many photos nowadays?"]}]}, "part2": {"cueCardTitle": "Describe a photograph you like.", "points": ["what the photograph shows", "when and where it was taken", "who took it", "and explain why you like it so much."], "roundingOff": ["Where do you keep this photograph?", "Do you show it to other people?"]}, "part3": {"topics": [{"topic": "Photography today", "questions": ["Why do people take so many photographs these days?", "How has photography changed with mobile phones?", "Do you think people enjoy moments less because they are busy taking photos?"]}, {"topic": "Memories and images", "questions": ["How do photographs help us remember the past?", "Do you think printed photos are better than digital ones?", "Will people still value old photographs in the future?"]}]}}', 1);

-- Test 39 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000039',
    'speaking',
    'IELTS Speaking Test 39',
    'Part 1: Clothes, Fashion, Appearance. Part 2: Describe an item of clothing you like to wear. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    39,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000039' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000039', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Clothes", "questions": ["What kind of clothes do you usually wear?", "Do you dress differently for different occasions?", "Do you prefer buying new clothes or wearing old favourites?", "Has your taste in clothes changed over time?"]}, {"topic": "Fashion", "questions": ["Do you follow fashion trends?", "Is fashion important to people in your country?", "Do you think people spend too much on clothes?", "Where do you usually buy your clothes?"]}, {"topic": "Appearance", "questions": ["How important is it to look smart?", "Do you dress up for special occasions?", "Do you think first impressions matter?", "Does what people wear affect how others see them?"]}]}, "part2": {"cueCardTitle": "Describe an item of clothing you like to wear.", "points": ["what it is", "when you wear it", "where you got it", "and explain why you like wearing it."], "roundingOff": ["Do you wear it often?", "Would you buy another one like it?"]}, "part3": {"topics": [{"topic": "Clothes and fashion", "questions": ["Why do some people care a lot about fashion?", "Do you think clothes reflect a person’s personality?", "How has fashion changed over the past few decades?"]}, {"topic": "Fashion and society", "questions": ["Do you think people are pressured to follow trends?", "Is fast fashion a problem for the environment?", "Should people be judged by the way they dress?"]}]}}', 1);

-- Test 40 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000040',
    'speaking',
    'IELTS Speaking Test 40',
    'Part 1: Art, Creativity, Colours and design. Part 2: Describe a piece of art you have seen and liked. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    40,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000040' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000040', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Art", "questions": ["Are you interested in art?", "Did you enjoy art lessons at school?", "Do you ever visit art galleries?", "Do you think art is important?"]}, {"topic": "Creativity", "questions": ["Do you consider yourself a creative person?", "What creative activities do you enjoy?", "Were you encouraged to be creative as a child?", "Do you think creativity can be taught?"]}, {"topic": "Colours and design", "questions": ["What are your favourite colours?", "Do colours affect your mood?", "Do you pay attention to design in everyday objects?", "Is good design important to you?"]}]}, "part2": {"cueCardTitle": "Describe a piece of art you have seen and liked.", "points": ["what the piece of art was", "where you saw it", "what it looked like", "and explain why you liked it."], "roundingOff": ["Would you like to see it again?", "Do you know much about the artist?"]}, "part3": {"topics": [{"topic": "Art and its value", "questions": ["Why is art important in society?", "Do you think everyone can appreciate art, or only some people?", "Should governments spend money supporting the arts?"]}, {"topic": "Art and education", "questions": ["Should art be a compulsory subject at school?", "How can children be encouraged to take an interest in art?", "Do you think art is valued enough compared with other subjects?"]}]}}', 1);

-- Test 41 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000041',
    'speaking',
    'IELTS Speaking Test 41',
    'Part 1: Shopping habits, Making decisions, Money. Part 2: Describe something you bought recently that you were pleased with. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    41,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000041' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000041', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Shopping habits", "questions": ["Do you often buy things for yourself?", "What was the last thing you bought?", "Do you prefer to buy things in shops or online?", "Do you enjoy the experience of shopping?"]}, {"topic": "Making decisions", "questions": ["Do you find it easy to make decisions?", "Do you research things before you buy them?", "Do you ask others for advice before buying?", "Have you ever regretted a purchase?"]}, {"topic": "Money", "questions": ["Do you keep track of your spending?", "Do you prefer to save up or buy things straight away?", "Is it easy to save money these days?", "Did your family teach you about money?"]}]}, "part2": {"cueCardTitle": "Describe something you bought recently that you were pleased with.", "points": ["what you bought", "where you bought it", "why you bought it", "and explain why you were so pleased with it."], "roundingOff": ["Do you use it often?", "Would you buy something similar again?"]}, "part3": {"topics": [{"topic": "Buying and spending", "questions": ["Why do people enjoy buying new things?", "Do you think people make careful decisions when they shop?", "How does advertising influence what people buy?"]}, {"topic": "Value for money", "questions": ["Is it always worth paying more for better quality?", "Do you think people today are more careful with money than before?", "How can people avoid spending money unnecessarily?"]}]}}', 1);

-- Test 42 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000042',
    'speaking',
    'IELTS Speaking Test 42',
    'Part 1: Belongings, Value and importance, Home. Part 2: Describe something you own that is important to you. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    42,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000042' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000042', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Belongings", "questions": ["What is your most useful possession?", "Do you own many things you rarely use?", "Do you find it hard to throw things away?", "Do you prefer to own a few good things or many things?"]}, {"topic": "Value and importance", "questions": ["Is there anything you own that money could not replace?", "Do you keep things for sentimental reasons?", "What would you save first if you had to leave home quickly?", "Do you think people own too much these days?"]}, {"topic": "Home", "questions": ["Is your home tidy or cluttered?", "Do you enjoy organising your things?", "How often do you clear things out?", "Where do you keep your most important things?"]}]}, "part2": {"cueCardTitle": "Describe something you own that is important to you.", "points": ["what it is", "how long you have had it", "how you got it", "and explain why it is so important to you."], "roundingOff": ["Would you ever give it away?", "Do other people know how important it is to you?"]}, "part3": {"topics": [{"topic": "Possessions and meaning", "questions": ["Why do some possessions mean so much to people?", "Do you think younger people value possessions differently from older people?", "Is it healthy to be very attached to objects?"]}, {"topic": "Ownership today", "questions": ["Do you think people own more than they used to?", "Are experiences becoming more valued than possessions?", "How can people decide what is truly worth keeping?"]}]}}', 1);

-- Test 43 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000043',
    'speaking',
    'IELTS Speaking Test 43',
    'Part 1: The internet, Apps and tools, Learning online. Part 2: Describe a website or app that you find useful. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    43,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000043' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000043', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "The internet", "questions": ["What do you use the internet for most?", "How many hours a day do you spend online?", "Which websites do you visit regularly?", "Could you manage without the internet?"]}, {"topic": "Apps and tools", "questions": ["What apps do you use most on your phone?", "Have any apps made your life easier?", "Do you pay for any apps or services?", "Do you often try new apps?"]}, {"topic": "Learning online", "questions": ["Do you ever learn things online?", "Do you prefer learning from videos or from reading?", "Have you taken any online courses?", "Do you think online learning is effective?"]}]}, "part2": {"cueCardTitle": "Describe a website or app that you find useful.", "points": ["what it is", "what it is used for", "how often you use it", "and explain why you find it so useful."], "roundingOff": ["Would you recommend it to others?", "Could you manage without it?"]}, "part3": {"topics": [{"topic": "The internet in daily life", "questions": ["How has the internet changed the way people live?", "Do you think people depend too much on the internet?", "What are the risks of spending so much time online?"]}, {"topic": "Technology and access", "questions": ["Should everyone have access to the internet?", "Do you think older people find the internet harder to use?", "How might the internet change over the next twenty years?"]}]}}', 1);

-- Test 44 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000044',
    'speaking',
    'IELTS Speaking Test 44',
    'Part 1: Machines and appliances, Technology at home, Everyday tasks. Part 2: Describe a machine or appliance you use regularly. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    44,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000044' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000044', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Machines and appliances", "questions": ["What machines do you use every day?", "Which one would you find hardest to live without?", "Have machines made housework easier?", "Do you know how to fix things when they break?"]}, {"topic": "Technology at home", "questions": ["What kinds of technology do you have at home?", "Has technology changed daily life in your home?", "Do you enjoy using new gadgets?", "Do you prefer simple tools or advanced ones?"]}, {"topic": "Everyday tasks", "questions": ["What household tasks do you do regularly?", "Do you enjoy doing chores?", "Do you share housework with others?", "Which tasks do you least enjoy?"]}]}, "part2": {"cueCardTitle": "Describe a machine or appliance you use regularly.", "points": ["what it is", "what you use it for", "how often you use it", "and explain how it makes your life easier."], "roundingOff": ["Could you manage without it?", "Would you buy a newer version?"]}, "part3": {"topics": [{"topic": "Machines and labour", "questions": ["How have machines changed the way people do household tasks?", "Do you think machines have made people lazier?", "Which machines have had the biggest impact on daily life?"]}, {"topic": "Technology and the future", "questions": ["Will machines take over more of our work in the future?", "What are the risks of relying heavily on machines?", "Do you think people will still know how to do things by hand?"]}]}}', 1);

-- Test 45 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000045',
    'speaking',
    'IELTS Speaking Test 45',
    'Part 1: Keeping things, The past, Repairing and replacing. Part 2: Describe a possession you have had for a long time. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    45,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000045' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000045', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Keeping things", "questions": ["Do you keep things for a long time?", "Is there something you have owned for many years?", "Do you find it hard to part with old belongings?", "Do you prefer old things or new things?"]}, {"topic": "The past", "questions": ["Do you enjoy looking back on the past?", "Do you keep any items from your childhood?", "What reminds you most of when you were young?", "Do you think the past was better in some ways?"]}, {"topic": "Repairing and replacing", "questions": ["Do you try to repair things when they break?", "Or do you prefer to buy something new?", "Are people good at fixing things these days?", "Should we be encouraged to repair more?"]}]}, "part2": {"cueCardTitle": "Describe a possession you have had for a long time.", "points": ["what it is", "how long you have had it", "how you got it", "and explain why you have kept it for so long."], "roundingOff": ["Do you still use it?", "Will you keep it in the future?"]}, "part3": {"topics": [{"topic": "Old and new", "questions": ["Why do people hold on to old possessions?", "Do you think old things are made better than new things?", "Is there value in keeping things for a long time?"]}, {"topic": "A throwaway society", "questions": ["Why do people replace things so quickly nowadays?", "What are the effects of a throwaway culture on the environment?", "How could people be encouraged to keep and repair their belongings?"]}]}}', 1);

-- Test 46 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000046',
    'speaking',
    'IELTS Speaking Test 46',
    'Part 1: Advertising, Media, Buying things. Part 2: Describe an advertisement you remember well. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    46,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000046' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000046', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Advertising", "questions": ["Do you notice advertisements around you?", "Where do you see adverts most often?", "Do adverts ever influence what you buy?", "Do you find advertising annoying or useful?"]}, {"topic": "Media", "questions": ["How do you usually spend time on media each day?", "Do you watch adverts, or do you skip them?", "Do you think there are too many adverts these days?", "Which kinds of adverts do you remember best?"]}, {"topic": "Buying things", "questions": ["What makes you decide to buy a product?", "Do you trust the claims made in adverts?", "Do reviews affect your choices?", "Do you research before buying?"]}]}, "part2": {"cueCardTitle": "Describe an advertisement you remember well.", "points": ["what the advertisement was for", "where you saw it", "what happened in it", "and explain why you remember it so well."], "roundingOff": ["Did the advert make you want to buy the product?", "Do you think it was an effective advert?"]}, "part3": {"topics": [{"topic": "Advertising and influence", "questions": ["Why is advertising so common in modern life?", "How do advertisements persuade people to buy things?", "Do you think advertising has too much influence on society?"]}, {"topic": "Adverts and honesty", "questions": ["Should there be stricter rules on advertising?", "Is it acceptable for adverts to target children?", "Do you think people can resist the influence of advertising?"]}]}}', 1);

-- Test 47 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000047',
    'speaking',
    'IELTS Speaking Test 47',
    'Part 1: Busy times, Time management, Rest. Part 2: Describe a time when you were very busy. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    47,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000047' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000047', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Busy times", "questions": ["Are you usually busy during the week?", "What keeps you busy most of the time?", "Do you prefer a busy life or a relaxed one?", "How do you feel at the end of a busy day?"]}, {"topic": "Time management", "questions": ["Are you good at managing your time?", "Do you make plans or lists?", "Do you ever run out of time?", "How do you prioritise your tasks?"]}, {"topic": "Rest", "questions": ["How do you unwind after being busy?", "Do you get enough rest?", "Do you find it hard to switch off?", "Is rest as important as work?"]}]}, "part2": {"cueCardTitle": "Describe a time when you were very busy.", "points": ["when this was", "why you were so busy", "what you had to do", "and explain how you managed during this time."], "roundingOff": ["Did you cope well with being so busy?", "Would you like to avoid being that busy again?"]}, "part3": {"topics": [{"topic": "A busy life", "questions": ["Why do many people feel busier than ever these days?", "Do you think being busy is a sign of a successful life?", "How can people balance work and rest?"]}, {"topic": "Time and modern life", "questions": ["Why do people often say they have no time?", "Do you think technology makes people busier or frees up time?", "How can people use their time more wisely?"]}]}}', 1);

-- Test 48 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000048',
    'speaking',
    'IELTS Speaking Test 48',
    'Part 1: Learning new things, Skills, Challenges. Part 2: Describe a time when you learned something new. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    48,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000048' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000048', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Learning new things", "questions": ["Do you enjoy learning new things?", "What was the last new thing you learned?", "Do you prefer learning alone or with a teacher?", "How do you feel when you learn something difficult?"]}, {"topic": "Skills", "questions": ["What skills have you learned recently?", "Are practical skills or academic skills more useful to you?", "Is there a skill you found hard to master?", "Do you think you learn quickly?"]}, {"topic": "Challenges", "questions": ["Do you enjoy a challenge?", "How do you deal with something difficult?", "Do you give up easily, or keep trying?", "What is the hardest thing you have ever learned?"]}]}, "part2": {"cueCardTitle": "Describe a time when you learned something new.", "points": ["what you learned", "when and where you learned it", "how you learned it", "and explain how you felt after learning it."], "roundingOff": ["Do you still use what you learned?", "Would you like to learn more about it?"]}, "part3": {"topics": [{"topic": "Learning through life", "questions": ["Why is it important to keep learning throughout life?", "Do you think adults learn differently from children?", "What is the best way to learn a new skill?"]}, {"topic": "Learning and society", "questions": ["Should employers help their staff learn new skills?", "Do you think people will need to learn more in the future?", "How has technology changed the way people learn?"]}]}}', 1);

-- Test 49 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000049',
    'speaking',
    'IELTS Speaking Test 49',
    'Part 1: Childhood, Games and play, Looking back. Part 2: Describe a memorable event from your childhood. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    49,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000049' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000049', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Childhood", "questions": ["Where did you grow up?", "What did you enjoy doing as a child?", "Who did you spend the most time with?", "Do you have happy memories of your childhood?"]}, {"topic": "Games and play", "questions": ["What games did you play when you were young?", "Did you play mostly indoors or outdoors?", "Do children today play the same games as you did?", "Do you think play is important for children?"]}, {"topic": "Looking back", "questions": ["Do you often think about your childhood?", "What do you miss most about being a child?", "Do you think you have changed a lot since then?", "Was childhood a happy time for you?"]}]}, "part2": {"cueCardTitle": "Describe a memorable event from your childhood.", "points": ["what the event was", "when it happened", "who was there", "and explain why it was so memorable."], "roundingOff": ["Do you still remember it clearly?", "Do you ever talk about it with others?"]}, "part3": {"topics": [{"topic": "Childhood memories", "questions": ["Why do people remember certain childhood events so vividly?", "Do you think childhood experiences shape the kind of adult a person becomes?", "Are childhood memories always accurate?"]}, {"topic": "Growing up", "questions": ["How has childhood changed compared with the past?", "Do you think children today have happier childhoods?", "What experiences are most important for a child to have?"]}]}}', 1);

-- Test 50 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000050',
    'speaking',
    'IELTS Speaking Test 50',
    'Part 1: Goals and achievements, Success, Effort. Part 2: Describe a time when you achieved something you were proud of. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    50,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000050' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000050', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Goals and achievements", "questions": ["Do you set goals for yourself?", "Have you achieved something you are proud of?", "Do you prefer easy goals or challenging ones?", "How do you feel when you reach a goal?"]}, {"topic": "Success", "questions": ["What does success mean to you?", "Do you think success is mostly about hard work?", "Who is the most successful person you know?", "Is success important to you?"]}, {"topic": "Effort", "questions": ["Do you work hard to get what you want?", "Do you keep going when things are difficult?", "Do you think effort always pays off?", "How do you motivate yourself?"]}]}, "part2": {"cueCardTitle": "Describe a time when you achieved something you were proud of.", "points": ["what you achieved", "when it happened", "how you achieved it", "and explain why you were so proud of it."], "roundingOff": ["Did others congratulate you?", "Would you like to achieve something similar again?"]}, "part3": {"topics": [{"topic": "Success and achievement", "questions": ["How do people usually measure success?", "Do you think success means different things to different people?", "Is success more about talent or hard work?"]}, {"topic": "Ambition", "questions": ["Do you think it is important for people to be ambitious?", "Can too much ambition be harmful?", "How can young people be motivated to achieve their goals?"]}]}}', 1);

-- Test 51 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000051',
    'speaking',
    'IELTS Speaking Test 51',
    'Part 1: Decisions, Advice, Planning. Part 2: Describe a difficult decision you had to make. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    51,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000051' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000051', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Decisions", "questions": ["Do you find it easy to make decisions?", "Do you prefer to decide quickly or take your time?", "Do you ask others for advice?", "Have you ever changed your mind about a big decision?"]}, {"topic": "Advice", "questions": ["Do you often give advice to others?", "Whose advice do you trust the most?", "Do you usually follow the advice you are given?", "Is it easy to give good advice?"]}, {"topic": "Planning", "questions": ["Do you like to plan things in advance?", "Do you make plans for the future?", "Do you prefer a fixed plan or being flexible?", "Do your plans usually work out?"]}]}, "part2": {"cueCardTitle": "Describe a difficult decision you had to make.", "points": ["what the decision was", "when you had to make it", "what the options were", "and explain why it was so difficult."], "roundingOff": ["Do you think you made the right choice?", "Did anyone help you decide?"]}, "part3": {"topics": [{"topic": "Making decisions", "questions": ["Why do some people find decisions harder than others?", "Is it better to decide alone or to seek advice?", "Do you think people make worse decisions when they are rushed?"]}, {"topic": "Choices in modern life", "questions": ["Do you think people today have too many choices?", "How does having many options affect decision making?", "Should important decisions always be made carefully and slowly?"]}]}}', 1);

-- Test 52 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000052',
    'speaking',
    'IELTS Speaking Test 52',
    'Part 1: Time and punctuality, Daily routine, Transport. Part 2: Describe a time when you were late for something. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    52,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000052' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000052', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Time and punctuality", "questions": ["Are you usually on time?", "Does it bother you when others are late?", "How do you avoid being late?", "Is being on time important in your culture?"]}, {"topic": "Daily routine", "questions": ["What does a normal day look like for you?", "Do you keep to a strict routine?", "What time do you usually get up?", "Do you prefer mornings or evenings?"]}, {"topic": "Transport", "questions": ["How do you usually travel around?", "Is the transport where you live reliable?", "Have you ever been delayed while travelling?", "How could transport be improved in your area?"]}]}, "part2": {"cueCardTitle": "Describe a time when you were late for something.", "points": ["what you were late for", "why you were late", "what happened as a result", "and explain how you felt about it."], "roundingOff": ["Are you often late?", "What do you do to avoid being late?"]}, "part3": {"topics": [{"topic": "Punctuality", "questions": ["Why is being on time considered important?", "Do you think attitudes to time differ between cultures?", "What problems can being late cause?"]}, {"topic": "Time in modern life", "questions": ["Do you think people are busier and more rushed than before?", "How does poor time management affect people?", "Should schools teach children how to manage their time?"]}]}}', 1);

-- Test 53 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000053',
    'speaking',
    'IELTS Speaking Test 53',
    'Part 1: Celebrations, Getting together, Special days. Part 2: Describe a celebration or party you enjoyed. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    53,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000053' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000053', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Celebrations", "questions": ["Do you enjoy parties and celebrations?", "What was the last celebration you went to?", "Do you prefer big parties or small gatherings?", "How do people usually celebrate in your country?"]}, {"topic": "Getting together", "questions": ["Do you like spending time with large groups?", "How often do you meet up with friends or family?", "Who usually organises get togethers in your family?", "What do you enjoy doing when you get together?"]}, {"topic": "Special days", "questions": ["Which special days do you look forward to?", "Do you prepare much for special occasions?", "Are special days as important as they used to be?", "Do you think celebrations are worth the effort?"]}]}, "part2": {"cueCardTitle": "Describe a celebration or party you enjoyed.", "points": ["what the occasion was", "where and when it took place", "who was there", "and explain why you enjoyed it so much."], "roundingOff": ["Would you like to go to a similar event again?", "Do you enjoy organising events yourself?"]}, "part3": {"topics": [{"topic": "Celebrations", "questions": ["Why do people around the world enjoy celebrations?", "Do you think celebrations are becoming too expensive?", "How have the ways people celebrate changed over time?"]}, {"topic": "Community and events", "questions": ["How do celebrations help bring people together?", "Do you think large public celebrations are important?", "Should people spend a lot of money on special occasions?"]}]}}', 1);

-- Test 54 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000054',
    'speaking',
    'IELTS Speaking Test 54',
    'Part 1: Patience, Waiting, Daily life. Part 2: Describe a time when you had to wait for something. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    54,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000054' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000054', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Patience", "questions": ["Are you a patient person?", "What situations test your patience?", "Do you mind waiting in queues?", "How do you pass the time when you have to wait?"]}, {"topic": "Waiting", "questions": ["Do you often have to wait for things?", "Do you get impatient easily?", "What do you usually do while waiting?", "Do you think people are less patient these days?"]}, {"topic": "Daily life", "questions": ["What parts of your day involve waiting?", "Do you use your phone while waiting?", "Do you prefer to plan ahead to avoid waiting?", "Does waiting ever bother you?"]}]}, "part2": {"cueCardTitle": "Describe a time when you had to wait for something.", "points": ["what you were waiting for", "how long you had to wait", "what you did while waiting", "and explain how you felt during the wait."], "roundingOff": ["Was the wait worth it in the end?", "Are you generally a patient person?"]}, "part3": {"topics": [{"topic": "Patience and waiting", "questions": ["Why do some people find it harder to wait than others?", "Do you think patience is an important quality?", "Are people becoming less patient in the modern world?"]}, {"topic": "A fast paced world", "questions": ["Why do people expect things to happen quickly nowadays?", "How has technology changed people’s patience?", "Can impatience ever be a good thing?"]}]}}', 1);

-- Test 55 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000055',
    'speaking',
    'IELTS Speaking Test 55',
    'Part 1: News, Sharing information, Communication. Part 2: Describe an occasion when you received good news. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    55,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000055' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000055', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "News", "questions": ["How do you usually hear news?", "Do you prefer good news or interesting news?", "Do you share news with others?", "How do you feel when you hear good news?"]}, {"topic": "Sharing information", "questions": ["How do you keep in touch with friends and family?", "Do you like to share your own news?", "How do you usually share important news?", "Do you prefer to give news in person or by message?"]}, {"topic": "Communication", "questions": ["Do you enjoy talking to people?", "Are you good at expressing your feelings?", "Do you prefer speaking or writing?", "Has the way you communicate changed recently?"]}]}, "part2": {"cueCardTitle": "Describe an occasion when you received good news.", "points": ["what the news was", "how you heard it", "who told you", "and explain how you felt when you received it."], "roundingOff": ["Did you share the news with others?", "Do you often receive good news?"]}, "part3": {"topics": [{"topic": "News and information", "questions": ["How do most people prefer to receive news these days?", "Do you think there is too much bad news in the media?", "How does hearing good or bad news affect people’s mood?"]}, {"topic": "Media today", "questions": ["Do you think the news is always reliable?", "How has the way people get news changed in recent years?", "Should people limit how much news they follow?"]}]}}', 1);

-- Test 56 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000056',
    'speaking',
    'IELTS Speaking Test 56',
    'Part 1: New experiences, Being adventurous, Food and travel. Part 2: Describe a time when you tried something for the first time. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    56,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000056' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000056', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "New experiences", "questions": ["Do you like trying new things?", "When did you last try something for the first time?", "Do you feel nervous when trying something new?", "Do you prefer routine or variety?"]}, {"topic": "Being adventurous", "questions": ["Would you describe yourself as adventurous?", "Do you like taking risks?", "What new activity would you like to try?", "Do you enjoy stepping out of your comfort zone?"]}, {"topic": "Food and travel", "questions": ["Do you like trying new foods?", "Would you try food from another country?", "Do you enjoy visiting places you have never been?", "Do you prefer the familiar or the unfamiliar?"]}]}, "part2": {"cueCardTitle": "Describe a time when you tried something for the first time.", "points": ["what you tried", "when and where it was", "why you decided to try it", "and explain how you felt about the experience."], "roundingOff": ["Would you do it again?", "Are you glad you tried it?"]}, "part3": {"topics": [{"topic": "Trying new things", "questions": ["Why are some people more willing to try new things than others?", "Do you think it is important to step out of your comfort zone?", "How can people become more open to new experiences?"]}, {"topic": "Change and comfort", "questions": ["Why do some people prefer to stick to familiar things?", "Do you think trying new things becomes harder as people get older?", "What are the benefits of having new experiences?"]}]}}', 1);

-- Test 57 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000057',
    'speaking',
    'IELTS Speaking Test 57',
    'Part 1: Sports and games, Winning and losing, Motivation. Part 2: Describe a competition or contest you took part in. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    57,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000057' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000057', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Sports and games", "questions": ["Do you enjoy competitive activities?", "Have you ever taken part in a competition?", "Do you prefer competing or watching?", "How do you feel when you win or lose?"]}, {"topic": "Winning and losing", "questions": ["Are you a competitive person?", "How do you handle losing?", "Do you think winning is important?", "Should children be taught that winning is not everything?"]}, {"topic": "Motivation", "questions": ["What motivates you to do your best?", "Do you perform better under pressure?", "Do you set yourself targets?", "How do you feel when you fail at something?"]}]}, "part2": {"cueCardTitle": "Describe a competition or contest you took part in.", "points": ["what the competition was", "when and where it took place", "what you had to do", "and explain how you felt about taking part."], "roundingOff": ["Did you do well?", "Would you take part again?"]}, "part3": {"topics": [{"topic": "Competition", "questions": ["Why do people enjoy taking part in competitions?", "Do you think competition brings out the best in people?", "Can competition ever be harmful?"]}, {"topic": "Competition in society", "questions": ["Is modern society too competitive?", "Should schools encourage competition among students?", "Is it better to focus on personal improvement or on beating others?"]}]}}', 1);

-- Test 58 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000058',
    'speaking',
    'IELTS Speaking Test 58',
    'Part 1: Moving and homes, New places, Neighbours and settling in. Part 2: Describe a time when you moved to a new place. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    58,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000058' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000058', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Moving and homes", "questions": ["Have you ever moved home?", "Do you like your current home?", "Would you like to live somewhere new?", "What do you look for in a place to live?"]}, {"topic": "New places", "questions": ["How do you feel about starting somewhere new?", "Do you find it easy to settle into new surroundings?", "Do you enjoy meeting new people?", "How long does it take you to feel at home somewhere?"]}, {"topic": "Neighbours and settling in", "questions": ["Do you get to know your neighbours quickly?", "What helps you feel settled in a new place?", "Is it easy to make friends in a new area?", "Do you prefer familiar places or new ones?"]}]}, "part2": {"cueCardTitle": "Describe a time when you moved to a new place.", "points": ["where you moved to", "when this happened", "why you moved", "and explain how you felt about the move."], "roundingOff": ["Did you settle in quickly?", "Are you happy that you moved?"]}, "part3": {"topics": [{"topic": "Moving and change", "questions": ["Why do people move from one place to another?", "What are the challenges of moving to a new area?", "Do you think moving often is good or bad for families?"]}, {"topic": "People and places", "questions": ["How does where people live affect their lives?", "Why do some people prefer to stay in one place their whole lives?", "Do you think people move around more than they used to?"]}]}}', 1);

-- Test 59 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000059',
    'speaking',
    'IELTS Speaking Test 59',
    'Part 1: Directions and maps, New areas, Travel. Part 2: Describe a time when you got lost somewhere. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    59,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000059' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000059', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Directions and maps", "questions": ["Are you good at finding your way around?", "Do you use maps on your phone?", "Do you prefer to explore or follow a set route?", "Have you ever got lost?"]}, {"topic": "New areas", "questions": ["Do you enjoy exploring unfamiliar places?", "How do you feel in a place you do not know?", "Do you ask strangers for directions?", "Do you plan routes before you travel?"]}, {"topic": "Travel", "questions": ["Do you like travelling to unfamiliar places?", "Do you research a place before you go?", "Do you prefer travelling with a guide or independently?", "What do you do if you cannot find your way?"]}]}, "part2": {"cueCardTitle": "Describe a time when you got lost somewhere.", "points": ["where you were", "how you got lost", "what you did", "and explain how you felt about the experience."], "roundingOff": ["Did anyone help you?", "Are you better at finding your way now?"]}, "part3": {"topics": [{"topic": "Finding the way", "questions": ["Why do some people have a better sense of direction than others?", "Do you think people rely too much on phones for directions?", "Has technology made people worse at reading maps?"]}, {"topic": "Exploring places", "questions": ["Do you think getting lost can sometimes be a good thing?", "Why do some people enjoy exploring unknown places?", "How has technology changed the way people travel and explore?"]}]}}', 1);

-- Test 60 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000060',
    'speaking',
    'IELTS Speaking Test 60',
    'Part 1: Hobbies, Free time, Interests. Part 2: Describe a hobby you enjoy. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    60,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000060' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000060', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Hobbies", "questions": ["What hobbies do you have?", "How did you get into your main hobby?", "How much time do you spend on it?", "Do you prefer indoor or outdoor hobbies?"]}, {"topic": "Free time", "questions": ["What do you do when you have spare time?", "Do you prefer active or relaxing activities?", "Do you have as much free time as you would like?", "How has the way you spend free time changed?"]}, {"topic": "Interests", "questions": ["Have your interests changed over the years?", "Do you share your hobbies with others?", "Would you like to take up a new hobby?", "Do you think hobbies are important?"]}]}, "part2": {"cueCardTitle": "Describe a hobby you enjoy.", "points": ["what the hobby is", "how long you have done it", "how often you do it", "and explain why you enjoy it."], "roundingOff": ["Would you recommend this hobby to others?", "Do you think you will continue it in the future?"]}, "part3": {"topics": [{"topic": "Hobbies and free time", "questions": ["Why is it important for people to have hobbies?", "Do you think people have less time for hobbies these days?", "How do hobbies benefit people’s lives?"]}, {"topic": "Interests through life", "questions": ["Do people’s hobbies change as they get older?", "Should children be encouraged to take up hobbies?", "Do you think some hobbies are more worthwhile than others?"]}]}}', 1);

-- Test 61 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000061',
    'speaking',
    'IELTS Speaking Test 61',
    'Part 1: Sports, Watching sport, Fitness. Part 2: Describe a sport you like to watch or play. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    61,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000061' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000061', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Sports", "questions": ["Do you play any sports?", "Which sport do you enjoy watching?", "Did you play sport at school?", "Do you think sport is important?"]}, {"topic": "Watching sport", "questions": ["Do you prefer watching sport live or on screen?", "Do you have a favourite team or player?", "Do you watch sport with others?", "Are big sporting events popular in your country?"]}, {"topic": "Fitness", "questions": ["How do you keep fit?", "Do you exercise regularly?", "Do you prefer exercising alone or with others?", "Has your attitude to exercise changed over time?"]}]}, "part2": {"cueCardTitle": "Describe a sport you like to watch or play.", "points": ["what the sport is", "how you got interested in it", "how often you watch or play it", "and explain why you enjoy it."], "roundingOff": ["Would you like to be better at this sport?", "Do many people enjoy it in your country?"]}, "part3": {"topics": [{"topic": "Sport and society", "questions": ["Why do so many people enjoy sport?", "Do you think sport brings people together?", "Should governments spend money on sport?"]}, {"topic": "Sport and health", "questions": ["How important is sport for a healthy lifestyle?", "Do you think schools should give sport more importance?", "Why do some people avoid exercise altogether?"]}]}}', 1);

-- Test 62 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000062',
    'speaking',
    'IELTS Speaking Test 62',
    'Part 1: The outdoors, Weather and seasons, Nature. Part 2: Describe an outdoor activity you enjoy. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    62,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000062' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000062', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "The outdoors", "questions": ["Do you like spending time outdoors?", "What outdoor activities do you enjoy?", "Do you prefer nature or the city?", "Did you spend much time outdoors as a child?"]}, {"topic": "Weather and seasons", "questions": ["What is your favourite season for going outside?", "Does the weather affect your outdoor plans?", "Do you prefer sunny or cool weather for activities?", "How does the weather where you live affect daily life?"]}, {"topic": "Nature", "questions": ["Are there green spaces near where you live?", "Do you enjoy walking in nature?", "Is protecting nature important to you?", "Do you think people spend enough time outdoors?"]}]}, "part2": {"cueCardTitle": "Describe an outdoor activity you enjoy.", "points": ["what the activity is", "where you do it", "who you do it with", "and explain why you enjoy this outdoor activity."], "roundingOff": ["How often do you do this activity?", "Would you like to do it more?"]}, "part3": {"topics": [{"topic": "Outdoor life", "questions": ["Why is it important for people to spend time outdoors?", "Do you think people spend less time outside than in the past?", "How can cities encourage people to be more active outdoors?"]}, {"topic": "Nature and wellbeing", "questions": ["What are the benefits of outdoor activities for health?", "Should children spend more time outdoors?", "How can access to green spaces be improved for everyone?"]}]}}', 1);

-- Test 63 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000063',
    'speaking',
    'IELTS Speaking Test 63',
    'Part 1: Games, Childhood, Fun and free time. Part 2: Describe a game you played as a child. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    63,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000063' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000063', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Games", "questions": ["Did you play many games as a child?", "What games did you enjoy most?", "Do you still play any games now?", "Do you prefer indoor or outdoor games?"]}, {"topic": "Childhood", "questions": ["Where did you play when you were young?", "Did you play alone or with others?", "Do children today play the same games you did?", "Do you think play is important for children?"]}, {"topic": "Fun and free time", "questions": ["What do you do for fun now?", "Do you enjoy playing games with friends or family?", "Do you prefer board games or digital games?", "Are games a good way to spend time together?"]}]}, "part2": {"cueCardTitle": "Describe a game you played as a child.", "points": ["what the game was", "how it was played", "who you played it with", "and explain why you enjoyed it."], "roundingOff": ["Do children still play this game today?", "Would you play it again?"]}, "part3": {"topics": [{"topic": "Games and childhood", "questions": ["Why are games important for children’s development?", "Do you think traditional games are being forgotten?", "How have children’s games changed over time?"]}, {"topic": "Play and technology", "questions": ["Do you think digital games are as good as traditional ones?", "Are children today too focused on screens?", "How can families encourage children to play together?"]}]}}', 1);

-- Test 64 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000064',
    'speaking',
    'IELTS Speaking Test 64',
    'Part 1: Health and fitness, Exercise, Rest and sleep. Part 2: Describe something you do to keep fit and healthy. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    64,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000064' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000064', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Health and fitness", "questions": ["Do you try to stay healthy?", "What do you do to keep fit?", "Do you pay attention to what you eat?", "Has your lifestyle become healthier over time?"]}, {"topic": "Exercise", "questions": ["How often do you exercise?", "Do you prefer exercising at home or at a gym?", "Do you find it easy to stay motivated?", "What kind of exercise do you enjoy most?"]}, {"topic": "Rest and sleep", "questions": ["Do you get enough sleep?", "Do you have a regular sleep routine?", "Do you feel rested when you wake up?", "Is sleep important for staying healthy?"]}]}, "part2": {"cueCardTitle": "Describe something you do to keep fit and healthy.", "points": ["what the activity is", "how often you do it", "when you started doing it", "and explain how it helps you stay healthy."], "roundingOff": ["Do you enjoy doing it?", "Would you recommend it to others?"]}, "part3": {"topics": [{"topic": "Health and lifestyle", "questions": ["Why do some people struggle to stay healthy?", "Do you think people today live healthier lives than in the past?", "What is the best way to encourage people to exercise?"]}, {"topic": "Health and society", "questions": ["Whose responsibility is it to keep people healthy?", "Should governments do more to promote healthy living?", "How does modern life affect people’s health?"]}]}}', 1);

-- Test 65 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000065',
    'speaking',
    'IELTS Speaking Test 65',
    'Part 1: Interests of others, Trying activities, Free time. Part 2: Describe a hobby that a friend or family member has that interests you. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    65,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000065' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000065', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Interests of others", "questions": ["Do your friends and family have interesting hobbies?", "Have you ever taken up a hobby because of someone else?", "Do you enjoy learning about other people’s interests?", "Do you and your friends share the same hobbies?"]}, {"topic": "Trying activities", "questions": ["Would you like to try a new activity?", "Do you enjoy watching others do their hobbies?", "Do you prefer relaxing or active pastimes?", "How do people usually discover new hobbies?"]}, {"topic": "Free time", "questions": ["How do you spend your free time?", "Do you have enough time for the things you enjoy?", "Do you prefer spending free time alone or with others?", "Has the way you spend free time changed?"]}]}, "part2": {"cueCardTitle": "Describe a hobby that a friend or family member has that interests you.", "points": ["whose hobby it is", "what the hobby is", "how they got into it", "and explain why it interests you."], "roundingOff": ["Would you like to take up this hobby yourself?", "Do you spend time doing it together?"]}, "part3": {"topics": [{"topic": "Hobbies and influence", "questions": ["Why do people often take up hobbies because of others?", "Do you think sharing a hobby brings people closer?", "How do people usually find new interests?"]}, {"topic": "Pastimes today", "questions": ["Do you think people have enough time for hobbies nowadays?", "Are some hobbies more respected than others?", "How might people’s hobbies change in the future?"]}]}}', 1);

-- Test 66 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000066',
    'speaking',
    'IELTS Speaking Test 66',
    'Part 1: Creativity, Making things, Art and craft. Part 2: Describe a creative activity you enjoy, such as drawing, writing or cooking. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    66,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000066' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000066', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Creativity", "questions": ["Do you think you are a creative person?", "What creative things do you enjoy doing?", "Were you creative as a child?", "Do you think creativity is important?"]}, {"topic": "Making things", "questions": ["Do you enjoy making things with your hands?", "Have you ever made something you were proud of?", "Do you prefer making things or buying them?", "Do you find creative activities relaxing?"]}, {"topic": "Art and craft", "questions": ["Did you enjoy art or craft at school?", "Do you do any drawing, painting or writing?", "Do you think creativity can be learned?", "Do you admire creative people?"]}]}, "part2": {"cueCardTitle": "Describe a creative activity you enjoy, such as drawing, writing or cooking.", "points": ["what the activity is", "how you learned to do it", "how often you do it", "and explain why you find it enjoyable."], "roundingOff": ["Do you share what you create with others?", "Would you like to become better at it?"]}, "part3": {"topics": [{"topic": "Creativity", "questions": ["Why is creativity valued in society?", "Do you think everyone has the potential to be creative?", "Can creativity be taught, or is it something people are born with?"]}, {"topic": "Creativity and education", "questions": ["Should schools do more to encourage creativity?", "Do you think creative subjects are as important as academic ones?", "How can creativity help people in their working lives?"]}]}}', 1);

-- Test 67 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000067',
    'speaking',
    'IELTS Speaking Test 67',
    'Part 1: Free time wishes, Activities, Balance. Part 2: Describe something you would like to do more often. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    67,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000067' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000067', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Free time wishes", "questions": ["Is there something you wish you had more time for?", "What would you do with an extra hour each day?", "Do you feel you have enough free time?", "What stops you from doing the things you enjoy?"]}, {"topic": "Activities", "questions": ["What activities do you enjoy but rarely do?", "Why do you not do them more often?", "Do you plan your free time or let it happen?", "Would you like to change how you spend your time?"]}, {"topic": "Balance", "questions": ["Do you have a good balance between work and rest?", "Do you find time for yourself?", "How do you decide what to prioritise?", "Do you think most people are too busy?"]}]}, "part2": {"cueCardTitle": "Describe something you would like to do more often.", "points": ["what it is", "how often you do it now", "why you do not do it more", "and explain why you would like to do it more often."], "roundingOff": ["What would help you make more time for it?", "Do you think you will do it more in the future?"]}, "part3": {"topics": [{"topic": "Time and priorities", "questions": ["Why do people often fail to make time for what they enjoy?", "Do you think people spend their time wisely?", "How can people find a better balance in their lives?"]}, {"topic": "Modern life and free time", "questions": ["Do you think people have less free time than in the past?", "How does work affect the time people have for themselves?", "Should employers help people achieve a better work life balance?"]}]}}', 1);

-- Test 68 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000068',
    'speaking',
    'IELTS Speaking Test 68',
    'Part 1: Television, Entertainment, Free time at home. Part 2: Describe a television programme you enjoy watching. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    68,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000068' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000068', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Television", "questions": ["Do you watch much television?", "What kinds of programmes do you like?", "Do you watch television alone or with others?", "Has your viewing changed with streaming services?"]}, {"topic": "Entertainment", "questions": ["How do you like to relax and be entertained?", "Do you prefer watching shows or doing activities?", "Do you enjoy talking about programmes with others?", "What makes a programme worth watching?"]}, {"topic": "Free time at home", "questions": ["What do you usually do at home in the evenings?", "Do you prefer active or relaxing evenings?", "Do you spend evenings with family?", "How do you unwind after a long day?"]}]}, "part2": {"cueCardTitle": "Describe a television programme you enjoy watching.", "points": ["what the programme is about", "how often you watch it", "why you started watching it", "and explain why you enjoy it."], "roundingOff": ["Would you recommend it to others?", "Do you watch it alone or with someone?"]}, "part3": {"topics": [{"topic": "Television and viewing habits", "questions": ["Why do people enjoy watching television so much?", "How have people’s viewing habits changed in recent years?", "Do you think television has a good or bad influence on society?"]}, {"topic": "Media and entertainment", "questions": ["Do you think streaming services have replaced traditional television?", "Should there be limits on how much television children watch?", "How might the way people watch programmes change in the future?"]}]}}', 1);

-- Test 69 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000069',
    'speaking',
    'IELTS Speaking Test 69',
    'Part 1: Films, Cinema, Stories. Part 2: Describe a film you have seen recently that you enjoyed. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    69,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000069' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000069', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Films", "questions": ["Do you enjoy watching films?", "What kinds of films do you like?", "Do you prefer watching films at home or at the cinema?", "How often do you watch films?"]}, {"topic": "Cinema", "questions": ["Do you like going to the cinema?", "When did you last see a film at the cinema?", "Do you prefer watching films alone or with others?", "Are cinemas popular in your country?"]}, {"topic": "Stories", "questions": ["Do you enjoy a good story?", "Do you prefer films or books?", "What makes a story enjoyable for you?", "Do you like happy or surprising endings?"]}]}, "part2": {"cueCardTitle": "Describe a film you have seen recently that you enjoyed.", "points": ["what the film was about", "when and where you watched it", "who you watched it with", "and explain why you enjoyed it."], "roundingOff": ["Would you watch it again?", "Would you recommend it to a friend?"]}, "part3": {"topics": [{"topic": "Films and stories", "questions": ["Why do people enjoy watching films so much?", "Do you think films can teach people important lessons?", "How have films changed over the years?"]}, {"topic": "Cinema and society", "questions": ["Do you think cinemas will survive in the age of streaming?", "Should films from other countries be shown more widely?", "Do films have a strong influence on people’s opinions?"]}]}}', 1);

-- Test 70 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000070',
    'speaking',
    'IELTS Speaking Test 70',
    'Part 1: Good news and happiness, Positive things, Sharing. Part 2: Describe a piece of good news you heard about someone you know. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    70,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000070' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000070', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Good news and happiness", "questions": ["What kind of news makes you happy?", "When did you last hear something that pleased you?", "Do you enjoy sharing good news with others?", "What usually puts you in a good mood?"]}, {"topic": "Positive things", "questions": ["Do you try to focus on positive things?", "What makes you feel optimistic?", "Do you think people focus too much on bad news?", "How do you cheer yourself up?"]}, {"topic": "Sharing", "questions": ["Do you like to tell others about your day?", "Who do you share your news with?", "Do you prefer sharing news in person or online?", "Is it important to celebrate good news?"]}]}, "part2": {"cueCardTitle": "Describe a piece of good news you heard about someone you know.", "points": ["what the news was", "who it was about", "how you found out", "and explain how you felt about it."], "roundingOff": ["Did you celebrate the news together?", "Do you often hear good news from friends?"]}, "part3": {"topics": [{"topic": "Good news and mood", "questions": ["Why does good news have such a strong effect on people?", "Do you think the media should report more positive news?", "How does hearing good news about others make people feel?"]}, {"topic": "News and society", "questions": ["Why do you think bad news gets more attention than good news?", "Should people limit the amount of negative news they follow?", "How can sharing good news benefit a community?"]}]}}', 1);

-- Test 71 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000071',
    'speaking',
    'IELTS Speaking Test 71',
    'Part 1: Music, Songs, Listening habits. Part 2: Describe a song or piece of music that you like. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    71,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000071' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000071', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Music", "questions": ["What kind of music do you enjoy?", "When do you usually listen to music?", "Has your taste in music changed over time?", "Do you prefer listening to music or playing it?"]}, {"topic": "Songs", "questions": ["Do you have a favourite song?", "Do you listen to music in other languages?", "Do you sing along to songs?", "Does music affect your mood?"]}, {"topic": "Listening habits", "questions": ["How do you usually listen to music?", "Do you listen to music while doing other things?", "Do you go to live concerts?", "Is music important in your daily life?"]}]}, "part2": {"cueCardTitle": "Describe a song or piece of music that you like.", "points": ["what the song or piece of music is", "when you first heard it", "when you usually listen to it", "and explain why you like it so much."], "roundingOff": ["Does it remind you of anything?", "Do you share this music with others?"]}, "part3": {"topics": [{"topic": "Music and people", "questions": ["Why is music so important to people around the world?", "Do you think musical taste says something about a person?", "How does music affect people’s emotions?"]}, {"topic": "Music and culture", "questions": ["How has the way people listen to music changed?", "Do you think traditional music is being lost?", "Should children be taught music at school?"]}]}}', 1);

-- Test 72 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000072',
    'speaking',
    'IELTS Speaking Test 72',
    'Part 1: Stories, Talking and listening, Family and memories. Part 2: Describe an interesting story someone told you. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    72,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000072' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000072', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Stories", "questions": ["Do you enjoy hearing stories?", "Did anyone tell you stories when you were young?", "Do you prefer true stories or made up ones?", "Do you enjoy telling stories yourself?"]}, {"topic": "Talking and listening", "questions": ["Are you a good listener?", "Do you enjoy long conversations?", "Do people often share things with you?", "Do you prefer talking or listening?"]}, {"topic": "Family and memories", "questions": ["Do older people in your family share stories?", "Do you enjoy hearing about the past?", "Are family stories important to you?", "Do you think these stories should be passed on?"]}]}, "part2": {"cueCardTitle": "Describe an interesting story someone told you.", "points": ["what the story was about", "who told it to you", "when you heard it", "and explain why you found it interesting."], "roundingOff": ["Have you shared this story with others?", "Do you remember it well?"]}, "part3": {"topics": [{"topic": "Stories and storytelling", "questions": ["Why have stories always been important to human beings?", "Do you think storytelling is a dying art?", "What can people learn from stories?"]}, {"topic": "Passing on stories", "questions": ["How are stories passed from one generation to the next?", "Do you think family stories should be recorded?", "Are stories still an effective way to teach lessons?"]}]}}', 1);

-- Test 73 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000073',
    'speaking',
    'IELTS Speaking Test 73',
    'Part 1: Advice, Guidance, Decisions. Part 2: Describe a piece of advice you received that was helpful. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    73,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000073' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000073', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Advice", "questions": ["Do people often come to you for advice?", "Whose advice do you value most?", "Do you usually take the advice you are given?", "Is it hard to give good advice?"]}, {"topic": "Guidance", "questions": ["Who helped guide you when you were younger?", "Do you think young people listen to advice?", "Do you prefer advice from friends or family?", "Have you ever ignored advice and regretted it?"]}, {"topic": "Decisions", "questions": ["Do you find it easy to make choices?", "Do you like to think things over before deciding?", "Do you rely on others when making decisions?", "Do you trust your own judgement?"]}]}, "part2": {"cueCardTitle": "Describe a piece of advice you received that was helpful.", "points": ["what the advice was", "who gave it to you", "when you received it", "and explain why it was so helpful."], "roundingOff": ["Do you still follow this advice?", "Have you shared it with anyone else?"]}, "part3": {"topics": [{"topic": "Giving and receiving advice", "questions": ["Why do people ask others for advice?", "Is it better to follow advice or to trust your own judgement?", "Do you think people give advice too freely?"]}, {"topic": "Advice and learning", "questions": ["Do young people today listen to the advice of older generations?", "Who are the best people to give advice to the young?", "Can people learn only from their own mistakes, or also from advice?"]}]}}', 1);

-- Test 74 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000074',
    'speaking',
    'IELTS Speaking Test 74',
    'Part 1: Plans, The future, Organisation. Part 2: Describe a plan you have for the future. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    74,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000074' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000074', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Plans", "questions": ["Do you like to plan ahead?", "Do you have any plans for the near future?", "Do you prefer having a plan or being spontaneous?", "Do your plans usually work out?"]}, {"topic": "The future", "questions": ["Do you often think about the future?", "Are you optimistic about the future?", "What are you looking forward to?", "Do you set long term goals?"]}, {"topic": "Organisation", "questions": ["Are you an organised person?", "Do you use lists or a calendar?", "How do you keep track of your plans?", "Do you find planning helpful or stressful?"]}]}, "part2": {"cueCardTitle": "Describe a plan you have for the future.", "points": ["what the plan is", "when you hope to achieve it", "what steps you need to take", "and explain why this plan is important to you."], "roundingOff": ["Do you think you will achieve it?", "Have you told others about your plan?"]}, "part3": {"topics": [{"topic": "Planning for the future", "questions": ["Why is it important to plan for the future?", "Do you think people plan too much or too little?", "Can having too many plans cause problems?"]}, {"topic": "Goals and society", "questions": ["Do you think young people plan their futures carefully?", "How can people prepare for an uncertain future?", "Should schools help students plan their careers?"]}]}}', 1);

-- Test 75 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000075',
    'speaking',
    'IELTS Speaking Test 75',
    'Part 1: Ambitions, Goals, Success. Part 2: Describe a goal you would like to achieve in the future. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    75,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000075' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000075', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Ambitions", "questions": ["Do you have any big ambitions?", "What would you most like to achieve in life?", "Have your ambitions changed as you have grown older?", "Do you think it is important to be ambitious?"]}, {"topic": "Goals", "questions": ["Do you set yourself targets?", "Do you prefer big goals or small ones?", "How do you stay motivated?", "How do you feel when you reach a goal?"]}, {"topic": "Success", "questions": ["What does success mean to you?", "Do you consider yourself successful?", "Who is someone you consider successful?", "Is success about money or happiness?"]}]}, "part2": {"cueCardTitle": "Describe a goal you would like to achieve in the future.", "points": ["what the goal is", "why you want to achieve it", "what you will need to do", "and explain how you would feel if you achieved it."], "roundingOff": ["Do you think it is a realistic goal?", "When do you hope to achieve it?"]}, "part3": {"topics": [{"topic": "Goals and ambition", "questions": ["Why is it important for people to have goals?", "Do you think ambition is always a good thing?", "How do people stay motivated to reach their goals?"]}, {"topic": "Achievement in society", "questions": ["Does society put too much pressure on people to succeed?", "How do people usually measure achievement?", "Should young people be encouraged to aim high?"]}]}}', 1);

-- Test 76 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000076',
    'speaking',
    'IELTS Speaking Test 76',
    'Part 1: Rules, School or work, Order and discipline. Part 2: Describe a rule at your school or workplace that you had to follow. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    76,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000076' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000076', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Rules", "questions": ["Are there many rules where you work or study?", "Do you find it easy to follow rules?", "Do you think rules are usually fair?", "Have you ever disagreed with a rule?"]}, {"topic": "School or work", "questions": ["What rules did you have to follow at school?", "Do you think rules at school are necessary?", "Are the rules where you work reasonable?", "Do you think there are too many rules in daily life?"]}, {"topic": "Order and discipline", "questions": ["Do you think discipline is important?", "Were you a well behaved child?", "Do rules make life easier or harder?", "Should rules ever be broken?"]}]}, "part2": {"cueCardTitle": "Describe a rule at your school or workplace that you had to follow.", "points": ["what the rule was", "why it existed", "whether you agreed with it", "and explain how it affected you."], "roundingOff": ["Do you think the rule was fair?", "Would you change it if you could?"]}, "part3": {"topics": [{"topic": "Rules and order", "questions": ["Why are rules important in schools and workplaces?", "Do you think rules are sometimes too strict?", "What happens when there are too few rules?"]}, {"topic": "Rules in society", "questions": ["Should people always follow rules, even unfair ones?", "Who should decide the rules in a community?", "How can rules be made fairer for everyone?"]}]}}', 1);

-- Test 77 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000077',
    'speaking',
    'IELTS Speaking Test 77',
    'Part 1: Subjects, Learning, School. Part 2: Describe a subject you enjoyed studying. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    77,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000077' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000077', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Subjects", "questions": ["What subjects did you study at school?", "Which subject did you enjoy the most?", "Was there a subject you found difficult?", "Do you still use what you learned?"]}, {"topic": "Learning", "questions": ["Do you enjoy learning new subjects?", "Do you prefer science subjects or arts subjects?", "What makes a subject interesting to you?", "Do you think all subjects are equally useful?"]}, {"topic": "School", "questions": ["Did you enjoy your school years?", "What was your favourite part of school?", "Do you keep in touch with school friends?", "How has education changed since you were at school?"]}]}, "part2": {"cueCardTitle": "Describe a subject you enjoyed studying.", "points": ["what the subject was", "when you studied it", "what you learned", "and explain why you enjoyed it."], "roundingOff": ["Do you still find this subject interesting?", "Has it been useful to you in life?"]}, "part3": {"topics": [{"topic": "Subjects and education", "questions": ["Why do students prefer some subjects over others?", "Do you think schools teach the right subjects?", "Should students be able to choose all their own subjects?"]}, {"topic": "Education and the future", "questions": ["Which subjects do you think will be most important in the future?", "Should practical subjects be given more importance?", "How might what students learn change in the coming years?"]}]}}', 1);

-- Test 78 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000078',
    'speaking',
    'IELTS Speaking Test 78',
    'Part 1: Languages, Communication, Culture. Part 2: Describe a language you would like to learn. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    78,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000078' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000078', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Languages", "questions": ["How many languages can you speak?", "When did you start learning English?", "Do you find learning languages easy or hard?", "Do you enjoy speaking other languages?"]}, {"topic": "Communication", "questions": ["Do you enjoy talking to people from other countries?", "Have you ever had trouble understanding someone?", "Do you think it is useful to speak more than one language?", "How do you practise your language skills?"]}, {"topic": "Culture", "questions": ["Are you interested in other cultures?", "Do you enjoy learning about different countries?", "Have you ever tried food from another culture?", "Do you think learning a language helps you understand a culture?"]}]}, "part2": {"cueCardTitle": "Describe a language you would like to learn.", "points": ["what the language is", "why you would like to learn it", "how you would go about learning it", "and explain how it might be useful to you."], "roundingOff": ["Do you think you will learn it one day?", "Do you know anyone who speaks it?"]}, "part3": {"topics": [{"topic": "Learning languages", "questions": ["Why do people choose to learn foreign languages?", "Do you think everyone should learn a second language?", "What is the best age to start learning a language?"]}, {"topic": "Languages and the world", "questions": ["How does speaking a foreign language benefit people?", "Do you think some languages are dying out?", "Will technology one day remove the need to learn languages?"]}]}}', 1);

-- Test 79 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000079',
    'speaking',
    'IELTS Speaking Test 79',
    'Part 1: Dreams and hopes, Aspirations, The future. Part 2: Describe a dream or ambition you have had for a long time. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    79,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000079' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000079', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Can you tell me your full name, please? What can I call you? Where are you from? Can I see your identification, please? Thank you.", "topics": [{"topic": "Dreams and hopes", "questions": ["Do you often think about your dreams for the future?", "What is something you have always wanted to do?", "Do you share your dreams with others?", "Do you believe dreams can come true?"]}, {"topic": "Aspirations", "questions": ["What did you want to be when you were a child?", "Have your hopes changed over time?", "Do you think it is important to have big dreams?", "What inspires you to keep going?"]}, {"topic": "The future", "questions": ["Are you hopeful about the future?", "What are you most looking forward to?", "Do you prefer to plan or to see what happens?", "What would make your future happy?"]}]}, "part2": {"cueCardTitle": "Describe a dream or ambition you have had for a long time.", "points": ["what the dream or ambition is", "when you first had it", "what you have done towards it", "and explain why it means so much to you."], "roundingOff": ["Do you think it will come true?", "Has it changed over the years?"]}, "part3": {"topics": [{"topic": "Dreams and ambitions", "questions": ["Why is it important for people to have dreams?", "Do you think people should always follow their dreams?", "Can having unrealistic dreams cause disappointment?"]}, {"topic": "Hopes and reality", "questions": ["How do people balance their dreams with everyday life?", "Do you think young people today are hopeful about the future?", "Should schools encourage students to pursue their ambitions?"]}]}}', 1);

-- Test 80 ---------------------------------------------------------------
INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)
VALUES (
    '33333333-3333-3333-3333-000000000080',
    'speaking',
    'IELTS Speaking Test 80',
    'Part 1: Food and meals, Eating together, Special meals. Part 2: Describe a memorable meal you have had. Part 3: two-way discussion.',
    'Three parts: a short interview, a 1-2 minute individual long turn after 1 minute of prep, and a two-way discussion. Speak naturally and aim for full, developed answers.',
    780,
    80,
    TRUE
)
ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        duration_seconds = EXCLUDED.duration_seconds,
        position = EXCLUDED.position,
        is_published = EXCLUDED.is_published,
        updated_at = now();

DELETE FROM test_resources WHERE test_id = '33333333-3333-3333-3333-000000000080' AND kind = 'speaking_script';
INSERT INTO test_resources (test_id, kind, content, position)
VALUES ('33333333-3333-3333-3333-000000000080', 'speaking_script', '{"part1": {"intro": "Good morning / afternoon. Could you tell me your full name, please? What can I call you? Where do you come from? May I see your identification? Thank you.", "topics": [{"topic": "Food and meals", "questions": ["Do you enjoy your meals?", "What is your favourite meal of the day?", "Do you prefer eating at home or out?", "Do you like trying food from other countries?"]}, {"topic": "Eating together", "questions": ["Do you usually eat with others?", "Are family meals important in your culture?", "Do you enjoy cooking for other people?", "What do you talk about during meals?"]}, {"topic": "Special meals", "questions": ["Do you eat special food on certain occasions?", "Who prepares the food at celebrations in your family?", "Do you have a favourite dish for special days?", "Are big meals common at celebrations in your country?"]}]}, "part2": {"cueCardTitle": "Describe a memorable meal you have had.", "points": ["what the meal was", "where and when you had it", "who you shared it with", "and explain why it was so memorable."], "roundingOff": ["Would you like to have that meal again?", "Do you often have meals like this?"]}, "part3": {"topics": [{"topic": "Food and gathering", "questions": ["Why do people around the world share meals together?", "Do you think family meals are as common as they used to be?", "What role does food play in social life?"]}, {"topic": "Food and culture", "questions": ["How does food reflect a country’s culture?", "Do you think traditional cooking is being lost?", "How might the way people eat change in the future?"]}]}}', 1);

COMMIT;
