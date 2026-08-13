-- Seed: Exhaustive Answer Keys & Step-by-Step Explanations (from Zero to Band 9 PDF)
-- English only, pure ASCII.
BEGIN;

UPDATE grammar_chapters SET
  title = 'Exhaustive Answer Keys & Step-by-Step Explanations',
  position = 2,
  estimated_min = 25,
  difficulty = 1,
  band_target = 'Reference',
  summary = 'Consolidated keys and reasoning for every exercise in the course, organised for quick self-check after each chapter.',
  content = $content${"version": 1, "blocks": [{"id": "b01", "type": "paragraph", "text": "In the printed book, Chapter 11 consolidates every answer key. In this LMS, keys and explanations are already attached to each exercise (shown after you submit). Use this chapter as a checklist of what you should be able to explain, not only answer."}, {"id": "b02", "type": "heading", "level": 2, "text": "11.1 How to review effectively"}, {"id": "b03", "type": "paragraph", "text": "After each exercise: (1) note every miss by category; (2) rewrite the rule in one line in your own words; (3) write one new example of your own. Revisit misses after 48 hours. Patterns that recur three times go on your exam-day error log."}, {"id": "b04", "type": "heading", "level": 2, "text": "11.2 Module mastery checklist"}, {"id": "b05", "type": "paragraph", "text": "Module 1: agreement cases, five core tenses, article decision path, Task 1 prepositions, top L1 preposition errors. Module 2: complex sentences without fragments, passive in processes, first/second conditionals, basic hedging. Module 3: one accurate inversion or cleft, controlled nominalisation in cause-effect claims."}, {"id": "b06", "type": "callout", "variant": "regional_tip", "title": "Next step", "text": "When Module 1-3 exercises are consistently above 80%, move to full timed Writing Task 1 and Task 2 with a 3-minute final grammar pass using the checklist in Chapter 10."}]}$content$::jsonb,
  is_published = true,
  updated_at = now()
WHERE slug = 'ch11-answer-keys';

COMMIT;