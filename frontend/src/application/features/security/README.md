# 🔐 Security Feature - ميزة الأمان

قسم مخصص لإدارة جميع جوانب الأمان والمصادقة في النظام.

## 📁 الهيكل

```
security/
├── hooks/              # Custom Hooks
├── services/           # Services للتواصل مع Backend
├── store/              # Zustand Stores
└── types/              # TypeScript Types
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

## 📚 الاستخدام

### Security Service

```typescript
import { securityService } from '@/application/features/security/services'

// الحصول على إحصائيات الأمان
const stats = await securityService.getSecurityStats()

// الحصول على سجلات الأمان
const logs = await securityService.getSecurityLogs({ eventType: 'failed_login' })

// تحديث إعدادات الأمان
await securityService.updateSecuritySettings({ requireEmailVerification: true })
```

### Session Service

```typescript
import { sessionService } from '@/application/features/security/services'

// الحصول على الجلسات
const sessions = await sessionService.getUserSessions()

// إنهاء جلسة
await sessionService.terminateSession(sessionId)
```

## 🔗 الصفحات المرتبطة

- `/admin/security/dashboard` - لوحة تحكم الأمان (Admin)
- `/admin/security/sessions` - إدارة الجلسات (Admin)
- `/admin/security/logs` - سجلات الأمان (Admin)
- `/admin/security/settings` - إعدادات الأمان (Admin)
- `/security/settings` - إعدادات الأمان الشخصية (User)
- `/security/sessions` - الجلسات النشطة (User)
- `/security/history` - سجل تسجيلات الدخول (User)
