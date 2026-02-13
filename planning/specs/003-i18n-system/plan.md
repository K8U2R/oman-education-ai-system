# خطة التنفيذ: نظام تعدد اللغات (Multi-Language System)

**الفرع**: `003-i18n-system` | **التاريخ**: 2026-02-03 | **المواصفات**: [spec.md](./spec.md)
**المدخلات**: مواصفات الميزة من `/specs/003-i18n-system/spec.md`

## الملخص (Summary)
تحديث شامل للنظام (Frontend & Backend) لدعم اللغتين العربية والإنجليزية بشكل كامل. يتضمن ذلك تثبيت مكتبات `i18n`، إنشاء ملفات الترجمة، تحديث مكونات الواجهة لدعم `RTL`، وضمان أن جميع رسائل الخادم مترجمة.

## السياق التقني (Technical Context)

**اللغة/الإصدار**: TypeScript 5.x (Frontend & Backend)
**التبعيات الأساسية**:
- Frontend: `react-i18next`, `i18next`, `i18next-browser-languagedetector`
- Backend: `nestjs-i18n` (إذا كان مستخدماً) أو حل مخصص Express middleware لقراءة `Accept-Language`.
**التخزين**: `localStorage` لتفضيلات المستخدم.
**المنصة المستهدفة**: متصفحات الويب الحديثة.

## فحص الدستور (Constitution Check)

- [x] **لا كود بدون مواصفات**: تم إنشاء `spec.md`.
- [x] **الاختبار قبل التنفيذ**: سيتم كتابة اختبارات للتبديل بين اللغات.
- [x] **السيادة للبيانات**: ترجمة الرسائل لا تؤثر على سيادة البيانات، لكن يجب أن تكون النصوص المحلية مخزنة محلياً.
- [x] **التوثيق الحي**: يتم تحديث هذا الملف كوثيقة حية.

## هيكل المشروع (Project Structure)

### التوثيق (هذه الميزة)
```text
planning/specs/003-i18n-system/
├── plan.md              # هذا الملف
├── research.md          # مخرجات المرحلة 0
├── tasks.md             # قائمة المهام التفصيلية
```

### المصدر البرمجي (المتوقع)
```text
apps/frontend/src/
├── presentation/
│   ├── i18n/           # [NEW] تكوين i18n ومزود اللغة
│   │   ├── config.ts
│   │   ├── locales/
│   │   │   ├── ar/
│   │   │   │   ├── common.json
│   │   │   │   ├── auth.json
│   │   │   │   └── dashboard.json
│   │   │   └── en/
│   │       │   ├── ...
```

## المراحل (Phases)

### المرحلة 0: البحث
- اختيار مكتبة React المناسبة (تأكيد `i18next`).
- تحديد استراتيجية تحميل ملفات الترجمة (Static vs Lazy Loading).
- البحث عن أفضل ممارسة لـ RTL في TailwindCSS (`rtl:` modifiers).

### المرحلة 1: التأسيس (Infrastructure)
- تثبيت المكتبات.
- إنشاء ملفات `locales/ar.json` و `locales/en.json`.
- إنشاء `LanguageContext` أو تهيئة `i18next`.
- إضافة زر تبديل اللغة في `SharedLayout` أو `Navbar`.

### المرحلة 2: الترحيل (Migration)
- **الجولة 1**: صفحات المصادقة (Login, Register).
- **الجولة 2**: لوحة التحكم (Dashboard & Sidebar).
- **الجولة 3**: صفحات المطورين (Cockpit & Diagnostics).
- **الجولة 4**: السكربتات الخلفية ورسائل الخطأ.

### المرحلة 3: التحقق (Verification)
- مراجعة شاملة لجميع الصفحات باللغة العربية.
- اختبار التحقق من `RTL` في جميع المكونات (Cards, Inputs, Tables).
