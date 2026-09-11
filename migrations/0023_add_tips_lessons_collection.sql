-- Force UTF-8 for this session regardless of the client's default.
SET client_encoding = 'UTF8';

-- =====================================================================
-- Add collection_slug/collection_label to tips_lessons: a crosscutting
-- category (independent of file/chapter) driving the new filter-chip
-- UI, e.g. "Foundations", "Question Types", "Traps", "Test-Day Skills".
-- Nullable so any lesson without a collection assigned simply doesn't
-- appear under any filter chip rather than breaking.
-- Safe to re-run.
-- =====================================================================
BEGIN;

ALTER TABLE tips_lessons ADD COLUMN IF NOT EXISTS collection_slug TEXT;
ALTER TABLE tips_lessons ADD COLUMN IF NOT EXISTS collection_label TEXT;

CREATE INDEX IF NOT EXISTS idx_tips_lessons_collection ON tips_lessons(module_id, collection_slug);

COMMIT;
