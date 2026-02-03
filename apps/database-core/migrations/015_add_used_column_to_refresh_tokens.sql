ALTER TABLE public.refresh_tokens ADD COLUMN IF NOT EXISTS used BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_used ON public.refresh_tokens(used);
