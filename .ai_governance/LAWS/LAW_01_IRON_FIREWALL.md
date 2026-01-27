# القانون 01: العزل الصارم (The Iron Firewall)

## التعريف (Definition)

يفرض هذا القانون عزلاً فيزيائياً ومنطقياً مطلقاً بين طبقات النظام. يُحظر على طبقة العرض (Handlers/Controllers) استدعاء حاوية الحقن (DI Container) مباشرة أو استيراد أي تفاصيل من البنية التحتية.

## السبب التقني (The Rationale)

1. **منع نمط تحديد الموقع (Anti-Pattern Service Locator):** استدعاء `container.resolve` داخل الـ Handler يخفي التبعيات ويجعل اختبار الوحدة (Unit Testing) مستحيلاً.
2. **استقلال الإطار:** يجب أن يكون كود التطبيق جاهلاً تماماً بنوع قاعدة البيانات أو المكتبات المستخدمة.

## القائمة البيضاء (المسموح ✅)

- حقن التبعيات عبر الـ Constructor فقط (Constructor Injection).
- استيراد الواجهات (Interfaces) من طبقة النطاق (Domain).
- استخدام "نقطة وصول مركزية" (Centralized Access Point) للموارد الخارجية (مثل `client.ts` لقاعدة البيانات).

## القائمة السوداء (المحظور ❌)

```typescript
// محظور: استدعاء الحاوية يدوياً داخل الدالة
const service = container.resolve("AuthService");

// محظور: استيراد ملفات Config أو Env داخل الـ Handler
import { ENV_CONFIG } from "@/infrastructure/config/env.config.js";
```

## آلية التنفيذ (Enforcement)

مراجعة يدوية: رفض أي PR يحتوي على `container.` خارج مجلد `di`.
