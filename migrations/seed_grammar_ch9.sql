-- Seed: Nominalisation & Academic Density (from Zero to Band 9 PDF)
-- English only, pure ASCII.
BEGIN;

UPDATE grammar_chapters SET
  title = 'Nominalisation & Academic Density',
  position = 2,
  estimated_min = 30,
  difficulty = 4,
  band_target = 'Band 8-9 range',
  summary = 'Turn verbs and adjectives into precise nouns so Task 2 paragraphs densify without becoming stiff.',
  content = $content${"version": 1, "blocks": [{"id": "b01", "type": "paragraph", "text": "Nominalisation turns verbs and adjectives into nouns so you can pack more meaning into fewer clauses. It is a hallmark of academic writing when used with control."}, {"id": "b02", "type": "heading", "level": 2, "text": "9.1 Verb to noun / adjective to noun"}, {"id": "b03", "type": "table", "headers": ["Verb / Adjective", "Noun"], "rows": [["increase / grow", "an increase / growth"], ["pollute / expand / migrate", "pollution / expansion / migration"], ["decide / fail / invest / analyse", "a decision / a failure / investment / analysis"], ["important / available / scarce", "importance / availability / scarcity"], ["poor / strong / efficient", "poverty / strength / efficiency"]]}, {"id": "b04", "type": "heading", "level": 2, "text": "9.2 Three restructuring moves"}, {"id": "b05", "type": "paragraph", "text": "Move 1: There was / occurred + noun -- The economy grew sharply becomes There was a sharp growth in the economy. Move 2: Make the noun the subject with a cause-effect verb -- Because the population grew, housing became scarce becomes Population growth led to housing scarcity. Move 3: Adjective to the X of -- Education is important becomes the importance of education."}, {"id": "b06", "type": "example_pair", "incorrect": "Because the population grew, housing became scarce.", "correct": "Population growth led to housing scarcity.", "why": "Two clauses compressed into one dense noun-based clause."}, {"id": "b07", "type": "callout", "variant": "warning", "title": "Do not over-nominalise", "text": "Every sentence as a noun stack becomes unreadable. Mix nominalised academic claims with clear active sentences. Density is a tool, not a quota."}, {"id": "b08", "type": "ielts_impact", "skills": ["writing"], "title": "The hallmark of native-level writing", "body": "Controlled nominalisation raises lexical precision and lets you state cause-effect tightly. Examiners reward it when grammar stays accurate.", "examples": {"task2": "Rapid urban expansion has resulted in increased demand for affordable housing.", "task1": "There was a gradual decline in coal consumption over the period."}}]}$content$::jsonb,
  is_published = true,
  updated_at = now()
WHERE slug = 'ch9-nominalisation';


INSERT INTO grammar_exercises (id, chapter_id, slug, title, kind, instructions, items, position, is_published)
VALUES (
  'a1000001-0001-4000-8000-000000000291',
  'a1000001-0001-4000-8000-000000000309',
  'ex-9-1-nominalisation',
  'Exercise 9.1 - Nominalisation Drill',
  'correction',
  'Rewrite each sentence using nominalisation to increase academic density.',
  $items1$[{"id": "q1", "prompt": "The economy grew sharply.", "answer": "There was a sharp growth in the economy. / The economy experienced sharp growth.", "accepted": ["There was a sharp growth in the economy.", "The economy experienced sharp growth."], "reason": "Verb grow -> noun growth.", "bn_note": null}, {"id": "q2", "prompt": "Because the population grew, housing became scarce.", "answer": "Population growth led to housing scarcity.", "accepted": ["Population growth led to housing scarcity.", "Population growth resulted in housing scarcity."], "reason": "Cause-effect nominalisation.", "bn_note": null}, {"id": "q3", "prompt": "Education is important for development.", "answer": "The importance of education for development... / Education is of great importance for development.", "accepted": ["The importance of education for development cannot be overstated.", "Education is of great importance for development."], "reason": "Adjective important -> importance.", "bn_note": null}, {"id": "q4", "prompt": "Cities expanded, so traffic worsened.", "answer": "Urban expansion resulted in worsening traffic. / led to worse traffic.", "accepted": ["Urban expansion resulted in worsening traffic.", "Urban expansion led to worse traffic."], "reason": "expand -> expansion.", "bn_note": null}, {"id": "q5", "prompt": "They failed to invest in public transport.", "answer": "Their failure to invest in public transport... / The failure to invest in public transport...", "accepted": ["Their failure to invest in public transport caused congestion.", "The failure to invest in public transport worsened congestion."], "reason": "fail -> failure.", "bn_note": null}]$items1$::jsonb,
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