-- Seed: Full Essay Editing & Speaking Transcript Polish (from Zero to Band 9 PDF)
-- English only, pure ASCII.
BEGIN;

UPDATE grammar_chapters SET
  title = 'Full Essay Editing & Speaking Transcript Polish',
  position = 1,
  estimated_min = 40,
  difficulty = 3,
  band_target = 'Exam readiness',
  summary = 'Timed edit drills on full Task 1/Task 2 scripts and Speaking Part 2-3 transcripts using every rule from Modules 1-3.',
  content = $content${"version": 1, "blocks": [{"id": "b01", "type": "paragraph", "text": "This chapter applies everything from Modules 1-3 under exam-like conditions. You will edit full paragraphs and short transcripts for agreement, tense, articles, prepositions, complex sentences, passive, conditionals, and hedging."}, {"id": "b02", "type": "heading", "level": 2, "text": "10.1 How to use these drills"}, {"id": "b03", "type": "paragraph", "text": "1) Read the faulty text once without fixing. 2) Mark errors by category (agreement, tense, article, preposition, clause). 3) Rewrite the whole text cleanly. 4) Compare with the model and note any error type you still miss. Log recurring faults -- that log becomes your personal exam-day checklist."}, {"id": "b04", "type": "heading", "level": 2, "text": "10.2 Editing priorities (2-minute pass)"}, {"id": "b05", "type": "paragraph", "text": "When time is short, scan in this order: (1) every verb -- does it agree and sit in the right tense? (2) every singular countable noun -- article decision? (3) dependent prepositions and Task 1 by/from/to/at? (4) any fragment or comma splice?"}, {"id": "b06", "type": "callout", "variant": "regional_tip", "title": "Exam-day tip", "text": "Leave 3-4 minutes at the end of Writing for a pure grammar pass. Content edits after minute 35 rarely raise the band as much as fixing five agreement or article errors."}]}$content$::jsonb,
  is_published = true,
  updated_at = now()
WHERE slug = 'ch10-essay-editing';


INSERT INTO grammar_exercises (id, chapter_id, slug, title, kind, instructions, items, position, is_published)
VALUES (
  'a1000001-0001-4000-8000-000000000301',
  'a1000001-0001-4000-8000-000000000410',
  'ex-10-1-task2-edit',
  'Exercise 10.1 - Task 2 Paragraph Edit',
  'essay_edit',
  'The paragraph has multiple grammar errors across Modules 1-3. Rewrite it correctly.',
  $items1$[{"id": "para1", "prompt": "In recent years, the number of people who moves to cities have increased rapidly. There is many reason for this. First, cities offers better job. Second, each of the young people want access to good education. Although living in a city have disadvantages, the benefits is greater. According to me, government should invest more to public transport so that congestion can reduce.", "answer": "In recent years, the number of people who move to cities has increased rapidly. There are many reasons for this. First, cities offer better jobs. Second, each of the young people wants access to a good education. Although living in a city has disadvantages, the benefits are greater. In my opinion, the government should invest more in public transport so that congestion can be reduced.", "accepted": [], "reason": "Agreement, articles, prepositions, passive, according to me -> in my opinion.", "bn_note": null, "corrections": [{"from": "who moves", "to": "who move", "why": "people is plural"}, {"from": "have increased", "to": "has increased", "why": "the number is singular"}, {"from": "There is many reason", "to": "There are many reasons", "why": "plural subject"}, {"from": "cities offers better job", "to": "cities offer better jobs", "why": "plural + countable plural"}, {"from": "each ... want", "to": "each ... wants", "why": "each is singular"}, {"from": "living ... have", "to": "living ... has", "why": "gerund subject singular"}, {"from": "benefits is", "to": "benefits are", "why": "plural"}, {"from": "According to me", "to": "In my opinion", "why": "L1 preposition error"}, {"from": "invest more to", "to": "invest more in", "why": "invest in"}, {"from": "can reduce", "to": "can be reduced", "why": "passive for agentless process"}]}]$items1$::jsonb,
  1,
  true
)
ON CONFLICT (chapter_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  kind = EXCLUDED.kind,
  instructions = EXCLUDED.instructions,
  items = EXCLUDED.items,
  position = EXCLUDED.position,
  is_published = EXCLUDED.is_published;

COMMIT;