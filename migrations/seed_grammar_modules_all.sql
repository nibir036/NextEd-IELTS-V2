-- =====================================================================
-- Seed: All grammar modules + chapter shells (English-only, pure ASCII)
-- Chapter 1 content is already seeded; this adds Modules 2-4 and Ch 2-11 shells.
-- Safe to re-run (ON CONFLICT).
-- =====================================================================
BEGIN;

INSERT INTO grammar_modules (id, slug, title, subtitle, band_unlock, description, position, is_published)
VALUES (
  'a1000001-0001-4000-8000-000000000001',
  'module-1-foundations',
  'The Foundational Zero-to-Hero Grammar Engine',
  'Agreement, tenses, articles, prepositions',
  'clears Band 6',
  'Fixes the four faults that quietly lower your score on every line: verbs that do not agree with their subjects, tenses that put events in the wrong time, missing or misused articles, and wrong prepositions.',
  1,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  band_unlock = EXCLUDED.band_unlock,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO grammar_modules (id, slug, title, subtitle, band_unlock, description, position, is_published)
VALUES (
  'a1000001-0001-4000-8000-000000000002',
  'module-2-complex-structures',
  'Band 7.0+ Complex Structures & Range Booster',
  'Clauses, passive voice, conditionals & hedging',
  'unlocks Band 7',
  'Moves you from safe simple sentences into the complex structures examiners reward for Grammatical Range: subordinate clauses, academic passive, conditionals, and careful hedging language.',
  2,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  band_unlock = EXCLUDED.band_unlock,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO grammar_modules (id, slug, title, subtitle, band_unlock, description, position, is_published)
VALUES (
  'a1000001-0001-4000-8000-000000000003',
  'module-3-band9-masterclass',
  'Band 9.0 Masterclass (Advanced Linguistic Precision)',
  'Inversion, clefts, nominalisation',
  'targets Band 8-9',
  'Advanced tools that mark a high-band script: inversion and cleft sentences for emphasis, plus nominalisation for academic density without sounding forced.',
  3,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  band_unlock = EXCLUDED.band_unlock,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO grammar_modules (id, slug, title, subtitle, band_unlock, description, position, is_published)
VALUES (
  'a1000001-0001-4000-8000-000000000004',
  'module-4-full-workbook',
  'The Full Workbook',
  'Essay editing, transcript polish, answer keys',
  'exam readiness',
  'Apply everything under timed conditions: full essay and speaking transcript edits, plus exhaustive answer keys and step-by-step explanations.',
  4,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  band_unlock = EXCLUDED.band_unlock,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO grammar_chapters (
  id, module_id, slug, title, position, estimated_min, difficulty,
  band_target, summary, content, is_published
)
VALUES (
  'a1000001-0001-4000-8000-000000000102',
  'a1000001-0001-4000-8000-000000000001',
  'ch2-tense-mastery',
  'Tense Mastery & Time Precision',
  2,
  35,
  2,
  'Band 6-7 accuracy',
  'Put every verb in the right time. Five high-frequency tenses cover most IELTS Writing and Speaking, with a clear map of all twelve so nothing is a mystery.',
  $content${"version": 1, "blocks": [{"id": "b01", "type": "heading", "level": 2, "text": "Tense Mastery & Time Precision"}, {"id": "b02", "type": "paragraph", "text": "Put every verb in the right time. Five high-frequency tenses cover most IELTS Writing and Speaking, with a clear map of all twelve so nothing is a mystery. Full lesson content will be added in the next seed pass."}, {"id": "b03", "type": "callout", "variant": "warning", "title": "Coming soon", "text": "This chapter shell is published so you can navigate the full module tree. Detailed rules, examples, and exercises land in the next content seed."}]}$content$::jsonb,
  true
)
ON CONFLICT (module_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  estimated_min = EXCLUDED.estimated_min,
  difficulty = EXCLUDED.difficulty,
  band_target = EXCLUDED.band_target,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO grammar_chapters (
  id, module_id, slug, title, position, estimated_min, difficulty,
  band_target, summary, content, is_published
)
VALUES (
  'a1000001-0001-4000-8000-000000000103',
  'a1000001-0001-4000-8000-000000000001',
  'ch3-articles-nouns',
  'Articles (A, An, The) & Noun Types',
  3,
  30,
  2,
  'Band 6 accuracy',
  'Stop guessing a/an/the. Learn the decision path for countable, uncountable, specific, and general nouns that examiners notice on the first page.',
  $content${"version": 1, "blocks": [{"id": "b01", "type": "heading", "level": 2, "text": "Articles (A, An, The) & Noun Types"}, {"id": "b02", "type": "paragraph", "text": "Stop guessing a/an/the. Learn the decision path for countable, uncountable, specific, and general nouns that examiners notice on the first page. Full lesson content will be added in the next seed pass."}, {"id": "b03", "type": "callout", "variant": "warning", "title": "Coming soon", "text": "This chapter shell is published so you can navigate the full module tree. Detailed rules, examples, and exercises land in the next content seed."}]}$content$::jsonb,
  true
)
ON CONFLICT (module_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  estimated_min = EXCLUDED.estimated_min,
  difficulty = EXCLUDED.difficulty,
  band_target = EXCLUDED.band_target,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO grammar_chapters (
  id, module_id, slug, title, position, estimated_min, difficulty,
  band_target, summary, content, is_published
)
VALUES (
  'a1000001-0001-4000-8000-000000000104',
  'a1000001-0001-4000-8000-000000000001',
  'ch4-prepositions',
  'Prepositions & Dependency Rules',
  4,
  30,
  2,
  'Band 6 accuracy',
  'Fix the preposition pairs and dependent prepositions that leak marks in Task 1 trends and Task 2 argumentation.',
  $content${"version": 1, "blocks": [{"id": "b01", "type": "heading", "level": 2, "text": "Prepositions & Dependency Rules"}, {"id": "b02", "type": "paragraph", "text": "Fix the preposition pairs and dependent prepositions that leak marks in Task 1 trends and Task 2 argumentation. Full lesson content will be added in the next seed pass."}, {"id": "b03", "type": "callout", "variant": "warning", "title": "Coming soon", "text": "This chapter shell is published so you can navigate the full module tree. Detailed rules, examples, and exercises land in the next content seed."}]}$content$::jsonb,
  true
)
ON CONFLICT (module_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  estimated_min = EXCLUDED.estimated_min,
  difficulty = EXCLUDED.difficulty,
  band_target = EXCLUDED.band_target,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO grammar_chapters (
  id, module_id, slug, title, position, estimated_min, difficulty,
  band_target, summary, content, is_published
)
VALUES (
  'a1000001-0001-4000-8000-000000000205',
  'a1000001-0001-4000-8000-000000000002',
  'ch5-complex-sentences',
  'Complex Sentences & Subordinate Clauses',
  1,
  35,
  3,
  'Band 7 range',
  'Build multi-clause sentences with relative, adverbial, and noun clauses so range scores climb without sacrificing accuracy.',
  $content${"version": 1, "blocks": [{"id": "b01", "type": "heading", "level": 2, "text": "Complex Sentences & Subordinate Clauses"}, {"id": "b02", "type": "paragraph", "text": "Build multi-clause sentences with relative, adverbial, and noun clauses so range scores climb without sacrificing accuracy. Full lesson content will be added in the next seed pass."}, {"id": "b03", "type": "callout", "variant": "warning", "title": "Coming soon", "text": "This chapter shell is published so you can navigate the full module tree. Detailed rules, examples, and exercises land in the next content seed."}]}$content$::jsonb,
  true
)
ON CONFLICT (module_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  estimated_min = EXCLUDED.estimated_min,
  difficulty = EXCLUDED.difficulty,
  band_target = EXCLUDED.band_target,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO grammar_chapters (
  id, module_id, slug, title, position, estimated_min, difficulty,
  band_target, summary, content, is_published
)
VALUES (
  'a1000001-0001-4000-8000-000000000206',
  'a1000001-0001-4000-8000-000000000002',
  'ch6-passive-voice',
  'Passive Voice & Academic Detachment',
  2,
  30,
  3,
  'Band 7 range',
  'Use passive naturally in Task 1 processes and Task 2 academic claims without overusing it or losing agent clarity.',
  $content${"version": 1, "blocks": [{"id": "b01", "type": "heading", "level": 2, "text": "Passive Voice & Academic Detachment"}, {"id": "b02", "type": "paragraph", "text": "Use passive naturally in Task 1 processes and Task 2 academic claims without overusing it or losing agent clarity. Full lesson content will be added in the next seed pass."}, {"id": "b03", "type": "callout", "variant": "warning", "title": "Coming soon", "text": "This chapter shell is published so you can navigate the full module tree. Detailed rules, examples, and exercises land in the next content seed."}]}$content$::jsonb,
  true
)
ON CONFLICT (module_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  estimated_min = EXCLUDED.estimated_min,
  difficulty = EXCLUDED.difficulty,
  band_target = EXCLUDED.band_target,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO grammar_chapters (
  id, module_id, slug, title, position, estimated_min, difficulty,
  band_target, summary, content, is_published
)
VALUES (
  'a1000001-0001-4000-8000-000000000207',
  'a1000001-0001-4000-8000-000000000002',
  'ch7-conditionals-hedging',
  'Conditionals, Hedging & Hypothetical Reasoning',
  3,
  35,
  3,
  'Band 7 range',
  'Zero to mixed conditionals plus hedging phrases that keep Task 2 claims precise and examiner-safe.',
  $content${"version": 1, "blocks": [{"id": "b01", "type": "heading", "level": 2, "text": "Conditionals, Hedging & Hypothetical Reasoning"}, {"id": "b02", "type": "paragraph", "text": "Zero to mixed conditionals plus hedging phrases that keep Task 2 claims precise and examiner-safe. Full lesson content will be added in the next seed pass."}, {"id": "b03", "type": "callout", "variant": "warning", "title": "Coming soon", "text": "This chapter shell is published so you can navigate the full module tree. Detailed rules, examples, and exercises land in the next content seed."}]}$content$::jsonb,
  true
)
ON CONFLICT (module_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  estimated_min = EXCLUDED.estimated_min,
  difficulty = EXCLUDED.difficulty,
  band_target = EXCLUDED.band_target,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO grammar_chapters (
  id, module_id, slug, title, position, estimated_min, difficulty,
  band_target, summary, content, is_published
)
VALUES (
  'a1000001-0001-4000-8000-000000000308',
  'a1000001-0001-4000-8000-000000000003',
  'ch8-inversion-clefts',
  'Inversion, Cleft Sentences & Advanced Emphasis',
  1,
  30,
  4,
  'Band 8-9 range',
  'Controlled inversion and cleft structures for emphasis that sound natural, not theatrical.',
  $content${"version": 1, "blocks": [{"id": "b01", "type": "heading", "level": 2, "text": "Inversion, Cleft Sentences & Advanced Emphasis"}, {"id": "b02", "type": "paragraph", "text": "Controlled inversion and cleft structures for emphasis that sound natural, not theatrical. Full lesson content will be added in the next seed pass."}, {"id": "b03", "type": "callout", "variant": "warning", "title": "Coming soon", "text": "This chapter shell is published so you can navigate the full module tree. Detailed rules, examples, and exercises land in the next content seed."}]}$content$::jsonb,
  true
)
ON CONFLICT (module_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  estimated_min = EXCLUDED.estimated_min,
  difficulty = EXCLUDED.difficulty,
  band_target = EXCLUDED.band_target,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO grammar_chapters (
  id, module_id, slug, title, position, estimated_min, difficulty,
  band_target, summary, content, is_published
)
VALUES (
  'a1000001-0001-4000-8000-000000000309',
  'a1000001-0001-4000-8000-000000000003',
  'ch9-nominalisation',
  'Nominalisation & Academic Density',
  2,
  30,
  4,
  'Band 8-9 range',
  'Turn verbs and adjectives into precise nouns so Task 2 paragraphs densify without becoming stiff.',
  $content${"version": 1, "blocks": [{"id": "b01", "type": "heading", "level": 2, "text": "Nominalisation & Academic Density"}, {"id": "b02", "type": "paragraph", "text": "Turn verbs and adjectives into precise nouns so Task 2 paragraphs densify without becoming stiff. Full lesson content will be added in the next seed pass."}, {"id": "b03", "type": "callout", "variant": "warning", "title": "Coming soon", "text": "This chapter shell is published so you can navigate the full module tree. Detailed rules, examples, and exercises land in the next content seed."}]}$content$::jsonb,
  true
)
ON CONFLICT (module_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  estimated_min = EXCLUDED.estimated_min,
  difficulty = EXCLUDED.difficulty,
  band_target = EXCLUDED.band_target,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO grammar_chapters (
  id, module_id, slug, title, position, estimated_min, difficulty,
  band_target, summary, content, is_published
)
VALUES (
  'a1000001-0001-4000-8000-000000000410',
  'a1000001-0001-4000-8000-000000000004',
  'ch10-essay-editing',
  'Full Essay Editing & Speaking Transcript Polish',
  1,
  40,
  3,
  'Exam readiness',
  'Timed edit drills on full Task 1/Task 2 scripts and Speaking Part 2-3 transcripts using every rule from Modules 1-3.',
  $content${"version": 1, "blocks": [{"id": "b01", "type": "heading", "level": 2, "text": "Full Essay Editing & Speaking Transcript Polish"}, {"id": "b02", "type": "paragraph", "text": "Timed edit drills on full Task 1/Task 2 scripts and Speaking Part 2-3 transcripts using every rule from Modules 1-3. Full lesson content will be added in the next seed pass."}, {"id": "b03", "type": "callout", "variant": "warning", "title": "Coming soon", "text": "This chapter shell is published so you can navigate the full module tree. Detailed rules, examples, and exercises land in the next content seed."}]}$content$::jsonb,
  true
)
ON CONFLICT (module_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  estimated_min = EXCLUDED.estimated_min,
  difficulty = EXCLUDED.difficulty,
  band_target = EXCLUDED.band_target,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO grammar_chapters (
  id, module_id, slug, title, position, estimated_min, difficulty,
  band_target, summary, content, is_published
)
VALUES (
  'a1000001-0001-4000-8000-000000000411',
  'a1000001-0001-4000-8000-000000000004',
  'ch11-answer-keys',
  'Exhaustive Answer Keys & Step-by-Step Explanations',
  2,
  25,
  1,
  'Reference',
  'Consolidated keys and reasoning for every exercise in the course, organised for quick self-check after each chapter.',
  $content${"version": 1, "blocks": [{"id": "b01", "type": "heading", "level": 2, "text": "Exhaustive Answer Keys & Step-by-Step Explanations"}, {"id": "b02", "type": "paragraph", "text": "Consolidated keys and reasoning for every exercise in the course, organised for quick self-check after each chapter. Full lesson content will be added in the next seed pass."}, {"id": "b03", "type": "callout", "variant": "warning", "title": "Coming soon", "text": "This chapter shell is published so you can navigate the full module tree. Detailed rules, examples, and exercises land in the next content seed."}]}$content$::jsonb,
  true
)
ON CONFLICT (module_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  estimated_min = EXCLUDED.estimated_min,
  difficulty = EXCLUDED.difficulty,
  band_target = EXCLUDED.band_target,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  is_published = EXCLUDED.is_published,
  updated_at = now();

COMMIT;
