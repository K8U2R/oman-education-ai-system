# Domain Types - أنواع المجال

## 📋 نظرة عامة

هذا المجلد يحتوي على جميع تعريفات الأنواع (Types) المستخدمة في طبقة المجال (Domain Layer) لنظام التعليم الذكي العماني.

## 🏗️ البنية

```
domain/types/
├── index.ts                    # Barrel Export - نقطة الدخول المركزية
├── admin.types.ts              # أنواع لوحة تحكم الإدارة
├── assessment.types.ts         # أنواع التقييمات والامتحانات
├── auth.types.ts              # أنواع المصادقة والمستخدمين
├── code-generation.types.ts   # أنواع توليد الكود
├── content-management.types.ts # أنواع إدارة المحتوى (ContentLesson)
├── developer.types.ts          # أنواع لوحة تحكم المطور
├── learning.types.ts          # أنواع التعلم (LearningLesson)
├── notification.types.ts       # أنواع الإشعارات
├── office.types.ts            # أنواع ملفات Office
├── project.types.ts           # أنواع المشاريع التعليمية
└── security.types.ts          # أنواع الأمان والمراقبة
```

## 📦 الملفات والأنواع

### 1. `auth.types.ts` - أنواع المصادقة

**الأنواع الرئيسية:**

- `UserRole` - أدوار المستخدمين
- `Permission` -
- `UserData` - بيانات المستخدم من قاعدة البيانات
- `AuthTokens` - رموز المصادقة
- `LoginRequest`, `LoginResponse` - طلبات تسجيل الدخول
- `RegisterRequest` - طلبات التسجيل
- `VerificationTokenData` - بيانات رموز التحقق

**مثال الاستخدام:**

```typescript
import { UserData, UserRole, LoginRequest } from '@/domain/types/auth.types'
// أو
import { UserData, UserRole, LoginRequest } from '@/domain/types'
```

---

### 2. `learning.types.ts` - أنواع التعلم

**الأنواع الرئيسية:**

- `LearningLesson` - الدرس (⚠️ تم إعادة تسميته لتجنب التعارض)
- `LessonExplanation` - شرح الدرس
- `LessonExample` - مثال على الدرس
- `LessonVideo` - فيديو الدرس
- `LessonMindMap` - خريطة ذهنية للدرس

**⚠️ ملاحظة مهمة:**

- تم إعادة تسمية `Lesson` إلى `LearningLesson` لتجنب التعارض مع `ContentLesson`
- استخدم `LearningLesson` عند التعامل مع مساعد التعلم
- استخدم `ContentLesson` عند التعامل مع إدارة المحتوى

**مثال الاستخدام:**

```typescript
import { LearningLesson, LessonExplanation } from '@/domain/types/learning.types'
// أو
import { LearningLesson, LessonExplanation } from '@/domain/types'
```

---

### 3. `content-management.types.ts` - أنواع إدارة المحتوى

**الأنواع الرئيسية:**

- `ContentLesson` - الدرس (⚠️ تم إعادة تسميته لتجنب التعارض)
- `CreateLessonRequest` - طلب إنشاء درس
- `UpdateLessonRequest` - طلب تحديث درس
- `Subject` - المادة الدراسية
- `GradeLevel` - المستوى الدراسي
- `LearningPath` - المسار التعليمي

**⚠️ ملاحظة مهمة:**

- تم إعادة تسمية `Lesson` إلى `ContentLesson` لتجنب التعارض مع `LearningLesson`
- استخدم `ContentLesson` عند التعامل مع إدارة المحتوى (CMS)
- استخدم `LearningLesson` عند التعامل مع مساعد التعلم

**مثال الاستخدام:**

```typescript
import { ContentLesson, Subject, GradeLevel } from '@/domain/types/content-management.types'
// أو
import { ContentLesson, Subject, GradeLevel } from '@/domain/types'
```

---

### 4. `project.types.ts` - أنواع المشاريع

**الأنواع الرئيسية:**

- `Project` - المشروع
- `ProjectType` - نوع المشروع
- `ProjectStatus` - حالة المشروع
- `CreateProjectRequest` - طلب إنشاء مشروع
- `UpdateProjectRequest` - طلب تحديث مشروع
- `ProjectProgress` - تقدم المشروع

**مثال الاستخدام:**

```typescript
import { Project, ProjectType, ProjectStatus } from '@/domain/types/project.types'
```

---

### 5. `assessment.types.ts` - أنواع التقييمات

**الأنواع الرئيسية:**

- `Assessment` - التقييم
- `AssessmentType` - نوع التقييم
- `AssessmentQuestion` - سؤال التقييم
- `AssessmentSubmission` - إجابة الطالب
- `CreateAssessmentRequest` - طلب إنشاء تقييم

**مثال الاستخدام:**

```typescript
import { Assessment, AssessmentType } from '@/domain/types/assessment.types'
```

---

### 6. `notification.types.ts` - أنواع الإشعارات

**الأنواع الرئيسية:**

- `NotificationData` - بيانات الإشعار
- `NotificationType` - نوع الإشعار
- `NotificationStatus` - حالة الإشعار
- `CreateNotificationRequest` - طلب إنشاء إشعار

**مثال الاستخدام:**

```typescript
import { NotificationData, NotificationType } from '@/domain/types/notification.types'
```

---

### 7. `admin.types.ts` - أنواع الإدارة

**الأنواع الرئيسية:**

- `SystemStats` - إحصائيات النظام
- `UserStats` - إحصائيات المستخدمين
- `ContentStats` - إحصائيات المحتوى
- `AdminUserInfo` - معلومات المستخدم للإدارة
- `SystemLog` - سجل النظام

**مثال الاستخدام:**

```typescript
import { SystemStats, UserStats } from '@/domain/types/admin.types'
```

---

### 8. `developer.types.ts` - أنواع المطور

**الأنواع الرئيسية:**

- `DeveloperStats` - إحصائيات المطور
- `APIEndpointInfo` - معلومات API Endpoint
- `ServiceInfo` - معلومات Service
- `DeveloperLog` - سجل المطور
- `PerformanceMetric` - مقياس الأداء

**مثال الاستخدام:**

```typescript
import { DeveloperStats, APIEndpointInfo } from '@/domain/types/developer.types'
```

---

### 9. `code-generation.types.ts` - أنواع توليد الكود

**الأنواع الرئيسية:**

- `CodeGenerationRequest` - طلب توليد الكود
- `CodeGenerationResponse` - استجابة توليد الكود
- `CodeImprovementRequest` - طلب تحسين الكود
- `CodeExplanationRequest` - طلب شرح الكود

**مثال الاستخدام:**

```typescript
import { CodeGenerationRequest, CodeGenerationResponse } from '@/domain/types/code-generation.types'
```

---

### 10. `office.types.ts` - أنواع ملفات Office

**الأنواع الرئيسية:**

- `OfficeFileType` - نوع ملف Office
- `OfficeGenerationRequest` - طلب إنشاء ملف Office
- `ExcelGenerationRequest` - طلب إنشاء Excel
- `WordGenerationRequest` - طلب إنشاء Word
- `PowerPointGenerationRequest` - طلب إنشاء PowerPoint

**مثال الاستخدام:**

```typescript
import { OfficeFileType, ExcelGenerationRequest } from '@/domain/types/office.types'
```

---

### 11. `security.types.ts` - أنواع الأمان

**الأنواع الرئيسية:**

- `SecurityEvent` - حدث أمني
- `SecuritySession` - جلسة أمنية
- `SecurityAlert` - تنبيه أمني
- `SecuritySettings` - إعدادات الأمان
- `SecurityStats` - إحصائيات الأمان

**مثال الاستخدام:**

```typescript
import { SecurityEvent, SecuritySession } from '@/domain/types/security.types'
```

---

## 🔄 كيفية الاستيراد

### ✅ الطريقة الموصى بها

**1. استيراد من `index.ts` (للأنواع الشائعة):**

```typescript
import { UserData, UserRole, LoginRequest } from '@/domain/types'
```

**2. استيراد من ملف محدد (للأنواع المحددة أو لتجنب التعارضات):**

```typescript
import { LearningLesson } from '@/domain/types/learning.types'
import { ContentLesson } from '@/domain/types/content-management.types'
```

### ❌ تجنب

**1. لا تستورد من `shared/common.ts` للأنواع:**

```typescript
// ❌ سيء
import { UserData } from '@/shared/common'

// ✅ جيد
import { UserData } from '@/domain/types'
```

**2. لا تستخدم `export *` في ملفاتك:**

```typescript
// ❌ سيء - يسبب تعارضات
export * from './types'

// ✅ جيد - استخدم export type
export type * from './types'
```

---

## ⚠️ التعارضات المعروفة والحلول

### 1. تعارض `Lesson`

**المشكلة:**

- يوجد `Lesson` في `learning.types.ts` و `content-management.types.ts`
- كلاهما له نفس الاسم لكن بنية مختلفة

**الحل:**

- تم إعادة تسمية `Lesson` في `learning.types.ts` إلى `LearningLesson`
- تم إعادة تسمية `Lesson` في `content-management.types.ts` إلى `ContentLesson`

**الاستخدام:**

```typescript
// للتعلم
import { LearningLesson } from '@/domain/types/learning.types'

// لإدارة المحتوى
import { ContentLesson } from '@/domain/types/content-management.types'
```

---

## 📝 معايير الكتابة

### 1. تسمية الأنواع

- **Interfaces:** `PascalCase` (مثال: `UserData`, `LoginRequest`)
- **Types:** `PascalCase` (مثال: `UserRole`, `ProjectStatus`)
- **Constants:** `UPPER_SNAKE_CASE` (مثال: `ROLE_PERMISSIONS`)

### 2. التوثيق

كل نوع يجب أن يحتوي على:

- تعليق JSDoc بالعربية
- وصف واضح للاستخدام
- مثال إذا لزم الأمر

**مثال:**

```typescript
/**
 * UserData - بيانات المستخدم من قاعدة البيانات
 * 
 * يستخدم snake_case للتوافق مع قاعدة البيانات
 * 
 * @example
 * ```typescript
 * const user: UserData = {
 *   id: '123',
 *   email: 'user@example.com',
 *   // ...
 * }
 * ```
 */
export interface UserData {
  id: string
  email: string
  // ...
}
```

### 3. تجنب `any`

**❌ سيء:**

```typescript
metadata?: Record<string, any>
```

**✅ جيد:**

```typescript
metadata?: Record<string, unknown>
```

---

## 🔍 البحث عن الأنواع

### إذا كنت تبحث عن نوع معين

1. **ابحث في `index.ts`** - يحتوي على جميع التصديرات
2. **ابحث في الملفات** - استخدم البحث في IDE
3. **راجع هذا الملف** - يحتوي على قائمة بجميع الأنواع

### أمثلة

**البحث عن نوع المستخدم:**

- ابحث في `auth.types.ts` → `UserData`, `UserRole`

**البحث عن نوع الدرس:**

- للتعلم: `learning.types.ts` → `LearningLesson`
- لإدارة المحتوى: `content-management.types.ts` → `ContentLesson`

---

## 🛠️ الصيانة

### عند إضافة نوع جديد

1. **حدد الملف المناسب** - ضع النوع في الملف المناسب حسب المجال
2. **أضف التوثيق** - أضف JSDoc بالعربية
3. **صدّر من `index.ts`** - أضف `export type` في `index.ts`
4. **تجنب التعارضات** - تأكد من عدم وجود أسماء متعارضة

### عند تعديل نوع موجود

1. **تحقق من الاستخدامات** - ابحث عن جميع الاستخدامات
2. **حدث التوثيق** - حدث JSDoc إذا تغير الاستخدام
3. **اختبر التغييرات** - تأكد من عدم كسر الكود الموجود

---

## 📚 المراجع

- [TypeScript Handbook - Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Clean Architecture - Domain Layer](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

**آخر تحديث:** 2024
**الحالة:** ✅ محدث ومحدث
