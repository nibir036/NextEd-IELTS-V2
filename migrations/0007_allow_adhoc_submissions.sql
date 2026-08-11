-- Allow submissions that have no test_id (e.g. the placement diagnostic),
-- while still forbidding contradictory targets.
BEGIN;
ALTER TABLE submissions DROP CONSTRAINT IF EXISTS chk_submission_target;
ALTER TABLE submissions
    ADD CONSTRAINT chk_submission_target CHECK (
        (kind = 'single_test' AND mock_test_id IS NULL) OR
        (kind = 'full_mock'   AND mock_test_id IS NOT NULL AND test_id IS NULL)
    );
COMMIT;