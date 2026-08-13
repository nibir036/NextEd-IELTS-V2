-- Seed: Inversion, Cleft Sentences & Advanced Emphasis (from Zero to Band 9 PDF)
-- English only, pure ASCII.
BEGIN;

UPDATE grammar_chapters SET
  title = 'Inversion, Cleft Sentences & Advanced Emphasis',
  position = 1,
  estimated_min = 30,
  difficulty = 4,
  band_target = 'Band 8-9 range',
  summary = 'Controlled inversion and cleft structures for emphasis that sound natural, not theatrical.',
  content = $content${"version": 1, "blocks": [{"id": "b01", "type": "paragraph", "text": "Inversion and cleft sentences are advanced tools for emphasis. Used sparingly and accurately, they signal Band 8-9 control. Overused, they sound forced. Aim for one or two well-placed examples per essay, not a display."}, {"id": "b02", "type": "heading", "level": 2, "text": "8.1 Negative inversion"}, {"id": "b03", "type": "paragraph", "text": "After negative or restrictive adverbials at the start of a sentence, invert subject and auxiliary: Not only did the policy reduce emissions, but it also created jobs. Rarely have cities faced such pressure. Hardly had the law passed when protests began. Never should governments ignore public health."}, {"id": "b04", "type": "example_pair", "incorrect": "Not only the policy reduced emissions, but it also created jobs.", "correct": "Not only did the policy reduce emissions, but it also created jobs.", "why": "After Not only at the front, invert: did + subject + base verb."}, {"id": "b05", "type": "heading", "level": 2, "text": "8.2 Cleft sentences"}, {"id": "b06", "type": "paragraph", "text": "Clefts put focus on one element: It was the lack of funding that delayed the project. What the city needs is reliable public transport. It is education that offers the clearest path out of poverty. Use them to highlight the key cause, solution, or contrast."}, {"id": "b07", "type": "heading", "level": 2, "text": "8.3 Other emphasis patterns"}, {"id": "b08", "type": "paragraph", "text": "Only then / Only by + -ing + inversion: Only by investing in rail can cities cut emissions. So + adjective + be + subject: So severe was the shortage that prices doubled. These are optional flourishes -- accuracy first."}, {"id": "b09", "type": "ielts_impact", "skills": ["writing", "speaking"], "title": "The Band 8.5 to 9.0 signal", "body": "One accurate inversion or cleft in Task 2 shows range without risking the rest of the script. Examiners notice control, not quantity.", "examples": {"task2": "Not only does better public transport reduce congestion, but it also improves air quality.", "speaking": "What I found most difficult was managing my time in the Reading test."}}]}$content$::jsonb,
  is_published = true,
  updated_at = now()
WHERE slug = 'ch8-inversion-clefts';


INSERT INTO grammar_exercises (id, chapter_id, slug, title, kind, instructions, items, position, is_published)
VALUES (
  'a1000001-0001-4000-8000-000000000281',
  'a1000001-0001-4000-8000-000000000308',
  'ex-8-1-inversion',
  'Exercise 8.1 - Inversion Transformation',
  'correction',
  'Rewrite using inversion where appropriate.',
  $items1$[{"id": "q1", "prompt": "The policy reduced emissions and created jobs. (Not only...)", "answer": "Not only did the policy reduce emissions, but it also created jobs.", "accepted": ["Not only did the policy reduce emissions, but it also created jobs."], "reason": "Not only + inversion.", "bn_note": null}, {"id": "q2", "prompt": "Cities have rarely faced such pressure.", "answer": "Rarely have cities faced such pressure.", "accepted": ["Rarely have cities faced such pressure."], "reason": "Negative adverbial fronting.", "bn_note": null}, {"id": "q3", "prompt": "Governments should never ignore public health.", "answer": "Never should governments ignore public health.", "accepted": ["Never should governments ignore public health."], "reason": "Never + inversion.", "bn_note": null}, {"id": "q4", "prompt": "Cities can cut emissions only by investing in rail.", "answer": "Only by investing in rail can cities cut emissions.", "accepted": ["Only by investing in rail can cities cut emissions."], "reason": "Only by + -ing + inversion.", "bn_note": null}]$items1$::jsonb,
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


INSERT INTO grammar_exercises (id, chapter_id, slug, title, kind, instructions, items, position, is_published)
VALUES (
  'a1000001-0001-4000-8000-000000000282',
  'a1000001-0001-4000-8000-000000000308',
  'ex-8-2-clefts',
  'Exercise 8.2 - Cleft Sentence Construction',
  'correction',
  'Rewrite as a cleft sentence to emphasise the underlined idea (or the key idea).',
  $items2$[{"id": "q1", "prompt": "The lack of funding delayed the project.", "answer": "It was the lack of funding that delayed the project.", "accepted": ["It was the lack of funding that delayed the project."], "reason": "It-cleft on the cause.", "bn_note": null}, {"id": "q2", "prompt": "The city needs reliable public transport.", "answer": "What the city needs is reliable public transport.", "accepted": ["What the city needs is reliable public transport."], "reason": "What-cleft.", "bn_note": null}, {"id": "q3", "prompt": "Education offers the clearest path out of poverty.", "answer": "It is education that offers the clearest path out of poverty.", "accepted": ["It is education that offers the clearest path out of poverty."], "reason": "It-cleft on education.", "bn_note": null}]$items2$::jsonb,
  2,
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