# Domain Layer - طبقة المجال

## نظرة عامة

طبقة المجال تحتوي على الكيانات والقواعد الأساسية لنظام قاعدة البيانات. هذه الطبقة مستقلة تماماً عن أي تقنيات خارجية.

## البنية

```
domain/
├── entities/          # الكيانات (Entities)
├── value-objects/     # كائنات القيمة (Value Objects)
├── interfaces/        # الواجهات (Interfaces)
├── exceptions/        # الاستثناءات المخصصة (Custom Exceptions)
├── types/            # الأنواع (Types)
├── constants/        # الثوابت (Constants)
└── README.md         # هذا الملف
```

## Entities

### DatabaseOperation

يمثل عملية على قاعدة البيانات مع جميع المعلومات المطلوبة.

### AuditLog

يمثل سجل تدقيق لعملية قاعدة البيانات.

### QueryResult

يمثل نتيجة استعلام قاعدة البيانات مع metadata.

## Value Objects

### OperationType

نوع العملية (FIND, INSERT, UPDATE, DELETE).

### QueryCondition

شروط الاستعلام.

### QueryOptions

خيارات الاستعلام (pagination, sorting).

### Actor

المستخدم أو النظام الذي ينفذ العملية.

## Interfaces

### IDatabaseAdapter

واجهة محايدة للمزود لقاعدة البيانات.

### IPolicyEngine

واجهة محرك السياسات.

### IAuditLogger

واجهة مسجل سجلات التدقيق.

## Exceptions

### DatabaseException

الاستثناء الأساسي لجميع أخطاء قاعدة البيانات.

### PermissionDeniedException

خطأ رفض .

### QueryException

خطأ الاستعلام.

### ValidationException

خطأ التحقق من البيانات.

## Types

### database.types.ts

أنواع قاعدة البيانات.

### policy.types.ts

أنواع السياسات.

### audit.types.ts

أنواع التدقيق.

## Constants

### operations.constants.ts

ثوابت العمليات.

### errors.constants.ts

ثوابت الأخطاء.

## المبادئ

1. **Independence**: الطبقة مستقلة تماماً عن أي تقنيات خارجية
2. **Immutability**: الكيانات و Value Objects غير قابلة للتعديل
3. **Validation**: التحقق من صحة البيانات في الطبقة
4. **Type Safety**: استخدام TypeScript بشكل صارم
