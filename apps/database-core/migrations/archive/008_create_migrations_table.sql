-- Create migrations table for database-core service
-- This table tracks database migrations

CREATE TABLE IF NOT EXISTS public.migrations (
  id VARCHAR(255) PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration INTEGER,
  error TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_migrations_version ON public.migrations(version);
CREATE INDEX IF NOT EXISTS idx_migrations_status ON public.migrations(status);
CREATE INDEX IF NOT EXISTS idx_migrations_timestamp ON public.migrations(timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE public.migrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to access all migrations
CREATE POLICY "Service role can access all migrations"
  ON public.migrations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE public.migrations IS 'Tracks database migrations for database-core service';
