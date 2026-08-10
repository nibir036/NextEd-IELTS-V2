-- =====================================================================
-- Migration 0001 — Initial schema
-- IELTS prep platform  (Firestore → PostgreSQL)
--
-- Run:  psql "$DATABASE_URL" -f migrations/0001_init.sql
-- Safe to re-run: uses IF NOT EXISTS / guarded enum creation.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- EXTENSIONS
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";     -- pgvector: RAG embeddings. Remove if not using RAG yet.

-- ---------------------------------------------------------------------
-- ENUMS  (guarded so re-running the file does not error)
-- ---------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE skill_type AS ENUM ('listening', 'reading', 'writing', 'speaking');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE lesson_section AS ENUM ('grammar', 'vocab', 'tips');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM ('pending', 'scoring', 'scored', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE submission_kind AS ENUM ('single_test', 'full_mock');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------
-- updated_at auto-touch trigger function (shared)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- USERS   (Firestore: users/{userId})   id = Firebase Auth UID
-- =====================================================================
CREATE TABLE IF NOT EXISTS users (
    id                  TEXT PRIMARY KEY,                      -- Firebase UID
    email               TEXT UNIQUE NOT NULL,
    display_name        TEXT,
    photo_url           TEXT,
    native_language     TEXT,
    role                user_role   NOT NULL DEFAULT 'student',
    target_band         NUMERIC(2,1),
    overall_band        NUMERIC(2,1),                          -- server-write only
    total_practice_time INTEGER     NOT NULL DEFAULT 0,        -- seconds
    onboarding_complete BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_active_at      TIMESTAMPTZ
);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- skillBands nested map → normalized (one row per skill per user)
CREATE TABLE IF NOT EXISTS user_skill_bands (
    user_id     TEXT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill       skill_type NOT NULL,
    band        NUMERIC(2,1),                                  -- NULL = not assessed yet
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, skill)
);

-- =====================================================================
-- LESSONS   (Firestore: lessons/{lessonId})
-- 3 sections: grammar | vocab | tips   + nested resources
-- =====================================================================
CREATE TABLE IF NOT EXISTS lessons (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section     lesson_section NOT NULL,                       -- grammar | vocab | tips
    title       TEXT NOT NULL,
    body        TEXT,
    difficulty  SMALLINT,
    position    INTEGER NOT NULL DEFAULT 0,                    -- ordering within a section
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lessons_section ON lessons(section);

DROP TRIGGER IF EXISTS trg_lessons_updated_at ON lessons;
CREATE TRIGGER trg_lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS lesson_resources (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id   UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    kind        TEXT,                                          -- pdf | audio | video | link
    url         TEXT NOT NULL,
    title       TEXT,
    position    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_lesson_resources_lesson ON lesson_resources(lesson_id);

-- =====================================================================
-- TESTS   (Firestore: listening/reading/writing/speakingTests unified)
-- 4 skill modules, one table + skill enum   + nested resources
-- =====================================================================
CREATE TABLE IF NOT EXISTS tests (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill            skill_type NOT NULL,                      -- listening | reading | writing | speaking
    title            TEXT NOT NULL,
    instructions     TEXT,
    band_target      NUMERIC(2,1),
    duration_seconds INTEGER,
    position         INTEGER NOT NULL DEFAULT 0,
    is_published     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tests_skill ON tests(skill);

DROP TRIGGER IF EXISTS trg_tests_updated_at ON tests;
CREATE TRIGGER trg_tests_updated_at
    BEFORE UPDATE ON tests
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS test_resources (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id     UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    kind        TEXT,                                          -- audio | passage | image | prompt
    url         TEXT,
    content     TEXT,
    position    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_test_resources_test ON test_resources(test_id);

-- =====================================================================
-- FULL MOCK TESTS   (groups several skill tests into one exam)
-- =====================================================================
CREATE TABLE IF NOT EXISTS mock_tests (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title        TEXT NOT NULL,
    description  TEXT,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_mock_tests_updated_at ON mock_tests;
CREATE TRIGGER trg_mock_tests_updated_at
    BEFORE UPDATE ON mock_tests
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- which skill-tests belong to a mock, and in what order
CREATE TABLE IF NOT EXISTS mock_test_sections (
    mock_test_id UUID NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
    test_id      UUID NOT NULL REFERENCES tests(id)      ON DELETE RESTRICT,
    position     INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (mock_test_id, test_id)
);
CREATE INDEX IF NOT EXISTS idx_mock_sections_mock ON mock_test_sections(mock_test_id);

-- =====================================================================
-- SUBMISSIONS   (Firestore: users/{userId}/submissions/{id})
-- server / Admin-write only  (enforced in app layer)
-- =====================================================================
CREATE TABLE IF NOT EXISTS submissions (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind         submission_kind NOT NULL DEFAULT 'single_test',
    test_id      UUID REFERENCES tests(id)      ON DELETE RESTRICT,   -- set for single_test
    mock_test_id UUID REFERENCES mock_tests(id) ON DELETE RESTRICT,   -- set for full_mock
    skill        skill_type,
    status       submission_status NOT NULL DEFAULT 'pending',
    band_score   NUMERIC(2,1),
    feedback     JSONB,                                          -- AI feedback / criteria breakdown
    answers      JSONB,                                          -- raw answers / transcript
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    scored_at    TIMESTAMPTZ,
    -- exactly one target (a single test OR a mock), never both / neither
    CONSTRAINT chk_submission_target CHECK (
        (kind = 'single_test' AND test_id IS NOT NULL AND mock_test_id IS NULL) OR
        (kind = 'full_mock'   AND mock_test_id IS NOT NULL AND test_id IS NULL)
    )
);

-- "already submitted" check from your flow (only one attempt per single test)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_submission_user_test
    ON submissions(user_id, test_id)
    WHERE test_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_test ON submissions(test_id);
CREATE INDEX IF NOT EXISTS idx_submissions_mock ON submissions(mock_test_id);

-- =====================================================================
-- LEARNING PATHS   (Firestore: users/{userId}/learningPaths/{id})
-- AI study plan — server-write only
-- =====================================================================
CREATE TABLE IF NOT EXISTS learning_paths (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       TEXT,
    plan        JSONB NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_learning_paths_user ON learning_paths(user_id);

-- =====================================================================
-- RAG KNOWLEDGE BASE   (Firestore: knowledge/{chunkId})
-- =====================================================================
CREATE TABLE IF NOT EXISTS knowledge (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content     TEXT NOT NULL,
    embedding   VECTOR(1536),                                  -- match your embedding model dim
    metadata    JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_knowledge_embedding ON knowledge
    USING hnsw (embedding vector_cosine_ops);

-- =====================================================================
-- UPLOADS REGISTRY   (Firestore: uploads/{uploadId}) — admin only
-- =====================================================================
CREATE TABLE IF NOT EXISTS uploads (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    storage_path TEXT NOT NULL,
    file_name    TEXT,
    mime_type    TEXT,
    size_bytes   BIGINT,
    uploaded_by  TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMIT;
