-- =====================================================================
-- Migration 0004 — Extended profile details
-- Adds registration/profile fields collected in Settings:
--   legal name, country, date of birth, exam type, academic background,
--   and prior-IELTS history.
--
-- Run:  psql "$DATABASE_URL" -f migrations/0004_profile_details.sql
-- Safe to re-run: guarded enum creation + ADD COLUMN IF NOT EXISTS.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- ENUMS  (guarded so re-running the file does not error)
-- ---------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE exam_type AS ENUM ('academic', 'general_training');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE academic_background AS ENUM (
        'ssc_olevels',
        'hsc_alevels',
        'diploma',
        'bachelors',
        'masters',
        'phd',
        'other'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------
-- USERS — new profile columns (all nullable; filled in via Settings)
-- ---------------------------------------------------------------------
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS legal_full_name     TEXT,
    ADD COLUMN IF NOT EXISTS country             TEXT,
    ADD COLUMN IF NOT EXISTS date_of_birth       DATE,
    ADD COLUMN IF NOT EXISTS exam_type           exam_type,
    ADD COLUMN IF NOT EXISTS academic_background academic_background,
    ADD COLUMN IF NOT EXISTS has_taken_ielts     BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS previous_ielts_year SMALLINT,
    ADD COLUMN IF NOT EXISTS previous_ielts_band NUMERIC(2,1);

-- Keep prior-IELTS fields internally consistent:
--   if the candidate has NOT taken IELTS, year/band must be NULL.
ALTER TABLE users
    DROP CONSTRAINT IF EXISTS chk_prev_ielts;
ALTER TABLE users
    ADD CONSTRAINT chk_prev_ielts CHECK (
        has_taken_ielts = TRUE
        OR (previous_ielts_year IS NULL AND previous_ielts_band IS NULL)
    );

COMMIT;
