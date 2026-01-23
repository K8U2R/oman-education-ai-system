-- Script لترقية المستخدم إلى أعلى صلاحية (Developer)
-- البريد الإلكتروني: nm.5.4.14m@gmail.com
-- التاريخ: 2026-01-07

-- التحقق من وجود المستخدم
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    is_active,
    is_verified,
    created_at
FROM public.users
WHERE email = 'nm.5.4.14m@gmail.com';

-- ترقية المستخدم إلى Developer (أعلى صلاحية)
UPDATE public.users
SET 
    role = 'developer',
    is_verified = true,
    is_active = true,
    updated_at = NOW()
WHERE email = 'nm.5.4.14m@gmail.com';

-- التحقق من الترقية
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    is_active,
    is_verified,
    updated_at
FROM public.users
WHERE email = 'nm.5.4.14m@gmail.com';

-- ملاحظة: بعد الترقية، يجب على المستخدم تسجيل الخروج وإعادة تسجيل الدخول
-- لتفعيل  الجديدة في الجلسة الحالية

