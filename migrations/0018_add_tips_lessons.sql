-- =====================================================================
-- Add tips_lessons: the bite-sized layer that was missing. Previously
-- tips_modules -> tips_chapters only had full-length chapters, with no
-- quick-read tier in front of them (unlike the reference architecture,
-- which browses short "bites" first, each linking into the specific
-- spot in its full chapter). This adds that missing middle layer.
-- Safe to re-run.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS tips_lessons (
    id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id                   UUID NOT NULL REFERENCES tips_modules(id) ON DELETE CASCADE,
    chapter_id                  UUID REFERENCES tips_chapters(id) ON DELETE SET NULL,
    slug                        TEXT NOT NULL,
    position                    INTEGER NOT NULL DEFAULT 0,
    title                       TEXT NOT NULL,
    source_label                TEXT,
    bite                        TEXT NOT NULL,
    detail_md                   TEXT NOT NULL,
    read_more_anchor_block_id   TEXT,
    estimated_min               INTEGER,
    is_published                BOOLEAN NOT NULL DEFAULT true,
    created_at                  TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    updated_at                  TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    UNIQUE (module_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_tips_lessons_module ON tips_lessons(module_id, position);

COMMIT;
