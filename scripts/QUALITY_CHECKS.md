# 🔍 أوامر فحص الجودة الشاملة - Quality Check Commands

> **آخر تحديث:** يناير 2026  
> **الإصدار:** 2.0.0

دليل شامل لأفضل الأوامر للتحقق من الأخطاء والتحذيرات في أي قسم من المشروع.

---

## 📋 جدول المحتويات

1. [أوامر سريعة](#أوامر-سريعة)
2. [Frontend Checks](#frontend-checks)
3. [Backend Checks](#backend-checks)
4. [سكريبتات مخصصة](#سكريبتات-مخصصة)
5. [فحص قسم محدد](#فحص-قسم-محدد)
6. [سير العمل الموصى به](#سير-العمل-الموصى-به)

---

## ⚡ أوامر سريعة

### Frontend - فحص شامل (Recommended)

```bash
cd frontend
npm run check
```

### Frontend - فحص مع إصلاح تلقائي

```bash
cd frontend
npm run check:fix
```

### Backend - فحص شامل

```bash
cd backend
npm run type-check && npm run build
```

### استخدام السكريبتات المخصصة

**Windows (PowerShell):**
```powershell
.\scripts\check-quality.ps1 frontend
.\scripts\check-quality.ps1 backend
.\scripts\check-quality.ps1 all
.\scripts\check-quality.ps1 frontend -Fix
```

**Linux/Mac (Bash):**
```bash
chmod +x scripts/check-quality.sh
./scripts/check-quality.sh frontend
./scripts/check-quality.sh backend
./scripts/check-quality.sh all
./scripts/check-quality.sh frontend --fix
```

---

## 🎨 Frontend Checks

### 1. TypeScript Type Checking

```bash
cd frontend
npm run type-check
```

**الوصف:** يفحص جميع أخطاء الأنواع في TypeScript

**متى تستخدمه:**
- بعد إضافة أو تعديل أي ملف TypeScript
- قبل Commit
- عند مواجهة أخطاء في الأنواع

---

### 2. ESLint - فحص جودة الكود

```bash
cd frontend
npm run lint
```

**الوصف:** يفحص جودة الكود ويبحث عن:
- أخطاء في الكود
- تحذيرات
- مشاكل في الأسلوب البرمجي
- استخدام `any` types
- متغيرات غير مستخدمة

**إصلاح تلقائي:**
```bash
cd frontend
npm run lint:fix
```

**متى تستخدمه:**
- بعد كتابة أي كود جديد
- قبل Commit
- عند مواجهة تحذيرات ESLint

---

### 3. Prettier - فحص التنسيق

```bash
cd frontend
npm run format:check
```

**الوصف:** يفحص تنسيق الملفات (مسافات، أسطر، etc.)

**تنسيق تلقائي:**
```bash
cd frontend
npm run format
```

**متى تستخدمه:**
- بعد تعديل أي ملف
- قبل Commit
- عند مواجهة مشاكل في التنسيق

---

### 4. فحص شامل (TypeScript + ESLint + Prettier)

```bash
cd frontend
npm run check
```

**الوصف:** يفحص كل شيء دفعة واحدة

**إصلاح شامل:**
```bash
cd frontend
npm run check:fix
```

**متى تستخدمه:**
- قبل Commit
- بعد الانتهاء من تطوير قسم معين
- قبل Push

---

### 5. Build Check - فحص البناء

```bash
cd frontend
npm run build
```

**الوصف:** يحاول بناء المشروع للتحقق من عدم وجود أخطاء

**متى تستخدمه:**
- قبل Deploy
- بعد تغييرات كبيرة
- للتحقق من أن كل شيء يعمل

---

### 6. Validate - فحص شامل + اختبارات

```bash
cd frontend
npm run validate
```

**الوصف:** يفحص TypeScript + ESLint + Prettier + Tests

**متى تستخدمه:**
- قبل Deploy
- قبل Merge Request
- للتحقق النهائي

---

## 🔧 Backend Checks

### 1. TypeScript Type Checking

```bash
cd backend
npm run type-check
```

**أو:**
```bash
cd backend
npx tsc --noEmit
```

**الوصف:** يفحص جميع أخطاء الأنواع في TypeScript

---

### 2. ESLint

```bash
cd backend
npm run lint
```

**إصلاح تلقائي:**
```bash
cd backend
npm run lint:fix
```

---

### 3. Build Check

```bash
cd backend
npm run build
```

**الوصف:** يبني المشروع للتحقق من عدم وجود أخطاء

---

### 4. فحص شامل Backend

```bash
cd backend
npm run type-check && npm run lint && npm run build
```

---

## 🛠️ سكريبتات مخصصة

### Windows PowerShell

#### فحص Frontend
```powershell
.\scripts\check-quality.ps1 frontend
```

#### فحص Frontend مع إصلاح
```powershell
.\scripts\check-quality.ps1 frontend -Fix
```

#### فحص Backend
```powershell
.\scripts\check-quality.ps1 backend
```

#### فحص كل شيء
```powershell
.\scripts\check-quality.ps1 all
```

---

### Linux/Mac Bash

#### إعطاء صلاحيات (مرة واحدة)
```bash
chmod +x scripts/check-quality.sh
```

#### فحص Frontend
```bash
./scripts/check-quality.sh frontend
```

#### فحص Frontend مع إصلاح
```bash
./scripts/check-quality.sh frontend --fix
```

#### فحص Backend
```bash
./scripts/check-quality.sh backend
```

#### فحص كل شيء
```bash
./scripts/check-quality.sh all
```

---

## 📁 فحص قسم محدد

### فحص مجلد معين في Frontend

#### TypeScript لمجلد محدد
```bash
cd frontend
npx tsc --noEmit --include "src/presentation/routing/**/*"
```

#### ESLint لمجلد محدد
```bash
cd frontend
npx eslint "src/presentation/routing/**/*.{ts,tsx}"
```

#### Prettier لمجلد محدد
```bash
cd frontend
npx prettier --check "src/presentation/routing/**/*.{ts,tsx,scss}"
```

#### فحص شامل لمجلد محدد
```bash
cd frontend

# TypeScript
npx tsc --noEmit --include "src/presentation/routing/**/*"

# ESLint
npx eslint "src/presentation/routing/**/*.{ts,tsx}"

# Prettier
npx prettier --check "src/presentation/routing/**/*.{ts,tsx,scss}"
```

---

### أمثلة عملية

#### فحص routing فقط
```bash
cd frontend
npx eslint "src/presentation/routing/**/*.{ts,tsx}"
npx tsc --noEmit --include "src/presentation/routing/**/*"
npx prettier --check "src/presentation/routing/**/*.{ts,tsx,scss}"
```

#### فحص components فقط
```bash
cd frontend
npx eslint "src/presentation/components/**/*.{ts,tsx}"
npx prettier --check "src/presentation/components/**/*.{ts,tsx,scss}"
```

#### فحص hooks فقط
```bash
cd frontend
npx eslint "src/presentation/routing/hooks/**/*.ts"
npx tsc --noEmit --include "src/presentation/routing/hooks/**/*"
```

---

## 🔄 سير العمل الموصى به

### بعد الانتهاء من تطوير قسم معين:

#### الخطوة 1: فحص TypeScript
```bash
cd frontend  # أو backend
npm run type-check
```

#### الخطوة 2: إصلاح ESLint
```bash
npm run lint:fix
```

#### الخطوة 3: تنسيق الملفات
```bash
npm run format
```

#### الخطوة 4: فحص البناء
```bash
npm run build
```

#### الخطوة 5: فحص شامل نهائي
```bash
npm run check
```

---

### قبل Commit

```bash
# Frontend
cd frontend
npm run check

# Backend
cd backend
npm run type-check && npm run lint && npm run build

# أو استخدام السكريبت
.\scripts\check-quality.ps1 all
```

---

### قبل Push

```bash
# فحص شامل مع إصلاح
.\scripts\check-quality.ps1 all -Fix
```

---

### قبل Deploy

```bash
# Frontend - فحص شامل + اختبارات
cd frontend
npm run validate

# Backend - فحص شامل
cd backend
npm run type-check && npm run lint && npm run build
```

---

## 📊 جدول الأوامر السريعة

| المهمة | الأمر | الوصف |
|--------|-------|-------|
| **فحص شامل Frontend** | `cd frontend && npm run check` | TypeScript + ESLint + Prettier |
| **فحص مع إصلاح** | `cd frontend && npm run check:fix` | إصلاح تلقائي لجميع المشاكل |
| **TypeScript فقط** | `cd frontend && npm run type-check` | فحص الأنواع فقط |
| **ESLint فقط** | `cd frontend && npm run lint` | فحص جودة الكود |
| **ESLint Fix** | `cd frontend && npm run lint:fix` | إصلاح أخطاء ESLint |
| **Prettier فقط** | `cd frontend && npm run format:check` | فحص التنسيق |
| **Prettier Fix** | `cd frontend && npm run format` | تنسيق الملفات |
| **Build Check** | `cd frontend && npm run build` | فحص البناء |
| **Validate** | `cd frontend && npm run validate` | فحص شامل + اختبارات |
| **Backend Check** | `cd backend && npm run type-check && npm run build` | فحص Backend |

---

## 🎯 أوامر حسب المهمة

### فحص قسم محدد (مثال: routing)

```bash
cd frontend

# 1. TypeScript
npx tsc --noEmit --include "src/presentation/routing/**/*"

# 2. ESLint
npx eslint "src/presentation/routing/**/*.{ts,tsx}"

# 3. Prettier
npx prettier --check "src/presentation/routing/**/*.{ts,tsx,scss}"

# 4. إصلاح تلقائي
npx eslint "src/presentation/routing/**/*.{ts,tsx}" --fix
npx prettier --write "src/presentation/routing/**/*.{ts,tsx,scss}"
```

---

## ⚡ One-Liners (أوامر سريعة جداً)

### Frontend
```bash
# فحص سريع
cd frontend && npm run check

# فحص وإصلاح
cd frontend && npm run check:fix

# TypeScript فقط
cd frontend && npm run type-check

# ESLint فقط
cd frontend && npm run lint

# Build فقط
cd frontend && npm run build
```

### Backend
```bash
# فحص سريع
cd backend && npm run type-check && npm run build

# ESLint
cd backend && npm run lint

# Build
cd backend && npm run build
```

### All (باستخدام السكريبت)
```bash
# Windows
.\scripts\check-quality.ps1 all

# Linux/Mac
./scripts/check-quality.sh all
```

---

## 🔍 أوامر متقدمة

### 1. فحص مع تقرير مفصل

```bash
cd frontend

# ESLint Report
npm run lint -- --format json > eslint-report.json

# TypeScript Errors
npm run type-check 2>&1 | tee typescript-errors.log
```

### 2. Watch Mode

```bash
cd frontend

# TypeScript Watch
npm run type-check:watch

# ESLint Watch
npm run lint:watch
```

### 3. Coverage

```bash
cd frontend
npm run test:coverage
```

---

## 📝 ملاحظات مهمة

1. **قبل Commit:** استخدم `npm run check` على الأقل
2. **قبل Push:** استخدم `.\scripts\check-quality.ps1 all`
3. **قبل Deploy:** استخدم `npm run validate`
4. **للإصلاح التلقائي:** استخدم `-Fix` أو `--fix`
5. **للقسم المحدد:** استخدم الأوامر مع `--include` أو مسار محدد
6. **لإصلاح التحذيرات:** راجع [FIX_WARNINGS.md](./FIX_WARNINGS.md) أو استخدم `.\scripts\fix-warnings.ps1`

---

## 🎨 أمثلة عملية

### مثال 1: بعد تطوير routing

```bash
cd frontend

# 1. فحص TypeScript
npx tsc --noEmit --include "src/presentation/routing/**/*"

# 2. فحص وإصلاح ESLint
npx eslint "src/presentation/routing/**/*.{ts,tsx}" --fix

# 3. تنسيق الملفات
npx prettier --write "src/presentation/routing/**/*.{ts,tsx,scss}"

# 4. فحص شامل
npm run check
```

### مثال 2: قبل Commit

```bash
# Frontend
cd frontend
npm run check:fix

# Backend
cd backend
npm run lint:fix && npm run type-check
```

### مثال 3: فحص شامل للمشروع

```bash
# Windows
.\scripts\check-quality.ps1 all

# Linux/Mac
./scripts/check-quality.sh all
```

---

## 🔗 روابط مفيدة

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)

---

**آخر تحديث:** يناير 2026  
**الإصدار:** 2.0.0

