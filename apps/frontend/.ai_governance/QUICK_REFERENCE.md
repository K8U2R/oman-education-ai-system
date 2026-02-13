# 📖 Quick Reference - مرجع سريع

## البنية المعمارية الأساسية

### هيكلة المكونات
```
ComponentName/
├── ComponentName.tsx          # Logic
├── ComponentName.module.scss  # Styles
├── index.ts                   # Export
├── types.ts                   # Types
└── hooks/                     # Hooks
```

### نظام التصميم السائل
```scss
// ❌ ممنوع
padding: 16px;
font-size: 24px;

// ✅ صحيح  
padding: $spacing-fluid-4;
font-size: $font-fluid-xl;
```

### الألوان
```scss
// ❌ ممنوع
background: #3b82f6;

// ✅ صحيح
background: var(--color-primary);
```

## الأمان

### Circuit Breaker
- يوقف الطلبات بعد 3 فشل متتالي
- يمنع حظر المستخدم (429)

### Request Tracing
- كل طلب يحمل `X-Request-ID`
- يسمح بالتتبع عبر Frontend/Backend

### Enhanced Caching
- Memory Cache للبيانات الصغيرة
- IndexedDB للبيانات >5MB

## الذكاء الاصطناعي

### FeatureGate
```tsx
<FeatureGate
  feature="ai.recommendations"
  requiredPermission="ai.recommendations.view"
  fallback={<UpgradePrompt />}
>
  <AIComponent />
</FeatureGate>
```

### الحالات الثلاث
1. Loading → `<SkeletonLoader />`
2. Error → `<ProfessionalErrorPanel />`
3. Empty → `<EmptyState />`

## الصيانة

### Dev Tools
```tsx
{import.meta.env.DEV && <DeveloperDashboard />}
```

### Error Handling
```tsx
<ProfessionalErrorPanel
  error={error}
  requestId="req-123"
  showTechnicalDetails={import.meta.env.DEV}
/>
```

---

**للمزيد:** راجع [STYLE_GUIDE.md](./STYLE_GUIDE.md)
