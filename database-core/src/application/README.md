# Application Layer - طبقة التطبيق

## نظرة عامة

طبقة التطبيق تحتوي على Use Cases و Services و DTOs التي تنفذ منطق التطبيق.

## البنية

```
application/
├── use-cases/          # Use Cases
│   ├── database/      # Use Cases قاعدة البيانات
│   └── audit/         # Use Cases التدقيق
├── services/          # Application Services
├── dto/              # Data Transfer Objects
├── utils/            # Application Utils
└── README.md         # هذا الملف
```

## Use Cases

### Database Use Cases

#### FindRecordsUseCase
البحث عن سجلات متعددة في قاعدة البيانات.

#### InsertRecordUseCase
إدراج سجل جديد في قاعدة البيانات.

#### UpdateRecordUseCase
تحديث سجل موجود في قاعدة البيانات.

#### DeleteRecordUseCase
حذف سجل من قاعدة البيانات.

#### CountRecordsUseCase
عد السجلات المطابقة لشروط معينة.

### Audit Use Cases
(قيد التطوير)

## Services

### DatabaseCoreService
الخدمة الرئيسية لنواة قاعدة البيانات. تستخدم Use Cases لتنفيذ العمليات.

## DTOs

### DatabaseRequest
DTO لتمثيل طلبات قاعدة البيانات.

### DatabaseResponse
DTO لتمثيل استجابات قاعدة البيانات.

## المبادئ

1. **Use Cases**: كل Use Case مسؤول عن عملية واحدة محددة
2. **Services**: Services تستخدم Use Cases لتنفيذ العمليات المعقدة
3. **DTOs**: DTOs لتمثيل البيانات المنقولة بين الطبقات
4. **Dependency Inversion**: استخدام Interfaces من Domain Layer
