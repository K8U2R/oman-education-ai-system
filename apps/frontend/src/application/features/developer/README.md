# 👨‍💻 Developer Feature - ميزة المطور

**الحالة:** ✅ مكتمل  
**الإصدار:** 2.0.0  
**آخر تحديث:** 2025-01-08

---

## 📋 نظرة عامة

ميزة المطور في النظام. تتيح للمطورين عرض إحصائيات التطوير، مراقبة نقاط API، ومراقبة الخدمات والأداء.

---

## 🎯 الهدف

تمكين المطورين من:

- عرض إحصائيات التطوير
- مراقبة نقاط API
- مراقبة الخدمات
- تحليل الأداء

---

## 📁 الهيكل

```
developer/
├── hooks/                    # Custom Hooks
│   └── (سيتم إضافتها لاحقاً)
├── services/                  # Services
│   ├── developer.service.ts  # Service الرئيسي
│   └── index.ts
├── store/                     # State Management
│   ├── developerStore.ts     # Zustand Store
│   └── index.ts
├── types/                     # TypeScript Types
│   ├── developer.types.ts    # أنواع المطور
│   └── index.ts
├── constants/                 # Constants
│   ├── developer.constants.ts  # ثوابت المطور
│   └── index.ts
├── utils/                     # Utilities
│   ├── developer.utils.ts    # دوال مساعدة
│   └── index.ts
├── index.ts                   # Barrel Export الرئيسي
└── README.md                  # هذا الملف
```

---

## 🚀 الميزات

### 1. إحصائيات التطوير

- إجمالي الـ Commits
- الفروع النشطة
- تغطية الاختبارات
- حالة البناء
- عدد نقاط API
- عدد الخدمات
- معدل الخطأ

### 2. نقاط API

- معلومات كل نقطة API
- عدد الطلبات
- متوسط وقت الاستجابة
- عدد الأخطاء
- آخر استدعاء

### 3. الخدمات

- حالة كل خدمة
- وقت التشغيل
- استخدام الذاكرة
- استخدام CPU
- آخر فحص

### 4. مقاييس الأداء

- متوسط وقت الاستجابة
- P95 و P99
- عدد الطلبات
- معدل الخطأ

---

## 💻 الاستخدام

### استخدام Service

```typescript
import { developerService } from '@/application/features/developer/services'

// جلب إحصائيات المطور
const stats = await developerService.getDeveloperStats()

// جلب نقاط API
const endpoints = await developerService.getAPIEndpoints()

// جلب الخدمات
const services = await developerService.getServices()

// جلب مقاييس الأداء
const performance = await developerService.getPerformanceMetrics()
```

### استخدام Store

```typescript
import { useDeveloperStore } from '@/application/features/developer/store'

const MyComponent = () => {
  const {
    stats,
    endpoints,
    services,
    performance,
    isLoading,
    fetchStats,
    fetchEndpoints,
    fetchServices,
    fetchPerformance,
  } = useDeveloperStore()

  useEffect(() => {
    fetchStats()
    fetchEndpoints()
    fetchServices()
    fetchPerformance()
  }, [fetchStats, fetchEndpoints, fetchServices, fetchPerformance])

  // ...
}
```

### استخدام Utils

```typescript
import {
  formatBuildStatus,
  getBuildStatusColor,
  formatServiceStatus,
  getServiceStatusColor,
  formatLogLevel,
  getLogLevelColor,
  formatResponseTime,
  formatUptime,
  formatMemoryUsage,
  formatCPUUsage,
  formatErrorRate,
  formatTestCoverage,
  formatRequestCount,
  formatLastBuildTime,
  sortEndpointsByRequestCount,
  sortEndpointsByResponseTime,
  sortServicesByStatus,
  filterServicesByStatus,
} from '@/application/features/developer/utils'

// تنسيق حالة البناء
const buildStatusFormatted = formatBuildStatus('success') // "نجح"
const buildStatusColor = getBuildStatusColor('success') // "#22c55e"

// تنسيق حالة الخدمة
const serviceStatusFormatted = formatServiceStatus('healthy') // "صحي"
const serviceStatusColor = getServiceStatusColor('healthy') // "#22c55e"

// تنسيق مستوى السجل
const logLevelFormatted = formatLogLevel('error') // "خطأ"
const logLevelColor = getLogLevelColor('error') // "#ef4444"

// تنسيق وقت الاستجابة
const responseTimeFormatted = formatResponseTime(150) // "150ms"

// تنسيق وقت التشغيل
const uptimeFormatted = formatUptime(86400) // "1 يوم 0 ساعات"

// تنسيق استخدام الذاكرة
const memoryFormatted = formatMemoryUsage(1024 * 1024 * 1024) // "1 GB"

// تنسيق استخدام CPU
const cpuFormatted = formatCPUUsage(75.5) // "75.5%"

// تنسيق نسبة الخطأ
const errorRateFormatted = formatErrorRate(0.05) // "5.00%"

// تنسيق تغطية الاختبارات
const coverageFormatted = formatTestCoverage(85.5) // "85.5%"

// تنسيق عدد الطلبات
const requestsFormatted = formatRequestCount(1500) // "1.5K"

// تنسيق تاريخ آخر بناء
const lastBuildFormatted = formatLastBuildTime(stats.last_build_time) // "منذ 5 دقائق"

// ترتيب نقاط API
const sortedByRequests = sortEndpointsByRequestCount(endpoints)
const sortedByResponseTime = sortEndpointsByResponseTime(endpoints)

// ترتيب الخدمات
const sortedServices = sortServicesByStatus(services)

// تصفية الخدمات
const healthyServices = filterServicesByStatus(services, 'healthy')
```

### استخدام Constants

```typescript
import {
  DEVELOPER_CONFIG,
  BUILD_STATUS,
  SERVICE_STATUS,
  LOG_LEVELS,
} from '@/application/features/developer/constants'

// استخدام Configuration
const refreshInterval = DEVELOPER_CONFIG.REFRESH.STATS_INTERVAL
const errorMessage = DEVELOPER_CONFIG.ERROR_MESSAGES.FAILED_TO_LOAD_STATS

// استخدام Build Status
const success = BUILD_STATUS.SUCCESS

// استخدام Service Status
const healthy = SERVICE_STATUS.HEALTHY

// استخدام Log Levels
const error = LOG_LEVELS.ERROR
```

---

## 🔗 التكاملات

### مع الميزات الأخرى:

- **auth/**: يحتاج auth للوصول إلى المطور
- **admin/**: يمكن مشاركة بعض الإحصائيات
- **security/**: يمكن عرض إحصائيات الأمان

---

## 📝 ملاحظات

- جميع Types منظمة في `types/`
- Store يستخدم Zustand مع devtools
- يدعم تحديث البيانات التلقائي
- يدعم ترتيب وتصفية البيانات

---

## 🧪 الاختبار

```typescript
import { describe, it, expect } from 'vitest'
import { useDeveloperStore } from './store/developerStore'

describe('useDeveloperStore', () => {
  it('should fetch developer stats successfully', async () => {
    const store = useDeveloperStore.getState()
    await store.fetchStats()
    // ...
  })
})
```

---

## 📚 المراجع

- [Domain Types](../../../domain/types/developer.types.ts)
- [API Constants](../../../domain/constants/api.constants.ts)

---

**آخر تحديث:** 2025-01-08  
**الإصدار:** 2.0.0
