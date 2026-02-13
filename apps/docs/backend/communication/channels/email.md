# قناة البريد الإلكتروني (Email Channel) 📧

تدير قناة البريد الإلكتروني إرسال الرسائل عبر مزودين مختلفين (SMTP, Console, RequestBin). تعتمد على `EmailHandler` لتحليل الطلب و `EmailService` لمنطق النقل.

## 📂 الموقع
`apps/backend/src/presentation/api/handlers/communication/channels/email/`

## الإعداد (Configuration)
يتم التحكم فيه عبر `ENV_CONFIG` في `apps/backend/env/`:

```bash
EMAIL_PROVIDER="console" # الخيارات: console, smtp, sendgrid, ses
EMAIL_FROM="no-reply@k8u2r.online"
```

## مرجع واجهة برمجة التطبيقات (API Reference)

### 1. إرسال بريد إلكتروني
يرسل بريداً إلكترونياً للمعاملات (Transactional Email).

*   **نقطة النهاية**: `POST /api/v1/communication/email/send`
*   **الجسم (Body)**:
    ```json
    {
      "to": "user@example.com",
      "subject": "مرحباً بك في نظام عمان للذكاء الاصطناعي",
      "template": "welcome",
      "variables": { "name": "علي" }
    }
    ```
*   **الاستجابة**: `200 OK` (إذا كان متزامناً) أو `202 Accepted` (إذا كان في الطابور).

## تفاصيل التنفيذ

### نموذج المعالج (`EmailHandler.ts`)
حالياً، المعالج عبارة عن نموذج (stub) جاهز للتنفيذ.

```typescript
// المنطق الحالي للنموذج
const payload = sendEmailSchema.parse(req.body);
// TODO: استدعاء this.emailService.send(payload)
this.sent(res, "mock-email-id-123", "smtp");
```

### المخطط المقترح (`email.schema.ts`)
```typescript
const sendEmailSchema = z.object({
    to: z.string().email(),
    subject: z.string().min(1),
    template: z.string().optional(),
    variables: z.record(z.any()).optional(),
});
```
