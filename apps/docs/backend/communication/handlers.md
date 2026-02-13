# دليل المعالج الأساسي (Base Handler Guide) 🛡️

يُعد `BaseCommunicationHandler` الأساس المجرد لجميع معالجات التواصل. فهو يفرض الاتساق ويقلل من تكرار الكود.

## الموقع
`apps/backend/src/presentation/api/handlers/communication/shared/BaseCommunicationHandler.ts`

## الأساليب الرئيسية (Key Methods)

### `sent(res, messageId, provider?)`
استخدم هذا عندما يتم إرسال الرسالة بنجاح *بشكل متزامن* (Synchronous).

```typescript
// الاستخدام
this.sent(res, "msg_12345", "sendgrid");

// الاستجابة
{
  "success": true,
  "message_id": "msg_12345",
  "provider": "sendgrid",
  "timestamp": "2024-02-06T10:00:00Z"
}
```

### `queued(res, jobId)`
استخدم هذا عندما يتم قبول طلب الرسالة ولكن ستتم معالجته *بشكل غير متزامن* (Asynchronous) (مثلاً، إضافته إلى طابور Redis).

```typescript
// الاستخدام
this.queued(res, "job_888");

// الاستجابة (HTTP 202 Accepted)
{
  "success": true,
  "status": "queued",
  "job_id": "job_888",
  "message": "Message queued for delivery"
}
```

## تمديد المعالج الأساسي

يجب أن يرث كل معالج قناة (Channel Handler) من هذا الصنف.

```typescript
import { BaseCommunicationHandler } from "../../shared/BaseCommunicationHandler";

export class MyNewHandler extends BaseCommunicationHandler {
    // ... التنفيذ
}
```

هذا يضمن أن معالجك يرث أيضاً ميزات `BaseHandler` القياسية مثل:
*   `ok(res, data)`
*   `created(res, data)`
*   `clientError(res, message)`
*   `unauthorized(res)`
*   `execute(res, fn)` (غلاف المحاولة والخطأ Try-Catch)
