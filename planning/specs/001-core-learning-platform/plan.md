# خطة التنفيذ: Core Learning Platform

**الفرع**: `001-core-learning-platform` | **التاريخ**: 2026-02-03 | **المواصفات**: [spec.md](./spec.md)
**المدخلات**: مواصفات الميزة من `/planning/specs/001-core-learning-platform/spec.md`

## الملخص (Summary)
تهدف هذه الميزة إلى بناء البنية التحتية الأساسية لنظام "الذكاء الاصطناعي كمعلم" (AI-First Education System). سنقوم بتنفيذ نموذج قاعدة البيانات الأساسي للمستخدمين والباقات (Law 14)، ومحرك التقييمات، وواجهة التفاعل مع المعلم الذكي.

## السياق التقني (Technical Context)

**اللغة/الإصدار**: TypeScript 5.3 (Both Backend & Frontend)
**التبعيات الأساسية**:
- **Backend**: Express.js, Prisma ORM, OpenAI SDK (للمعلم الذكي).
- **Frontend**: React 18, Vite, TailwindCSS (لواجهة المستخدم).
**التخزين**:
- **Primary**: PostgreSQL (للمستخدمين، الاشتراكات، المحتوى).
- **Cache**: Redis (لحفظ سياق المحادثة مع AI).
**الاختبار**: Vitest (Unit & Integration).
**المنصة المستهدفة**: Docker Containers (Sovereign Deployment).
**القيود**:
- زمن استجابة AI < 5 ثوانٍ.
- حماية صارمة لبيانات الطلاب (السيادة للبيانات).

## فحص الدستور (Constitution Check)

- [x] **لا كود بدون مواصفات**: المواصفات موجودة في `spec.md`.
- [x] **الاختبار قبل التنفيذ**: سيتم كتابة اختبارات الـ API قبل التنفيذ (TDD).
- [x] **السيادة للبيانات**: جميع البيانات تخزن محلياً (On-Premise) ولا يتم مشاركتها إلا مع OpenAI عبر API آمن ومحدود النطاق.
- [x] **التوثيق الحي**: العقود والخطط ستكون جزءاً من المستودع.
- [x] **الوضوح**: سيتم استخدام تسميات واضحة (Learner, Tier, Assessment) بدلاً من الاختصارات.

## هيكل المشروع (Project Structure)

### التوثيق (هذه الميزة)

```text
planning/specs/001-core-learning-platform/
├── plan.md              # هذا الملف
├── research.md          # مخرجات المرحلة 0
├── data-model.md        # مخرجات المرحلة 1 (Prisma Schema)
├── quickstart.md        # دليل التشغيل السريع للميزة
├── contracts/           # عقود API (OpenAPI/Swagger)
└── tasks.md             # قائمة المهام التفصيلية
```

### المصدر البرمجي

```text
apps/backend/src/
├── modules/
│   ├── learning/        # منطق المعلم الذكي وإدارة الدروس
│   ├── assessment/      # محرك التقييمات والامتحانات
│   └── subscription/    # إدارة الباقات (Law 14)
└── prisma/schema.prisma # تحديث مخطط قاعدة البيانات

apps/frontend/src/
├── features/
│   ├── learning/        # واجهات الدروس والمحادثة
│   ├── assessment/      # واجهات الامتحانات
│   └── subscription/    # واجهات الترقية وعرض الباقات
```

## المراحل (Phases)

### المرحلة 0: المخطط والبحث
1. **تحديد نموذج البيانات**: رسم العلاقات بين المستخدمين، الباقات، والتقييمات.
2. **تصميم واجهة AI**: تحديد كيفية حفظ سياق المحادثة (State Management) بين الجلسات.
3. **بحث التكامل**: أفضل طريقة لدمج OpenAI API مع تدفق البيانات المحلي لضمان الخصوصية.

### المرحلة 1: التصميم والعقود
1. **تحديث schema.prisma**: إضافة جداول `Subscription`, `Assessment`, `Question`.
2. **تعريف API Contracts**: تحديد نقاط النهاية (Endpoints) لخدمات التعلم والتقييم.
3. **تحديث السياق**: تشغيل `update-agent-context.sh`.

### المرحلة 2: التنفيذ (Tasks Breakdown)
سيتم تقسيم العمل إلى مهام صغيرة في `tasks.md`:
- P0: إعداد قاعدة البيانات ونماذج المستخدمين.
- P1: تنفيذ نظام الباقات (Access Control Middleware).
- P1: بناء واجهة المعلم الذكي (Backend + Frontend).
- P2: تنفيذ محرك التقييمات.

**قرار الهيكل**: استخدام بنية `apps/` للمشاريع المتعددة (Monorepo-style) للحفاظ على الفصل بين الواجهة والخدمات.
