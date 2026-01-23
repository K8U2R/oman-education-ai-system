# 👨‍💼 Admin Feature - ميزة الإدارة

**الحالة:** ✅ مكتمل  
**الإصدار:** 2.0.0  
**آخر تحديث:** 2025-01-08

---

## 📋 نظرة عامة

ميزة الإدارة في النظام. تتيح للمسؤولين عرض إحصائيات النظام، إدارة المستخدمين، ومراقبة الأداء.

---

## 🎯 الهدف

تمكين المسؤولين من:

- عرض إحصائيات النظام الشاملة
- إدارة المستخدمين
- مراقبة الأداء والاستخدام
- عرض أنشطة المستخدمين

---

## 📁 الهيكل

```
admin/
├── hooks/                    # Custom Hooks
│   └── (سيتم إضافتها لاحقاً)
├── services/                  # Services
│   ├── admin.service.ts      # Service الرئيسي
│   └── index.ts
├── store/                     # State Management
│   ├── adminStore.ts         # Zustand Store
│   └── index.ts
├── types/                     # TypeScript Types
│   ├── admin.types.ts        # أنواع الإدارة
│   └── index.ts
├── constants/                 # Constants
│   ├── admin.constants.ts    # ثوابت الإدارة
│   └── index.ts
├── utils/                     # Utilities
│   ├── admin.utils.ts        # دوال مساعدة
│   └── index.ts
├── index.ts                   # Barrel Export الرئيسي
└── README.md                  # هذا الملف
```

---

## 🚀 الميزات

### 1. إحصائيات النظام

- إحصائيات النظام العامة
- حالة قاعدة البيانات
- حالة الخادم
- استخدام الموارد

### 2. إحصائيات المستخدمين

- إجمالي المستخدمين
- المستخدمين النشطين
- المستخدمين الموثقين
- التوزيع حسب الدور

### 3. إحصائيات المحتوى

- إجمالي الدروس
- الدروس المنشورة
- المسارات التعليمية
- التوزيع حسب الموضوع والصف

### 4. إحصائيات الاستخدام

- إجمالي الجلسات
- الجلسات النشطة
- طلبات API
- ساعات الذروة

### 5. إدارة المستخدمين

- البحث عن المستخدمين
- تحديث المستخدمين
- حذف المستخدمين
- عرض أنشطة المستخدمين

---

## 💻 الاستخدام

### استخدام Service

```typescript
import { adminService } from '@/application/features/admin/services'

// جلب إحصائيات النظام
const systemStats = await adminService.getSystemStats()

// جلب إحصائيات المستخدمين
const userStats = await adminService.getUserStats()

// جلب إحصائيات المحتوى
const contentStats = await adminService.getContentStats()

// جلب إحصائيات الاستخدام
const usageStats = await adminService.getUsageStats()

// البحث عن المستخدمين
const { users, total } = await adminService.searchUsers({
  query: 'search',
  role: 'student',
  page: 1,
  per_page: 20,
})

// تحديث مستخدم
const updated = await adminService.updateUser('user-id', {
  role: 'teacher',
  isActive: true,
})

// حذف مستخدم
await adminService.deleteUser('user-id')

// جلب أنشطة المستخدمين
const activities = await adminService.getUserActivities()
```

### استخدام Store

```typescript
import { useAdminStore } from '@/application/features/admin/store'

const MyComponent = () => {
  const {
    systemStats,
    userStats,
    contentStats,
    usageStats,
    users,
    isLoading,
    fetchSystemStats,
    fetchUserStats,
    fetchContentStats,
    fetchUsageStats,
    searchUsers,
    updateUser,
    deleteUser,
  } = useAdminStore()

  useEffect(() => {
    fetchSystemStats()
    fetchUserStats()
    fetchContentStats()
    fetchUsageStats()
  }, [fetchSystemStats, fetchUserStats, fetchContentStats, fetchUsageStats])

  // ...
}
```

### استخدام Utils

```typescript
import {
  formatSystemHealthStatus,
  getSystemHealthStatusColor,
  formatDatabaseStatus,
  getDatabaseStatusColor,
  formatServerStatus,
  getServerStatusColor,
  formatMemoryUsage,
  formatCPUUsage,
  calculateActiveUsersPercentage,
  calculateVerifiedUsersPercentage,
  formatRequestCount,
  formatLastLogin,
} from '@/application/features/admin/utils'

// تنسيق حالة صحة النظام
const statusFormatted = formatSystemHealthStatus('healthy') // "صحي"
const statusColor = getSystemHealthStatusColor('healthy') // "#22c55e"

// تنسيق حالة قاعدة البيانات
const dbStatusFormatted = formatDatabaseStatus('connected') // "متصل"
const dbStatusColor = getDatabaseStatusColor('connected') // "#22c55e"

// تنسيق استخدام الذاكرة
const memoryFormatted = formatMemoryUsage(1024 * 1024 * 1024) // "1 GB"

// تنسيق استخدام CPU
const cpuFormatted = formatCPUUsage(75.5) // "75.5%"

// حساب النسب
const activePercentage = calculateActiveUsersPercentage(userStats)
const verifiedPercentage = calculateVerifiedUsersPercentage(userStats)

// تنسيق عدد الطلبات
const requestsFormatted = formatRequestCount(1500) // "1.5K"

// تنسيق آخر تسجيل دخول
const lastLoginFormatted = formatLastLogin(user.last_login) // "اليوم" أو "أمس"
```

### استخدام Constants

```typescript
import {
  ADMIN_CONFIG,
  SYSTEM_HEALTH_STATUS,
  DATABASE_STATUS,
  SERVER_STATUS,
} from '@/application/features/admin/constants'

// استخدام Configuration
const defaultPageSize = ADMIN_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE
const errorMessage = ADMIN_CONFIG.ERROR_MESSAGES.USER_NOT_FOUND

// استخدام System Health Status
const healthy = SYSTEM_HEALTH_STATUS.HEALTHY

// استخدام Database Status
const connected = DATABASE_STATUS.CONNECTED

// استخدام Server Status
const active = SERVER_STATUS.ACTIVE
```

---

## 🔗 التكاملات

### مع الميزات الأخرى:

- **auth/**: يحتاج auth للوصول إلى الإدارة
- **security/**: يمكن عرض إحصائيات الأمان
- **notifications/**: يمكن عرض إحصائيات الإشعارات

---

## 📝 ملاحظات

- جميع Types منظمة في `types/`
- Store يستخدم Zustand مع devtools
- يدعم Pagination والبحث والتصفية
- يدعم تحديث الإحصائيات التلقائي

---

## 🧪 الاختبار

```typescript
import { describe, it, expect } from 'vitest'
import { useAdminStore } from './store/adminStore'

describe('useAdminStore', () => {
  it('should fetch system stats successfully', async () => {
    const store = useAdminStore.getState()
    await store.fetchSystemStats()
    // ...
  })
})
```

---

## 📚 المراجع

- [API Constants](../../../domain/constants/api.constants.ts)

---

**آخر تحديث:** 2025-01-08  
**الإصدار:** 2.0.0
