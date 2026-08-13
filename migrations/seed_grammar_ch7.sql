-- Seed: Conditionals, Hedging & Hypothetical Reasoning (from Zero to Band 9 PDF)
-- English only, pure ASCII.
BEGIN;

UPDATE grammar_chapters SET
  title = 'Conditionals, Hedging & Hypothetical Reasoning',
  position = 3,
  estimated_min = 35,
  difficulty = 3,
  band_target = 'Band 7 range',
  summary = 'Zero to mixed conditionals plus hedging phrases that keep Task 2 claims precise and examiner-safe.',
  content = $content${"version": 1, "blocks": [{"id": "b01", "type": "paragraph", "text": "Conditionals let you discuss causes, consequences, and hypothetical situations -- core skills for Task 2 and Speaking Part 3. Hedging softens claims so they stay accurate and academic rather than absolute."}, {"id": "b02", "type": "heading", "level": 2, "text": "7.1 The four core conditionals"}, {"id": "b03", "type": "table", "headers": ["Type", "Form", "Use", "Example"], "rows": [["Zero", "if + present, present", "general truths", "If water reaches 100C, it boils."], ["First", "if + present, will + base", "real future possibility", "If the government invests, traffic will ease."], ["Second", "if + past, would + base", "unreal present/future", "If I had more time, I would study abroad."], ["Third", "if + past perfect, would have + p.p.", "unreal past", "If they had invested earlier, congestion would have fallen."]]}, {"id": "b04", "type": "heading", "level": 2, "text": "7.2 Mixed conditionals"}, {"id": "b05", "type": "paragraph", "text": "Mixed conditionals combine times: If they had invested earlier (past), the city would be less crowded now (present result). Useful for sophisticated Task 2 analysis."}, {"id": "b06", "type": "heading", "level": 2, "text": "7.3 Hedging language"}, {"id": "b07", "type": "paragraph", "text": "Absolute claims (always, never, all, completely) are risky. Prefer hedges: tend to, often, may, might, could, appear to, seem to, it is likely that, a significant number of, in many cases. Hedging is not weakness -- it is precision."}, {"id": "b08", "type": "example_pair", "incorrect": "Technology always improves education for all students.", "correct": "Technology often improves learning outcomes for many students.", "why": "Hedged claim is more accurate and academic."}, {"id": "b09", "type": "l1_error_fixer", "title": "Over-generalisation", "body": "Bangla academic style sometimes favours strong statements. In IELTS, over-generalisation costs Task Response and accuracy.", "error_types": [{"label": "Absolute quantifiers", "incorrect": "All people prefer city life. / Pollution always comes from cars.", "correct": "Many people prefer city life. / Pollution often comes from vehicle emissions."}, {"label": "Missing conditional structure", "incorrect": "If the government invests more, traffic ease.", "correct": "If the government invests more, traffic will ease."}]}, {"id": "b10", "type": "ielts_impact", "skills": ["writing", "speaking"], "title": "Conditionals and hedging in the exam", "body": "Accurate first and second conditionals appear constantly in Task 2 solutions and Speaking Part 3 speculation. Hedging lifts both GRA and Task Response by keeping claims defensible.", "examples": {"task2": "If governments invested more in rail, urban emissions would likely fall.", "speaking": "If I had the chance, I would study environmental science."}}]}$content$::jsonb,
  is_published = true,
  updated_at = now()
WHERE slug = 'ch7-conditionals-hedging';


INSERT INTO grammar_exercises (id, chapter_id, slug, title, kind, instructions, items, position, is_published)
VALUES (
  'a1000001-0001-4000-8000-000000000271',
  'a1000001-0001-4000-8000-000000000207',
  'ex-7-1-conditional-rewrite',
  'Exercise 7.1 - Conditional Rewrite',
  'correction',
  'Rewrite using an appropriate conditional form.',
  $items1$[{"id": "q1", "prompt": "Heat water to 100C. It boils. (zero)", "answer": "If you heat water to 100C, it boils.", "accepted": ["If you heat water to 100C, it boils.", "If water is heated to 100C, it boils."], "reason": "Zero conditional for general truth.", "bn_note": null}, {"id": "q2", "prompt": "The government invests in buses. Traffic will improve. (first)", "answer": "If the government invests in buses, traffic will improve.", "accepted": ["If the government invests in buses, traffic will improve."], "reason": "First conditional -- real future.", "bn_note": null}, {"id": "q3", "prompt": "I do not have enough money. I cannot study abroad. (second)", "answer": "If I had enough money, I would study abroad.", "accepted": ["If I had enough money, I would study abroad."], "reason": "Second conditional -- unreal present.", "bn_note": null}, {"id": "q4", "prompt": "They did not build the metro. Congestion stayed high. (third)", "answer": "If they had built the metro, congestion would have fallen / would not have stayed high.", "accepted": ["If they had built the metro, congestion would have fallen.", "If they had built the metro, congestion would not have stayed high."], "reason": "Third conditional -- unreal past.", "bn_note": null}, {"id": "q5", "prompt": "They did not invest earlier. The city is crowded now. (mixed)", "answer": "If they had invested earlier, the city would be less crowded now.", "accepted": ["If they had invested earlier, the city would be less crowded now."], "reason": "Mixed: past condition, present result.", "bn_note": null}]$items1$::jsonb,
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
  'a1000001-0001-4000-8000-000000000272',
  'a1000001-0001-4000-8000-000000000207',
  'ex-7-2-hedging',
  'Exercise 7.2 - Hedging Upgrade',
  'correction',
  'Rewrite each absolute claim with appropriate hedging.',
  $items2$[{"id": "q1", "prompt": "Technology always improves education.", "answer": "Technology often / can improve education.", "accepted": ["Technology often improves education.", "Technology can improve education.", "Technology tends to improve education."], "reason": "Remove absolute always.", "bn_note": null}, {"id": "q2", "prompt": "All city residents hate public transport.", "answer": "Many city residents dislike public transport. / Some residents are dissatisfied with...", "accepted": ["Many city residents dislike public transport.", "Some city residents are dissatisfied with public transport."], "reason": "Avoid all.", "bn_note": null}, {"id": "q3", "prompt": "This policy will completely solve unemployment.", "answer": "This policy may help reduce unemployment. / is likely to reduce...", "accepted": ["This policy may help reduce unemployment.", "This policy is likely to reduce unemployment."], "reason": "Soften certainty.", "bn_note": null}]$items2$::jsonb,
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