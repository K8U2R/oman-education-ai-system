# مهام التنفيذ: نظام البيئة المعياري

## المرحلة 1: الإعداد (Setup)
- [x] T001 [Setup] [P] إنشاء مجلد `apps/backend/env` وتحديث `apps/backend/.gitignore` لاستثناء الملفات السرية.
- [x] T002 [Setup] تثبيت/التحقق من وجود `zod` و `dotenv` في `apps/backend/package.json`.

## المرحلة 2: التنفيذ الأساسي (Core Implementation)
- [x] T003 [Impl] [US1] إنشاء `apps/backend/env/.env.defaults` بقيم افتراضية آمنة (مثل `NODE_ENV=development`).
- [x] T004 [Impl] [US3] تنفيذ `apps/backend/env/schema.ts` باستخدام Zod لتعريف جميع المتغيرات المطلوبة (PORT, DB_URL, etc.).
- [x] T005 [Impl] [US2] تنفيذ `apps/backend/env/loader.ts` لدمج الملفات بالترتيب الصحيح (Defaults -> Local Files -> System Env) والتحقق من الصحة.

## المرحلة 3: الهجرة (Migration)
- [x] T006 [Migrate] [P] [US1] إنشاء `apps/backend/env/.env.base` ونقل المتغيرات العامة (APP_NAME, PORT).
- [x] T007 [Migrate] [P] [US1] إنشاء `apps/backend/env/.env.database` ونقل متغيرات Postgres و Redis.
- [x] T008 [Migrate] [P] [US1] إنشاء `apps/backend/env/.env.security` ونقل الأسرار (JWT_SECRET, SESSION_SECRET).
- [x] T009 [Migrate] [P] [US1] إنشاء `apps/backend/env/.env.google` ونقل إعدادات OAuth.

## المرحلة 4: التكامل (Integration)
- [x] T010 [Integrate] [US2] تحديث `apps/backend/src/infrastructure/config/env.config.ts` لاستيراد واستخدام `loadEnv()` من النظام الجديد.
- [x] T011 [Integrate] تحديث `apps/backend/src/index.ts` لإزالة أي إعدادات `dotenv` يدوية متعارضة.
- [x] T012 [Cleanup] مسح ملف `.env` القديم (بعد النسخ الاحتياطي والتحقق).

## المرحلة 5: التوثيق والتحقق
- [x] T013 [Docs] إنشاء `apps/docs/env/README.md` يشرح كيفية إضافة متغيرات جديدة.
- [x] T014 [Verify] تشغيل التطبيق محلياً والتأكد من تحميل جميع المتغيرات بنجاح.
- [x] T015 [Verify] اختبار حالة الخطأ: إزالة متغير مطلوب والتأكد من توقف التطبيق مع رسالة واضحة.

## المرحلة 6: الواجهة الأمامية (Frontend Modularization)
- [x] T016 [Setup] [P] إنشاء مجلد `apps/frontend/env` وتحديث `vite.config.ts` لتعيين `envDir: './env'`.
- [x] T017 [Impl] [US4] تنفيذ `apps/frontend/env/schema.ts` باستخدام Zod (نسخة واجهة مستخدم).
- [x] T018 [Migrate] نقل وتقسيم ملفات `.env` الموجودة إلى `apps/frontend/env/` (base, defaults).
- [x] T019 [Integrate] تحديث `apps/frontend/src/config/env.ts` للتحقق من الصحة باستخدام `schema.ts`.
- [x] T020 [Verify] التأكد من أن `VITE_API_BASE_URL` يتم تحميله بشكل صحيح في وضع التطوير والإنتاج.
