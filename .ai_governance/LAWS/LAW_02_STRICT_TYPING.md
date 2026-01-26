# القانون 02: الكتابة الصارمة (Strict Typing)

## التعريف (Definition)

يُحظر استخدام النوع `any` أو التحايل باستخدام `as any` (Type Casting) لإسكات أخطاء المترجم. يجب حل تعارض الأنواع بشكل جذري.

## السبب التقني (The Rationale)

1. **الأمان:** `as any` تخفي أخطاء قد تسبب توقف النظام (Crash) وقت التشغيل.
2. **النزاهة:** الكود المليء بـ `any` يفقد مزايا TypeScript.

## القائمة البيضاء (المسموح ✅)

- استخدام `unknown` عند التعامل مع بيانات خارجية ثم التحقق منها (Zod).
- توسيع الواجهات (Interfaces) بشكل صريح.

## القائمة السوداء (المحظور ❌)

```typescript
// محظور: إسكات المترجم كما وجد في TokenService
expiresIn: this.accessTokenExpiry as any

// محظور: تجاوز النوع كما وجد في AuthService
role: (role as any) || "student"
```

## آلية التنفيذ (Enforcement)

تفعيل `no-explicit-any` في ESLint.
