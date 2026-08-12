-- =====================================================================
-- Migration 0010 — Grammar engine (Zero to Band 9 LMS)
-- Purely ADDITIVE. Modules, chapters (JSONB content), exercises,
-- user progress + attempts.
-- Run: psql "$DATABASE_URL" -f migrations/0010_grammar_engine.sql
-- Safe to re-run.
-- =====================================================================
BEGIN;

-- ---------------------------------------------------------------------
-- ENUM
-- ---------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE grammar_exercise_kind AS ENUM (
        'identification',
        'correction',
        'essay_edit',
        'mcq',
        'production'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------
-- MODULES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS grammar_modules (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug         TEXT NOT NULL UNIQUE,
    title        TEXT NOT NULL,
    subtitle     TEXT,
    band_unlock  TEXT,
    description  TEXT,
    position     INT  NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- CHAPTERS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS grammar_chapters (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id     UUID NOT NULL REFERENCES grammar_modules(id) ON DELETE CASCADE,
    slug          TEXT NOT NULL,
    title         TEXT NOT NULL,
    position      INT  NOT NULL DEFAULT 0,
    estimated_min INT,
    difficulty    SMALLINT,
    band_target   TEXT,
    summary       TEXT,
    content       JSONB NOT NULL DEFAULT '{"version":1,"blocks":[]}'::jsonb,
    is_published  BOOLEAN NOT NULL DEFAULT false,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (module_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_grammar_chapters_module
    ON grammar_chapters(module_id, position);

-- ---------------------------------------------------------------------
-- EXERCISES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS grammar_exercises (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id   UUID NOT NULL REFERENCES grammar_chapters(id) ON DELETE CASCADE,
    slug         TEXT NOT NULL,
    title        TEXT NOT NULL,
    kind         grammar_exercise_kind NOT NULL,
    instructions TEXT,
    items        JSONB NOT NULL DEFAULT '[]'::jsonb,
    position     INT  NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (chapter_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_grammar_exercises_chapter
    ON grammar_exercises(chapter_id, position);

-- ---------------------------------------------------------------------
-- USER PROGRESS (per chapter)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_grammar_progress (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chapter_id    UUID NOT NULL REFERENCES grammar_chapters(id) ON DELETE CASCADE,
    status        TEXT NOT NULL DEFAULT 'not_started',
    started_at    TIMESTAMPTZ,
    completed_at  TIMESTAMPTZ,
    last_position TEXT,
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, chapter_id)
);
CREATE INDEX IF NOT EXISTS idx_user_grammar_progress_user
    ON user_grammar_progress(user_id);

-- ---------------------------------------------------------------------
-- USER ATTEMPTS (per exercise)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_grammar_attempts (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id  UUID NOT NULL REFERENCES grammar_exercises(id) ON DELETE CASCADE,
    answers      JSONB NOT NULL DEFAULT '{}'::jsonb,
    score        INT,
    max_score    INT,
    feedback     JSONB,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_grammar_attempts_user_ex
    ON user_grammar_attempts(user_id, exercise_id);

COMMIT;
