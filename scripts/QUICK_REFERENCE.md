# ⚡ مرجع سريع - أوامر فحص الجودة

> **استخدم هذا الملف كمرجع سريع بعد الانتهاء من تطوير أي قسم**

---

## 🎯 الأوامر الأساسية (استخدمها دائماً)

### Frontend - فحص شامل
```bash
cd frontend
npm run check
```

### Frontend - فحص مع إصلاح
```bash
cd frontend
npm run check:fix
```

### Backend - فحص شامل
```bash
cd backend
npm run type-check && npm run lint && npm run build
```

### كل شيء - باستخدام السكريبت
```powershell
# Windows
.\scripts\check-quality.ps1 all

# Linux/Mac
./scripts/check-quality.sh all
```

---

## 📁 فحص قسم محدد

### مثال: فحص routing فقط

```bash
cd frontend

# TypeScript
npx tsc --noEmit --include "src/presentation/routing/**/*"

# ESLint
npx eslint "src/presentation/routing/**/*.{ts,tsx}" --fix

# Prettier
npx prettier --write "src/presentation/routing/**/*.{ts,tsx,scss}"
```

---

## 🔄 سير العمل السريع

```bash
# 1. TypeScript
npm run type-check

# 2. إصلاح ESLint
npm run lint:fix

# 3. تنسيق الملفات
npm run format

# 4. فحص شامل
npm run check
```

---

## 🔧 إصلاح التحذيرات

### إصلاح تلقائي
```bash
cd frontend
npm run lint:fix
npm run format
```

### استخدام السكريبت
```powershell
# Windows
.\scripts\fix-warnings.ps1 frontend

# Linux/Mac
./scripts/fix-warnings.sh frontend
```

**راجع:**
- [QUALITY_CHECKS.md](./QUALITY_CHECKS.md) - للتفاصيل الكاملة
- [FIX_WARNINGS.md](./FIX_WARNINGS.md) - دليل إصلاح التحذيرات

