-- Seed: Passive Voice & Academic Detachment (from Zero to Band 9 PDF)
-- English only, pure ASCII.
BEGIN;

UPDATE grammar_chapters SET
  title = 'Passive Voice & Academic Detachment',
  position = 2,
  estimated_min = 30,
  difficulty = 3,
  band_target = 'Band 7 range',
  summary = 'Use passive naturally in Task 1 processes and Task 2 academic claims without overusing it or losing agent clarity.',
  content = $content${"version": 1, "blocks": [{"id": "b01", "type": "paragraph", "text": "The passive voice shifts focus from the doer (agent) to the action or result. In academic English, that shift is often desirable: the process matters more than who did it. Task 1 process diagrams and many Task 2 claims rely on controlled passive use."}, {"id": "b02", "type": "heading", "level": 2, "text": "6.1 Form"}, {"id": "b03", "type": "paragraph", "text": "Passive = be + past participle. Tense is shown on be: is produced (present), was produced (past), has been produced (present perfect), will be produced (future), is being produced (present continuous). The agent, if needed, uses by: The report was written by a team of experts."}, {"id": "b04", "type": "heading", "level": 2, "text": "6.2 When to use passive in IELTS"}, {"id": "b05", "type": "paragraph", "text": "Use passive when the agent is unknown, obvious, or unimportant; when describing a process (Task 1); when a more formal, detached tone is needed. Prefer active when the agent is important or the passive would sound awkward."}, {"id": "b06", "type": "example_pair", "incorrect": "Someone heats the water to 100 degrees. Then someone filters it.", "correct": "The water is heated to 100 degrees. Then it is filtered.", "why": "Process steps focus on the material, not the unknown worker."}, {"id": "b07", "type": "heading", "level": 2, "text": "6.3 Common passive patterns"}, {"id": "b08", "type": "table", "headers": ["Pattern", "Example"], "rows": [["Process step", "The mixture is heated and then cooled."], ["It is said / believed / argued that...", "It is often argued that education reduces crime."], ["be + past participle + to-infinitive", "The policy is expected to reduce emissions."], ["Modal passive", "More funding should be allocated to research."]]}, {"id": "b09", "type": "ielts_impact", "skills": ["writing"], "title": "Where the passive earns marks", "body": "In Task 1 processes, consistent passive is the natural academic voice. In Task 2, selective passive (It is widely believed that... / Measures should be taken...) raises formality without emptying the essay of agents where agents matter.", "examples": {"task1": "Once the raw material has been filtered, it is conveyed to the furnace.", "task2": "It is widely accepted that early education shapes long-term outcomes."}}]}$content$::jsonb,
  is_published = true,
  updated_at = now()
WHERE slug = 'ch6-passive-voice';


INSERT INTO grammar_exercises (id, chapter_id, slug, title, kind, instructions, items, position, is_published)
VALUES (
  'a1000001-0001-4000-8000-000000000261',
  'a1000001-0001-4000-8000-000000000206',
  'ex-6-1-active-passive',
  'Exercise 6.1 - Active to Passive',
  'correction',
  'Rewrite each sentence in the passive. Keep the same tense.',
  $items1$[{"id": "q1", "prompt": "Workers produce the cars in this factory.", "answer": "The cars are produced in this factory.", "accepted": ["The cars are produced in this factory."], "reason": "Present simple passive.", "bn_note": null}, {"id": "q2", "prompt": "Someone has cancelled the meeting.", "answer": "The meeting has been cancelled.", "accepted": ["The meeting has been cancelled."], "reason": "Present perfect passive.", "bn_note": null}, {"id": "q3", "prompt": "They will announce the results tomorrow.", "answer": "The results will be announced tomorrow.", "accepted": ["The results will be announced tomorrow."], "reason": "Future passive.", "bn_note": null}, {"id": "q4", "prompt": "The team is reviewing the data.", "answer": "The data is being reviewed (by the team).", "accepted": ["The data is being reviewed.", "The data is being reviewed by the team."], "reason": "Present continuous passive.", "bn_note": null}, {"id": "q5", "prompt": "People should protect the environment.", "answer": "The environment should be protected.", "accepted": ["The environment should be protected."], "reason": "Modal passive.", "bn_note": null}, {"id": "q6", "prompt": "Researchers published the study in 2019.", "answer": "The study was published in 2019.", "accepted": ["The study was published in 2019.", "The study was published by researchers in 2019."], "reason": "Past simple passive.", "bn_note": null}]$items1$::jsonb,
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