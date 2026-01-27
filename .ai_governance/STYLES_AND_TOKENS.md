# الدستور البصري (STYLES_AND_TOKENS.md) 🎨📜

> **المرجعية:** القانون 06 (Design Tokens) والقانون 10 (السيادة السياقية).

## 1. المقدمة (Introduction)

هذا الملف يحدد "عقد التصميم" (Visual Contract) بين المصممين والمطورين. يُمنع منعاً باتاً استخدام القيم الثابتة (Hardcoded Values) أو الـ Inline Styles. يجب استخدام رموز Tailwind المعرفة أدناه لضمان دعم الثيمات (Dark/Light) والشخصيات (University/Children).

---

## 2. لوحة الألوان السيادية (Color Palette)

تعتمد الألوان على نظام OKLCH وتتغير ديناميكياً بناءً على الـ Class المطبق (`.theme-university`, `.theme-children`) والوضع (`.dark-mode`).

| اسم الرمز (Token Name) | متغير CSS | وظيفة الرمز (Function) | Tailwind Class |
| :--- | :--- | :--- | :--- |
| **Primary Main** | `--color-primary` | اللون الأساسي للهوية | `text-primary` / `bg-primary` / `border-primary` |
| **Secondary** | `--color-secondary` | عناصر ثانوية، تمييز | `text-secondary` / `bg-secondary` |
| **Background App** | `--color-bg-app` | خلفية التطبيق العامة | (غير معرف في Tailwind مباشرة، استخدم `bg-bg-primary`) |
| **Background Primary** | `--color-bg-primary` | الخلفية الأساسية للصفحة | `bg-bg-primary` |
| **Background Secondary** | `--color-bg-secondary` | خلفية البطاقات والأشرطة | `bg-bg-secondary` |
| **Background Tertiary** | `--color-bg-tertiary` | خلفيات فرعية (Hover) | `bg-bg-tertiary` |
| **Text Primary** | `--color-text-primary` | العناوين والنص الأساسي | `text-text-primary` |
| **Text Secondary** | `--color-text-secondary` | الوصف والنصوص الفرعية | `text-text-secondary` |
| **Text Tertiary** | `--color-text-tertiary` | الهوامش والملاحظات | `text-text-tertiary` |
| **Border Primary** | `--color-border-primary` | الحدود الأساسية | `border-border-primary` |
| **Error / Danger** | `--color-error` | رسائل الخطأ، الحذف | `text-[color:var(--color-error)]` * |
| **Success** | `--color-success` | رسائل النجاح | `text-[color:var(--color-success)]` * |

---

## 3. رموز المكونات المتقدمة (Advanced Component Tokens)

تم توسيع النظام ليشمل متغيرات خاصة بمناطق الواجهة الرئيسية لضمان التناسق التام.

### 🍱 القوائم والنوافذ (Menus & Modals)

| اسم الرمز | متغير CSS | Tailwind Class |
| :--- | :--- | :--- |
| **Menu Background** | `--color-bg-menu` | `bg-menu` |
| **Modal Background** | `--color-bg-modal-surface` | `bg-modal` |
| **Header Background** | `--color-bg-header` | `bg-header` |
| **Footer Background** | `--color-bg-footer` | `bg-footer` |

### 🗄️ الشريط الجانبي (Sidebar)

| اسم الرمز | متغير CSS | Tailwind Class |
| :--- | :--- | :--- |
| **Sidebar BG** | `--color-bg-sidebar` | `bg-sidebar` |
| **Sidebar Border** | `--color-border-sidebar` | `border-[color:var(--color-border-sidebar)]` |
| **Item Text** | `--color-text-sidebar-item` | `text-[color:var(--color-text-sidebar-item)]` |
| **Item Hover** | `--color-bg-sidebar-item-hover` | `hover:bg-[color:var(--color-bg-sidebar-item-hover)]` |

*> ملاحظة: الألوان الدلالية (Error, Success) معرفة كمتغيرات CSS global في `_tokens.scss` ولكن لم يتم ربطها بـ Tailwind Utility مباشرة في `tailwind.config.js` إلا عبر الـ Arbitrary Values أو يجب إضافتها للكونفيج. حالياً نستخدم الـ Arbitrary Syntax المسموح به: `text-[color:var(--color-error)]`.*

*> ملاحظة: الألوان الدلالية (Error, Success) معرفة كمتغيرات CSS global في `_tokens.scss` ولكن لم يتم ربطها بـ Tailwind Utility مباشرة في `tailwind.config.js` إلا عبر الـ Arbitrary Values أو يجب إضافتها للكونفيج. حالياً نستخدم الـ Arbitrary Syntax المسموح به: `text-[color:var(--color-error)]`.*

---

## 3. المسافات والقياسات (Spacing & Layout)

| المتغير | القيمة | Tailwind Class |
| :--- | :--- | :--- |
| `--space-xs` | 0.25rem | `p-1`, `m-1`, `gap-1` |
| `--space-sm` | 0.5rem | `p-2`, `m-2`, `gap-2` |
| `--space-md` | 1rem | `p-4`, `m-4`, `gap-4` |
| `--space-lg` | 1.5rem | `p-6`, `m-6`, `gap-6` |
| `--space-xl` | 3rem | `p-12`, `m-12` |

---

## 4. الطباعة (Typography)

* **Alpha/Heading:** Clash Grotesk (University), Fredoka (Children).
* **Beta/Body:** Inter/Cairo (All).

---

## 5. قواعد التنفيذ (Enforcement Rules)

1. ⛔ **Inline Styles:** ممنوعة تماماً للألوان والمسافات.
    * *خطأ:* `style={{ color: 'var(--color-primary)' }}`
    * *صح:* `className="text-primary"`
2. ⛔ **Hex Codes:** ممنوع استخدام `#ffffff` أو `#000000`.
3. ✅ **Tailwind Arbitrary:** مسموح به للمتغيرات غير المربوطة: `bg-[color:var(--color-bg-surface)]`.

> **تم التحديث:** 2026/01/26
