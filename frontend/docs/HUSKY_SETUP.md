# 🔧 إعداد Husky و Prettier - دليل شامل

## 📋 نظرة عامة

تم إعداد نظام متكامل لضمان جودة الكود تلقائياً قبل كل commit و push.

## 🎯 المكونات

### 1. **Husky Hooks**

#### `.husky/pre-commit`
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run type checking (fast check)
npm run type-check

# Run lint-staged (formats and lints only staged files)
npx lint-staged
```

**ما يفعله:**
- ✅ يتحقق من TypeScript types قبل الـ commit
- ✅ يشغل `lint-staged` على الملفات المعدلة فقط (أسرع بكثير)

#### `.husky/pre-push`
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run full validation before push
npm run validate
```

**ما يفعله:**
- ✅ يشغل فحص كامل (type-check + lint + format-check + tests) قبل الـ push

### 2. **Lint-Staged Configuration** (`.lintstagedrc`)

```json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,scss,css}": [
    "prettier --write"
  ]
}
```

**ما يفعله:**
- ✅ يعمل على الملفات المعدلة فقط (ليس كل المشروع)
- ✅ يصلح ESLint errors تلقائياً
- ✅ ينسق الكود مع Prettier تلقائياً

### 3. **Prettier Ignore** (`.prettierignore`)

```
node_modules
dist
build
.vite
*.min.js
*.min.css
package-lock.json
yarn.lock
pnpm-lock.yaml
```

## 🚀 كيفية العمل

### عند `git commit`:

1. **Type Check**: يتحقق من TypeScript types
2. **Lint-Staged**: 
   - يصلح ESLint errors تلقائياً
   - ينسق الملفات مع Prettier تلقائياً
   - يعمل فقط على الملفات المعدلة (staged files)

### عند `git push`:

1. **Full Validation**: 
   - Type Check
   - Lint Check
   - Format Check
   - Tests

## ✅ الفوائد

1. **جودة الكود**: لا يمكن commit كود به أخطاء
2. **التنسيق الموحد**: جميع الملفات منسقة تلقائياً
3. **الأداء**: `lint-staged` يعمل على الملفات المعدلة فقط (أسرع بكثير)
4. **السهولة**: لا حاجة لتشغيل `npm run format` يدوياً

## 🔍 التحقق من الإعداد

```bash
# التحقق من Prettier
npm run format:check

# التحقق من ESLint
npm run lint

# التحقق الكامل
npm run validate
```

## 🛠️ استكشاف الأخطاء

### إذا لم تعمل Husky hooks:

```bash
# إعادة تهيئة Husky
npx husky init

# أو إعادة تثبيت
npm install
```

### إذا كان Prettier لا يعمل:

```bash
# تنسيق ملف معين
npx prettier --write "path/to/file.ts"

# تنسيق كل الملفات
npm run format
```

## 📝 ملاحظات مهمة

1. **لا تقم بتعطيل hooks**: الـ hooks موجودة لضمان جودة الكود
2. **استخدم `--no-verify` بحذر**: فقط في حالات الطوارئ
3. **تأكد من تشغيل `npm install`**: بعد clone المشروع

---

**آخر تحديث**: تم إعداد هذا النظام في [التاريخ الحالي]

