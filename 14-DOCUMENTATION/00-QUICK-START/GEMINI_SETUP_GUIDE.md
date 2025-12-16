# 🚀 دليل إعداد Google Gemini API

## 📋 نظرة عامة

هذا الدليل يوضح كيفية إعداد وربط نظام المشروع مع Google Gemini API.

---

## 1️⃣ الحصول على Gemini API Key

### الخطوات:

1. **اذهب إلى Google AI Studio**
   - الرابط: https://makersuite.google.com/app/apikey
   - أو: https://aistudio.google.com/app/apikey

2. **سجل الدخول**
   - استخدم حساب Google الخاص بك

3. **إنشاء API Key جديد**
   - اضغط على "Create API Key"
   - اختر المشروع أو أنشئ مشروع جديد
   - انسخ المفتاح فوراً (لن تتمكن من رؤيته مرة أخرى)

4. **حفظ المفتاح بأمان**
   - ⚠️ **مهم:** لا تشارك المفتاح مع أي شخص
   - احفظه في مكان آمن

---

## 2️⃣ إعداد Backend (Python)

### تثبيت المكتبة المطلوبة

```bash
pip install google-generativeai>=0.3.0
```

أو من ملف requirements.txt:

```bash
pip install -r requirements.txt
```

### إعداد متغيرات البيئة

#### Windows (PowerShell)
```powershell
$env:GEMINI_API_KEY="your_api_key_here"
```

#### Linux/Mac
```bash
export GEMINI_API_KEY="your_api_key_here"
```

#### أو إنشاء ملف `.env`
```bash
# في مجلد المشروع الرئيسي
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

### اختبار التكامل

```bash
# من مجلد المشروع
python 17-EXTERNAL-INTEGRATIONS/ai-services/gemini-integration.py your_api_key_here
```

يجب أن ترى:
```
✅ تم تهيئة Gemini بنجاح
✅ الاتصال مع Gemini ناجح
الرد: [رد من Gemini]
```

---

## 3️⃣ إعداد Frontend (React)

### إنشاء ملف `.env`

في مجلد `03-WEB-INTERFACE/frontend/`:

```bash
# .env
VITE_AI_API_URL=http://localhost:8001/api/ai
VITE_AI_PROVIDER=gemini
VITE_AI_API_KEY=your_gemini_api_key_here
```

### ⚠️ ملاحظة مهمة

في بيئة الإنتاج، **لا تضع API Key في ملف `.env` في Frontend** لأنها ستكون مرئية للمستخدمين.

بدلاً من ذلك:
- استخدم Backend API فقط
- API Key يجب أن يكون في Backend فقط
- Frontend يرسل الطلبات إلى Backend بدون API Key

---

## 4️⃣ تشغيل النظام

### 1. تشغيل Backend

```bash
# من مجلد المشروع الرئيسي
cd 01-OPERATING-SYSTEM
python -m api_gateway.fastapi_server
```

أو:

```bash
uvicorn api_gateway.fastapi_server:app --host 0.0.0.0 --port 8001
```

الخادم سيعمل على: `http://localhost:8001`

### 2. تشغيل Frontend

```bash
# من مجلد Frontend
cd 03-WEB-INTERFACE/frontend
npm install
npm run dev
```

الواجهة ستعمل على: `http://localhost:3000`

---

## 5️⃣ اختبار API

### استخدام curl

```bash
# اختبار الاتصال
curl -X GET "http://localhost:8001/api/ai/test-connection?provider=gemini"

# إرسال رسالة
curl -X POST "http://localhost:8001/api/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "مرحباً، كيف حالك؟"}
    ],
    "provider": "gemini"
  }'
```

### استخدام Postman أو Thunder Client

1. **Endpoint:** `POST http://localhost:8001/api/ai/chat`
2. **Headers:** `Content-Type: application/json`
3. **Body:**
```json
{
  "messages": [
    {"role": "user", "content": "مرحباً، كيف حالك؟"}
  ],
  "provider": "gemini",
  "model": "gemini-1.5-pro",
  "temperature": 0.7
}
```

---

## 6️⃣ النماذج المتاحة

### Gemini Models

- **gemini-pro** - النموذج الأساسي
- **gemini-pro-vision** - مع دعم الصور
- **gemini-1.5-pro** - النموذج الأحدث والأقوى (موصى به)
- **gemini-1.5-flash** - أسرع وأخف

### الحصول على قائمة النماذج

```bash
curl -X GET "http://localhost:8001/api/ai/models?provider=gemini"
```

---

## 7️⃣ استخدام API في الكود

### Frontend (TypeScript)

```typescript
import { aiService } from '@/services/api/ai-service';

// تعيين Provider
aiService.setProvider('gemini');

// تعيين API Key (اختياري - يفضل استخدام Backend)
aiService.setApiKey('your_key_here');

// إرسال رسالة
const response = await aiService.sendMessage([
  { role: 'user', content: 'مرحباً' }
], {
  model: 'gemini-1.5-pro',
  temperature: 0.7
});

console.log(response.message);
```

### Backend (Python)

```python
from external_integrations.ai_services.gemini_integration import GeminiIntegration

# إنشاء instance
gemini = GeminiIntegration(api_key="your_api_key")

# إرسال رسالة
response = gemini.chat(
    messages=[
        {"role": "user", "content": "مرحباً"}
    ],
    model="gemini-1.5-pro",
    temperature=0.7
)

print(response['message'])
```

---

## 8️⃣ الأمان

### ✅ أفضل الممارسات

1. **لا تضع API Key في الكود**
   - استخدم متغيرات البيئة فقط
   - أضف `.env` إلى `.gitignore`

2. **استخدم Backend API فقط**
   - Frontend لا يجب أن يحتوي على API Key
   - جميع الطلبات تمر عبر Backend

3. **حدد الاستخدام**
   - استخدم Rate Limiting
   - راقب الاستخدام في Google Cloud Console

4. **احفظ المفاتيح بأمان**
   - استخدم Key Management Service
   - لا تشارك المفاتيح

---

## 9️⃣ حل المشاكل

### خطأ: "GEMINI_API_KEY not found"

**الحل:**
- تأكد من تعيين متغير البيئة
- تحقق من ملف `.env`
- أعد تشغيل الخادم

### خطأ: "API key not valid"

**الحل:**
- تحقق من صحة المفتاح
- تأكد من نسخ المفتاح كاملاً
- أنشئ مفتاح جديد إذا لزم الأمر

### خطأ: "Connection timeout"

**الحل:**
- تحقق من الاتصال بالإنترنت
- تحقق من جدار الحماية
- تأكد من أن Backend يعمل

---

## 🔟 الخطوات التالية

1. ✅ الحصول على API Key
2. ✅ إعداد Backend
3. ✅ إعداد Frontend
4. ✅ اختبار الاتصال
5. ✅ البدء في الاستخدام

---

## 📚 موارد إضافية

- **Google AI Studio:** https://aistudio.google.com/
- **Gemini API Documentation:** https://ai.google.dev/docs
- **Python SDK:** https://github.com/google/generative-ai-python

---

**تاريخ الإنشاء:** $(date)  
**الإصدار:** 1.0.0

