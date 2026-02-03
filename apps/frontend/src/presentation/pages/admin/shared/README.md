# 🎨 Admin Shared Layer

**آخر تحديث:** 2024

---

## 📁 الهيكل

```
shared/
├── components/         # المكونات المشتركة
│   ├── AdminLoadingState/
│   └── AdminErrorState/
└── styles/             # الأنماط المشتركة
    ├── _admin-variables.scss
    ├── _admin-mixins.scss
    ├── admin-base.scss
    └── index.scss
```

---

## 🧩 Components

### `AdminLoadingState`

حالة التحميل الموحدة.

```typescript
<AdminLoadingState
  message="جاري التحميل..."
  fullScreen
/>
```

### `AdminErrorState`

حالة الخطأ الموحدة.

```typescript
<AdminErrorState
  title="حدث خطأ"
  message={error}
  onRetry={refresh}
/>
```

---

## 🎨 Styles

### المتغيرات (`_admin-variables.scss`)

```scss
// Colors
$admin-primary: $primary-600;
$admin-background: $background-primary;

// Spacing
$admin-spacing-base: $spacing-4;

// Transitions
$admin-transition-base: 0.2s ease;
```

### Mixins (`_admin-mixins.scss`)

```scss
@mixin admin-card {
  padding: $spacing-4;
  border-radius: $border-radius-md;
  background: $background-primary;
  border: 1px solid $border-color;
}
```

### الاستخدام

```scss
@use '../../../shared/styles' as *;

.my-component {
  @include admin-card;
  padding: $admin-spacing-base;
}
```

---

## 📖 أمثلة الاستخدام

### في صفحة

```typescript
import { AdminLoadingState, AdminErrorState } from '../../shared/components'

if (loading) return <AdminLoadingState />
if (error) return <AdminErrorState onRetry={refresh} />
```

### في SCSS

```scss
@use '../../../shared/styles' as *;

.page {
  @include admin-card;
  margin: $admin-spacing-base;
}
```

---

**آخر تحديث:** 2024
