-- Lets the new admin feedback inbox mark a submission as reviewed/
-- unreviewed. NULL = not yet reviewed (the default for every existing
-- and new row); a timestamp = when an admin marked it reviewed.
ALTER TABLE feedback_submissions
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_feedback_submissions_reviewed_at
  ON feedback_submissions (reviewed_at);
