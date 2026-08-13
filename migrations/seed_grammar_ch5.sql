-- Seed: Complex Sentences & Subordinate Clauses (from Zero to Band 9 PDF)
-- English only, pure ASCII.
BEGIN;

UPDATE grammar_chapters SET
  title = 'Complex Sentences & Subordinate Clauses',
  position = 1,
  estimated_min = 35,
  difficulty = 3,
  band_target = 'Band 7 range',
  summary = 'Build multi-clause sentences with relative, adverbial, and noun clauses so range scores climb without sacrificing accuracy.',
  content = $content${"version": 1, "blocks": [{"id": "b01", "type": "paragraph", "text": "The complex sentence is the single most important structure for reaching Band 7, because it is the clearest signal of range. It lets you show a logical relationship between two ideas (contrast, reason, condition, time) inside one controlled sentence, instead of two short disconnected ones."}, {"id": "b02", "type": "heading", "level": 2, "text": "5.1 Clause basics"}, {"id": "b03", "type": "paragraph", "text": "A clause is a group of words with a subject and a verb. An independent clause expresses a complete thought and can stand alone: Cities offer jobs. A dependent (subordinate) clause has a subject and a verb but cannot stand alone, because a subordinating word leaves it unfinished: Although cities offer jobs... A complex sentence joins one independent clause with at least one dependent clause."}, {"id": "b04", "type": "heading", "level": 2, "text": "5.2 Three sentence types"}, {"id": "b05", "type": "table", "headers": ["Type", "Structure", "Example"], "rows": [["Simple", "one independent clause", "Cities offer jobs."], ["Compound", "two independent clauses + FANBOYS", "Cities offer jobs, but they are crowded."], ["Complex", "independent + dependent clause", "Although cities offer jobs, they are crowded."]]}, {"id": "b06", "type": "paragraph", "text": "A Band 5 script is mostly simple sentences. A Band 6 script mixes simple and compound. A Band 7 script controls complex sentences and uses a variety of them."}, {"id": "b07", "type": "heading", "level": 2, "text": "5.3 Adverbial clauses"}, {"id": "b08", "type": "paragraph", "text": "An adverbial clause begins with a subordinating conjunction and shows how its idea relates to the main clause. Group by relationship: contrast (although, even though, while, whereas); reason (because, since, as); purpose (so that, in order that); condition (if, unless, provided that); time (when, while, after, before, until, as soon as); result (so...that, such...that)."}, {"id": "b09", "type": "example_pair", "incorrect": "Cities offer jobs. They are crowded.", "correct": "Although cities offer jobs, they are crowded.", "why": "Contrast joined in one complex sentence."}, {"id": "b10", "type": "heading", "level": 2, "text": "5.4 Relative clauses"}, {"id": "b11", "type": "paragraph", "text": "Relative clauses use who, which, that, whose, where, when to add information about a noun. Defining relative clauses identify which one (no commas): The students who study regularly improve faster. Non-defining relative clauses add extra information (commas required): Dhaka, which is the capital of Bangladesh, is growing rapidly. Do not use that in non-defining clauses."}, {"id": "b12", "type": "l1_error_fixer", "title": "Fragments, run-ons, and comma splices", "body": "When learners start writing complex sentences, three punctuation errors appear.", "error_types": [{"label": "Fragment (dependent clause alone)", "incorrect": "Although the government invested in transport.", "correct": "Although the government invested in transport, congestion remained high."}, {"label": "Comma splice (two independents with only a comma)", "incorrect": "Cities offer jobs, they are crowded.", "correct": "Cities offer jobs, but they are crowded. / Although cities offer jobs, they are crowded."}, {"label": "Run-on (no punctuation)", "incorrect": "Cities offer jobs they are crowded.", "correct": "Cities offer jobs, but they are crowded."}]}, {"id": "b13", "type": "ielts_impact", "skills": ["writing", "speaking"], "title": "The Band 7 range requirement", "body": "Examiners look for a mix of simple, compound, and complex sentences with accurate subordination. Repeated short simple sentences keep range at Band 6 even when vocabulary is strong.", "examples": {"task2": "Although public transport reduces emissions, many cities still underinvest in it because short-term costs look high.", "speaking": "The person who influenced me most was a teacher whose advice still guides my decisions."}}]}$content$::jsonb,
  is_published = true,
  updated_at = now()
WHERE slug = 'ch5-complex-sentences';


INSERT INTO grammar_exercises (id, chapter_id, slug, title, kind, instructions, items, position, is_published)
VALUES (
  'a1000001-0001-4000-8000-000000000251',
  'a1000001-0001-4000-8000-000000000205',
  'ex-5-1-sentence-combining',
  'Exercise 5.1 - Sentence Combining',
  'correction',
  'Combine each pair into one accurate complex sentence using a suitable subordinator or relative pronoun.',
  $items1$[{"id": "q1", "prompt": "The government raised taxes. The public protested.", "answer": "When / After the government raised taxes, the public protested.", "accepted": ["When the government raised taxes, the public protested.", "After the government raised taxes, the public protested."], "reason": "Time relationship.", "bn_note": null}, {"id": "q2", "prompt": "Cities offer more jobs. Many people move there.", "answer": "Because cities offer more jobs, many people move there.", "accepted": ["Because cities offer more jobs, many people move there.", "Many people move to cities because they offer more jobs."], "reason": "Reason.", "bn_note": null}, {"id": "q3", "prompt": "The policy was expensive. It improved public health.", "answer": "Although the policy was expensive, it improved public health.", "accepted": ["Although the policy was expensive, it improved public health."], "reason": "Contrast.", "bn_note": null}, {"id": "q4", "prompt": "She lives in a town. The town has no university.", "answer": "She lives in a town that / which has no university.", "accepted": ["She lives in a town that has no university.", "She lives in a town which has no university."], "reason": "Defining relative clause.", "bn_note": null}, {"id": "q5", "prompt": "Dhaka is overcrowded. Dhaka is the capital of Bangladesh.", "answer": "Dhaka, which is the capital of Bangladesh, is overcrowded.", "accepted": ["Dhaka, which is the capital of Bangladesh, is overcrowded."], "reason": "Non-defining relative clause needs commas.", "bn_note": null}, {"id": "q6", "prompt": "Students work hard. They usually get better scores.", "answer": "Students who work hard usually get better scores.", "accepted": ["Students who work hard usually get better scores."], "reason": "Defining relative clause on people.", "bn_note": null}, {"id": "q7", "prompt": "Traffic will worsen. The city does not invest in public transport.", "answer": "Traffic will worsen unless the city invests in public transport. / if the city does not invest...", "accepted": ["Traffic will worsen unless the city invests in public transport.", "Traffic will worsen if the city does not invest in public transport."], "reason": "Condition.", "bn_note": null}, {"id": "q8", "prompt": "He finished the exam. He checked every answer.", "answer": "Before he finished the exam, he checked every answer. / After checking...", "accepted": ["Before he finished the exam, he checked every answer.", "He checked every answer before he finished the exam."], "reason": "Time.", "bn_note": null}]$items1$::jsonb,
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
  'a1000001-0001-4000-8000-000000000252',
  'a1000001-0001-4000-8000-000000000205',
  'ex-5-2-relative-polish',
  'Exercise 5.2 - Punctuation and Relative-Clause Polish',
  'correction',
  'Correct punctuation and relative-clause errors.',
  $items2$[{"id": "q1", "prompt": "Although the data is clear. Many politicians ignore it.", "answer": "Although the data is clear, many politicians ignore it.", "accepted": ["Although the data is clear, many politicians ignore it."], "reason": "Fragment fixed by completing the complex sentence.", "bn_note": null}, {"id": "q2", "prompt": "The students, who failed the test must retake it.", "answer": "The students who failed the test must retake it.", "accepted": ["The students who failed the test must retake it."], "reason": "Defining clause -- no comma.", "bn_note": null}, {"id": "q3", "prompt": "My brother who lives in London is a doctor.", "answer": "My brother, who lives in London, is a doctor.", "accepted": ["My brother, who lives in London, is a doctor."], "reason": "Non-defining (extra info about a unique brother) needs commas.", "bn_note": null}, {"id": "q4", "prompt": "Cities offer jobs, they are crowded.", "answer": "Cities offer jobs, but they are crowded. / Although cities offer jobs, they are crowded.", "accepted": ["Cities offer jobs, but they are crowded.", "Although cities offer jobs, they are crowded."], "reason": "Comma splice fixed.", "bn_note": null}]$items2$::jsonb,
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