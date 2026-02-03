-- Migration: Add Super Admin User
-- Description: إضافة المستخدم الرئيسي alkhatri66006@gmail.com مباشرة في قاعدة البيانات
-- Date: 2026-01-10

-- التحقق من وجود whitelist entry أولاً (يجب أن يكون موجوداً من migration 009)
DO $$
DECLARE
    v_whitelist_id UUID;
    v_user_id UUID;
BEGIN
    -- البحث عن whitelist entry
    SELECT id INTO v_whitelist_id
    FROM public.whitelist_entries
    WHERE email = 'alkhatri66006@gmail.com'
    LIMIT 1;

    -- إذا لم يكن موجوداً، إنشاؤه
    IF v_whitelist_id IS NULL THEN
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
            ARRAY['*'], -- جميع 
            true,
            true,
            'Super Admin دائم - لا يمكن إزالته من النظام. تم الإنشاء تلقائياً.',
            NOW()
        )
        RETURNING id INTO v_whitelist_id;
        
        RAISE NOTICE 'تم إنشاء whitelist entry للمستخدم الرئيسي';
    ELSE
        RAISE NOTICE 'whitelist entry موجود بالفعل';
    END IF;

    -- التحقق من وجود المستخدم في جدول users
    SELECT id INTO v_user_id
    FROM public.users
    WHERE email = 'alkhatri66006@gmail.com'
    LIMIT 1;

    -- إذا لم يكن موجوداً، إنشاؤه
    IF v_user_id IS NULL THEN
        INSERT INTO public.users (
            email,
            password_hash, -- لا حاجة لكلمة مرور (OAuth فقط)
            first_name,
            last_name,
            username,
            role,
            permissions,
            is_verified,
            is_active,
            permission_source,
            whitelist_entry_id,
            created_at,
            updated_at
        ) VALUES (
            'alkhatri66006@gmail.com',
            NULL, -- لا حاجة لكلمة مرور (OAuth فقط)
            'Super',
            'Admin',
            'alkhatri66006',
            'developer', -- أعلى دور متاح في UserRole type
            ARRAY[
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
            true, -- verified
            true, -- active
            'whitelist', -- permission_source
            v_whitelist_id, -- whitelist_entry_id
            NOW(),
            NOW()
        )
        RETURNING id INTO v_user_id;
        
        RAISE NOTICE 'تم إنشاء المستخدم الرئيسي بنجاح - ID: %', v_user_id;
    ELSE
        -- تحديث المستخدم الموجود لربطه بـ whitelist
        UPDATE public.users
        SET 
            role = 'developer',
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
            is_verified = true,
            is_active = true,
            permission_source = 'whitelist',
            whitelist_entry_id = v_whitelist_id,
            updated_at = NOW()
        WHERE id = v_user_id;
        
        RAISE NOTICE 'تم تحديث المستخدم الموجود - ID: %', v_user_id;
    END IF;

    RAISE NOTICE '✅ تم إعداد المستخدم الرئيسي بنجاح!';
    RAISE NOTICE '   Email: alkhatri66006@gmail.com';
    RAISE NOTICE '   Role: developer (مع صلاحيات super_admin من whitelist)';
    RAISE NOTICE '   Whitelist Entry ID: %', v_whitelist_id;
    RAISE NOTICE '   User ID: %', v_user_id;
END $$;
