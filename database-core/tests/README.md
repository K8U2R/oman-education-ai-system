# Tests - الاختبارات

## نظرة عامة

هذا المجلد يحتوي على جميع الاختبارات للنظام.

## البنية

```
tests/
├── unit/              # Unit Tests
│   ├── domain/        # Domain Layer Tests
│   ├── application/   # Application Layer Tests
│   └── infrastructure/# Infrastructure Layer Tests
├── integration/        # Integration Tests
│   ├── api/          # API Tests
│   ├── cache/        # Cache Tests
│   └── repositories/ # Repository Tests
└── README.md         # هذا الملف
```

## Unit Tests

### Domain Layer
- **Actor.test.ts**: اختبارات Actor Value Object
- **QueryOptions.test.ts**: اختبارات QueryOptions Value Object

### Application Layer
- **FindRecordsUseCase.test.ts**: اختبارات FindRecordsUseCase
- **InsertRecordUseCase.test.ts**: اختبارات InsertRecordUseCase

### Infrastructure Layer
- **MemoryCache.test.ts**: اختبارات MemoryCache

## Integration Tests

### API
- **database.routes.test.ts**: اختبارات Database Routes
- **health.routes.test.ts**: اختبارات Health Routes

### Cache
- **CacheManager.test.ts**: اختبارات CacheManager

### Repositories
- **DatabaseRepository.test.ts**: اختبارات DatabaseRepository

## تشغيل الاختبارات

```bash
# تشغيل جميع الاختبارات
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# تشغيل Unit Tests فقط
npm test -- tests/unit

# تشغيل Integration Tests فقط
npm test -- tests/integration
```

## Coverage

الهدف هو الوصول إلى:
- **Unit Tests**: > 80% coverage
- **Integration Tests**: > 60% coverage

## Best Practices

1. **Arrange-Act-Assert**: اتبع نمط AAA
2. **Isolation**: كل اختبار مستقل
3. **Mocking**: استخدم Mocks للتبعيات
4. **Descriptive Names**: أسماء واضحة للاختبارات
5. **One Assertion**: اختبار واحد لكل assertion (حيثما أمكن)
