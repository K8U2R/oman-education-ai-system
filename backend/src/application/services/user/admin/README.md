# Admin Service - خدمة الإدارة

**الحالة:** ✅ مكتمل  
**الإصدار:** 2.0.0  
**آخر تحديث:** 2026-01-09

---

## 📋 نظرة عامة

خدمة الإدارة في النظام. توفر جميع الوظائف المتعلقة بإدارة النظام، المستخدمين، المحتوى، والمراقبة.

---

## 🎯 الهدف

توفير نظام إدارة شامل يدعم:

- عرض إحصائيات النظام الشاملة
- إدارة المستخدمين (عرض، تحديث، حذف)
- إحصائيات المحتوى (دروس، مسارات تعليمية)
- إحصائيات الاستخدام (جلسات، طلبات)
- مراقبة أنشطة المستخدمين

---

## 📁 الهيكل

```
admin/
├── AdminService.ts              # Service الرئيسي للإدارة
├── AdminService.test.ts         # Unit Tests
└── index.ts                     # Barrel Export
```

---

## 🔧 المكونات الرئيسية

### AdminService

الخدمة الرئيسية للإدارة. توفر:

- `getSystemStats()` - الحصول على إحصائيات النظام
- `getUserStats()` - الحصول على إحصائيات المستخدمين
- `getContentStats()` - الحصول على إحصائيات المحتوى
- `getUsageStats()` - الحصول على إحصائيات الاستخدام
- `getUsers()` - الحصول على قائمة المستخدمين
- `getUser()` - الحصول على مستخدم واحد
- `updateUser()` - تحديث مستخدم
- `deleteUser()` - حذف مستخدم
- `getUserActivities()` - الحصول على أنشطة المستخدم

**الاستخدام:**

```typescript
import { AdminService } from '@/application/services/admin'

const adminService = new AdminService(databaseAdapter)

// الحصول على إحصائيات النظام
const stats = await adminService.getSystemStats()

// البحث عن المستخدمين
const users = await adminService.getUsers({
  query: 'ahmed',
  role: 'student',
  page: 1,
  perPage: 20
})
```

---

## 🔗 التكامل

### مع Database-Core

- يستخدم `DatabaseRouter` للوصول إلى قاعدة البيانات
- يستخدم `PolicyEngine` للتحقق من
- يستخدم `AuditLogger` لتسجيل جميع العمليات

### مع Use Cases

- `GetSystemStatsUseCase` - Use Case للحصول على إحصائيات النظام
- `GetUserStatsUseCase` - Use Case للحصول على إحصائيات المستخدمين
- `UpdateUserUseCase` - Use Case لتحديث مستخدم
- `DeleteUserUseCase` - Use Case لحذف مستخدم

---

## 📊 API Endpoints

### Statistics

- `GET /api/admin/stats/system` - إحصائيات النظام
- `GET /api/admin/stats/users` - إحصائيات المستخدمين
- `GET /api/admin/stats/content` - إحصائيات المحتوى
- `GET /api/admin/stats/usage` - إحصائيات الاستخدام

### Users

- `GET /api/admin/users` - قائمة المستخدمين
- `GET /api/admin/users/:id` - مستخدم واحد
- `PATCH /api/admin/users/:id` - تحديث مستخدم
- `DELETE /api/admin/users/:id` - حذف مستخدم

### Activities

- `GET /api/admin/users/:id/activities` - أنشطة المستخدم

---

## 🧪 Testing

### Unit Tests

- ✅ `AdminService.test.ts` - Tests للخدمة الرئيسية

### Test Coverage

- **AdminService**: ✅ شامل

---

## 🔒 الأمان

### Features

- ✅ Permission-based Access Control (Admin only)
- ✅ Audit Logging
- ✅ Input Validation
- ✅ Rate Limiting

### Best Practices

- التحقق من  قبل الوصول (Admin role required)
- تسجيل جميع العمليات
- التحقق من صحة البيانات المدخلة
- Rate Limiting على جميع Endpoints

---

## 📝 ملاحظات

### التكامل مع Database-Core

- جميع العمليات تمر عبر `DatabaseRouter`
- استخدام `PolicyEngine` للتحقق من
- استخدام `AuditLogger` لتسجيل جميع العمليات

### Statistics Caching

- System Stats: TTL 2 دقيقة
- User Stats: TTL 5 دقائق
- Content Stats: TTL 5 دقائق
- Usage Stats: TTL 1 دقيقة

---

## 🚀 الاستخدام

### Basic Usage

```typescript
import { AdminService } from '@/application/services/admin'

const adminService = new AdminService(databaseAdapter)

// الحصول على إحصائيات النظام
const systemStats = await adminService.getSystemStats()

// البحث عن المستخدمين
const users = await adminService.getUsers({
  query: 'ahmed',
  role: 'student'
})
```

### Advanced Usage

```typescript
// تحديث مستخدم
await adminService.updateUser('user-123', {
  is_active: false,
  role: 'admin'
})

// الحصول على أنشطة المستخدم
const activities = await adminService.getUserActivities('user-123')
```

---

## ✅ Checklist

- [x] AdminService Implementation
- [x] Unit Tests
- [x] Error Handling
- [x] Documentation
- [x] Permission Checks

---

**تم إعداد الوثائق بواسطة:** AI Assistant  
**التاريخ:** 2026-01-09  
**الإصدار:** 2.0.0
