-- Migration: Link Google Account to Super Admin
-- Description: ربط حساب Google للمستخدم الرئيسي وتحديث جميع البيانات
-- Date: 2026-01-10

DO $$
DECLARE
    v_user_id UUID;
    v_whitelist_id UUID;
BEGIN
    -- البحث عن المستخدم
    SELECT id INTO v_user_id
    FROM public.users
    WHERE email = 'alkhatri66006@gmail.com'
    LIMIT 1;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'المستخدم غير موجود. يرجى تشغيل migration 011 أولاً.';
    END IF;

    -- البحث عن whitelist entry
    SELECT id INTO v_whitelist_id
    FROM public.whitelist_entries
    WHERE email = 'alkhatri66006@gmail.com'
    LIMIT 1;

    IF v_whitelist_id IS NULL THEN
        RAISE EXCEPTION 'Whitelist entry غير موجود. يرجى تشغيل migration 009 أولاً.';
    END IF;

    -- تحديث المستخدم بجميع البيانات المطلوبة
    UPDATE public.users
    SET 
        -- Google OAuth Info (سيتم تحديثها عند تسجيل الدخول الفعلي)
        -- google_id = NULL, -- سيتم تعيينه عند تسجيل الدخول
        -- google_email = 'alkhatri66006@gmail.com', -- سيتم تعيينه عند تسجيل الدخول
        -- oauth_provider = 'google', -- سيتم تعيينه عند تسجيل الدخول
        
        -- User Info
        first_name = COALESCE(first_name, 'Super'),
        last_name = COALESCE(last_name, 'Admin'),
        username = COALESCE(username, 'alkhatri66006'),
        
        -- Verification & Status
        is_verified = true,
        is_active = true,
        
        -- Role & Permissions (من whitelist)
        role = 'developer', -- أعلى دور متاح في UserRole type
        permissions = ARRAY[
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
        
        -- Whitelist Info
        permission_source = 'whitelist',
        whitelist_entry_id = v_whitelist_id,
        
        -- Timestamps
        updated_at = NOW()
    WHERE id = v_user_id;

    RAISE NOTICE '✅ تم تحديث المستخدم الرئيسي بنجاح!';
    RAISE NOTICE '   User ID: %', v_user_id;
    RAISE NOTICE '   Email: alkhatri66006@gmail.com';
    RAISE NOTICE '   Role: developer';
    RAISE NOTICE '   is_verified: true';
    RAISE NOTICE '   is_active: true';
    RAISE NOTICE '   permission_source: whitelist';
    RAISE NOTICE '   whitelist_entry_id: %', v_whitelist_id;
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  ملاحظة:';
    RAISE NOTICE '   - عند تسجيل الدخول عبر Google OAuth، سيتم ربط google_id تلقائياً';
    RAISE NOTICE '   - جميع  متاحة من whitelist';
    RAISE NOTICE '   - يمكنك تسجيل الدخول الآن والحصول على جميع الميزات';

END $$;
