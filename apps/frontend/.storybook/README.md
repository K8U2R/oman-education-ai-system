# Storybook Documentation - توثيق Storybook

## نظرة عامة

Storybook هو أداة لتطوير واختبار المكونات بشكل منفصل. يساعدنا على:

- **تطوير المكونات بشكل منفصل** عن التطبيق الكامل
- **توثيق المكونات** بشكل تفاعلي
- **اختبار الحالات المختلفة** للمكونات
- **مشاركة المكونات** مع فريق التطوير

## التثبيت والإعداد

تم إعداد Storybook بالفعل في المشروع. يمكنك تشغيله باستخدام:

```bash
npm run storybook
```

سيتم فتح Storybook على `http://localhost:6006`

## البنية

```
.storybook/
├── main.ts          # تكوين Storybook الرئيسي
├── preview.ts       # تكوين العرض والـ decorators
└── README.md        # هذا الملف

src/
└── presentation/
    └── components/
        └── common/
            ├── Button/
            │   ├── Button.tsx
            │   └── Button.stories.tsx    # Stories للزر
            ├── Card/
            │   ├── Card.tsx
            │   └── Card.stories.tsx      # Stories للبطاقة
            └── Input/
                ├── Input.tsx
                └── Input.stories.tsx     # Stories لحقل الإدخال
```

## إضافة Story جديد

لإضافة Story جديد لمكون:

1. **أنشئ ملف `ComponentName.stories.tsx`** بجانب المكون:

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import ComponentName from './ComponentName'

const meta: Meta<typeof ComponentName> = {
  title: 'Components/Category/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'وصف المكون',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // تعريف الـ controls
  },
}

export default meta
type Story = StoryObj<typeof ComponentName>

export const Default: Story = {
  args: {
    // القيم الافتراضية
  },
}
```

2. **أضف Stories مختلفة** للحالات المختلفة:

```typescript
export const Variants: Story = {
  render: () => (
    <div>
      <ComponentName variant="primary" />
      <ComponentName variant="secondary" />
    </div>
  ),
}
```

## المكونات المتاحة

### Components/Common

- **Button** - مكون الزر مع جميع الأنماط والأحجام
- **Card** - مكون البطاقة مع أنماط مختلفة
- **Input** - مكون حقل الإدخال مع دعم الأخطاء والأيقونات

## الميزات المدعومة

### RTL Support

Storybook يدعم RTL بشكل كامل. يمكنك التبديل بين LTR و RTL من شريط الأدوات.

### Controls

جميع المكونات تدعم Controls التفاعلية لتغيير الخصائص مباشرة.

### Actions

يمكنك تتبع الأحداث (مثل onClick) في لوحة Actions.

### Accessibility

تم تفعيل `@storybook/addon-a11y` للتحقق من إمكانية الوصول.

### Docs

جميع المكونات موثقة تلقائياً باستخدام `tags: ['autodocs']`.

## أفضل الممارسات

### 1. تسمية Stories

استخدم أسماء واضحة ووصفية:

```typescript
export const Default: Story = { ... }
export const WithError: Story = { ... }
export const LoadingState: Story = { ... }
```

### 2. تنظيم Stories

نظم Stories حسب الفئة:

```typescript
title: 'Components/Common/Button'
title: 'Components/Layout/Sidebar'
title: 'Pages/User/Dashboard'
```

### 3. استخدام Parameters

استخدم `parameters` لتوفير معلومات إضافية:

```typescript
parameters: {
  docs: {
    description: {
      story: 'وصف تفصيلي للـ Story',
    },
  },
}
```

### 4. استخدام Decorators

استخدم decorators لتطبيق أنماط مشتركة:

```typescript
decorators: [
  (Story) => (
    <div style={{ padding: '2rem' }}>
      <Story />
    </div>
  ),
]
```

## بناء Storybook للإنتاج

لإنشاء نسخة إنتاج من Storybook:

```bash
npm run build-storybook
```

سيتم إنشاء الملفات في مجلد `storybook-static/`.

## الإضافات (Addons)

### المثبتة حالياً

- `@storybook/addon-onboarding` - دليل البدء
- `@storybook/addon-links` - ربط Stories
- `@storybook/addon-essentials` - أدوات أساسية
- `@storybook/addon-interactions` - اختبار التفاعلات
- `@storybook/addon-a11y` - فحص إمكانية الوصول
- `@storybook/addon-docs` - التوثيق التلقائي

## استكشاف الأخطاء

### المكونات لا تظهر

- تأكد من أن الملف `.stories.tsx` موجود بجانب المكون
- تحقق من أن `title` في Meta صحيح
- تأكد من أن المكون مُصدّر بشكل صحيح

### الأنماط لا تعمل

- تأكد من استيراد ملفات SCSS في المكون
- تحقق من أن `viteFinal` في `main.ts` يحتوي على تكوين SCSS

### الأخطاء في TypeScript

- تأكد من أن `tsconfig.json` يحتوي على مسارات الـ aliases
- تحقق من أن `viteFinal` في `main.ts` يحتوي على `resolve.alias`

## المراجع

- [Storybook Documentation](https://storybook.js.org/docs)
- [React Storybook](https://storybook.js.org/docs/react/get-started/introduction)
- [Addons](https://storybook.js.org/docs/react/addons/introduction)
