# Shared - المشترك بين الميزات

يحتوي على كل ما يُستخدم عبر أكثر من feature واحدة.

## 📁 الهيكلة

```
shared/
├── hooks/         # Hooks المشتركة
│   ├── useApp.ts  # Hook مركزي يجمع core hooks
│   └── index.ts
├── types/         # أنواع TypeScript مشتركة
│   ├── common.types.ts
│   └── index.ts
└── store/         # Root Store أو Combined Stores
    ├── rootStore.ts
    └── index.ts
```

## 🎯 المحتويات

### hooks/

Hooks المشتركة بين الميزات:

- **useApp.ts**: Hook مركزي يجمع useAuth, useI18n, useRole من core
- **useErrorBoundary.ts**: Error Boundary Hook (اختياري)
- **useAI.ts**: AI Hook مشترك (اختياري)

### types/

أنواع TypeScript مشتركة:

- **common.types.ts**: أنواع مشتركة (User, Lesson, AIResponse, Project...)
- **api.types.ts**: أنواع API مشتركة (اختياري)

### store/

Root Store أو Combined Stores:

- **rootStore.ts**: Root Store يجمع جميع stores
- **combinedStore.ts**: Combined Store (اختياري)

## 📋 القواعد

### ✅ ما يجب أن يكون هنا:

- Hooks تُستخدم في أكثر من feature واحدة
- Types مشتركة بين features متعددة
- Root Store يجمع جميع stores

### ❌ ما لا يجب أن يكون هنا:

- Hooks خاصة بميزة واحدة (ضع في `features/feature-name/hooks/`)
- Types خاصة بميزة واحدة (ضع في `features/feature-name/types/`)
- Stores خاصة بميزة واحدة (ضع في `features/feature-name/store/`)

## 🔄 الاستخدام

```typescript
// استخدام Hook مشترك
import { useApp } from '@/application/shared/hooks'

// استخدام Type مشترك
import { User, Lesson } from '@/application/shared/types'

// استخدام Root Store
import { rootStore } from '@/application/shared/store'
```

## 📝 ملاحظات

- ضع هنا فقط ما يُستخدم في أكثر من feature واحدة
- إذا كان شيء يُستخدم في feature واحدة فقط، ضعه في feature/
- حافظ على البساطة - لا تضع كل شيء هنا

---

**آخر تحديث:** يناير 2026
