-- Migration: Fix Function Security
-- Description: إصلاح أمان Function update_updated_at_column
-- Date: 2025-12-28

-- Drop and recreate the function with SECURITY DEFINER and immutable search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Recreate with proper security settings
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

-- Recreate the trigger
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment
COMMENT ON FUNCTION public.update_updated_at_column() IS 'تحديث حقل updated_at تلقائياً عند تحديث السجل';

