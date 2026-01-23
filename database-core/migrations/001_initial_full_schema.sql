-- =======================================================================================
-- Oman Education AI System - Database Schema Initialization
-- =======================================================================================
-- Description: Consolidated schema initialization script.
-- Includes: Users, Security, Content, Whitelists, Audit Logs, and Integrations.
-- Generated: 2026-01-16
-- =======================================================================================

BEGIN;

-- ============================================
-- 1. Helper Functions
-- ============================================

-- Function to automatically update 'updated_at' column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ============================================
-- 2. Core Tables
-- ============================================

-- 2.1 Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT, -- Nullable for OAuth users
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    username VARCHAR(100) UNIQUE,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'parent', 'moderator', 'developer')),
    permissions TEXT[] DEFAULT '{}',
    
    -- Google OAuth Columns
    google_id VARCHAR(255) UNIQUE,
    google_email VARCHAR(255),
    oauth_provider VARCHAR(50),
    oauth_linked_at TIMESTAMP WITH TIME ZONE,
    
    -- Whitelist & Simulation Columns
    permission_source VARCHAR(50) DEFAULT 'default' CHECK (permission_source IN ('default', 'whitelist')),
    -- whitelist_entry_id added later due to circular dependency
    simulation_role VARCHAR(50) CHECK (simulation_role IN ('student', 'teacher', 'admin', 'parent', 'moderator', 'developer')),
    simulation_active BOOLEAN DEFAULT false,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username) WHERE username IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON public.users(google_id) WHERE google_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_oauth_provider ON public.users(oauth_provider) WHERE oauth_provider IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_permission_source ON public.users(permission_source);
CREATE INDEX IF NOT EXISTS idx_users_simulation_active ON public.users(simulation_active) WHERE simulation_active = true;

COMMENT ON TABLE public.users IS 'Core users table storing profile, auth, and role information';

-- 2.2 Whitelist Entries Table (Advanced Permissions)
CREATE TABLE IF NOT EXISTS public.whitelist_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    permission_level VARCHAR(50) NOT NULL CHECK (permission_level IN ('developer', 'admin', 'super_admin')),
    permissions TEXT[] NOT NULL DEFAULT '{}',
    granted_by UUID REFERENCES public.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    is_permanent BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whitelist_email ON public.whitelist_entries(email);
CREATE INDEX IF NOT EXISTS idx_whitelist_active ON public.whitelist_entries(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_whitelist_permission_level ON public.whitelist_entries(permission_level);

-- Add Circular Foreign Key to users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS whitelist_entry_id UUID REFERENCES public.whitelist_entries(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_whitelist_entry ON public.users(whitelist_entry_id) WHERE whitelist_entry_id IS NOT NULL;

-- 2.3 Verification Tokens
CREATE TABLE IF NOT EXISTS public.verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token VARCHAR(64) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('email_verification', 'password_reset')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_tokens_user_id ON public.verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON public.verification_tokens(token);

-- 2.4 Refresh Tokens (JWT)
CREATE TABLE IF NOT EXISTS public.refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    replaced_by_token TEXT
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON public.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON public.refresh_tokens(token);

-- ============================================
-- 3. Security Tables
-- ============================================

-- 3.1 Security Sessions
CREATE TABLE IF NOT EXISTS public.security_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    refresh_token_hash TEXT,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    location JSONB,
    is_active BOOLEAN DEFAULT true,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_sessions_user_id ON public.security_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_security_sessions_token_hash ON public.security_sessions(token_hash);

-- 3.2 Security Events
CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    location JSONB,
    source VARCHAR(100),
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON public.security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at DESC);

-- 3.3 Security Settings
CREATE TABLE IF NOT EXISTS public.security_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3.4 Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id VARCHAR(255) PRIMARY KEY,
  actor VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100) NOT NULL,
  conditions JSONB,
  before_data JSONB,
  after_data JSONB,
  success BOOLEAN NOT NULL DEFAULT true,
  error TEXT,
  execution_time INTEGER,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp);

-- ============================================
-- 4. Triggers (Auto Update Timestamps)
-- ============================================

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whitelist_entries_updated_at BEFORE UPDATE ON public.whitelist_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_security_sessions_updated_at BEFORE UPDATE ON public.security_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_refresh_tokens_updated_at BEFORE UPDATE ON public.refresh_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_security_settings_updated_at BEFORE UPDATE ON public.security_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. Seed Data & Initialization
-- ============================================

-- 5.1 Initial Security Settings
INSERT INTO public.security_settings (setting_key, setting_value, description, category) VALUES
('max_login_attempts', '{"value": 5}', 'Limit login attempts', 'authentication'),
('password_min_length', '{"value": 8}', 'Minimum password length', 'authentication'),
('rate_limit_enabled', '{"value": true}', 'Enable rate limiting', 'rate_limiting')
ON CONFLICT (setting_key) DO NOTHING;

-- 5.2 Super Admin / Developer Account
-- First, ensure whitelist entry exists
INSERT INTO public.whitelist_entries (
    email, permission_level, permissions, is_active, is_permanent, notes
) VALUES (
    'alkhatri66006@gmail.com',
    'super_admin',
    ARRAY['*'],
    true,
    true,
    'Super Admin - Auto Generated'
) ON CONFLICT (email) DO UPDATE SET is_active = true;

-- Then create or update the user
-- Note: We use a DO block to handle complex upsert logic with foreign key linking
DO $$
DECLARE
    v_whitelist_id UUID;
BEGIN
    SELECT id INTO v_whitelist_id FROM public.whitelist_entries WHERE email = 'alkhatri66006@gmail.com';
    
    INSERT INTO public.users (
        email, first_name, last_name, username, role, 
        permissions, is_verified, is_active, 
        permission_source, whitelist_entry_id
    ) VALUES (
        'alkhatri66006@gmail.com', 'Super', 'Admin', 'alkhatri66006', 'developer',
        ARRAY['*'], true, true, 
        'whitelist', v_whitelist_id
    )
    ON CONFLICT (email) DO UPDATE SET
        role = 'developer',
        is_verified = true,
        is_active = true,
        permission_source = 'whitelist',
        whitelist_entry_id = v_whitelist_id,
        permissions = ARRAY['*'];
END $$;

-- ============================================
-- 6. Row Level Security (RLS)
-- ============================================
-- Note: RLS policies are typically dependent on specific Auth setup (e.g. Supabase 'auth' schema).
-- We enable RLS but comment out policies that might cause errors in standard Postgres environments.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- EXAMPLE SUPABASE POLICY (Uncomment if using Supabase)
-- CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);

COMMIT;
