-- =====================================================================
-- Backfill — sync historical Speaking submissions into user_skill_bands
--
-- Context: speaking/evaluate/route.ts originally only wrote to
-- `submissions` and never updated `user_skill_bands` (the table the
-- dashboard actually reads from). That's now fixed going forward, but
-- any Speaking attempts taken BEFORE the fix never got synced. This
-- script backfills those, once.
--
-- What it does, per affected user:
--   1. Finds their best (highest) band_score among scored speaking
--      submissions.
--   2. Raises user_skill_bands.speaking to that value if it's higher
--      than what's already there (never lowers an existing value).
--   3. Recomputes users.overall_band as the mean of all that user's
--      skill bands, rounded to the nearest 0.5 — same rule as
--      lib/scoring.ts's ieltsOverall().
--
-- Idempotent: safe to re-run. Only touches users who have at least one
-- scored 'speaking' submission.
-- Run: psql "$DATABASE_URL" -f migrations/backfill_speaking_skill_bands.sql
-- =====================================================================

BEGIN;

-- Step 1: raise each user's speaking band to their best scored speaking
-- submission (never lowers an existing value).
INSERT INTO user_skill_bands (user_id, skill, band, updated_at)
SELECT user_id, 'speaking', MAX(band_score), now()
FROM submissions
WHERE skill = 'speaking' AND status = 'scored' AND band_score IS NOT NULL
GROUP BY user_id
ON CONFLICT (user_id, skill) DO UPDATE
    SET band = GREATEST(user_skill_bands.band, EXCLUDED.band),
        updated_at = CASE
            WHEN EXCLUDED.band > user_skill_bands.band THEN now()
            ELSE user_skill_bands.updated_at
        END;

-- Step 2: recompute overall_band for those same users. This is a separate
-- statement (not a second CTE chained onto step 1) specifically so it reads
-- user_skill_bands AFTER step 1's writes are visible — within one statement,
-- a CTE that re-queries a table another CTE just modified does NOT see
-- those changes unless read via that CTE's RETURNING output; splitting into
-- two statements in the same transaction sidesteps that entirely.
UPDATE users u
SET overall_band = LEAST(9.0, GREATEST(0.0, sub.overall))
FROM (
    SELECT usb.user_id, ROUND(AVG(usb.band) * 2) / 2.0 AS overall
    FROM user_skill_bands usb
    WHERE usb.user_id IN (
        SELECT DISTINCT user_id FROM submissions
        WHERE skill = 'speaking' AND status = 'scored' AND band_score IS NOT NULL
    )
    GROUP BY usb.user_id
) sub
WHERE u.id = sub.user_id;

COMMIT;
