-- Migration: Add Google OAuth columns to users table
-- Description: إضافة أعمدة Google OAuth إلى جدول المستخدمين
-- Date: 2025-12-29

-- Add Google OAuth columns
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS google_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50),
ADD COLUMN IF NOT EXISTS oauth_linked_at TIMESTAMP WITH TIME ZONE;

-- Create index for google_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON public.users(google_id) WHERE google_id IS NOT NULL;

-- Create index for oauth_provider
CREATE INDEX IF NOT EXISTS idx_users_oauth_provider ON public.users(oauth_provider) WHERE oauth_provider IS NOT NULL;

-- Add comments
COMMENT ON COLUMN public.users.google_id IS 'Google user ID (unique)';
COMMENT ON COLUMN public.users.google_email IS 'Google email address';
COMMENT ON COLUMN public.users.oauth_provider IS 'OAuth provider: google, github, microsoft, etc.';
COMMENT ON COLUMN public.users.oauth_linked_at IS 'Timestamp when OAuth account was linked';

-- Make password_hash nullable for OAuth users
ALTER TABLE public.users ALTER COLUMN password_hash DROP NOT NULL;

