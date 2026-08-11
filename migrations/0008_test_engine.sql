-- =====================================================================
-- Migration 0008 — Structured test engine (Listening/Reading)
-- Purely ADDITIVE. Five new tables + one enum.
-- Run: psql "postgresql://postgres:<pw>@localhost:5432/nexted_ielts" -f migrations/0008_test_engine.sql
-- Safe to re-run.
-- =====================================================================
BEGIN;

DO $$ BEGIN
    CREATE TYPE question_type AS ENUM (
        'text_input', 'single_choice', 'multi_choice', 'matching', 'map_label'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS test_sections (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id      UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    position     INT  NOT NULL DEFAULT 0,
    title        TEXT,
    instructions TEXT,
    audio_url    TEXT,
    image_url    TEXT,
    passage_text TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_test_sections_test ON test_sections(test_id);

CREATE TABLE IF NOT EXISTS test_questions (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID NOT NULL REFERENCES test_sections(id) ON DELETE CASCADE,
    qnumber    INT  NOT NULL,
    position   INT  NOT NULL DEFAULT 0,
    type       question_type NOT NULL,
    prompt     TEXT,
    options    JSONB,
    max_words  INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_test_questions_section ON test_questions(section_id);

CREATE TABLE IF NOT EXISTS test_answers (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES test_questions(id) ON DELETE CASCADE,
    accepted    JSONB NOT NULL DEFAULT '[]'::jsonb,
    points      INT   NOT NULL DEFAULT 1
);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_test_answer_question ON test_answers(question_id);

CREATE TABLE IF NOT EXISTS test_attempts (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_id      UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    raw_score    INT,
    total        INT,
    band         NUMERIC(2,1),
    answers      JSONB NOT NULL DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_test_attempts_user ON test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test ON test_attempts(test_id);

COMMIT;
