-- Backs the new floating support widget's "Have any feedback/review?"
-- option (landing page + dashboard). Feedback is "unanonymous": a
-- logged-in submission carries user_id; a logged-out one must supply a
-- phone number instead -- chk_feedback_identity enforces that at least
-- one of the two is always present, so a row can never be truly
-- untraceable.
CREATE TABLE IF NOT EXISTS feedback_submissions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
  phone      TEXT,
  message    TEXT NOT NULL,
  page_path  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_feedback_identity CHECK (user_id IS NOT NULL OR phone IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_feedback_submissions_created_at ON feedback_submissions (created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_user ON feedback_submissions (user_id);
