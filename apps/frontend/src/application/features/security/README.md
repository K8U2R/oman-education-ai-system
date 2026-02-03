# 🔐 Security Feature - ميزة الأمان

**الحالة:** ✅ مكتمل  
**الإصدار:** 2.0.0  
**آخر تحديث:** 2025-01-08

---

## 📋 نظرة عامة

قسم مخصص لإدارة جميع جوانب الأمان والمصادقة في النظام. يوفر إدارة الجلسات، مراقبة الأمان، التحليلات، والإحصائيات.

---

## 📁 الهيكل

```
security/
├── hooks/              # Custom Hooks
│   ├── useSecurity.ts
│   ├── useSessions.ts
│   ├── useAnalytics.ts
│   ├── useMonitoring.ts
│   └── index.ts
├── services/           # Services للتواصل مع Backend
│   ├── security.service.ts
│   ├── session.service.ts
│   ├── analytics.service.ts
│   ├── monitoring.service.ts
│   └── index.ts
├── store/              # Zustand Stores
│   ├── securityStore.ts
│   ├── sessionStore.ts
│   ├── analyticsStore.ts
│   ├── monitoringStore.ts
│   └── index.ts
├── types/              # TypeScript Types
│   ├── security.types.ts
│   ├── session.types.ts
│   ├── analytics.types.ts
│   ├── monitoring.types.ts
│   └── index.ts
├── constants/          # Constants
│   ├── security.constants.ts
│   └── index.ts
├── utils/              # Utilities
│   ├── security.utils.ts
│   └── index.ts
├── index.ts            # Barrel Export الرئيسي
└── README.md           # هذا الملف
```

## 🎯 الميزات

### 1. إدارة الأمان (Security Management)

- ✅ إحصائيات الأمان
- ✅ سجلات الأمان
- ✅ إعدادات الأمان
- ✅ قواعد حماية المسارات
- ✅ تنبيهات الأمان

### 2. إدارة الجلسات (Session Management)

- ✅ عرض الجلسات النشطة
- ✅ إنهاء الجلسات
- ✅ تفاصيل الجلسة
- ✅ تحديث الجلسة

## 💻 الاستخدام

### استخدام Hook

```typescript
import {
  useSecurity,
  useSessions,
  useAnalytics,
  useMonitoring,
} from '@/application/features/security/hooks'

// استخدام useSecurity
const MyComponent = () => {
  const { stats, logs, settings, loadStats, loadLogs } = useSecurity()

  useEffect(() => {
    loadStats()
    loadLogs()
  }, [loadStats, loadLogs])

  // ...
}

// استخدام useSessions
const SessionsComponent = () => {
  const { sessions, isLoading, loadSessions, terminateSession } = useSessions()

  // ...
}

// استخدام useAnalytics
const AnalyticsComponent = () => {
  const { report, metrics, loadReport } = useAnalytics('7d')

  // ...
}

// استخدام useMonitoring
const MonitoringComponent = () => {
  const { health, metrics, alerts, loadHealth } = useMonitoring()

  // ...
}
```

### استخدام Service

```typescript
import {
  securityService,
  sessionService,
  securityAnalyticsService,
  securityMonitoringService,
} from '@/application/features/security/services'

// الحصول على إحصائيات الأمان
const stats = await securityService.getSecurityStats()

// الحصول على سجلات الأمان
const logs = await securityService.getSecurityLogs({ eventType: 'failed_login' })

// تحديث إعدادات الأمان
await securityService.updateSecuritySettings({ requireEmailVerification: true })

// الحصول على الجلسات
const sessions = await sessionService.getUserSessions()

// إنهاء جلسة
await sessionService.terminateSession(sessionId)

// الحصول على تقرير التحليلات
const report = await securityAnalyticsService.getAnalyticsReport({
  period: '7d',
})

// الحصول على حالة صحة النظام
const health = await securityMonitoringService.getSystemHealth()
```

### استخدام Utils

```typescript
import {
  isValidIPAddress,
  isSessionExpired,
  formatSecurityEventType,
  formatSecurityEventSeverity,
  getSeverityColor,
  calculateSystemHealthScore,
  formatSessionTime,
} from '@/application/features/security/utils'

// التحقق من عنوان IP
const isValid = isValidIPAddress('192.168.1.1')

// التحقق من انتهاء الجلسة
const expired = isSessionExpired(session)

// تنسيق نوع الحدث
const typeFormatted = formatSecurityEventType('login_failed') // "فشل تسجيل الدخول"

// تنسيق مستوى الخطورة
const severityFormatted = formatSecurityEventSeverity('critical') // "حرج"

// الحصول على لون الخطورة
const color = getSeverityColor('critical') // "#dc2626"

// حساب درجة صحة النظام
const score = calculateSystemHealthScore({
  failedLoginAttempts24h: 5,
  securityAlerts: 2,
  criticalAlerts: 0,
  blockedIPs: 1,
})

// تنسيق وقت الجلسة
const timeFormatted = formatSessionTime(session.createdAt) // "منذ 5 دقائق"
```

### استخدام Constants

```typescript
import {
  SECURITY_CONFIG,
  SECURITY_EVENT_TYPES,
  SECURITY_EVENT_SEVERITY,
  SYSTEM_HEALTH_STATUS,
} from '@/application/features/security/constants'

// استخدام Configuration
const sessionTimeout = SECURITY_CONFIG.SESSION.DEFAULT_TIMEOUT
const errorMessage = SECURITY_CONFIG.ERROR_MESSAGES.SESSION_NOT_FOUND

// استخدام Event Types
const loginSuccessType = SECURITY_EVENT_TYPES.LOGIN_SUCCESS

// استخدام Severity
const criticalSeverity = SECURITY_EVENT_SEVERITY.CRITICAL

// استخدام Health Status
const healthyStatus = SYSTEM_HEALTH_STATUS.HEALTHY
```

## 🔗 التكاملات

### مع الميزات الأخرى:

- **auth/**: يستخدم security لإدارة الأمان والجلسات
- **admin/**: يستخدم security لعرض لوحة تحكم الأمان
- **developer/**: يستخدم security لعرض التحليلات والمراقبة

---

## 📝 ملاحظات

- جميع Types منظمة في `types/`
- Services منفصلة (Security, Session, Analytics, Monitoring)
- Stores منفصلة لكل قسم
- يدعم Real-time Monitoring
- يدعم Analytics والتقارير
- يدعم Export للسجلات

---

## 🧪 الاختبار

```typescript
import { describe, it, expect } from 'vitest'
import { useSecurity } from './hooks/useSecurity'
import { renderHook } from '@testing-library/react'

describe('useSecurity', () => {
  it('should load security stats successfully', async () => {
    const { result } = renderHook(() => useSecurity())
    // ...
  })
})
```

---

## 📚 المراجع

- [Domain Types](../../../domain/types/auth.types.ts)
- [API Constants](../../../domain/constants/api.constants.ts)

---

**آخر تحديث:** 2025-01-08  
**الإصدار:** 2.0.0
