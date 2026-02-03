-- Migration: Create users table
-- Description: إنشاء جدول المستخدمين الأساسي
-- Date: 2025-12-28

-- إنشاء جدول المستخدمين
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    username VARCHAR(100) UNIQUE,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'parent', 'moderator', 'developer')),
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء indexes للبحث السريع
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username) WHERE username IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger لتحديث updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- إضافة تعليقات
COMMENT ON TABLE public.users IS 'جدول المستخدمين الأساسي';
COMMENT ON COLUMN public.users.id IS 'معرف المستخدم الفريد';
COMMENT ON COLUMN public.users.email IS 'البريد الإلكتروني (فريد)';
COMMENT ON COLUMN public.users.password_hash IS 'كلمة المرور المشفرة';
COMMENT ON COLUMN public.users.role IS 'دور المستخدم: student, teacher, admin, parent, moderator, developer';
COMMENT ON COLUMN public.users.permissions IS 'مصفوفة  المخصصة';
