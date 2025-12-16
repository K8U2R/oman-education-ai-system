# Testing Guide
# دليل الاختبارات

## 📋 نظرة عامة

هذا الدليل يشرح كيفية اختبار وحدة التخصيص الشخصي.

---

## 🧪 Unit Tests

### تشغيل الاختبارات

```bash
npm test
```

### تشغيل الاختبارات مع Coverage

```bash
npm test -- --coverage
```

### تشغيل اختبارات محددة

```bash
npm test validation
npm test helpers
```

---

## 📝 Test Structure

```
__tests__/
├── validation.test.ts    # اختبارات التحقق
├── helpers.test.ts        # اختبارات الدوال المساعدة
└── components/           # اختبارات المكونات
    ├── UserPreferences.test.tsx
    ├── UserSettings.test.tsx
    └── UserProfile.test.tsx
```

---

## ✅ Test Examples

### Validation Tests

```typescript
import { validatePreferences } from '../utils/validation';

describe('validatePreferences', () => {
  it('should validate correct preferences', () => {
    const result = validatePreferences({
      theme: 'dark',
      layout: 'comfortable',
    });
    expect(result.valid).toBe(true);
  });
});
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import UserPreferences from '../components/UserPreferences';

describe('UserPreferences', () => {
  it('should render preferences form', () => {
    render(<UserPreferences />);
    expect(screen.getByText('التفضيلات الشخصية')).toBeInTheDocument();
  });
});
```

---

## 🔍 Integration Tests

### API Integration Tests

```typescript
import { userPersonalizationService } from '../services/user-personalization-service';

describe('API Integration', () => {
  it('should fetch preferences', async () => {
    const preferences = await userPersonalizationService.getPreferences();
    expect(preferences).toBeDefined();
  });
});
```

---

## 🎯 Best Practices

1. **Test Coverage**: يجب أن يكون Coverage > 80%
2. **Test Isolation**: كل test يجب أن يكون مستقل
3. **Mock Dependencies**: استخدام mocks للـ dependencies
4. **Clear Test Names**: أسماء واضحة للـ tests
5. **Arrange-Act-Assert**: استخدام نمط AAA

---

## 🐛 Debugging Tests

### تشغيل Tests في Watch Mode

```bash
npm test -- --watch
```

### تشغيل Tests مع Verbose Output

```bash
npm test -- --verbose
```

---

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)

