# Tests - الاختبارات (Frontend)

## 📋 الوصف

مجلد الاختبارات للـ Frontend يحتوي على جميع أنواع الاختبارات: Unit Tests، Integration Tests، و E2E Tests.

## 🏗️ الهيكل

```
tests/
└── e2e/              # End-to-End Tests
    └── homepage.spec.ts
```

## 📦 المكونات

### 1. E2E Tests - اختبارات End-to-End

**الموقع:** `e2e/`

**الوظيفة:**
- اختبار السيناريوهات الكاملة
- اختبار User Interactions
- اختبار Real-world Scenarios

**الأقسام:**

#### `e2e/homepage.spec.ts`
- اختبارات E2E للصفحة الرئيسية
- User Flow Tests

## ✅ ما يجب أن يكون في هذه الطبقة

### 1. Test Files
- ملفات الاختبار
- Test Suites
- Test Cases

### 2. Test Utilities
- Test Helpers
- Mock Factories
- Test Fixtures

## ❌ ما لا يجب أن يكون في هذه الطبقة

### 1. Production Code
- ❌ لا يجب وجود Production Code
- ✅ يجب أن يكون في src/

## 🔄 التدفق (Flow)

```
Unit Tests (Component Level)
    ↓
Integration Tests (Component Integration)
    ↓
E2E Tests (Full User Flow)
```

## 📝 أمثلة الاستخدام

### E2E Test Example
```typescript
// e2e/homepage.spec.ts
test('should navigate to login page', async ({ page }) => {
  await page.goto('/')
  await page.click('text=تسجيل الدخول')
  await expect(page).toHaveURL('/login')
})
```

## 🧪 الاختبار

- كل E2E Test يجب أن يختبر سيناريو كامل
- استخدام Playwright للـ E2E Tests
- استخدام Vitest للـ Unit Tests

## 📚 المراجع

- Playwright Documentation
- Vitest Documentation
- Testing Best Practices

