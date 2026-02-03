# Infrastructure Layer - طبقة البنية التحتية

## نظرة عامة

طبقة البنية التحتية تحتوي على التطبيقات الفعلية للواجهات المحددة في Domain Layer.

## البنية

```
infrastructure/
├── adapters/          # Database Adapters
├── repositories/      # Repository Implementations
├── policies/         # Policy Engine
├── audit/            # Audit System
├── cache/            # Caching System
├── config/           # Configuration
└── README.md         # هذا الملف
```

## Adapters

### SupabaseAdapter

محول Supabase الذي يطبق IDatabaseAdapter. يوفر وصولاً إلى قاعدة البيانات Supabase.

## Repositories

### DatabaseRepository

مستودع قاعدة البيانات مع دعم Cache. يوفر واجهة عالية المستوى للوصول إلى قاعدة البيانات.

**المزايا:**

- دعم Cache تلقائي
- QueryResult مع metadata
- Invalidation تلقائي عند Write Operations

### AuditRepository

مستودع سجلات التدقيق. يوفر واجهة للوصول إلى سجلات التدقيق.

**الطرق:**

- `getLogs()` - الحصول على سجلات التدقيق
- `getLogsByActor()` - الحصول على سجلات actor معين
- `getLogsByEntity()` - الحصول على سجلات entity معين
- `getLogsByAction()` - الحصول على سجلات action معين
- `getLogsByDateRange()` - الحصول على سجلات في فترة زمنية
- `getSuccessfulLogs()` - الحصول على السجلات الناجحة
- `getFailedLogs()` - الحصول على السجلات الفاشلة

## Policies

### PolicyEngine

محرك السياسات الذي يطبق IPolicyEngine. يتحقق من  قبل تنفيذ العمليات.

**المزايا:**

- دعم Policies متعددة
- تقييم Policies
- إدارة Policies

## Audit

### AuditLogger

مسجل سجلات التدقيق الذي يطبق IAuditLogger. يسجل جميع العمليات على قاعدة البيانات.

**المزايا:**

- تسجيل في ملف
- تسجيل في الذاكرة
- استعلام السجلات

## Cache

### MemoryCache

تنفيذ بسيط للتخزين المؤقت في الذاكرة.

**المزايا:**

- TTL (Time To Live)
- تنظيف تلقائي للقيم المنتهية
- إحصائيات

### CacheManager

مدير موحد للتخزين المؤقت.

**المزايا:**

- إدارة Cache
- إحصائيات (Hit Rate, Miss Rate)
- LRU Eviction
- Key Generation

## Config

### database.config.ts

إعدادات قاعدة البيانات.

## المبادئ

1. **Implementation**: تطبيق الواجهات من Domain Layer
2. **Dependency Inversion**: استخدام Interfaces من Domain
3. **Separation of Concerns**: فصل واضح للمسؤوليات
4. **Performance**: Cache و Optimization
