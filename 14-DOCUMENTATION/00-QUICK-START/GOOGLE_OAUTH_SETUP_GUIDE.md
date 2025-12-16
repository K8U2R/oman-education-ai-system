# 🔐 دليل إعداد Google OAuth

## 📋 نظرة عامة

تم إضافة تسجيل الدخول مع Google OAuth إلى النظام. هذا الدليل يوضح كيفية إعداد Google OAuth.

---

## 🚀 خطوات الإعداد

### 1. إنشاء Google OAuth Credentials

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. اذهب إلى **APIs & Services** > **Credentials**
4. اضغط **Create Credentials** > **OAuth client ID**
5. اختر **Web application**
6. أضف **Authorized redirect URIs**:
   - `http://localhost:3000/auth/oauth/google/callback` (للتنمية)
   - `https://yourdomain.com/auth/oauth/google/callback` (للإنتاج)
7. احفظ **Client ID** و **Client Secret**

---

### 2. تحديث ملفات .env

#### Backend (.env)
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/oauth/google/callback
```

#### Frontend (03-WEB-INTERFACE/frontend/.env)
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

### 3. تشغيل النظام

#### Backend
```bash
cd 01-OPERATING-SYSTEM
python -m api_gateway.fastapi_server
```

#### Frontend
```bash
cd 03-WEB-INTERFACE/frontend
npm run dev
```

---

## 🔄 سير العمل (Flow)

1. **المستخدم يضغط "تسجيل الدخول مع Google"**
2. **Frontend** يطلب URL من Backend: `GET /api/v1/auth/oauth/google/initiate`
3. **Backend** يُرجع Google OAuth URL مع state parameter
4. **Frontend** يُوجه المستخدم إلى Google
5. **المستخدم** يُوافق على Google
6. **Google** يُوجه المستخدم إلى: `/auth/oauth/google/callback?code=...&state=...`
7. **Frontend** يرسل code إلى Backend: `POST /api/v1/auth/oauth/google/callback`
8. **Backend** يتبادل code مع access token
9. **Backend** يحصل على معلومات المستخدم من Google
10. **Backend** يُرجع JWT token ومعلومات المستخدم
11. **Frontend** يحفظ token ويوجه المستخدم إلى `/chat`

---

## 📁 الملفات المُضافة/المُحدثة

### Backend
- ✅ `01-OPERATING-SYSTEM/api_gateway/routes/auth_routes.py` - Routes للمصادقة و OAuth
- ✅ `01-OPERATING-SYSTEM/api_gateway/fastapi_server.py` - إضافة auth_routes
- ✅ `01-OPERATING-SYSTEM/api_gateway/routes/__init__.py` - إضافة auth_routes

### Frontend
- ✅ `03-WEB-INTERFACE/frontend/src/services/auth/auth-service.ts` - إضافة Google OAuth methods
- ✅ `03-WEB-INTERFACE/frontend/src/pages/LoginPage.tsx` - إضافة أزرار OAuth
- ✅ `03-WEB-INTERFACE/frontend/src/pages/OAuthCallbackPage.tsx` - معالجة OAuth callback
- ✅ `03-WEB-INTERFACE/frontend/src/App.tsx` - إضافة OAuth callback routes
- ✅ `03-WEB-INTERFACE/frontend/src/services/api/endpoints.ts` - إضافة OAuth endpoints

---

## 🔒 الأمان

### State Parameter
- يتم إنشاء state عشوائي لكل طلب OAuth
- يتم التحقق من state في callback
- يحمي من CSRF attacks

### HTTPS
- **مهم جداً:** استخدم HTTPS في الإنتاج
- Google يتطلب HTTPS للـ redirect URIs في الإنتاج

---

## 🐛 استكشاف الأخطاء

### خطأ: "Google OAuth غير مُعد بشكل صحيح"
- تأكد من إضافة `GOOGLE_CLIENT_ID` و `GOOGLE_CLIENT_SECRET` إلى `.env`
- أعد تشغيل Backend بعد تحديث `.env`

### خطأ: "Invalid redirect_uri"
- تأكد من أن redirect URI في Google Console يطابق `GOOGLE_REDIRECT_URI` في `.env`
- يجب أن يكون مطابقاً تماماً (بما في ذلك http/https)

### خطأ: "Invalid state parameter"
- هذا يعني أن state لم يتم التحقق منه
- تأكد من أن Frontend يرسل state parameter في callback

---

## 📝 ملاحظات

- حالياً، يتم حفظ OAuth states في الذاكرة (في production، استخدم Redis)
- JWT tokens هي mock tokens (في production، استخدم JWT حقيقي)
- يجب ربط المستخدمين بـ database في production

---

## ✅ الحالة

- ✅ Google OAuth Backend routes
- ✅ Google OAuth Frontend integration
- ✅ OAuth callback handling
- ✅ Error handling
- ⚠️ يحتاج إلى Google OAuth credentials
- ⚠️ يحتاج إلى database integration (لحفظ المستخدمين)

---

**تاريخ الإنشاء:** $(date)  
**الحالة:** ✅ جاهز (يحتاج إلى credentials)

