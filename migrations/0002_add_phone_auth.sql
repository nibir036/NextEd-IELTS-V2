-- =====================================================================
-- Migration 0002 — Phone + password auth
-- Firebase Auth is gone; users now register/login with phone + password.
-- OTP verification is planned for later (this migration just adds the
-- columns; is_phone_verified defaults to FALSE until OTP lands).
-- =====================================================================

BEGIN;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS password_hash TEXT,
    ADD COLUMN IF NOT EXISTS is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- email was NOT NULL under Firebase Auth; phone is now the primary
-- identifier, so email becomes optional.
ALTER TABLE users
    ALTER COLUMN email DROP NOT NULL;

-- one account per phone number
CREATE UNIQUE INDEX IF NOT EXISTS uniq_users_phone
    ON users(phone)
    WHERE phone IS NOT NULL;

COMMIT;