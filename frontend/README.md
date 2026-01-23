# نظام التعليم الذكي العماني - Frontend

## نظرة عامة

هذا هو المشروع الرئيسي للواجهة الأمامية لنظام التعليم الذكي العماني. تم بناؤه باستخدام React 18 و TypeScript و Vite مع تطبيق مبادئ Clean Architecture و Feature-Sliced Design.

## الميزات الرئيسية

### 🎨 المكونات (Components)

- **مكونات مشتركة**: Button, Card, Input, Modal, Badge, Avatar وغيرها
- **مكونات محسّنة للأداء**: استخدام React.memo و useMemo و useCallback
- **دعم RTL كامل**: جميع المكونات تدعم اللغة العربية والاتجاه من اليمين لليسار
- **Storybook**: توثيق تفاعلي لجميع المكونات

### 🏗️ البنية المعمارية

```
frontend/
├── src/
│   ├── application/        # طبقة التطبيق
│   │   ├── features/      # الميزات (auth, learning, security, etc.)
│   │   ├── core/          # الوظائف الأساسية
│   │   └── services/      # الخدمات
│   ├── domain/            # طبقة المجال
│   │   ├── entities/      # الكيانات
│   │   ├── interfaces/    # الواجهات
│   │   └── value-objects/ # كائنات القيمة
│   ├── infrastructure/    # طبقة البنية التحتية
│   │   ├── api/          # API clients
│   │   └── services/     # خدمات البنية التحتية
│   └── presentation/      # طبقة العرض
│       ├── components/    # المكونات
│       ├── pages/        # الصفحات
│       └── routing/      # التوجيه
```

### 📦 الميزات (Features)

كل ميزة تحتوي على:

- **types/**: أنواع TypeScript
- **constants/**: الثوابت
- **utils/**: الوظائف المساعدة
- **hooks/**: Custom Hooks
- **store/**: Zustand stores
- **services/**: الخدمات
- **README.md**: التوثيق

#### الميزات المتاحة:

1. **auth** - المصادقة والتفويض
2. **learning** - التعلم والدروس
3. **security** - الأمان والجلسات
4. **notifications** - الإشعارات
5. **projects** - المشاريع
6. **storage** - التخزين السحابي
7. **office** - إنشاء المستندات
8. **admin** - إدارة النظام
9. **developer** - أدوات المطورين

## البدء السريع

### المتطلبات

- Node.js 18+ 
- npm أو yarn

### التثبيت

```bash
# تثبيت التبعيات
npm install

# تشغيل خادم التطوير
npm run dev

# فتح المتصفح على http://localhost:5173
```

### الأوامر المتاحة

```bash
# التطوير
npm run dev              # تشغيل خادم التطوير
npm run dev:debug        # تشغيل مع وضع التصحيح

# البناء
npm run build            # بناء للإنتاج
npm run preview          # معاينة البناء

# الاختبار
npm run test             # تشغيل الاختبارات
npm run test:ui          # واجهة الاختبارات
npm run test:coverage    # تغطية الاختبارات
npm run test:e2e         # اختبارات E2E

# الجودة
npm run lint             # فحص الكود
npm run lint:fix         # إصلاح أخطاء الكود
npm run type-check       # فحص الأنواع
npm run format           # تنسيق الكود
npm run check            # فحص شامل
npm run validate         # التحقق الكامل

# Storybook
npm run storybook        # تشغيل Storybook
npm run build-storybook  # بناء Storybook
```

## الأدوات والتقنيات

### التقنيات الأساسية

- **React 18**: مكتبة واجهة المستخدم
- **TypeScript**: لغة البرمجة
- **Vite**: أداة البناء
- **React Router**: التوجيه
- **Zustand**: إدارة الحالة
- **SCSS Modules**: التنسيقات

### أدوات التطوير

- **Vitest**: الاختبارات
- **Playwright**: اختبارات E2E
- **ESLint**: فحص الكود
- **Prettier**: تنسيق الكود
- **Storybook**: توثيق المكونات
- **Husky**: Git hooks

## الأداء والتحسينات

### التحسينات المطبقة

1. **React.memo**: منع إعادة التصيير غير الضرورية
2. **useMemo**: تحسين الحسابات المكلفة
3. **useCallback**: تحسين معالجات الأحداث
4. **Code Splitting**: تقسيم الكود تلقائياً
5. **Lazy Loading**: تحميل الصفحات عند الحاجة

### المكونات المحسّنة

- `DashboardPage` - لوحة التحكم
- `Sidebar` - الشريط الجانبي
- `Card`, `Button`, `Input` - المكونات المشتركة
- `PageHeader` - رأس الصفحة

## Storybook

### التشغيل

```bash
npm run storybook
```

سيتم فتح Storybook على `http://localhost:6006`

### المكونات الموثقة

- ✅ Button - جميع الأنماط والأحجام
- ✅ Card - جميع المتغيرات
- ✅ Input - جميع الحالات
- ✅ Modal - جميع الأحجام والخيارات
- ✅ Badge - جميع الأنماط
- ✅ Avatar - جميع الأحجام والحالات

### إضافة Story جديد

راجع [`.storybook/README.md`](.storybook/README.md) للتعليمات التفصيلية.

## الاختبارات

### Unit Tests

```bash
npm run test
```

- **التغطية المستهدفة**: > 80%
- **الأدوات**: Vitest, @testing-library/react

### Integration Tests

```bash
npm run test:e2e
```

- **التغطية المستهدفة**: > 60%
- **الأدوات**: Playwright

## المعايير والجودة

### TypeScript

- ✅ Strict mode مفعّل
- ✅ No `any` types
- ✅ Full type coverage
- ✅ Explicit return types

### ESLint Rules

- ✅ No `any` types
- ✅ Explicit return types
- ✅ No unused variables
- ✅ Prefer `const` over `let`

### Code Style

- **Components**: PascalCase (مثال: `UserProfile.tsx`)
- **Services**: camelCase.service.ts (مثال: `user.service.ts`)
- **Types**: camelCase.types.ts (مثال: `user.types.ts`)
- **Utils**: camelCase.util.ts (مثال: `date.util.ts`)

## SCSS Standards

### استخدام المتغيرات

```scss
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.my-component {
  padding: $spacing-4;
  color: $primary-600;
  background: $background-primary;
}
```

### لا تكتب ألوان يدوية

```scss
// ❌ سيء
.my-component {
  color: #3b82f6;
}

// ✅ جيد
.my-component {
  color: $primary-600;
}
```

## RTL Support

جميع المكونات تدعم RTL بشكل كامل:

- ✅ دعم الاتجاه من اليمين لليسار
- ✅ Storybook مع toggle RTL/LTR
- ✅ CSS متجاوب للاتجاهين

## التوثيق

### الملفات الموثقة

- كل ميزة تحتوي على `README.md` خاص بها
- Storybook للتوثيق التفاعلي
- JSDoc comments في الكود

### المواقع

- [Storybook Documentation](.storybook/README.md)
- [Features Documentation](src/application/features/)
- [Domain Documentation](src/domain/README.md)
- [Infrastructure Documentation](src/infrastructure/README.md)

## المساهمة

### Git Standards

#### Commit Messages

```
feat: add user authentication
fix: resolve database connection issue
docs: update API documentation
refactor: improve error handling
test: add unit tests for user service
```

#### Branch Naming

- `feature/description`
- `fix/description`
- `refactor/description`
- `test/description`

### Pre-commit Checklist

- [ ] All tests passing
- [ ] Test coverage meets requirements
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Code reviewed
- [ ] Documentation updated

## الأداء

### معايير الأداء

- **API Endpoints**: < 200ms (p95)
- **Database Queries**: < 100ms (p95)
- **External API Calls**: < 500ms (p95)

### تحليل الحزمة

```bash
npm run analyze
```

## الأمان

### المتطلبات

- ✅ Input validation on all endpoints (Zod)
- ✅ Authentication on protected routes
- ✅ Authorization checks
- ✅ Rate limiting
- ✅ Secure headers

## الدعم والمساعدة

### المشاكل الشائعة

راجع [docs/](./docs/) للمزيد من المعلومات.

### الاتصال

للمساعدة والدعم، راجع التوثيق في كل ميزة أو تواصل مع فريق التطوير.

## الترخيص

هذا المشروع جزء من نظام التعليم الذكي العماني.

---

**آخر تحديث**: 2024
