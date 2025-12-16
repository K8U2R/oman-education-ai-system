# 🌐 03-WEB-INTERFACE - واجهة الويب العامة

## 📋 نظرة عامة

هذا القسم يحتوي على واجهة الويب الكاملة لنظام التعليم الذكي العُماني، مبنية بـ **React 18**, **TypeScript**, و **Vite**.

## 🚀 البدء السريع

### التثبيت

```bash
# تثبيت جميع التبعيات
npm run setup

# أو تثبيت frontend فقط
npm run install:frontend
```

### التشغيل

```bash
# تشغيل في وضع التطوير
npm run dev
# أو
npm start

# التطبيق سيعمل على: http://localhost:3000
```

### البناء

```bash
# بناء للإنتاج
npm run build

# معاينة البناء
npm run preview
```

## 📁 هيكل المشروع

```
03-WEB-INTERFACE/
├── frontend/          # تطبيق React الرئيسي
│   ├── src/          # الكود المصدر
│   ├── public/       # ملفات عامة (PWA, SEO)
│   └── package.json  # تبعيات Frontend
├── backend-api/      # واجهة برمجة التطبيقات (يتم ربطها عبر 01-OPERATING-SYSTEM/api_gateway)
├── docs/             # التوثيق
├── config/           # إعدادات
└── package.json      # هذا الملف - scripts للتشغيل الموحد
```

## 🛠️ الأوامر المتاحة

### التطوير

```bash
npm run dev           # تشغيل في وضع التطوير
npm start             # نفس dev (alias)
npm run build         # بناء للإنتاج
npm run preview       # معاينة البناء
```

### الجودة

```bash
npm run lint          # فحص الكود
npm run lint:fix      # إصلاح أخطاء الكود
npm run format        # تنسيق الكود
npm run format:check  # فحص التنسيق
npm run type-check    # فحص الأنواع TypeScript
```

### الاختبارات

```bash
npm run test          # اختبارات الوحدات
npm run test:ui       # واجهة اختبارات
npm run test:coverage # تغطية الاختبارات
npm run test:e2e      # اختبارات E2E
npm run test:e2e:ui   # واجهة اختبارات E2E
```

### الأداء والتحليل

```bash
npm run build:analyze # تحليل حجم الحزم
npm run perf          # اختبار الأداء (Lighthouse)
npm run analyze       # تحليل الحزم
```

### الصيانة

```bash
npm run clean         # حذف node_modules و dist
npm run clean:all     # حذف كل شيء + package-lock.json
npm run setup         # إعداد جديد (تثبيت التبعيات)
```

## 📚 التوثيق

- [Frontend README](./frontend/README.md) - دليل شامل للـ Frontend
- [Quick Start Guide](./frontend/QUICK_START.md) - دليل البدء السريع
- [Usage Examples](./frontend/USAGE_EXAMPLES.md) - أمثلة الاستخدام
- [Improvements](./frontend/IMPROVEMENTS.md) - التحسينات المنفذة
- [Integration Complete](./frontend/INTEGRATION_COMPLETE.md) - تكامل PWA و Sentry

## ⚙️ الإعداد

### متغيرات البيئة

1. انسخ `.env.example` إلى `.env`:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. أو استخدم السكريبت التلقائي:
   ```bash
   # من المجلد الرئيسي للمشروع
   python create_env_files.py
   ```

3. عدّل القيم في `.env` حسب الحاجة

### المتغيرات المهمة

```env
VITE_API_BASE_URL=http://localhost:8001
VITE_SENTRY_DSN=your-sentry-dsn-here  # اختياري
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
```

## 🎯 الميزات

- ✅ **PWA كامل** - تطبيق ويب تقدمي مع دعم Offline
- ✅ **SEO محسن** - Meta Tags, Sitemap, Robots.txt
- ✅ **أداء عالي** - Code Splitting, Lazy Loading
- ✅ **معالجة أخطاء** - Error Handler مع Sentry
- ✅ **دعم RTL** - واجهة عربية كاملة
- ✅ **TypeScript** - نوع آمن 100%

## 🐛 حل المشاكل

### خطأ في التبعيات

```bash
npm run clean
npm run install:all
```

### خطأ في الاتصال بالـ API

- تأكد من تشغيل Backend على المنفذ 8001
- تحقق من `VITE_API_BASE_URL` في `frontend/.env`
- أعد تشغيل dev server بعد تغيير `.env`

### خطأ في TypeScript

```bash
npm run type-check
```

## 📊 مقاييس الأداء

بعد تطبيق جميع التحسينات:

| المقياس | الهدف | الحالة |
|---------|-------|--------|
| First Contentful Paint | <1.0s | ✅ |
| Largest Contentful Paint | <2.0s | ✅ |
| Time to Interactive | <2.5s | ✅ |
| Bundle Size | <300KB | ✅ |
| Cumulative Layout Shift | <0.05 | ✅ |

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ branch للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

## 📄 الترخيص

هذا المشروع جزء من نظام التعليم الذكي العُماني.

---

**آخر تحديث:** 2024-01-15

