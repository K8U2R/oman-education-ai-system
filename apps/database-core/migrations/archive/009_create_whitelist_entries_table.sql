-- Migration: Create whitelist_entries table
-- Description: إنشاء جدول القائمة البيضاء للصلاحيات المتقدمة
-- Date: 2025-01-05

-- إنشاء جدول القائمة البيضاء
CREATE TABLE IF NOT EXISTS public.whitelist_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    permission_level VARCHAR(50) NOT NULL CHECK (permission_level IN ('developer', 'admin', 'super_admin')),
    permissions TEXT[] NOT NULL DEFAULT '{}',
    granted_by UUID REFERENCES public.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    is_permanent BOOLEAN DEFAULT false, -- لا يمكن إزالته
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء indexes للبحث السريع
CREATE INDEX IF NOT EXISTS idx_whitelist_email ON public.whitelist_entries(email);
CREATE INDEX IF NOT EXISTS idx_whitelist_active ON public.whitelist_entries(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_whitelist_expires ON public.whitelist_entries(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_whitelist_permission_level ON public.whitelist_entries(permission_level);
CREATE INDEX IF NOT EXISTS idx_whitelist_permanent ON public.whitelist_entries(is_permanent) WHERE is_permanent = true;

-- Trigger لتحديث updated_at
CREATE TRIGGER update_whitelist_entries_updated_at 
    BEFORE UPDATE ON public.whitelist_entries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- إضافة تعليقات
COMMENT ON TABLE public.whitelist_entries IS 'جدول القائمة البيضاء للصلاحيات المتقدمة';
COMMENT ON COLUMN public.whitelist_entries.id IS 'معرف القائمة البيضاء الفريد';
COMMENT ON COLUMN public.whitelist_entries.email IS 'البريد الإلكتروني المصرح له (فريد)';
COMMENT ON COLUMN public.whitelist_entries.permission_level IS 'مستوى : developer, admin, super_admin';
COMMENT ON COLUMN public.whitelist_entries.permissions IS 'مصفوفة  المحددة';
COMMENT ON COLUMN public.whitelist_entries.granted_by IS 'المستخدم الذي منح ';
COMMENT ON COLUMN public.whitelist_entries.expires_at IS 'تاريخ انتهاء  (NULL = لا ينتهي)';
COMMENT ON COLUMN public.whitelist_entries.is_active IS 'حالة التفعيل';
COMMENT ON COLUMN public.whitelist_entries.is_permanent IS 'صلاحيات دائمة لا يمكن إزالتها';

-- إضافة Super Admin دائم (alkhatri66006@gmail.com)
-- هذا الحساب لا يمكن إزالته من النظام
INSERT INTO public.whitelist_entries (
    email,
    permission_level,
    permissions,
    is_active,
    is_permanent,
    notes,
    granted_at
) VALUES (
    'alkhatri66006@gmail.com',
    'super_admin',
    ARRAY[
        -- جميع 
        'users.view', 'users.create', 'users.update', 'users.delete', 'users.manage',
        'lessons.view', 'lessons.create', 'lessons.update', 'lessons.delete', 'lessons.manage',
        'storage.view', 'storage.upload', 'storage.delete', 'storage.manage',
        'notifications.view', 'notifications.create', 'notifications.manage',
        'system.view', 'system.manage', 'system.settings',
        'admin.dashboard', 'admin.users', 'admin.settings', 'admin.reports',
        'database-core.view', 'database-core.metrics.view', 'database-core.connections.manage',
        'database-core.cache.manage', 'database-core.explore', 'database-core.query.execute',
        'database-core.transactions.view', 'database-core.audit.view', 'database-core.backups.manage',
        'database-core.migrations.manage',
        'whitelist.manage', 'whitelist.view', 'whitelist.create', 'whitelist.update', 'whitelist.delete',
        'role-simulation.enable', 'role-simulation.manage'
    ],
    true,
    true,
    'Super Admin دائم - لا يمكن إزالته من النظام. تم الإنشاء تلقائياً عند إنشاء جدول القائمة البيضاء.',
    NOW()
) ON CONFLICT (email) DO NOTHING;
