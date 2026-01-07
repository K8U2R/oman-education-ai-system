# Core - النواة النظامية

هذا القسم يحتوي على كل ما هو أساسي ومشترك في التطبيق ولا يتغير كثيراً مع إضافة ميزات جديدة.

## 📁 الهيكلة

```
core/
├── interceptors/    # معالجات HTTP
│   ├── auth.interceptor.ts
│   ├── offline.interceptor.ts
│   └── index.ts
├── services/        # الخدمات النظامية
│   ├── system/      # خدمات النظام (cache, offline, error-handling, analytics, performance)
│   └── ui/          # خدمات واجهة المستخدم (theme, i18n, validation, search)
└── utils/           # دوال مساعدة عامة
    ├── date-format.util.ts
    ├── error-mapper.util.ts
    └── ai-prompts.util.ts
```

## 🎯 المحتويات

### interceptors/

معالجات HTTP التي تعمل على مستوى التطبيق:

- **auth.interceptor.ts**: معالجة المصادقة (إضافة tokens، تجديد tokens)
- **offline.interceptor.ts**: معالجة الطلبات في وضع Offline
- **error.interceptor.ts**: معالجة الأخطاء العامة (اختياري)
- **ai-logging.interceptor.ts**: تسجيل طلبات AI (اختياري)

### services/system/

الخدمات النظامية الأساسية:

- **cache.service.ts**: إدارة التخزين المؤقت
- **offline.service.ts**: إدارة العمل في وضع Offline
- **error-handling.service.ts**: معالجة الأخطاء المركزية
- **error-boundary.service.ts**: Error Boundary Service
- **background-sync.service.ts**: المزامنة الخلفية
- **analytics.service.ts**: التحليلات
- **performance.service.ts**: مراقبة الأداء

### services/ui/

خدمات واجهة المستخدم المشتركة:

- **theme.service.ts**: إدارة الثيمات
- **i18n.service.ts**: الترجمة واللغة
- **validation.service.ts**: التحقق من البيانات
- **search.service.ts**: البحث العام

### utils/

دوال مساعدة عامة:

- **date-format.util.ts**: تنسيق التواريخ
- **error-mapper.util.ts**: تحويل الأخطاء إلى رسائل صديقة للمستخدم
- **ai-prompts.util.ts**: قوالب AI Prompts المشتركة

## 📋 القواعد

### ✅ ما يجب أن يكون هنا:

- كل ما هو مشترك بين جميع الميزات
- الخدمات النظامية الأساسية
- المعالجات العامة
- الدوال المساعدة العامة

### ❌ ما لا يجب أن يكون هنا:

- Logic خاص بميزة معينة
- Services تتواصل مع APIs محددة لميزة واحدة
- Hooks خاصة بميزة معينة
- Stores خاصة بميزة معينة

## 🔄 الاستخدام

```typescript
// استخدام interceptor
import { authInterceptor } from '@/application/core/interceptors'

// استخدام service نظامي
import { cacheService } from '@/application/core/services/system'

// استخدام service UI
import { i18nService } from '@/application/core/services/ui'

// استخدام util
import { formatDate } from '@/application/core/utils/date-format.util'
```

## 📝 ملاحظات

- كل شيء هنا يجب أن يكون قابلاً للاستخدام من أي feature
- لا تضيف dependencies على features محددة
- حافظ على البساطة والاستقلالية

---

**آخر تحديث:** يناير 2026
