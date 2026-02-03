-- Migration: Add whitelist columns to users table
-- Description: إضافة أعمدة القائمة البيضاء إلى جدول المستخدمين
-- Date: 2025-01-05

-- إضافة أعمدة جديدة
ALTER TABLE public.users 
    ADD COLUMN IF NOT EXISTS permission_source VARCHAR(50) DEFAULT 'default' CHECK (permission_source IN ('default', 'whitelist')),
    ADD COLUMN IF NOT EXISTS whitelist_entry_id UUID REFERENCES public.whitelist_entries(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS simulation_role VARCHAR(50) CHECK (simulation_role IN ('student', 'teacher', 'admin', 'parent', 'moderator', 'developer')),
    ADD COLUMN IF NOT EXISTS simulation_active BOOLEAN DEFAULT false;

-- إنشاء indexes
CREATE INDEX IF NOT EXISTS idx_users_permission_source ON public.users(permission_source);
CREATE INDEX IF NOT EXISTS idx_users_whitelist_entry ON public.users(whitelist_entry_id) WHERE whitelist_entry_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_simulation_active ON public.users(simulation_active) WHERE simulation_active = true;

-- إضافة تعليقات
COMMENT ON COLUMN public.users.permission_source IS 'مصدر : default (افتراضي) أو whitelist (من القائمة البيضاء)';
COMMENT ON COLUMN public.users.whitelist_entry_id IS 'معرف القائمة البيضاء المرتبطة (إن وجدت)';
COMMENT ON COLUMN public.users.simulation_role IS 'الدور المحاكى (لنظام Role Simulation)';
COMMENT ON COLUMN public.users.simulation_active IS 'حالة تفعيل محاكاة الدور';
