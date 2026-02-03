-- Create audit_logs table for database-core service
-- This table stores audit logs for all database operations

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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_success ON public.audit_logs(success);

-- Enable Row Level Security (RLS)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to access all audit logs
CREATE POLICY "Service role can access all audit logs"
  ON public.audit_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create policy to allow authenticated users to read their own audit logs
CREATE POLICY "Users can read their own audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (actor = auth.uid()::text OR actor = auth.email());

-- Add comment
COMMENT ON TABLE public.audit_logs IS 'Stores audit logs for all database operations performed through database-core service';
