-- Migration: Create verification_tokens table
-- Description: إنشاء جدول رموز التحقق من البريد الإلكتروني وإعادة تعيين كلمة المرور
-- Date: 2025-12-28

CREATE TABLE IF NOT EXISTS public.verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token VARCHAR(64) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('email_verification', 'password_reset')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_verification_tokens_user_id ON public.verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON public.verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_type ON public.verification_tokens(type);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires_at ON public.verification_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_used ON public.verification_tokens(used) WHERE used = false;

-- Add comments for documentation
COMMENT ON TABLE public.verification_tokens IS 'جدول رموز التحقق من البريد الإلكتروني وإعادة تعيين كلمة المرور';
COMMENT ON COLUMN public.verification_tokens.id IS 'معرف الرمز الفريد';
COMMENT ON COLUMN public.verification_tokens.user_id IS 'معرف المستخدم المرتبط بالرمز';
COMMENT ON COLUMN public.verification_tokens.token IS 'رمز التحقق الفريد (64 حرف hex)';
COMMENT ON COLUMN public.verification_tokens.type IS 'نوع الرمز: email_verification أو password_reset';
COMMENT ON COLUMN public.verification_tokens.expires_at IS 'تاريخ انتهاء صلاحية الرمز';
COMMENT ON COLUMN public.verification_tokens.used IS 'هل تم استخدام الرمز';
COMMENT ON COLUMN public.verification_tokens.created_at IS 'تاريخ إنشاء الرمز';

