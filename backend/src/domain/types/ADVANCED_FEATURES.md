# الميزات المتقدمة - Domain Types

## 📋 نظرة عامة

تم إضافة أنواع متقدمة لجميع العمليات الأساسية في النظام:
- Database Operations
- Validation
- Events System
- WebSocket Messages
- File Operations
- Caching

---

## 🗄️ Database Types

### الميزات:
- **DatabaseOperation** - بنية موحدة لعمليات قاعدة البيانات
- **DatabaseQueryConditions** - شروط استعلام متقدمة مع operators
- **DatabaseQueryOptions** - خيارات الاستعلام (pagination, sorting, etc.)
- **IDatabaseRepository** - واجهة موحدة للمستودعات
- **DatabaseTransaction** - دعم المعاملات
- **DatabaseHealthCheck** - فحص صحة قاعدة البيانات

### الاستخدام:
```typescript
import { DatabaseOperation, DatabaseQueryConditions, IDatabaseRepository } from '@/domain/types'

const operation: DatabaseOperation<UserData> = {
  operation: 'FIND',
  entity: 'users',
  conditions: {
    role: 'student',
    created_at: { $gte: '2024-01-01' }
  },
  options: {
    limit: 10,
    offset: 0,
    orderBy: { column: 'created_at', direction: 'desc' }
  }
}
```

---

## ✅ Validation Types

### الميزات:
- **ValidationRule** - قواعد التحقق المرنة
- **ValidationSchema** - مخططات التحقق المعقدة
- **FieldValidationError** - أخطاء التحقق التفصيلية
- **BuiltInValidators** - محققات جاهزة (email, url, uuid, etc.)
- **ValidationHelper** - دوال مساعدة للتحقق

### الاستخدام:
```typescript
import { ValidationSchema, ValidationHelper, BuiltInValidators } from '@/domain/types'

const schema: ValidationSchema = {
  email: {
    required: true,
    type: 'email',
    custom: BuiltInValidators.email
  },
  password: {
    required: true,
    minLength: 8,
    custom: BuiltInValidators.strongPassword
  }
}

const result = ValidationHelper.createResult(true, [])
```

---

## 📡 Event Types

### الميزات:
- **Event** - بنية موحدة للأحداث
- **IEventEmitter** - واجهة لإرسال الأحداث
- **IEventBus** - حافلة الأحداث الكاملة
- **EventMiddleware** - وسائط للأحداث
- **EventStatistics** - إحصائيات الأحداث

### الاستخدام:
```typescript
import { Event, IEventEmitter, EventType } from '@/domain/types'

const event: Event<UserData> = {
  id: 'event-123',
  type: 'user.created',
  payload: userData,
  priority: 'normal',
  status: 'pending',
  source: 'auth-service',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

await eventEmitter.emit('user.created', userData)
```

---

## 🔌 WebSocket Types

### الميزات:
- **WebSocketMessage** - بنية موحدة لرسائل WebSocket
- **WebSocketConnection** - إدارة الاتصالات
- **WebSocketChannel** - نظام القنوات
- **IWebSocketServer** - واجهة خادم WebSocket
- **WebSocketStatistics** - إحصائيات WebSocket

### الاستخدام:
```typescript
import { WebSocketMessage, IWebSocketServer, WebSocketMessageType } from '@/domain/types'

const message: WebSocketMessage<NotificationData> = {
  type: 'notification',
  payload: notificationData,
  timestamp: new Date().toISOString(),
  userId: 'user-123'
}

await webSocketServer.broadcast(message, {
  channel: 'notifications',
  filters: (conn) => conn.userId === 'user-123'
})
```

---

## 📁 File Types

### الميزات:
- **File** - بنية موحدة للملفات
- **FileUploadOptions** - خيارات رفع متقدمة
- **FileSearchOptions** - بحث متقدم عن الملفات
- **FileShare** - نظام مشاركة الملفات
- **FileVersion** - إدارة إصدارات الملفات
- **FileBatchOperation** - عمليات ملفات مجمعة

### الاستخدام:
```typescript
import { File, FileUploadOptions, FileType } from '@/domain/types'

const file: File = {
  id: 'file-123',
  name: 'document.pdf',
  originalName: 'My Document.pdf',
  path: '/files/document.pdf',
  url: 'https://cdn.example.com/files/document.pdf',
  mimeType: 'application/pdf',
  size: 1024000,
  type: 'document',
  status: 'ready',
  uploadedBy: 'user-123',
  storageProvider: 's3',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

const uploadOptions: FileUploadOptions = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['application/pdf', 'image/*'],
  generateThumbnail: true,
  compress: true
}
```

---

## 💾 Cache Types

### الميزات:
- **CacheEntry** - بنية موحدة لإدخالات التخزين المؤقت
- **ICache** - واجهة موحدة للتخزين المؤقت
- **CacheStrategy** - استراتيجيات مختلفة للتخزين المؤقت
- **CacheLock** - نظام أقفال للوصول المتزامن
- **CacheStatistics** - إحصائيات التخزين المؤقت

### الاستخدام:
```typescript
import { ICache, CacheOptions, CacheStrategy } from '@/domain/types'

const cacheOptions: CacheOptions = {
  ttl: 3600, // 1 hour
  tags: ['user', 'profile'],
  strategy: 'cache-aside',
  compress: true
}

await cache.set('user:123', userData, cacheOptions)
const user = await cache.get<UserData>('user:123')

// Invalidate by tag
await cache.invalidate({ pattern: '*', tags: ['user'] })
```

---

## 🎯 أفضل الممارسات

### 1. استخدام Database Types:
- استخدم `IDatabaseRepository` لجميع المستودعات
- استخدم `DatabaseQueryConditions` للشروط المعقدة
- استخدم `DatabaseTransaction` للمعاملات

### 2. استخدام Validation Types:
- استخدم `ValidationSchema` لجميع نماذج الإدخال
- استخدم `BuiltInValidators` للتحقق الشائع
- استخدم `ValidationHelper` لإنشاء النتائج

### 3. استخدام Event Types:
- استخدم `IEventBus` لإدارة الأحداث
- استخدم `EventMiddleware` للتحكم في التدفق
- استخدم `EventStatistics` للمراقبة

### 4. استخدام WebSocket Types:
- استخدم `IWebSocketServer` لإدارة الاتصالات
- استخدم `WebSocketChannel` للقنوات
- استخدم `WebSocketMiddleware` للأمان

### 5. استخدام File Types:
- استخدم `FileUploadOptions` لخيارات الرفع
- استخدم `FileSearchOptions` للبحث
- استخدم `FileBatchOperation` للعمليات المجمعة

### 6. استخدام Cache Types:
- استخدم `ICache` لجميع عمليات التخزين المؤقت
- استخدم `CacheStrategy` المناسب
- استخدم `CacheLock` للوصول المتزامن

---

## 📚 المراجع

- `README.md` - دليل الاستخدام العام
- `FINAL_SUMMARY.md` - الملخص النهائي
- `MIGRATION_GUIDE.md` - دليل الترحيل

---

**تاريخ الإضافة:** 2024
**الحالة:** ✅ جاهز للاستخدام

