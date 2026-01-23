# Technical Debt Log - سجل الديون التقنية 🛡️

هذا السجل يوثق جميع الأجزاء غير المكتملة، الحلول المؤقتة (Mocks)، والديون التقنية في نظام الـ Backend لضمان الشفافية التقنية التامة.

| مسار الملف (File Path) | الإجراء المتخذ (Action) | السبب التقني (Reason) | المميزات الناقصة (Missing Features) |
| :--- | :--- | :--- | :--- |
| `src/infrastructure/auth/strategies/google.strategy.ts` | استخدام Mock User | لا يوجد اتصال حقيقي بقاعدة بيانات المستخدمين حالياً (UserRepository لم يكتمل). | ربط حقيقي مع PostgreSQL لإنشاء وحفظ المستخدمين. |
| `src/infrastructure/auth/passport.config.ts` | Mock Deserialization | لا يوجد مستودع (Repository) لجلب بيانات المستخدم بالمعرف (ID). | تنفيذ `UserRepository.findById` للتحقق من هوية المستخدم في كل طلب. |
| `src/infrastructure/config/env.config.ts` | Central Engine Validation | تم إنشاء المحرك المركزي، لكن بعض المفاتيح الثانوية (مثل Redis Password) اختيارية حالياً. | فرض تدقيق صارم لـ Redis و Email Providers في الإنتاج. |
| `src/bootstrap.ts` | Global Integrity Check | تم تفعيل التحقق من سلامة البيئة عند الإقلاع. | ربط تقرير الفشل بـ X-Ray Dashboard بشكل تفاعلي. |
| `src/infrastructure/auth/auth.middleware.ts` | Error Suppression | تجاهل مؤقت لبعض أخطاء الـ Type Resolving في `express-session`. | ضبط الـ (Types Global Definition) لـ `express-session` بشكل احترافي. |

## 🛠️ ملاحظات وضع التدهور الآمن (Safe Degradation Mode)

- **AI Provider**: يعمل كـ Mock في حال غياب `OPENAI_API_KEY`.
- **OAuth**: يتم تخطي التسجيل في Passport في حال غياب `GOOGLE_CLIENT_ID` أو `GOOGLE_CLIENT_SECRET`.
- **Environment**: يتم رفض الإقلاع كلياً في `production` إذا كانت المفاتيح الحيوية مفقودة في `ENV_CONFIG`.
