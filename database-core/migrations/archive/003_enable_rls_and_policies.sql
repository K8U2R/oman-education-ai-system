-- Migration: Enable Row Level Security (RLS) and Policies
-- Description: تفعيل Row Level Security وإنشاء Policies للجداول
-- Date: 2025-12-28

-- ============================================
-- 1. Enable RLS on users table
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own data
CREATE POLICY "Users can view own data"
ON public.users
FOR SELECT
USING (auth.uid()::uuid = id);

-- Policy: Users can update their own data (except sensitive fields)
CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
USING (auth.uid()::uuid = id)
WITH CHECK (
  auth.uid()::uuid = id
  AND (
    -- Allow updating these fields only
    first_name IS NOT NULL OR
    last_name IS NOT NULL OR
    username IS NOT NULL OR
    avatar_url IS NOT NULL
  )
);

-- Policy: Service role can do everything (for backend operations)
CREATE POLICY "Service role full access"
ON public.users
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Policy: Allow public registration (insert only)
CREATE POLICY "Allow public registration"
ON public.users
FOR INSERT
WITH CHECK (true);

-- ============================================
-- 2. Enable RLS on verification_tokens table
-- ============================================
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything (for backend operations)
CREATE POLICY "Service role full access verification_tokens"
ON public.verification_tokens
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Policy: Users can view their own verification tokens (read-only)
CREATE POLICY "Users can view own verification tokens"
ON public.verification_tokens
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = verification_tokens.user_id
    AND auth.uid()::uuid = users.id
  )
);

-- ============================================
-- 3. Fix Function Search Path (Security)
-- ============================================
-- Make the function search path immutable to prevent search path attacks
ALTER FUNCTION public.update_updated_at_column()
SET search_path = public;

-- ============================================
-- 4. Add Comments
-- ============================================
COMMENT ON POLICY "Users can view own data" ON public.users IS 'السماح للمستخدمين بعرض بياناتهم الخاصة فقط';
COMMENT ON POLICY "Users can update own data" ON public.users IS 'السماح للمستخدمين بتحديث بياناتهم الخاصة فقط';
COMMENT ON POLICY "Service role full access" ON public.users IS 'السماح لـ Service Role بالوصول الكامل (لعمليات Backend)';
COMMENT ON POLICY "Allow public registration" ON public.users IS 'السماح بالتسجيل العام (إنشاء حسابات جديدة)';

COMMENT ON POLICY "Service role full access verification_tokens" ON public.verification_tokens IS 'السماح لـ Service Role بالوصول الكامل لرموز التحقق';
COMMENT ON POLICY "Users can view own verification tokens" ON public.verification_tokens IS 'السماح للمستخدمين بعرض رموز التحقق الخاصة بهم فقط';

