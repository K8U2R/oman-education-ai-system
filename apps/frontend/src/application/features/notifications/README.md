# 🔔 Notifications Feature - ميزة الإشعارات

**الحالة:** ✅ مكتمل  
**الإصدار:** 2.0.0  
**آخر تحديث:** 2025-01-08

---

## 📋 نظرة عامة

ميزة الإشعارات في النظام. توفر جميع الوظائف المتعلقة بالإشعارات، الاشتراك في الوقت الفعلي، وإدارة الإشعارات.

---

## 🎯 الهدف

توفير نظام إشعارات شامل يدعم:

- إدارة الإشعارات (عرض، قراءة، حذف)
- الإشعارات الفورية (WebSocket, SSE, Polling)
- إحصائيات الإشعارات
- تصفية وترتيب الإشعارات

---

## 📁 الهيكل

```
notifications/
├── hooks/                    # Custom Hooks
│   └── (سيتم إضافتها لاحقاً)
├── services/                  # Services
│   ├── notification.service.ts  # Service الرئيسي
│   └── index.ts
├── store/                     # State Management
│   └── notificationStore.ts  # Zustand Store
├── types/                     # TypeScript Types
│   ├── notification.types.ts # أنواع الإشعارات
│   └── index.ts
├── constants/                 # Constants
│   ├── notification.constants.ts  # ثوابت الإشعارات
│   └── index.ts
├── utils/                     # Utilities
│   ├── notification.utils.ts # دوال مساعدة
│   └── index.ts
├── index.ts                   # Barrel Export الرئيسي
└── README.md                  # هذا الملف
```

---

## 🚀 الميزات

### 1. إدارة الإشعارات

- عرض قائمة الإشعارات
- تحديد الإشعارات كمقروءة
- حذف الإشعارات
- تصفية وترتيب الإشعارات

### 2. الإشعارات الفورية

- WebSocket للاتصال الفوري
- SSE (Server-Sent Events) كبديل
- Polling كبديل احتياطي
- إعادة الاتصال التلقائي

### 3. إحصائيات الإشعارات

- عدد الإشعارات غير المقروءة
- إحصائيات حسب النوع
- إحصائيات حسب الأولوية

---

## 💻 الاستخدام

### استخدام Store

```typescript
import { useNotificationStore } from '@/application/features/notifications/store'

const MyComponent = () => {
  const {
    notifications,
    stats,
    isLoading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    subscribe,
    unsubscribe,
  } = useNotificationStore()

  useEffect(() => {
    fetchNotifications()
    subscribe()
    return () => unsubscribe()
  }, [fetchNotifications, subscribe, unsubscribe])

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
  }

  return (
    <div>
      <div>الإشعارات غير المقروءة: {unreadCount}</div>
      {notifications.map(notification => (
        <div key={notification.id}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
          <button onClick={() => handleMarkAsRead(notification.id)}>
            تحديد كمقروء
          </button>
        </div>
      ))}
    </div>
  )
}
```

### استخدام Service

```typescript
import { notificationService } from '@/application/features/notifications/services'

// الحصول على الإشعارات
const { notifications, total } = await notificationService.getNotifications({
  page: 1,
  per_page: 20,
  status: 'unread',
})

// الحصول على إشعار واحد
const notification = await notificationService.getNotification('notification-id')

// تحديد إشعار كمقروء
await notificationService.markNotificationAsRead('notification-id')

// تحديد جميع الإشعارات كمقروءة
await notificationService.markAllNotificationsAsRead()

// حذف إشعار
await notificationService.deleteNotification('notification-id')

// الحصول على الإحصائيات
const stats = await notificationService.getNotificationStats()

// الاشتراك في الإشعارات الفورية
const unsubscribe = notificationService.subscribe(notification => {
  console.log('إشعار جديد:', notification)
})

// إلغاء الاشتراك
unsubscribe()
```

### استخدام Utils

```typescript
import {
  formatNotificationTime,
  formatNotificationDate,
  formatNotificationType,
  formatNotificationPriority,
  getNotificationTypeColor,
  isNotificationUnread,
  groupNotificationsByDate,
  sortNotificationsByPriority,
  countUnreadNotifications,
} from '@/application/features/notifications/utils'

// تنسيق وقت الإشعار
const timeFormatted = formatNotificationTime(notification.created_at) // "منذ 5 دقائق"

// تنسيق تاريخ الإشعار
const dateFormatted = formatNotificationDate(notification.created_at) // "اليوم" أو "أمس"

// تنسيق نوع الإشعار
const typeFormatted = formatNotificationType('message') // "رسالة"

// تنسيق الأولوية
const priorityFormatted = formatNotificationPriority('high') // "عالية"

// الحصول على لون النوع
const color = getNotificationTypeColor('success') // "#22c55e"

// التحقق من أن الإشعار غير مقروء
const isUnread = isNotificationUnread(notification)

// تجميع الإشعارات حسب التاريخ
const grouped = groupNotificationsByDate(notifications)

// ترتيب الإشعارات حسب الأولوية
const sorted = sortNotificationsByPriority(notifications)

// حساب عدد الإشعارات غير المقروءة
const unreadCount = countUnreadNotifications(notifications)
```

### استخدام Constants

```typescript
import {
  NOTIFICATION_CONFIG,
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS,
  NOTIFICATION_PRIORITY,
} from '@/application/features/notifications/constants'

// استخدام Configuration
const defaultPageSize = NOTIFICATION_CONFIG.DEFAULT_PAGE_SIZE
const errorMessage = NOTIFICATION_CONFIG.ERROR_MESSAGES.FAILED_TO_LOAD_NOTIFICATIONS

// استخدام Notification Types
const messageType = NOTIFICATION_TYPES.MESSAGE

// استخدام Status
const unreadStatus = NOTIFICATION_STATUS.UNREAD

// استخدام Priority
const highPriority = NOTIFICATION_PRIORITY.HIGH
```

---

## 🔗 التكاملات

### مع الميزات الأخرى:

- **auth/**: يحتاج auth للوصول إلى الإشعارات
- **learning/**: يمكن إرسال إشعارات عن الدروس والتقييمات
- **projects/**: يمكن إرسال إشعارات عن المشاريع
- **security/**: يمكن إرسال إشعارات أمنية

---

## 📝 ملاحظات

- جميع Types مستوردة من Domain Layer
- Store يستخدم Zustand
- يدعم WebSocket و SSE و Polling
- إعادة الاتصال التلقائي
- معالجة Rate Limiting

---

## 🧪 الاختبار

```typescript
import { describe, it, expect } from 'vitest'
import { useNotificationStore } from './store/notificationStore'

describe('useNotificationStore', () => {
  it('should fetch notifications successfully', async () => {
    const store = useNotificationStore.getState()
    await store.fetchNotifications()
    // ...
  })
})
```

---

## 📚 المراجع

- [Domain Types](../../../domain/types/notification.types.ts)
- [API Constants](../../../domain/constants/api.constants.ts)

---

**آخر تحديث:** 2025-01-08  
**الإصدار:** 2.0.0
