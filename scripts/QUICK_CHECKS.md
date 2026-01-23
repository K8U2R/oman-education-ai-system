# أوامر فحص الجودة السريعة - Quick Quality Checks

> **آخر تحديث:** يناير 2026

دليل سريع لأفضل الأوامر للتحقق من الأخطاء والتحذيرات في أي قسم من المشروع.

---

## 🚀 الأوامر السريعة (Quick Commands)

### Frontend

#### 1. فحص شامل (Recommended)
```bash
# Windows PowerShell
.\scripts\check-quality.ps1 frontend

# Linux/Mac
./scripts/check-quality.sh frontend
```

#### 2. فحص مع إصلاح تلقائي
```bash
# Windows PowerShell
.\scripts\check-quality.ps1 frontend -Fix

# Linux/Mac
./scripts/check-quality.sh frontend --fix
```

#### 3. فحص TypeScript فقط
```bash
cd frontend
npm run type-check
```

#### 4. فحص ESLint فقط
```bash
cd frontend
npm run lint
```

#### 5. إصلاح ESLint تلقائياً
```bash
cd frontend
npm run lint:fix
```

#### 6. فحص Prettier فقط
```bash
cd frontend
npm run format:check
```

#### 7. تنسيق الملفات تلقائياً
```bash
cd frontend
npm run format
```

#### 8. فحص شامل (TypeScript + ESLint + Prettier)
```bash
cd frontend
npm run check
```

#### 9. فحص شامل مع إصلاح
```bash
cd frontend
npm run check:fix
```

#### 10. فحص البناء (Build Check)
```bash
cd frontend
npm run build
```

---

### Backend

#### 1. فحص شامل (Recommended)
```bash
# Windows PowerShell
.\scripts\check-quality.ps1 backend

# Linux/Mac
./scripts/check-quality.sh backend
```

#### 2. فحص TypeScript فقط
```bash
cd backend
npx tsc --noEmit
```

#### 3. فحص البناء
```bash
cd backend
npm run build
```

---

### المشروع الكامل (All)

#### 1. فحص كل شيء
```bash
# Windows PowerShell
.\scripts\check-quality.ps1 all

# Linux/Mac
./scripts/check-quality.sh all
```

---

## 📋 سير العمل الموصى به (Recommended Workflow)

### بعد الانتهاء من تطوير قسم معين:

#### الخطوة 1: فحص TypeScript
```bash
cd frontend  # أو backend
npm run type-check
```

#### الخطوة 2: فحص وإصلاح ESLint
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

## 🎯 أوامر حسب المهمة

### قبل Commit

```bash
# Frontend
cd frontend
npm run check

# Backend
cd backend
npx tsc --noEmit && npm run build

# أو استخدام السكريبت
.\scripts\check-quality.ps1 all
```

### قبل Push

```bash
# فحص شامل مع إصلاح
.\scripts\check-quality.ps1 all -Fix
```

### قبل Deploy

```bash
# فحص شامل + اختبارات
cd frontend
npm run validate  # type-check + lint + format:check + test
```

---

## 🔍 فحص قسم محدد

### فحص مجلد معين في Frontend

```bash
cd frontend

# فحص TypeScript لمجلد محدد
npx tsc --noEmit src/presentation/routing/**/*.ts*

# فحص ESLint لمجلد محدد
npx eslint src/presentation/routing/**/*.{ts,tsx}

# فحص Prettier لمجلد محدد
npx prettier --check "src/presentation/routing/**/*.{ts,tsx,scss}"
```

### أمثلة عملية

```bash
# فحص routing فقط
npx eslint src/presentation/routing/**/*.{ts,tsx}
npx tsc --noEmit --project tsconfig.json --include "src/presentation/routing/**/*"

# فحص components فقط
npx eslint src/presentation/components/**/*.{ts,tsx}
npx prettier --check "src/presentation/components/**/*.{ts,tsx,scss}"

# فحص hooks فقط
npx eslint src/presentation/routing/hooks/**/*.ts
npx tsc --noEmit --include "src/presentation/routing/hooks/**/*"
```

---

## 🛠️ أوامر متقدمة

### 1. فحص مع تقرير مفصل

```bash
cd frontend
npm run lint -- --format json > eslint-report.json
npm run type-check 2>&1 | tee typescript-errors.log
```

### 2. فحص مع Watch Mode

```bash
# TypeScript Watch
cd frontend
npm run type-check:watch

# ESLint Watch
cd frontend
npm run lint:watch
```

### 3. فحص Coverage

```bash
cd frontend
npm run test:coverage
```

---

## 📊 جدول الأوامر السريعة

| المهمة | الأمر | الوصف |
|--------|-------|-------|
| **فحص شامل** | `npm run check` | TypeScript + ESLint + Prettier |
| **فحص مع إصلاح** | `npm run check:fix` | إصلاح تلقائي لجميع المشاكل |
| **TypeScript** | `npm run type-check` | فحص الأنواع فقط |
| **ESLint** | `npm run lint` | فحص جودة الكود |
| **ESLint Fix** | `npm run lint:fix` | إصلاح أخطاء ESLint |
| **Prettier** | `npm run format:check` | فحص التنسيق |
| **Prettier Fix** | `npm run format` | تنسيق الملفات |
| **Build** | `npm run build` | فحص البناء |
| **Validate** | `npm run validate` | فحص شامل + اختبارات |

---

## ⚡ أوامر سريعة جداً (One-liners)

### Frontend - فحص سريع
```bash
cd frontend && npm run check
```

### Frontend - فحص وإصلاح
```bash
cd frontend && npm run check:fix
```

### Backend - فحص سريع
```bash
cd backend && npx tsc --noEmit && npm run build
```

### All - فحص كل شيء
```bash
.\scripts\check-quality.ps1 all
```

---

## 🎨 استخدام السكريبتات المخصصة

### Windows (PowerShell)

```powershell
# فحص Frontend
.\scripts\check-quality.ps1 frontend

# فحص Frontend مع إصلاح
.\scripts\check-quality.ps1 frontend -Fix

# فحص Backend
.\scripts\check-quality.ps1 backend

# فحص كل شيء
.\scripts\check-quality.ps1 all
```

### Linux/Mac (Bash)

```bash
# إعطاء صلاحيات التنفيذ (مرة واحدة فقط)
chmod +x scripts/check-quality.sh

# فحص Frontend
./scripts/check-quality.sh frontend

# فحص Frontend مع إصلاح
./scripts/check-quality.sh frontend --fix

# فحص Backend
./scripts/check-quality.sh backend

# فحص كل شيء
./scripts/check-quality.sh all
```

---

## 📝 ملاحظات مهمة

1. **قبل Commit:** استخدم `npm run check` على الأقل
2. **قبل Push:** استخدم `.\scripts\check-quality.ps1 all`
3. **قبل Deploy:** استخدم `npm run validate`
4. **للإصلاح التلقائي:** استخدم `-Fix` أو `--fix`

---

## 🔗 روابط مفيدة

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)

---

**آخر تحديث:** يناير 2026

