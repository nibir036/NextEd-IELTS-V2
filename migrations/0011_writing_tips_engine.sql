-- =====================================================================
-- Migration 0011 — Writing Tips & Tricks engine
-- Purely ADDITIVE. Lives alongside (not inside) the Grammar LMS tables.
-- Mirrors grammar_modules / grammar_chapters shape (JSONB block content)
-- but scoped to skill practice tips (starting with Writing), surfaced
-- inside the Writing Practice section, not the Grammar LMS.
-- Run: psql "$DATABASE_URL" -f migrations/0011_writing_tips_engine.sql
-- Safe to re-run.
-- =====================================================================
BEGIN;

-- ---------------------------------------------------------------------
-- MODULES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tips_modules (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill        TEXT NOT NULL DEFAULT 'writing',
    slug         TEXT NOT NULL UNIQUE,
    title        TEXT NOT NULL,
    subtitle     TEXT,
    description  TEXT,
    position     INT  NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tips_modules_skill ON tips_modules(skill, position);

-- ---------------------------------------------------------------------
-- CHAPTERS ("Files", in the source field guide)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tips_chapters (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id     UUID NOT NULL REFERENCES tips_modules(id) ON DELETE CASCADE,
    slug          TEXT NOT NULL,
    title         TEXT NOT NULL,
    position      INT  NOT NULL DEFAULT 0,
    estimated_min INT,
    summary       TEXT,
    content       JSONB NOT NULL DEFAULT '{"version":1,"blocks":[]}'::jsonb,
    is_published  BOOLEAN NOT NULL DEFAULT false,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (module_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_tips_chapters_module
    ON tips_chapters(module_id, position);

-- ---------------------------------------------------------------------
-- USER PROGRESS (per chapter) — same shape as grammar, kept separate
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_tips_progress (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chapter_id    UUID NOT NULL REFERENCES tips_chapters(id) ON DELETE CASCADE,
    status        TEXT NOT NULL DEFAULT 'not_started',
    started_at    TIMESTAMPTZ,
    completed_at  TIMESTAMPTZ,
    last_position TEXT,
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, chapter_id)
);
CREATE INDEX IF NOT EXISTS idx_user_tips_progress_user
    ON user_tips_progress(user_id);

COMMIT;
