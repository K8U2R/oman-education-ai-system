# مهام التنفيذ: Core Learning Platform
**الفرع**: `001-core-learning-platform`

## المرحلة 1: أساس البيانات (Database Foundation) - P0
يجب إرساء قواعد البيانات قبل بناء أي منطق.

- [x] **DB-001**: تحديث `schema.prisma` بإضافة نماذج `Subscription`, `Course`, `Module`, `Lesson`.
- [x] **DB-002**: إضافة نماذج `Assessment`, `Question`, `UserAssessment` إلى `schema.prisma`.
- [x] **DB-003**: إضافة نماذج الذاكرة `ConversationThread`, `ChatMessage`.
- [x] **DB-004**: تشغيل الهجرة (Migration) `npm run db:migrate` وتوليد Prisma Client.
- [x] **DB-005**: إنشاء سكريبت `seed.ts` لإضافة بيانات أولية (باقات Free/Pro، مسار تعليمي تجريبي).

## المرحلة 2: الخدمات الخلفية (Backend Services) - P1
تنفيذ المنطق الأساسي والاتصال بالذكاء الاصطناعي.

- [x] **BE-001**: إنشاء `modules/subscription` وتنفيذ خدمة التحقق من الباقات (Tier Guard).
- [x] **BE-002**: إنشاء `modules/learning` وتنفيذ خدمة إدارة المسارات (CRUD للمحتوى).
- [x] **BE-003**: تنفيذ خدمة `OpenAIService` وربطها بـ `ConversationThread` لحفظ السياق.
- [x] **BE-004**: إنشاء واجهة API (`contracts/learning-api.yaml`) باستخدام Express/tsoa.
- [ ] **BE-005**: كتابة اختبارات تكاملية (`tests/integration/learning.test.ts`) للتحقق من تدفق المحادثة.

## المرحلة 3: واجهة المستخدم (Frontend Implementation) - P1
بناء الواجهات التفاعلية للطالب.

- [x] **FE-001**: إنشاء مكونات `ChatInterface` (رسائل، إدخال، حالات تحميل).
- [x] **FE-002**: ربط واجهة المحادثة بـ API الخلفية باستخدام `axios` و `react-query`.
- [x] **FE-003**: بناء صفحة "لوحة التعلم" (Learning Dashboard) لعرض المسارات المتاحة.
- [x] **FE-004**: تنفيذ حماية الواجهات (Protected Routes) بناءً على اشتراك المستخدم (توجيه المستخدم Free لصفحة الترقية).

## المرحلة 4: محرك التقييم وتكامل النظام (Assessment & Polish) - P2
إغلاق الدورة التعليمية.

- [x] **BE-006**: تنفيذ منطق تصحيح الاختبارات (Auto-Grading) في `modules/assessment`.
    - [x] **BE-006-AI**: ربط `OpenAIService` لتصحيح الأسئلة المقالية والكود (AMB-001 - Compliance Check).
- [x] **BE-007**: تنفيذ خدمة `CertificateService` وتوليد ملفات PDF عند إتمام المسار (GAP-001).
- [x] **FE-005**: بناء واجهة حل الاختبارات (Quiz UI) مع مؤقت ودعم لعدة أنواع من الأسئلة.
- [ ] **SYS-001**: مراجعة شاملة للأمان (Security Audit) على نقاط النهاية.
- [x] **QA-001**: تنفيذ اختبار الحمل (Load Test) باستخدام k6 لضمان دعم 10,000 مستخدم (GAP-002).
