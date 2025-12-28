-- Migration: Add encrypted fields and 2FA support to users table
-- Date: 2025-12-28
-- Phase: Phase-2 Security Enhancement
-- Add encrypted email column
ALTER TABLE users
ADD COLUMN IF NOT EXISTS encrypted_email TEXT;
-- Add encrypted phone column
ALTER TABLE users
ADD COLUMN IF NOT EXISTS encrypted_phone TEXT;
-- Add 2FA secret column (encrypted)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS two_factor_secret TEXT;
-- Add 2FA enabled flag
ALTER TABLE users
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;
-- Add 2FA backup codes (hashed)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS two_factor_backup_codes JSONB;
-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_two_factor_enabled ON users(two_factor_enabled)
WHERE two_factor_enabled = TRUE;
-- Add comment for documentation
COMMENT ON COLUMN users.encrypted_email IS 'AES-256 encrypted email address (Phase-2 Security)';
COMMENT ON COLUMN users.encrypted_phone IS 'AES-256 encrypted phone number (Phase-2 Security)';
COMMENT ON COLUMN users.two_factor_secret IS 'Encrypted TOTP secret for 2FA';
COMMENT ON COLUMN users.two_factor_enabled IS 'Whether 2FA is enabled for this user';
COMMENT ON COLUMN users.two_factor_backup_codes IS 'Hashed backup codes for 2FA recovery';
-- Migration notes:
-- 1. This migration adds new encrypted columns alongside existing plain text columns
-- 2. Existing data remains in 'email' and 'phone' columns
-- 3. New users will use encrypted columns
-- 4. Run data migration script separately to encrypt existing data
-- 5. After migration is complete, drop 'email' and 'phone' columns