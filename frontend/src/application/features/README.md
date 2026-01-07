# Features - الميزات

كل ميزة تعليمية أو وظيفية لها مجلد مستقل هنا. هذا النمط يسمح بإضافة ميزات جديدة بسرعة ودون تعارض.

## 📁 الهيكلة

```
features/
├── auth/              # المصادقة والأدوار
│   ├── hooks/         # useAuth, useOAuth, useRole
│   ├── services/      # auth.service.ts
│   └── store/         # authStore.ts
├── learning/          # التعلم والدروس
│   ├── hooks/         # useLessons
│   ├── services/      # learning-assistant.service.ts
│   └── store/         # lessonsStore.ts
├── storage/           # التخزين السحابي
│   ├── hooks/         # useStorage
│   ├── services/      # storage-integration.service.ts
│   └── store/         # storageStore.ts
├── notifications/      # الإشعارات
│   ├── hooks/         # useNotifications
│   ├── services/      # notification.service.ts
│   └── store/         # notificationStore.ts
├── admin/             # لوحة تحكم المسؤول
│   ├── hooks/         # useAdmin
│   ├── services/      # admin.service.ts
│   └── store/         # adminStore.ts
├── developer/         # لوحة تحكم المطور
│   ├── hooks/         # useDeveloper
│   ├── services/      # developer.service.ts
│   └── store/         # developerStore.ts
├── projects/          # إدارة المشاريع التعليمية ✅ مكتمل
│   ├── hooks/         # useProjects
│   ├── services/      # project.service.ts
│   └── README.md
└── office/            # توليد ملفات Office ✅ مكتمل
    ├── hooks/         # useOffice
    ├── services/      # office.service.ts
    └── README.md
```

## 🎯 هيكل كل Feature

كل feature يجب أن تحتوي على:

```
feature-name/
├── hooks/          # Custom Hooks خاصة بالميزة
│   ├── useFeature.ts
│   └── index.ts
├── services/       # Services تتواصل مع Backend أو AI
│   ├── feature.service.ts
│   └── index.ts
├── store/          # State Management (Zustand)
│   ├── featureStore.ts
│   └── index.ts
├── types/          # أنواع TypeScript خاصة بالميزة (اختياري)
│   └── feature.types.ts
└── README.md       # وصف الميزة والإرشادات
```

## 📚 الميزات الحالية

### auth/

المصادقة وإدارة المستخدمين:

- **hooks/**: useAuth, useOAuth, useRole
- **services/**: auth.service.ts
- **store/**: authStore.ts

### learning/

التعلم والدروس:

- **hooks/**: useLessons
- **services/**: learning-assistant.service.ts
- **store/**: lessonsStore.ts

### storage/

التخزين السحابي:

- **hooks/**: useStorage
- **services/**: storage-integration.service.ts
- **store/**: storageStore.ts

### notifications/

الإشعارات:

- **hooks/**: useNotifications
- **services/**: notification.service.ts
- **store/**: notificationStore.ts

### admin/

لوحة تحكم المسؤول:

- **hooks/**: useAdmin
- **services/**: admin.service.ts
- **store/**: adminStore.ts

### developer/

لوحة تحكم المطور:

- **hooks/**: useDeveloper
- **services/**: developer.service.ts
- **store/**: developerStore.ts

### projects/

إدارة المشاريع التعليمية الكاملة: ✅ مكتمل

- **hooks/**: useProjects - إدارة حالة المشاريع وتحميلها
- **services/**: project.service.ts - التواصل مع Backend API
- **store/**: projectsStore.ts (مستقبلي)
- راجع `projects/README.md` للتفاصيل

### office/

توليد ملفات Excel/Word/PowerPoint ذكية: ✅ مكتمل

- **hooks/**: useOffice - إدارة توليد الملفات
- **services/**: office.service.ts - التواصل مع Backend API
- **store/**: officeStore.ts (مستقبلي)
- راجع `office/README.md` للتفاصيل

### learning/

التعلم والدروس والتقييمات: ✅ مكتمل

- **hooks/**: useLessons, useAssessments
- **services/**: learning-assistant.service.ts, assessment.service.ts
- **store/**: lessonsStore.ts

## 📋 القواعد

### ✅ ما يجب أن يكون في Feature:

- كل ما يتعلق بميزة واحدة فقط
- Hooks خاصة بالميزة
- Services خاصة بالميزة
- Store خاصة بالميزة
- Types خاصة بالميزة

### ❌ ما لا يجب أن يكون في Feature:

- Logic مشترك بين ميزات متعددة (ضع في `shared/`)
- Services نظامية (ضع في `core/services/system/`)
- Hooks مشتركة (ضع في `shared/hooks/`)

## 🔄 الاستخدام

```typescript
// استخدام hook من feature
import { useAuth } from '@/application/features/auth/hooks'

// استخدام service من feature
import { authService } from '@/application/features/auth/services'

// استخدام store من feature
import { authStore } from '@/application/features/auth/store'
```

## 🎯 إضافة Feature جديدة

1. أنشئ مجلد جديد في `features/`
2. أنشئ المجلدات الفرعية: `hooks/`, `services/`, `store/`
3. أضف `README.md` يشرح الميزة
4. أضف `index.ts` في كل مجلد فرعي للتصدير
5. حدّث `features/README.md` لإضافة الميزة الجديدة

## 📝 ملاحظات

- كل feature مستقل تماماً
- يمكن تطوير features متوازية دون تعارض
- سهولة إزالة أو تعطيل feature
- اختبار معزول لكل feature

---

**آخر تحديث:** يناير 2026
