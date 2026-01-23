# خريطة استخدامات Domain Types

## 📊 نظرة عامة

هذا الملف يوضح كيفية استخدام أنواع `domain/types` في جميع أنحاء المشروع.

---

## 🔍 استخدامات `Lesson` (المشكلة الرئيسية)

### ❌ الوضع الحالي (مشكلة)

#### 1. `learning.types.ts`
```typescript
export interface Lesson { ... }
```

**الاستخدامات:**
- `backend/src/application/services/learning/LearningService.ts`
  - يستورد: `LearningLesson as Lesson` (سطر 16)
  - يستخدم `Lesson` داخلياً في 8 أماكن

- `backend/src/application/services/learning/LearningService.test.ts`
  - يستورد: `LearningLesson`
  - يستخدم `LearningLesson` في 6 أماكن

#### 2. `content-management.types.ts`
```typescript
export interface Lesson { ... }
```

**الاستخدامات:**
- `backend/src/application/services/content-management/ContentManagementService.ts`
  - يستورد: `Lesson` مباشرة (سطر 15)
  - يستخدم `Lesson` في 7 أماكن

- `backend/src/application/services/content-management/ContentManagementService.test.ts`
  - يستورد: `Lesson` مباشرة (سطر 9)
  - يستخدم `Lesson` في 8 أماكن

### ⚠️ المشكلة
- **تعارض في الأسماء**: نفس الاسم `Lesson` في ملفين مختلفين
- **عدم وضوح**: لا يعرف المطور أي `Lesson` يستخدم
- **حل جزئي**: `LearningService` يحل المشكلة محلياً بـ `as Lesson` لكن هذا ليس حلاً جيداً

---

## 📦 استخدامات الأنواع الأخرى

### `auth.types.ts`

#### الاستخدامات المباشرة:
1. **`backend/src/application/services/auth/AuthService.ts`**
   - يستورد: `LoginRequest`, `RegisterRequest`, `RefreshTokenRequest`, `LoginResponse`, `RefreshTokenResponse`
   - يستورد أيضاً: `UserData` من `@/domain`

2. **`backend/src/application/services/auth/GoogleOAuthService.ts`**
   - يستورد: `LoginResponse`

3. **`backend/src/infrastructure/repositories/AuthRepository.ts`**
   - يستورد: `UserData`, `LoginRequest`, `RegisterRequest`, `VerificationTokenData`

4. **`backend/src/infrastructure/repositories/GoogleOAuthRepository.ts`**
   - يستورد: `UserData`

5. **`backend/src/domain/entities/User.ts`**
   - يستورد: `UserData`, `UserRole`, `Permission`, `ROLE_PERMISSIONS`

6. **`backend/src/application/use-cases/auth/*.ts`**
   - جميع Use Cases تستورد أنواع من `auth.types.ts`

#### الاستخدامات غير المباشرة:
- `backend/src/shared/common.ts` يعيد تصدير `auth.types.ts` بالكامل

---

### `notification.types.ts`

#### الاستخدامات:
1. **`backend/src/application/services/notification/NotificationService.ts`**
   - يستورد: `NotificationData`, `NotificationType`, `NotificationStatus`, `CreateNotificationRequest`, `UpdateNotificationRequest`, `NotificationStats`, `NotificationListResponse`

2. **`backend/src/infrastructure/repositories/NotificationRepository.ts`**
   - يستورد: `NotificationData`, `NotificationType`, `NotificationStatus`, `CreateNotificationRequest`, `UpdateNotificationRequest`

3. **`backend/src/domain/entities/Notification.ts`**
   - يستورد: `NotificationData`, `NotificationType`, `NotificationStatus`

4. **`backend/src/domain/mappers/NotificationMapper.ts`**
   - يستورد: `NotificationData`

---

### `project.types.ts`

#### الاستخدامات:
1. **`backend/src/application/services/project/ProjectService.ts`**
   - يستورد: `Project`, `ProjectType`, `ProjectStatus`, `CreateProjectRequest`, `UpdateProjectRequest`, `ProjectProgress`, `ProjectStats`

---

### `assessment.types.ts`

#### الاستخدامات:
1. **`backend/src/application/services/assessment/AssessmentService.ts`**
   - يستورد: `Assessment`, `AssessmentType`, `AssessmentStatus`, `AssessmentQuestion`, `AssessmentSubmission`, `CreateAssessmentRequest`, `UpdateAssessmentRequest`, `SubmitAssessmentRequest`, `AssessmentStats`

---

### `admin.types.ts`

#### الاستخدامات:
1. **`backend/src/application/services/admin/AdminService.ts`**
   - يستورد: `SystemStats`, `UserStats`, `ContentStats`, `UsageStats`, `AdminUserInfo`, `UpdateUserRequest`, `SearchUsersRequest`, `SystemLog`, `SearchLogsRequest`, `UserActivity`

---

### `developer.types.ts`

#### الاستخدامات:
1. **`backend/src/application/services/developer/DeveloperService.ts`**
   - يستورد: `DeveloperStats`, `APIEndpointInfo`, `ServiceInfo`, `DeveloperLog`, `PerformanceMetric`

---

### `code-generation.types.ts`

#### الاستخدامات:
1. **`backend/src/application/services/code-generation/CodeGenerationService.ts`**
   - يستورد: `CodeGenerationRequest`, `CodeGenerationResponse`, `CodeImprovementRequest`, `CodeImprovementResponse`, `CodeExplanationRequest`, `CodeExplanationResponse`, `GeneratedProject`

---

### `office.types.ts`

#### الاستخدامات:
1. **`backend/src/application/services/office/OfficeGenerationService.ts`**
   - يستورد: `OfficeFileType`, `OfficeGenerationRequest`, `OfficeGenerationResponse`, `OfficeTemplate`, `ExcelSheetData`, `WordDocumentData`, `PowerPointSlideData`, `ExcelGenerationRequest`, `WordGenerationRequest`, `PowerPointGenerationRequest`, `GeneratedOfficeProject`

2. **`backend/src/infrastructure/adapters/office/ExcelAdapter.ts`**
   - يستورد: `ExcelGenerationRequest`

3. **`backend/src/infrastructure/adapters/office/WordAdapter.ts`**
   - يستورد: `WordGenerationRequest`

4. **`backend/src/infrastructure/adapters/office/PowerPointAdapter.ts`**
   - يستورد: `PowerPointGenerationRequest`

---

### `security.types.ts`

#### الاستخدامات:
1. **`backend/src/application/services/security/SecurityService.ts`**
   - يستورد: `SecurityEvent`, `SecurityEventType`, `SecurityEventSeverity`, `SecuritySession`, `SecurityAlert`, `SecurityAlertType`, `SecuritySettings`, `SecurityStats`, `SessionFilter`, `SecurityEventFilter`, `SecurityAlertFilter`

2. **`backend/src/application/services/security/SecurityMonitoringService.ts`**
   - يستورد: أنواع أمنية متعددة

3. **`backend/src/application/services/security/SecurityAnalyticsService.ts`**
   - يستورد: أنواع تحليلات أمنية

4. **`backend/src/application/services/security/SessionService.ts`**
   - يستورد: أنواع الجلسات

---

## 📈 إحصائيات الاستخدام

### أكثر الأنواع استخداماً:

1. **`UserData`** - 15+ ملف
2. **`LoginRequest`, `LoginResponse`** - 10+ ملف
3. **`NotificationData`** - 5+ ملف
4. **`Lesson`** (المتعارض) - 4+ ملف
5. **`Project`** - 2+ ملف

### طرق الاستيراد:

1. **من ملف محدد** (الأكثر شيوعاً):
   ```typescript
   import { UserData } from '@/domain/types/auth.types'
   ```
   - **43 ملف** يستخدم هذه الطريقة

2. **من `index.ts`**:
   ```typescript
   import { UserData } from '@/domain/types'
   ```
   - **قليل الاستخدام** (يسبب مشاكل مع التعارضات)

3. **من `shared/common.ts`**:
   ```typescript
   import { UserData } from '@/shared/common'
   ```
   - **ملف واحد فقط** (`shared/common.ts`)

---

## 🎯 التوصيات

### 1. إصلاح تعارض `Lesson`

**الخطوات:**
1. إعادة تسمية `Lesson` في `learning.types.ts` إلى `LearningLesson`
2. إعادة تسمية `Lesson` في `content-management.types.ts` إلى `ContentLesson`
3. تحديث جميع الاستيرادات:
   - `LearningService.ts` → استخدام `LearningLesson` مباشرة
   - `ContentManagementService.ts` → استخدام `ContentLesson` مباشرة

### 2. توحيد طريقة الاستيراد

**القاعدة:**
- ✅ استخدم `@/domain/types/[module].types` للأنواع المحددة
- ✅ استخدم `@/domain/types` فقط للأنواع غير المتعارضة
- ❌ لا تستخدم `@/shared/common` للأنواع

### 3. تحديث `index.ts`

**الخطوات:**
1. تحويل جميع `export *` إلى `export type *`
2. إضافة تصديرات صريحة للأنواع المتعارضة
3. إضافة توثيق واضح

---

## 🔄 خطة الترحيل

### المرحلة 1: إصلاح `Lesson`

```typescript
// 1. تحديث learning.types.ts
export interface LearningLesson { ... }  // بدلاً من Lesson

// 2. تحديث content-management.types.ts
export interface ContentLesson { ... }  // بدلاً من Lesson

// 3. تحديث LearningService.ts
import { LearningLesson } from '@/domain/types/learning.types'
// إزالة: LearningLesson as Lesson

// 4. تحديث ContentManagementService.ts
import { ContentLesson as Lesson } from '@/domain/types/content-management.types'
// أو استخدام ContentLesson مباشرة
```

### المرحلة 2: تحديث `index.ts`

```typescript
// تصدير صريح
export type {
  LearningLesson,
  LessonExplanation,
  // ...
} from './learning.types'

export type {
  ContentLesson,
  CreateLessonRequest,
  // ...
} from './content-management.types'
```

### المرحلة 3: تحديث التوثيق

- تحديث README.md
- تحديث JSDoc في الملفات
- إضافة أمثلة الاستخدام

### المرحلة 4: إصلاح استخدام `any` (لاحقاً)

⚠️ **ملاحظة:** تم التخطيط للانتقال من `any` إلى `unknown` في خطط التطوير السابقة
- سيتم تنفيذ هذا في مرحلة لاحقة حسب خطة التطوير
- الملفات المتأثرة: `developer.types.ts`, `admin.types.ts`, `notification.types.ts`, `office.types.ts`

---

**آخر تحديث:** 2024
**الحالة:** ⚠️ يحتاج إصلاح فوري

