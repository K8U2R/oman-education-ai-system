# Pages Directory - مجلد الصفحات

## 📁 الهيكل التنظيمي

```
pages/
├── public/                   # الصفحات العامة (لا تحتاج مصادقة)
│   ├── HomePage.tsx         # الصفحة الرئيسية
│   ├── legal/               # الصفحات القانونية
│   │   ├── TermsPage.tsx
│   │   └── PrivacyPolicyPage.tsx
│   └── README.md
│
├── auth/                     # صفحات المصادقة
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── VerifyEmailPage.tsx
│   ├── components/           # مكونات المصادقة
│   └── README.md
│
├── user/                     # صفحات المستخدم
│   ├── DashboardPage.tsx
│   ├── ProfilePage.tsx
│   ├── SettingsPage.tsx
│   ├── UserSecuritySettingsPage.tsx
│   └── SubscriptionPage.tsx
│
├── learning/                 # صفحات التعلم
│   ├── LessonsPage.tsx
│   ├── LessonDetailPage.tsx
│   ├── AssessmentsPage.tsx
│   └── ...
│
├── projects/                 # صفحات المشاريع
│   ├── ProjectsPage.tsx
│   ├── ProjectDetailPage.tsx
│   └── ProjectFormPage.tsx
│
├── content/                  # إدارة المحتوى (Teachers & Admins)
│   ├── LessonsManagementPage.tsx
│   ├── LessonFormPage.tsx
│   └── LearningPathsManagementPage.tsx
│
├── tools/                    # أدوات النظام
│   ├── CodeGeneratorPage.tsx
│   ├── OfficeGeneratorPage.tsx
│   ├── StoragePage.tsx
│   └── StorageBrowserPage.tsx
│
├── admin/                    # صفحات المسؤول
│   ├── AdminDashboardPage.tsx
│   ├── UsersManagementPage.tsx
│   ├── analytics/           # تحليلات النظام
│   └── security/             # أمان النظام
│
├── developer/                # صفحات المطور
│   └── security/             # تحليلات ومراقبة الأمان
│
├── support/                  # صفحات الدعم
│   └── security/             # دعم الأمان
│
├── errors/                   # صفحات الأخطاء (منظمة بشكل متقدم)
│   ├── pages/               # صفحات الأخطاء المحددة
│   ├── components/          # مكونات قابلة لإعادة الاستخدام
│   ├── hooks/               # Custom Hooks
│   ├── utils/               # Utilities
│   └── README.md
│
└── components/               # مكونات مشتركة للصفحات
    ├── PageHeader.tsx
    ├── LoadingState.tsx
    ├── ErrorState.tsx
    └── EmptyState.tsx
```

## 🎯 مبادئ التنظيم

### 1. **التجميع حسب الوظيفة**

كل مجلد يحتوي على صفحات ذات وظيفة مشتركة:

- `public/`: صفحات عامة متاحة للجميع
- `auth/`: صفحات المصادقة
- `user/`: صفحات المستخدم الشخصية
- `learning/`: صفحات التعلم
- `admin/`: صفحات الإدارة
- إلخ...

### 2. **التنظيم الهرمي**

- الصفحات الرئيسية في المجلد المباشر
- الصفحات الفرعية في مجلدات فرعية (مثل `admin/analytics/`)
- المكونات المشتركة في `components/`

### 3. **Barrel Exports**

كل مجلد يحتوي على `index.ts` للـ exports المركزية:

```typescript
// استيراد من مجلد
import { LoginPage, RegisterPage } from '@/presentation/pages/auth'
```

### 4. **Documentation**

المجلدات الكبيرة تحتوي على `README.md` يشرح:

- الهيكل التنظيمي
- الهدف من المجلد
- كيفية الاستخدام

## 📦 أنواع الصفحات

### Public Pages (صفحات عامة)

- متاحة للجميع بدون مصادقة
- موجودة في `public/`
- مثال: `HomePage`, `TermsPage`

### Auth Pages (صفحات المصادقة)

- صفحات تسجيل الدخول والتسجيل
- موجودة في `auth/`
- مثال: `LoginPage`, `RegisterPage`, `VerifyEmailPage`

### Protected Pages (صفحات محمية)

- تحتاج مصادقة
- منظمة حسب الدور و
- موجودة في `user/`, `learning/`, `admin/`, إلخ...

### Error Pages (صفحات الأخطاء)

- منظمة بشكل متقدم في `errors/`
- تستخدم `BaseErrorPage` لتقليل التكرار
- راجع `errors/README.md` للتفاصيل

## 🔗 الاستيراد

### استيراد صفحة واحدة

```typescript
import { LoginPage } from '@/presentation/pages/auth'
import { HomePage } from '@/presentation/pages/public'
```

### استيراد من مجلد فرعي

```typescript
import { TermsPage } from '@/presentation/pages/public/legal'
```

### استيراد مكونات مشتركة

```typescript
import { PageHeader, LoadingState } from '@/presentation/pages/components'
```

## ✅ معايير الجودة

1. **TypeScript Strict Mode**: جميع الصفحات تستخدم TypeScript بشكل صارم
2. **SCSS Modules**: استخدام `@use` للمتغيرات والميكسنز
3. **Clean Architecture**: فصل الـ Domain و Application و Infrastructure
4. **Documentation**: JSDoc comments لكل صفحة
5. **Error Handling**: معالجة الأخطاء بشكل موحد
6. **Accessibility**: دعم RTL وإمكانية الوصول

## 🚀 إضافة صفحة جديدة

1. **حدد المجلد المناسب** حسب الوظيفة
2. **أنشئ الملفات**:
   - `PageName.tsx` - المكون الرئيسي
   - `PageName.scss` - الأنماط
3. **أضف إلى `index.ts`** للـ barrel export
4. **أضف Route** في `routing/core/routes/`
5. **أضف Metadata** في `routing/core/routes/metadata/`

## 📝 ملاحظات

- **errors/**: منظمة بشكل متقدم مع `BaseErrorPage` و `useErrorPageSetup`
- **auth/**: تحتوي على صفحات المصادقة ومكوناتها
- **public/**: تحتوي على الصفحات العامة والصفحات القانونية
- **components/**: مكونات مشتركة تستخدم في عدة صفحات
