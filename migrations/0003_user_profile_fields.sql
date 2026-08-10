-- =====================================================================
-- Migration 0003 — exam_date + avatar on users
-- streak_days / tests_completed are deliberately NOT added here —
-- they're computed from submissions (see /api/dashboard/stats).
-- =====================================================================

BEGIN;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS exam_date DATE,
    ADD COLUMN IF NOT EXISTS avatar TEXT;

COMMIT;