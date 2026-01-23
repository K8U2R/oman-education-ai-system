-- Migration: Fix Super Admin Permissions
-- Description: تحديث صلاحيات المستخدم الرئيسي مباشرة من whitelist
-- Date: 2026-01-10

DO $$
DECLARE
    v_user_id UUID;
    v_whitelist_id UUID;
    v_permission_level VARCHAR(50);
    v_permissions TEXT[];
BEGIN
    -- البحث عن المستخدم
    SELECT id INTO v_user_id
    FROM public.users
    WHERE email = 'alkhatri66006@gmail.com'
    LIMIT 1;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'المستخدم غير موجود. يرجى تشغيل migration 011 أولاً.';
    END IF;

    -- البحث عن whitelist entry وجلب 
    SELECT 
        id, 
        permission_level,
        permissions
    INTO 
        v_whitelist_id,
        v_permission_level,
        v_permissions
    FROM public.whitelist_entries
    WHERE email = 'alkhatri66006@gmail.com'
    LIMIT 1;

    IF v_whitelist_id IS NULL THEN
        RAISE EXCEPTION 'Whitelist entry غير موجود. يرجى تشغيل migration 009 أولاً.';
    END IF;

    -- تحديث المستخدم بجميع البيانات من whitelist
    UPDATE public.users
    SET 
        -- Role (أعلى دور متاح)
        role = 'developer',
        
        -- Permissions (من whitelist)
        permissions = COALESCE(v_permissions, ARRAY[
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
        ]),
        
        -- Verification & Status
        is_verified = true,
        is_active = true,
        
        -- Whitelist Info
        permission_source = 'whitelist',
        whitelist_entry_id = v_whitelist_id,
        
        -- Timestamps
        updated_at = NOW()
    WHERE id = v_user_id;

    RAISE NOTICE '✅ تم تحديث صلاحيات المستخدم الرئيسي بنجاح!';
    RAISE NOTICE '   User ID: %', v_user_id;
    RAISE NOTICE '   Email: alkhatri66006@gmail.com';
    RAISE NOTICE '   Role: developer';
    RAISE NOTICE '   Permission Level: %', v_permission_level;
    RAISE NOTICE '   Permissions Count: %', array_length(v_permissions, 1);
    RAISE NOTICE '   is_verified: true';
    RAISE NOTICE '   is_active: true';
    RAISE NOTICE '   permission_source: whitelist';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  مهم:';
    RAISE NOTICE '   - يجب تسجيل الدخول عبر Google OAuth لتحديث الـ token';
    RAISE NOTICE '   - بعد تسجيل الدخول، سيتم تطبيق جميع  تلقائياً';

END $$;
