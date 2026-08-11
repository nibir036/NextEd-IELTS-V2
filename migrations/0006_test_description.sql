-- =====================================================================
-- Migration 0006 — Test browse descriptions
-- Adds a short browse-page description to `tests` (distinct from
-- `instructions`, the in-test candidate instruction). Shown on cards.
-- Run: psql "postgresql://postgres:<pw>@localhost:5432/nexted_ielts" -f migrations/0006_test_description.sql
-- Safe to re-run.
-- =====================================================================
BEGIN;
ALTER TABLE tests
    ADD COLUMN IF NOT EXISTS description TEXT;
COMMIT;