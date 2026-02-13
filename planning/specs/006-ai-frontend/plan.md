# خطة التنفيذ: تكامل واجهة الذكاء الاصطناعي

## الملخص
بناء صفحة "مولد الدروس" وربطها بخدمة الذكاء الاصطناعي الخلفية.

## المراحل

### المرحلة 1: البنية التحتية (Infrastructure)
1.  **إنشاء `AiService.ts`**:
    - في `apps/frontend/src/infrastructure/services/ai/`.
    - دالة `generateLesson(dto)`.
2.  **إنشاء `useAiGeneration` Hook**:
    - إدارة حالة التحميل (Loading)، الخطأ (Error)، والنتيجة (Data).
    - استخدام `react-query` (إذا كان متاحاً) أو `useState` بسيط.

### المرحلة 2: واجهة المستخدم (UI Construction)
1.  **إنشاء `LessonGeneratorPage.tsx`**:
    - استخدام `PageHeader` و `Container`.
2.  **بناء `LessonForm`**:
    - حقول: الموضوع (Topic)، المادة (Subject)، الصف (Grade).
    - زر "توليد" (Generate) مع حالة تحميل.
3.  **بناء `LessonDisplay`**:
    - عرض النتيجة باستخدام `react-markdown`.
    - تنسيق العناوين والقوائم لتناسب الهوية البصرية.

### المرحلة 3: التكامل واللمسات النهائية
1.  **ربط المسار**: تسجيل الصفحة في `routes`.
2.  **التحقق اليدوي**: تجربة دورة كاملة (Full Loop) من المتصفح إلى الـ Mock Provider والعودة.

## التحقق
- تشغيل التطبيق محلياً `npm run dev`.
- زيارة `/teacher/ai/lessons/new`.
- تعبئة النموذج وإرساله.
- التأكد من ظهور النتيجة في أقل من 2 ثانية (Mock).
