# Tests - الاختبارات (Backend)

## 📋 الوصف

مجلد الاختبارات للـ Backend يحتوي على جميع أنواع الاختبارات: Unit Tests، Integration Tests، و E2E Tests.

## 🏗️ الهيكل

```
tests/
├── unit/              # Unit Tests
│   ├── application/
│   ├── domain/
│   └── infrastructure/
├── integration/       # Integration Tests
│   └── api/
└── e2e/              # End-to-End Tests
    └── auth.e2e.test.ts
```

## 📦 المكونات

### 1. Unit Tests - اختبارات الوحدة

**الموقع:** `unit/`

**الوظيفة:**
- اختبار الوحدات بشكل منفصل
- اختبار Functions و Classes
- استخدام Mocks

**الأقسام:**

#### `unit/application/`
- اختبارات Application Layer
- Use Cases Tests
- Services Tests

#### `unit/domain/`
- اختبارات Domain Layer
- Entities Tests
- Value Objects Tests

#### `unit/infrastructure/`
- اختبارات Infrastructure Layer
- Adapters Tests
- Repositories Tests

### 2. Integration Tests - اختبارات التكامل

**الموقع:** `integration/`

**الوظيفة:**
- اختبار تكامل المكونات
- اختبار APIs
- اختبار Database Integration

**الأقسام:**

#### `integration/api/`
- **auth.integration.test.ts**: اختبارات API المصادقة
- **health.integration.test.ts**: اختبارات Health Check

### 3. E2E Tests - اختبارات End-to-End

**الموقع:** `e2e/`

**الوظيفة:**
- اختبار السيناريوهات الكاملة
- اختبار User Flows
- اختبار Real-world Scenarios

**الأقسام:**

#### `e2e/auth.e2e.test.ts`
- اختبارات E2E للمصادقة
- Complete Authentication Flow

## ✅ ما يجب أن يكون في هذه الطبقة

### 1. Test Files
- ملفات الاختبار
- Test Suites
- Test Cases

### 2. Test Utilities
- Test Helpers
- Mock Factories
- Test Fixtures

### 3. Test Configuration
- Test Setup
- Test Teardown
- Test Environment

## ❌ ما لا يجب أن يكون في هذه الطبقة

### 1. Production Code
- ❌ لا يجب وجود Production Code
- ✅ يجب أن يكون في src/

### 2. Test Data (Production)
- ❌ لا يجب استخدام بيانات إنتاج حقيقية
- ✅ يجب استخدام Test Data

## 🔄 التدفق (Flow)

```
Unit Tests (Isolated)
    ↓
Integration Tests (Component Integration)
    ↓
E2E Tests (Full System)
```

## 📝 أمثلة الاستخدام

### Unit Test Example
```typescript
// unit/application/LoginUseCase.test.ts
describe('LoginUseCase', () => {
  it('should login user with valid credentials', async () => {
    // Test implementation
  })
})
```

## 🧪 الاختبار

- كل Unit Test يجب أن يكون سريع ومستقل
- كل Integration Test يجب أن يختبر تكامل حقيقي
- كل E2E Test يجب أن يختبر سيناريو كامل

## 📚 المراجع

- Testing Best Practices
- Vitest Documentation
- Test-Driven Development

