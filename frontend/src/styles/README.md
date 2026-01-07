# Styles - الأنماط والتنسيقات

## 📋 الوصف

مجلد الأنماط يحتوي على جميع ملفات SCSS المتعلقة بالتصميم، الألوان، الثيمات، والمتغيرات المستخدمة في المشروع.

**🎯 الفلسفة الجديدة:**  
_"ألوان مريحة وحديثة مصممة لراحة العين، مع ثيمات مخصصة لكل عمر تجعل التعلم ممتعاً وغير متعب"_

**🔥 التركيز:** 100% على **راحة المستخدم** (User Comfort) - ألوان مريحة للعين، تباين عالي، ثيمات مخصصة لكل فئة عمرية.

## 🏗️ الهيكل

```
styles/
├── _variables.scss        # المتغيرات الأساسية (SCSS Variables)
├── _mixins.scss          # Mixins المساعدة
├── themes/               # الثيمات (CSS Custom Properties)
│   ├── _base.scss       # الثيم الأساسي (Light/Dark Mode)
│   ├── _kids.scss       # ثيم الأطفال
│   ├── _teens.scss      # ثيم المراهقين
│   ├── _adults.scss     # ثيم البالغين
│   ├── _university.scss # ثيم الجامعات
│   └── _index.scss      # تصدير جميع الثيمات
├── global.scss          # الأنماط العامة
└── main.scss           # نقطة الدخول الرئيسية
```

## 📦 المكونات

### 1. `_variables.scss` - المتغيرات الأساسية

**الموقع:** `frontend/src/styles/_variables.scss`

**الوظيفة:**

- يحتوي على جميع المتغيرات SCSS المستخدمة في المشروع
- ألوان النظام (ألوان العلم العماني)
- Typography, Spacing, Shadows, Breakpoints

**الألوان الرئيسية:**

#### ألوان العلم العماني 🇴🇲

```scss
// الأبيض (الشريط العلوي)
$oman-white: #ffffff;

// الأحمر (الشريط الأوسط)
$oman-red: #c8102e; // Official Oman Red
$oman-red-dark: #b01e2e;
$oman-red-light: #e63946;

// الأخضر (الشريط السفلي)
$oman-green: #007a3d; // Official Oman Green
$oman-green-dark: #006b35;
$oman-green-light: #00a050;
```

#### Primary Colors (مبنية على الأحمر العماني)

```scss
$primary-500: #c8102e; // Oman Red (official)
$primary-600: #b01e2e; // Darker red
$primary-700: #991b1b; // Dark red
```

#### Green Colors (مبنية على الأخضر العماني)

```scss
$green-500: #007a3d; // Oman Green (official)
$green-600: #006b35; // Darker green
$green-700: #005c2d; // Dark green
```

**الاستخدام:**

```scss
@use '../../styles/variables' as *;

.my-component {
  color: $primary-500; // استخدام المتغيرات SCSS
  background: $oman-green;
  padding: $spacing-4;
}
```

---

### 2. `themes/_base.scss` - الثيم الأساسي (Light/Dark Mode)

**الموقع:** `frontend/src/styles/themes/_base.scss`

**الوظيفة:**

- يحتوي على CSS Custom Properties للثيمات
- يدعم الوضع الليلي (Dark Mode) والنهاري (Light Mode)
- يستخدم CSS Variables للتبديل الديناميكي بين الثيمات

**الوضع النهاري (Light Mode):**

```scss
.theme-light {
  // Primary Colors (أزرق ناعم ومريح)
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;

  // Background Colors (ناعمة ومريحة للعين - تقليل الوهج)
  --color-bg-primary: #fdfdfd;
  --color-bg-secondary: #f9fafb;
  --color-bg-tertiary: #f3f4f6;

  // Text Colors
  --color-text-primary: #111827;
  --color-text-secondary: #4b5563;
  --color-text-tertiary: #6b7280;

  // Border Colors
  --color-border-primary: #e5e7eb;
  --color-border-secondary: #d1d5db;

  // Status Colors
  --color-success-500: #22c55e;
  --color-warning-500: #f59e0b;
  --color-error-500: #ef4444;

  // Shadows
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

**الوضع الليلي (Dark Mode):**

```scss
.theme-dark {
  // Primary Colors (ألوان أفتح للوضع الليلي)
  --color-primary-500: #60a5fa;
  --color-primary-600: #93c5fd;

  // Background Colors (داكن عميق مريح للعين ليلاً)
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-bg-tertiary: #334155;

  // Text Colors (تباين عالي محسّن - WCAG AAA)
  --color-text-primary: #ffffff;
  --color-text-secondary: #f3f4f6;
  --color-text-tertiary: #e5e7eb;

  // Border Colors
  --color-border-primary: #374151;
  --color-border-secondary: #4b5563;

  // Status Colors
  --color-success-500: #22c55e;
  --color-warning-500: #f59e0b;
  --color-error-500: #ef4444;

  // Shadows (أغمق للوضع الليلي)
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
}
```

**الاستخدام:**

```scss
.my-component {
  // استخدام CSS Custom Properties
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);

  // التبديل التلقائي بين الثيمات
  // عند تغيير class من theme-light إلى theme-dark
}
```

---

### 3. `themes/_kids.scss` - ثيم الأطفال

**الموقع:** `frontend/src/styles/themes/_kids.scss`

**الوظيفة:**

- ثيم مخصص للأطفال
- ألوان زاهية ومبهجة
- خطوط أكبر وأسهل للقراءة

---

### 4. `themes/_teens.scss` - ثيم المراهقين

**الموقع:** `frontend/src/styles/themes/_teens.scss`

**الوظيفة:**

- ثيم مخصص للمراهقين
- ألوان عصرية وحديثة
- تصميم جذاب

---

### 5. `themes/_adults.scss` - ثيم البالغين

**الموقع:** `frontend/src/styles/themes/_adults.scss`

**الوظيفة:**

- ثيم مخصص للبالغين
- ألوان احترافية
- تصميم نظيف وواضح

---

### 6. `themes/_university.scss` - ثيم الجامعات

**الموقع:** `frontend/src/styles/themes/_university.scss`

**الوظيفة:**

- ثيم مخصص للتعليم العالي
- ألوان أكاديمية ومتقدمة
- تصميم احترافي

---

## 🔄 الفرق بين `_variables.scss` و `themes/_base.scss`

### `_variables.scss` (SCSS Variables)

- ✅ **نوع:** SCSS Variables (`$variable-name`)
- ✅ **الاستخدام:** في ملفات SCSS فقط
- ✅ **الوقت:** وقت التجميع (Compile Time)
- ✅ **الغرض:** متغيرات ثابتة، ألوان النظام، spacing، typography

**مثال:**

```scss
@use '../../styles/variables' as *;

.component {
  color: $primary-500; // SCSS Variable
  padding: $spacing-4; // SCSS Variable
}
```

### `themes/_base.scss` (CSS Custom Properties)

- ✅ **نوع:** CSS Custom Properties (`--variable-name`)
- ✅ **الاستخدام:** في CSS و SCSS
- ✅ **الوقت:** وقت التشغيل (Runtime)
- ✅ **الغرض:** ثيمات ديناميكية، تبديل Light/Dark Mode

**مثال:**

```scss
.component {
  background: var(--color-bg-primary); // CSS Custom Property
  color: var(--color-text-primary); // يتغير تلقائياً مع الثيم
}
```

---

## 📝 أفضل الممارسات

### 1. استخدام متغيرات الراحة

```scss
// ✅ جيد - استخدام متغيرات الراحة
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.card {
  @include comfortable-card;
  @include readable-text;
}
```

### 2. استخدام SCSS Variables

```scss
// ✅ جيد - للمتغيرات الثابتة
@use '../../styles/variables' as *;

.button {
  background: var(--color-primary-500);
  padding: $comfort-spacing;
  border-radius: $comfort-radius;
}
```

### 2. استخدام CSS Custom Properties

```scss
// ✅ جيد - للثيمات الديناميكية
.card {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
}
```

### 3. عدم كتابة الألوان يدوياً

```scss
// ❌ سيء
.component {
  color: #c8102e;
  background: #007a3d;
}

// ✅ جيد
.component {
  color: $primary-500; // أو var(--color-primary-500)
  background: $oman-green; // أو var(--color-success-500)
}
```

---

## 🎨 نظام الألوان (مركز على راحة المستخدم)

### الألوان الأساسية

- **Primary (أزرق ناعم):** `#3b82f6` (Light) / `#60a5fa` (Dark) - مريح للعين
- **Success (أخضر لطيف):** `#22c55e` - يشجع دون إرهاق
- **Warning (برتقالي دافئ):** `#f59e0b` - يلفت الانتباه بلطف
- **Error (أحمر هادئ):** `#ef4444` - يحذر دون صدمة

### ألوان الحالة

- **Success:** أخضر (`#22c55e`)
- **Warning:** برتقالي (`#f59e0b`)
- **Error:** أحمر (`#ef4444`)

### ألوان النص

- **Primary Text:** `#111827` (Light) / `#ffffff` (Dark)
- **Secondary Text:** `#4b5563` (Light) / `#e5e7eb` (Dark)
- **Tertiary Text:** `#6b7280` (Light) / `#d1d5db` (Dark)

---

## 🔧 التطبيق

### في React Components

```tsx
// استخدام CSS Modules
import styles from './Component.module.scss'

export const Component = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>عنوان</h1>
    </div>
  )
}
```

### في SCSS Files

```scss
// Component.module.scss
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.container {
  @include comfortable-card;
  background: var(--color-bg-primary);

  .title {
    @include readable-text;
    color: var(--color-text-primary);
  }
}
```

## 🎯 ميزات الراحة (User Comfort Features)

### 1. دعم تفضيلات النظام

- **prefers-color-scheme**: تبديل تلقائي بين Light/Dark Mode
- **prefers-contrast**: دعم التباين العالي تلقائياً

### 2. خطوط عربية مريحة

- استخدام `Noto Sans Arabic` كخط أساسي
- دعم كامل للـ RTL/LTR

### 3. Transitions سريعة

- جميع الـ transitions 150ms بدلاً من 300ms
- استجابة أسرع وأكثر سلاسة

### 4. متغيرات الراحة

- `$comfort-spacing`: مسافات أكبر
- `$comfort-radius`: زوايا أكثر استدارة
- `$comfort-font-size`: خطوط أكبر قليلاً
- `$comfort-line-height`: مسافة أكبر بين الأسطر

---

## ✅ ما يجب أن يكون في هذه الطبقة

### 1. ملفات SCSS

- ✅ المتغيرات (`_variables.scss`)
- ✅ Mixins (`_mixins.scss`)
- ✅ الثيمات (`themes/`)
- ✅ الأنماط العامة (`global.scss`)

### 2. التنظيم

- ✅ استخدام `@use` بدلاً من `@import`
- ✅ استخدام Namespace (`as *`)
- ✅ تجنب الألوان المكتوبة يدوياً

## ❌ ما لا يجب أن يكون في هذه الطبقة

### 1. Business Logic

- ❌ لا يجب وجود منطق برمجي
- ✅ فقط أنماط وتنسيقات

### 2. Component-Specific Styles

- ❌ لا يجب وضع أنماط مكونات محددة هنا
- ✅ يجب أن تكون في `components/[ComponentName]/ComponentName.scss`

---

## 📚 المراجع

- [SCSS Documentation](https://sass-lang.com/documentation)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Design System Best Practices](https://www.designsystems.com/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🆕 التحديثات الأخيرة (User Comfort Focus)

### ✅ التحسينات المطبقة:

1. **زيادة التباين:**
   - النصوص في Dark Mode: `#ffffff` / `#f3f4f6` (WCAG AAA)
   - النصوص في Light Mode: `#111827` / `#4b5563` (WCAG AA)

2. **خلفيات مريحة:**
   - Light Mode: `#fdfdfd` (بدلاً من `#ffffff`) - تقليل الوهج
   - Dark Mode: `#0f172a` (بدلاً من `#111827`) - داكن عميق مريح

3. **تقليل تشبع الألوان:**
   - Kids Theme: `#5b9ef7` (بدلاً من `#4dabf7`) - أقل إرهاقاً
   - Teens Dark: تخفيف الألوان الزاهية

4. **خطوط عربية مريحة:**
   - استخدام `Noto Sans Arabic` كخط أساسي
   - دعم كامل للـ RTL/LTR

5. **Transitions أسرع:**
   - جميع الـ transitions: `150ms` (بدلاً من `300ms`)
   - استجابة أسرع وأكثر سلاسة

6. **متغيرات الراحة:**
   - `$comfort-spacing`: مسافات أكبر
   - `$comfort-radius`: زوايا أكثر استدارة
   - `$comfort-line-height`: `1.7` للقراءة المريحة

7. **دعم تفضيلات النظام:**
   - `prefers-color-scheme`: تبديل تلقائي
   - `prefers-contrast`: دعم التباين العالي

8. **ميكسينز راحة جديدة:**
   - `@mixin comfortable-card`: بطاقة مريحة
   - `@mixin readable-text`: نص قابل للقراءة بسهولة
   - `@mixin smooth-transition`: انتقال سلس

---

## 🔍 الملفات الرئيسية

| الملف                     | الوظيفة                             |
| ------------------------- | ----------------------------------- |
| `_variables.scss`         | المتغيرات الأساسية (SCSS Variables) |
| `themes/_base.scss`       | الثيم الأساسي (Light/Dark Mode)     |
| `themes/_kids.scss`       | ثيم الأطفال                         |
| `themes/_teens.scss`      | ثيم المراهقين                       |
| `themes/_adults.scss`     | ثيم البالغين                        |
| `themes/_university.scss` | ثيم الجامعات                        |
| `_mixins.scss`            | Mixins المساعدة                     |
| `global.scss`             | الأنماط العامة                      |
| `main.scss`               | نقطة الدخول الرئيسية                |
