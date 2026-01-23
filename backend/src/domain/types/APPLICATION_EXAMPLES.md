# أمثلة التطبيق - Domain Types

## 📋 نظرة عامة

هذا الملف يحتوي على أمثلة عملية لتطبيق الأنواع الجديدة في الكود الموجود.

---

## 🎯 مثال 1: استخدام Response Helper في Handler

### ❌ قبل (يدوي):
```typescript
res.status(200).json({
  success: true,
  data: result,
})

res.status(400).json({
  success: false,
  error: {
    message: 'خطأ',
    code: 'ERROR',
  },
})
```

### ✅ بعد (باستخدام Response Helper):
```typescript
import { sendSuccess, sendError, sendValidationError, handleError } from '@/presentation/api/utils/response.helper'

// نجاح
sendSuccess(res, result, 'تم بنجاح', 200)

// خطأ
sendError(res, { message: 'خطأ', code: 'ERROR' }, 400)

// Validation Error
sendValidationError(res, 'بيانات غير صحيحة', [
  { field: 'email', message: 'البريد غير صحيح' }
], 422)

// معالجة خطأ عام
handleError(res, error, 'حدث خطأ', 'INTERNAL_SERVER_ERROR')
```

---

## 🎯 مثال 2: استخدام Database Types في Repository

### ❌ قبل:
```typescript
export class UserRepository {
  async find(conditions: any): Promise<UserData[]> {
    // ...
  }
}
```

### ✅ بعد:
```typescript
import {
  IDatabaseRepository,
  DatabaseQueryConditions,
  DatabaseQueryOptions,
} from '@/domain/types'

export class UserRepository implements IDatabaseRepository<UserData> {
  async find(
    conditions?: DatabaseQueryConditions,
    options?: DatabaseQueryOptions
  ): Promise<UserData[]> {
    // استخدام شروط متقدمة
    const query: DatabaseQueryConditions = {
      role: 'student',
      created_at: {
        $gte: '2024-01-01',
        $lte: '2024-12-31',
      },
      $or: [
        { is_active: true },
        { is_verified: true },
      ],
    }

    const queryOptions: DatabaseQueryOptions = {
      limit: options?.limit || 20,
      offset: options?.offset || 0,
      orderBy: { column: 'created_at', direction: 'desc' },
    }

    // ...
  }
}
```

---

## 🎯 مثال 3: استخدام Validation Types في Service

### ❌ قبل:
```typescript
function validateUser(data: any): boolean {
  if (!data.email) return false
  if (!data.password || data.password.length < 8) return false
  return true
}
```

### ✅ بعد:
```typescript
import {
  ValidationSchema,
  ValidationHelper,
  BuiltInValidators,
} from '@/domain/types'

const userSchema: ValidationSchema = {
  email: {
    required: true,
    type: 'email',
    custom: BuiltInValidators.email,
  },
  password: {
    required: true,
    minLength: 8,
    custom: BuiltInValidators.strongPassword,
  },
  age: {
    type: 'number',
    min: 18,
    max: 100,
  },
}

function validateUser(data: unknown): ValidationResult {
  // استخدام Validation Service
  const result = ValidationHelper.createResult(true, [])
  
  // التحقق من البيانات
  if (!result.isValid) {
    return ValidationHelper.createResult(false, result.errors)
  }
  
  return result
}
```

---

## 🎯 مثال 4: استخدام Event Types

### ❌ قبل:
```typescript
// إرسال حدث يدوياً
await someService.sendEvent('user.created', userData)
```

### ✅ بعد:
```typescript
import { Event, IEventBus, EventType } from '@/domain/types'

const event: Event<UserData> = {
  id: generateId(),
  type: 'user.created',
  payload: userData,
  priority: 'normal',
  status: 'pending',
  source: 'auth-service',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

await eventBus.emit('user.created', userData, {
  priority: 'normal',
  metadata: { source: 'auth-service' },
})

// الاستماع للأحداث
eventBus.on({
  eventType: 'user.created',
  handler: async (event) => {
    // معالجة الحدث
    console.log('User created:', event.payload)
  },
})
```

---

## 🎯 مثال 5: استخدام WebSocket Types

### ❌ قبل:
```typescript
// إرسال رسالة WebSocket يدوياً
ws.send(JSON.stringify({ type: 'notification', data: notification }))
```

### ✅ بعد:
```typescript
import { WebSocketMessage, IWebSocketServer } from '@/domain/types'

const message: WebSocketMessage<NotificationData> = {
  type: 'notification',
  payload: notificationData,
  timestamp: new Date().toISOString(),
  userId: 'user-123',
}

await webSocketServer.send(connectionId, message)

// أو البث لجميع المشتركين
await webSocketServer.broadcast(message, {
  channel: 'notifications',
  filters: (conn) => conn.userId === 'user-123',
})
```

---

## 🎯 مثال 6: استخدام File Types

### ❌ قبل:
```typescript
// رفع ملف بدون types واضحة
await uploadFile(file, { maxSize: 10000000 })
```

### ✅ بعد:
```typescript
import { FileUploadOptions, FileType } from '@/domain/types'

const uploadOptions: FileUploadOptions = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/*', 'application/pdf'],
  allowedExtensions: ['.jpg', '.png', '.pdf'],
  generateThumbnail: true,
  compress: true,
  resize: {
    width: 1920,
    height: 1080,
    quality: 85,
  },
  tags: ['profile', 'avatar'],
  metadata: { source: 'user-upload' },
}

const file = await fileService.upload(fileData, uploadOptions)
```

---

## 🎯 مثال 7: استخدام Cache Types

### ❌ قبل:
```typescript
// استخدام cache بدون types
cache.set('user:123', userData, 3600)
const user = cache.get('user:123')
```

### ✅ بعد:
```typescript
import { ICache, CacheOptions } from '@/domain/types'

const cacheOptions: CacheOptions = {
  ttl: 3600, // 1 hour
  tags: ['user', 'profile'],
  strategy: 'cache-aside',
  compress: true,
}

await cache.set('user:123', userData, cacheOptions)
const user = await cache.get<UserData>('user:123')

// إبطال بالـ tags
await cache.invalidate({ pattern: '*', tags: ['user'] })
```

---

## 🎯 مثال 8: استخدام Job Types

### ❌ قبل:
```typescript
// إضافة مهمة بدون types
await queue.add('email', emailData)
```

### ✅ بعد:
```typescript
import { IJobQueue, JobType, JobOptions } from '@/domain/types'

const jobOptions: JobOptions = {
  priority: 'high',
  attempts: 3,
  delay: 5000, // 5 seconds
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
  timeout: 30000, // 30 seconds
  metadata: { source: 'notification-service' },
}

await jobQueue.add('email', emailData, jobOptions)

// معالجة المهام
jobQueue.process('email', async (job) => {
  // job.payload contains emailData
  await emailService.send(job.payload)
})
```

---

## 🎯 مثال 9: استخدام Email Types

### ❌ قبل:
```typescript
// إرسال بريد بدون types واضحة
await sendEmail(to, subject, body)
```

### ✅ بعد:
```typescript
import { IEmailService, EmailTemplate } from '@/domain/types'

// إرسال بريد عادي
await emailService.send({
  to: 'user@example.com',
  subject: 'مرحباً',
  html: '<p>مرحباً بك</p>',
  priority: 'normal',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
})

// إرسال بريد من قالب
await emailService.sendTemplate(
  'welcome-email',
  'user@example.com',
  {
    name: 'أحمد',
    activationLink: 'https://example.com/activate?token=...',
  },
  {
    priority: 'high',
  }
)
```

---

## 🎯 مثال 10: استخدام Report Types

### ❌ قبل:
```typescript
// توليد تقرير بدون types
await generateReport('pdf', data)
```

### ✅ بعد:
```typescript
import { IReportService, ReportGenerationRequest, PDFReportOptions } from '@/domain/types'

const request: ReportGenerationRequest = {
  name: 'تقرير المستخدمين',
  type: 'pdf',
  templateId: 'user-report-template',
  data: usersData,
  filters: {
    role: 'student',
    created_at: { $gte: '2024-01-01' },
  },
  options: {
    includeCharts: true,
    includeTables: true,
    language: 'ar',
    timezone: 'Asia/Muscat',
  },
}

const report = await reportService.generate(request)
```

---

## 🎯 مثال 11: استخدام Analytics Types

### ❌ قبل:
```typescript
// تحليلات بدون types
const stats = await getAnalytics('users', 'last_30_days')
```

### ✅ بعد:
```typescript
import { IAnalyticsService, AnalyticsQuery, AnalyticsTimeRange } from '@/domain/types'

const query: AnalyticsQuery = {
  metrics: ['total_users', 'active_users', 'new_users'],
  dimensions: ['date', 'role'],
  timeRange: 'last_30_days',
  filters: {
    is_active: true,
  },
  groupBy: ['date', 'role'],
  orderBy: {
    metric: 'total_users',
    direction: 'desc',
  },
}

const result = await analyticsService.query(query)
```

---

## 🎯 مثال 12: استخدام Export/Import Types

### ❌ قبل:
```typescript
// تصدير بدون types
await exportData('users', 'csv')
```

### ✅ بعد:
```typescript
import { IExportImportService, ExportFormat, ExportOptions } from '@/domain/types'

const exportRequest = {
  name: 'تصدير المستخدمين',
  format: 'csv' as ExportFormat,
  entityType: 'users',
  filters: { role: 'student' },
  fields: ['id', 'email', 'first_name', 'last_name'],
  options: {
    includeHeaders: true,
    encoding: 'utf-8-bom',
    delimiter: ',',
    dateFormat: 'YYYY-MM-DD',
  },
  exportedBy: 'user-123',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const exportResult = await exportImportService.export(exportRequest)
```

---

## 🎯 مثال 13: استخدام Utility Types

### ❌ قبل:
```typescript
// استخدام any أو types غير دقيقة
function processData(data: any): any {
  // ...
}
```

### ✅ بعد:
```typescript
import {
  DeepPartial,
  DeepRequired,
  Prettify,
  MakeOptional,
  Paths,
  PathValue,
} from '@/domain/types'

// Deep Partial
type PartialUser = DeepPartial<UserData>

// Deep Required
type RequiredUser = DeepRequired<PartialUser>

// Prettify
type CleanType = Prettify<ComplexType>

// Make Optional
type UserUpdate = MakeOptional<UserData, 'created_at' | 'updated_at'>

// Paths
type UserPaths = Paths<UserData> // 'id' | 'email' | 'first_name' | ...

// Path Value
type UserEmail = PathValue<UserData, 'email'>
```

---

## 📝 ملاحظات مهمة

1. **التطبيق التدريجي**: لا تحاول تحديث كل شيء دفعة واحدة
2. **الاختبار**: اختبر كل تغيير قبل الانتقال للتالي
3. **التراجع**: احتفظ بنسخة احتياطية
4. **التوثيق**: وثّق التغييرات

---

## 🆘 الدعم

راجع:
- `IMPLEMENTATION_GUIDE.md` - دليل التطبيق
- `README.md` - دليل الاستخدام
- `ADVANCED_FEATURES.md` - الميزات المتقدمة

---

**تاريخ الإنشاء:** 2024
**الحالة:** ✅ جاهز للاستخدام

