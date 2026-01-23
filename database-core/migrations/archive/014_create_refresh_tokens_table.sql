-- Create refresh_tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    replaced_by_token TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- RLS Policies
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Policy for service role (implicit if using superuser, but good to have if we switch users)
-- For now, since we are likely using a superuser or the owner, we might not need specific policies 
-- if we are not using Supabase's auth schema.
-- 
-- CREATE POLICY "Users can view own refresh tokens" ON refresh_tokens
--     FOR SELECT
--     USING (user_id::text = current_setting('app.current_user_id', true));

-- Trigger for updated_at
CREATE TRIGGER update_refresh_tokens_updated_at
    BEFORE UPDATE ON refresh_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
