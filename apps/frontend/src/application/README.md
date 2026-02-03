# Application Layer - طبقة التطبيق (Frontend)

> **آخر تحديث:** يناير 2026  
> **الإصدار:** 2.0.0 - الهيكلة الجديدة (Feature-Based Architecture)

طبقة التطبيق في Frontend تحتوي على منطق التطبيق و State Management. هذه الطبقة تربط بين Domain Layer و Presentation Layer، وتحتوي على Services، Stores (State Management)، و Custom Hooks التي تدير حالة التطبيق والتفاعل مع APIs.

## 🏗️ الهيكلة الجديدة (2026)

```
application/
├── core/              # النواة النظامية (انظر core/README.md)
│   ├── interceptors/ # معالجات HTTP
│   ├── services/     # خدمات النظام (system, ui)
│   └── utils/        # دوال مساعدة عامة
├── features/          # الميزات المستقلة (انظر features/README.md)
│   ├── auth/         # المصادقة والأدوار
│   ├── learning/     # التعلم والدروس
│   ├── storage/      # التخزين السحابي
│   ├── notifications/# الإشعارات
│   ├── admin/        # لوحة تحكم المسؤول
│   ├── developer/    # لوحة تحكم المطور
│   ├── projects/     # إدارة المشاريع ✅ مكتمل
│   └── office/       # توليد ملفات Office ✅ مكتمل
├── shared/            # المشترك بين الميزات (انظر shared/README.md)
│   ├── hooks/        # Hooks مشتركة (useApp)
│   ├── types/        # أنواع TypeScript مشتركة
│   └── store/        # Root Store
└── index.ts           # تصدير مركزي
```

## 🎯 فوائد الهيكلة الجديدة

### ✅ إضافة ميزات جديدة بسرعة وأمان

- كل feature مستقل تماماً
- لا تعارض بين الميزات
- سهولة إضافة ميزة جديدة

### ✅ تطوير متوازي دون تعارض

- يمكن تطوير features متوازية
- اختبار معزول لكل feature
- صيانة أسهل

### ✅ صيانة واختبار أسهل

- كل feature في مكانها
- سهولة إزالة أو تعطيل feature
- اختبار معزول

### ✅ استعداد كامل لتوسع الذكاء الاصطناعي

- الهيكلة جاهزة لإضافة AI في أي feature
- تكامل سهل مع AI Services
- ميزات تعليمية معقدة

## 📚 الأقسام الرئيسية

### 1. Core - النواة النظامية

**الموقع:** `core/`

**المحتوى:**

- **interceptors/**: معالجات HTTP (auth, offline, error, ai-logging)
- **services/system/**: خدمات النظام (cache, offline, error-handling, analytics, performance)
- **services/ui/**: خدمات واجهة المستخدم (theme, i18n, validation, search)
- **utils/**: دوال مساعدة عامة

**القاعدة:** كل ما هو مشترك بين جميع الميزات ولا يتغير مع إضافة ميزات جديدة.

**راجع:** `core/README.md` للتفاصيل الكاملة

---

### 2. Features - الميزات

**الموقع:** `features/`

**المحتوى:**

- كل feature لها مجلد مستقل
- كل feature تحتوي على: `hooks/`, `services/`, `store/`
- ميزات مستقلة تماماً

**الميزات الحالية:**

- **auth/**: المصادقة والأدوار
- **learning/**: التعلم والدروس
- **storage/**: التخزين السحابي
- **notifications/**: الإشعارات
- **admin/**: لوحة تحكم المسؤول
- **developer/**: لوحة تحكم المطور

**الميزات المستقبلية:**

- **projects/**: إدارة المشاريع التعليمية
- **office/**: توليد ملفات Office ذكية

**القاعدة:** كل ما يتعلق بميزة واحدة فقط.

**راجع:** `features/README.md` للتفاصيل الكاملة

---

### 3. Shared - المشترك

**الموقع:** `shared/`

**المحتوى:**

- **hooks/**: Hooks مشتركة (useApp)
- **types/**: أنواع TypeScript مشتركة
- **store/**: Root Store

**القاعدة:** ما يُستخدم في أكثر من feature واحدة.

**راجع:** `shared/README.md` للتفاصيل الكاملة

---

## 🔄 التدفق (Flow)

```
Presentation Layer (Components)
    ↓ (Uses)
Application Layer
    ├── shared/hooks/useApp     → Hook مركزي
    ├── features/*/hooks/        → Hooks خاصة بالميزات
    ├── features/*/services/    → Services خاصة بالميزات
    └── features/*/store/       → Stores خاصة بالميزات
    ↓ (Uses)
Core Layer
    ├── core/interceptors/      → معالجات HTTP
    ├── core/services/          → خدمات النظام
    └── core/utils/            → دوال مساعدة
    ↓ (Uses)
Infrastructure Layer (API Client)
    ↓ (Calls)
Backend API
```

## 📝 أمثلة الاستخدام

### استخدام Hook مركزي

```typescript
import { useApp } from '@/application/shared/hooks'

const MyComponent = () => {
  const { user, isAuthenticated, login, logout, language, changeLanguage, isAdmin, hasPermission } =
    useApp()

  // ...
}
```

### استخدام Hook من Feature

```typescript
import { useAuth } from '@/application/features/auth/hooks'
import { useLessons } from '@/application/features/learning/hooks'

const MyComponent = () => {
  const { user, login } = useAuth()
  const { lessons, loadLessons } = useLessons()

  // ...
}
```

### استخدام Service من Feature

```typescript
import { authService } from '@/application/features/auth/services'
import { learningService } from '@/application/features/learning/services'

const handleAction = async () => {
  const user = await authService.getCurrentUser()
  const lessons = await learningService.getLessons()
}
```

### استخدام Core Service

```typescript
import { cacheService } from '@/application/core/services/system'
import { i18nService } from '@/application/core/services/ui'

const handleCache = () => {
  cacheService.set('key', 'value')
  const language = i18nService.getLanguage()
}
```

## ✅ ما يجب أن يكون في هذه الطبقة

### 1. Business Logic

- منطق التطبيق
- State Management
- Data Transformation

### 2. API Communication

- HTTP Requests
- API Calls
- Response Handling

### 3. State Management

- Global State (Stores)
- Local State Management
- State Updates

### 4. Custom Hooks

- Reusable Logic
- State Management Hooks
- Effect Hooks

### 5. Data Processing

- Data Transformation
- Data Validation
- Data Formatting

### 6. Error Handling

- Error Management
- Error Recovery
- User-friendly Error Messages

## ❌ ما لا يجب أن يكون في هذه الطبقة

### 1. UI Components

- ❌ لا يجب وجود React Components
- ✅ يجب أن تكون في Presentation Layer

### 2. Styling

- ❌ لا يجب وجود CSS/SCSS
- ✅ يجب أن يكون في Presentation Layer

### 3. Routing

- ❌ لا يجب وجود Routing Logic
- ✅ يجب أن يكون في Presentation Layer

### 4. Direct DOM Manipulation

- ❌ لا يجب التلاعب بالـ DOM مباشرة
- ✅ يجب استخدام React APIs

### 5. Browser APIs

- ❌ لا يجب استخدام Browser APIs مباشرة
- ✅ يجب استخدام Infrastructure Layer

### 6. Domain Models

- ❌ لا يجب تعريف Domain Entities هنا
- ✅ يجب استخدام Domain Models من Domain Layer

## 🧪 الاختبار

- كل Service يجب أن يكون له Unit Tests
- كل Store يجب أن يكون له Unit Tests
- كل Hook يجب أن يكون له Unit Tests
- استخدام Mocks للـ API Calls
- اختبار Error Scenarios

## 📚 المراجع

- **Core**: راجع `core/README.md`
- **Features**: راجع `features/README.md`
- **Shared**: راجع `shared/README.md`
- **Hooks**: راجع `hooks/README.md` (الهيكلة القديمة - قيد التحديث)

## 🚀 إضافة Feature جديدة

1. أنشئ مجلد جديد في `features/`
2. أنشئ المجلدات الفرعية: `hooks/`, `services/`, `store/`
3. أضف `README.md` يشرح الميزة
4. أضف `index.ts` في كل مجلد فرعي للتصدير
5. حدّث `features/README.md` لإضافة الميزة الجديدة

## 📝 ملاحظات

- الهيكلة الجديدة تجعل إضافة ميزات جديدة أسهل وأسرع
- كل feature مستقل تماماً
- سهولة الصيانة والاختبار
- استعداد كامل للتوسع المستقبلي

---

**آخر تحديث:** يناير 2026  
**الإصدار:** 2.0.0
