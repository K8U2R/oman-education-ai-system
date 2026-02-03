# مهام التنفيذ: Core Learning Platform
**الفرع**: `001-core-learning-platform`

## المرحلة 1: أساس البيانات (Database Foundation) - P0
يجب إرساء قواعد البيانات قبل بناء أي منطق.

- [ ] **DB-001**: تحديث `schema.prisma` بإضافة نماذج `Subscription`, `Course`, `Module`, `Lesson`.
- [ ] **DB-002**: إضافة نماذج `Assessment`, `Question`, `UserAssessment` إلى `schema.prisma`.
- [ ] **DB-003**: إضافة نماذج الذاكرة `ConversationThread`, `ChatMessage`.
- [ ] **DB-004**: تشغيل الهجرة (Migration) `npm run db:migrate` وتوليد Prisma Client.
- [ ] **DB-005**: إنشاء سكريبت `seed.ts` لإضافة بيانات أولية (باقات Free/Pro، مسار تعليمي تجريبي).

## المرحلة 2: الخدمات الخلفية (Backend Services) - P1
تنفيذ المنطق الأساسي والاتصال بالذكاء الاصطناعي.

- [ ] **BE-001**: إنشاء `modules/subscription` وتنفيذ خدمة التحقق من الباقات (Tier Guard).
- [ ] **BE-002**: إنشاء `modules/learning` وتنفيذ خدمة إدارة المسارات (CRUD للمحتوى).
- [ ] **BE-003**: تنفيذ خدمة `OpenAIService` وربطها بـ `ConversationThread` لحفظ السياق.
- [ ] **BE-004**: إنشاء واجهة API (`contracts/learning-api.yaml`) باستخدام Express/tsoa.
- [ ] **BE-005**: كتابة اختبارات تكاملية (`tests/integration/learning.test.ts`) للتحقق من تدفق المحادثة.

## المرحلة 3: واجهة المستخدم (Frontend Implementation) - P1
بناء الواجهات التفاعلية للطالب.

- [ ] **FE-001**: إنشاء مكونات `ChatInterface` (رسائل، إدخال، حالات تحميل).
- [ ] **FE-002**: ربط واجهة المحادثة بـ API الخلفية باستخدام `axios` و `react-query`.
- [ ] **FE-003**: بناء صفحة "لوحة التعلم" (Learning Dashboard) لعرض المسارات المتاحة.
- [ ] **FE-004**: تنفيذ حماية الواجهات (Protected Routes) بناءً على اشتراك المستخدم (توجيه المستخدم Free لصفحة الترقية).

## المرحلة 4: محرك التقييم وتكامل النظام (Assessment & Polish) - P2
إغلاق الدورة التعليمية.

- [ ] **BE-006**: تنفيذ منطق تصحيح الاختبارات (Auto-Grading) في `modules/assessment`.
- [ ] **FE-005**: بناء واجهة حل الاختبارات (Quiz UI) مع مؤقت ودعم لعدة أنواع من الأسئلة.
- [ ] **SYS-001**: مراجعة شاملة للأمان (Security Audit) على نقاط النهاية.
